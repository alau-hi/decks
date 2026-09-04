from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment
from openpyxl.utils import get_column_letter as CL
from openpyxl.chart import BarChart, Reference
wb=Workbook()
INK="1F150C"; CREAM="F4ECDF"
hdr=Font(bold=True,color=CREAM); hfill=PatternFill("solid",fgColor=INK); inp=PatternFill("solid",fgColor="FFF4D6"); calc=PatternFill("solid",fgColor="F2EDE4"); tot=Font(bold=True); sect=PatternFill("solid",fgColor="E8DCC6")
def header(ws,row,cols):
    for i,c in enumerate(cols,1):
        x=ws.cell(row=row,column=i,value=c); x.font=hdr; x.fill=hfill; x.alignment=Alignment(wrap_text=True,vertical="center")
def widths(ws,w):
    for i,x in enumerate(w,1): ws.column_dimensions[CL(i)].width=x
SF_M2="0.092903"

# ---------------- Inputs ----------------
I=wb.active; I.title="Inputs"
header(I,1,["Parameter","Low","High","Unit","Label / confidence","Note"])
rows=[
("it_mw","IT load of reference campus",1000,1000,"MW","assumption","Everything downstream is linear in this"),
("sf_per_mw","Building area per MW",5000,10000,"sf/MW","estimated [L]","Hyperscale, single-story"),
("footprint_sf","Footprint per building",1e6,1e6,"sf","estimated [L]","~1,000 ft sides"),
("wall_sf_bldg","Exterior wall area per building",160000,160000,"sf","derived","4 × 1,000 ft × 40 ft eave"),
("yard_screen_sf","Yard / mechanical screens and louvers (per campus)",200000,500000,"sf","estimated [L]",""),
("fence_km","Perimeter + yard fence length",10,20,"km","estimated [L]","Campus perimeter plus transformer / generator yards"),
("fence_h_m","Fence height",2.5,2.5,"m","assumption",""),
("interior_sf","Biophilic interior paneling (admin / office wings)",100000,300000,"sf","estimated [L]",""),
("backplane_sf","Backplanes, trim, door kicks, sub-framing",50000,150000,"sf","estimated [L]",""),
("concrete_m3_mw","Concrete intensity (all concrete)",500,1000,"m³/MW","published, secondary [M]","arXiv 2509.21312 citing Hasan 2022 / Sharma 2023: 5,000–10,000 m³ per 10 MW"),
("concrete_t_m3","Concrete density",2.4,2.4,"t/m³","published [H]",""),
("walls_precast","Walls are precast? (1 = yes, 0 = metal panel)",0,0,"flag","choice","1: facade mass moves from metal skins (immediate) to precast panels (long term)"),
("precast_thk_m","Precast / tilt-up wall thickness",0.2,0.2,"m","estimated [L]","8 in"),
("steel_t_mw","Structural steel intensity",50,100,"t/MW","published, secondary [M]","Same source: 500–1,000 t per 10 MW"),
("secondary_share","Share of structural steel that is secondary (trusses, joists, girts, deck)",0.4,0.6,"share","estimated [L]","Remainder = primary frame"),
("rebar_kg_m3","Rebar per m³ of concrete",60,100,"kg/m³","estimated [L]",""),
("platform_t_mw","Platforms, walkways, mezzanines, railings, tray supports",5,15,"t/MW","estimated [L]",""),
("panel_kg_m2","Metal panel / IMP cladding mass",25,50,"kg/m²","estimated [L]",""),
("louver_kg_m2","Louver / screen system mass",10,20,"kg/m²","estimated [L]",""),
("fence_kg_m","Steel fence mass per running metre",30,50,"kg/m","estimated [L]","Palisade / chain-link with posts"),
("acoustic_t_mw","Acoustic barriers, enclosures, HVAC separations",2,5,"t/MW","estimated [L]",""),
("racking_t_mw","Racking and equipment supports",2,5,"t/MW","estimated [L]",""),
("other_t_mw","Other tray, containment, doors, misc. metals",5,10,"t/MW","estimated [L]",""),
("interior_t_mw","Interior finishes, backplanes, trim (mass)",1,3,"t/MW","estimated [L]","Admin / office wings only"),
("elec_t_mw","Electrical: gensets, transformers, switchgear, UPS, busway, copper",50,100,"t/MW","estimated [L]","Genset 30–60 t, 1 MW UPS 10–20 t, transformer 5–8 t"),
("mech_t_mw","Mechanical: chillers, fan walls, coolers, piping, water",20,50,"t/MW","estimated [L]",""),
("it_t_mw","IT: servers and racks",15,70,"t/MW","estimated [L]","Loaded rack ~1 t; GB200 NVL72 ~1.36 t [H]"),
("it_enclosure_share","Share of IT mass that is server and equipment enclosures (boxes), replaceable long term",0.4,0.4,"share","estimated [L]; Alex 2026-09-04","Server boxes eventually; the electronics never"),
("foundation_share","Share of all concrete that is foundations, footings, piers and equipment pads",0.4,0.5,"share","estimated [L]","Remainder is slab on grade, paving and yard"),
("slab_lt","Long-term technical potential: share of slab-on-grade and paving concrete replaceable",0.75,0.75,"share","asserted-internal (Alex, 2026-09-01) [L]","Technical potential, not a plan; no design or code pathway yet"),
("fdn_lt","Long-term technical potential: share of foundations, footings, piers and pads replaceable",0.9,0.9,"share","asserted-internal (Alex, 2026-09-01) [L]","Technical potential, not a plan"),
("conc_sub_factor","kg SUPERWOOD per kg of concrete replaced",0.05,0.15,"kg/kg","estimated [L]","Lightweight insulated wood-foundation concept; no design exists yet"),
("duct_t_mw","Ducting, plenums and air-distribution sheet metal",3,8,"t/MW","estimated [L]","Separate from the mechanical-equipment row"),
("co2_conc","Concrete emissions",0.12,0.12,"kg CO₂e/kg","industry range [M]","Ready-mix, cradle to gate; typical 0.10–0.15"),
("board_mm","SUPERWOOD average board thickness",7.2,7.2,"mm","internal TEM basis [H]",""),
("sw_kg_m3","SUPERWOOD density",1300,1300,"kg/m³","internal TEM [H]",""),
("sm1_sf","SuperMill One output",1e6,1e6,"sf/yr","internal [H]",""),
("sm2_sf","SuperMill Two output",36e6,36e6,"sf/yr","internal [H]",""),
("sub_factor","Structural substitution: kg SUPERWOOD per kg steel replaced",0.3,0.6,"kg/kg","estimated [L]","Engineering-stamped per element (Fast + Epp) before external use"),
("hybrid_kg_m2","SUPERWOOD in a hybrid wall panel replacing precast",20,40,"kg/m²","estimated [L]","Panel design unsettled"),
("share_other","Addressable share of other tray / containment / doors (medium term)",0.5,0.5,"share","estimated [L]",""),
("rebar_frontier","Count rebar as addressable in the long term? (0/1)",0,0,"flag","choice","Rebar is a frontier market with no pathway; off by default"),
("co2_steel","Steel emissions, global average (BF-BOF)",1.8,1.8,"kg CO₂e/kg","published-class [M]",""),
("co2_eaf","Steel emissions, recycled (EAF)",0.4,0.7,"kg CO₂e/kg","industry range [M]",""),
("co2_sw","SUPERWOOD manufacturing emissions",0.5,0.5,"kg CO₂e/kg","internal, pre-LCA [L]","Canva DCII deck; LCA under way, Prof. Ming Hu, Notre Dame"),
("co2_bio","SUPERWOOD biogenic carbon stored",1.3,1.3,"kg CO₂e/kg","internal, pre-LCA [L]","Report separately; module C release under EN 15804"),
]
R={}
for i,(k,name,lo,hi,unit,lab,note) in enumerate(rows,start=2):
    I.cell(row=i,column=1,value=name); I.cell(row=i,column=2,value=lo).fill=inp; I.cell(row=i,column=3,value=hi).fill=inp
    I.cell(row=i,column=4,value=unit); I.cell(row=i,column=5,value=lab); I.cell(row=i,column=6,value=note); R[k]=i
