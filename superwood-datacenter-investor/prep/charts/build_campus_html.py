# Rebuilds the slide 6 chart block (both decks) from analyses/material_split.json. Run from the deck folder.
import re, json, math
def R(p): return open(p).read()
def W(p,s): open(p,"w").write(s)
_d=json.load(open("analyses/material_split.json")); SPLIT=_d["split"]; HZ=_d["horizon"]; F={"steel":1.8,"concrete":0.12,"plastic":3.0}
HORDER=["imm","soon","med","long"]
def cum(name):
    """cumulative substitutable share by horizon: the row's share from its horizon onward"""
    h=HZ[name]["horizon"]; s=HZ[name]["share"]
    return [s if (h is not None and HORDER.index(h)<=j) else 0.0 for j in range(4)]
def bubbles(c):
    return '<span class="hz">'+''.join(f'<i style="--p:{p*100:.0f}" title="{p*100:.0f}%"></i>' for p in c)+'</span>'
HZ_HEAD='<div class="hb hzh"><span class="hl"></span><div></div><span class="hv">Substitutable with wood, % of potential</span><span class="hz"><b>Now</b><b>Soon</b><b>Med</b><b>Long</b></span></div>\n'
ROWS=[("Platforms, walkways, mezzanines, railings",15),("Acoustic barriers, enclosures, separations",5),("Racking and equipment supports",5),("Tray, containment, doors, misc. metals",10),("Ducting and air-distribution sheet metal",8),("Interior finishes, backplanes, trim",3),("Electrical equipment and conductors",100),("Mechanical equipment, piping, loop water",50),("IT — servers and racks",70),
("Steel — primary frame",40),("Steel — roof trusses, joists, deck, girts",60),("Exterior skins — metal panel",7.4),("Louvers, screens and fencing",1.9),
("Concrete — slab on grade, paving",1200),("Concrete — foundations, footings, pads",1200),("Rebar in all concrete",100)]
GROUPS=[("Contents — fit-out and equipment",9),("Building — structure and envelope",4),("Foundation — slab, footings, rebar",3)]
MATS=("steel","concrete","plastic","other"); COL={"steel":"var(--wood)","concrete":"#8c8478","plastic":"var(--teal)","other":"#5a4a36"}
CAX=500.0
def pct_mass(kt): return 8.0+26.45*math.log10(kt)
def mass_bar(kt,sp):
    total=pct_mass(kt); left=0; segs=""
    for mat,share in zip(MATS,sp):
        if share<=0: continue
        w=total*share; segs+=f'<i class="rp" style="left:{left:.1f}%;width:{w:.1f}%;background:{COL[mat]}"></i>'; left+=w
    return segs
def carb_parts(kt,sp): return [("steel",kt*sp[0]*1.8),("concrete",kt*sp[1]*0.12),("plastic",kt*sp[2]*3.0)]
def carb_bar(parts):
    left=0; segs=""
    for mat,v in parts:
        if v<=0: continue
        segs+=f'<i class="rp" style="left:{left:.1f}%;width:{v/CAX*100:.1f}%;background:{COL[mat]}"></i>'; left+=v/CAX*100
    return segs
