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
rows=[("Concrete — slab on grade, paving",1200,0.75,"long"),("Concrete — foundations, footings, pads",1200,0.90,"long"),
("Rebar in all concrete",100,0.81,"long"),("Steel — primary frame",40,1.0,"med"),("Steel — roof trusses, joists, deck, girts",60,1.0,"med"),
("Exterior skins — metal panel",7.4,1.0,"imm"),("Louvers and yard screens",0.9,1.0,"imm"),("Security and staff-area fencing",1.0,1.0,"imm"),
("Platforms, walkways, mezzanines, railings",15,1.0,"soon"),("Acoustic barriers, enclosures, separations",5,1.0,"soon"),
("Racking and equipment supports",5,1.0,"imm"),("Tray, containment, doors, misc. metals",10,0.5,"soon"),
("Ducting and air-distribution sheet metal",8,1.0,"med"),("Interior finishes, backplanes, trim",3,1.0,"imm"),
("Electrical equipment and conductors",100,0,None),("Mechanical equipment, piping, loop water",50,0,None),("IT — servers and racks",70,0.4,"long")]
col={"imm":GOLD,"soon":GREEN,"med":WOOD,"long":TEAL}
lab={"imm":"now","soon":"next","med":"structural","long":"long-term vision"}
# Embodied-carbon factors [conf: M, typical cradle-to-gate]: concrete 0.12 kg CO2e/kg; steel 1.8 (global BF-BOF average, the deck's
# figure; EAF 0.4-0.7); interior finishes 1.0 (mixed, conf L). Metal-faced skins, louvers, fencing at the steel factor (aluminum ignored).
F={"concrete":0.12,"steel":1.8,"mixed":1.0}
kind=["concrete","concrete","steel","steel","steel","steel","steel","steel","steel","steel","steel","steel","steel","mixed",None,None,None]
carb=[(r[1]*F[k] if k else 0) for r,k in zip(rows,kind)]
LEG=[Patch(color=GOLD,label="Now — skins, screens, fences, racks"),Patch(color=GREEN,label="Next — platforms, barriers, doors"),
     Patch(color=WOOD,label="Structural — frame, roofs, enclosures"),Patch(color=TEAL,label="Long-term vision — slab, foundations, server boxes"),Patch(color=NR,label="Not replaced")]
def campus(values, out, xlabel, log, narrow, unit):
    fig,a=plt.subplots(figsize=(7.0,4.3) if narrow else (12.4,6.9),facecolor=INK); clean(a)
    fs=8 if narrow else 10.5
    for i,(r,v) in enumerate(zip(rows,values)):
        if v is None:
            a.barh(i,(0.9 if log else 60),color=INK,edgecolor=NR,hatch="///",height=0.66,lw=0.8)
            a.text((1.05 if log else 65),i,"not estimated" if narrow else "not estimated — equipment embodied carbon is outside a materials estimate",va="center",fontsize=7.5 if narrow else 8.5,color=MUTED); continue
        a.barh(i,v*r[2],color=col.get(r[3],NR),height=0.66); a.barh(i,v*(1-r[2]),left=v*r[2],color=NR,height=0.66)
        txt=f"{v:,.0f} {unit}" if narrow else f"{v:,.0f} {unit}"+(f"  ·  {r[2]:.0%} {lab[r[3]]}" if r[2] else "")
        a.text(v*1.12 if log else v+4,i,txt,va="center",fontsize=7.5 if narrow else 10,color=DIM)
    a.set_yticks(range(len(rows))); a.set_yticklabels([r[0] for r in rows],fontsize=fs,color=CREAM); a.invert_yaxis()
    if log: a.set_xscale("log"); a.set_xlim(0.5,(9000 if narrow else 40000))
    else: a.set_xlim(0,(260 if narrow else 300))
    a.set_xlabel(xlabel,color=MUTED,fontsize=8 if narrow else 10); a.grid(axis="x",color=NR,lw=0.8); a.set_axisbelow(True)
    if not narrow:
        fig.legend(handles=LEG,loc="lower center",ncol=3,fontsize=9.5,facecolor=INK,edgecolor=INK,bbox_to_anchor=(0.5,-0.01),labelcolor=DIM)
        plt.tight_layout(rect=(0,0.1,1,1))
    else: plt.tight_layout()
    fig.savefig(out,dpi=170,facecolor=INK); plt.close(fig)
