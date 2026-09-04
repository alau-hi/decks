// SUPERWOOD for Data Centers — investor companion to Super Mills America.
// Rebuilt 2026-09-04 from the fresh-look review (reviews/FRESH-LOOK-2026-09-04.md). 20 slides, no dividers.
// node gen.js → SUPERWOOD-for-Data-Centers-Companion.pptx. Charts are matplotlib PNGs (prep/charts/make_charts.py).
import { createRequire } from "module"; const require = createRequire(import.meta.url); // package.json is type:module for the gate
const pptxgen = require("pptxgenjs");
const fs = require("fs");
const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE"; // 13.33 x 7.5

// InventWood palette (no '#')
const INK = "1F150C", PANEL = "261A0F", PANEL2 = "2E2113", CREAM = "F4ECDF", DIM = "CDBFA9",
      MUTED = "9D8D76", WOOD = "B87D44", BRIGHT = "CDA165", GOLD = "E2B877",
      GREEN = "8FB356", TEAL = "5EA9A2", ROSE = "C9706B", RULE = "3A2B1A";
const SERIF = "Georgia", SANS = "Calibri";
const W = 13.33, H = 7.5, L = 0.55, CW = 12.2; // left margin, content width
const LEG_W = 2290, LEG_H = 55; // prep/charts/campus_legend.png pixel size
const pick = (...paths) => paths.find((p) => fs.existsSync(p));

function base(slide, footerText) {
  slide.background = { color: INK };
  if (footerText) {
    slide.addText(footerText, { x: L, y: H - 0.42, w: 6, h: 0.3, fontFace: SANS, fontSize: 9, color: MUTED, margin: 0 });
    slide.addText("Confidential", { x: W - 2.45, y: H - 0.42, w: 1.5, h: 0.3, fontFace: SANS, fontSize: 9, color: MUTED, align: "right", margin: 0 });
  }
  slide.slideNumber = { x: W - 0.75, y: H - 0.42, w: 0.5, fontFace: SANS, fontSize: 9, color: MUTED };
}
function kicker(slide, text, x = L, y = 0.5, w = 8) {
  slide.addText(text.toUpperCase(), { x, y, w, h: 0.32, fontFace: SANS, fontSize: 12, color: BRIGHT, charSpacing: 4, bold: true, margin: 0 });
}
function title(slide, runs, x = L, y = 0.88, w = 11.9, size = 30) {
  slide.addText(runs, { x, y, w, h: 0.95, fontFace: SERIF, fontSize: size, color: CREAM, margin: 0 });
}
function t(text, opts = {}) { return { text, options: opts }; }
function gold(text) { return t(text, { italic: true, color: GOLD }); }
function note(slide, text, y = 6.72, h = 0.35) {
  slide.addText(text, { x: L, y, w: CW, h, fontFace: SANS, fontSize: 8.5, italic: true, color: MUTED, margin: 0, valign: "top" });
}
function panel(slide, x, y, w, h, color = PANEL) {
  slide.addShape(pres.ShapeType.roundRect, { x, y, w, h, rectRadius: 0.09, fill: { color } });
}
function label(slide, text, x, y, w, color = BRIGHT) {
  slide.addText(text.toUpperCase(), { x, y, w, h: 0.26, fontFace: SANS, fontSize: 9, bold: true, color, charSpacing: 1.8, margin: 0 });
}
function body(slide, text, x, y, w, h, size = 11, color = DIM) {
  slide.addText(text, { x, y, w, h, fontFace: SANS, fontSize: size, color, margin: 0, valign: "top" });
}
function conceptTag(slide, x, y, w = 2.6, text = "Concept rendering") {
  slide.addText(text, { x, y, w, h: 0.28, fontFace: SANS, fontSize: 9, italic: true, color: MUTED, align: "right", margin: 0 });
}
function bullets(slide, items, opts) {
  slide.addText(items.map((tx, i) => ({ text: tx, options: { bullet: { code: "2022", indent: 12 }, breakLine: i < items.length - 1, paraSpaceAfter: 6 } })),
    Object.assign({ fontFace: SANS, fontSize: 11, color: DIM, margin: 0, valign: "top" }, opts));
}
let s;

// ---------- 1 · COVER ----------
s = pres.addSlide();
s.background = { path: "prep/campus_hero.jpg" };
s.addShape(pres.ShapeType.rect, { x: 0, y: 4.75, w: W, h: 2.75, fill: { color: "120C07", transparency: 30 } });
s.addImage({ path: "prep/wordmark_cream.png", x: 0.7, y: 5.1, w: 6.2, h: 6.2 * 2615 / 16347 });
s.addText("SUPERWOOD for Data Centers", { x: 0.72, y: 6.2, w: 9, h: 0.6, fontFace: SERIF, italic: true, fontSize: 26, color: GOLD, margin: 0 });
s.addText("Investor companion to Super Mills America  ·  September 2026", { x: 0.72, y: 6.85, w: 8, h: 0.35, fontFace: SANS, fontSize: 12, color: DIM, margin: 0 });
s.addText("INVENTWOOD  ·  CONFIDENTIAL", { x: W - 4.3, y: 7.0, w: 3.6, h: 0.3, fontFace: SANS, fontSize: 9, color: DIM, charSpacing: 3, align: "right", margin: 0 });
s.addText("Concept rendering", { x: W - 2.3, y: 0.25, w: 1.9, h: 0.25, fontFace: SANS, fontSize: 8, italic: true, color: "E8DECB", align: "right", margin: 0 });

// ---------- 2 · THESIS ----------
s = pres.addSlide(); base(s, "InventWood · The thesis");
kicker(s, "The thesis");
title(s, [t("Data centers turn SUPERWOOD from a premium skin into a "), gold("structural"), t(" material")]);
const thesis = [
  ["The buyer is short of steel and already building with wood",
   "Data centers are among the fastest-growing buyers of structural steel. Customers report backlogs and shortages, and Microsoft and Meta already build data-center structures in mass timber."],
  ["We turbocharge the wood they already use",
   "Mass timber replaces concrete floors. SUPERWOOD, stronger than A36 steel in tension at one-sixth the weight, adds the steel: members, skins and screens — and strengthens the mass timber itself. It ships today from SuperMill One; truss design and mass-timber enhancement are under way."],
  ["One basis-of-design win is SuperMill Two-scale demand",
   "A gigawatt campus's skins alone are one to three years of SuperMill One's output; its structure is a year or more of SuperMill Two. The long game is prefabricated envelopes and, eventually, foundations."],
];
thesis.forEach(([head, sub], i) => {
  const cw = 3.95, x = L + i * 4.125, y = 2.1;
  panel(s, x, y, cw, 3.55);
  s.addText(`0${i + 1}`, { x: x + 0.3, y: y + 0.25, w: 1, h: 0.6, fontFace: SERIF, fontSize: 28, color: WOOD, margin: 0 });
  s.addText(head, { x: x + 0.3, y: y + 0.95, w: cw - 0.6, h: 0.9, fontFace: SANS, fontSize: 14.5, bold: true, color: CREAM, margin: 0, valign: "top" });
  body(s, sub, x + 0.3, y + 1.9, cw - 0.6, 1.55, 11, DIM);
});
note(s, "The company, team, mills, cost roadmap and the raise are in Super Mills America. This deck covers one application. Strength: company test data vs ASTM A36; campus sizing: company estimate (slides 5–6).", 6.0, 0.5);

