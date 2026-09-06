// SUPERWOOD for Data Centers — investor companion to the SUPERMILLS Investor Overview (InventWood).
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
  slide.addText(text, { x: L, y, w: CW, h, fontFace: SANS, fontSize: 6.5, italic: true, color: MUTED, margin: 0, valign: "top" });
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
// Matches the SUPERMILLS Investor Overview cover: InventWood mark above the title, "NAME — italic tagline", bold date line.
s = pres.addSlide();
s.background = { path: "prep/campus_hero.jpg" };
s.addShape(pres.ShapeType.rect, { x: 0, y: 0, w: W, h: H, fill: { color: "150E08", transparency: 42 } });
s.addShape(pres.ShapeType.rect, { x: 0, y: 3.9, w: W, h: 3.6, fill: { color: "120C07", transparency: 22 } });
s.addImage({ path: "prep/inventwood_logo.png", x: 0.62, y: 4.15, w: 4.6, h: 4.6 * 216 / 1473 });
s.addText("SUPERWOOD for Data Centers", { x: 0.72, y: 5.0, w: 11.8, h: 0.9, fontFace: SERIF, fontSize: 40, color: CREAM, margin: 0, valign: "top" });
s.addText([
  t("Companion to the SUPERMILLS Investor Overview", { color: CREAM }),
  t("\nSeptember 2026", { bold: true, color: BRIGHT }),
], { x: 0.72, y: 6.1, w: 8, h: 0.7, fontFace: SANS, fontSize: 14, margin: 0, valign: "top" });
s.addText("INVENTWOOD  ·  CONFIDENTIAL", { x: W - 4.3, y: 7.0, w: 3.6, h: 0.3, fontFace: SANS, fontSize: 9, color: DIM, charSpacing: 3, align: "right", margin: 0 });
s.addText("Concept rendering", { x: W - 2.3, y: 0.25, w: 1.9, h: 0.25, fontFace: SANS, fontSize: 8, italic: true, color: "E8DECB", align: "right", margin: 0 });

// ---------- 2 · THESIS ----------
s = pres.addSlide(); base(s, "InventWood · The thesis");
kicker(s, "The thesis");
title(s, [t("We help data centers decarbonize and improve their impact on communities, while they accelerate SUPERWOOD's journey from premium skins into "), gold("structural"), t(" applications")], L, 0.88, 12.2, 24);
const thesis = [
  ["The buyer is short of steel and already building with wood",
   "Data centers are among the fastest-growing buyers of structural steel. Customers report backlogs and shortages, and Microsoft and Meta already build data-center structures in mass timber."],
  ["We turbocharge the wood they already use",
   "Mass timber replaces concrete floors. SUPERWOOD, stronger than A36 steel in tension at one-sixth the weight, adds the steel: members, skins and screens — and strengthens the mass timber itself. It ships today from SuperMill One; truss design and mass-timber enhancement are under way."],
  ["One basis-of-design win is SuperMill Two-scale demand",
   "A gigawatt data center's skins alone are one to three years of SuperMill One's output; its structure is a year or more of SuperMill Two. Long term: prefabricated envelopes and, eventually, foundations."],
];
thesis.forEach(([head, sub], i) => {
  const cw = 3.95, x = L + i * 4.125, y = 2.1;
  panel(s, x, y, cw, 3.55);
  s.addText(`0${i + 1}`, { x: x + 0.3, y: y + 0.25, w: 1, h: 0.6, fontFace: SERIF, fontSize: 28, color: WOOD, margin: 0 });
  s.addText(head, { x: x + 0.3, y: y + 0.95, w: cw - 0.6, h: 0.9, fontFace: SANS, fontSize: 14.5, bold: true, color: CREAM, margin: 0, valign: "top" });
  body(s, sub, x + 0.3, y + 1.9, cw - 0.6, 1.55, 11, DIM);
});
note(s, "The company, team, mills, cost roadmap and the raise are in the SUPERMILLS Investor Overview. This deck covers one application. Strength: company test data vs ASTM A36; data center sizing: company estimate (slides 5–6).", 6.0, 0.5);

// ---------- 3 · THE BUYER ----------
s = pres.addSlide(); base(s, "InventWood · The buyer");
kicker(s, "The buyer");
title(s, [t("US data center construction is running at "), gold("$75 billion a year"), t(", up 57% in twelve months")], L, 0.88, 12.2, 27);
s.addImage({ path: "prep/charts/construction.png", x: L, y: 1.95, w: 6.4, h: 6.4 * 4.3 / 8.6 });
label(s, "How it is projected to grow", 7.3, 1.95, 5.5);
const growth = [
  ["66 GW under construction in North America", "JLL, midyear 2026 — more electricity than Germany uses. At the published 50–100 tons of structural steel per MW, that pipeline alone is 3.3–6.6 million tons of structural steel."],
  ["Global capacity roughly triples by 2030", "McKinsey: 82 GW in 2025 to about 219 GW in 2030, AI workloads driving 71% of the growth. JLL: 103 GW to 200 GW."],
  ["Global data center capex passes $1 trillion in 2026", "Dell'Oro: up 57% in 2025, above $1 trillion in 2026, $1.7 trillion by 2030 — mostly servers and chips; the buildings are the Census share on the left."],
];
growth.forEach(([head, sub], i) => {
  const x = 7.3, y = 2.35 + i * 1.05;
  s.addShape(pres.ShapeType.ellipse, { x, y: y + 0.09, w: 0.14, h: 0.14, fill: { color: GOLD } });
  s.addText(head, { x: x + 0.35, y, w: 5.2, h: 0.32, fontFace: SANS, fontSize: 12.5, bold: true, color: CREAM, margin: 0 });
  body(s, sub, x + 0.35, y + 0.34, 5.2, 0.7, 9.5, MUTED);
});
const why = [
  ["Steel-intensive", "500–1,000 tons of structural steel and 5,000–10,000 m³ of concrete per 10 MW."],
  ["Supply-chain challenged", "Customers report backlogs and a shortage of structural steel; supply chain and timeline are their first concern."],
  ["Highly repeatable", "Hyperscalers build to a standard basis of design, one data center after another."],
];
why.forEach(([head, sub], i) => {
  const cw = 3.95, x = L + i * 4.125, y = 5.5;
  panel(s, x, y, cw, 1.0, PANEL2);
  s.addText(head, { x: x + 0.25, y: y + 0.12, w: cw - 0.5, h: 0.3, fontFace: SANS, fontSize: 12, bold: true, color: CREAM, margin: 0 });
  body(s, sub, x + 0.25, y + 0.42, cw - 0.5, 0.55, 9.5, DIM);
});
note(s, "US Census Bureau, Construction Spending (C30), private data center construction put in place: July 2026 preliminary seasonally adjusted annual rate $75.2B vs $47.8B in July 2025 (+57%); bars are calendar-year totals, not seasonally adjusted; buildings only, servers excluded. JLL North America Data Center Report Midyear 2026 (66 GW). McKinsey, AI power (2025). JLL Global Data Center Outlook 2026. Dell'Oro Group (2026). Steel intensity: arXiv 2509.21312, secondary; tonnage derived. Shortage statements are what customers report to InventWood.", 6.62, 0.45);

