# PDM Landing Redesign — Design Spec

**Date:** 2026-06-15
**Concept:** "Spotlight" — cinematic editorial, music-first, premium dark.
**Goal:** A high-conversion marketing site that makes visitors _want_ to join the waitlist; must read as a "$10k" premium site.

---

## 1. Positioning & messaging

- **Big idea:** _Where fans don't just listen — they lead._ A direct fan↔artist economy: subscribe to an artist for **$1/mo**, 80% goes straight to them. Fans get closer (exclusives, community, comment, offline, no ads); artists get direct income + a loyal fanbase.
- **Music-first, emotional.** Lead with feeling and the music, not mechanics.
- **No crypto / no Web3 / no tokens.** Phase 1 is pure Web2, focused on user acquisition. Remove all token/Web3/"listen-to-earn" language and SEO that exists in the current site.
- **Dual audience via a Fan/Artist toggle** that re-frames the narrative (headline, benefits) without separate pages.
- **Primary conversion:** waitlist signup (email + fan/artist role). Existing `POST /api/whitelist` is reused.

**Non-goals:** investment/crowdfunding/royalty-share UI (phase 2 — only a light "Vision" tease), pricing tables, full product app, auth.

---

## 2. Visual system

### Color tokens (dark, near-black + warm gold)

```
--bg            #0A0A0B   /* page base, near-black */
--bg-elev       #15151A   /* elevated surfaces, cards */
--bg-elev-2     #1E1E25   /* hover / nested */
--gold          #FFD877   /* primary accent (brand) */
--gold-deep     #E0B23A   /* gradient pair / pressed */
--text          #F4ECE0   /* warm off-white, primary text */
--text-muted    rgba(244,236,224,0.62)
--line          rgba(244,236,224,0.10)  /* borders/dividers */
--glow          rgba(255,216,119,0.30)  /* spotlight / soundwave glow */
```

Contrast: body text `--text` on `--bg` ≈ 15:1; muted text meets ≥4.5:1. Gold is used for accents/large type only, not small body text on dark (it would be ~9:1 — fine, but keep body in `--text`).

### Typography

- **Headlines:** Playfair Display (italic 500/600) — emotional, editorial.
- **Body / UI:** DM Sans (400/500/700). (Satoshi via Fontshare is an optional upgrade; DM Sans is the Google-hosted default.)
- Self-host or `@fontsource` for performance; `font-display: swap`; preload the two critical weights.
- **Type scale (clamp, responsive):** display 3–6rem, h2 2–3.5rem, h3 1.5–2rem, body 1–1.25rem, small 0.85rem. Line-height 1.5–1.7 body, 1.05–1.15 headlines. Body measure 60–75ch.

### Motion system

- **Tokens:** micro 180ms, base 280ms, slow 600ms; ease-out on enter, ease-in on exit; spring for interactive press/toggle.
- **Principles (from ui-ux-pro-max):** animate 1–2 key elements per view; transform/opacity only; stagger lists 30–50ms; exit faster than enter; every animation conveys meaning.
- **Signature effects:** spotlight/lamp glow behind hero headline; subtle aurora gradient in dark bg; word-by-word kinetic headline reveal; canvas soundwave visualizer (mouse-reactive); 3D tilt on bento cards; marquee; scroll-linked parallax/reveal; Lenis inertia smooth-scroll.
- **`prefers-reduced-motion`:** MANDATORY fallback — disable parallax/scroll-jacking/soundwave animation, replace with instant/opacity-only reveals; Lenis disabled; content fully readable immediately.

---

## 3. Section-by-section spec

Flow: **hook → tension → solution → benefits (toggle) → product → how → vision tease → proof → waitlist.**