// ---------- 3 · THE BUYER ----------
s = pres.addSlide(); base(s, "InventWood · The buyer");
kicker(s, "The buyer");
title(s, "Data centers are a fast-growing buyer of structural steel, and they are short of it", L, 0.88, 11.9, 27);
s.addImage({ path: "prep/dc_steel_frame.jpg", x: L, y: 2.0, w: 6.3, h: 6.3 * 1536 / 2752, sizing: { type: "crop", w: 6.3, h: 3.52 } });
conceptTag(s, L + 6.3 - 2.6, 5.55);
const buyer = [
  ["500–1,000 t of structural steel per 10 MW", "and 5,000–10,000 m³ of concrete — literature intensities for hyperscale builds. A gigawatt campus carries roughly 50–100 kt of structural steel above the slab."],
  ["Customers report backlogs and a shortage of structural steel", "Supply chain and timeline are the first concern data-center customers raise with us. A domestic material that is lighter to ship and faster to erect answers it directly."],
  ["Campuses are built to a standard basis of design", "Hyperscalers repeat one design campus after campus. A material written into that design is specified again and again."],
];
buyer.forEach(([head, sub], i) => {
  const x = 7.2, y = 2.0 + i * 1.22;
  s.addShape(pres.ShapeType.ellipse, { x, y: y + 0.09, w: 0.14, h: 0.14, fill: { color: GOLD } });
  s.addText(head, { x: x + 0.35, y, w: 5.2, h: 0.34, fontFace: SANS, fontSize: 13, bold: true, color: CREAM, margin: 0 });
  body(s, sub, x + 0.35, y + 0.36, 5.2, 0.85, 10.5, MUTED);
});
note(s, "Steel and concrete intensities: arXiv 2509.21312 (Sep 2025), citing Hasan et al. 2022 and Sharma et al. 2023 — secondary literature figures, ranges as published; per-GW figure is that range × 1,000 MW. Shortage and backlog statements are what data-center customers report to InventWood (2026), not a published statistic.", 6.55, 0.5);

// ---------- 4 · ALREADY BUILDING WITH WOOD — WE TURBOCHARGE WOOD ----------
s = pres.addSlide(); base(s, "InventWood · The buyer");
kicker(s, "The buyer");
title(s, [t("Hyperscalers are already building structures with wood. We "), gold("turbocharge"), t(" wood.")], L, 0.88, 11.9, 26);
label(s, "On the public record", L, 1.95, 4.6);
const pub = [
  ["prep/logo_microsoft.png", 1688 / 360, "prep/ms_clt_datacenter.jpg", "Photo: Microsoft", "Two Northern Virginia datacenters with cross-laminated timber floors on a steel frame — about 35% less embodied carbon than conventional steel construction, 65% less than precast. Gensler; Thornton Tomasetti.", "Microsoft Source, Nov 2024"],
  ["prep/logo_meta.png", 1896 / 382, "prep/meta_aiken_masstimber.jpg", "Photo: Meta", "Mass-timber data-center administrative buildings: Aiken, South Carolina completed 2025 (DPR, SmartLam); Cheyenne and Montgomery under way; about 41% less embodied carbon in the materials substituted.", "Meta Sustainability, 31 Jul 2025"],
];
pub.forEach(([logo, ar, photo, credit, txt, src], i) => {
  const y = 2.3 + i * 2.25, cw = 4.6, ph = 0.92;
  panel(s, L, y, cw, 2.15, PANEL2);
  s.addImage({ path: photo, x: L + 0.15, y: y + 0.12, w: cw - 0.3, h: ph, sizing: { type: "crop", w: cw - 0.3, h: ph } });
  s.addText(credit, { x: L + cw - 1.6, y: y + 0.12 + ph - 0.24, w: 1.4, h: 0.2, fontFace: SANS, fontSize: 7, italic: true, color: "E8DECB", align: "right", margin: 0 });
  const lh = 0.23;
  s.addImage({ path: logo, x: L + 0.25, y: y + ph + 0.2, w: lh * ar, h: lh });
  body(s, txt, L + 0.25, y + ph + 0.48, cw - 0.5, 0.52, 8, DIM);
  s.addText(src, { x: L + 0.25, y: y + 1.95, w: cw - 0.5, h: 0.18, fontFace: SANS, fontSize: 7, italic: true, color: MUTED, margin: 0 });
});
// right: beams, then the comparison
const RX = 5.45, RW = 7.3;
label(s, "What SUPERWOOD adds to the wood they already use", RX, 1.95, RW);
const beams = [
  ["prep/beam_glulam.jpg", "Glulam beam — mass timber today"],
  ["prep/beam_hybrid.jpg", "SUPERWOOD hybrid beam — outer laminations on glulam"],
  ["prep/beam_thin.jpg", "Thin SUPERWOOD beam — laminated from ¼\" boards"],
];
beams.forEach(([img, cap], i) => {
  const bw = (RW - 0.3) / 3, x = RX + i * (bw + 0.15), y = 2.3, bh = 1.3;
  s.addImage({ path: img, x, y, w: bw, h: bh, sizing: { type: "crop", w: bw, h: bh } });
  s.addText(cap, { x, y: y + bh + 0.04, w: bw, h: 0.36, fontFace: SANS, fontSize: 8.5, italic: true, color: i === 0 ? MUTED : BRIGHT, align: "center", margin: 0, valign: "top" });
});
const cmpRows = [
  ["", "Mass timber today (CLT, glulam)", "With SUPERWOOD"],
  ["What it replaces", "Concrete floor slabs and decks; some columns and beams", "Adds the steel: members, skins, screens and fences — and, ahead, enclosures and foundations"],
  ["Strength", "Lumber-grade; large sections carry the load", "Tensile strength above ASTM A36 steel in samples, at one-sixth the weight; thin, dense members"],
  ["The timber itself", "Glulam and CLT at lumber stiffness", "Mass-timber enhancement: SUPERWOOD outer laminations (~10% of section) raise a glulam beam's stiffness ~75% and strength ~100%"],
  ["Exterior use", "Needs protection from weather", "Exterior grade; resists moisture, pests and rot"],
  ["Fire", "Chars; established assemblies", "Chars; far better than ordinary wood — Class A demonstrated in testing"],
  ["Code path", "Established in the building codes", "Certifiable under wood standards today; SUPERWOOD-specific standards are the goal"],
];
const cx = [RX, RX + 1.5, RX + 3.75], cwid = [1.4, 2.15, 3.55];
cmpRows.forEach((r, ri) => {
  const y = 4.05 + ri * 0.385;
  if (ri > 0) s.addShape(pres.ShapeType.rect, { x: RX, y: y - 0.05, w: RW, h: 0.012, fill: { color: RULE } });
  r.forEach((c, ci) => {
    const isHead = ri === 0, isLabel = ci === 0;
    s.addText(isHead ? c.toUpperCase() : c, { x: cx[ci], y, w: cwid[ci], h: 0.36, fontFace: SANS, fontSize: isHead ? 8 : (isLabel ? 9.5 : 8), bold: isHead || isLabel, color: isHead ? BRIGHT : (isLabel ? CREAM : (ci === 2 ? DIM : MUTED)), charSpacing: isHead ? 1.2 : 0, margin: 0, valign: "top" });
  });
});
note(s, "Sources: news.microsoft.com, Nov 2024; Thornton Tomasetti project page; sustainability.atmeta.com, 31 Jul 2025. Logos and photographs are the companies' own, from the cited publications, used to identify the published projects. SUPERWOOD strength: company test data, parallel-to-grain tension. Hybrid-beam gains: derived from beam theory with SUPERWOOD modulus and strength, engineering write-up pending. Beams: concept renderings.", 6.82, 0.3);