// ---------- 4 · COMMUNITY PUSHBACK: AESTHETICS AND NOISE ----------
s = pres.addSlide(); base(s, "InventWood · The buyer");
kicker(s, "The buyer · The community");
title(s, "Community pushback now blocks or delays more data center projects than ever.", L, 0.88, 12.2, 25);
label(s, "Two complaints are about the building", L, 2.0, 7.2);
const objections = [
  ["Aesthetics", "Windowless boxes on farmland. Counties answer with setbacks and design standards.", "SUPERWOOD: facades, fences and screens that read as architecture."],
  ["Noise", "Fans, chillers, generator tests. Property-line decibel limits are spreading.", "SUPERWOOD: acoustic screens and barriers; quieter fan enclosures and ductwork."],
];
objections.forEach(([head, sub, ans], i) => {
  const x = L, y = 2.45 + i * 1.35;
  s.addShape(pres.ShapeType.ellipse, { x, y: y + 0.1, w: 0.14, h: 0.14, fill: { color: GOLD } });
  s.addText(head, { x: x + 0.32, y, w: 6.9, h: 0.34, fontFace: SANS, fontSize: 14, bold: true, color: CREAM, margin: 0 });
  body(s, sub, x + 0.32, y + 0.38, 6.9, 0.4, 11, MUTED);
  s.addText(ans, { x: x + 0.32, y: y + 0.8, w: 6.9, h: 0.3, fontFace: SANS, fontSize: 11, bold: true, color: CREAM, margin: 0 });
});
label(s, "How strong the pushback is", 8.0, 2.0, 4.8);
const scale = [
  ["75 projects, about $130 billion, blocked or delayed in one quarter", "Q1 2026, as much as all of 2025. 833 opposition groups in 49 states."],
  ["Rules are following", "Henry County, Virginia: 1,000 ft setbacks, 50 dBA at the property line."],
];
scale.forEach(([head, sub], i) => {
  const x = 8.0, y = 2.45 + i * 1.5, cw = 4.75;
  panel(s, x, y, cw, 1.35, PANEL2);
  s.addText(head, { x: x + 0.25, y: y + 0.15, w: cw - 0.5, h: 0.55, fontFace: SANS, fontSize: 12.5, bold: true, color: CREAM, margin: 0 });
  body(s, sub, x + 0.25, y + 0.75, cw - 0.5, 0.55, 10.5, DIM);
});
s.addText([t("We help with these two. ", { color: CREAM }), t("We can go much further", { color: GOLD, italic: true }), t(": into the structure of the building and what is inside it.", { color: CREAM })], { x: L, y: 5.65, w: CW, h: 0.5, fontFace: SERIF, fontSize: 17, margin: 0, valign: "middle" });
note(s, "Data Center Watch, Q1 2026 report (June 2026). Virginia HB 153; Henry County, VA ordinance, Aug 2026. Electricity rates and water are the other leading objections; SUPERWOOD does not address them.", 6.72, 0.35);