mass=[r[1] for r in rows]; carbv=[c if k else None for c,k in zip(carb,kind)]
campus(mass,"prep/charts/campus_mass.png","thousand tonnes per 1 GW campus, high case — log scale",True,False,"kt")
campus(carbv,"prep/charts/campus_carbon.png","thousand tonnes CO₂e per 1 GW campus, high case — steel at 1.8 kg/kg (global average), concrete at 0.12",False,False,"kt CO₂e")
campus(mass,"prep/charts/campus_mass_narrow.png","Mass — thousand tonnes per GW (log scale)",True,True,"kt")
campus(carbv,"prep/charts/campus_carbon_narrow.png","Embodied carbon — thousand tonnes CO₂e per GW",False,True,"kt")
# legend strip for the two-up slide
fig=plt.figure(figsize=(14,0.5),facecolor=INK); fig.legend(handles=LEG,loc="center",ncol=5,fontsize=9,facecolor=INK,edgecolor=INK,labelcolor=DIM,handlelength=1.6,columnspacing=1.6); fig.savefig("prep/charts/campus_legend.png",dpi=170,facecolor=INK,bbox_inches="tight",pad_inches=0.05); plt.close(fig)
tot=sum(carb); steel=sum(c for c,k in zip(carb,kind) if k=="steel"); conc=sum(c for c,k in zip(carb,kind) if k=="concrete")
above=sum(c for c,k,r in zip(carb,kind,rows) if k=="steel" and not r[0].startswith("Rebar"))
eaf=sum(r[1]*0.55 for r,k in zip(rows,kind) if k=="steel")
print(f"building-materials carbon {tot:,.0f} kt; steel {steel/tot:.0%}, concrete {conc/tot:.0%}; steel above slab {above:,.0f} kt = {above/tot:.0%}; EAF steel share {eaf/(eaf+conc+3):.0%}")

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
hor=["Now\nskins, screens, fences, racks","Next\nplatforms, barriers, doors","Structural\nframe, roofs, enclosures","Long-term vision\nslab, foundations, server boxes"]
lo=[1.8,2.9,16,58]; hi=[5.7,15,65,363]   # kt SUPERWOOD required per GW (analyses §4)
fig,a=plt.subplots(figsize=(8.6,4.2),facecolor=INK); clean(a)
cols=[GOLD,GREEN,WOOD,TEAL]
for i,(l,h) in enumerate(zip(lo,hi)):
    a.barh(i,h-l,left=l,color=cols[i],height=0.55); a.plot([l],[i],marker="|",color=CREAM,ms=14,mew=2)
    a.text(h*1.12,i,f"{l:g}–{h:g} kt",va="center",fontsize=11,color=CREAM)
a.set_yticks(range(4)); a.set_yticklabels(hor,fontsize=10.5,color=CREAM); a.invert_yaxis()
a.set_xscale("log"); a.set_xlim(0.8,1500); a.set_xlabel("thousand tonnes of SUPERWOOD per 1 GW campus, low–high scenario (log scale)",color=MUTED,fontsize=10)
a.axvline(0.9,color=BRIGHT,lw=1,ls="--"); a.text(0.9,-0.75,"SuperMill One ≈ 0.9 kt/yr",fontsize=9,color=BRIGHT,ha="center")
a.axvline(31,color=BRIGHT,lw=1,ls="--"); a.text(31,-0.75,"SuperMill Two ≈ 31 kt/yr",fontsize=9,color=BRIGHT,ha="center")
a.grid(axis="x",color=NR,lw=0.8); a.set_axisbelow(True)
plt.tight_layout(); fig.savefig("prep/charts/worth.png",dpi=200,facecolor=INK); plt.close(fig)
print("charts ok")

