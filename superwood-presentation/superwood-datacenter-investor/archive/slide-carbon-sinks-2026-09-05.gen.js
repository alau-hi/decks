// ---------- 17 · THE VISION ----------
s = pres.addSlide();
s.background = { path: "prep/campus_hero.jpg" };
s.addShape(pres.ShapeType.rect, { x: 0, y: 0, w: W, h: H, fill: { color: "120C07", transparency: 45 } });
s.slideNumber = { x: W - 0.75, y: H - 0.42, w: 0.5, fontFace: SANS, fontSize: 9, color: DIM };
s.addText("THE VISION", { x: L, y: 0.6, w: 6, h: 0.32, fontFace: SANS, fontSize: 12, color: BRIGHT, charSpacing: 4, bold: true, margin: 0 });
s.addText([t("Can the world's data centers be "), gold("big, beautiful carbon sinks"), t("?")], { x: L, y: 1.0, w: 12.2, h: 1.6, fontFace: SERIF, fontSize: 40, color: CREAM, margin: 0, valign: "top" });
const vis3 = [
  ["Big", "A gigawatt data center is millions of square feet of skins and screens and tens of thousands of tons of structure — and hyperscalers build one data center after another to one design."],
  ["Beautiful", "Warm, quiet, biophilic exteriors and interiors that ease community and planning approval."],
  ["Carbon sinks", "Built from a material that stores about 1.3 kg CO₂e of biogenic carbon per kg and displaces the steel that carries most of the building materials' embodied carbon."],
];
vis3.forEach(([head, sub], i) => {
  const cw = 3.95, x = L + i * 4.125, y = 4.35;
  s.addShape(pres.ShapeType.roundRect, { x, y, w: cw, h: 2.15, rectRadius: 0.09, fill: { color: "1A1209", transparency: 15 } });
  s.addText(head, { x: x + 0.3, y: y + 0.22, w: cw - 0.6, h: 0.5, fontFace: SERIF, fontSize: 22, color: GOLD, margin: 0 });
  body(s, sub, x + 0.3, y + 0.8, cw - 0.6, 1.25, 11, CREAM);
});
s.addText("Whether a building nets out as a store of carbon depends on the LCA (under way with Prof. Ming Hu, University of Notre Dame), on what steel and concrete SUPERWOOD displaces, and on end-of-life accounting. The next slide gives the numbers and their basis. Concept rendering.",
  { x: L, y: 6.65, w: CW, h: 0.45, fontFace: SANS, fontSize: 8.5, italic: true, color: DIM, margin: 0, valign: "top" });

