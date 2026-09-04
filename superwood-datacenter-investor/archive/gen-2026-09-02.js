// SUPERWOOD for Data Centers — companion deck to Super Mills America. Built from the customer deck (../superwood-datacenter/gen.js).
const pptxgen = require("pptxgenjs");
const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE"; // 13.33 x 7.5

// InventWood palette (no '#')
const INK = "1F150C", PANEL = "261A0F", CREAM = "F4ECDF", DIM = "CDBFA9",
      MUTED = "9D8D76", WOOD = "B87D44", BRIGHT = "CDA165", GOLD = "E2B877",
      GREEN = "8FB356", TEAL = "5EA9A2", ROSE = "C9706B";
const SERIF = "Georgia", SANS = "Calibri";
const W = 13.33, H = 7.5;
const fs = require("fs");
const pick = (...paths) => paths.find((p) => fs.existsSync(p)); // first existing asset

function base(slide, footerText) {
  slide.background = { color: INK };
  if (footerText) {
    slide.addText(footerText, { x: 0.55, y: H - 0.42, w: 6, h: 0.3, fontFace: SANS,
      fontSize: 9, color: MUTED, margin: 0 });
    slide.addText("Confidential", { x: W - 2.45, y: H - 0.42, w: 1.5, h: 0.3, fontFace: SANS,
      fontSize: 9, color: MUTED, align: "right", margin: 0 });
  }
  slide.slideNumber = { x: W - 0.75, y: H - 0.42, w: 0.5, fontFace: SANS, fontSize: 9, color: MUTED };
}
function kicker(slide, text, x = 0.55, y = 0.5, w = 8) {
  slide.addText(text.toUpperCase(), { x, y, w, h: 0.32, fontFace: SANS, fontSize: 12,
    color: BRIGHT, charSpacing: 4, bold: true, margin: 0 });
}
function title(slide, runs, x = 0.55, y = 0.88, w = 11.9, size = 32) {
  slide.addText(runs, { x, y, w, h: 0.95, fontFace: SERIF, fontSize: size, color: CREAM, margin: 0 });
}
function bullets(slide, items, opts) {
  slide.addText(items.map((t, i) => ({ text: t, options: { bullet: { code: "2022", indent: 12 }, breakLine: i < items.length - 1, paraSpaceAfter: 7 } })),
    Object.assign({ fontFace: SANS, fontSize: 11.5, color: DIM, margin: 0, valign: "top" }, opts));
}
function sectionDivider(num, name, accent, sub) {
  const d = pres.addSlide();
  d.background = { path: "prep/divider_bg.jpg" };
  d.addText(`SECTION ${num}`, { x: 1.0, y: 2.5, w: 6, h: 0.35, fontFace: SANS, fontSize: 13,
    color: BRIGHT, charSpacing: 4, bold: true, margin: 0 });
  d.addText([
    { text: name, options: {} },
    ...(accent ? [{ text: " " + accent, options: { italic: true, color: GOLD } }] : []),
  ], { x: 1.0, y: 3.0, w: 11.3, h: 1.1, fontFace: SERIF, fontSize: 48, color: CREAM, margin: 0 });
  d.addText(sub, { x: 1.0, y: 4.25, w: 9.5, h: 0.5, fontFace: SANS, fontSize: 15, color: DIM, margin: 0 });
  d.slideNumber = { x: W - 0.75, y: H - 0.42, w: 0.5, fontFace: SANS, fontSize: 9, color: MUTED };
  return d;
}

// ---------- 1 · COVER ----------
let s = pres.addSlide();
s.background = { path: "prep/campus_hero.jpg" };
s.addShape(pres.ShapeType.rect, { x: 0, y: 4.75, w: W, h: 2.75, fill: { color: "120C07", transparency: 30 } });
s.addImage({ path: "prep/wordmark_cream.png", x: 0.7, y: 5.1, w: 6.2, h: 6.2 * 2615 / 16347 });
s.addText("SUPERWOOD for Data Centers", { x: 0.72, y: 6.2, w: 9, h: 0.6, fontFace: SERIF, italic: true,
  fontSize: 26, color: GOLD, margin: 0 });
s.addText("Companion to Super Mills America  ·  September 2026", { x: 0.72, y: 6.85, w: 8, h: 0.35, fontFace: SANS,
  fontSize: 12, color: DIM, margin: 0 });
s.addText("INVENTWOOD  ·  CONFIDENTIAL", { x: W - 4.3, y: 7.0, w: 3.6, h: 0.3, fontFace: SANS,
  fontSize: 9, color: DIM, charSpacing: 3, align: "right", margin: 0 });
s.addText("Concept rendering", { x: W - 2.3, y: 0.25, w: 1.9, h: 0.25, fontFace: SANS, fontSize: 8, italic: true, color: "E8DECB", align: "right", margin: 0 });

// ---------- 2 · AGENDA ----------
s = pres.addSlide(); base(s, "InventWood");
kicker(s, "Overview");
title(s, "What's inside");
s.addText("The company, the mills, the cost roadmap and the raise are in Super Mills America. This deck covers one application: data centers.",
  { x: 0.55, y: 1.75, w: 7.6, h: 0.5, fontFace: SANS, fontSize: 12, italic: true, color: MUTED, margin: 0 });
const agendaItems = [
  ["01", "Why Data Centers", "Hungry for materials · large offtake · low carbon and community acceptance · the wedge into structural"],
  ["02", "Technology Fit", "How SUPERWOOD is made, what it does, and the standards on the path"],
  ["03", "Impact", "Embodied carbon and circularity — labeled as the projections they are"],
  ["04", "Applications", "Skins and fences now; certification-gated next; structure after"],
  ["05", "Customers", "Microsoft, Meta, Google — and who else is at the table"],
];
agendaItems.forEach(([num, head, sub], i) => {
  const y = 2.4 + i * 0.9;
  s.addText(num, { x: 0.55, y, w: 0.85, h: 0.7, fontFace: SERIF, fontSize: 26, color: WOOD, margin: 0 });
  s.addText(head, { x: 1.55, y, w: 6.5, h: 0.42, fontFace: SANS, fontSize: 17.5, bold: true, color: CREAM, margin: 0 });
  s.addText(sub, { x: 1.55, y: y + 0.42, w: 6.5, h: 0.35, fontFace: SANS, fontSize: 12, color: MUTED, margin: 0 });
});
s.addImage({ path: "media/image75.png", x: 8.6, y: 2.4, w: 4.1, h: 4.1 * 600 / 937 });
s.addText("SUPERWOOD boards", { x: 8.6, y: 5.1, w: 4.1, h: 0.3, fontFace: SANS, fontSize: 9.5, italic: true, color: MUTED, align: "right", margin: 0 });

// ================= SECTION 01 · WHY DATA CENTERS =================
sectionDivider("01", "Why", "Data Centers", "Fast-growing and hungry for materials · large offtake · low carbon and community acceptance · the wedge into structural");