// ---------- 4 · ALREADY BUILDING WITH WOOD — WE TURBOCHARGE WOOD ----------
s = pres.addSlide(); base(s, "InventWood · The buyer");
kicker(s, "The buyer · Wood emerging");
title(s, [t("Hyperscalers are already building structures with wood. We "), gold("turbocharge"), t(" wood.")], L, 0.88, 12.2, 23);
const pub = [
  ["prep/logo_microsoft.png", 1688 / 360, "prep/ms_clt_datacenter.jpg", "Photo: Microsoft", "Two Northern Virginia datacenters with cross-laminated timber floors on a steel frame — about 35% less embodied carbon than conventional steel construction, 65% less than precast. Gensler; Thornton Tomasetti.", "Microsoft Source, Nov 2024"],
  ["prep/logo_meta.png", 1896 / 382, "prep/meta_aiken_masstimber.jpg", "Photo: Meta", "Mass-timber data-center administrative buildings: Aiken, South Carolina completed 2025 (DPR, SmartLam); Cheyenne and Montgomery under way; about 41% less embodied carbon in the materials substituted.", "Meta Sustainability, 31 Jul 2025"],
];
pub.forEach(([logo, ar, photo, credit, txt, src], i) => {
  const y = 2.0 + i * 2.35, cw = 4.6, ph = 1.05;
  panel(s, L, y, cw, 2.25, PANEL2);
  s.addImage({ path: photo, x: L + 0.15, y: y + 0.12, w: cw - 0.3, h: ph, sizing: { type: "crop", w: cw - 0.3, h: ph } });
  s.addText(credit, { x: L + cw - 1.6, y: y + 0.12 + ph - 0.24, w: 1.4, h: 0.2, fontFace: SANS, fontSize: 7, italic: true, color: "E8DECB", align: "right", margin: 0 });
  const lh = 0.23;
  s.addImage({ path: logo, x: L + 0.25, y: y + ph + 0.2, w: lh * ar, h: lh });
  body(s, txt, L + 0.25, y + ph + 0.48, cw - 0.5, 0.52, 8, DIM);
  s.addText(src, { x: L + 0.25, y: y + 2.03, w: cw - 0.5, h: 0.18, fontFace: SANS, fontSize: 7, italic: true, color: MUTED, margin: 0 });
});
// right: column headers, beam images under each header, then the comparison rows
const RX = 5.45, RW = 7.3;
const cx = [RX, RX + 1.45, RX + 3.85], cwid = [1.35, 2.3, 3.45];
s.addText("MASS TIMBER TODAY (CLT, GLULAM)", { x: cx[1], y: 2.1, w: cwid[1], h: 0.5, fontFace: SANS, fontSize: 12, bold: true, color: BRIGHT, charSpacing: 1.2, margin: 0, valign: "bottom" });
s.addText("WITH SUPERWOOD", { x: cx[2], y: 2.1, w: cwid[2], h: 0.5, fontFace: SANS, fontSize: 12, bold: true, color: BRIGHT, charSpacing: 1.2, margin: 0, valign: "bottom" });
const IMY = 2.7, IMH = 0.72;
s.addImage({ path: "prep/beam_glulam.jpg", x: cx[1], y: IMY, w: 1.3, h: IMH, sizing: { type: "crop", w: 1.3, h: IMH } });
const half = 1.3;
s.addImage({ path: "prep/beam_hybrid.jpg", x: cx[2], y: IMY, w: half, h: IMH, sizing: { type: "crop", w: half, h: IMH } });
s.addImage({ path: "prep/beam_thin.jpg", x: cx[2] + half + 0.1, y: IMY, w: half, h: IMH, sizing: { type: "crop", w: half, h: IMH } });
const cmpRows = [
  ["What it replaces", "Concrete floor slabs and decks; some columns and beams", "Adds the steel: members, skins, screens and fences; later, enclosures and foundations"],
  ["Strength", "Lumber-grade; large sections carry the load", "Tensile strength above ASTM A36 steel in samples, at one-sixth the weight; thin, dense members"],
  ["Enhancing mass timber", "Glulam and CLT at lumber stiffness", "Mass-timber enhancement: SUPERWOOD outer laminations (~10% of section) raise a glulam beam's stiffness ~75% and strength ~100%"],
  ["Exterior use", "Needs protection from weather", "Exterior grade; resists moisture, pests and rot"],
  ["Fire", "Chars; established assemblies", "Chars; far better than ordinary wood — Class A demonstrated in testing"],
  ["Code path", "Established in the building codes", "Certifiable under wood standards today; SUPERWOOD-specific standards are the goal"],
];
cmpRows.forEach((r, ri) => {
  const y = 3.68 + ri * 0.52;
  s.addShape(pres.ShapeType.rect, { x: RX, y: y - 0.07, w: RW, h: 0.012, fill: { color: RULE } });
  r.forEach((c, ci) => {
    s.addText(c, { x: cx[ci], y, w: cwid[ci], h: 0.46, fontFace: SANS, fontSize: ci === 0 ? 11 : 9.5, bold: ci === 0, color: ci === 0 ? CREAM : (ci === 2 ? DIM : MUTED), margin: 0, valign: "top" });
  });
});
note(s, "Sources: news.microsoft.com, Nov 2024; Thornton Tomasetti project page; sustainability.atmeta.com, 31 Jul 2025. Logos and photographs are the companies' own, from the cited publications, used to identify the published projects. SUPERWOOD strength: company test data, parallel-to-grain tension. Hybrid-beam gains: derived from beam theory with SUPERWOOD modulus and strength, engineering write-up pending. Beams: concept renderings.", 6.84, 0.25);