// ---------- 5 · WHAT A GW DATA CENTER IS MADE OF ----------
s = pres.addSlide(); base(s, "InventWood · The size");
kicker(s, "The size");
title(s, "What a GW data center is made of", L, 0.88, 11.9, 27);
label(s, "By mass", L, 1.8, 4); label(s, "By embodied carbon", 6.7, 1.8, 4);
const chW = 5.6, chH = chW * 4.3 / 7.0;
s.addImage({ path: "prep/charts/campus_mass_narrow.png", x: L, y: 2.08, w: chW, h: chH });
s.addImage({ path: "prep/charts/campus_carbon_narrow.png", x: 6.7, y: 2.08, w: chW, h: chH });
s.addImage({ path: "prep/charts/campus_legend.png", x: L, y: 2.08 + chH + 0.03, w: CW, h: CW * LEG_H / LEG_W });
const sizeL = [["50–80% of the above-ground portion of a data center is steel", "Structure, envelope and contents — frame, roof, skins, platforms, racks, enclosures, equipment. Skins, screens and fences now; racks, platforms and barriers next (racks are a few months of development away); frame and roofs as structure; server boxes eventually — the electronics never."]];
const sizeR = [["By embodied carbon, steel is about 60% of the building materials", "At the global-average steel factor; about a third with recycled steel. The steel above the slab alone carries roughly 37% of the building materials' embodied carbon — the share SUPERWOOD addresses through the structural horizon."]];
[[sizeL, L], [sizeR, 6.7]].forEach(([arr, x]) => arr.forEach(([head, sub]) => {
  const y = 2.08 + chH + 0.42;
  s.addText(head, { x, y, w: 5.9, h: 0.3, fontFace: SANS, fontSize: 11.5, bold: true, color: CREAM, margin: 0 });
  body(s, sub, x, y + 0.3, 5.9, 0.5, 8.5, MUTED);
}));
note(s, "Company estimate for a 1 GW IT-load campus, high case. Only the concrete and structural-steel intensities are published (arXiv 2509.21312, secondary, conf M); other rows are estimates from unit masses. Carbon factors: steel 1.8 kg CO₂e/kg (global average; recycled 0.4–0.7), concrete 0.12; equipment embodied carbon not estimated. Steel share: company estimate. Model: analyses/materials-mass-and-replacement.xlsx.", 6.78, 0.3);

// ---------- 6 · WHAT ONE GIGAWATT IS WORTH ----------
s = pres.addSlide(); base(s, "InventWood · The size");
kicker(s, "The size");
title(s, "What one gigawatt of campus is worth to InventWood", L, 0.88, 11.9, 27);
s.addImage({ path: "prep/charts/worth.png", x: L, y: 1.9, w: 5.9, h: 5.9 * 4.2 / 8.6 });
const worthCols = ["Horizon", "Incumbent replaced", "SUPERWOOD required", "Plant-years"];
const worthRows = [
  ["Now — skins, screens, fences", "3.3–12 kt", "1.2–2.7 kt (1.4–3.1M sf)", "1.4–3.1 yr of SuperMill One"],
  ["Next — racks, platforms, barriers", "12–30 kt", "3.5–18 kt", "0.1–0.6 yr of SuperMill Two"],
  ["Structural — frame, roofs, enclosures", "53–108 kt", "16–65 kt", "0.5–2.1 yr of SuperMill Two"],
  ["Long-term vision — slab, foundations, server boxes", "1,002–2,089 kt", "58–363 kt", "1.9–12 yr of SuperMill Two"],
];
const wx = [6.7, 8.95, 10.15, 11.5], ww = [2.15, 1.1, 1.25, 1.3];
worthCols.forEach((c, i) => s.addText(c.toUpperCase(), { x: wx[i], y: 1.9, w: ww[i], h: 0.45, fontFace: SANS, fontSize: 7.5, bold: true, color: BRIGHT, charSpacing: 1, margin: 0, valign: "bottom" }));
worthRows.forEach((r, ri) => {
  const y = 2.45 + ri * 0.72;
  s.addShape(pres.ShapeType.rect, { x: 6.7, y: y - 0.06, w: 6.1, h: 0.012, fill: { color: RULE } });
  r.forEach((c, ci) => s.addText(c, { x: wx[ci], y, w: ww[ci], h: 0.62, fontFace: SANS, fontSize: ci === 0 ? 10 : 9.5, bold: ci === 0 || ci === 3, color: ci === 0 ? CREAM : (ci === 3 ? GOLD : DIM), margin: 0, valign: "top" }));
});
panel(s, L, 5.05, CW, 0.85, PANEL);
s.addText([
  t("Two or three gigawatts of campus absorb SuperMill Two for years.  ", { bold: true, color: GOLD }),
  t("That is the offtake argument and the capacity risk in one number — and why a basis-of-design win with one hyperscaler is the demand anchor for the second mill.", { color: DIM }),
], { x: L + 0.3, y: 5.13, w: CW - 0.6, h: 0.7, fontFace: SANS, fontSize: 11.5, margin: 0, valign: "middle" });
note(s, "Quantities: company estimate (slide 5 model; low–high scenarios). Incumbent replaced is steel except the long-term row (concrete, rebar, and server enclosures at 40% of IT mass — estimate; electronics excluded). SUPERWOOD required uses a 0.3–0.6 substitution factor for steel (estimate, to be engineering-stamped per element). Plant output: SuperMill One ≈ 0.9 kt/yr (1M sf), SuperMill Two ≈ 31 kt/yr (36M sf) at 0.87 kg/sf, 1.3 t/m³. Pricing is set per application; see Super Mills America for the cost roadmap.", 6.05, 0.75);

// ---------- 7 · PROCESS ----------
s = pres.addSlide(); base(s, "InventWood · The fit");
kicker(s, "The fit");
title(s, [t("We unlock the power of "), gold("cellulose")]);
s.addText("Our patented process transforms ordinary wood into SUPERWOOD — an environmentally benign process using chemistry common to food and pulp processing.",
  { x: L, y: 1.85, w: CW, h: 0.4, fontFace: SANS, fontSize: 13, color: DIM, margin: 0 });
