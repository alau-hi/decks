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
("Exterior skins — metal panel",7.4,1.0,"imm"),("Louvers and yard screens",0.9,1.0,"imm"),("Security and staff-area fencing",1.0,1.0,"imm"),
("Concrete — slab on grade, paving",1200,0.75,"long"),("Concrete — foundations, footings, pads",1200,0.90,"long"),("Rebar in all concrete",100,0.81,"long")]
# order: contents at the top, building structure and envelope, foundation at the bottom (Alex 2026-09-05)
import json as _j, math
SPLIT=_j.load(open("analyses/material_split.json"))["split"]
MAT=[("steel",WOOD),("concrete","#8c8478"),("plastic",TEAL),("other","#5a4a36")]
carb=[r[1]*(SPLIT[r[0]][0]*1.8+SPLIT[r[0]][1]*0.12) for r in rows]
LEG=[Patch(color=c_,label=n.capitalize()) for n,c_ in MAT]
def campus(values, out, xlabel, log, narrow, unit, carbon=False):
    fig,a=plt.subplots(figsize=(7.0,4.3) if narrow else (12.4,6.9),facecolor=INK); clean(a)
    fs=8 if narrow else 10.5
    for i,(r,v) in enumerate(zip(rows,values)):
        sp=SPLIT[r[0]]
        if carbon:
            left=0
            for (n,c_),share,f in zip(MAT[:2],sp[:2],(1.8,0.12)):
                w=r[1]*share*f
                if w>0: a.barh(i,w,left=left,color=c_,height=0.66); left+=w
        elif log:
            # bar length is total mass on the log axis; segments show each material's share of the bar
            lo=0.5; span=math.log10(v)-math.log10(lo); left=lo
            for (n,c_),share in zip(MAT,sp):
                if share<=0: continue
                right=10**(math.log10(left)+span*share); a.barh(i,right-left,left=left,color=c_,height=0.66); left=right
        else:
            left=0
            for (n,c_),share in zip(MAT,sp):
                if share>0: a.barh(i,v*share,left=left,color=c_,height=0.66); left+=v*share
        a.text(v*1.12 if log else v+4,i,f"{v*1000:,.0f} {unit}",va="center",fontsize=7.5 if narrow else 10,color=DIM)
    a.set_yticks(range(len(rows))); a.set_yticklabels([r[0] for r in rows],fontsize=fs,color=CREAM); a.invert_yaxis()
    if log: a.set_xscale("log"); a.set_xlim(0.5,(9000 if narrow else 40000))
    else: a.set_xlim(0,(260 if narrow else 300))
    a.set_xlabel(xlabel,color=MUTED,fontsize=8 if narrow else 10); a.grid(axis="x",color=NR,lw=0.8); a.set_axisbelow(True)
    a.legend(handles=LEG[:2] if carbon else LEG,loc="lower right",fontsize=7.5 if narrow else 9,facecolor=INK,edgecolor=INK,labelcolor=DIM)
    plt.tight_layout(); fig.savefig(out,dpi=170,facecolor=INK); plt.close(fig)
mass=[r[1] for r in rows]; carbv=list(carb)
campus(mass,"prep/charts/campus_mass.png","'000s of tons per 1 GW data center, high case — log scale",True,False,"tons")
campus(carbv,"prep/charts/campus_carbon.png","'000s of tons CO₂e per 1 GW data center, high case — steel and concrete content only; steel 1.8 kg/kg, concrete 0.12",False,False,"tons CO₂e",True)
campus(mass,"prep/charts/campus_mass_narrow.png","Mass — '000s of tons per GW (log scale)",True,True,"tons")
campus(carbv,"prep/charts/campus_carbon_narrow.png","Embodied carbon — '000s of tons CO₂e per GW (steel and concrete content)",False,True,"tons",True)
tot=sum(carb); steel=sum(r[1]*SPLIT[r[0]][0]*1.8 for r in rows)
bm=[r for r in rows if not (r[0].startswith("Electrical") or r[0].startswith("Mechanical") or r[0].startswith("IT"))]
bm_steel=sum(r[1]*SPLIT[r[0]][0]*1.8 for r in bm); bm_tot=sum(r[1]*(SPLIT[r[0]][0]*1.8+SPLIT[r[0]][1]*0.12) for r in bm)
print(f"carbon total {tot:,.0f} kt; steel {steel/tot:.0%}; building materials only: steel {bm_steel/bm_tot:.0%}; equipment steel {tot-bm_tot:,.0f} kt")