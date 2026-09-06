# Rebuilds the slide 6 chart block (both decks) from analyses/material_split.json and analyses/scenarios.json,
# and wires the soils slider (good / moderate / poor) on slides 6 and 7. Run from the deck folder.
import re, json, math
def R(p): return open(p).read()
def W(p,s): open(p,"w").write(s)
_d=json.load(open("analyses/material_split.json")); SPLIT=_d["split"]; HZ=_d["horizon"]; F={"steel":1.8,"concrete":0.12,"plastic":3.0}
SC=json.load(open("analyses/scenarios.json")); CASES=["good","moderate","poor"]; DEFAULT="moderate"
HORDER=["imm","soon","med","long"]
def cum(name):
    e=HZ[name]; steps=e.get("steps") or ([{"horizon":e["horizon"],"share":e["share"]}] if e.get("horizon") else [])
    return [sum(s["share"] for s in steps if HORDER.index(s["horizon"])<=j) for j in range(4)]
def bubbles(c): return '<span class="hz">'+''.join(f'<i style="--p:{p*100:.0f}" title="{p*100:.0f}%"></i>' for p in c)+'</span>'
HZ_HEAD='<div class="hb hzh"><span class="hl"></span><div></div><span class="hv">Substitutable with wood, % of potential</span><span class="hz"><b>Now</b><b>Soon</b><b>Med</b><b>Long</b></span></div>\n'
CONC={"Concrete — slab on grade, paving":"slab","Concrete — foundations, footings, pads":"foundations","Rebar in all concrete":"rebar"}
def rows_for(case):
    sc=SC[case]
    return [("Platforms, walkways, mezzanines, railings",15),("Acoustic barriers, enclosures, separations",5),("Racking and equipment supports",5),("Tray, containment, doors, misc. metals",10),("Ducting and air-distribution sheet metal",8),("Interior finishes, backplanes, trim",3),("Electrical equipment and conductors",100),("Mechanical equipment, piping, loop water",50),("IT — servers and racks",70),
    ("Steel — primary frame",40),("Steel — roof trusses, joists, deck, girts",60),("Exterior skins — metal panel",7.4),("Louvers, screens and fencing",1.9),
    ("Concrete — slab on grade, paving",sc["slab"]["t_hi"]/1000),("Concrete — foundations, footings, pads",sc["foundations"]["t_hi"]/1000),("Rebar in all concrete",sc["rebar"]["t_hi"]/1000)]
GROUPS=[("Contents — fit-out and equipment",9,"contents"),("Building — structure and envelope",4,"building"),("Foundation — slab, footings, rebar",3,"foundation")]
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
def group_cells(grp,view):
    gk=sum(kt for _,kt in grp); gsp=[sum(kt*SPLIT[nm][j] for nm,kt in grp)/gk for j in range(4)]
    gc=[sum(kt*cum(nm)[j] for nm,kt in grp)/gk for j in range(4)]
    if view=="mass": return mass_bar(gk,gsp), f"<b>{gk*1000:,.0f} tons</b>", gc
    gparts=[(m,sum(kt*SPLIT[nm][j]*F[m] for nm,kt in grp)) for j,m in enumerate(("steel","concrete","plastic"))]; gt=sum(v for _,v in gparts)
    return carb_bar(gparts), f"<b>{gt*1000:,.0f} tons CO₂e</b>", gc
def row_cells(name,kt,view):
    sp=SPLIT[name]
    if view=="mass": return mass_bar(kt,sp), f"{kt*1000:,.0f} tons"
    parts=carb_parts(kt,sp); tot=sum(v for _,v in parts); tag=" <em>other materials not valued</em>" if sp[3]>=0.3 else ""
    return carb_bar(parts), f"{tot*1000:,.0f} tons CO₂e{tag}"
def rows_html(view,case=DEFAULT):
    ROWS=rows_for(case); out=HZ_HEAD; i=0
    for title,n,gid in GROUPS:
        grp=ROWS[i:i+n]; bar,hv,gc=group_cells(grp,view)
        attr=f' data-row="group-{gid}"' if gid=="foundation" else ""
        out+=f'<div class="hb hd"{attr}><span class="hl">{title}</span><div class="tr">{bar}</div><span class="hv">{hv}</span>{bubbles(gc)}</div>\n'
        for name,kt in grp:
            bar,hv=row_cells(name,kt,view); attr=f' data-row="{CONC[name]}"' if name in CONC else ""
            out+=f'<div class="hb"{attr}><span class="hl">{name}</span><div class="tr">{bar}</div><span class="hv">{hv}</span>{bubbles(cum(name))}</div>\n'
        i+=n
    return out
