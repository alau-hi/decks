# Brand-palette charts for the investor companion deck. Rendered as PNG (Keynote drops native line charts).
# Run: <py312 venv>/bin/python prep/charts/make_charts.py   (from the deck folder)
import matplotlib; matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import Patch
INK="#1f150c"; PANEL="#261a0f"; CREAM="#f4ecdf"; DIM="#cdbfa9"; MUTED="#9d8d76"; WOOD="#b87d44"; BRIGHT="#cda165"; GOLD="#e2b877"
GREEN="#8fb356"; TEAL="#5ea9a2"; ROSE="#c9706b"; NR="#3a2b1a"
plt.rcParams.update({"font.family":"DejaVu Sans","text.color":CREAM,"axes.labelcolor":DIM,"xtick.color":DIM,"ytick.color":DIM,"axes.edgecolor":NR,"font.size":11})
def clean(a):
    a.set_facecolor(INK); [a.spines[s].set_visible(False) for s in ("top","right","left")]; a.tick_params(length=0)

# ---- Charts 1 & 4: campus mass and embodied carbon, same rows (wide for web; narrow two-up for the PPTX) ----
# Data: analyses/materials-mass-and-replacement.md (v4, 2026-09-01). kt per 1 GW, high case; replaceable share; horizon.
rows=[("Platforms, walkways, mezzanines, railings",15,1.0,"soon"),("Acoustic barriers, enclosures, separations",5,1.0,"soon"),
("Racking and equipment supports",5,1.0,"soon"),("Tray, containment, doors, misc. metals",10,0.5,"soon"),
("Ducting and air-distribution sheet metal",8,1.0,"med"),("Interior finishes, backplanes, trim",3,1.0,"imm"),
("Electrical equipment and conductors",100,0,None),("Mechanical equipment, piping, loop water",50,0,None),("IT — servers and racks",70,0.4,"long"),
("Steel — primary frame",40,1.0,"med"),("Steel — roof trusses, joists, deck, girts",60,1.0,"med"),
("Exterior skins — metal panel",7.4,1.0,"imm"),("Louvers, screens and fencing",1.9,1.0,"imm"),
("Concrete — slab on grade, paving",1200,0.75,"long"),("Concrete — foundations, footings, pads",1200,0.90,"long"),("Rebar in all concrete",100,0.81,"long")]
# order: contents at the top, building structure and envelope, foundation at the bottom (Alex 2026-09-05)
import json as _j, math
_d=_j.load(open("analyses/material_split.json")); SPLIT=_d["split"]; HZ=_d["horizon"]
HORDER=["imm","soon","med","long"]
def cum(name):
    """cumulative substitutable share by horizon; a row may carry several steps"""
    e=HZ[name]; steps=e.get("steps") or ([{"horizon":e["horizon"],"share":e["share"]}] if e.get("horizon") else [])
    return [sum(s["share"] for s in steps if HORDER.index(s["horizon"])<=j) for j in range(4)]
from matplotlib.patches import Circle, Wedge
MAT=[("steel",WOOD),("concrete","#8c8478"),("plastic",TEAL),("other","#5a4a36")]
carb=[r[1]*(SPLIT[r[0]][0]*1.8+SPLIT[r[0]][1]*0.12+SPLIT[r[0]][2]*3.0) for r in rows]
LEG=[Patch(color=c_,label=n.capitalize()) for n,c_ in MAT]
GROUP_ROWS=[("Contents — fit-out and equipment",9),("Building — structure and envelope",4),("Foundation — slab, footings, rebar",3)]
def with_totals(vals):
    """insert a bold subtotal row at the head of each group: (label, value, split, is_total)"""
    out=[]; i=0
    for title,n in GROUP_ROWS:
        grp=rows[i:i+n]; gk=sum(r[1] for r in grp); gsp=[sum(r[1]*SPLIT[r[0]][j] for r in grp)/gk for j in range(4)]
        gc=[sum(r[1]*cum(r[0])[j] for r in grp)/gk for j in range(4)]
        out.append((title.upper(),sum(vals[i:i+n]),gsp,True,gk,gc))
        for r,v in zip(grp,vals[i:i+n]): out.append((r[0],v,SPLIT[r[0]],False,r[1],cum(r[0])))
        i+=n
    return out