widths(I,[62,12,12,12,26,70]); I.freeze_panes="B2"
def ref(k,c): return f"Inputs!${'B' if c=='B' else 'C'}${R[k]}"

# ---------------- Derived ----------------
D=wb.create_sheet("Derived")
header(D,1,["Quantity","Low","High","Unit"])
der=[("Number of buildings",lambda c:f"={ref('sf_per_mw',c)}*{ref('it_mw',c)}/{ref('footprint_sf',c)}","count"),
("Exterior wall area, sf",lambda c:f"={c}2*{ref('wall_sf_bldg',c)}","sf"),
("Exterior wall area, m²",lambda c:f"={c}3*{SF_M2}","m²"),
("Fence face area, sf",lambda c:f"={ref('fence_km',c)}*1000*{ref('fence_h_m',c)}/{SF_M2}","sf"),
("SUPERWOOD board mass per sf",lambda c:f"={ref('board_mm',c)}/1000*{ref('sw_kg_m3',c)}*{SF_M2}","kg/sf"),
("SuperMill One output in tonnes",lambda c:f"={ref('sm1_sf',c)}*{c}6/1000","t/yr"),
("SuperMill Two output in tonnes",lambda c:f"={ref('sm2_sf',c)}*{c}6/1000","t/yr")]
for i,(n,f,u) in enumerate(der,start=2):
    D.cell(row=i,column=1,value=n); D.cell(row=i,column=4,value=u)
    for c,col in (("B",2),("C",3)): x=D.cell(row=i,column=col,value=f(c)); x.fill=calc; x.number_format="#,##0.00"
