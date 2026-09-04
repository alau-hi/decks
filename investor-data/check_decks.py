#!/usr/bin/env python3
"""Match each per-deck register claim to a master fact.

A claim with `ref: <id>` is checked for existence. Otherwise a token-overlap score
against the master statements/values/notes is printed so a human can add `ref:`.
Never modifies the source registers. Usage: check_decks.py [--all] [threshold]
"""
import re, sys, pathlib, yaml

HERE = pathlib.Path(__file__).resolve().parent
MASTER = HERE / "SAFE-2026-09.yaml"
REGISTERS = {
    "investor-overview": HERE / "../investor-overview/sources/claims.yaml",
    "super-mills-america": HERE / "../super-mills-america/sources/claims.yaml",
}
STOP = set("the a an of and or to in for is are at by on with from per vs than as into "
           "not no its this that these those us it be was were has have".split())


def toks(s):
    return {t for t in re.findall(r"[a-z0-9.%$]+", str(s).lower()) if len(t) > 1 and t not in STOP}


def claims_lenient(text):
    """Fallback for a register that is not valid YAML: read `- claim:` / `slide:` / `ref:` lines."""
    cur = None
    for line in text.splitlines():
        m = re.match(r"^\s*- claim:\s*(.*)$", line)
        if m:
            if cur:
                yield cur.get("slide"), cur
            cur = {"claim": m.group(1).strip().strip('"').lstrip(">-").strip()}
            continue
        m = re.match(r"^\s{4}(slide|ref):\s*(.*)$", line)
        if m and cur is not None:
            cur[m.group(1)] = m.group(2).strip()
    if cur:
        yield cur.get("slide"), cur


def claims(reg):
    try:
        doc = yaml.safe_load(reg.read_text())
    except yaml.YAMLError as e:  # ponytail: source registers are read-only; tolerate their YAML errors
        print(f"  ! {reg.name} is not valid YAML ({str(e).splitlines()[0]}); using line-based fallback")
        yield from claims_lenient(reg.read_text())
        return
    if "slides" in doc:  # investor-overview shape
        for s in doc["slides"]:
            for c in s.get("claims") or []:
                yield s.get("nav"), c
    for c in doc.get("claims") or []:  # flat shape
        yield c.get("slide"), c


def main():
    show_all = "--all" in sys.argv
    thr = float(next((a for a in sys.argv[1:] if a[0].isdigit()), "0.5"))
    facts = yaml.safe_load(MASTER.read_text())["facts"]
    index = {f["id"]: toks(" ".join(str(f.get(k) or "") for k in ("statement", "value", "notes"))) | toks(f["id"].replace(".", " ").replace("_", " "))
             for f in facts}
    for deck, path in REGISTERS.items():
        print(f"\n== {deck} ({path.resolve()})")
        n = unmatched = 0
        for slide, c in claims(path):
            n += 1
            text = c.get("claim", "")
            if c.get("ref"):
                ok = c["ref"] in index
                if not ok or show_all:
                    print(f"  [{'ref' if ok else 'BAD REF'}] {c['ref']} <- {text[:90]}")
                unmatched += not ok
                continue
            ct = toks(text)
            best, score = max(((fid, len(ct & ft) / max(len(ct), 1)) for fid, ft in index.items()),
                              key=lambda x: x[1])
            if score < thr or show_all:
                tag = "ok " if score >= thr else "?? "
                unmatched += score < thr
                print(f"  [{tag}{score:.2f}] {best:48s} <- ({slide}) {text[:90]}")
        print(f"  {n} claims, {unmatched} unmatched below {thr}")


if __name__ == "__main__":
    main()
