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
s = pres.addSlide(); base(s, "InventWood · Next steps");
kicker(s, "Next steps");
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