// ---------- 4 · WHY DATA CENTERS ----------
s = pres.addSlide(); base(s, "InventWood · Why Data Centers");
kicker(s, "Why Data Centers");
title(s, [
  { text: "Why ", options: {} },
  { text: "data centers", options: { italic: true, color: GOLD } },
  { text: "?", options: {} },
]);
const pillars = [
  ["Fast-growing market, hungry for materials", "Construction is backlogged and operators tell us they face a shortage of structural steel. Supply chain and timeline are their first concern — and a domestic material that is lighter to ship and faster to erect answers it directly."],
  ["Large-volume offtake potential", "Hyperscalers build repeatable campuses to a standard basis of design. One campus envelope program is on the order of SuperMill One's entire annual output; a basis-of-design win is SuperMill Two-scale demand."],
  ["Desire for low carbon and community acceptance", "Microsoft and Meta already build data-center structures with mass timber (35% and ~41% embodied-carbon cuts on the elements replaced), reported through EC3 — co-created by our advisor Don Davies. Noise and visual mass drive moratoria; warm, quiet, biophilic exteriors change what the planning commission sees."],
  ["A wedge into structural — a market hungry for solutions", "Replacing structural steel is the first thing new customers ask about. The mass-timber code pathway lets SUPERWOOD qualify as a new, far stronger species — and what is qualified for a data center is qualified for the broader structural market."],
];
pillars.forEach(([head, sub], i) => {
  const col = i % 2, row = Math.floor(i / 2);
  const cw = 6.0, x = 0.55 + col * 6.2, y = 1.95 + row * 1.85;
  s.addShape(pres.ShapeType.roundRect, { x, y, w: cw, h: 1.7, rectRadius: 0.09, fill: { color: PANEL } });
  s.addText(`0${i + 1}`, { x: x + 0.25, y: y + 0.18, w: 0.75, h: 0.6, fontFace: SERIF, fontSize: 26, color: WOOD, margin: 0 });
  s.addText(head, { x: x + 1.0, y: y + 0.18, w: cw - 1.25, h: 0.42, fontFace: SANS, fontSize: 14, bold: true, color: CREAM, margin: 0 });
  s.addText(sub, { x: x + 1.0, y: y + 0.62, w: cw - 1.25, h: 1.0, fontFace: SANS, fontSize: 10, color: MUTED, margin: 0, valign: "top" });
});
s.addText("HOW THE WEDGE WORKS", { x: 0.55, y: 5.75, w: 4, h: 0.26, fontFace: SANS, fontSize: 9.5, bold: true, color: BRIGHT, charSpacing: 2, margin: 0 });
const steps = ["Skins and fences today", "Testing, co-developed with customers", "Structural qualification via the mass-timber pathway", "Written into the basis of design", "SuperMill Two-scale offtake"];
steps.forEach((txt, i) => {
  const cw = 2.3, x = 0.55 + i * 2.475, y = 6.05;
  s.addShape(pres.ShapeType.roundRect, { x, y, w: cw, h: 0.6, rectRadius: 0.07, fill: { color: "2E2113" }, line: { color: i === 4 ? GOLD : WOOD, width: i === 4 ? 1.5 : 0.75 } });
  s.addText(`${i + 1}`, { x: x + 0.12, y: y + 0.1, w: 0.35, h: 0.4, fontFace: SERIF, fontSize: 18, color: WOOD, margin: 0 });
  s.addText(txt, { x: x + 0.48, y: y + 0.05, w: cw - 0.55, h: 0.5, fontFace: SANS, fontSize: 9.5, color: CREAM, margin: 0, valign: "middle" });
  if (i < 4) s.addText("›", { x: x + cw - 0.02, y: y + 0.08, w: 0.2, h: 0.45, fontFace: SERIF, fontSize: 18, color: GOLD, margin: 0 });
});
s.addText("Steel-shortage and backlog statements are what customers report to us (2026). Microsoft: news.microsoft.com, Nov 2024. Meta: sustainability.atmeta.com, Jul 2025. Campus-vs-SuperMill One comparison is a company estimate.",
  { x: 0.55, y: 6.72, w: 12.2, h: 0.3, fontFace: SANS, fontSize: 8, italic: true, color: MUTED, margin: 0 });

// ---------- 5 · WHAT A CAMPUS IS MADE OF ----------
s = pres.addSlide(); base(s, "InventWood · Why Data Centers");
kicker(s, "Why Data Centers");
title(s, "Where SUPERWOOD fits in a campus");
const fitCols = [
  ["NOW · SKINS, SCREENS, FENCES", GOLD, [
    "Facades, cladding and rain screens", "Biophilic interiors for office space", "Louvers and equipment screening",
    "Fencing for staff outdoor spaces", "Security fencing around transformers and outdoor infrastructure",
    "Equipment backplanes", "Trim, door kicks, sub-framing"]],
  ["NEXT · STRUCTURE AND CONTENTS", BRIGHT, [
    "Building enclosures and structural components", "Joists, deck and roof assemblies", "Trusses and long-span members",
    "Platforms, walkways and mezzanines", "Racking and equipment supports", "Enclosures and separations", "Shells and foundations, longer term"]],
];
fitCols.forEach(([head, hue, items], i) => {
  const x = 0.55 + i * 4.0;
  s.addShape(pres.ShapeType.roundRect, { x, y: 1.95, w: 3.8, h: 4.0, rectRadius: 0.09, fill: { color: PANEL } });
  s.addText(head, { x: x + 0.25, y: 2.1, w: 3.4, h: 0.3, fontFace: SANS, fontSize: 10, bold: true, color: hue, charSpacing: 1.5, margin: 0 });
  bullets(s, items, { x: x + 0.25, y: 2.5, w: 3.35, h: 3.35, fontSize: 11 });
});
s.addImage({ path: pick("prep/app_shell.jpg"), x: 8.65, y: 1.95, w: 4.1, h: 2.75, sizing: { type: "crop", w: 4.1, h: 2.75 } });
s.addText("Concept rendering — enclosure and structure are the long game; skins and fences ship now.", { x: 8.65, y: 4.75, w: 4.1, h: 0.5, fontFace: SANS, fontSize: 9.5, italic: true, color: MUTED, margin: 0 });
s.addShape(pres.ShapeType.roundRect, { x: 8.65, y: 5.35, w: 4.1, h: 0.6, rectRadius: 0.07, fill: { color: "2E2113" } });
s.addText([
  { text: "Per 10 MW of data center: ", options: { bold: true, color: GOLD } },
  { text: "500–1,000 t of structural steel and 5,000–10,000 m³ of concrete.", options: { color: CREAM } },
], { x: 8.8, y: 5.4, w: 3.85, h: 0.5, fontFace: SANS, fontSize: 9.5, margin: 0, valign: "middle" });
s.addText("Steel and concrete intensities: arXiv 2509.21312 (Sep 2025), citing Hasan et al. 2022 and Sharma et al. 2023 — secondary literature figures, ranges as published.",
  { x: 0.55, y: 6.2, w: 12.2, h: 0.45, fontFace: SANS, fontSize: 8.5, italic: true, color: MUTED, margin: 0 });

// ================= SECTION 02 · TECHNOLOGY FIT =================
sectionDivider("02", "The", "Technology", "How SUPERWOOD is made, what it does, and the standards on the path");

// ---------- 7 · PROCESS ----------
s = pres.addSlide(); base(s, "InventWood · Technology");
kicker(s, "Technology");
title(s, [
  { text: "We unlock the power of ", options: {} },
  { text: "cellulose", options: { italic: true, color: GOLD } },
]);
s.addText("Our patented process transforms ordinary wood into SUPERWOOD — an environmentally benign process using chemistry common to food and pulp processing.",
  { x: 0.55, y: 1.9, w: 12.2, h: 0.45, fontFace: SANS, fontSize: 13.5, color: DIM, margin: 0 });