widths(D,[40,16,16,10])
def dref(row,c): return f"Derived!{c}{row}"

# ---------------- 1 GW data center (main sheet) ----------------
SHEET="1 GW data center"
M=wb.create_sheet(SHEET,1)
HORS=("Immediate","Soon","Medium term","Long term"); HCOL={"Immediate":6,"Soon":7,"Medium term":8,"Long term":9}
header(M,1,["Component (building, then contents)","Low  t per campus","High  t per campus","Low  cumulative t","High  cumulative t",
            "Addressable — immediate","Addressable — soon","Addressable — medium term","Addressable — long term",
            "Low  replaced t","High  replaced t","Low  SUPERWOOD t","High  SUPERWOOD t","Gate / basis","High  not replaced t",
            "Low SW immediate","Low SW soon","Low SW medium","Low SW long","High SW immediate","High SW soon","High SW medium","High SW long"])
IT=lambda c: ref('it_mw',c)
# (name, mass formula, horizon, share formula, sw rule, note)
comp=[
("BUILDING — STRUCTURE AND ENVELOPE",None,None,None,None,None),
("Concrete: slab on grade, paving, yard",lambda c:f"={ref('concrete_m3_mw',c)}*(1-{ref('foundation_share',c)})*{ref('concrete_t_m3',c)}*{IT(c)}-{{precast}}","Long term",lambda c:f"={ref('slab_lt',c)}","concrete","Technical potential per Alex (75%); no design or code pathway yet. arXiv 2509.21312 [M] for total concrete"),
("Concrete: foundations, footings, piers, equipment pads",lambda c:f"={ref('concrete_m3_mw',c)}*{ref('foundation_share',c)}*{ref('concrete_t_m3',c)}*{IT(c)}","Long term",lambda c:f"={ref('fdn_lt',c)}","concrete","Technical potential per Alex (90%); lightweight insulated SUPERWOOD foundations — geotechnical, durability and code pathway all open"),
("Precast / tilt-up perimeter walls (precast case)",lambda c:f"={ref('walls_precast',c)}*{dref(4,c)}*{ref('precast_thk_m',c)}*{ref('concrete_t_m3',c)}","Medium term",lambda c:"1","hybrid","Hybrid SUPERWOOD wall panels; NFPA 285 + E119 assemblies. Active when Inputs walls_precast = 1"),
("Rebar in all concrete",lambda c:f"={ref('concrete_m3_mw',c)}*{ref('rebar_kg_m3',c)}/1000*{IT(c)}","Long term",lambda c:f"={ref('foundation_share',c)}*{ref('fdn_lt',c)}+(1-{ref('foundation_share',c)})*{ref('slab_lt',c)}","steel","Rebar follows the concrete it sits in: foundation share × 90% + slab share × 75%"),
("Structural steel — primary frame (columns, girders)",lambda c:f"={ref('steel_t_mw',c)}*(1-{ref('secondary_share',c)})*{IT(c)}","Medium term",lambda c:"1","steel","ICC-ES via the mass-timber qualification pathway; FM acceptance; E119"),
("Structural steel — roof trusses, joists, roof deck, girts",lambda c:f"={ref('steel_t_mw',c)}*{ref('secondary_share',c)}*{IT(c)}","Medium term",lambda c:"1","steel","Design values and connection data; trusses carry no fire-resistance requirement"),
("Exterior skins — metal panel / IMP (metal-panel case)",lambda c:f"=(1-{ref('walls_precast',c)})*{dref(4,c)}*{ref('panel_kg_m2',c)}/1000","Immediate",lambda c:"1","skins","Shipping now; area-for-area rain screen"),
("Louvers and yard / mechanical screens",lambda c:f"={ref('yard_screen_sf',c)}*{SF_M2}*{ref('louver_kg_m2',c)}/1000","Immediate",lambda c:"1","louvers","Shipping now"),
("Security and staff-area fencing",lambda c:f"={ref('fence_km',c)}*1000*{ref('fence_kg_m',c)}/1000","Immediate",lambda c:"1","fence","Shipping now — the Microsoft near-term list"),
("CONTENTS — FIT-OUT AND EQUIPMENT",None,None,None,None,None),
("Platforms, walkways, mezzanines, railings, tray supports",lambda c:f"={ref('platform_t_mw',c)}*{IT(c)}","Soon",lambda c:"1","steel","Published design values; IBC 1607 for railings"),
("Acoustic barriers, enclosures, HVAC separations",lambda c:f"={ref('acoustic_t_mw',c)}*{IT(c)}","Soon",lambda c:"1","steel","STC / OITC lab and field data"),
("Racking and equipment supports",lambda c:f"={ref('racking_t_mw',c)}*{IT(c)}","Soon",lambda c:"1","steel","A few months of design and load-data development (Alex 2026-09-04)"),
("Other tray, containment, doors, misc. metals",lambda c:f"={ref('other_t_mw',c)}*{IT(c)}","Soon",lambda c:f"={ref('share_other',c)}","steel","Partial; UL 10C for rated doors"),
("Ducting, plenums and air-distribution sheet metal",lambda c:f"={ref('duct_t_mw',c)}*{IT(c)}","Medium term",lambda c:"1","steel","NFPA 90A / UL 181 noncombustibility expectations for in-airstream components — the hardest gate in this row set"),
("Interior finishes, backplanes, trim (admin / office)",lambda c:f"={ref('interior_t_mw',c)}*{IT(c)}","Immediate",lambda c:"1","interior","E84 Class A finish; backplanes UL 94 yellow card (not yet started)"),
("Electrical equipment and conductors",lambda c:f"={ref('elec_t_mw',c)}*{IT(c)}",None,lambda c:"0","zero","Gensets, transformers, switchgear, batteries, copper"),
("Mechanical equipment, piping, loop water",lambda c:f"={ref('mech_t_mw',c)}*{IT(c)}",None,lambda c:"0","zero","Chillers, fan walls, coolers, piping (ductwork is its own row)"),
("IT — servers and racks",lambda c:f"={ref('it_t_mw',c)}*{IT(c)}","Long term",lambda c:f"={ref('it_enclosure_share',c)}","steel","Server and equipment enclosures only (40% of IT mass, estimate); electronics never. Rack masses [H]; aggregate [L]"),
]
r=2; data_rows=[]; precast_row=None
for name,f,hor,share,rule,note in comp:
    if f is None:
        M.cell(row=r,column=1,value=name).font=tot; M.cell(row=r,column=1).fill=sect; r+=1; continue
    if name.startswith("Precast"): precast_row=r
    data_rows.append(r); r+=1
