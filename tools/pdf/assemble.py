"""Assemble the final PDF: slide pages + Notes and References pages, images recompressed.

    assemble.py <deck-dir> <work-dir> <out.pdf> <slide-count>

Notes pages are laid out by measuring every heading and item at column width in headless Chrome
(after web fonts are ready) and packing them greedily into two columns per page. CSS multicol
was not used because a full page overflowed sideways instead of breaking.
"""
import glob, html, json, os, re, subprocess, sys
from PIL import Image
from pypdf import PdfReader, PdfWriter

deck, work, out, count = sys.argv[1], sys.argv[2], sys.argv[3], int(sys.argv[4])
CH = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
PAGE = "@page{size:15in 8.4375in;margin:0}"


def print_pdf(src_html, dest):
    subprocess.run([CH, "--headless=new", "--disable-gpu", "--no-pdf-header-footer", "--virtual-time-budget=8000",
                    f"--print-to-pdf={dest}", "file://" + src_html], capture_output=True)


vecs = sorted(glob.glob(f"{work}/vec/[0-9][0-9]-*.pdf"))
assert len(vecs) == count, f"{len(vecs)} slide pages, expected {count}"

# ---- Notes and References -------------------------------------------------------------------
j = json.load(open(f"{work}/notes.json"))
esc = html.escape
units = []  # (kind, markup)
for sec in j["notes"]:
    units.append(("h3", f'<h3><span class="n">{sec["n"]:02d}</span>{esc(sec["title"])}</h3>'))
    if sec["tips"]:
        units.append(("h4", "<h4>Notes</h4>"))
        units += [("li", f'<li><b>{esc(t["term"])}</b> — {esc(t["tip"])}</li>') for t in sec["tips"]]
    if sec["src"]:
        units.append(("h4", "<h4>References</h4>"))
        units += [("li", f'<li>{esc(x["text"])}' + (f' <span class="u">{esc(x["href"])}</span>' if x["href"] else "") + "</li>")
                  for x in sec["src"]]

CSS = PAGE + """
html,body{margin:0;background:#150e08;color:#e8dcc6}
body{font-family:Inter,sans-serif;font-size:11pt;line-height:1.5}
.page{width:15in;height:8.4375in;box-sizing:border-box;padding:.6in .8in .55in;break-after:page;display:grid;grid-template-columns:1fr 1fr;column-gap:.5in;grid-template-rows:auto 1fr;align-content:start}
.head{grid-column:1/-1;margin-bottom:.18in}
h2{font-family:Fraunces,serif;font-weight:340;font-size:27pt;margin:0;color:#f3e9d6}h2 em{font-style:italic;color:#e2b877}
.k{font-family:Inter;font-weight:600;font-size:7.5pt;letter-spacing:.2em;text-transform:uppercase;color:#cda165;margin-bottom:.08in}
.col{min-width:0}
h3{font-family:Fraunces,serif;font-weight:400;font-size:15pt;color:#f3e9d6;margin:.22in 0 .08in;border-bottom:1px solid rgba(226,184,119,.35);padding-bottom:.06in}.col>h3:first-child{margin-top:0}
h3 .n{color:#e2b877;font-family:Fraunces,serif;font-weight:500;font-size:16pt;margin-right:.14in;font-variant-numeric:tabular-nums}
h4{font-family:Inter;font-weight:600;font-size:8pt;letter-spacing:.2em;text-transform:uppercase;color:#cda165;margin:.12in 0 .06in}
ul{margin:0;padding-left:1.1em}li{margin:0 0 .1in;color:#d9ccb6}b{color:#f3e9d6;font-weight:600}
.u{display:block;color:#9c8a70;font-size:8.5pt;margin-top:.02in;word-break:break-all}
.m{width:calc((15in - 1.6in - .5in)/2);padding:0 0 0 1.1em;box-sizing:border-box;list-style:disc}
"""
FONTS = ('<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..400;'
         '1,9..144,300..400&family=Inter:wght@400;600&display=swap">')