const flow = [
  ["01 · START WITH WOODY FEEDSTOCK", "Hardwoods, softwoods, bamboo, underutilized species, waste wood", "prep/feed-timber.jpg", "Before: open cell vessels"],
  ["02 · MOLECULAR RE-ENGINEERING & DENSIFICATION", "3–4× density increase, elimination of pores and defects, and new hydrogen bonds across fibers", "prep/proc-compress.png", "No added glues · No polymer binders"],
  ["03 · SUPERWOOD", "Samples more than 50% stronger than A36 steel in tension, at one-sixth the weight", "media/image75.png", "After: collapsed, interlocking vessels"],
];
flow.forEach(([head, sub, img, cap], i) => {
  const cw = 3.85, x = 0.55 + i * 4.2;
  s.addText(head, { x, y: 2.55, w: cw, h: 0.62, fontFace: SANS, fontSize: 11.5, bold: true, color: BRIGHT, charSpacing: 1, margin: 0 });
  s.addText(sub, { x, y: 3.22, w: cw, h: 0.85, fontFace: SANS, fontSize: 11, color: MUTED, margin: 0, valign: "top" });
  s.addImage({ path: img, x, y: 4.15, w: cw, h: 2.35, sizing: { type: "crop", w: cw, h: 2.35 } });
  s.addText(cap, { x, y: 6.6, w: cw, h: 0.35, fontFace: SANS, fontSize: 9.5, italic: true, color: i === 1 ? BRIGHT : MUTED, align: "center", margin: 0 });
  if (i < 2) s.addText("→", { x: x + cw + 0.01, y: 5.0, w: 0.35, h: 0.5, fontFace: SERIF, fontSize: 22, color: GOLD, margin: 0 });
});

// ---------- 8 · STRENGTH ----------
s = pres.addSlide(); base(s, "InventWood · Technology");
kicker(s, "The Material");
title(s, [
  { text: "The ", options: {} },
  { text: "strength", options: { italic: true, color: GOLD } },
  { text: " of SUPERWOOD", options: {} },
]);
const stats = [
  ["50%+", "stronger than A36 steel in tension — demonstrated in samples"],
  ["1/6", "the weight of steel"],
  ["Up to 10×", "strength-to-weight ratio of steel"],
  ["600 MPa", "in production today; 1,000 MPa demonstrated in the lab"],
];
stats.forEach(([big, small], i) => {
  const cw = 3.0, x = 0.55 + i * 3.11;
  s.addText(big, { x, y: 2.15, w: cw, h: 0.75, fontFace: SERIF, fontSize: 34, color: GOLD, margin: 0 });
  s.addText(small, { x, y: 2.95, w: cw - 0.3, h: 0.7, fontFace: SANS, fontSize: 12, color: DIM, margin: 0 });
});
s.addChart(pres.ChartType.bar, [{
  name: "Tensile strength (MPa)",
  labels: ["SUPERWOOD", "Steel", "Aluminum"],
  values: [600, 400, 310],
}], {
  x: 2.7, y: 3.85, w: 7.9, h: 2.85,
  barDir: "col",
  chartColors: [GOLD],
  showValue: true, dataLabelPosition: "outEnd", dataLabelColor: CREAM, dataLabelFontFace: SANS, dataLabelFontSize: 12,
  showTitle: true, title: "Tensile strength (MPa)", titleColor: DIM, titleFontFace: SANS, titleFontSize: 13,
  showLegend: false,
  catAxisLabelColor: CREAM, catAxisLabelFontFace: SANS, catAxisLabelFontSize: 12,
  valAxisLabelColor: MUTED, valAxisLabelFontFace: SANS, valAxisLabelFontSize: 10,
  valGridLine: { color: "3A2B1A", size: 1 }, catGridLine: { style: "none" },
  valAxisLineShow: false, serAxisLineShow: false,
});
s.addText("SUPERWOOD: parallel-to-grain tension, production material. Steel: ASTM A36 structural. Aluminum: 6061-T6. Company test data; design values and methods available on request.",
  { x: 2.7, y: 6.78, w: 7.9, h: 0.3, fontFace: SANS, fontSize: 9, italic: true, color: MUTED, align: "center", margin: 0 });

// ---------- 9 · PROPERTIES ----------
s = pres.addSlide(); base(s, "InventWood · Technology");
kicker(s, "Beyond Strength");
title(s, "Properties that matter on a data center campus");
s.addImage({ path: "prep/prod-board.jpg", x: 0.55, y: 1.95, w: 4.0, h: 4.0 * 427 / 640 });
s.addText([
  { text: "Stronger than steel.\n", options: { color: CREAM } },
  { text: "One-sixth the weight.\n", options: { color: GOLD } },
  { text: "Made from wood, in America.", options: { color: CREAM } },
], { x: 0.55, y: 4.95, w: 4.0, h: 1.9, fontFace: SERIF, fontSize: 19, bold: true, margin: 0, valign: "top" });
const props = [
  ["icon_fire", "Fire resistant", "ASTM E84 Class A (surface flame spread) and aerospace standards; dense natural char layer. Assembly ratings: see roadmap"],
  ["icon_shield", "Durable and impact resistant", "3× more dent-resistant than oak; impact and storm resistant — suited to fences, screens and door protection"],
  ["icon_droplet", "Resists moisture, pests and rot", "No rust; protects against termites, mold and fungus for exterior and yard use"],
  ["icon_thermo", "Thermally and electrically insulating", "100× better than steel, 400× better than aluminum; non-conductive around electrical infrastructure"],
  ["icon_vibration_cream", "Sound attenuating", "Improved damping vs. steel — the basis for acoustic barriers and equipment screens (STC/OITC testing on the roadmap)"],
  ["icon_rf", "RF transparent", "Useful in niches: antenna screening, timing-antenna enclosures, telecom shelters"],
  ["icon_leaf", "Naturally beautiful", "The texture, colors and warmth of wood — the biophilic, community-facing surface"],
];
props.forEach(([icon, head, sub], i) => {
  const y = 1.95 + i * 0.72;
  s.addImage({ path: `prep/${icon}.png`, x: 5.05, y: y + 0.03, w: 0.34, h: 0.34 });
  s.addText(head.toUpperCase(), { x: 5.6, y, w: 7.2, h: 0.28, fontFace: SANS, fontSize: 12, bold: true, color: CREAM, charSpacing: 1, margin: 0 });
  s.addText(sub, { x: 5.6, y: y + 0.29, w: 7.2, h: 0.4, fontFace: SANS, fontSize: 9.5, color: MUTED, margin: 0 });
});

// ---------- 10 · CERTIFICATION & CAPABILITIES ROADMAP ----------
s = pres.addSlide(); base(s, "InventWood · Technology");
kicker(s, "Capabilities & Certification Roadmap");
title(s, "Performance climbs; the code pathway is mapped");
const roadCols = ["", "Immediate (2025–26)", "Medium term (2027–29)", "Long term (2030+)"];
const roadRows = [
  ["Tensile strength — production", "500 MPa", "↑", "toward 1,000 MPa"],
  ["Elastic modulus — production", "40 GPa", "↑", "toward 80 GPa"],
  ["Product forms", "Boards up to 8\" × 16' × 3/8\"", "Boards + veneers (SuperMill Two)", "Panels & OSB-type products (ChipMill)"],
  ["Fire & code pathway", "ASTM E84 Class A tested. Backplanes: UL 94 (yellow card) — testing not yet started", "Trusses: no fire-resistance requirement. ASTM E119 assemblies and NFPA 285 exterior walls — not yet started", "FM acceptance and ICC-ES evaluation via the mass-timber qualification pathway"],
];
const colX = [0.55, 4.3, 7.3, 10.3], colW = [3.6, 2.85, 2.85, 2.45];
roadCols.forEach((c, i) => {
  if (c) s.addText(c.toUpperCase(), { x: colX[i], y: 2.05, w: colW[i], h: 0.5, fontFace: SANS, fontSize: 10.5, bold: true, color: BRIGHT, charSpacing: 1.5, margin: 0 });
});
roadRows.forEach(([label, a, b, c], r) => {
  const y = 2.65 + r * 1.0;
  s.addShape(pres.ShapeType.rect, { x: 0.55, y: y - 0.12, w: 12.2, h: 0.02, fill: { color: "3A2B1A" } });
  s.addText(label, { x: colX[0], y, w: colW[0], h: 0.85, fontFace: SANS, fontSize: 12.5, bold: true, color: CREAM, margin: 0, valign: "top" });
  [a, b, c].forEach((v, i) => {
    s.addText(v, { x: colX[i + 1], y, w: colW[i + 1], h: 0.85, fontFace: SANS, fontSize: 10.5, color: DIM, margin: 0, valign: "top" });
  });
});
s.addText("Lab samples have demonstrated 600+ MPa tensile strength, with pathways to 1,000 MPa and 80 GPa. Certification programs are scoped per application with each customer; none has started yet. Test methods and property data available on request.",
  { x: 0.55, y: 6.65, w: 12.2, h: 0.5, fontFace: SANS, fontSize: 10, italic: true, color: MUTED, margin: 0 });