def scenario_data():
    """per soil case: the bar and value cells of the three concrete rows and the foundation subtotal, both views, plus slide 7's long-term row"""
    data={}
    for case in CASES:
        ROWS=rows_for(case); grp=ROWS[13:16]; d={}
        for view in ("mass","carbon"):
            bar,hv,gc=group_cells(grp,view); d[f"group-foundation:{view}"]={"tr":bar,"hv":hv,"hz":bubbles(gc)}
            for name,kt in grp:
                bar,hv=row_cells(name,kt,view); d[f"{CONC[name]}:{view}"]={"tr":bar,"hv":hv}
        lt=SC[case]["long_term"]; lo,hi=lt["sw_lo"],lt["sw_hi"]; ylo,yhi=lt["yr_lo"],lt["yr_hi"]
        fmt=lambda v: f"{round(v,-3):,.0f}"
        yr=f"{ylo:.1f}–{yhi:.0f}" if yhi>=10 else f"{ylo:.1f}–{yhi:.1f}"
        d["worth"]={"sw":f"{fmt(lo)}–{fmt(hi)} tons","yr":f"{yr} years of SuperMill Two","left":f"{min(ylo,12)/12*100:.1f}%","width":f"{max(min(yhi,12)-ylo,0.2)/12*100:.1f}%"}
        data[case]=d
    return data
