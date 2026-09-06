const beyond = [
  ["Data centers", "Skins, fences and screens now; structure with SuperMill Two. A hyperscaler basis of design is the proof point."],
  ["Interior and exterior products", "The same boards across commercial construction. $100B+ market."],
  ["Structural members", "Members proven in data centers move to offices, warehouses and industrial buildings. $400B+ market."],
  ["Optimized buildings", "Prefabricated envelopes and light foundations designed around the material. $700B+ market."],
];
beyond.forEach(([head, sub], i) => {
  const cw = 2.9, x = L + i * (cw + 0.2), y = 2.1;
  panel(s, x, y, cw, 2.6, PANEL);
  s.addText(`0${i + 1}`, { x: x + 0.25, y: y + 0.2, w: 1, h: 0.45, fontFace: SERIF, fontSize: 20, color: WOOD, margin: 0 });
  s.addText(head, { x: x + 0.25, y: y + 0.7, w: cw - 0.5, h: 0.5, fontFace: SANS, fontSize: 13, bold: true, color: CREAM, margin: 0, valign: "top" });
  body(s, sub, x + 0.25, y + 1.25, cw - 0.5, 1.2, 10, DIM);
});
s.addText("Behind all of it: steel is a $1.5 trillion a year market and concrete $1 trillion.", { x: L, y: 5.1, w: CW, h: 0.45, fontFace: SERIF, fontSize: 16, color: CREAM, margin: 0 });
note(s, "Market sizes are company estimates from the SUPERMILLS Investor Overview; steel and concrete figures are global annual market estimates (ready-mix concrete only).");