// ================= SECTION 03 · IMPACT =================
sectionDivider("03", "The", "Impact", "Embodied carbon and circularity — labeled as the projections they are");

// ---------- 12 · THE VISION ----------
s = pres.addSlide(); base(s, "InventWood · Impact");
kicker(s, "Impact · The Vision");
title(s, [
  { text: "Can the world's data centers be a ", options: {} },
  { text: "carbon sink", options: { italic: true, color: GOLD } },
  { text: "?", options: {} },
], 0.55, 0.88, 11.9, 30);
s.addText("Data centers are poised for massive growth. We asked: can we build them as long-term stores of carbon rather than massive emitters — and earn the social license to operate and scale? We think this is the way to do it:",
  { x: 0.55, y: 1.95, w: 12.2, h: 0.75, fontFace: SANS, fontSize: 14, color: DIM, margin: 0 });
const visionCols = [
  ["POWERED", "by carbon-free electricity", "Maximize efficiency and flexibility of load, then power with renewable energy, nuclear, biomass, and potentially BECCS — bio-energy with carbon capture and storage. Serve the grid.", "26301C"],
  ["CONSTRUCTED", "from waste biomaterials", "Replace today's carbon-intensive materials with carbon-storing materials — designed for reuse at end of life to maximize lifecycle carbon benefit.", "2E2113"],
];
visionCols.forEach(([big, rest, sub, tint], i) => {
  const cw = 6.0, x = 0.55 + i * 6.2;
  s.addShape(pres.ShapeType.roundRect, { x, y: 2.95, w: cw, h: 2.2, rectRadius: 0.09, fill: { color: tint } });
  s.addText([
    { text: big + " ", options: { bold: true, color: GOLD } },
    { text: rest, options: { color: CREAM } },
  ], { x: x + 0.3, y: 3.2, w: cw - 0.6, h: 0.45, fontFace: SANS, fontSize: 17, margin: 0 });
  s.addText(sub, { x: x + 0.3, y: 3.75, w: cw - 0.6, h: 1.3, fontFace: SANS, fontSize: 12.5, color: MUTED, margin: 0, valign: "top" });
});
s.addShape(pres.ShapeType.roundRect, { x: 0.55, y: 5.45, w: 12.2, h: 0.95, rectRadius: 0.09, fill: { color: PANEL } });
s.addText([
  { text: "Steel is the lever, SUPERWOOD is the enabler.  ", options: { bold: true, color: GOLD } },
  { text: "Steel sits at nearly every level of a data center — frame, joists and deck, platforms, racking, fences and screens. Replacing it element by element with a carbon-storing material is how the building's embodied ledger moves.", options: { color: DIM } },
], { x: 0.85, y: 5.55, w: 11.6, h: 0.75, fontFace: SANS, fontSize: 12, margin: 0, valign: "middle" });

// ---------- 13 · STEEL VS SUPERWOOD (full-bleed head-to-head) ----------
s = pres.addSlide();
s.background = { color: INK };
s.slideNumber = { x: W - 0.75, y: H - 0.42, w: 0.5, fontFace: SANS, fontSize: 9, color: DIM };
const BAND_Y = 7.06, TOP_Y = 1.12, ROW_H = (BAND_Y - TOP_Y) / 3;
const PH_W = 4.75;
const CEN_X = PH_W, CEN_W = W - 2 * PH_W;
const BEAM_H = BAND_Y, BEAM_W = BEAM_H * 768 / 1376;
const steelPhotos = ["prep/tile_mine.jpg", "prep/tile_furnace.jpg", "prep/tile_smoke.jpg"];
const woodPhotos = ["media/image65.jpeg", "prep/factory.jpg", "media/image111.png"];
[0, 1, 2].forEach((r) => {
  const y = TOP_Y + r * ROW_H;
  s.addImage({ path: steelPhotos[r], x: 0, y, w: PH_W, h: ROW_H, sizing: { type: "crop", w: PH_W, h: ROW_H } });
  s.addImage({ path: woodPhotos[r], x: W - PH_W, y, w: PH_W, h: ROW_H, sizing: { type: "crop", w: PH_W, h: ROW_H } });
});
s.addImage({ path: "prep/beam_steel_cut.png", x: -0.95, y: 0, w: BEAM_W, h: BEAM_H });
s.addImage({ path: "prep/beam_wood_cut.png", x: W - BEAM_W + 0.95, y: 0, w: BEAM_W, h: BEAM_H });
s.addShape(pres.ShapeType.rect, { x: CEN_X, y: 0, w: CEN_W, h: BAND_Y, fill: { color: "150E08", transparency: 10 } });
s.addShape(pres.ShapeType.rect, { x: 0, y: 0, w: W, h: TOP_Y, fill: { color: "150E08", transparency: 15 } });
s.addText("Manufacturing: Steel vs SUPERWOOD", { x: 0, y: 0.28, w: W, h: 0.62, fontFace: SERIF, fontSize: 27, color: CREAM, align: "center", margin: 0 });
const comp = [
  ["Raw Material", "10+ years to develop a mine; highly polluting", "Universal, abundant, regenerative"],
  ["Manufacturing", "Energy intensive (1,800° C)\nCapital intensive", "Energy efficient (< 180° C)\nCapital efficient"],
];
const HALF = CEN_W / 2 - 0.22;
comp.forEach(([head, l, rgt], r) => {
  const y = TOP_Y + r * ROW_H + 0.22;
  s.addText(head, { x: CEN_X, y, w: CEN_W, h: 0.42, fontFace: SERIF, fontSize: 17, bold: true, color: CREAM, align: "center", margin: 0 });
  s.addShape(pres.ShapeType.rect, { x: CEN_X + CEN_W / 2 - 0.008, y: y + 0.5, w: 0.016, h: 1.05, fill: { color: "5A452E" } });
  s.addText(l, { x: CEN_X + 0.1, y: y + 0.52, w: HALF, h: 1.05, fontFace: SANS, fontSize: 11, color: DIM, align: "center", margin: 0, valign: "top" });
  s.addText(rgt, { x: CEN_X + CEN_W / 2 + 0.12, y: y + 0.52, w: HALF, h: 1.05, fontFace: SANS, fontSize: 11, color: DIM, align: "center", margin: 0, valign: "top" });
});
const gy = TOP_Y + 2 * ROW_H + 0.12;
s.addText("GHG Emissions — projected", { x: CEN_X, y: gy, w: CEN_W, h: 0.42, fontFace: SERIF, fontSize: 17, bold: true, color: CREAM, align: "center", margin: 0 });
s.addShape(pres.ShapeType.rect, { x: CEN_X + CEN_W / 2 - 0.008, y: gy + 0.44, w: 0.016, h: 0.72, fill: { color: "5A452E" } });
s.addText("1.8 kg", { x: CEN_X + 0.1, y: gy + 0.4, w: HALF, h: 0.42, fontFace: SERIF, fontSize: 22, bold: true, color: ROSE, align: "center", margin: 0 });
s.addText("CO₂e per kg of steel (global average)", { x: CEN_X + 0.1, y: gy + 0.82, w: HALF, h: 0.3, fontFace: SANS, fontSize: 9, color: DIM, align: "center", margin: 0 });
s.addText("0.5 kg", { x: CEN_X + CEN_W / 2 + 0.12, y: gy + 0.4, w: HALF, h: 0.42, fontFace: SERIF, fontSize: 22, bold: true, color: GREEN, align: "center", margin: 0 });
s.addText("CO₂e per kg SUPERWOOD made; 1.3 kg/kg biogenic carbon stored", { x: CEN_X + CEN_W / 2 + 0.12, y: gy + 0.82, w: HALF, h: 0.36, fontFace: SANS, fontSize: 9, color: DIM, align: "center", margin: 0 });
s.addText("Pre-LCA projections for a full-scale plant; LCA under way with Prof. Ming Hu, University of Notre Dame. Biogenic storage reported separately (released at end of life under EN 15804). Recycled (EAF) steel emits less than the average shown.",
  { x: CEN_X + 0.1, y: gy + 1.22, w: CEN_W - 0.2, h: 0.55, fontFace: SANS, fontSize: 8, italic: true, color: MUTED, align: "center", margin: 0, valign: "top" });