r=2
for name,f,hor,share,rule,note in comp:
    if f is None: r+=1; continue
    M.cell(row=r,column=1,value=name); M.cell(row=r,column=14,value=note)
    for c,col in (("B",2),("C",3)):
        M.cell(row=r,column=col,value=f(c).replace("{precast}",f"{c}{precast_row}")).fill=calc
        prev=[x for x in data_rows if x<r]
        M.cell(row=r,column=col+2,value=f"={c}{r}" if not prev else f"={CL(col+2)}{prev[-1]}+{c}{r}").fill=calc
    # four addressable-share columns (editable); the row's horizon gets the share, others 0
    for h in HORS:
        _s=share("B") if h==hor else "0"; _s=float(_s) if not _s.startswith("=") else _s
        x=M.cell(row=r,column=HCOL[h],value=_s); x.fill=inp; x.number_format="0%"
    tot_share=f"SUM($F{r}:$I{r})"
    for c,(col,scol) in (("B",(10,12)),("C",(11,13))):
        M.cell(row=r,column=col,value=f"={c}{r}*{tot_share}").fill=calc
        repl=f"{CL(col)}{r}"
        if rule=="zero": sw="=0"
        elif rule=="steel": sw=f"={repl}*{ref('sub_factor',c)}"
        elif rule=="concrete": sw=f"={repl}*{ref('conc_sub_factor',c)}"
        elif rule=="skins": sw=f"={tot_share}*(1-{ref('walls_precast',c)})*{dref(3,c)}*{dref(6,c)}/1000"
        elif rule=="louvers": sw=f"={tot_share}*{ref('yard_screen_sf',c)}*{dref(6,c)}/1000"
        elif rule=="fence": sw=f"={tot_share}*{dref(5,c)}*{dref(6,c)}/1000"
        elif rule=="hybrid": sw=f"={tot_share}*{ref('walls_precast',c)}*{dref(4,c)}*{ref('hybrid_kg_m2',c)}/1000"
        elif rule=="interior": sw=f"={tot_share}*({ref('interior_sf',c)}+{ref('backplane_sf',c)})*{dref(6,c)}/1000"
        M.cell(row=r,column=scol,value=sw).fill=calc
        # helper: SUPERWOOD split by horizon in proportion to the shares
        base=16 if c=="B" else 20
        for j,h in enumerate(HORS):
            M.cell(row=r,column=base+j,value=f"=IF({tot_share}=0,0,{CL(scol)}{r}*{CL(HCOL[h])}{r}/{tot_share})").fill=calc
    M.cell(row=r,column=15,value=f"=C{r}-K{r}").fill=calc
    r+=1