1. **Nav (sticky):** PDM wordmark · anchor links (How it works / Product / Vision) · Fan/Artist toggle · "Join waitlist" button. Transparent over hero → backdrop-blur + bg on scroll. Mobile: hamburger → sheet; toggle + CTA remain reachable.
2. **Hero (100dvh):** cinematic photo bg (dark grade) with gentle parallax/Ken-Burns; spotlight glow; kinetic Playfair headline ("Where fans don't just listen — they lead."); DM Sans subhead; primary CTA "Join the waitlist" + secondary "See how"; canvas soundwave anchored bottom; scroll cue. Fan/Artist toggle swaps headline + subhead + subtle accent.
3. **Problem:** scroll-storytelling tension. Big animated stat ("$0.003 / stream") counting up; lines reveal in sequence; editorial pull-quote feel. "Fans became play-counts. Artists became content."
4. **The Shift (aha):** "$1. Straight to the artist." Animated value-flow visual (YOU → $1 → ARTIST, 80% number grows). The conceptual centerpiece.
5. **Two Sides (toggle):** "What you unlock." Fan/Artist toggle morphs the benefit card set with staggered reveal. Fan: exclusive posts/demos, community chat, comment & connect, offline + no ads, be early. Artist: direct income, your community, your feed/store, loyal superfans, grow.
6. **Product (bento):** "It's a real product." Bento grid of UI mockups — player, artist page, exclusives feed, community chat — with 3D tilt + light parallax. Mockups are built in-markup (no real app yet).
7. **How it works:** 3 steps with connecting progress line — Discover & listen free → Subscribe $1 → Unlock & grow together. Stepped scroll reveal.
8. **Vision (tease, slim):** "And this is just the first verse." One emotional line hinting fans growing _with_ artists in the future — **no crypto specifics**. Calm full-width breather.
9. **Proof:** momentum/scarcity. **No invented numbers and no new backend.** Default to qualitative "founding members / early access" framing + optional founder/artist quote + genre marquee. A live waitlist counter is only added if the user later supplies a count source; not built speculatively.
10. **Waitlist CTA:** "Be there from the first note." Email + Fan/Artist role + Join button (reuses `/api/whitelist`). Gold glow + soundwave; reuse existing canvas-confetti on success; localStorage "already joined" state (existing behavior).
11. **Footer:** wordmark, tagline, social links, contact, legal.

---

## 4. Tech approach & dependencies

- **Stack:** existing SvelteKit + Svelte 5 (runes) + SCSS + Vercel adapter. No framework change.
- **New dependencies (user approved installing):**
  - `lenis` — inertial smooth scroll (framework-agnostic; gated behind reduced-motion).
  - `gsap` (+ ScrollTrigger) — scroll-linked reveals/parallax choreography; flagged 10/10 for parallax storytelling. (Alternative considered: Motion One — lighter, but GSAP ScrollTrigger gives stronger scroll control for the "$10k" feel.)
  - Soundwave: **canvas 2D** (no library). Three.js intentionally **out of scope** — Spotlight is photo+type+wave, not 3D; avoids weight/perf cost.
  - Fonts via `@fontsource/playfair-display` + `@fontsource/dm-sans` (self-hosted, no FOUT/3rd-party).
- **Architecture (Svelte components under `src/routes/` or new `src/lib/`):** `Nav.svelte`, `Hero.svelte`, `Soundwave.svelte`, `Problem.svelte`, `Shift.svelte`, `TwoSides.svelte`, `Product.svelte`, `HowItWorks.svelte`, `Vision.svelte`, `Proof.svelte`, `Waitlist.svelte`, `Footer.svelte`. Shared: a `audience` store (fan/artist) in `src/lib/`, a `reveal` action (IntersectionObserver/GSAP wrapper) replacing/extending the current `Animate.svelte` + `scroll.ts`, and design tokens in a global SCSS partial.
- **Reuse:** `Button.svelte`, existing icons where they fit, `canvas-confetti`, `/api/whitelist`, localStorage join state. **Rewrite from scratch:** all copy, `Intro/Problems/CoreFeatures/How/Join`, `SEO.svelte` (drop Web3/token keywords), `app.css` tokens.
- **Each section is an isolated component** with its own data + styles; page composes them. Keeps files focused and independently reasoned about.

---

## 5. Assets needed

- **Cinematic photography (hero + CTA bg):** intimate/dramatic music shots (artist on stage, studio, fan close-up). Placeholder: Unsplash during build; **user to provide licensed/branded shots** before production. Target WebP/AVIF, responsive `srcset`, declared dimensions (CLS < 0.1).
- **Product mockups:** built in HTML/CSS (no real app). If real product screens exist later, swap in.
- **No 3D assets / no external illustration** required for Spotlight.
- Existing `concert-bg.webp` / `crowd.webp` may be reused or replaced.

---

## 6. Accessibility & performance guardrails

- `prefers-reduced-motion` fallback for every animation; Lenis + GSAP scroll effects disabled under it.
- Color contrast ≥4.5:1 body, focus-visible rings on all interactive elements, keyboard-operable toggle (radio semantics), labels on form inputs, alt text on imagery, `color-not-only` for any status.
- Touch targets ≥44px; `cursor-pointer` on interactives; no horizontal scroll; `min-h-dvh` not `100vh`.
- Performance: lazy-load below-fold images, reserve space for async content, image dimensions declared, fonts preloaded/`swap`, animate transform/opacity only, throttle scroll/pointer handlers, `will-change` used sparingly. Mobile gets a lighter motion profile (no heavy parallax).
- Responsive verified at 375 / 768 / 1024 / 1440.

---

## 7. Out of scope

Investment/crowdfunding/royalty UI, pricing, auth, real product app, multi-page routing, i18n, CMS. (Vision section only _teases_ phase 2.)