s.addShape(pres.ShapeType.rect, { x: 0, y: BAND_Y, w: W / 2, h: H - BAND_Y, fill: { color: "17100A" } });
s.addShape(pres.ShapeType.rect, { x: W / 2, y: BAND_Y, w: W / 2, h: H - BAND_Y, fill: { color: PANEL } });
s.addText("STEEL", { x: 0, y: BAND_Y + 0.07, w: W / 2, h: 0.3, fontFace: SANS, fontSize: 13, bold: true, color: MUTED, charSpacing: 5, align: "center", margin: 0 });
s.addText("SUPERWOOD", { x: W / 2, y: BAND_Y + 0.07, w: W / 2, h: 0.3, fontFace: SANS, fontSize: 13, bold: true, color: CREAM, charSpacing: 5, align: "center", margin: 0 });

// ---------- 14 · THE CARBON ENGINE ----------
s = pres.addSlide();
s.background = { path: "prep/clouds_bg.jpg" };
s.slideNumber = { x: W - 0.75, y: H - 0.42, w: 0.5, fontFace: SANS, fontSize: 9, color: DIM };
s.addText("We create an economic engine powering a healthier planet — with long-term storage in forests, in buildings, and even after the end of life of a building",
  { x: 0.55, y: 0.4, w: 12.2, h: 1.35, fontFace: SERIF, fontSize: 21, bold: true, color: CREAM, margin: 0 });
function arrow(x1, y1, x2, y2) {
  s.addShape(pres.ShapeType.line, { x: Math.min(x1, x2), y: Math.min(y1, y2), w: Math.abs(x2 - x1), h: Math.abs(y2 - y1),
    flipV: (y2 < y1) !== (x2 < x1), flipH: x2 < x1, line: { color: CREAM, width: 1.5, endArrowType: "triangle" } });
}
s.addImage({ path: "prep/degraded_land.jpg", x: 0.55, y: 2.3, w: 1.5, h: 1.5 });
s.addText("Convert degraded land into healthy forests", { x: 0.4, y: 3.9, w: 2.1, h: 0.6, fontFace: SANS, fontSize: 10.5, bold: true, color: GOLD, margin: 0 });
s.addText("Increasing ecosystem diversity and CO₂ removal · storing CO₂ in the biome",
  { x: 0.4, y: 4.55, w: 2.1, h: 0.8, fontFace: SANS, fontSize: 8.5, color: CREAM, margin: 0 });
s.addImage({ path: "media/image65.jpeg", x: 2.55, y: 3.0, w: 1.75, h: 1.35, sizing: { type: "crop", w: 1.75, h: 1.35 } });
arrow(2.1, 3.1, 2.5, 3.4);
s.addShape(pres.ShapeType.roundRect, { x: 4.75, y: 2.95, w: 2.0, h: 0.36, rectRadius: 0.05, fill: { color: GOLD } });
s.addText("MAKE SUPERWOOD", { x: 4.75, y: 3.0, w: 2.0, h: 0.28, fontFace: SANS, fontSize: 10, bold: true, color: "1A1209", align: "center", margin: 0 });
s.addImage({ path: "prep/prod-board.jpg", x: 4.75, y: 3.42, w: 2.0, h: 2.0 * 427 / 640 });
s.addText("Using underutilized or waste wood — replacing highly polluting steel and concrete",
  { x: 4.65, y: 4.85, w: 2.25, h: 0.85, fontFace: SANS, fontSize: 8.5, color: CREAM, margin: 0 });
arrow(4.35, 3.6, 4.72, 3.5);
s.addShape(pres.ShapeType.roundRect, { x: 6.95, y: 2.25, w: 1.5, h: 0.34, rectRadius: 0.05, fill: { color: GREEN } });
s.addText("Reuse / recycle", { x: 6.95, y: 2.3, w: 1.5, h: 0.26, fontFace: SANS, fontSize: 9.5, bold: true, color: "1A1209", align: "center", margin: 0 });
arrow(8.6, 2.75, 7.6, 2.62);
s.addText("Store carbon in beautiful structures", { x: 7.6, y: 2.85, w: 2.3, h: 0.3, fontFace: SANS, fontSize: 10.5, bold: true, color: GOLD, margin: 0 });
s.addImage({ path: "media/image99.png", x: 7.6, y: 3.2, w: 2.3, h: 2.3 * 736 / 1313 });
s.addText("Sequestering CO₂ in buildings for the life of the structure",
  { x: 7.6, y: 4.6, w: 2.3, h: 0.6, fontFace: SANS, fontSize: 8.5, color: CREAM, margin: 0 });
arrow(6.85, 3.7, 7.55, 3.8);
s.addText("Store after life of building", { x: 10.35, y: 3.15, w: 2.4, h: 0.3, fontFace: SANS, fontSize: 10.5, bold: true, color: GOLD, margin: 0 });
s.addImage({ path: "prep/road_cross_section.jpg", x: 10.35, y: 3.5, w: 2.4, h: 2.4 * 768 / 1376 });
s.addText("In places like foundations or roads — very long-term storage, with a reuse pathway still to be demonstrated",
  { x: 10.35, y: 4.95, w: 2.4, h: 0.85, fontFace: SANS, fontSize: 8.5, color: CREAM, margin: 0 });
arrow(9.95, 3.95, 10.3, 4.1);
s.addText("Concept renderings & photography", { x: W - 3.3, y: 7.05, w: 2.9, h: 0.25, fontFace: SANS, fontSize: 8, italic: true, color: DIM, align: "right", margin: 0 });