const flow = [
  ["01 · Start with woody feedstock", "Hardwoods, softwoods, bamboo, underutilized species, waste wood", "prep/feed-timber.jpg", "Before: open cell vessels"],
  ["02 · Molecular re-engineering & densification", "3–4× density increase, elimination of pores and defects, new hydrogen bonds across fibers", "prep/proc-compress.png", "No added glues · No polymer binders"],
  ["03 · SUPERWOOD", "Samples more than 50% stronger than A36 steel in tension, at one-sixth the weight", "media/image75.png", "After: collapsed, interlocking vessels"],
];
flow.forEach(([head, sub, img, cap], i) => {
  const cw = 3.85, x = L + i * 4.2;
  s.addText(head, { x, y: 2.4, w: cw, h: 0.55, fontFace: SANS, fontSize: 11, bold: true, color: BRIGHT, charSpacing: 1, margin: 0 });
  body(s, sub, x, 2.95, cw, 0.6, 10.5, MUTED);
  s.addImage({ path: img, x, y: 3.7, w: cw, h: 2.35, sizing: { type: "crop", w: cw, h: 2.35 } });
  s.addText(cap, { x, y: 6.15, w: cw, h: 0.35, fontFace: SANS, fontSize: 9.5, italic: true, color: i === 1 ? BRIGHT : MUTED, align: "center", margin: 0 });
  if (i < 2) s.addText("→", { x: x + cw + 0.01, y: 4.6, w: 0.35, h: 0.5, fontFace: SERIF, fontSize: 22, color: GOLD, margin: 0 });
});

// ---------- 8 · STRENGTH ----------
s = pres.addSlide(); base(s, "InventWood · The fit");
kicker(s, "The fit");
title(s, [t("The "), gold("strength"), t(" of SUPERWOOD, one number set")]);
const stats = [
  ["500 MPa", "tensile strength in production today"],
  ["600+ MPa", "demonstrated in lab samples; pathway toward 1,000"],
  ["1/6", "the weight of steel"],
  ["7–9×", "the strength-to-weight ratio of A36 steel, derived below"],
];
stats.forEach(([big, small], i) => {
  const cw = 3.0, x = L + i * 3.11;
  s.addText(big, { x, y: 1.95, w: cw, h: 0.7, fontFace: SERIF, fontSize: 32, color: GOLD, margin: 0 });
  s.addText(small, { x, y: 2.68, w: cw - 0.3, h: 0.6, fontFace: SANS, fontSize: 11.5, color: DIM, margin: 0 });
});
s.addImage({ path: "prep/charts/strength.png", x: 1.5, y: 3.4, w: 7.2, h: 7.2 * 3.6 / 8.2 });
panel(s, 9.0, 3.4, 3.75, 3.15, PANEL);
label(s, "How the ratios are derived", 9.25, 3.55, 3.3);
body(s, "Strength: 500–600 MPa SUPERWOOD ÷ 400 MPa (A36 minimum ultimate tensile) = 1.25–1.5×.\n\nWeight: steel 7.85 t/m³ ÷ SUPERWOOD ~1.3 t/m³ ≈ 6×.\n\nStrength-to-weight: 1.25–1.5 × 6 ≈ 7–9×.\n\nAgainst the top of the A36 range (550 MPa) the strength ratio is 0.9–1.1×; “stronger than steel” is stated against the A36 minimum.", 9.25, 3.9, 3.3, 2.6, 9.5, DIM);
note(s, "SUPERWOOD: parallel-to-grain tension, company test data (production QC and lab samples). Steel: ASTM A36 specifies 400–550 MPa ultimate tensile. Aluminum: 6061-T6, 310 MPa typical. Design values and test methods available on request.", 6.65, 0.4);

// ---------- 9 · PROPERTIES ----------
s = pres.addSlide(); base(s, "InventWood · The fit");
kicker(s, "The fit");
title(s, "Properties that matter on a data center campus");
s.addImage({ path: "prep/prod-board.jpg", x: L, y: 1.95, w: 4.0, h: 4.0 * 427 / 640 });
s.addText([
  t("Stronger than steel.\n", { color: CREAM }),
  t("One-sixth the weight.\n", { color: GOLD }),
  t("Made from wood, in America.", { color: CREAM }),
], { x: L, y: 4.85, w: 4.0, h: 1.7, fontFace: SERIF, fontSize: 19, bold: true, margin: 0, valign: "top" });
const props = [
  ["icon_fire", "Fire performance", "Chars rather than burns — far better in fire than ordinary wood. ASTM E84 Class A demonstrated in testing; specified per order"],
  ["icon_shield", "Durable and impact resistant", "Harder and more dent-resistant than oak; impact and storm resistant — suited to fences, screens and door protection"],
  ["icon_droplet", "Resists moisture, pests and rot", "Exterior grade for facades, yards and fences; no rust; resists termites, mold and fungus"],
  ["icon_thermo", "Insulating, not conducting", "Thermal and electrical insulator — no thermal bridging, and non-conductive around electrical infrastructure"],
  ["icon_vibration_cream", "Sound and vibration damping", "Better damping than steel — the basis for acoustic barriers and equipment screens"],
  ["icon_rf", "RF transparent", "Useful in niches: antenna screening, timing-antenna enclosures, telecom shelters"],
  ["icon_leaf", "Naturally beautiful", "The texture, colors and warmth of wood — the biophilic, community-facing surface"],
];
props.forEach(([icon, head, sub], i) => {
  const y = 1.95 + i * 0.68;
  s.addImage({ path: `prep/${icon}.png`, x: 5.05, y: y + 0.03, w: 0.34, h: 0.34 });
  s.addText(head.toUpperCase(), { x: 5.6, y, w: 7.2, h: 0.28, fontFace: SANS, fontSize: 11.5, bold: true, color: CREAM, charSpacing: 1, margin: 0 });
  body(s, sub, 5.6, y + 0.29, 7.2, 0.38, 9.5, MUTED);
});
note(s, "Company test data; property data package and test methods available on request. Fire: Class A is a demonstrated capability, not a rating carried by every board.", 6.7, 0.35);

