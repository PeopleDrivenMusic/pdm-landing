# PDM — Investor Deck

Self-contained, on-brand investor decks for **PDM (People Driven Music)**, matching the
landing page (dark + golden embers, Fraunces headlines). No build step, no dependencies.

| File         | What it is                                  |
| ------------ | ------------------------------------------- |
| `en.html`    | English deck (13 slides)                    |
| `ru.html`    | Russian deck (same structure, translated)   |
| `deck.css`   | Shared brand theme + slide/print layout     |
| `deck.js`    | Keyboard navigation + golden ember backdrop |

## View it

Just double-click `en.html` or `ru.html` — opens in any browser. An internet connection
is used once to load the fonts (Fraunces / DM Sans / Sora from Google Fonts).

- **Navigate:** `←` `→` `↑` `↓`, `Space`, `PageUp/Down`, `Home`, `End`, or scroll.
- Bottom-right shows the slide number; a gold progress bar runs along the top.

## Export to PDF (to send to investors)

1. Open the deck in **Google Chrome** (best print fidelity).
2. `Ctrl/Cmd + P` → **Destination: Save as PDF**.
3. **Layout: Landscape.**
4. **More settings → Background graphics: ON** (this keeps the dark background & gold).
5. Save. Each slide becomes one page.

> The live ember animation, slide counter and progress bar are automatically hidden in
> print; the static golden glows remain so the PDF still looks on-brand.

## Before you send — review these

All slides are now filled (no `[FILL IN]` placeholders remain). A few things to review /
adjust to taste:

- **Slide 12 — Team:** the solo founder (Ivan Izobov). Optional: swap the gradient avatar
  for a real photo, tweak the name/role wording.
- **Slide 13 — The ask:** currently **$150K pre-seed on a SAFE, $1.5M post-money cap,
  ~18-month runway**, use of funds 60 / 17 / 15 / 8 (Product / Artist acq / Growth /
  Ops). The cap is set intentionally low to leave room to negotiate up — adjust the
  amount/cap once terms with the lead investor firm up.

## Market slide — sources

The TAM/SAM/SOM figures (slide 3) are each sourced separately — verify the actual
report content before reusing a number, not just the title:

- **TAM $250B** — creator economy, 2025. **Grand View Research** ($252.3B) and
  **Precedence Research** (~$254.4B) both state this as their headline 2025 figure.
  (market.us's own headline creator-economy number is $149.4B — its $250–300B mention
  is an unrelated YouTube-market-share comparison, not a TAM estimate. Don't cite it
  for this row.)
- **SAM $4.5B** — superfan monetization (direct payments to artists), **Goldman Sachs**
  "Music in the Air" 2024 report (20% of paying streaming subscribers assumed
  superfan-eligible for at least one artist).
- **SOM $45M** — ~1% of SAM. Bottom-up sanity check: ≈50k independent artists (≈0.6% of
  MIDiA's verified **8.2M** self-releasing-artist base) × ~100 paying superfans ×
  $12/yr. This is PDM's own planning assumption, not an external market figure — label
  it as such when presenting.
- **$39.5B** global recorded music revenue (+9.4%), **Expanded rights** +21.5% (fastest-
  growing segment, streaming grew slower than the total market for the first time),
  **8.2M** self-releasing artists earning **$2.0B** combined — all **MIDiA Research**
  2025/2024 reports (both linked in the deck).

## Editing copy

- Headlines/body live directly in the `<section class="slide">` blocks — edit the text
  in place. EN and RU are separate files; change both.
- Brand colors/fonts are CSS variables at the top of `deck.css` (mirrors
  `src/lib/styles/tokens.scss`). Change once, both decks update.

## Notes

- The deck is **static and standalone** — it is not wired into the SvelteKit app and has
  no effect on the website build.
- Source material: marketing voice from `src/lib/content.ts`, business vision from
  `PDM.md`, brand tokens from `src/lib/styles/tokens.scss`.