def campus(values, out, xlabel, log, narrow, unit, carbon=False):
    fig,(a,a2)=plt.subplots(1,2,figsize=(8.0,4.8) if narrow else (12.4,7.6),facecolor=INK,gridspec_kw={"width_ratios":[5.4,1.0],"wspace":0.02},sharey=True); clean(a); clean(a2)
    fs=8 if narrow else 10.5
    disp=with_totals(values)
    for i,(lab,v,sp,is_t,massk,cc) in enumerate(disp):
        for j,p in enumerate(cc):
            rr=0.36 if is_t else 0.28
            a2.add_patch(Circle((j,i),rr,fill=False,ec=BRIGHT if p>0 else NR,lw=0.8))
            if p>0: a2.add_patch(Wedge((j,i),rr,90-360*p,90,fc=GOLD,ec="none"))
        hh=0.78 if is_t else 0.6
        if carbon:
            left=0
            for (n,c_),share,f in zip(MAT[:3],sp[:3],(1.8,0.12,3.0)):
                w=massk*share*f
                if w>0: a.barh(i,w,left=left,color=c_,height=hh); left+=w
        elif log:
            lo=0.5; span=math.log10(v)-math.log10(lo); left=lo
            for (n,c_),share in zip(MAT,sp):
                if share<=0: continue
                right=10**(math.log10(left)+span*share); a.barh(i,right-left,left=left,color=c_,height=hh); left=right
        else:
            left=0
            for (n,c_),share in zip(MAT,sp):
                if share>0: a.barh(i,v*share,left=left,color=c_,height=hh); left+=v*share
        a.text(v*1.12 if log else v+4,i,f"{v*1000:,.0f} {unit}",va="center",fontsize=(8 if narrow else 11) if is_t else (7 if narrow else 9.5),color=CREAM if is_t else DIM,fontweight="bold" if is_t else "normal")
    a.set_yticks(range(len(disp))); a.set_yticklabels([d[0] for d in disp],fontsize=fs,color=CREAM); a.invert_yaxis()
    for t,d in zip(a.get_yticklabels(),disp):
        if d[3]: t.set_fontweight('bold'); t.set_color(BRIGHT); t.set_fontsize(fs-1)
    if log: a.set_xscale("log"); a.set_xlim(0.5,40000)
    else: a.set_xlim(0,(640 if narrow else 620))
    a.set_xlabel(xlabel,color=MUTED,fontsize=8 if narrow else 10); a.grid(axis="x",color=NR,lw=0.8); a.set_axisbelow(True)
    fig.legend(handles=LEG[:3] if carbon else LEG,loc="lower center",ncol=4,fontsize=8.5 if narrow else 11,facecolor=INK,edgecolor=INK,labelcolor=DIM,handlelength=1.4,columnspacing=1.4)
    a2.set_xlim(-0.6,3.6); a2.set_aspect("equal"); a2.set_xticks([]); a2.grid(False); a2.tick_params(left=False)
    for j,lab_ in enumerate(("Now","Soon","Med","Long")): a2.text(j,-0.75,lab_,ha="center",va="bottom",fontsize=6.5 if narrow else 8,color=BRIGHT,fontweight="bold",rotation=90)
    a2.text(1.5,-2.9,"% substitutable\nwith wood",ha="center",va="bottom",fontsize=6 if narrow else 7.5,color=MUTED)
    a.set_ylim(len(disp)-0.5,-4.2)
    fig.subplots_adjust(left=0.33 if narrow else 0.27,right=0.985,top=0.975,bottom=0.17 if narrow else 0.12); fig.savefig(out,dpi=170,facecolor=INK); plt.close(fig)
mass=[r[1] for r in rows]; carbv=list(carb)
campus(mass,"prep/charts/campus_mass.png","'000s of tons per 1 GW data center, high case — log scale",True,False,"tons")
campus(carbv,"prep/charts/campus_carbon.png","'000s of tons CO₂e per 1 GW data center, high case — steel, concrete and plastic content; steel 1.8 kg/kg, concrete 0.12, polymers 3.0",False,False,"tons CO₂e",True)
campus(mass,"prep/charts/campus_mass_narrow.png","Mass — '000s of tons per GW (log scale)",True,True,"tons")
campus(carbv,"prep/charts/campus_carbon_narrow.png","Embodied carbon — '000s of tons CO₂e per GW (steel, concrete and plastic content)",False,True,"tons",True)
tot=sum(carb); steel=sum(r[1]*SPLIT[r[0]][0]*1.8 for r in rows)
bm=[r for r in rows if not (r[0].startswith("Electrical") or r[0].startswith("Mechanical") or r[0].startswith("IT"))]
bm_steel=sum(r[1]*SPLIT[r[0]][0]*1.8 for r in bm); bm_tot=sum(r[1]*(SPLIT[r[0]][0]*1.8+SPLIT[r[0]][1]*0.12+SPLIT[r[0]][2]*3.0) for r in bm)
print(f"carbon total {tot:,.0f} kt; steel {steel/tot:.0%}; building materials only: steel {bm_steel/bm_tot:.0%}; equipment steel {tot-bm_tot:,.0f} kt")


