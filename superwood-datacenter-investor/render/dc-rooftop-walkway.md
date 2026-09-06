# Rooftop service walkway — SUPERWOOD deck and railings

- Date: 2026-09-06
- Target model: Nano Banana Pro (via Higgsfield), 1:1; second pass image-to-image on the first
- Purpose: Soon-slide tile "Walkways & platforms" (`tile_walkway.jpg`, also `prep/tiles/`). Replaces the office-wing decking (see dc-office-decking.md). Alex: "this image one is good except the railing should be superwood".
- Status: installed. First pass job `9f9bd9c7-15d7-4e93-9267-b741649bad6a` (steel railings); second `232a1d62-70db-4e66-8506-0cedf7e17186` (wood railings); third `abd6272b-e100-4ddf-8586-6134489a4bdb` (round wood handrails); fourth `2e037780-73fb-4422-a45f-11c7965838b9` (darker railings, still not thin); fifth `dfabcd14-2530-4db2-96e3-218bd7a3adf6` (light lower rails, dark handrail, still not thin). Image-to-image passes would not thin the rails and were degrading the image, so the final is a fresh text-only render: `445e76b1-0159-42ff-b7a5-6ddf38942de1` — 1.5 cm light rails, 3 cm posts, dark 4 cm handrail (Alex 2026-09-06). Sibling variant `31dd03a1-68b0-43de-810f-9957a691870c` and the 2 cm pair `c51c4d1a-789b-4abc-ad7e-22d2f072c696` / `1c07d35c-0a99-49b3-a0b5-61fbd86a0eec` not used.

## Prompt (first pass)

Architectural photograph at golden hour of an elevated service walkway on the roof of a data center, running in a long straight line between two rows of large grey rooftop cooling units. The walkway deck and its slim railings are built from slender boards of warm medium-brown densified wood (oiled-teak tone, straight fine grain, crisp machined edges, tight uniform gaps, no knots) on a light steel frame, thin and elegant, not chunky timber. Low sun rakes across the deck boards and casts long shadows of the railing; the sky is soft. Strong one-point perspective down the walkway, a single technician in a hi-vis vest far in the distance. Engineered and industrial-grade, precise, contemporary. No text, no signage, no logos.

## Prompt (second pass, reference = first pass)

Keep this exact scene, camera, light and composition. Change only the railings: replace the grey steel railings on both sides with railings made of the same warm medium-brown densified wood as the deck, slender wood posts, a slim wood top rail and thin horizontal wood rails, crisp machined edges, straight fine grain, no knots, matching the deck boards. Everything else unchanged: rooftop cooling units, deck, sky, distant technician. No text, no logos.

## Prompt (third pass, reference = second pass)

Keep this exact scene, camera, light and composition. Change only the railing profiles: make the wood handrails and the horizontal wood rails round in section, smooth turned cylinders of the same warm medium-brown densified wood, soft organic feel, with slender round wood posts; keep the same rail heights and spacing. Everything else unchanged: deck boards, rooftop cooling units, sky, distant technician. No text, no logos.

## Prompt (fourth pass, reference = third pass)

Keep this exact scene, camera, light and composition. Change only the railings: make the round wood handrails, horizontal rails and posts much thinner, slender like 3 cm rods, and a noticeably darker wood tone, deep espresso walnut brown, so they contrast with the lighter deck boards; keep the same rail heights and spacing. Everything else unchanged: the warm medium-brown deck boards, rooftop cooling units, sky, distant technician. No text, no logos.

## Prompt (final, fresh text-only render)

Architectural photograph at golden hour of an elevated service walkway on the roof of a data center, running in a long straight line between two rows of large grey rooftop cooling units, strong one-point perspective, a single technician in a hi-vis vest far in the distance, soft pink-gold sky. The deck is slender boards of warm medium-brown densified wood with straight fine grain and crisp edges. The guardrails are as minimal as a strong material allows: the horizontal rails are 1.5 cm round rods, thin as a finger, in the same light warm wood as the deck, three of them widely spaced so the railing almost disappears against the view; slender round posts of about 3 cm; only the top handrail is a heavier round rail of about 4 cm in dark espresso-brown wood, a single dark line running to the horizon. Low sun rakes across the deck and casts long hairline shadows of the rods. Precise, contemporary, engineered, no chunky timber anywhere. No text, no signage, no logos.