// ---------- 10 · SPEED AND MODULARITY ----------
s = pres.addSlide(); base(s, "InventWood · The fit");
kicker(s, "The fit");
title(s, [t("Speed is the data-center benefit: lighter, "), gold("prefabricated"), t(", reconfigurable")], L, 0.88, 11.9, 27);
const speed = [
  ["One-sixth the weight of steel", "Smaller cranes and crews, easier transport, lighter foundations. Time to power is the metric hyperscalers optimize."],
  ["Prefabricated to precision", "Panels and modules built off site and set like mass timber — standardized designs, plug-and-play systems."],
  ["Designed for assembly and disassembly", "Reusable, reconfigurable components for infrastructure that changes with every hardware generation."],
  ["Mass timber's schedule record", "About 20% average schedule savings across seven case studies, up to 25–30% in others. SUPERWOOD builds the same way."],
];
speed.forEach(([head, sub], i) => {
  const y = 2.0 + i * 1.1;
  s.addText(`0${i + 1}`, { x: L, y, w: 0.8, h: 0.6, fontFace: SERIF, fontSize: 22, color: WOOD, margin: 0 });
  s.addText(head, { x: 1.35, y, w: 5.6, h: 0.36, fontFace: SANS, fontSize: 14, bold: true, color: CREAM, margin: 0 });
  body(s, sub, 1.35, y + 0.38, 5.6, 0.7, 10.5, MUTED);
});
s.addImage({ path: "prep/dc_prefab_lift.jpg", x: 7.3, y: 2.0, w: 5.45, h: 5.45 * 1536 / 2752 });
conceptTag(s, 7.3 + 5.45 - 2.6, 5.08);
note(s, "Schedule figures are mass-timber case studies (ULI Urban Land: ~20% average across seven case studies, 12.7 vs 15.4 months; other studies 25–30%), used as an analogy for a material that builds the same way. No SUPERWOOD schedule data yet.", 6.55, 0.5);

// ---------- 11 · NOW ----------
s = pres.addSlide(); base(s, "InventWood · The path");
kicker(s, "The path · Now");
title(s, "Now: skins, screens and fences from SuperMill One");
s.addText("Every item below ships today as boards up to 8\" × 16' × 3/8\", exterior or interior grade. SuperMill One makes about one million square feet a year across all markets.",
  { x: L, y: 1.85, w: CW, h: 0.45, fontFace: SANS, fontSize: 12, color: DIM, margin: 0 });
const nowTiles = [
  ["tile_cladding", "Facades, cladding & rain screens"],
  ["tile_lobby", "Biophilic interiors for office space"],
  ["tile_louvers2", "Louvers & equipment screening"],
  ["tile_fence_staff", "Fencing for staff outdoor spaces"],
  ["tile_fence_security", "Security fencing around transformers & outdoor infrastructure"],
  ["tile_doorkick", "Trim, door kicks & sub-framing"],
];
{
  const cw = CW / nowTiles.length, rowY = 2.55;
  nowTiles.forEach(([img, lab], j) => {
    const x = L + j * cw;
    s.addImage({ path: `prep/tiles/${img}.jpg`, x: x + (cw - 1.6) / 2, y: rowY, w: 1.6, h: 1.6 });
    s.addText(lab, { x: x + 0.05, y: rowY + 1.7, w: cw - 0.1, h: 0.8, fontFace: SANS, fontSize: 10.5, color: DIM, align: "center", margin: 0, valign: "top" });
  });
}
panel(s, L, 5.3, CW, 1.15, PANEL);
s.addText([
  t("Why these first.  ", { bold: true, color: GOLD }),
  t("They need no assembly fire rating — where a finish rating applies, Class A has been demonstrated and is specified per order. They sit where the community and the workforce see the campus. And they are the near-term projects our hyperscaler customers asked for: facades, biophilic office interiors, staff-area fencing, security fencing around critical outdoor infrastructure.", { color: DIM }),
], { x: L + 0.3, y: 5.4, w: CW - 0.6, h: 0.95, fontFace: SANS, fontSize: 11, margin: 0, valign: "middle" });
conceptTag(s, W - 3.6, 6.6, 3.0, "Concept renderings");

// ---------- 12 · NEXT ----------
s = pres.addSlide(); base(s, "InventWood · The path");
kicker(s, "The path · Next");
title(s, "Next: applications one test program away");
const gated = [
  ["tile_barrier", "Acoustic barrier walls & equipment screens", "Acoustic performance data"],
  ["tile_walkway", "Walkways & platforms", "Load and connection data"],
  ["tile_railing2", "Railings", "Load testing to code"],
  ["tile_mullion2", "Window mullions", "Thermal and structural data"],
  ["tile_door", "Interior doors & door protection", "Listing for rated openings"],
  ["tile_backplane", "Equipment backplanes", "Electrical-room listing"],
  ["tile_rackocp", "Racks & equipment supports", "A few months of design and load-data development"],
];
{
  const cw = CW / gated.length, rowY = 2.1;
  gated.forEach(([img, lab, gate], j) => {
    const x = L + j * cw;
    s.addImage({ path: `prep/tiles/${img}.jpg`, x: x + (cw - 1.5) / 2, y: rowY, w: 1.5, h: 1.5 });
    s.addText(lab, { x: x + 0.05, y: rowY + 1.6, w: cw - 0.1, h: 0.62, fontFace: SANS, fontSize: 10.5, bold: true, color: CREAM, align: "center", margin: 0, valign: "top" });
    s.addText("WHAT IT NEEDS", { x: x + 0.05, y: rowY + 2.28, w: cw - 0.1, h: 0.22, fontFace: SANS, fontSize: 8, bold: true, color: BRIGHT, charSpacing: 1.5, align: "center", margin: 0 });
    s.addText(gate, { x: x + 0.05, y: rowY + 2.52, w: cw - 0.1, h: 0.6, fontFace: SANS, fontSize: 9.5, color: MUTED, align: "center", margin: 0, valign: "top" });
  });
}
panel(s, L, 5.5, CW, 0.85, PANEL);
s.addText("Each of these is a scoped test program, not a research question — and the natural first co-funded project with a customer. Which comes first depends on which a customer picks up first.",
  { x: L + 0.3, y: 5.55, w: CW - 0.6, h: 0.75, fontFace: SANS, fontSize: 11.5, italic: true, color: DIM, margin: 0, valign: "middle" });
conceptTag(s, W - 3.6, 6.6, 3.0, "Concept renderings");