// ---------- 5 · WHAT A GW DATA CENTER IS MADE OF ----------
s = pres.addSlide(); base(s, "InventWood · The size");
kicker(s, "The size");
title(s, "What a 1 GW data center is made of", L, 0.88, 11.9, 27);
label(s, "By mass", L, 1.8, 4); label(s, "By embodied carbon", 6.7, 1.8, 4);
const chW = 5.4, chH = chW * 4.3 / 7.0;
s.addImage({ path: "prep/charts/campus_mass_narrow.png", x: L, y: 2.08, w: chW, h: chH });
s.addImage({ path: "prep/charts/campus_carbon_narrow.png", x: 6.7, y: 2.08, w: chW, h: chH });
const sizeL = [["50–80% of the above-ground portion of a data center is steel", "Structure, envelope and contents — frame, roof, skins, platforms, racks, enclosures, equipment. Skins, screens and fences now; racks, platforms and barriers next (racks are a few months of development away); frame and roofs as structure; server enclosures eventually; never the electronics."]];
const sizeR = [["By embodied carbon, steel is about two-thirds of everything estimated, including the steel inside the equipment", "Building materials alone are about 60% steel at the global-average factor, about a third with recycled steel. The steel and plastics in electrical, mechanical and IT equipment add roughly 250,000 tons CO₂e."]];
[[sizeL, L], [sizeR, 6.7]].forEach(([arr, x]) => arr.forEach(([head, sub]) => {
  const y = 2.08 + chH + 0.42;
  s.addText(head, { x, y, w: 5.9, h: 0.32, fontFace: SANS, fontSize: 13, bold: true, color: CREAM, margin: 0 });
  body(s, sub, x, y + 0.34, 5.9, 0.62, 10, DIM);
}));
note(s, "Company estimate for a 1 GW IT-load data center, high case. Only the concrete and structural-steel intensities are published (arXiv 2509.21312, a secondary source); other rows are estimates from unit masses. Carbon factors: steel 1.8 kg CO₂e/kg (global average; recycled 0.4–0.7), concrete 0.12; carbon is valued on each row's steel, concrete and plastic content (material split per component: estimates, analyses/material_split.json; polymers at an average 3.0 kg CO₂e/kg); copper, aluminum, electronics, water, gypsum and wood not valued. Steel share: company estimate; the 50–80% band covers metal-panel and tilt-up concrete wall designs. Horizons: immediate = shipping; soon = 1–3 years, straightforward applications engineering; medium term = complex applications engineering, new form factors or materials engineering; long term = 5+ years, technical potential with no design or code pathway yet.", 6.78, 0.3);

// ---------- 6 · ONE DATA CENTER CAN CONSUME A SUPERMILL ----------
s = pres.addSlide(); base(s, "InventWood · The size");
kicker(s, "The size");
title(s, [t("Just one data center can consume the "), gold("entire output"), t(" of a SUPERMILL")], L, 0.88, 11.9, 27);
body(s, "SUPERWOOD a 1 GW data center could require, by horizon, against what each mill makes in a year.", L, 1.75, 11, 0.35, 12, DIM);
const worthCols = ["Horizon", "SUPERWOOD required", "Years of mill output"];
const worthRows = [
  ["Immediate — skins, screens, fences", "1,200–2,700 tons (1.4–3.1M sf)", "1.4–3.1 years of SuperMill One", 1.4, 3.1],
  ["Soon — racks, platforms, barriers", "3,500–18,000 tons", "0.1–0.6 years of SuperMill Two", 0.1, 0.6],
  ["Medium term — frame, roofs, enclosures", "16,000–65,000 tons", "0.5–2.1 years of SuperMill Two", 0.5, 2.1],
  ["Long term — slab, foundations", "58,000–362,000 tons", "1.8–12 years of SuperMill Two", 1.8, 12],
];
const wx = [L, 5.4, 9.0], ww = [4.6, 3.4, 3.7];
worthCols.forEach((c, i) => s.addText(c.toUpperCase(), { x: wx[i], y: 2.3, w: ww[i], h: 0.4, fontFace: SANS, fontSize: 10, bold: true, color: BRIGHT, charSpacing: 1.2, margin: 0, valign: "bottom" }));
s.addText("bar scale 0–12 years, dashed tick at one year", { x: wx[2], y: 2.05, w: ww[2], h: 0.25, fontFace: SANS, fontSize: 8, italic: true, color: MUTED, margin: 0, valign: "bottom" });
const YRS = 12, ybw = ww[2];
worthRows.forEach((r, ri) => {
  const y = 2.85 + ri * 0.78;
  s.addShape(pres.ShapeType.rect, { x: L, y: y - 0.1, w: CW, h: 0.012, fill: { color: RULE } });
  [0, 1].forEach(ci => s.addText(r[ci], { x: wx[ci], y, w: ww[ci], h: 0.6, fontFace: SANS, fontSize: 15, bold: ci === 0, color: ci === 0 ? CREAM : DIM, margin: 0, valign: "middle" }));
  // years of mill output: range bar on a 0–12 year scale, label beneath
  const lo = r[3], hi = r[4];
  s.addShape(pres.ShapeType.rect, { x: wx[2], y: y + 0.05, w: ybw, h: 0.13, fill: { color: RULE } });
  s.addShape(pres.ShapeType.rect, { x: wx[2] + ybw * lo / YRS, y: y + 0.05, w: Math.max(ybw * (hi - lo) / YRS, 0.05), h: 0.13, fill: { color: GOLD } });
  s.addShape(pres.ShapeType.line, { x: wx[2] + ybw / YRS, y: y, w: 0, h: 0.23, line: { color: BRIGHT, width: 0.75, dashType: "dash" } });
  s.addText(r[2], { x: wx[2], y: y + 0.22, w: ww[2], h: 0.36, fontFace: SANS, fontSize: 13, bold: true, color: GOLD, margin: 0, valign: "middle" });
});
s.addShape(pres.ShapeType.rect, { x: L, y: 5.87, w: CW, h: 0.012, fill: { color: RULE } });
s.addText([t("SuperMill One ≈ 900 tons a year (1M sf)", { color: BRIGHT }), t("      ·      ", { color: MUTED }), t("SuperMill Two ≈ 31,000 tons a year (36M sf)", { color: BRIGHT })], { x: L, y: 6.0, w: CW, h: 0.35, fontFace: SANS, fontSize: 11.5, bold: true, margin: 0 });
note(s, "Company estimate from the slide 6 model, low–high scenarios; 0.3–0.6 substitution factor for steel, to be engineering-stamped per element; long-term row also includes server enclosures at 40% of IT mass (a small share of the total), electronics excluded. Mill output at 0.87 kg/sf, 1.3 t/m³. Pricing is set per application; see the SUPERMILLS Investor Overview.", 6.62, 0.45);

