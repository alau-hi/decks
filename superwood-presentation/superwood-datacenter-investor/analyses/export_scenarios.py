# Evaluate the workbook for the three soil cases (footprint basis) and the per-MW basis; write scenarios.json for the decks.
# Run from analyses/ after build_model.py.
import json,openpyxl
from pycel import ExcelCompiler
meta=json.load(open("model_rows.json")); R=meta["R"]; S=meta["sheet"]
wb=openpyxl.load_workbook("materials-mass-and-replacement.xlsx"); I=wb["Inputs"]
def run(basis,soil):
    for c in ("B","C"): I[f"{c}{R['concrete_basis']}"]=basis; I[f"{c}{R['soil_case']}"]=soil
    wb.save("/tmp/_scen.xlsx"); xc=ExcelCompiler(filename="/tmp/_scen.xlsx")
    names={xc.evaluate(f"'{S}'!A{r}"):r for r in meta["data_rows"]}
    def row(key): r=names[key]; return {"t_lo":round(xc.evaluate(f"'{S}'!B{r}")),"t_hi":round(xc.evaluate(f"'{S}'!C{r}")),"sw_lo":round(xc.evaluate(f"'{S}'!L{r}")),"sw_hi":round(xc.evaluate(f"'{S}'!M{r}"))}
    lt=meta["hor"]["Long term"]
    sm2=xc.evaluate("Derived!B8")
    out={"slab":row("Concrete: slab on grade, paving, yard"),"foundations":row("Concrete: foundations, footings, piers, equipment pads"),"rebar":row("Rebar in all concrete"),
         "long_term":{"replaced_lo":round(xc.evaluate(f"'{S}'!B{lt[0]}")),"replaced_hi":round(xc.evaluate(f"'{S}'!C{lt[0]}")),"sw_lo":round(xc.evaluate(f"'{S}'!B{lt[1]}")),"sw_hi":round(xc.evaluate(f"'{S}'!C{lt[1]}")),"yr_lo":round(xc.evaluate(f"'{S}'!B{lt[1]}")/sm2,2),"yr_hi":round(xc.evaluate(f"'{S}'!C{lt[1]}")/sm2,2)}}
    return out
scen={"per_mw":run(0,1),"good":run(1,1),"moderate":run(1,2),"poor":run(1,3)}
scen["_meta"]={"default":"moderate","note":"footprint basis; soils 1 good / 2 moderate / 3 poor; per_mw is the published intensity for comparison","sm2_t_per_yr":round(xc_sm2:=0) if False else None}
json.dump(scen,open("scenarios.json","w"),indent=1)
for k,v in scen.items():
    if k.startswith("_"): continue
    print(k, {kk:(vv["t_lo"],vv["t_hi"]) for kk,vv in v.items() if kk!="long_term"}, "LT sw",v["long_term"]["sw_lo"],v["long_term"]["sw_hi"],"yr",v["long_term"]["yr_lo"],v["long_term"]["yr_hi"])