first,last=data_rows[0],data_rows[-1]
r+=1
def srow(label,fB,fC,fmt="#,##0",bold=False):
    global r
    M.cell(row=r,column=1,value=label).font=Font(bold=bold)
    x=M.cell(row=r,column=2,value=fB); x.number_format=fmt; x.font=Font(bold=bold)
    y=M.cell(row=r,column=3,value=fC); y.number_format=fmt; y.font=Font(bold=bold)
    r+=1; return r-1
M.cell(row=r,column=1,value="SUMMARY — per campus").font=tot; M.cell(row=r,column=1).fill=sect; r+=1
rt=srow("Total mass, building and contents (t)",f"=SUM(B{first}:B{last})",f"=SUM(C{first}:C{last})",bold=True)
rx=srow("Total excluding concrete (t)",f"=B{rt}-B{first}-B{first+1}-B{precast_row}",f"=C{rt}-C{first}-C{first+1}-C{precast_row}",bold=True)
r+=1
M.cell(row=r,column=1,value="Replaced by SUPERWOOD, by horizon").font=tot; r+=1
hor_rows={}
for j,hor in enumerate(HORS):
    sc=CL(HCOL[hor])
    rr=srow(f"{hor} — incumbent mass replaced (t)",f"=SUMPRODUCT(B{first}:B{last},{sc}{first}:{sc}{last})",f"=SUMPRODUCT(C{first}:C{last},{sc}{first}:{sc}{last})")
    rs=srow(f"{hor} — SUPERWOOD required (t)",f"=SUM({CL(16+j)}{first}:{CL(16+j)}{last})",f"=SUM({CL(20+j)}{first}:{CL(20+j)}{last})")
    if hor=="Immediate":
        srow("Immediate — SUPERWOOD required (sf)",f"=B{rs}*1000/Derived!B6",f"=C{rs}*1000/Derived!C6")
        ry=srow("Immediate — years of SuperMill One output",f"=B{rs}/Derived!B7",f"=C{rs}/Derived!C7",fmt="0.0")
    else:
        ry=srow(f"{hor} — years of SuperMill Two output",f"=B{rs}/Derived!B8",f"=C{rs}/Derived!C8",fmt="0.0")
    hor_rows[hor]=(rr,rs,ry); r+=1