// ---------- 9 · PROPERTIES ----------
s = pres.addSlide(); base(s, "InventWood · The fit");
kicker(s, "The fit");
title(s, "Properties that matter in a data center");
s.addImage({ path: "prep/prod-board.jpg", x: L, y: 1.95, w: 4.0, h: 4.0 * 427 / 640 });
s.addText([
  t("Stronger than steel.\n", { color: CREAM }),
  t("One-sixth the weight.\n", { color: GOLD }),
  t("Made from wood, in America.", { color: CREAM }),
], { x: L, y: 4.85, w: 4.0, h: 1.7, fontFace: SERIF, fontSize: 19, bold: true, margin: 0, valign: "top" });
const props = [
  ["icon_strong", "Strong", "Able to carry the required loads — tensile strength above ASTM A36 steel in production samples"],
  ["icon_light", "Light", "One-sixth the weight of steel: faster and safer to transport and install, and reduced structural requirements"],
  ["icon_leaf", "Naturally beautiful", "The texture, colors and warmth of wood — the biophilic, community-facing surface"],
  ["icon_shield", "Durable and impact resistant", "Harder and more dent-resistant than oak; impact and storm resistant; exterior grade resists moisture, pests and rot"],
  ["icon_thermo", "Insulating, not conducting", "Thermal and electrical insulator — no thermal bridging, and non-conductive around electrical infrastructure"],
  ["icon_vibration_cream", "Sound and vibration damping", "Particularly for HVAC enclosures, acoustic barriers and equipment screens"],
  ["icon_rf", "RF transparent", "Useful in niches: antenna screening, timing-antenna enclosures, telecom shelters"],
];
props.forEach(([icon, head, sub], i) => {
  const y = 1.95 + i * 0.68;
  s.addImage({ path: `prep/${icon}.png`, x: 5.05, y: y + 0.03, w: 0.34, h: 0.34 });
  s.addText(head.toUpperCase(), { x: 5.6, y, w: 7.2, h: 0.28, fontFace: SANS, fontSize: 11.5, bold: true, color: CREAM, charSpacing: 1, margin: 0 });
  body(s, sub, 5.6, y + 0.29, 7.2, 0.38, 9.5, MUTED);
});
note(s, "Company test data; property data package and test methods available on request. Fire: chars rather than burns, far better than ordinary wood; ASTM E84 Class A demonstrated in testing, specified per order.", 6.7, 0.35);

// ---------- 10 · SPEED AND MODULARITY ----------
s = pres.addSlide(); base(s, "InventWood · The fit");
kicker(s, "The fit");
title(s, [t("Faster to build: lighter, "), gold("prefabricated"), t(", reconfigurable")], L, 0.88, 11.9, 27);
const speed = [
  ["One-sixth the weight of steel", "Smaller cranes and crews, easier transport, lighter foundations. Time to power is what hyperscalers optimize."],
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
kicker(s, "The path · Immediate");
title(s, "Immediate: skins, screens and fences from SuperMill One");
s.addText("Every item below ships today as boards up to 8\" × 16' × 3/8\", exterior or interior grade. SuperMill One makes about one million square feet a year across all markets.",
  { x: L, y: 1.85, w: CW, h: 0.45, fontFace: SANS, fontSize: 12, color: DIM, margin: 0 });
s.addText([t("IMMEDIATE ", { bold: true, color: BRIGHT }), t("shipping from SuperMill One   ·   ", {}), t("SOON ", { bold: true, color: BRIGHT }), t("1–3 years; straightforward applications engineering   ·   ", {}), t("MEDIUM TERM ", { bold: true, color: BRIGHT }), t("complex applications engineering such as full building systems, new form factors, or materials engineering   ·   ", {}), t("LONG TERM ", { bold: true, color: BRIGHT }), t("5+ years; technical potential with no design or code pathway yet", {})], { x: L, y: 2.25, w: CW, h: 0.3, fontFace: SANS, fontSize: 9.5, color: DIM, margin: 0 });
const nowTiles = [
  ["tile_cladding", "Facades, cladding & rain screens"],
  ["tile_biophilic", "Biophilic interiors"],
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
  t("They need no assembly fire rating — where a finish rating applies, Class A has been demonstrated and is specified per order. They sit where the community and the workforce see the data center. And they are the near-term projects our hyperscaler customers asked for: facades, biophilic office interiors, staff-area fencing, security fencing around critical outdoor infrastructure.", { color: DIM }),
], { x: L + 0.3, y: 5.4, w: CW - 0.6, h: 0.95, fontFace: SANS, fontSize: 11, margin: 0, valign: "middle" });
conceptTag(s, W - 3.6, 5.02, 3.0, "Concept renderings");

// ---------- 12 · NEXT ----------
s = pres.addSlide(); base(s, "InventWood · The path");
kicker(s, "The path · Soon (1–3 years)");
title(s, "Soon (1–3 years): applications needing straightforward applications engineering", L, 0.88, 11.9, 27);
const gated = [
  ["tile_fanbox", "Fan enclosures & ducting", "Acoustic and airflow data"],
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
  });
}
panel(s, L, 5.5, CW, 0.85, PANEL);
s.addText("Each needs one scoped test program, which can be co-funded with a customer. Order depends on which a customer picks up first.",
  { x: L + 0.3, y: 5.55, w: CW - 0.6, h: 0.75, fontFace: SANS, fontSize: 11.5, italic: true, color: DIM, margin: 0, valign: "middle" });
conceptTag(s, W - 3.6, 5.2, 3.0, "Concept renderings");

