"""Collect the deck's hover tips and source panels into <work>/notes.json for the Notes pages.

Runs headless Chrome over the deck with every section shown and export mode on, then reads:
  .sw-ref > .sw-tip        hover tips (term = the ref's own text, tip = the popup)
  .mtworld figure .why     the (i) notes on photo grids (term = the figcaption)
  .srcpanel li             source lists behind the Sources pill (text + first link)
Hidden elements return no innerText, so text comes from innerHTML with tags stripped and
entities decoded through a textarea. Numbers are the deck's own 1-based section order.
"""
import html, json, re, subprocess, sys

deck, work = sys.argv[1], sys.argv[2]
CH = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
src = open(f"{deck}/slides.html", encoding="utf-8").read()
probe = src + r"""
<style>section{display:block!important}</style>
<script>document.documentElement.classList.add('exporting');document.body.classList.remove('on-cover');
setTimeout(()=>{
 const secs=[...document.querySelectorAll('section')].filter(s=>!s.closest('template'));
 const nums={};let n=0;secs.forEach(s=>{nums[s.id]=++n;});
 const ta=document.createElement('textarea');
 const txt=el=>{ta.innerHTML=el.innerHTML.replace(/<[^>]+>/g,' ');return ta.value;};
 const clean=t=>t.replace(/\s+/g,' ').replace(/\s([,.;:%])/g,'$1').trim();
 const out=secs.map(s=>{
  const tips=[...s.querySelectorAll('.sw-ref')].map(r=>{const tip=r.querySelector('.sw-tip');if(!tip)return null;
    const term=clean([...r.childNodes].filter(x=>x!==tip).map(x=>x.textContent).join(' '));return {term,tip:clean(txt(tip))};}).filter(Boolean);
  [...s.querySelectorAll('.mtworld figure .why')].forEach(w=>{const cap=w.closest('figure').querySelector('figcaption');tips.push({term:cap?clean(cap.textContent):'',tip:clean(txt(w))});});
  const src=[...s.querySelectorAll('.srcpanel li')].map(li=>{const a=li.querySelector('a');return {href:a?a.href:'',text:clean(txt(li))};});
  const h=s.querySelector('h2');return {id:s.id,n:nums[s.id],title:h?clean(h.textContent):(s.dataset.nav||s.id),tips,src};
 }).filter(x=>x.tips.length||x.src.length);
 const pre=document.createElement('pre');pre.id='OUT';pre.textContent=JSON.stringify({notes:out});document.body.appendChild(pre);},3500);</script>
"""
open(f"{deck}/_notes_probe.html", "w", encoding="utf-8").write(probe)
dom = subprocess.run([CH, "--headless=new", "--disable-gpu", "--hide-scrollbars", "--window-size=1440,897",
                      "--virtual-time-budget=8000", "--dump-dom", f"file://{deck}/_notes_probe.html"],
                     capture_output=True, text=True).stdout
import os; os.remove(f"{deck}/_notes_probe.html")
m = re.search(r'<pre id="OUT">(.*?)</pre>', dom, re.S)
if not m:
    sys.exit("notes probe produced no output (a script error in the deck?)")
data = json.loads(html.unescape(m.group(1)))
json.dump(data, open(f"{work}/notes.json", "w"), indent=1)
print("notes:", [(x["id"], x["n"], len(x["tips"]), len(x["src"])) for x in data["notes"]])