rc=srow("Cumulative incumbent mass replaced (t)",f"=SUM(J{first}:J{last})",f"=SUM(K{first}:K{last})",bold=True)
rsw=srow("Cumulative SUPERWOOD required (t)",f"=SUM(L{first}:L{last})",f"=SUM(M{first}:M{last})",bold=True)
rsy=srow("Cumulative years of SuperMill Two output",f"=B{rsw}/Derived!B8",f"=C{rsw}/Derived!C8",fmt="0.0")
rsh=srow("Share of total mass replaced",f"=B{rc}/B{rt}",f"=C{rc}/C{rt}",fmt="0.0%")
rshx=srow("Share of ex-concrete mass replaced through the medium term (excludes foundations)",f"=(B{rc}-B{hor_rows['Long term'][0]})/B{rx}",f"=(C{rc}-C{hor_rows['Long term'][0]})/C{rx}",fmt="0.0%")
rnr=srow("Not replaced by SUPERWOOD (t)",f"=B{rt}-B{rc}",f"=C{rt}-C{rc}",bold=True)
rnrs=srow("Not replaced, share of total",f"=B{rnr}/B{rt}",f"=C{rnr}/C{rt}",fmt="0.0%")
for rr in range(2,last+1):
    for col in (2,3,4,5,10,11,12,13,15)+tuple(range(16,24)):
        if M.cell(row=rr,column=col).number_format=="General": M.cell(row=rr,column=col).number_format="#,##0"
widths(M,[58,15,15,16,16,12,12,12,12,14,14,14,14,64,16]+[11]*8); M.freeze_panes="B2"
for col in range(16,24): M.column_dimensions[CL(col)].outlineLevel=1; M.column_dimensions[CL(col)].hidden=True
M.cell(row=1,column=16).value="Low SW immediate (helper — grouped, unhide to see the per-horizon split)"
ch=BarChart(); ch.type="bar"; ch.grouping="stacked"; ch.overlap=100; ch.title="High case, tonnes per campus — replaced by SUPERWOOD vs not (slab concrete row excluded)"
rb=first
ch.add_data(Reference(M,min_col=11,min_row=rb,max_row=last),titles_from_data=False)
ch.add_data(Reference(M,min_col=15,min_row=rb,max_row=last),titles_from_data=False)
ch.set_categories(Reference(M,min_col=1,min_row=rb,max_row=last))
from openpyxl.chart.series import SeriesLabel
ch.series[0].title=SeriesLabel(v="Replaced by SUPERWOOD (high)"); ch.series[1].title=SeriesLabel(v="Not replaced (high)")
ch.series[0].graphicalProperties.solidFill="E2B877"; ch.series[1].graphicalProperties.solidFill="9D8D76"
ch.height=12; ch.width=26; ch.y_axis.title="t per campus"
M.add_chart(ch,f"A{r+2}")

