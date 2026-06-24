# PDM — Investor Deck

Self-contained, on-brand investor decks for **PDM (People Driven Music)**, matching the
landing page (dark + golden embers, Fraunces headlines). No build step, no dependencies.

| File         | What it is                                  |
| ------------ | ------------------------------------------- |
| `en.html`    | English deck (~18 slides)                   |
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

- **Slide 18 — Team:** the solo founder (Ivan Izobov). Optional: swap the gradient avatar
  for a real photo, tweak the name/role wording.
- **Slide 19 — The ask:** currently **$150K pre-seed on a SAFE, $1.5M post-money cap,
  ~18-month runway**, use of funds 60 / 17 / 15 / 8 (Product / Artist acq / Growth /
  Ops). The cap is set intentionally low to leave room to negotiate up — adjust the
  amount/cap once terms with the lead investor firm up.

## Market slide — sources

The TAM/SAM/SOM figures (slide 12) are filled with the latest available data:

- **$29.6B** global recorded music revenue, **752M** paid subscribers, 2024 — IFPI Global
  Music Report 2025.
- **~$250B** creator economy, 2025 — industry estimates (market.us / Precedence / DataM).
- **8.2M** self-releasing artists earning just **$2.0B** combined, 2024 — MIDiA Research.
- **SOM $180M** is bottom-up: ≈50k independent artists × ~300 paying superfans × $12/yr,
  obtainable within 3 years (≈$36M net to PDM at the 20% take). Adjust as your plan firms up.

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