// ---------- 13 · STRUCTURAL ----------
s = pres.addSlide(); base(s, "InventWood · The path");
kicker(s, "The path · Structural");
title(s, [t("Structural: starting "), gold("now"), t(", scaling with SuperMill Two")]);
// left: under way now
panel(s, L, 1.95, 4.6, 3.55, PANEL2);
label(s, "Under way from today's boards", L + 0.3, 2.1, 4.0, GOLD);
s.addImage({ path: "prep/tiles/tile_truss2.jpg", x: L + 0.3, y: 2.45, w: 1.5, h: 1.5 });
body(s, "Structural work has begun. Truss design is starting, and mass-timber enhancement — SUPERWOOD laminations that stiffen and strengthen glulam and CLT-type members — is under way. We expect structural sales on the way to SuperMill Two.\n\nReplacing structural steel is the first thing new data-center customers ask about.", L + 2.0, 2.45, 2.9, 3.0, 10.5, DIM);
// right: at SuperMill Two scale
label(s, "At SuperMill Two scale", 5.5, 2.1, 6.0);
const sm2 = [
  ["tile_spaceframe", "Building enclosures & structural components", "The co-development target with hyperscaler architects and engineers"],
  ["tile_truss2", "Trusses, roofs & long-span members", "Roof structure first; fast-to-build enclosures follow"],
  ["tile_clt", "CLT-type floor, roof & wall assemblies", "Thin, far stronger panels through the mass-timber product route"],
  ["tile_rackocp", "Heavy equipment supports & server enclosures", "Racks come next, a few months of development; enclosures for servers and equipment follow — the electronics stay"],
];
sm2.forEach(([img, head, sub], i) => {
  const col = i % 2, row = Math.floor(i / 2);
  const cw = 3.55, x = 5.5 + col * 3.7, y = 2.45 + row * 1.55;
  s.addImage({ path: `prep/tiles/${img}.jpg`, x, y, w: 1.25, h: 1.25 });
  s.addText(head, { x: x + 1.4, y, w: cw - 1.4, h: 0.55, fontFace: SANS, fontSize: 11, bold: true, color: CREAM, margin: 0, valign: "top" });
  body(s, sub, x + 1.4, y + 0.6, cw - 1.4, 0.65, 9, MUTED);
});
panel(s, L, 5.7, CW, 0.9, PANEL);
s.addText([
  t("How qualification works.  ", { bold: true, color: GOLD }),
  t("Every structural application is qualified through a scoped test program with the customer who picks it up first, on the pathway mass timber has already opened in the building codes, with insurer acceptance for structural use. Test methods and property data are available on request. This is the Microsoft and Google conversation, and it is SuperMill Two-scale demand.", { color: DIM }),
], { x: L + 0.3, y: 5.75, w: CW - 0.6, h: 0.8, fontFace: SANS, fontSize: 10.5, margin: 0, valign: "middle" });
conceptTag(s, W - 3.6, 6.65, 3.0, "Concept renderings");

// ---------- 14 · THE LONG-TERM VISION ----------
s = pres.addSlide(); base(s, "InventWood · The path");
kicker(s, "The path · The long game");
title(s, [t("Where this goes: prefabricated "), gold("envelopes"), t(", then foundations")]);
const vis = [
  ["prep/app_shell.jpg", 1200 / 896, "Prefabricated building envelopes", "Structure and skin shipped as panels and modules and set in days — the co-development target with our hyperscaler customers' architects and engineers. Optimized shells that carry their own loads, weigh a fraction of steel and precast, and can be taken apart and moved."],
  ["prep/dc_wood_foundation.jpg", 1376 / 768, "Foundations, slabs and paving", "Lightweight, insulated SUPERWOOD foundations and slabs in place of concrete — installed faster, with lower geotechnical demands, and potentially movable. Concrete is three-quarters of a campus by mass; this is where the material would change the whole building."],
];
vis.forEach(([img, ar, head, sub], i) => {
  const cw = 6.0, x = L + i * 6.2, y = 1.95, ih = 2.55;
  s.addImage({ path: img, x, y, w: cw, h: ih, sizing: { type: "crop", w: cw, h: ih } });
  s.addText(head, { x, y: y + ih + 0.15, w: cw, h: 0.38, fontFace: SANS, fontSize: 14, bold: true, color: CREAM, margin: 0 });
  body(s, sub, x, y + ih + 0.55, cw, 1.05, 10.5, MUTED);
});
panel(s, L, 6.15, CW, 0.6, PANEL2);
s.addText("Stated technical potential, not an engineered plan: through the structural horizon SUPERWOOD addresses about 5% of campus mass; foundations and slabs would raise the ceiling to about three-quarters — on the order of 1–2 million tonnes of concrete and rebar per gigawatt. No design or code pathway exists yet.",
  { x: L + 0.3, y: 6.15, w: CW - 0.6, h: 0.6, fontFace: SANS, fontSize: 9.5, italic: true, color: DIM, margin: 0, valign: "middle" });
conceptTag(s, W - 3.6, 4.5, 3.0, "Concept renderings");

// ---------- 15 · EVERY ACCOUNT ON ONE LADDER ----------
s = pres.addSlide(); base(s, "InventWood · The evidence");
kicker(s, "The evidence");
title(s, "Every account on one ladder");
const stages = ["Conversations", "Applications identified", "Projects scoped", "Testing & mockups", "First purchase", "Basis of design"];
const gx = 3.6, gw = 5.4, sw = gw / stages.length, rowY0 = 2.45, rowH = 0.78;
stages.forEach((st, i) => s.addText(st.toUpperCase(), { x: gx + i * sw, y: 1.85, w: sw, h: 0.55, fontFace: SANS, fontSize: 6.5, bold: true, color: BRIGHT, charSpacing: 0.5, align: "center", margin: 0, valign: "bottom" }));
const accounts = [
  ["Microsoft", 2, "Facades, biophilic interiors, staff and security fencing under discussion; roof-truss and enclosure work with their architecture and engineering firms; interest in SUPERWOOD in the basis of design", "First skin project on one building or yard"],
  ["Meta", 2, "Engaged for over a year across the data-center ecosystem; facade applications and backplanes under way; structural applications and racking to follow", "Backplane listing; first facade project"],
  ["Google", 1, "Engagement just begun; initial focus on replacement of structural steel", "Scope with their design teams"],
  ["Vertiv · Wooden Data Center", 0, "Equipment and modular data-center builders exploring SUPERWOOD components", "Identify first applications"],
  ["Data center operators", 0, "Operators focused on security fencing around outdoor infrastructure", "Fence specification and quote"],
];
accounts.forEach(([name, stage, what, next], r) => {
  const y = rowY0 + r * rowH;
  s.addShape(pres.ShapeType.rect, { x: L, y: y - 0.08, w: CW, h: 0.012, fill: { color: RULE } });
  s.addText(name, { x: L, y, w: 2.9, h: 0.6, fontFace: SANS, fontSize: 12, bold: true, color: CREAM, margin: 0, valign: "top" });
  // ladder track and marker
  s.addShape(pres.ShapeType.rect, { x: gx, y: y + 0.24, w: gw, h: 0.04, fill: { color: RULE } });
  s.addShape(pres.ShapeType.rect, { x: gx, y: y + 0.24, w: sw * stage + sw / 2, h: 0.04, fill: { color: WOOD } });
  s.addShape(pres.ShapeType.ellipse, { x: gx + sw * stage + sw / 2 - 0.11, y: y + 0.15, w: 0.22, h: 0.22, fill: { color: GOLD } });
  s.addText(what, { x: gx + gw + 0.3, y: y - 0.02, w: 3.35, h: 0.72, fontFace: SANS, fontSize: 8, color: DIM, margin: 0, valign: "top" });
  s.addText("Next: " + next, { x: gx - 0.05, y: y + 0.38, w: gw + 0.1, h: 0.3, fontFace: SANS, fontSize: 8, italic: true, color: MUTED, margin: 0, align: "left" });
});
s.addText("WHAT THEY ARE DOING WITH US", { x: gx + gw + 0.3, y: 1.85, w: 3.35, h: 0.55, fontFace: SANS, fontSize: 6.5, bold: true, color: BRIGHT, charSpacing: 0.5, margin: 0, valign: "bottom" });
panel(s, L, 6.35, CW, 0.58, PANEL2);
s.addText([
  t("ENGINEERING AND CONSTRUCTION PARTNERS  ", { bold: true, color: BRIGHT, fontSize: 8.5, charSpacing: 1.5 }),
  t("Fast + Epp has run over a thousand small-scale experiments on SUPERWOOD, funded by the Canadian government · Timber Engineering (structural engineering) · HITT and Turner, contractors, are advocates — they build, they do not specify", { color: CREAM, fontSize: 9.5 }),
], { x: L + 0.3, y: 6.35, w: CW - 0.6, h: 0.58, fontFace: SANS, margin: 0, valign: "middle" });
note(s, "Engagement stages and partner statements as reported by InventWood, September 2026; next steps undated. Public-record backup for Microsoft and Meta on the next slide.", 6.97, 0.3);