// ---------- 15 · FEEDSTOCK ----------
s = pres.addSlide(); base(s, "InventWood · Impact");
kicker(s, "Impact · Feedstock");
title(s, "Flexible, renewable, highly scalable feedstock");
s.addShape(pres.ShapeType.roundRect, { x: 0.55, y: 1.95, w: 12.2, h: 1.15, rectRadius: 0.09, fill: { color: PANEL } });
s.addText([
  { text: "12.5 million tons per year ", options: { bold: true, color: GOLD, fontSize: 15 } },
  { text: "of SUPERWOOD could displace 50% of steel demand in the US — roughly all the steel used in construction.", options: { color: CREAM, fontSize: 13.5 } },
], { x: 0.85, y: 2.25, w: 11.6, h: 0.6, fontFace: SANS, margin: 0 });
s.addText("EXAMPLES OF EXCESS SUPPLY IN THE US", { x: 0.55, y: 3.45, w: 8, h: 0.32, fontFace: SANS, fontSize: 11, bold: true, color: BRIGHT, charSpacing: 2, margin: 0 });
const feed = [
  ["167 Mt/yr", "Forest overburden in Western National Forests"],
  ["14 Mt/yr", "Excess capacity in Southern lumber mills"],
  ["12 Mt/yr", "Wood waste sent to landfills"],
  ["2.5 Mt/yr", "End-of-life fruit and nut trees"],
];
feed.forEach(([big, small], i) => {
  const col = i % 2, row = Math.floor(i / 2);
  const x = 0.55 + col * 6.2, y = 3.95 + row * 1.35;
  s.addShape(pres.ShapeType.roundRect, { x, y, w: 6.0, h: 1.15, rectRadius: 0.09, fill: { color: PANEL } });
  s.addText(big, { x: x + 0.3, y: y + 0.28, w: 1.8, h: 0.6, fontFace: SERIF, fontSize: 20, color: GOLD, margin: 0 });
  s.addText(small, { x: x + 2.25, y: y + 0.2, w: 3.6, h: 0.8, fontFace: SANS, fontSize: 11.5, color: DIM, margin: 0, valign: "middle" });
});
s.addText("Sources: MDPI Mass Timber Consumption Report; EPA.gov; US Forest Service Sawmill Capacity and Production Report; New Leaf Management Ltd. Consulting.",
  { x: 0.55, y: 6.75, w: 12.2, h: 0.35, fontFace: SANS, fontSize: 9, italic: true, color: MUTED, margin: 0 });

// ================= SECTION 04 · APPLICATIONS =================
sectionDivider("04", "Data Center", "Applications", "Skins and fences now; certification-gated next; structure after");

// ---------- 17 · HOW DATA CENTERS BENEFIT ----------
s = pres.addSlide(); base(s, "InventWood · Applications");
kicker(s, "Data Center Applications");
title(s, "Fast, cost-effective, carbon-storing data centers");
const benefits = [
  ["Faster, easier builds", "Up to 10× the strength-to-weight ratio of steel — lighter to ship and lift, faster to assemble and disassemble, with a short domestic supply chain."],
  ["Safer construction and operations", "Steel is heavy, sharp, and conductive. SUPERWOOD is one-sixth the weight, without sharp edges, and electrically non-conductive."],
  ["Biophilic, community-friendly design", "Natural beauty and texture that meets industrial-grade demands — a way to humanize hyperscale campuses facing public opposition, inside and out."],
  ["Lower embodied carbon per element", "A bio-based material that stores biogenic carbon and is projected to emit far less in production than steel — verified element by element as the LCA lands."],
];
benefits.forEach(([head, sub], i) => {
  const y = 2.05 + i * 1.24;
  s.addText(`0${i + 1}`, { x: 0.55, y, w: 0.8, h: 0.6, fontFace: SERIF, fontSize: 24, color: WOOD, margin: 0 });
  s.addText(head, { x: 1.45, y, w: 6.2, h: 0.4, fontFace: SANS, fontSize: 15.5, bold: true, color: CREAM, margin: 0 });
  s.addText(sub, { x: 1.45, y: y + 0.4, w: 6.2, h: 0.85, fontFace: SANS, fontSize: 11, color: MUTED, margin: 0, valign: "top" });
});
s.addImage({ path: pick("prep/dc_facade.jpg", "prep/app_shell.jpg"), x: 8.1, y: 2.05, w: 4.65, h: 3.5, sizing: { type: "crop", w: 4.65, h: 3.5 } });
s.addText("Concept rendering — the street-facing view of a campus clad and screened in SUPERWOOD.",
  { x: 8.1, y: 5.6, w: 4.65, h: 0.5, fontFace: SANS, fontSize: 10, italic: true, color: MUTED, margin: 0 });

// ---------- 18 · AVAILABLE NOW ----------
s = pres.addSlide(); base(s, "InventWood · Applications");
kicker(s, "Data Center Applications");
title(s, "Available now — skins, screens, and fences");
s.addText("Every item below ships from SuperMill One today as boards up to 8\" × 16' × 3/8\", exterior or interior grade.",
  { x: 0.55, y: 1.85, w: 12.2, h: 0.4, fontFace: SANS, fontSize: 12, color: DIM, margin: 0 });
const nowTiles = [
  ["tile_cladding", "Facades, cladding & rain screens"],
  [pick("prep/tiles/tile_lobby.jpg") ? "tile_lobby" : "tile_cladding", "Biophilic interiors for office spaces"],
  ["tile_louvers2", "Louvers & equipment screening"],
  [pick("prep/tiles/tile_fence_staff.jpg") ? "tile_fence_staff" : "tile_barrier", "Fencing for staff outdoor spaces"],
  [pick("prep/tiles/tile_fence_security.jpg") ? "tile_fence_security" : "tile_barrier", "Security fencing around transformers & outdoor infrastructure"],
  [pick("prep/tiles/tile_backplane.jpg") ? "tile_backplane" : "tile_subframing2", "Equipment backplanes"],
  ["tile_doorkick", "Trim, door kicks & sub-framing"],
];
{
  const cw = 12.2 / nowTiles.length, rowY = 2.5;
  nowTiles.forEach(([img, label], j) => {
    const x = 0.55 + j * cw;
    s.addImage({ path: `prep/tiles/${img}.jpg`, x: x + (cw - 1.55) / 2, y: rowY, w: 1.55, h: 1.55 });
    s.addText(label, { x: x + 0.05, y: rowY + 1.65, w: cw - 0.1, h: 0.9, fontFace: SANS, fontSize: 10.5, color: DIM, align: "center", margin: 0, valign: "top" });
  });
}
s.addShape(pres.ShapeType.roundRect, { x: 0.55, y: 5.35, w: 12.2, h: 1.1, rectRadius: 0.09, fill: { color: PANEL } });
s.addText([
  { text: "Why these first.  ", options: { bold: true, color: GOLD } },
  { text: "They need no assembly fire rating, they sit where the community and the workforce see the campus, and they are the near-term projects our hyperscaler customers have asked for: building facades, biophilic office interiors, staff-area fencing, and security fencing around critical outdoor infrastructure.", options: { color: DIM } },
], { x: 0.85, y: 5.45, w: 11.6, h: 0.9, fontFace: SANS, fontSize: 11.5, margin: 0, valign: "middle" });
s.addText("Concept renderings", { x: 9.75, y: 6.6, w: 3.0, h: 0.3, fontFace: SANS, fontSize: 9.5, italic: true, color: MUTED, align: "right", margin: 0 });