// ---------- 13 · STRUCTURAL ----------
s = pres.addSlide(); base(s, "InventWood · The path");
kicker(s, "The path · Medium term");
title(s, [t("Structural: starting "), gold("now"), t(", scaling with SuperMill Two")]);
// left: under way now
panel(s, L, 1.95, 4.6, 3.55, PANEL2);
label(s, "Under development with SUPERMILL ONE output", L + 0.3, 2.1, 4.0, GOLD);
body(s, "Truss design is starting. Mass-timber enhancement — SUPERWOOD laminations that stiffen and strengthen glulam and CLT-type members — is under way. Light structural components (non-life-safety): strut-type supports, window mullions, deck boards.\n\nWe expect structural sales on the way to SuperMill Two. Replacing structural steel is the first thing new data-center customers ask about.", L + 0.3, 2.5, 4.0, 2.9, 11, DIM);
// right: at SuperMill Two scale
label(s, "At SuperMill Two scale", 5.5, 2.1, 6.0);
const sm2 = [
  ["tile_mullion2", "Window mullions", "Slender, stiff curtain-wall and storefront mullions in place of aluminum and steel — light structural, non-life-safety"],
  ["tile_truss2", "Trusses, roofs & long-span members", "Roof structure first; long-span floors and canopies follow"],
  ["tile_hybrid_glulam", "CLT-type floor, roof & wall assemblies", "Starting with SUPERWOOD hybrid glulam: SUPERWOOD outer laminations on a glulam core. Thin, far stronger panels follow through the mass-timber product route"],
  ["tile_rackocp", "Heavy equipment supports & server enclosures", "Racks come soon, a few months of development; enclosures for servers and equipment follow; the electronics are never replaced"],
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
  t("Every structural application is qualified through a scoped test program with the customer who picks it up first, on the pathway mass timber has already opened in the building codes, with insurer acceptance for structural use. Test methods and property data are available on request.", { color: DIM }),
], { x: L + 0.3, y: 5.75, w: CW - 0.6, h: 0.8, fontFace: SANS, fontSize: 10.5, margin: 0, valign: "middle" });
conceptTag(s, W - 3.6, 5.42, 3.0, "Concept renderings");

// ---------- 14 · THE LONG-TERM VISION ----------
s = pres.addSlide(); base(s, "InventWood · The path");
kicker(s, "The path · Long term (5+ years)");
title(s, [t("Long term (5+ years): prefabricated "), gold("envelopes"), t(", then foundations")]);
const vis = [
  ["Prefabricated building envelopes", "Structure and skin shipped as panels and modules — the co-development target with our hyperscaler customers' architects and engineers. Shells that carry their own loads, weigh far less than steel and precast, and can be disassembled and moved.", "Hyperscalers are asking for this now, to simplify design and delivery and accelerate schedules."],
  ["Foundations, slabs and paving", "Lightweight, insulated SUPERWOOD foundations and slabs in place of concrete — installed faster, with lower geotechnical demands, and potentially movable.", "Biggest unaddressed impact both to speed of development and construction, and with huge carbon impact. Geotechnical requirements greatly impact schedule and site selection."],
];
vis.forEach(([head, sub, why], i) => {
  // text only — Alex 2026-09-05: no renderings on the long-term slide yet
  const cw = 6.0, x = L + i * 6.2, y = 2.1;
  panel(s, x, y, cw, 3.7, PANEL2);
  s.addText(head, { x: x + 0.3, y: y + 0.25, w: cw - 0.6, h: 0.4, fontFace: SANS, fontSize: 15, bold: true, color: CREAM, margin: 0 });
  body(s, sub, x + 0.3, y + 0.75, cw - 0.6, 1.5, 11.5, MUTED);
  s.addText(why, { x: x + 0.3, y: y + 2.4, w: cw - 0.6, h: 1.1, fontFace: SANS, fontSize: 11.5, bold: true, color: CREAM, margin: 0, valign: "top" });
});
panel(s, L, 6.15, CW, 0.6, PANEL2);
s.addText("Stated technical potential, not an engineered plan: slab, paving and foundations are on the order of 1–2 million tons of concrete and rebar per gigawatt. No design or code pathway exists yet.",
  { x: L + 0.3, y: 6.15, w: CW - 0.6, h: 0.6, fontFace: SANS, fontSize: 9.5, italic: true, color: DIM, margin: 0, valign: "middle" });