// ---------- 16 · MICROSOFT AND META, ON THE RECORD AND WITH US ----------
s = pres.addSlide(); base(s, "InventWood · The evidence");
kicker(s, "The evidence");
title(s, "Microsoft and Meta: on the record, and with us");
const profiles = [
  ["Microsoft", "broad engagement",
   "Two Northern Virginia datacenters built with cross-laminated timber floor panels on a steel frame — an estimated 35% embodied-carbon reduction vs. conventional steel construction and 65% vs. precast concrete. Design by Gensler; structural engineering by Thornton Tomasetti.",
   "Microsoft Source, Nov 2024; Thornton Tomasetti project page",
   [["Strategic interest", "Incorporating SUPERWOOD into the basis of design for future data centers"],
    ["Application areas", "Roof trusses, leading to roofs and fast-to-build enclosures — with their principal architecture and engineering firms"],
    ["Immediate opportunities", "Building facades · biophilic interiors · staff-area fencing · security fencing around transformers"]],
   "prep/tiles/tile_fence_security.jpg", "Concept rendering — security fencing around a transformer yard"],
  ["Meta", "engaged for over a year",
   "Piloting mass timber for data center administrative buildings: first completed in 2025 at Aiken, South Carolina (DPR, SmartLam); projects under way in Cheyenne, Wyoming and Montgomery, Alabama — about a 41% reduction in the embodied carbon of the materials substituted.",
   "Meta Sustainability, 31 Jul 2025",
   [["Broad engagement", "Across every part of the data-center ecosystem, for more than a year"],
    ["Under way", "Facade applications and equipment backplanes"],
    ["Next", "Structural applications and racking over time"]],
   "prep/tiles/tile_backplane.jpg", "Concept rendering — equipment backplane in an electrical room"],
];
profiles.forEach(([name, stage, pubTxt, src, pts, img, cap], i) => {
  const cw = 6.0, x = L + i * 6.2;
  s.addText([t(name), t("  " + stage, { italic: true, color: GOLD, fontSize: 14 })], { x, y: 1.9, w: cw, h: 0.5, fontFace: SERIF, fontSize: 22, color: CREAM, margin: 0 });
  panel(s, x, 2.5, cw, 1.45, PANEL2);
  label(s, "On the public record", x + 0.25, 2.58, 4, BRIGHT);
  body(s, pubTxt, x + 0.25, 2.85, cw - 0.5, 0.85, 9, CREAM);
  s.addText(src, { x: x + 0.25, y: 3.68, w: cw - 0.5, h: 0.22, fontFace: SANS, fontSize: 7.5, italic: true, color: MUTED, margin: 0 });
  label(s, "Working with InventWood", x, 4.1, 4, BRIGHT);
  pts.forEach(([h, sub], k) => {
    const y = 4.42 + k * 0.62;
    s.addShape(pres.ShapeType.ellipse, { x, y: y + 0.07, w: 0.12, h: 0.12, fill: { color: GOLD } });
    s.addText(h, { x: x + 0.3, y, w: 4.1, h: 0.26, fontFace: SANS, fontSize: 11, bold: true, color: CREAM, margin: 0 });
    body(s, sub, x + 0.3, y + 0.27, 4.1, 0.38, 9, MUTED);
  });
  s.addImage({ path: img, x: x + cw - 1.5, y: 4.42, w: 1.5, h: 1.5 });
  s.addText(cap, { x: x + cw - 2.6, y: 5.97, w: 2.6, h: 0.4, fontFace: SANS, fontSize: 7.5, italic: true, color: MUTED, align: "right", margin: 0 });
});
note(s, "Engagement statements as reported by InventWood, September 2026. Sources: news.microsoft.com, Nov 2024; thorntontomasetti.com; sustainability.atmeta.com, 31 Jul 2025.", 6.6, 0.4);

// ---------- 17 · THE CARBON CLAIM ----------
s = pres.addSlide(); base(s, "InventWood · Carbon");
kicker(s, "Carbon");
title(s, "The carbon claim, sized and labeled: a projection until the LCA lands", L, 0.88, 11.9, 27);
// bars: kg CO2e per kg of material
const bars = [
  ["Steel — global average (BF-BOF)", 1.8, ROSE, "1.8 kg"],
  ["Steel — recycled (EAF), what hyperscalers increasingly buy", 0.7, "A0714E", "0.4–0.7 kg"],
  ["SUPERWOOD — manufacturing, projected", 0.5, GREEN, "0.5 kg"],
];
label(s, "kg CO₂e per kg of material, cradle to gate", L, 1.95, 6);
const bx = L, bw = 5.2, bScale = bw / 1.8;
bars.forEach(([lab, v, colr, txt], i) => {
  const y = 2.35 + i * 0.95;
  s.addText(lab, { x: bx, y, w: 6.4, h: 0.3, fontFace: SANS, fontSize: 10.5, color: CREAM, margin: 0 });
  s.addShape(pres.ShapeType.rect, { x: bx, y: y + 0.34, w: bw, h: 0.3, fill: { color: RULE } });
  if (i === 1) s.addShape(pres.ShapeType.rect, { x: bx, y: y + 0.34, w: 0.4 * bScale, h: 0.3, fill: { color: colr } });
  s.addShape(pres.ShapeType.rect, { x: bx, y: y + 0.34, w: v * bScale, h: 0.3, fill: { color: colr, transparency: i === 1 ? 45 : 0 } });
  s.addText(txt, { x: bx + v * bScale + 0.12, y: y + 0.3, w: 1.2, h: 0.38, fontFace: SERIF, fontSize: 14, bold: true, color: CREAM, margin: 0, valign: "middle" });
});
panel(s, L, 5.25, 6.4, 1.2, PANEL2);
s.addText([
  t("Biogenic carbon, reported separately.  ", { bold: true, color: GOLD }),
  t("SUPERWOOD stores about 1.3 kg CO₂e of biogenic carbon per kg. Under EN 15804 it is released again in the end-of-life module, so it nets to zero over the life cycle. The durable advantage is manufacturing emissions, not storage.", { color: DIM }),
], { x: L + 0.25, y: 5.3, w: 5.9, h: 1.1, fontFace: SANS, fontSize: 10, margin: 0, valign: "middle" });
// right: functional unit
panel(s, 7.3, 1.95, 5.45, 4.5, PANEL);
label(s, "Per functional unit — replacing one tonne of steel", 7.55, 2.1, 5.0, BRIGHT);
body(s, "SUPERWOOD needed: 0.3–0.6 t per tonne of steel replaced (substitution factor, estimate — to be engineering-stamped per element).\n\nSUPERWOOD manufacturing emissions: 0.3–0.6 t × 0.5 = 0.15–0.30 t CO₂e.\n\nAgainst average steel (1.8 t): a reduction of 83–92%.\n\nAgainst recycled steel (0.4–0.7 t): a reduction of 25–79%.\n\nAny stated reduction must name its steel baseline and its substitution factor. Both are shown here; neither is yet verified.", 7.55, 2.45, 5.0, 3.0, 10.5, DIM);
s.addText("Pre-LCA projection for a full-scale plant. LCA under way with Prof. Ming Hu, University of Notre Dame.", { x: 7.55, y: 5.55, w: 5.0, h: 0.8, fontFace: SANS, fontSize: 10.5, bold: true, color: CREAM, margin: 0, valign: "top" });
note(s, "SUPERWOOD 0.5 kg/kg manufactured and 1.3 kg/kg biogenic: company projections, pre-LCA. Steel 1.8 kg/kg: global BF-BOF average. EAF 0.4–0.7 kg/kg: typical published range for recycled-scrap steel [conf: M]. Substitution factor 0.3–0.6: company estimate. Reductions are arithmetic on these inputs.", 6.6, 0.45);