# measure every unit at column width, after the fonts are ready
meas = FONTS + "<style>" + CSS + "</style>" + "".join(
    f'<div class="m">' + (u[1] if u[0] != "li" else '<ul style="padding:0">' + u[1] + "</ul>") + "</div>" for u in units)
meas += ('<script>document.fonts.ready.then(()=>setTimeout(()=>{const p=document.createElement("pre");p.id="OUT";'
         'p.textContent=JSON.stringify([...document.querySelectorAll(".m")].map(m=>m.getBoundingClientRect().height));'
         'document.body.appendChild(p);},400));</script>')
open(f"{work}/notes-measure.html", "w").write(meas)
dom = subprocess.run([CH, "--headless=new", "--disable-gpu", "--hide-scrollbars", "--window-size=1400,900",
                      "--virtual-time-budget=6000", "--dump-dom", f"file://{work}/notes-measure.html"],
                     capture_output=True, text=True).stdout
hs = [h * 1.06 for h in json.loads(html.unescape(re.search(r'<pre id="OUT">(.*?)</pre>', dom, re.S).group(1)))]

colH = (8.4375 - .6 - .55) * 96
headH = 105
H3GAP = 0.22 * 96
pages, cols, col, h, first, i = [], [], [], 0, True, 0
limit = lambda: colH - (headH if first else 0)
while i < len(units):
    kind = units[i][0]
    need = hs[i]
    if kind in ("h3", "h4"):            # a heading run (h3, h4) stays with its first item
        jx = i
        while jx + 1 < len(units) and units[jx + 1][0] != "li":
            jx += 1
        need = sum(hs[i:jx + 2]) + (H3GAP if kind == "h3" and col else 0)
    if h + need > limit() and col:
        cols.append(col); col = []; h = 0
        if len(cols) == 2:
            pages.append(cols); cols = []; first = False
    col.append(units[i]); h += hs[i] + (H3GAP if units[i][0] == "h3" and len(col) > 1 else 0); i += 1
if col: cols.append(col)
if cols: pages.append(cols)


def render_col(c):
    o, open_ul = "", False
    for kind, m in c:
        if kind == "li":
            if not open_ul: o += "<ul>"; open_ul = True
            o += m
        else:
            if open_ul: o += "</ul>"; open_ul = False
            o += m
    return o + ("</ul>" if open_ul else "")


body = ""
for pi, pg in enumerate(pages):
    head = ('<div class="head"><div class="k">Appendix</div><h2>Notes <em>and references</em></h2></div>' if pi == 0
            else '<div class="head"><div class="k">Appendix · Notes and references, continued</div></div>')
    body += '<div class="page">' + head + "".join(f'<div class="col">{render_col(c)}</div>' for c in pg) + "</div>"
open(f"{work}/notes.html", "w").write(FONTS + "<style>" + CSS + "</style>" + body)
print_pdf(f"{work}/notes.html", f"{work}/notes.pdf")
print("notes pages", len(pages), "units", len(units))

# ---- merge, recompress, write ---------------------------------------------------------------
w = PdfWriter()
for v in vecs:
    w.add_page(PdfReader(v).pages[0])
for p in PdfReader(f"{work}/notes.pdf").pages[:len(pages)]:   # Chrome adds a blank page after the last break
    w.add_page(p)

# Chrome stores some photos losslessly at native size; cap them at 2400px and JPEG q82
saved = 0
for p in w.pages:
    for im in p.images:
        try:
            pil = im.image
        except Exception:
            continue
        raw = len(im.data)
        if raw < 80000:
            continue
        if pil.mode != "RGB":
            pil = pil.convert("RGB")
        if max(pil.size) > 2400:
            s_ = 2400 / max(pil.size)
            pil = pil.resize((round(pil.width * s_), round(pil.height * s_)), Image.LANCZOS)
        im.replace(pil, quality=82)
        saved += raw - len(im.data)
print("images recompressed, saved MB", round(saved / 1e6, 1))

w.add_metadata({"/Title": os.path.splitext(os.path.basename(out))[0], "/Author": "InventWood"})
w.write(out)
r = PdfReader(out)
print("pages", len(r.pages), "size MB", round(os.path.getsize(out) / 1e6, 1), "->", out)