# ---- Chart 2: tensile strength, with the A36 range shown as a range ----
fig,a=plt.subplots(figsize=(8.2,3.6),facecolor=INK); clean(a)
names=["SUPERWOOD\nproduction","SUPERWOOD\nlab samples","Structural steel\nASTM A36","Aluminum\n6061-T6"]
x=range(4)
a.bar(0,500,color=GOLD,width=0.62); a.bar(1,600,color=BRIGHT,width=0.62,hatch="//",edgecolor=INK,lw=0)
a.bar(2,400,color="#6b5334",width=0.62); a.bar(2,150,bottom=400,color="#8a6a40",width=0.62,hatch="..",edgecolor=INK,lw=0)
a.bar(3,310,color="#6b5334",width=0.62)
for xi,v,t in [(0,500,"500"),(1,600,"600+"),(2,550,"400–550"),(3,310,"310")]:
    a.text(xi,v+18,t,ha="center",fontsize=13,color=CREAM,fontweight="bold")
a.set_xticks(list(x)); a.set_xticklabels(names,fontsize=10.5,color=CREAM); a.set_yticks([0,200,400,600]); a.set_ylim(0,700)
a.set_ylabel("Tensile strength, MPa",color=MUTED); a.grid(axis="y",color=NR,lw=0.8); a.set_axisbelow(True)
plt.tight_layout(); fig.savefig("prep/charts/strength.png",dpi=200,facecolor=INK); plt.close(fig)

# ---- Chart 3: what one gigawatt is worth — SUPERWOOD required by horizon, low/high, in plant-years ----
hor=["Immediate\nskins, screens, fences","Soon\nracks, platforms, barriers","Medium term\nframe, roofs, enclosures","Long term\nslab, foundations"]
lo=[1.2,3.5,16,58]; hi=[2.7,18,65,362]   # kt SUPERWOOD required per GW (analyses §4)
fig,a=plt.subplots(figsize=(8.6,4.2),facecolor=INK); clean(a)
cols=[GOLD,GREEN,WOOD,TEAL]
for i,(l,h) in enumerate(zip(lo,hi)):
    a.barh(i,h-l,left=l,color=cols[i],height=0.55); a.plot([l],[i],marker="|",color=CREAM,ms=14,mew=2)
    a.text(h*1.12,i,f"{l*1000:,.0f}–{h*1000:,.0f} tons",va="center",fontsize=11,color=CREAM)
a.set_yticks(range(4)); a.set_yticklabels(hor,fontsize=10.5,color=CREAM); a.invert_yaxis()
a.set_xscale("log"); a.set_xlim(0.8,2000); a.set_xlabel("'000s of tons of SUPERWOOD per 1 GW data center, low–high scenario (log scale)",color=MUTED,fontsize=10)
a.axvline(0.9,color=BRIGHT,lw=1,ls="--"); a.text(0.9,-0.75,"SuperMill One ≈ 900 tons/yr",fontsize=9,color=BRIGHT,ha="center")
a.axvline(31,color=BRIGHT,lw=1,ls="--"); a.text(31,-0.75,"SuperMill Two ≈ 31,000 tons/yr",fontsize=9,color=BRIGHT,ha="center")
a.grid(axis="x",color=NR,lw=0.8); a.set_axisbelow(True)
plt.tight_layout(); fig.savefig("prep/charts/worth.png",dpi=200,facecolor=INK); plt.close(fig)
print("charts ok")



# ---- Chart 5: US data center construction put in place (Census C30), annual, plus trailing 12 months ----
years=['2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025']; vals=[1.8, 2.75, 4.12, 4.67, 6.93, 8.48, 9.23, 9.95, 12.58, 20.0, 34.8, 49.74]; t12=59.35; saar=75.166
fig,a=plt.subplots(figsize=(8.6,4.3),facecolor=INK); clean(a)
x=list(range(len(years)))
a.bar(x,vals,color=[WOOD]*(len(vals)-1)+[GOLD],width=0.7)
a.bar(len(years),t12,color=GOLD,width=0.7,hatch="//",edgecolor=INK,lw=0)
for xi,v in zip(x,vals):
    if xi>=len(vals)-3: a.text(xi,v+1,f"{v:,.0f}",ha="center",fontsize=10,color=DIM)  # values on the last bars only
a.text(len(years),t12+1,f"{t12:,.0f}",ha="center",fontsize=9,color=CREAM,fontweight="bold")
a.axhline(saar,color=BRIGHT,lw=1,ls="--"); a.text(-0.4,saar+1.2,f"July 2026 annual rate: ${saar:,.0f}B",fontsize=9.5,color=BRIGHT)
a.set_xticks(x+[len(years)]); a.set_xticklabels([(y if i%2==0 else "") for i,y in enumerate(years)]+["12 mo\nto Jul 26"],fontsize=9,color=DIM)
a.set_ylabel("$ billions per year",color=MUTED); a.set_ylim(0,max(saar,t12)*1.18); a.grid(axis="y",color=NR,lw=0.8); a.set_axisbelow(True)
plt.tight_layout(); fig.savefig("prep/charts/construction.png",dpi=200,facecolor=INK); plt.close(fig)
print("construction chart ok")