// ---------- 18 · RISKS ----------
s = pres.addSlide(); base(s, "InventWood · Risks");
kicker(s, "Risks");
title(s, "What has to be true, and what could stop it");
const risks = [
  ["Insurers and code officials must accept SUPERWOOD for structural use", "Start with skins and non-structural items that need no assembly rating. Qualify structural applications with the first customer, on the pathway mass timber opened."],
  ["Qualification could run longer than customer design cycles", "Sell what needs no qualification now. Hyperscalers design campuses years ahead, so basis-of-design work starts before qualification ends."],
  ["One plant, shared across every market", "SuperMill One allocates output; a gigawatt's skins alone are one to three plant-years. SuperMill Two is the answer — and the raise."],
  ["Price against metal panel, fiber cement, CLT and recycled steel", "Premium skins where appearance and community acceptance carry value. Structural competitiveness arrives with SuperMill Two cost (roadmap basis, not yet realized)."],
  ["Carbon figures are projections until the LCA lands", "Labeled pre-LCA everywhere; LCA under way with Prof. Ming Hu, University of Notre Dame. No carbon claim without its baseline and substitution factor."],
  ["Customer concentration", "Three hyperscalers plus Vertiv, Wooden Data Center and operators — and what is qualified for a data center is qualified for the wider structural market."],
];
label(s, "Risk", L, 1.95, 4, BRIGHT); label(s, "How we handle it", 6.25, 1.95, 5, BRIGHT);
risks.forEach(([r, m], i) => {
  const y = 2.3 + i * 0.72;
  s.addShape(pres.ShapeType.rect, { x: L, y: y - 0.07, w: CW, h: 0.012, fill: { color: RULE } });
  s.addText(r, { x: L, y, w: 5.4, h: 0.62, fontFace: SANS, fontSize: 11, bold: true, color: CREAM, margin: 0, valign: "top" });
  body(s, m, 6.25, y, 6.5, 0.62, 10, DIM);
});
note(s, "No probabilities are assigned; these are the conditions the data-center thesis depends on, stated so they can be tracked.", 6.75, 0.3);

// ---------- 19 · PATH TO FIRST PROJECTS ----------
s = pres.addSlide(); base(s, "InventWood · The path");
kicker(s, "The path");
title(s, "A concrete path to first projects");
const nexts = [
  ["Skins on one building or yard", "Facades, interiors, louvers, staff-area or security fencing — installed from SuperMill One output on a friendly site. Produces an installed reference and installed-cost data."],
  ["A scoped test program with that customer", "Toward whatever the chosen application needs, co-funded. Produces the data package the next application inherits."],
  ["Basis-of-design work with the customer's architect and engineer", "Structural enclosure and truss solutions that can be written into the standard campus design. Produces a specification that repeats."],
  ["Measure the carbon delta", "A baseline bill-of-materials comparison and verification plan. Produces defensible numbers as the LCA completes."],
];
nexts.forEach(([head, sub], i) => {
  const y = 2.0 + i * 1.1;
  s.addText(`${i + 1}`, { x: L, y, w: 0.6, h: 0.55, fontFace: SERIF, fontSize: 26, color: WOOD, margin: 0 });
  s.addText(head, { x: 1.4, y, w: 7.3, h: 0.4, fontFace: SANS, fontSize: 15, bold: true, color: CREAM, margin: 0 });
  body(s, sub, 1.4, y + 0.42, 7.3, 0.65, 10.5, MUTED);
});
s.addImage({ path: "prep/factory.jpg", x: 9.3, y: 2.0, w: 3.5, h: 3.5 * 900 / 1600 });
s.addText("SuperMill One, Frederick, MD", { x: 9.3, y: 4.0, w: 3.5, h: 0.3, fontFace: SANS, fontSize: 10.5, italic: true, color: MUTED, align: "center", margin: 0 });
s.addImage({ path: "media/image111.png", x: 9.3, y: 4.4, w: 3.5, h: 1.84, sizing: { type: "crop", w: 3.5, h: 1.84 } });
s.addText("Concept for SuperMill Two", { x: 9.3, y: 6.3, w: 3.5, h: 0.3, fontFace: SANS, fontSize: 10.5, italic: true, color: MUTED, align: "center", margin: 0 });
note(s, "Steps are sequenced, not dated. Each names what it produces.", 6.75, 0.3);

// ---------- 20 · CLOSE ----------
s = pres.addSlide();
s.background = { path: "prep/cover_bg.jpg" };
s.addText([t("Let's build what's "), gold("next"), t(".")], { x: 1.0, y: 2.6, w: 10, h: 1.0, fontFace: SERIF, fontSize: 44, color: CREAM, margin: 0 });
s.addImage({ path: "prep/wordmark_cream.png", x: 1.0, y: 4.0, w: 4.5, h: 4.5 * 2615 / 16347 });
s.addText("Alex Lau · CEO / Co-Founder · alex@inventwood.com", { x: 1.0, y: 4.9, w: 9, h: 0.4, fontFace: SANS, fontSize: 14, color: DIM, margin: 0 });
s.addText("Lex Harris · Director, Capital Markets & IR · lex@inventwood.com", { x: 1.0, y: 5.35, w: 9, h: 0.4, fontFace: SANS, fontSize: 14, color: DIM, margin: 0 });

pres.writeFile({ fileName: "SUPERWOOD-for-Data-Centers-Companion.pptx" }).then(() => console.log("written"));
