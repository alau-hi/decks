# Press page: tier headers stand out

**Request:** Shaun (2026-08-16): section headers no longer stand out — the previous change made article titles (1.15rem) equal in size to `.tier-title` (1.15rem), collapsing the hierarchy. "Maybe just a larger font for the section title?"
**Decided:** 2026-08-16. Three CSS value changes in `press.html`:

- `.tier-title`: `font-size:1.15rem` → `1.5rem`.
- `.tier-num`: `font-size:1.5rem` → `1.8rem` (numeral keeps leading the title; accent color unchanged).
- `.tier`: `margin-top:40px` → `56px` (more air before each section).

Nothing else changes — title color stays cream, subtitles, entries, filters untouched.

## Acceptance

- Tier headers read a full step larger than article titles; extra whitespace precedes each section; all 48 entries and filters unaffected.