def rows_html(view):
    out=HZ_HEAD; i=0
    for title,n in GROUPS:
        grp=ROWS[i:i+n]; gk=sum(kt for _,kt in grp); gsp=[sum(kt*SPLIT[nm][j] for nm,kt in grp)/gk for j in range(4)]
        gc=[sum(kt*cum(nm)[j] for nm,kt in grp)/gk for j in range(4)]
        if view=="mass": out+=f'<div class="hb hd"><span class="hl">{title}</span><div class="tr">{mass_bar(gk,gsp)}</div><span class="hv"><b>{gk*1000:,.0f} tons</b></span>{bubbles(gc)}</div>\n'
        else:
            gparts=[(m,sum(kt*SPLIT[nm][j]*F[m] for nm,kt in grp)) for j,m in enumerate(("steel","concrete","plastic"))]; gt=sum(v for _,v in gparts)
            out+=f'<div class="hb hd"><span class="hl">{title}</span><div class="tr">{carb_bar(gparts)}</div><span class="hv"><b>{gt*1000:,.0f} tons CO₂e</b></span>{bubbles(gc)}</div>\n'
        for name,kt in grp:
            sp=SPLIT[name]
            if view=="mass": out+=f'<div class="hb"><span class="hl">{name}</span><div class="tr">{mass_bar(kt,sp)}</div><span class="hv">{kt*1000:,.0f} tons</span>{bubbles(cum(name))}</div>\n'
            else:
                parts=carb_parts(kt,sp); tot=sum(v for _,v in parts); tag=" <em>other materials not valued</em>" if sp[3]>=0.3 else ""
                out+=f'<div class="hb"><span class="hl">{name}</span><div class="tr">{carb_bar(parts)}</div><span class="hv">{tot*1000:,.0f} tons CO₂e{tag}</span>{bubbles(cum(name))}</div>\n'
        i+=n
    return out
AX_M='<div class="hb ax"><span class="hl"></span><div class="tr ticks"><span style="left:8.0%">1</span><span style="left:34.4%">10</span><span style="left:60.9%">100</span><span style="left:87.4%">1,000</span></div><span class="hv">\'000s of tons, log scale</span><span></span></div>'
AX_C='<div class="hb ax"><span class="hl"></span><div class="tr ticks"><span style="left:0%">0</span><span style="left:20%">100</span><span style="left:40%">200</span><span style="left:60%">300</span><span style="left:80%">400</span><span style="left:100%">500</span></div><span class="hv">\'000s of tons CO₂e</span><span></span></div>'
LEG_M='<div class="hleg mats"><span><i style="background:var(--wood)"></i>Steel</span><span><i style="background:#8c8478"></i>Concrete</span><span><i style="background:var(--teal)"></i>Plastic</span><span><i style="background:#5a4a36"></i>Other: copper, aluminum, water, gypsum, wood, electronics</span><span class="muted">Bar length is mass on a log scale; segments show each material\'s share</span></div>'
LEG_C='<div class="hleg mats"><span><i style="background:var(--wood)"></i>Steel at 1.8 kg CO₂e/kg</span><span><i style="background:#8c8478"></i>Concrete at 0.12</span><span><i style="background:var(--teal)"></i>Polymers at an average 3.0</span><span class="muted">Other materials not valued</span></div>'
def rebuild(path):
    h=R(path); a=h.index('<section id="campus"'); b=h.index('</section>',a); sec=h[a:b]
    notes_m=re.search(r'<div class="view" id="view-mass-notes".*?</p></div></div></div>',sec,re.S).group(0)
    notes_c=re.search(r'<div class="view" id="view-carbon-notes".*?</p></div></div></div>',sec,re.S).group(0)
    s0=sec.index('<div class="split rv"'); s1=sec.index('<p class="note rv">')
    block=f'''<div class="split rv" style="grid-template-columns:1.7fr 1fr;align-items:center">
      <div class="chartcol">
        <div class="view" id="view-mass" role="tabpanel" aria-labelledby="tab-mass" data-view="mass"><div class="hbars det">
{rows_html("mass")}{AX_M}
</div>{LEG_M}</div>
        <div class="view" id="view-carbon" role="tabpanel" aria-labelledby="tab-carbon" data-view="carbon" hidden><div class="hbars det">
{rows_html("carbon")}{AX_C}
</div>{LEG_C}</div>
      </div>
      <div>
        {notes_m}
        {notes_c}
      </div>
    </div>
    '''
    sec=sec[:s0]+block+sec[s1:]; W(path,h[:a]+sec+h[b:]); print(path,"divs",sec.count("<div"),sec.count("</div>"))
for p in ("slides.html","v2.html"): rebuild(p)