// ---------- 15 · EVERY ACCOUNT ON ONE LADDER ----------
s = pres.addSlide(); base(s, "InventWood · The evidence");
kicker(s, "The evidence");
title(s, "Customer engagement");
const stages = ["Conversations", "Applications identified", "Projects scoped", "Testing & mockups", "First purchase", "Basis of design"];
const gx = 3.6, gw = 5.4, sw = gw / stages.length, rowY0 = 2.45, rowH = 0.78;
stages.forEach((st, i) => s.addText(st.toUpperCase(), { x: gx + i * sw, y: 1.85, w: sw, h: 0.55, fontFace: SANS, fontSize: 6.5, bold: true, color: BRIGHT, charSpacing: 0.5, align: "center", margin: 0, valign: "bottom" }));
const accounts = [
  ["Microsoft", 2, "Facades, biophilic interiors, staff and security fencing under discussion; roof-truss and enclosure work with their architecture and engineering firms; interest in SUPERWOOD in the basis of design", "First skin project on one building or yard"],
  ["Meta", 2, "Engaged for over a year across the data-center ecosystem; facade applications and backplanes under way; structural applications and racking to follow", "Backplane listing; first facade project"],
  ["Google", 1, "Engagement just begun; initial focus on replacement of structural steel", "Scope with their design teams"],
  ["Vertiv", 0, "Data center equipment builder exploring SUPERWOOD components", "Identify first applications"],
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
s.addText("ENGINEERING AND CONSTRUCTION COLLABORATORS", { x: L + 0.3, y: 6.35, w: 2.6, h: 0.58, fontFace: SANS, fontSize: 8, bold: true, color: BRIGHT, charSpacing: 1.5, margin: 0, valign: "middle" });
// logos (cream renders of the firms' marks) with a one-line descriptor; Timber Engineering has no mark on file, so name in type
const collab = [
  ["prep/logo_fastepp.png", 1600 / 328, null, "Structural engineers, Vancouver"],
  [null, 0, "Timber Engineering", "Structural engineering"],
  ["prep/logo_hitt.png", 354 / 90, null, "General contractor"],
  ["prep/logo_turner.png", 1600 / 469, null, "General contractor"],
];
collab.forEach(([logo, ar, name, desc], i) => {
  const x = 3.4 + i * 2.35, lh = 0.19;
  if (logo) s.addImage({ path: logo, x, y: 6.44, w: lh * ar, h: lh });
  else s.addText(name, { x, y: 6.4, w: 2.2, h: 0.27, fontFace: SANS, fontSize: 10, bold: true, color: CREAM, margin: 0, valign: "middle" });
  s.addText(desc, { x, y: 6.67, w: 2.2, h: 0.22, fontFace: SANS, fontSize: 7.5, color: MUTED, margin: 0, valign: "top" });
});
note(s, "Next steps undated. Published backup for Microsoft and Meta on the next slide.", 6.97, 0.3);

// ---------- 16 · MICROSOFT AND META, ON THE RECORD AND WITH US ----------
s = pres.addSlide(); base(s, "InventWood · The evidence");
kicker(s, "The evidence");
title(s, "Microsoft and Meta");
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
  label(s, "Published", x + 0.25, 2.58, 4, BRIGHT);
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
note(s, "Sources: news.microsoft.com, Nov 2024; thorntontomasetti.com; sustainability.atmeta.com, 31 Jul 2025.", 6.6, 0.4);

// ---------- 18 · THE CARBON CLAIM ----------
s = pres.addSlide(); base(s, "InventWood · Carbon");
kicker(s, "Carbon");
title(s, "Embodied carbon: LCA based on SUPERMILL TWO projections", L, 0.88, 11.9, 27);
// bars on one axis: emissions to the right of zero, storage to the left. Ranges: solid to the low value, faded to the high.
const bars = [
  ["Steel — global average (BF-BOF), per kg of steel", 0, 0, 1.8, 1.8, ROSE, "1.8 kg"],
  ["Steel — recycled (EAF), per kg of steel", 0, 0, 0.4, 0.7, "A0714E", "0.4–0.7 kg"],
  ["SUPERWOOD — per kg of steel substituted at 3:1 to 4:1 replacement by weight, projected: emissions right, carbon storage left", 0.1, 0.5, 0.1, 0.2, GREEN, "+0.1–0.2 · −0.1 to −0.5 kg"],
];
label(s, "kg CO₂e, cradle to gate · emissions right of zero, storage left", L, 1.95, 6.4);
const bx = L, bw = 4.9, kS = bw / 2.4, zx = bx + 0.6 * kS;
bars.forEach(([lab, nlo, nhi, plo, phi, colr, txt], i) => {
  const y = 2.35 + i * 0.95;
  s.addText(lab, { x: bx, y, w: 6.4, h: 0.3, fontFace: SANS, fontSize: 10, color: CREAM, margin: 0 });
  s.addShape(pres.ShapeType.rect, { x: bx, y: y + 0.34, w: bw, h: 0.28, fill: { color: RULE } });
  s.addShape(pres.ShapeType.rect, { x: zx, y: y + 0.34, w: plo * kS, h: 0.28, fill: { color: colr } });
  if (phi > plo) s.addShape(pres.ShapeType.rect, { x: zx + plo * kS, y: y + 0.34, w: (phi - plo) * kS, h: 0.28, fill: { color: colr, transparency: 55 } });
  if (nhi > 0) {
    s.addShape(pres.ShapeType.rect, { x: zx - nlo * kS, y: y + 0.34, w: nlo * kS, h: 0.28, fill: { color: TEAL } });
    s.addShape(pres.ShapeType.rect, { x: zx - nhi * kS, y: y + 0.34, w: (nhi - nlo) * kS, h: 0.28, fill: { color: TEAL, transparency: 55 } });
  }
  s.addShape(pres.ShapeType.line, { x: zx, y: y + 0.3, w: 0, h: 0.36, line: { color: DIM, width: 0.75 } });
  s.addText(txt, { x: bx + bw + 0.12, y: y + 0.3, w: 1.6, h: 0.36, fontFace: SERIF, fontSize: 11.5, bold: true, color: CREAM, margin: 0, valign: "middle" });
});
panel(s, L, 5.25, 6.4, 1.2, PANEL2);
s.addText([
  t("Biogenic carbon, reported separately.  ", { bold: true, color: GOLD }),
  t("SUPERWOOD stores 0.5–1.5 kg CO₂e per kg of SUPERWOOD as biogenic carbon, 0.1–0.5 kg per kg of steel it substitutes. Under EN 15804 it is released again in the end-of-life module, so it nets to zero over the life cycle; the lasting advantage is lower manufacturing emissions.", { color: DIM }),
], { x: L + 0.25, y: 5.3, w: 5.9, h: 1.1, fontFace: SANS, fontSize: 10, margin: 0, valign: "middle" });
// right: functional unit
panel(s, 7.3, 1.95, 5.45, 4.5, PANEL);
label(s, "Per functional unit — replacing one ton of steel", 7.55, 2.1, 5.0, BRIGHT);
body(s, "SUPERWOOD needed: 0.25–0.33 tons per ton of steel replaced — a 3:1 to 4:1 average replacement by weight, to be engineering-stamped per element.\n\nSUPERWOOD manufacturing emissions: 0.25–0.33 tons × 0.5 = about 0.1–0.2 tons CO₂e per ton of steel substituted.\n\nAgainst average steel (1.8 tons CO₂e): a reduction of 89–94%.\n\nAgainst recycled steel (0.4–0.7 tons CO₂e): a reduction of 50–86%.\n\nCarbon stored in the SUPERWOOD: 0.25–0.33 tons × 0.5–1.5 = 0.1–0.5 tons CO₂e per ton of steel replaced, biogenic, reported separately.\n\nAny stated reduction must name its steel baseline and its substitution factor. Both are shown here; neither is yet verified.", 7.55, 2.45, 5.0, 3.1, 9.5, DIM);
s.addText("Pre-LCA projection for a full-scale plant. LCA under way with Prof. Ming Hu, University of Notre Dame.", { x: 7.55, y: 5.6, w: 5.0, h: 0.75, fontFace: SANS, fontSize: 10.5, bold: true, color: CREAM, margin: 0, valign: "top" });
note(s, "SUPERWOOD 0.5 kg CO₂e/kg manufactured and 0.5–1.5 kg/kg biogenic storage: company projections, pre-LCA. Steel 1.8 kg/kg: global BF-BOF average. EAF 0.4–0.7 kg/kg: typical published range for recycled-scrap steel. Replacement 3:1 to 4:1 by weight (0.25–0.33 kg SUPERWOOD per kg steel): company assumption. Reductions are arithmetic on these inputs.", 6.6, 0.45);

// ---------- 18 · RISKS ----------
s = pres.addSlide(); base(s, "InventWood · Risks");
kicker(s, "Risks");
title(s, "Risks and how we handle them");
const risks = [
  ["Insurers and code officials must accept SUPERWOOD for structural use", "Start with skins and non-structural items that need no assembly rating. Qualify structural applications with the first customer, on the pathway mass timber opened."],
  ["Qualification could run longer than customer design cycles", "Sell what needs no qualification now. Hyperscalers design data centers years ahead, so basis-of-design work starts before qualification ends."],
  ["One plant, shared across every market", "SuperMill One's output is allocated across every market; a gigawatt's skins alone are one to three plant-years. SuperMill Two resolves it; that is what the raise funds."],
  ["Price against metal panel, fiber cement, CLT and recycled steel", "Premium skins where appearance and community acceptance carry value. Structural competitiveness arrives with SuperMill Two cost (roadmap basis, not yet realized)."],
  ["Carbon figures are projections until the LCA is complete", "Labeled pre-LCA everywhere; LCA under way with Prof. Ming Hu, University of Notre Dame. No carbon claim without its baseline and substitution factor."],
  ["Customer concentration", "Three hyperscalers plus Vertiv, Wooden Data Center and operators — and what is qualified for a data center is qualified for the wider structural market."],
];
label(s, "Risk", L, 1.95, 4, BRIGHT); label(s, "How we handle it", 6.25, 1.95, 5, BRIGHT);
risks.forEach(([r, m], i) => {
  const y = 2.3 + i * 0.72;
  s.addShape(pres.ShapeType.rect, { x: L, y: y - 0.07, w: CW, h: 0.012, fill: { color: RULE } });
  s.addText(r, { x: L, y, w: 5.4, h: 0.62, fontFace: SANS, fontSize: 11, bold: true, color: CREAM, margin: 0, valign: "top" });
  body(s, m, 6.25, y, 6.5, 0.62, 10, DIM);
});
note(s, "No probabilities are assigned. These are the conditions the data-center case depends on.", 6.75, 0.3);

// ---------- 19 · PATH TO FIRST PROJECTS ----------
s = pres.addSlide(); base(s, "InventWood · The path");
kicker(s, "The path");
title(s, "Path to first projects");
const nexts = [
  ["Skins on one building or yard", "Facades, interiors, louvers, staff-area or security fencing — installed from SuperMill One output with a willing customer. Produces an installed reference and installed-cost data."],
  ["A scoped test program with that customer", "Toward whatever the chosen application needs, co-funded. Produces the data package the next application inherits."],
  ["Basis-of-design work with the customer's architect and engineer", "Structural enclosure and truss solutions that can be written into the standard data center design. Produces a specification that repeats."],
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
bullets(s, ["Data centers are short of steel and already build with wood.", "SUPERWOOD turbocharges that wood: skins and fences now, structure in the medium term.", "One basis-of-design win with a hyperscaler is the demand case for SuperMill Two."], { x: 1.0, y: 3.55, w: 7.5, h: 1.2, fontSize: 12.5, color: CREAM });
s.addText("Company, mills, cost roadmap and the raise: SUPERMILLS Investor Overview", { x: 1.0, y: 4.8, w: 9, h: 0.3, fontFace: SANS, fontSize: 11, color: BRIGHT, margin: 0 });
s.addImage({ path: "prep/inventwood_logo.png", x: 1.0, y: 5.25, w: 3.6, h: 3.6 * 216 / 1473 });
s.addText("Alex Lau · CEO / Co-Founder · alex@inventwood.com", { x: 1.0, y: 5.95, w: 9, h: 0.4, fontFace: SANS, fontSize: 14, color: DIM, margin: 0 });
s.addText("Lex Harris · Director, Capital Markets & IR · lex@inventwood.com", { x: 1.0, y: 6.35, w: 9, h: 0.4, fontFace: SANS, fontSize: 14, color: DIM, margin: 0 });

pres.writeFile({ fileName: "SUPERWOOD-for-Data-Centers-Companion.pptx" }).then(() => console.log("written"));