// ---------- 19 · CERTIFICATION-GATED ----------
s = pres.addSlide(); base(s, "InventWood · Applications");
kicker(s, "Data Center Applications");
title(s, "Next — applications gated by a specific test or listing");
const gated = [
  ["tile_barrier", "Acoustic barrier walls & equipment screens", "STC / OITC lab data, field insertion loss"],
  ["tile_walkway", "Walkways & platforms", "Published design values, connection data"],
  ["tile_railing2", "Railings", "Load testing to code (IBC 1607)"],
  ["tile_mullion2", "Window mullions", "Thermal and structural performance data"],
  ["tile_door", "Interior doors & door protection", "UL 10C listing for rated openings"],
  ["tile_flooring2", "Industrial-grade flooring", "Rolling-load and slip testing"],
];
{
  const cw = 12.2 / gated.length, rowY = 2.1;
  gated.forEach(([img, label, gate], j) => {
    const x = 0.55 + j * cw;
    s.addImage({ path: `prep/tiles/${img}.jpg`, x: x + (cw - 1.55) / 2, y: rowY, w: 1.55, h: 1.55 });
    s.addText(label, { x: x + 0.05, y: rowY + 1.65, w: cw - 0.1, h: 0.62, fontFace: SANS, fontSize: 11, bold: true, color: CREAM, align: "center", margin: 0, valign: "top" });
    s.addText("GATED BY", { x: x + 0.05, y: rowY + 2.32, w: cw - 0.1, h: 0.22, fontFace: SANS, fontSize: 8, bold: true, color: BRIGHT, charSpacing: 1.5, align: "center", margin: 0 });
    s.addText(gate, { x: x + 0.05, y: rowY + 2.55, w: cw - 0.1, h: 0.7, fontFace: SANS, fontSize: 9.5, color: MUTED, align: "center", margin: 0, valign: "top" });
  });
}
s.addText("Each of these is a scoped test program, not a research question — and the natural first co-funded project with a customer. Timing depends on which one a customer picks up first.",
  { x: 0.55, y: 5.7, w: 12.2, h: 0.6, fontFace: SANS, fontSize: 11.5, italic: true, color: MUTED, margin: 0 });
s.addText("Concept renderings", { x: 9.75, y: 6.6, w: 3.0, h: 0.3, fontFace: SANS, fontSize: 9.5, italic: true, color: MUTED, align: "right", margin: 0 });

// ---------- 20 · STRUCTURAL ----------
s = pres.addSlide(); base(s, "InventWood · Applications");
kicker(s, "Data Center Applications");
title(s, "Then — structure, through the mass-timber pathway");
const lt = [
  ["tile_spaceframe", "Building enclosures & structural components", "The co-development target with our hyperscaler customers' architects and engineers; ultimately optimized shells and foundations"],
  ["tile_truss2", "Trusses and CLT-type floor, roof & wall assemblies", "Trusses carry no fire-resistance requirement; assemblies follow E119 and the PRG 320-style qualification route"],
  ["tile_fanwall", "HVAC enclosures & separations", "Insulating, lightweight, vibration-damping enclosures and air separations — not in-airstream ducting"],
  ["tile_rackocp", "Racking & equipment supports", "Backplanes first (UL 94), then racking and heavy-load supports as design values and seismic qualification complete"],
];
lt.forEach(([img, head, sub], i) => {
  const col = i % 2, row = Math.floor(i / 2);
  const cw = 6.0, x = 0.55 + col * 6.2, y = 2.1 + row * 2.15;
  s.addShape(pres.ShapeType.roundRect, { x, y, w: cw, h: 1.95, rectRadius: 0.09, fill: { color: PANEL } });
  s.addImage({ path: `prep/tiles/${img}.jpg`, x: x + 0.25, y: y + 0.25, w: 1.45, h: 1.45 });
  s.addText(head, { x: x + 1.95, y: y + 0.22, w: cw - 2.2, h: 0.62, fontFace: SANS, fontSize: 13, bold: true, color: CREAM, margin: 0 });
  s.addText(sub, { x: x + 1.95, y: y + 0.86, w: cw - 2.2, h: 1.0, fontFace: SANS, fontSize: 10, color: MUTED, margin: 0, valign: "top" });
});
s.addText("Concept renderings · SUPERWOOD can be qualified as a new, far stronger species through the pathway mass timber has already opened in the building codes. This is the structural-steel replacement our customers are asking about, and it is SuperMill Two-scale demand.",
  { x: 0.55, y: 6.45, w: 12.2, h: 0.55, fontFace: SANS, fontSize: 10.5, italic: true, color: MUTED, margin: 0 });

// ================= SECTION 05 · CUSTOMERS =================
sectionDivider("05", "Our", "Customers", "Who is already building with us — engagement as of September 2026");

// ---------- 22 · ENGAGEMENT AT A GLANCE ----------
s = pres.addSlide(); base(s, "InventWood · Customers");
kicker(s, "Customers");
title(s, "Hyperscaler engagement at a glance");
const glance = [
  ["Microsoft", "Broad engagement", "Already builds data centers with CLT floors. Strategic interest in SUPERWOOD in the basis of design for future data centers; roof trusses leading to roofs and fast-to-build enclosures; immediate deployment of facades, interiors and fencing."],
  ["Meta", "Engaged for over a year", "Broad engagement across the data center ecosystem. Facade applications and backplanes under way; plan to move into structural applications and racking over time."],
  ["Google", "Engagement just begun", "Initial focus on replacement of structural steel."],
];
glance.forEach(([name, stage, sub], i) => {
  const cw = 3.95, x = 0.55 + i * 4.125;
  s.addShape(pres.ShapeType.roundRect, { x, y: 1.95, w: cw, h: 2.55, rectRadius: 0.09, fill: { color: PANEL }, line: { color: WOOD, width: 0.75 } });
  s.addText(name, { x: x + 0.28, y: 2.12, w: cw - 0.56, h: 0.5, fontFace: SERIF, fontSize: 24, color: CREAM, margin: 0 });
  s.addShape(pres.ShapeType.roundRect, { x: x + 0.28, y: 2.7, w: 2.3, h: 0.3, rectRadius: 0.15, fill: { color: "3A2B1A" } });
  s.addText(stage.toUpperCase(), { x: x + 0.28, y: 2.7, w: 2.3, h: 0.3, fontFace: SANS, fontSize: 8, bold: true, color: GOLD, charSpacing: 1.2, align: "center", margin: 0, valign: "middle" });
  s.addText(sub, { x: x + 0.28, y: 3.12, w: cw - 0.56, h: 1.3, fontFace: SANS, fontSize: 10.5, color: DIM, margin: 0, valign: "top" });
});
const also = [
  ["ALSO AT THE TABLE", "Vertiv · Wooden Data Center · data center operators focused on security fencing"],
  ["CONSTRUCTION PARTNERS", "Enthusiastic support from some of the largest data center builders — HITT and Turner — alongside engineering partners Fast + Epp and Timber Engineering"],
];
also.forEach(([label, names], i) => {
  const y = 4.75 + i * 0.7;
  s.addShape(pres.ShapeType.roundRect, { x: 0.55, y, w: 12.2, h: 0.56, rectRadius: 0.07, fill: { color: "2E2113" } });
  s.addText(label, { x: 0.85, y: y + 0.13, w: 3.2, h: 0.3, fontFace: SANS, fontSize: 9.5, bold: true, color: BRIGHT, charSpacing: 1.5, margin: 0 });
  s.addText(names, { x: 4.1, y: y + 0.06, w: 8.5, h: 0.44, fontFace: SANS, fontSize: 11, color: CREAM, margin: 0, valign: "middle" });
});
s.addText("Engagement stages as reported by InventWood, September 2026. Customer names used with permission.",
  { x: 0.55, y: 6.3, w: 12.2, h: 0.3, fontFace: SANS, fontSize: 9, italic: true, color: MUTED, margin: 0 });