AX_M='<div class="hb ax"><span class="hl"></span><div class="tr ticks"><span style="left:8.0%">1,000</span><span style="left:34.4%">10,000</span><span style="left:60.9%">100,000</span><span style="left:87.4%;transform:translateX(-60%)">1,000,000</span></div><span class="hv">tons, log scale</span><span></span></div>'
AX_C='<div class="hb ax"><span class="hl"></span><div class="tr ticks"><span style="left:0%">0</span><span style="left:20%">100,000</span><span style="left:40%">200,000</span><span style="left:60%">300,000</span><span style="left:80%">400,000</span><span style="left:100%;transform:translateX(-100%)">500,000</span></div><span class="hv">tons CO₂e</span><span></span></div>'
LEG_M='<div class="hleg mats"><span><i style="background:var(--wood)"></i>Steel</span><span><i style="background:#8c8478"></i>Concrete</span><span><i style="background:var(--teal)"></i>Plastic</span><span><i style="background:#5a4a36"></i>Other: copper, aluminum, water, gypsum, wood, electronics</span><span class="muted">Bar length is mass on a log scale; segments show each material\'s share</span></div>'
LEG_C='<div class="hleg mats"><span><i style="background:var(--wood)"></i>Steel at 1.8 kg CO₂e/kg</span><span><i style="background:#8c8478"></i>Concrete at 0.12</span><span><i style="background:var(--teal)"></i>Polymers at an average 3.0</span><span class="muted">Other materials not valued</span></div>'
SLIDER='<label class="soils"><span class="lab">Soils</span><input type="range" class="soils-range" min="1" max="3" step="1" value="2" aria-valuetext="Moderate" aria-label="Soil conditions for foundations"><output class="soils-out">Moderate</output></label>'
def rebuild(path):
    h=R(path); a=h.index('<section id="campus"'); b=h.index('</section>',a); sec=h[a:b]
    li_m=re.search(r'<div class="view" id="view-mass-notes"[^>]*>(<div class="li".*?</p></div></div>)',sec,re.S).group(1)
    li_c=re.search(r'<div class="view" id="view-carbon-notes"[^>]*>(<div class="li".*?</p></div></div>)',sec,re.S).group(1)
    foot=re.search(r'<p class="note rv">.*?</p>',sec,re.S).group(0)
    if "footprint basis" not in foot:
        foot=foot.replace("Steel share: company estimate;","Concrete: footprint bottom-up (slab, footings, pads, paving, yard mats) with a soils slider; moderate soils by default; the published 500–1,000 m³/MW intensity is the upper comparison. Steel share: company estimate;")
    s0=sec.index('<div class="split rv'); s1=sec.rindex('</div>')
    block=f'''<div class="split rv campus" style="grid-template-columns:2.6fr 1fr;align-items:stretch">
      <div class="chartcol">
        <div class="view" id="view-mass" role="tabpanel" aria-labelledby="tab-mass" data-view="mass"><div class="hbars det">
{rows_html("mass")}{AX_M}
</div></div>
        <div class="view" id="view-carbon" role="tabpanel" aria-labelledby="tab-carbon" data-view="carbon" hidden><div class="hbars det">
{rows_html("carbon")}{AX_C}
</div></div>
      </div>
      <div class="sidecol">
        <div class="view" id="view-mass-notes" role="tabpanel" aria-labelledby="tab-mass" data-view="mass">{li_m}{LEG_M}</div>
        <div class="view" id="view-carbon-notes" role="tabpanel" aria-labelledby="tab-carbon" data-view="carbon" hidden>{li_c}{LEG_C}</div>
        {SLIDER}
        {foot}
      </div>
    </div>
  '''
    sec=sec[:s0]+block+sec[s1:]
    # the toggle row carries no slider; it lives in the side column (above)
    h=h[:a]+sec+h[b:]
    # slide 7: long-term row and a second slider
    a=h.index('<section id="worth"'); b=h.index('</section>',a); sec=h[a:b]
    w=scenario_data()[DEFAULT]["worth"]
    sec=re.sub(r'<td data-h="Horizon">Long term — slab, foundations</td><td data-h="SUPERWOOD required">[^<]*</td><td class="gold" data-h="Years of mill output"><div class="yrbar"><i style="[^"]*"></i><b style="left:8.3%"></b></div>[^<]*</td>',
        f'<td data-h="Horizon">Long term — slab, foundations</td><td data-h="SUPERWOOD required" data-worth="sw">{w["sw"]}</td><td class="gold" data-h="Years of mill output"><div class="yrbar"><i data-worth="bar" style="left:{w["left"]};width:{w["width"]}"></i><b style="left:8.3%"></b></div><span data-worth="yr">{w["yr"]}</span></td>',sec)
    if 'class="soils"' not in sec:
        sec=sec.replace('<div class="hleg mills rv">','<div class="hleg mills rv">'+SLIDER.replace('<label class="soils">','<label class="soils inline">'),1)
    h=h[:a]+sec+h[b:]
    # data + JS
    data=json.dumps(scenario_data(),ensure_ascii=False)
    h=re.sub(r'<script type="application/json" id="soilData">.*?</script>\n','',h,flags=re.S)
    h=re.sub(r'/\* soils slider \*/.*?/\* end soils \*/\n','',h,flags=re.S)
    js='''/* soils slider */
const soilData=JSON.parse(document.getElementById('soilData').textContent);const soilNames={1:'good',2:'moderate',3:'poor'},soilLabels={1:'Good',2:'Moderate',3:'Poor'};
function applySoil(v){const d=soilData[soilNames[v]];if(!d)return;
  document.querySelectorAll('#campus [data-row]').forEach(row=>{const view=row.closest('.view').dataset.view;const cell=d[row.dataset.row+':'+view];if(!cell)return;row.querySelector('.tr').innerHTML=cell.tr;row.querySelector('.hv').innerHTML=cell.hv;if(cell.hz)row.querySelector('.hz').outerHTML=cell.hz;});
  const w=d.worth;const sw=document.querySelector('[data-worth="sw"]'),yr=document.querySelector('[data-worth="yr"]'),bar=document.querySelector('[data-worth="bar"]');if(sw){sw.textContent=w.sw;yr.textContent=w.yr;bar.style.left=w.left;bar.style.width=w.width;}
  document.querySelectorAll('.soils-range').forEach(r=>{r.value=v;r.setAttribute('aria-valuetext',soilLabels[v]);r.closest('.soils').querySelector('.soils-out').textContent=soilLabels[v];});}
document.querySelectorAll('.soils-range').forEach(r=>r.addEventListener('input',e=>applySoil(+e.target.value)));
addEventListener('keydown',e=>{if(e.metaKey||e.ctrlKey||e.altKey)return;if(!['campus','worth'].includes(secs[cur]&&secs[cur].id))return;if(e.key==='g'||e.key==='G')applySoil(1);if(e.key==='p'||e.key==='P')applySoil(3);if(e.key==='o'||e.key==='O')applySoil(2);});
/* end soils */
'''
    h=h.replace("</script>\n</body>",js+"</script>\n</body>",1)
    h=h.replace("</body>",f'<script type="application/json" id="soilData">{data}</script>\n</body>',1)
    if ".soils{" not in h:
        h=h.replace("/* dividers */",".soils{display:flex;align-items:center;gap:.7rem;margin-top:1.2rem;font-size:max(.85rem,12px);color:var(--cream)}.soils .lab{font-size:max(.66rem,11px);letter-spacing:.14em;text-transform:uppercase;color:var(--wood-bright);font-weight:600}.soils input{accent-color:var(--gold);width:9rem;cursor:pointer}.soils input:focus-visible{outline:2px solid var(--gold);outline-offset:3px;border-radius:2px}.soils-out{min-width:5rem;color:var(--gold);font-weight:600}.soils.inline{display:inline-flex;margin:0 0 0 2rem;vertical-align:middle}\n/* dividers */",1)
    W(path,h); print(path,"divs",sec.count("<div"),sec.count("</div>"),"ok")
for p in ("slides.html","v2.html"): rebuild(p)
