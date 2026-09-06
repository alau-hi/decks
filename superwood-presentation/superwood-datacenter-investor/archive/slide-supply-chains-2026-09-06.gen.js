// ---------- 5 · SUPPLY CHAINS ----------
s = pres.addSlide(); base(s, "InventWood · The buyer");
kicker(s, "The buyer · Industry challenged by supply chains");
title(s, "Data centers are waiting on steel, power equipment and crews.", L, 0.88, 12.2, 25);
const sc1 = [
  ["Structural steel", "Customers report backlogs and a shortage of structural steel; supply chain and timeline are their first concern. Section 232 tariffs on steel doubled to 50% in 2025 and since April 2026 apply to a product's full value."],
  ["Power equipment", "Power transformers average 128 weeks to deliver and substation transformers more than 160; switchgear about 44 weeks, with medium-voltage gear over a year."],
  ["Crews", "Construction needs up to 349,000 additional workers in 2026; backlogs on some data center build-outs have reached eight and a half months."],
];
const sc2 = [
  ["Steel-intensive", "500–1,000 tons of structural steel and 5,000–10,000 m³ of concrete per 10 MW."],
  ["Highly repeatable", "Hyperscalers build to a standard basis of design, one data center after another."],
  ["Where SUPERWOOD fits", "A second source for structural members, skins and screens: made from wood in Frederick, Maryland, prefabricated, one-sixth the weight of steel, so smaller cranes and crews."],
];
[[sc1, 2.0, PANEL2, 1.55], [sc2, 3.8, PANEL, 1.3]].forEach(([arr, y, col, hh]) => arr.forEach(([head, sub], i) => {
  const cw = 3.95, x = L + i * 4.125;
  panel(s, x, y, cw, hh, col);
  s.addText(head, { x: x + 0.25, y: y + 0.15, w: cw - 0.5, h: 0.3, fontFace: SANS, fontSize: 13, bold: true, color: CREAM, margin: 0 });
  body(s, sub, x + 0.25, y + 0.5, cw - 0.5, hh - 0.6, 10, DIM);
}));
s.addText([t("Every week of lead time is a week of unearned power. ", { color: CREAM }), t("A material that is not steel, not imported and not heavy is a schedule argument.", { color: GOLD, italic: true })], { x: L, y: 5.45, w: CW, h: 0.6, fontFace: SERIF, fontSize: 16, margin: 0, valign: "middle" });
note(s, "Structural steel shortage: what customers report to InventWood. Tariffs: Congressional Research Service IN12519; Construction Dive on the full-value rule, 2026. Lead times: Wood Mackenzie 2026 survey as reported by POWER and Data Center Knowledge. Labor: Associated Builders and Contractors, 2026 outlook, as reported by Data Center Dynamics. Weight and prefabrication: company data.", 6.62, 0.45);