// ---------- 23–25 · CUSTOMER PROFILES ----------
function profile(name, stage, publicLine, publicSrc, points, img, cap) {
  const p = pres.addSlide(); base(p, "InventWood · Customers");
  kicker(p, "Customer Profile");
  p.addText([
    { text: name, options: {} },
    { text: "  " + stage, options: { italic: true, color: GOLD, fontSize: 20 } },
  ], { x: 0.55, y: 0.88, w: 11.9, h: 0.95, fontFace: SERIF, fontSize: 32, color: CREAM, margin: 0 });
  if (publicLine) {
    p.addShape(pres.ShapeType.roundRect, { x: 0.55, y: 1.95, w: 7.3, h: 1.05, rectRadius: 0.09, fill: { color: "2E2113" } });
    p.addText("ON THE PUBLIC RECORD", { x: 0.85, y: 2.05, w: 6.8, h: 0.25, fontFace: SANS, fontSize: 8.5, bold: true, color: BRIGHT, charSpacing: 1.5, margin: 0 });
    p.addText(publicLine, { x: 0.85, y: 2.32, w: 6.8, h: 0.62, fontFace: SANS, fontSize: 10.5, color: CREAM, margin: 0, valign: "top" });
  }
  p.addText("WORKING WITH INVENTWOOD", { x: 0.55, y: publicLine ? 3.2 : 1.95, w: 7.3, h: 0.28, fontFace: SANS, fontSize: 10, bold: true, color: BRIGHT, charSpacing: 2, margin: 0 });
  points.forEach(([head, sub], i) => {
    const y = (publicLine ? 3.58 : 2.35) + i * 0.82;
    p.addShape(pres.ShapeType.ellipse, { x: 0.58, y: y + 0.08, w: 0.14, h: 0.14, fill: { color: GOLD } });
    p.addText(head, { x: 0.95, y, w: 6.9, h: 0.32, fontFace: SANS, fontSize: 13, bold: true, color: CREAM, margin: 0 });
    if (sub) p.addText(sub, { x: 0.95, y: y + 0.33, w: 6.9, h: 0.48, fontFace: SANS, fontSize: 10.5, color: MUTED, margin: 0, valign: "top" });
  });
  if (img) {
    p.addImage({ path: img, x: 8.35, y: 1.95, w: 4.4, h: 4.4, sizing: { type: "crop", w: 4.4, h: 4.4 } });
    p.addText(cap, { x: 8.35, y: 6.4, w: 4.4, h: 0.4, fontFace: SANS, fontSize: 9.5, italic: true, color: MUTED, margin: 0 });
  }
  if (publicSrc) p.addText(publicSrc, { x: 0.55, y: 6.75, w: 7.5, h: 0.3, fontFace: SANS, fontSize: 8.5, italic: true, color: MUTED, margin: 0 });
  return p;
}
profile("Microsoft", "broad engagement",
  "Two Northern Virginia datacenters built with cross-laminated timber floor panels on a steel frame — an estimated 35% embodied-carbon reduction vs. conventional steel construction and 65% vs. precast concrete. Design by Gensler; structural engineering by Thornton Tomasetti.",
  "Source: Microsoft Source, “Microsoft builds first datacenters with wood to slash carbon emissions,” Nov 2024; Thornton Tomasetti project page.",
  [
    ["Strategic interest", "Incorporating SUPERWOOD into the basis of design for future data centers"],
    ["Application areas", "Roof trusses, leading to roofs and fast-to-build building enclosures — developed with their principal architecture and engineering firms"],
    ["Immediate deployment opportunities", "Building facades · biophilic interiors for office spaces · fencing for staff outdoor spaces · security fencing around critical outdoor infrastructure such as transformers"],
  ],
  pick("prep/tiles/tile_fence_security.jpg", "prep/tiles/tile_barrier.jpg"),
  "Concept rendering — SUPERWOOD security fencing around a transformer yard.");
profile("Meta", "engaged for over a year",
  "Piloting mass timber for data center administrative buildings: first completed in 2025 at Aiken, South Carolina (DPR, SmartLam), with projects under way in Cheyenne, Wyoming and Montgomery, Alabama — about a 41% reduction in the embodied carbon of the materials substituted.",
  "Source: Meta Sustainability, “Meta pilots mass timber for more sustainable data center construction,” 31 Jul 2025.",
  [
    ["Broad engagement across every part of the data center ecosystem", "Conversations running for more than a year"],
    ["Facade applications and backplanes under way", "Backplane certification path: UL 94 (yellow card)"],
    ["Structural applications and racking next", "The plan is to move from skins into structure and racking over time"],
  ],
  pick("prep/tiles/tile_backplane.jpg", "prep/tiles/tile_cladding.jpg"),
  "Concept rendering — SUPERWOOD equipment backplane in an electrical room.");
profile("Google", "engagement just begun",
  null, null,
  [
    ["Initial focus: replacement of structural steel", "The structural-steel conversation starts at the qualification pathway — trusses first (no fire-resistance requirement), then assemblies"],
    ["Early stage", "Scope and timeline to be defined with their design teams"],
  ],
  null, null);

// ---------- 26 · PATH TO FIRST PROJECTS ----------
s = pres.addSlide(); base(s, "InventWood · Customers");
kicker(s, "Customers");
title(s, "A concrete path to first projects");
const nexts = [
  ["Skins on one building or yard", "Facades, interiors, louvers, staff-area or security fencing — installed from SuperMill One output, on a friendly site"],
  ["Testing toward the standard the application needs", "UL 94 for backplanes, STC/OITC for barriers, E119 and NFPA 285 for assemblies — scoped and co-funded with the customer"],
  ["Basis-of-design work with the customer's architect and engineer", "Structural enclosure and truss solutions that can be written into the standard campus design"],
  ["Measure the carbon delta", "A baseline bill-of-materials comparison and verification plan, so each project produces defensible numbers as the LCA completes"],
];
nexts.forEach(([head, sub], i) => {
  const y = 2.15 + i * 1.15;
  s.addText(`${i + 1}`, { x: 0.55, y, w: 0.6, h: 0.55, fontFace: SERIF, fontSize: 26, color: WOOD, margin: 0 });
  s.addText(head, { x: 1.4, y, w: 7.3, h: 0.4, fontFace: SANS, fontSize: 16, bold: true, color: CREAM, margin: 0 });
  s.addText(sub, { x: 1.4, y: y + 0.42, w: 7.3, h: 0.6, fontFace: SANS, fontSize: 11, color: MUTED, margin: 0 });
});
s.addImage({ path: "prep/factory.jpg", x: 9.3, y: 2.15, w: 3.5, h: 3.5 * 900 / 1600 });
s.addText("SuperMill One, Frederick, MD", { x: 9.3, y: 4.15, w: 3.5, h: 0.3, fontFace: SANS, fontSize: 10.5, italic: true, color: MUTED, align: "center", margin: 0 });
s.addImage({ path: "media/image111.png", x: 9.3, y: 4.55, w: 3.5, h: 1.84, sizing: { type: "crop", w: 3.5, h: 1.84 } });
s.addText("Concept for SuperMill Two", { x: 9.3, y: 6.45, w: 3.5, h: 0.3, fontFace: SANS, fontSize: 10.5, italic: true, color: MUTED, align: "center", margin: 0 });

// ---------- 27 · CLOSE ----------
s = pres.addSlide();
s.background = { path: "prep/cover_bg.jpg" };
s.addText([
  { text: "Let's build what's ", options: {} },
  { text: "next", options: { italic: true, color: GOLD } },
  { text: ".", options: {} },
], { x: 1.0, y: 2.6, w: 10, h: 1.0, fontFace: SERIF, fontSize: 44, color: CREAM, margin: 0 });
s.addImage({ path: "prep/wordmark_cream.png", x: 1.0, y: 4.0, w: 4.5, h: 4.5 * 2615 / 16347 });
s.addText("Alex Lau · CEO / Co-Founder · alex@inventwood.com", { x: 1.0, y: 4.9, w: 9, h: 0.4, fontFace: SANS, fontSize: 14, color: DIM, margin: 0 });
s.addText("Lex Harris · Director, Capital Markets & IR · lex@inventwood.com", { x: 1.0, y: 5.35, w: 9, h: 0.4, fontFace: SANS, fontSize: 14, color: DIM, margin: 0 });

pres.writeFile({ fileName: "SUPERWOOD-for-Data-Centers-Companion.pptx" }).then(() => console.log("written"));