# ---------------- Carbon ----------------
C=wb.create_sheet("Carbon")
header(C,1,["Horizon","Low incumbent emissions avoided (t CO₂e)","High","Low SUPERWOOD manufacturing (t CO₂e)","High","Low net reduction","High","Low net vs EAF steel","High","Low biogenic stored (separate)","High"])
for i,hor in enumerate(("Immediate","Soon","Medium term","Long term"),start=2):
    rr,rs,_=hor_rows[hor]; C.cell(row=i,column=1,value=hor+(" (foundation concrete)" if hor=="Long term" else " (steel)"))
    for c,col in (("B",2),("C",3)):
        inc=f"'1 GW data center'!{c}{rr}"; sw=f"'1 GW data center'!{c}{rs}"
        fac=ref('co2_conc',c) if hor=="Long term" else ref('co2_steel',c)
        C.cell(row=i,column=col,value=f"={inc}*{fac}")
        C.cell(row=i,column=col+2,value=f"={sw}*{ref('co2_sw',c)}")
        C.cell(row=i,column=col+4,value=f"={CL(col)}{i}-{CL(col+2)}{i}")
        C.cell(row=i,column=col+6,value=("=\"n/a\"" if hor=="Long term" else f"={inc}*{ref('co2_eaf',c)}-{CL(col+2)}{i}"))
        C.cell(row=i,column=col+8,value=f"={sw}*{ref('co2_bio',c)}")
    for col in range(2,12): C.cell(row=i,column=col).number_format="#,##0"
C.cell(row=7,column=1,value="Pre-LCA projections (LCA under way with Prof. Ming Hu, University of Notre Dame). Long-term row uses a concrete factor (Inputs co2_conc) and treats the rebar in foundations at the concrete factor — conservative. Biogenic storage reported separately (EN 15804 module C).")
widths(C,[30,18,12,18,12,16,12,16,12,18,12])

# ---------------- README ----------------
Rd=wb.create_sheet("README",0)
txt=["SUPERWOOD × Data Centers — material mass build-up and replacement model (2026-09-01, v2)",
"","Reference unit: 1 GW IT-load campus. Change any yellow cell on Inputs (and the four addressable-share columns on 1 GW data center — immediate, soon, medium term, long term; a row may split across them); everything recalculates.",
"Low column = every low input; High column = every high input. These are scenario bounds, not a distribution — vary single inputs for sensitivities.",
"","Read the sheet 1 GW data center top to bottom: building structure and envelope first, then contents, with a running cumulative total. The right-hand columns show, for each component, the addressable share in each of the four horizons, the mass replaced, and the SUPERWOOD required (per-horizon SUPERWOOD split sits in grouped helper columns P–W). The summary block and chart follow.",
"Horizons: Immediate (shipping now, no assembly rating) · Soon (certification-gated non-structural: platforms, railings, barriers, racking, doors) · Medium term (structural steel, roof trusses and roofs, ducting, enclosures) · Long term (foundations). Switch Inputs walls_precast to 1 to model precast perimeter walls; foundation_share and conc_sub_factor drive the long-term row.",
"","Provenance: concrete and structural-steel intensities are published, secondary (arXiv 2509.21312 citing Hasan 2022 / Sharma 2023, conf M); GB200 rack mass is NVIDIA-published (conf H). Everything else is estimated [conf: L] — replace with a real material takeoff from HITT, Turner or Fast + Epp before external use.",
"Companion narrative: materials-mass-and-replacement.md in the same folder."]
for i,s in enumerate(txt,1): Rd.cell(row=i,column=1,value=s)
Rd.column_dimensions["A"].width=150
wb.save("materials-mass-and-replacement.xlsx"); print("saved; data rows",first,last,"summary ends",r)
import json; json.dump({"sheet":SHEET,"first":first,"last":last,"rt":rt,"rx":rx,"hor":hor_rows,"rc":rc,"rsw":rsw,"rsy":rsy,"rsh":rsh,"rshx":rshx,"rnr":rnr,"rnrs":rnrs,"data_rows":data_rows,"precast":precast_row},open("model_rows.json","w"))
