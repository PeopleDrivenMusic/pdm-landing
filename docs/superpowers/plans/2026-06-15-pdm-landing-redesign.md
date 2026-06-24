# PDM Landing Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the PDM landing page as a premium, cinematic "Spotlight" marketing site (music-first, no crypto, fan/artist toggle) that drives waitlist signups.

**Architecture:** SvelteKit + Svelte 5 runes. A single route (`src/routes/+page.svelte`) composes isolated section components from `src/lib/components/landing/`. Shared design tokens (SCSS), a runes-based `audience` store, a reduced-motion-aware `reveal` action, and a Lenis+GSAP scroll module live in `src/lib/`. Logic units (audience store, waitlist submit, motion-preference helper) are pure and unit-tested with Vitest; visual components are verified via `svelte-check`, `build`, and the dev server.

**Tech Stack:** SvelteKit 2, Svelte 5, SCSS (sass-embedded), `lenis@1.3.23` (smooth scroll), `gsap@3.15.0` + ScrollTrigger (scroll choreography), canvas 2D (soundwave), `@fontsource/playfair-display@5.2.8` + `@fontsource/dm-sans@5.2.8`, `canvas-confetti` (existing), Vitest 4 (logic tests). Spec: `docs/superpowers/specs/2026-06-15-pdm-landing-redesign-design.md`.

---

## File Structure

**Create:**

- `src/lib/styles/tokens.scss` — CSS custom properties (color, type scale, motion, z-index, spacing).
- `src/lib/styles/global.scss` — resets, base element styles, scrollbar, fonts wiring.
- `src/routes/+layout.svelte` — imports fonts + global styles, mounts smooth-scroll, sets `<html lang>`.
- `src/lib/motion/prefersReducedMotion.ts` — pure helper + reactive store for motion preference.
- `src/lib/motion/smoothScroll.ts` — Lenis + GSAP ScrollTrigger init/destroy (reduced-motion aware).
- `src/lib/actions/reveal.ts` — Svelte action: scroll-reveal via IntersectionObserver (opacity/transform, RM-aware).
- `src/lib/stores/audience.svelte.ts` — runes `$state` store for `'fan' | 'artist'`.
- `src/lib/waitlist.ts` — pure `submitWaitlist()` + `loadStoredJoin()` helpers (testable).
- `src/lib/components/Soundwave.svelte` — canvas frequency-bar visualizer (pointer-reactive, RM-aware).
- `src/lib/components/AudienceToggle.svelte` — fan/artist segmented control (radio semantics).
- `src/lib/components/KineticHeading.svelte` — word-by-word staggered reveal heading.
- `src/lib/components/StatCounter.svelte` — count-up number on reveal (RM-aware).
- `src/lib/components/Marquee.svelte` — infinite horizontal marquee (RM-aware).
- `src/lib/components/TiltCard.svelte` — 3D pointer-tilt wrapper (RM/touch-aware).
- `src/lib/components/landing/Nav.svelte`
- `src/lib/components/landing/Hero.svelte`
- `src/lib/components/landing/Problem.svelte`
- `src/lib/components/landing/Shift.svelte`
- `src/lib/components/landing/TwoSides.svelte`
- `src/lib/components/landing/Product.svelte`
- `src/lib/components/landing/HowItWorks.svelte`
- `src/lib/components/landing/Vision.svelte`
- `src/lib/components/landing/Proof.svelte`
- `src/lib/components/landing/Waitlist.svelte`
- `src/lib/components/landing/Footer.svelte`
- `src/lib/content.ts` — all copy + benefit/step/stat data (single source of truth).
- Test files: `src/lib/stores/audience.test.ts`, `src/lib/waitlist.test.ts`, `src/lib/motion/prefersReducedMotion.test.ts`.
- `vitest.config.ts`, `src/lib/test-setup.ts`.

**Modify:**

- `package.json` — add deps + `test` script.
- `src/routes/+page.svelte` — compose new sections.
- `src/routes/SEO.svelte` — rewrite metadata (drop all Web3/token/"listen-to-earn" language).
- `src/routes/Button.svelte` — reuse; restyle to tokens if needed.

**Delete (after replacement):**

- `src/routes/Intro.svelte`, `Problems.svelte`, `CoreFeatures.svelte`, `How.svelte`, `Join.svelte`, `Animate.svelte`, `src/lib/scroll.ts` (superseded by `reveal.ts`).

**Keep:** `src/routes/api/whitelist/+server.js`, `canvas-confetti`, icon components that fit, `static/*.webp` (may reuse).

---

## Phase 0 — Foundation

### Task 1: Install dependencies & test harness

**Files:** Modify `package.json`; create `vitest.config.ts`, `src/lib/test-setup.ts`.

- [ ] **Step 1: Install runtime + dev deps**

Run:

```bash
npm install lenis@1.3.23 gsap@3.15.0 @fontsource/playfair-display@5.2.8 @fontsource/dm-sans@5.2.8
npm install -D vitest@4.1.9 jsdom @testing-library/svelte
```

Expected: installs succeed, `package.json` updated.

- [ ] **Step 2: Add test script**

In `package.json` `"scripts"`, add:

```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 3: Create `vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
	plugins: [svelte({ hot: false })],
	test: {
		environment: 'jsdom',
		globals: true,
		setupFiles: ['src/lib/test-setup.ts'],
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
```

- [ ] **Step 4: Create `src/lib/test-setup.ts`**

```ts
// Provide a default matchMedia in jsdom (overridden per-test as needed).
if (!window.matchMedia) {
	window.matchMedia = (query: string) =>
		({
			matches: false,
			media: query,
			onchange: null,
			addEventListener: () => {},
			removeEventListener: () => {},
			addListener: () => {},
			removeListener: () => {},
			dispatchEvent: () => false
		}) as unknown as MediaQueryList;
}
```

- [ ] **Step 5: Verify harness runs**

Run: `npm test`
Expected: Vitest runs, reports "No test files found" (exit 0) — harness works.

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json vitest.config.ts src/lib/test-setup.ts
git commit -m "chore: add motion/font deps and vitest harness"
```

---

### Task 2: Design tokens & global styles

**Files:** Create `src/lib/styles/tokens.scss`, `src/lib/styles/global.scss`.

- [ ] **Step 1: Create `src/lib/styles/tokens.scss`**

```scss
:root {
	/* color */
	--bg: #0a0a0b;
	--bg-elev: #15151a;
	--bg-elev-2: #1e1e25;
	--gold: #ffd877;
	--gold-deep: #e0b23a;
	--text: #f4ece0;
	--text-muted: rgba(244, 236, 224, 0.62);
	--line: rgba(244, 236, 224, 0.1);
	--glow: rgba(255, 216, 119, 0.3);

	/* type */
	--font-display: 'Playfair Display', Georgia, serif;
	--font-sans: 'DM Sans', system-ui, sans-serif;

	/* motion */
	--dur-micro: 180ms;
	--dur-base: 280ms;
	--dur-slow: 600ms;
	--ease-out: cubic-bezier(0.22, 1, 0.36, 1);
	--ease-in: cubic-bezier(0.55, 0, 0.55, 0.2);

	/* layout */
	--maxw: 1200px;
	--z-base: 0;
	--z-content: 10;
	--z-nav: 40;
	--z-overlay: 100;
}
```

- [ ] **Step 2: Create `src/lib/styles/global.scss`**

```scss
@import './tokens.scss';

* {
	box-sizing: border-box;
}

html {
	background: var(--bg);
	color: var(--text);
	scroll-behavior: smooth;
	-webkit-text-size-adjust: 100%;
}
body {
	margin: 0;
	font-family: var(--font-sans);
	font-size: 16px;
	line-height: 1.6;
	overflow-x: hidden;
	min-height: 100dvh;
}
h1,
h2,
h3 {
	font-family: var(--font-display);
	line-height: 1.1;
	margin: 0;
}
p {
	margin: 0;
}
a {
	color: inherit;
	text-decoration: none;
}
img {
	max-width: 100%;
	display: block;
}

:focus-visible {
	outline: 2px solid var(--gold);
	outline-offset: 3px;
	border-radius: 2px;
}

::selection {
	background: var(--gold);
	color: #1a1a1a;
}

/* When the user prefers reduced motion, neutralize smooth scroll. */
@media (prefers-reduced-motion: reduce) {
	html {
		scroll-behavior: auto;
	}
}

/* Custom scrollbar */
* {
	scrollbar-width: thin;
	scrollbar-color: var(--gold) var(--bg);
}
*::-webkit-scrollbar {
	width: 8px;
}
*::-webkit-scrollbar-track {
	background: var(--bg);
}
*::-webkit-scrollbar-thumb {
	background: var(--gold);
	border-radius: 4px;
}
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/styles
git commit -m "feat: add design tokens and global styles"
```

---

### Task 3: Layout — fonts, global CSS, smooth scroll mount

**Files:** Create `src/routes/+layout.svelte`. (Depends on Task 5 `smoothScroll.ts`; if executing in order, stub the import then wire after Task 5 — or reorder Task 5 before this. Recommended: do Task 4 & 5 before wiring Step 2 here.)

- [ ] **Step 1: Create `src/routes/+layout.svelte` (styles + fonts)**

```svelte
<script lang="ts">
	import '@fontsource/playfair-display/latin-500-italic.css';
	import '@fontsource/playfair-display/latin-600.css';
	import '@fontsource/dm-sans/latin-400.css';
	import '@fontsource/dm-sans/latin-500.css';
	import '@fontsource/dm-sans/latin-700.css';
	import '$lib/styles/global.scss';
	import { onMount } from 'svelte';
	import { initSmoothScroll } from '$lib/motion/smoothScroll';

	let { children } = $props();

	onMount(() => initSmoothScroll());
</script>

{@render children()}
```

- [ ] **Step 2: Verify dev server renders**

Run: `npm run dev` then open the printed URL.
Expected: page loads on dark background, fonts applied, no console errors. (Page content still old until Phase 3.)

- [ ] **Step 3: Commit**

```bash
git add src/routes/+layout.svelte
git commit -m "feat: add root layout with fonts and global styles"
```

---

### Task 4: Reduced-motion helper (TDD)

**Files:** Create `src/lib/motion/prefersReducedMotion.ts`, `src/lib/motion/prefersReducedMotion.test.ts`.

- [ ] **Step 1: Write failing test**

```ts
// src/lib/motion/prefersReducedMotion.test.ts
import { describe, it, expect, vi } from 'vitest';
import { prefersReducedMotion } from './prefersReducedMotion';

function mockMatch(matches: boolean) {
	window.matchMedia = vi.fn().mockReturnValue({
		matches,
		addEventListener: () => {},
		removeEventListener: () => {}
	}) as unknown as typeof window.matchMedia;
}

describe('prefersReducedMotion', () => {
	it('returns true when the media query matches', () => {
		mockMatch(true);
		expect(prefersReducedMotion()).toBe(true);
	});
	it('returns false when it does not match', () => {
		mockMatch(false);
		expect(prefersReducedMotion()).toBe(false);
	});
});
```

- [ ] **Step 2: Run test, verify it fails**

Run: `npx vitest run src/lib/motion/prefersReducedMotion.test.ts`
Expected: FAIL — module/function not found.

- [ ] **Step 3: Implement**

```ts
// src/lib/motion/prefersReducedMotion.ts
export function prefersReducedMotion(): boolean {
	if (typeof window === 'undefined' || !window.matchMedia) return false;
	return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
```

- [ ] **Step 4: Run test, verify pass**

Run: `npx vitest run src/lib/motion/prefersReducedMotion.test.ts`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/motion/prefersReducedMotion.ts src/lib/motion/prefersReducedMotion.test.ts
git commit -m "feat: add prefers-reduced-motion helper with tests"
```

---

### Task 5: Smooth-scroll module (Lenis + GSAP)

**Files:** Create `src/lib/motion/smoothScroll.ts`.

- [ ] **Step 1: Implement**

```ts
// src/lib/motion/smoothScroll.ts
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from './prefersReducedMotion';

let lenis: Lenis | null = null;

/** Initialise inertial smooth scroll + GSAP ScrollTrigger sync.
 *  No-op (and returns a no-op cleanup) when reduced motion is requested. */
export function initSmoothScroll(): () => void {
	if (typeof window === 'undefined') return () => {};
	gsap.registerPlugin(ScrollTrigger);

	if (prefersReducedMotion()) {
		return () => {};
	}

	lenis = new Lenis({ duration: 1.1, smoothWheel: true });
	lenis.on('scroll', ScrollTrigger.update);

	const raf = (time: number) => {
		lenis?.raf(time * 1000);
	};
	gsap.ticker.add(raf);
	gsap.ticker.lagSmoothing(0);

	return () => {
		gsap.ticker.remove(raf);
		lenis?.destroy();
		lenis = null;
	};
}

export function getLenis(): Lenis | null {
	return lenis;
}
```

- [ ] **Step 2: Verify build typechecks**

Run: `npm run check`
Expected: no errors referencing `smoothScroll.ts` (warnings about other legacy files are OK at this stage).

- [ ] **Step 3: Commit**

```bash
git add src/lib/motion/smoothScroll.ts
git commit -m "feat: add Lenis + GSAP smooth-scroll module"
```

---

### Task 6: Reveal action

**Files:** Create `src/lib/actions/reveal.ts`.

- [ ] **Step 1: Implement**

```ts
// src/lib/actions/reveal.ts
import type { Action } from 'svelte/action';
import { prefersReducedMotion } from '$lib/motion/prefersReducedMotion';

interface RevealOptions {
	delay?: number; // ms
	y?: number; // px translateY start offset
	once?: boolean;
}

/** Fades + slides an element into view on scroll. Respects reduced motion
 *  (shows immediately, no transform). Uses transform/opacity only. */
export const reveal: Action<HTMLElement, RevealOptions | undefined> = (node, options) => {
	const { delay = 0, y = 24, once = true } = options ?? {};

	if (prefersReducedMotion()) {
		node.style.opacity = '1';
		return {};
	}

	node.style.opacity = '0';
	node.style.transform = `translateY(${y}px)`;
	node.style.transition = `opacity var(--dur-slow) var(--ease-out) ${delay}ms, transform var(--dur-slow) var(--ease-out) ${delay}ms`;
	node.style.willChange = 'opacity, transform';

	const show = () => {
		node.style.opacity = '1';
		node.style.transform = 'translateY(0)';
	};
	const hide = () => {
		node.style.opacity = '0';
		node.style.transform = `translateY(${y}px)`;
	};

	const io = new IntersectionObserver(
		(entries) => {
			for (const e of entries) {
				if (e.isIntersecting) {
					show();
					if (once) io.unobserve(node);
				} else if (!once) {
					hide();
				}
			}
		},
		{ threshold: 0.15, rootMargin: '0px 0px -10% 0px' }
	);
	io.observe(node);

	return { destroy: () => io.disconnect() };
};
```

- [ ] **Step 2: Verify typecheck**

Run: `npm run check`
Expected: no errors in `reveal.ts`.

- [ ] **Step 3: Commit**

```bash
git add src/lib/actions/reveal.ts
git commit -m "feat: add scroll reveal action (reduced-motion aware)"
```

---

### Task 7: Audience store (TDD)

**Files:** Create `src/lib/stores/audience.svelte.ts`, `src/lib/stores/audience.test.ts`.

- [ ] **Step 1: Write failing test**

```ts
// src/lib/stores/audience.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { audience } from './audience.svelte';

describe('audience store', () => {
	beforeEach(() => audience.set('fan'));

	it('defaults to fan', () => {
		expect(audience.value).toBe('fan');
	});
	it('set switches role', () => {
		audience.set('artist');
		expect(audience.value).toBe('artist');
	});
	it('toggle flips between fan and artist', () => {
		audience.toggle();
		expect(audience.value).toBe('artist');
		audience.toggle();
		expect(audience.value).toBe('fan');
	});
});
```

- [ ] **Step 2: Run test, verify fail**

Run: `npx vitest run src/lib/stores/audience.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement**

```ts
// src/lib/stores/audience.svelte.ts
export type Audience = 'fan' | 'artist';

let current = $state<Audience>('fan');

export const audience = {
	get value(): Audience {
		return current;
	},
	set(next: Audience) {
		current = next;
	},
	toggle() {
		current = current === 'fan' ? 'artist' : 'fan';
	}
};
```

- [ ] **Step 4: Run test, verify pass**

Run: `npx vitest run src/lib/stores/audience.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/stores/audience.svelte.ts src/lib/stores/audience.test.ts
git commit -m "feat: add audience (fan/artist) runes store with tests"
```

---

### Task 8: Waitlist helpers (TDD)

**Files:** Create `src/lib/waitlist.ts`, `src/lib/waitlist.test.ts`.

- [ ] **Step 1: Write failing test**

```ts
// src/lib/waitlist.test.ts
import { describe, it, expect, vi } from 'vitest';
import { submitWaitlist } from './waitlist';

describe('submitWaitlist', () => {
	it('rejects empty email', async () => {
		const res = await submitWaitlist({ email: '', role: 'fan' }, vi.fn());
		expect(res.ok).toBe(false);
		expect(res.error).toBe('email-required');
	});

	it('posts to /api/whitelist and returns ok on 200', async () => {
		const fetchMock = vi.fn().mockResolvedValue({ ok: true });
		const res = await submitWaitlist({ email: 'a@b.com', role: 'artist' }, fetchMock);
		expect(fetchMock).toHaveBeenCalledWith(
			'/api/whitelist',
			expect.objectContaining({ method: 'POST' })
		);
		expect(res.ok).toBe(true);
	});

	it('returns error on non-ok response', async () => {
		const fetchMock = vi.fn().mockResolvedValue({ ok: false });
		const res = await submitWaitlist({ email: 'a@b.com', role: 'fan' }, fetchMock);
		expect(res.ok).toBe(false);
		expect(res.error).toBe('request-failed');
	});
});
```

- [ ] **Step 2: Run test, verify fail**

Run: `npx vitest run src/lib/waitlist.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement**

```ts
// src/lib/waitlist.ts
import type { Audience } from './stores/audience.svelte';

export interface JoinInput {
	email: string;
	role: Audience;
}
export interface JoinResult {
	ok: boolean;
	error?: 'email-required' | 'request-failed' | 'network-error';
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function submitWaitlist(
	input: JoinInput,
	fetchFn: typeof fetch = fetch
): Promise<JoinResult> {
	if (!input.email || !EMAIL_RE.test(input.email)) {
		return { ok: false, error: 'email-required' };
	}
	try {
		const res = await fetchFn('/api/whitelist', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(input)
		});
		if (!res.ok) return { ok: false, error: 'request-failed' };
		return { ok: true };
	} catch {
		return { ok: false, error: 'network-error' };
	}
}

const STORAGE_KEY = 'pdm-join';

export function persistJoin(input: JoinInput): void {
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(input));
	} catch {
		/* ignore */
	}
}

export function loadStoredJoin(): JoinInput | null {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		return raw ? (JSON.parse(raw) as JoinInput) : null;
	} catch {
		return null;
	}
}
```

- [ ] **Step 4: Run test, verify pass**

Run: `npx vitest run src/lib/waitlist.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/waitlist.ts src/lib/waitlist.test.ts
git commit -m "feat: add waitlist submit/persist helpers with tests"
```

---

### Task 9: Content source of truth

**Files:** Create `src/lib/content.ts`.

- [ ] **Step 1: Implement** (final-ish copy; edit text freely later)

```ts
// src/lib/content.ts
import type { Audience } from './stores/audience.svelte';

export const hero: Record<Audience, { kicker: string; heading: string[]; sub: string }> = {
	fan: {
		kicker: 'People Driven Music',
		heading: ['Where fans', "don't just listen —", 'they lead.'],
		sub: 'Back the artists you love for $1 a month. Get closer than ever — and put your money where the music is.'
	},
	artist: {
		kicker: 'People Driven Music',
		heading: ['Your music.', 'Your fans.', 'Your income.'],
		sub: 'Earn directly from the people who love your work. No labels skimming, no algorithm tax — just you and your fans.'
	}
};

export const problemStats = [
	{ value: 0.003, prefix: '$', decimals: 3, label: 'paid to artists per stream' },
	{ value: 100, suffix: '%', decimals: 0, label: 'of fans reduced to a play-count' }
];

export const shift = {
	heading: 'One dollar. Straight to the artist.',
	body: '$1/month per artist — 80% goes directly to them. No middlemen, no noise. Just real support for the music you believe in.',
	artistShare: 80
};

export const benefits: Record<Audience, { title: string; desc: string }[]> = {
	fan: [
		{
			title: 'Exclusive drops',
			desc: 'Private posts, demos and behind-the-scenes from the artists you back.'
		},
		{
			title: 'Community chat',
			desc: 'A real room with the artist and fellow fans — paid-only, no spam.'
		},
		{
			title: 'Comment & connect',
			desc: 'Your voice on every track and post. Be heard, not counted.'
		},
		{ title: 'Offline & ad-free', desc: 'Cache your artist and listen with zero ads.' },
		{ title: 'Be early', desc: 'First access to tickets, merch and releases.' }
	],
	artist: [
		{ title: 'Direct income', desc: 'Subscriptions land in your pocket — paid out fast.' },
		{ title: 'Your community', desc: 'A private space to talk to the fans who fund you.' },
		{ title: 'Your feed & store', desc: 'Post exclusives, sell merch and tickets, your way.' },
		{
			title: 'Loyal superfans',
			desc: 'Reward the people who show up — and turn listeners into backers.'
		},
		{ title: 'Real growth', desc: 'Reach new fans and build a base that actually pays.' }
	]
};

export const steps = [
	{ n: 1, title: 'Discover & listen', desc: 'Stream freely and find artists you love.' },
	{ n: 2, title: 'Subscribe for $1', desc: 'Back an artist — 80% goes straight to them.' },
	{ n: 3, title: 'Unlock & grow', desc: 'Get exclusives, join the community, grow together.' }
];

export const vision = {
	heading: 'And this is just the first verse.',
	body: 'Today you back the music. Tomorrow you grow with it — as the artists you championed rise.'
};

export const genres = [
	'Hip-Hop',
	'Indie',
	'Electronic',
	'R&B',
	'Pop',
	'Jazz',
	'Metal',
	'Lo-fi',
	'Afrobeats',
	'Classical'
];
```

- [ ] **Step 2: Typecheck**

Run: `npm run check`
Expected: no errors in `content.ts`.

- [ ] **Step 3: Commit**

```bash
git add src/lib/content.ts
git commit -m "feat: add landing copy/content module"
```

---

## Phase 1 — Shared primitives

### Task 10: Soundwave canvas

**Files:** Create `src/lib/components/Soundwave.svelte`.

- [ ] **Step 1: Implement**

```svelte
<script lang="ts">
	import { onMount } from 'svelte';
	import { prefersReducedMotion } from '$lib/motion/prefersReducedMotion';

	let { bars = 64, height = 120 }: { bars?: number; height?: number } = $props();
	let canvas: HTMLCanvasElement;

	onMount(() => {
		const ctx = canvas.getContext('2d');
		if (!ctx) return;
		const reduce = prefersReducedMotion();
		let raf = 0;
		let pointerX = 0.5;
		let w = 0,
			h = 0,
			dpr = 1;

		const resize = () => {
			dpr = Math.min(window.devicePixelRatio || 1, 2);
			w = canvas.clientWidth;
			h = canvas.clientHeight;
			canvas.width = w * dpr;
			canvas.height = h * dpr;
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
		};
		const onMove = (e: PointerEvent) => {
			const r = canvas.getBoundingClientRect();
			pointerX = (e.clientX - r.left) / r.width;
		};

		const draw = (t: number) => {
			ctx.clearRect(0, 0, w, h);
			const gap = w / bars;
			for (let i = 0; i < bars; i++) {
				const x = i / bars;
				const wave = reduce ? 0.4 : Math.sin(x * 12 + t / 600) * 0.5 + 0.5;
				const focus = 1 - Math.min(Math.abs(x - pointerX) * 2.2, 1);
				const amp = 0.12 + wave * 0.55 + focus * 0.33;
				const barH = amp * h;
				ctx.fillStyle = `rgba(255,216,119,${0.35 + focus * 0.5})`;
				ctx.fillRect(i * gap + gap * 0.2, h - barH, gap * 0.5, barH);
			}
			if (!reduce) raf = requestAnimationFrame(draw);
		};

		resize();
		window.addEventListener('resize', resize);
		if (!reduce) {
			canvas.addEventListener('pointermove', onMove);
			raf = requestAnimationFrame(draw);
		} else {
			draw(0);
		}
		return () => {
			cancelAnimationFrame(raf);
			window.removeEventListener('resize', resize);
			canvas.removeEventListener('pointermove', onMove);
		};
	});
</script>

<canvas bind:this={canvas} style="width:100%;height:{height}px;display:block" aria-hidden="true"
></canvas>
```

- [ ] **Step 2: Typecheck**

Run: `npm run check`
Expected: no errors in `Soundwave.svelte`.

- [ ] **Step 3: Commit**

```bash
git add src/lib/components/Soundwave.svelte
git commit -m "feat: add pointer-reactive soundwave canvas"
```

---

### Task 11: AudienceToggle

**Files:** Create `src/lib/components/AudienceToggle.svelte`.

- [ ] **Step 1: Implement** (radio semantics, keyboard-operable, 44px targets)

```svelte
<script lang="ts">
	import { audience, type Audience } from '$lib/stores/audience.svelte';
	let { size = 'md' }: { size?: 'sm' | 'md' } = $props();
	const options: { value: Audience; label: string }[] = [
		{ value: 'fan', label: "I'm a fan" },
		{ value: 'artist', label: "I'm an artist" }
	];
</script>

<div class="toggle {size}" role="radiogroup" aria-label="Choose your role">
	{#each options as opt}
		<button
			type="button"
			role="radio"
			aria-checked={audience.value === opt.value}
			class:on={audience.value === opt.value}
			onclick={() => audience.set(opt.value)}
		>
			{opt.label}
		</button>
	{/each}
</div>

<style lang="scss">
	.toggle {
		display: inline-flex;
		gap: 2px;
		padding: 4px;
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.07);
		border: 1px solid var(--line);
		button {
			cursor: pointer;
			border: 0;
			background: transparent;
			color: var(--text-muted);
			font: 500 0.95rem var(--font-sans);
			padding: 10px 18px;
			min-height: 44px;
			border-radius: 999px;
			transition:
				color var(--dur-base) var(--ease-out),
				background var(--dur-base) var(--ease-out);
			&.on {
				background: var(--gold);
				color: #1a1a1a;
				font-weight: 700;
			}
		}
		&.sm button {
			padding: 6px 12px;
			min-height: 36px;
			font-size: 0.8rem;
		}
	}
</style>
```

- [ ] **Step 2: Typecheck**

Run: `npm run check`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/lib/components/AudienceToggle.svelte
git commit -m "feat: add accessible fan/artist toggle"
```

---

### Task 12: KineticHeading, StatCounter, Marquee, TiltCard

**Files:** Create `src/lib/components/KineticHeading.svelte`, `StatCounter.svelte`, `Marquee.svelte`, `TiltCard.svelte`.

- [ ] **Step 1: `KineticHeading.svelte`** — word-by-word reveal

```svelte
<script lang="ts">
	import { reveal } from '$lib/actions/reveal';
	let { lines = [] as string[] }: { lines?: string[] } = $props();
</script>

<h1 class="kinetic">
	{#each lines as line, li}
		<span class="line">
			{#each line.split(' ') as word, wi}
				<span class="word-wrap"
					><span class="word" use:reveal={{ delay: (li * 3 + wi) * 60, y: 30 }}>{word}</span></span
				>
			{/each}
		</span>
	{/each}
</h1>

<style lang="scss">
	.kinetic {
		font-style: italic;
		font-weight: 600;
		font-size: clamp(2.5rem, 7vw, 5.5rem);
	}
	.line {
		display: block;
	}
	.word-wrap {
		display: inline-block;
		overflow: hidden;
		padding: 0 0.12em 0.08em 0;
	}
	.word {
		display: inline-block;
	}
</style>
```

- [ ] **Step 2: `StatCounter.svelte`** — count-up on reveal (RM-aware)

```svelte
<script lang="ts">
	import { onMount } from 'svelte';
	import { prefersReducedMotion } from '$lib/motion/prefersReducedMotion';
	let {
		value = 0,
		decimals = 0,
		prefix = '',
		suffix = '',
		duration = 1400
	}: {
		value?: number;
		decimals?: number;
		prefix?: string;
		suffix?: string;
		duration?: number;
	} = $props();
	let el: HTMLSpanElement;
	let display = $state('0');

	const fmt = (n: number) => prefix + n.toFixed(decimals) + suffix;

	onMount(() => {
		if (prefersReducedMotion()) {
			display = fmt(value);
			return;
		}
		const io = new IntersectionObserver(
			(entries) => {
				if (!entries[0].isIntersecting) return;
				io.disconnect();
				const start = performance.now();
				const tick = (t: number) => {
					const p = Math.min((t - start) / duration, 1);
					const eased = 1 - Math.pow(1 - p, 3);
					display = fmt(value * eased);
					if (p < 1) requestAnimationFrame(tick);
				};
				requestAnimationFrame(tick);
			},
			{ threshold: 0.5 }
		);
		io.observe(el);
		return () => io.disconnect();
	});
</script>

<span bind:this={el} class="stat">{display}</span>

<style lang="scss">
	.stat {
		font-family: var(--font-display);
		font-weight: 600;
		color: var(--gold);
		font-size: clamp(3rem, 9vw, 6rem);
		display: inline-block;
	}
</style>
```

- [ ] **Step 3: `Marquee.svelte`** — infinite scroll, RM pauses

```svelte
<script lang="ts">
	let { items = [] as string[], speed = 30 }: { items?: string[]; speed?: number } = $props();
</script>

<div class="marquee" aria-hidden="true">
	<div class="track" style="--speed:{speed}s">
		{#each [...items, ...items] as item}
			<span class="item">{item}</span>
		{/each}
	</div>
</div>

<style lang="scss">
	.marquee {
		overflow: hidden;
		width: 100%;
		mask-image: linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent);
	}
	.track {
		display: inline-flex;
		gap: 3rem;
		white-space: nowrap;
		animation: scroll var(--speed) linear infinite;
	}
	.item {
		color: var(--text-muted);
		font: 500 1.1rem var(--font-sans);
		letter-spacing: 1px;
	}
	@keyframes scroll {
		to {
			transform: translateX(-50%);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.track {
			animation: none;
		}
	}
</style>
```

- [ ] **Step 4: `TiltCard.svelte`** — pointer tilt (disabled for touch/RM)

```svelte
<script lang="ts">
	import { prefersReducedMotion } from '$lib/motion/prefersReducedMotion';
	let { max = 8, children }: { max?: number; children?: any } = $props();
	let el: HTMLDivElement;
	let enabled = false;

	function onMove(e: PointerEvent) {
		if (!enabled) return;
		const r = el.getBoundingClientRect();
		const px = (e.clientX - r.left) / r.width - 0.5;
		const py = (e.clientY - r.top) / r.height - 0.5;
		el.style.transform = `perspective(800px) rotateY(${px * max}deg) rotateX(${-py * max}deg)`;
	}
	function reset() {
		el.style.transform = '';
	}
	$effect(() => {
		enabled = !prefersReducedMotion() && window.matchMedia('(pointer:fine)').matches;
	});
</script>

<div bind:this={el} class="tilt" onpointermove={onMove} onpointerleave={reset}>
	{@render children?.()}
</div>

<style lang="scss">
	.tilt {
		transition: transform var(--dur-base) var(--ease-out);
		will-change: transform;
	}
</style>
```

- [ ] **Step 5: Typecheck all**

Run: `npm run check`
Expected: no errors in the four new components.

- [ ] **Step 6: Commit**

```bash
git add src/lib/components/KineticHeading.svelte src/lib/components/StatCounter.svelte src/lib/components/Marquee.svelte src/lib/components/TiltCard.svelte
git commit -m "feat: add kinetic heading, stat counter, marquee, tilt-card primitives"
```

---

## Phase 2 — Sections

> For each section: build markup from `src/lib/content.ts`, style with tokens, apply `use:reveal` to key elements (1–2 animated focal points per view), wire `audience` where relevant. After each, run `npm run check` and view the section in the dev server. Commit per section.

### Task 13: Nav

**Files:** Create `src/lib/components/landing/Nav.svelte`.

- [ ] **Step 1: Implement**
  - Fixed top bar, `z-index: var(--z-nav)`. Left: `PDM` wordmark (Playfair). Center/right: anchor links `#how`, `#product`, `#vision`. Then `<AudienceToggle size="sm" />`. Then a "Join the waitlist" `<a href="#waitlist">` styled as gold button.
  - Transparent initially; on scroll past 40px add class `scrolled` → `background: rgba(10,10,11,0.7); backdrop-filter: blur(12px); border-bottom: 1px solid var(--line)`. Detect via a scroll listener throttled with `requestAnimationFrame`, or an IntersectionObserver sentinel at top of page.
  - Mobile (`max-width: 768px`): hide links; show a hamburger button (`aria-expanded`, `aria-controls`) that opens a full-height sheet containing links + toggle + CTA. Close on link click / Escape. All targets ≥44px.
  - Smooth anchor scroll: links call `getLenis()?.scrollTo(target)` when Lenis active, else native (CSS smooth handles it).
- [ ] **Step 2: Verify** — `npm run check`; in dev server confirm bar turns to blur on scroll, mobile sheet opens/closes, focus visible, Escape closes.
- [ ] **Step 3: Commit** — `git commit -m "feat: add sticky nav with audience toggle and mobile sheet"`

---

### Task 14: Hero

**Files:** Create `src/lib/components/landing/Hero.svelte`.

- [ ] **Step 1: Implement**
  - `<section>` `min-height: 100dvh`, dark cinematic photo background (temporary Unsplash, see Task 25). Layer order: photo → dark gradient overlay (`linear-gradient(180deg, rgba(10,10,11,.35), rgba(10,10,11,.92))`) → radial spotlight glow behind heading (`radial-gradient(closest-side, var(--glow), transparent)`) → content → `<Soundwave>` anchored bottom.
  - Content reads from `hero[audience.value]`: kicker (small uppercase, letter-spaced), `<KineticHeading lines={hero[audience.value].heading} />`, sub paragraph (`max-width: 60ch`), CTA row: primary `<a href="#waitlist">Join the waitlist</a>` (gold) + secondary `<a href="#how">See how it works</a>` (ghost). Scroll cue chevron at bottom.
  - When `audience.value` changes, heading/sub swap; wrap the swapping block in `{#key audience.value}` with a Svelte `transition:fade` (guarded: import `fade`, fine to keep — it's opacity-only).
  - Parallax: with GSAP, on mount (skip if reduced motion) animate the photo layer `yPercent` slightly on scroll via ScrollTrigger scrub. Mobile: disable parallax.
- [ ] **Step 2: Verify** — `npm run check`; dev server: heading reveals word-by-word, soundwave reacts to pointer, toggling fan/artist swaps copy, parallax on desktop only, readable on 375px.
- [ ] **Step 3: Commit** — `git commit -m "feat: add cinematic hero with kinetic heading and soundwave"`

---

### Task 15: Problem

**Files:** Create `src/lib/components/landing/Problem.svelte`.

- [ ] **Step 1: Implement**
  - `<section>` dark, generous vertical padding (`clamp(6rem, 12vh, 10rem)`). Centered editorial column (`max-width: 900px`).
  - Heading (`use:reveal`): "Streaming pays artists fractions of a cent." Sub line: "Fans became play-counts. Artists became content. The connection got lost in the algorithm."
  - Two `<StatCounter>` from `problemStats` side by side (stack on mobile) with labels beneath.
  - One pull-quote styled line for editorial feel.
- [ ] **Step 2: Verify** — counters count up once on scroll; reduced-motion shows final values immediately; no layout shift (reserve height).
- [ ] **Step 3: Commit** — `git commit -m "feat: add problem section with animated stats"`

---

### Task 16: Shift

**Files:** Create `src/lib/components/landing/Shift.svelte`.

- [ ] **Step 1: Implement**
  - `<section>` with a subtle gold radial glow. Heading from `shift.heading`, body from `shift.body`.
  - Value-flow visual: a horizontal row `YOU → $1 → ARTIST` using styled chips connected by an animated gold line (CSS `::after` width transition triggered by `use:reveal`), and `<StatCounter value={shift.artistShare} suffix="%" />` with caption "to the artist".
  - On mobile, stack vertically with a vertical connector.
- [ ] **Step 2: Verify** — flow line animates in on scroll; 80% counts up; accessible text equivalents present (the arrows/percent are real text, not color-only).
- [ ] **Step 3: Commit** — `git commit -m "feat: add the-shift value-flow section"`

---

### Task 17: TwoSides

**Files:** Create `src/lib/components/landing/TwoSides.svelte`.

- [ ] **Step 1: Implement**
  - `<section>` heading "What you unlock." with an `<AudienceToggle />` beneath it.
  - Grid of benefit cards from `benefits[audience.value]` (`repeat(auto-fit, minmax(240px, 1fr))`). Each card: title (gold), description (muted), thin left gold border or small SVG icon.
  - On `audience.value` change, re-render cards inside `{#key audience.value}` with staggered `use:reveal` (delay = index \* 50ms). Cards use `transform/opacity` only.
  - Card hover: `background: var(--bg-elev-2)`, border lightens (no layout-shifting scale; subtle translateY allowed).
- [ ] **Step 2: Verify** — toggling swaps the 5 cards with stagger; keyboard toggle works; reduced motion = instant swap.
- [ ] **Step 3: Commit** — `git commit -m "feat: add two-sides toggle benefits section"`

---

### Task 18: Product (bento)

**Files:** Create `src/lib/components/landing/Product.svelte`.

- [ ] **Step 1: Implement**
  - `<section id="product">` heading "It's a real product, not a promise."
  - Bento CSS grid (e.g. 4 tiles: large Player tile spanning 2 rows, Artist page, Exclusives feed, Community chat). Each tile is a `<TiltCard>` containing a hand-built CSS mockup (no real screenshots): e.g. Player tile = album square + track title + progress bar + play button; Chat tile = stacked message bubbles; Feed tile = post cards; Artist tile = header + subscribe $1 button.
  - Tiles: `background: var(--bg-elev)`, `border: 1px solid var(--line)`, `border-radius: 16px`, padding. `use:reveal` with per-tile stagger. The Player progress bar animates subtly (transform scaleX) when in view, unless reduced motion.
  - Responsive: collapse bento to single column on mobile.
- [ ] **Step 2: Verify** — tilt only on fine-pointer desktop; tiles reveal staggered; mockups look crisp; single column on 375px.
- [ ] **Step 3: Commit** — `git commit -m "feat: add product bento showcase with tilt cards"`

---

### Task 19: HowItWorks

**Files:** Create `src/lib/components/landing/HowItWorks.svelte`.

- [ ] **Step 1: Implement**
  - `<section id="how">` heading "From first listen to first row." Steps from `steps` array.
  - Desktop: 3 columns connected by a horizontal progress line that "fills" gold as the section scrolls into view (GSAP ScrollTrigger scrub on a line `scaleX`, or `use:reveal` width transition). Mobile: vertical timeline with a filling vertical line.
  - Each step: big number (Playfair, gold), title, description; `use:reveal` staggered.
- [ ] **Step 2: Verify** — line fills on scroll; reduced-motion shows filled line statically; vertical on mobile.
- [ ] **Step 3: Commit** — `git commit -m "feat: add how-it-works stepped section"`

---

### Task 20: Vision

**Files:** Create `src/lib/components/landing/Vision.svelte`.

- [ ] **Step 1: Implement**
  - `<section id="vision">` slim, calm breather. Centered large Playfair italic line `vision.heading` and muted `vision.body`. Subtle slow background gradient drift (RM-aware; pure opacity/transform). No CTA. **No crypto/investment specifics** — ambition only.
- [ ] **Step 2: Verify** — reads calm; reduced motion static; text contrast OK.
- [ ] **Step 3: Commit** — `git commit -m "feat: add vision teaser section"`

---

### Task 21: Proof

**Files:** Create `src/lib/components/landing/Proof.svelte`.

- [ ] **Step 1: Implement**
  - `<section>` momentum framing **without invented numbers**: heading like "Join the founding wave." + early-access framing (e.g. three value chips: "Founding-member perks", "First access to artists", "Shape the product").
  - `<Marquee items={genres} />` band of genres for texture.
  - Optional founder/artist quote block (use a clearly placeholder-but-neutral quote, attributed to "— The PDM team"; no fake person).
  - (No live counter unless a real count source is provided later — see spec §9.)
- [ ] **Step 2: Verify** — marquee scrolls, pauses under reduced motion; no fabricated stats.
- [ ] **Step 3: Commit** — `git commit -m "feat: add proof/momentum section with genre marquee"`

---

### Task 22: Waitlist

**Files:** Create `src/lib/components/landing/Waitlist.svelte`. Uses `submitWaitlist`, `persistJoin`, `loadStoredJoin`, `canvas-confetti`, `audience` store.

- [ ] **Step 1: Implement**

```svelte
<script lang="ts">
	import { onMount } from 'svelte';
	import confetti from 'canvas-confetti';
	import { audience } from '$lib/stores/audience.svelte';
	import { submitWaitlist, persistJoin, loadStoredJoin } from '$lib/waitlist';
	import AudienceToggle from '$lib/components/AudienceToggle.svelte';
	import Soundwave from '$lib/components/Soundwave.svelte';

	let email = $state('');
	let loading = $state(false);
	let submitted = $state(false);
	let errorMsg = $state('');

	async function onSubmit(e: Event) {
		e.preventDefault();
		errorMsg = '';
		loading = true;
		const res = await submitWaitlist({ email, role: audience.value });
		loading = false;
		if (!res.ok) {
			errorMsg =
				res.error === 'email-required'
					? 'Enter a valid email.'
					: 'Something went wrong — try again.';
			return;
		}
		persistJoin({ email, role: audience.value });
		submitted = true;
		confetti({
			particleCount: 120,
			spread: 70,
			origin: { y: 0.6 },
			colors: ['#FFD877', '#E0B23A', '#F4ECE0']
		});
	}

	onMount(() => {
		const stored = loadStoredJoin();
		if (stored) {
			email = stored.email;
			audience.set(stored.role);
			submitted = true;
		}
	});
</script>

<section id="waitlist" class="waitlist">
	<div class="glow" aria-hidden="true"></div>
	<h2>Be there from the first note.</h2>
	<p class="sub">Join the waitlist for early access. Fans and artists welcome.</p>

	{#if submitted}
		<p class="success" role="status">You're on the list. We'll be in touch. 🎶</p>
	{:else}
		<form onsubmit={onSubmit} novalidate>
			<AudienceToggle />
			<label class="field">
				<span>Email</span>
				<input
					type="email"
					autocomplete="email"
					bind:value={email}
					placeholder="you@email.com"
					required
				/>
			</label>
			{#if errorMsg}<p class="error" role="alert">{errorMsg}</p>{/if}
			<button type="submit" disabled={loading}>{loading ? 'Joining…' : 'Join the waitlist'}</button>
		</form>
	{/if}
	<div class="wave"><Soundwave height={90} /></div>
</section>

<style lang="scss">
	.waitlist {
		position: relative;
		text-align: center;
		padding: clamp(6rem, 14vh, 11rem) 1.5rem;
		overflow: hidden;
	}
	.glow {
		position: absolute;
		inset: 0;
		background: radial-gradient(closest-side, var(--glow), transparent 70%);
		filter: blur(40px);
		z-index: 0;
	}
	h2 {
		position: relative;
		z-index: 1;
		font-style: italic;
		font-size: clamp(2.2rem, 6vw, 4rem);
	}
	.sub {
		position: relative;
		z-index: 1;
		color: var(--text-muted);
		margin: 1rem auto 2rem;
		max-width: 48ch;
	}
	form {
		position: relative;
		z-index: 1;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		max-width: 440px;
		margin: 0 auto;
		align-items: stretch;
	}
	.field {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
		text-align: left;
		span {
			color: var(--gold);
			font-size: 0.9rem;
		}
	}
	input {
		padding: 0.9rem 1rem;
		min-height: 48px;
		border-radius: 10px;
		border: 1px solid var(--line);
		background: rgba(255, 255, 255, 0.04);
		color: var(--text);
		font-size: 1rem;
		&:focus-visible {
			border-color: var(--gold);
		}
	}
	button {
		min-height: 48px;
		border-radius: 10px;
		border: 0;
		background: var(--gold);
		color: #1a1a1a;
		font: 700 1.05rem var(--font-sans);
		cursor: pointer;
		transition: filter var(--dur-base) var(--ease-out);
		&:hover {
			filter: brightness(1.06);
		}
		&:disabled {
			opacity: 0.6;
			cursor: not-allowed;
		}
	}
	.error {
		color: #ff8a8a;
	}
	.success {
		position: relative;
		z-index: 1;
		color: var(--gold);
		font-size: 1.2rem;
	}
	.wave {
		position: relative;
		z-index: 1;
		margin-top: 2.5rem;
		opacity: 0.7;
	}
</style>
```

- [ ] **Step 2: Verify** — `npm run check`; dev server: invalid email shows error, valid email triggers confetti + success, reload keeps "submitted" (localStorage), keyboard + screen-reader (`role="alert"`/`status`) behave.
- [ ] **Step 3: Commit** — `git commit -m "feat: add waitlist section with confetti success"`

---

### Task 23: Footer

**Files:** Create `src/lib/components/landing/Footer.svelte`.

- [ ] **Step 1: Implement** — `PDM` wordmark + tagline "People Driven Music", anchor links, social links (SVG icons, real labels), contact email, © year, legal links. Minimal, muted, `border-top: 1px solid var(--line)`.
- [ ] **Step 2: Verify** — `npm run check`; links have accessible labels; contrast OK.
- [ ] **Step 3: Commit** — `git commit -m "feat: add footer"`

---

## Phase 3 — Composition, SEO, cleanup

### Task 24: Compose page + rewrite SEO

**Files:** Modify `src/routes/+page.svelte`, `src/routes/SEO.svelte`.

- [ ] **Step 1: Rewrite `+page.svelte`**

```svelte
<script lang="ts">
	import SEO from './SEO.svelte';
	import Nav from '$lib/components/landing/Nav.svelte';
	import Hero from '$lib/components/landing/Hero.svelte';
	import Problem from '$lib/components/landing/Problem.svelte';
	import Shift from '$lib/components/landing/Shift.svelte';
	import TwoSides from '$lib/components/landing/TwoSides.svelte';
	import Product from '$lib/components/landing/Product.svelte';
	import HowItWorks from '$lib/components/landing/HowItWorks.svelte';
	import Vision from '$lib/components/landing/Vision.svelte';
	import Proof from '$lib/components/landing/Proof.svelte';
	import Waitlist from '$lib/components/landing/Waitlist.svelte';
	import Footer from '$lib/components/landing/Footer.svelte';
</script>

<SEO />
<Nav />
<main>
	<Hero />
	<Problem />
	<Shift />
	<TwoSides />
	<Product />
	<HowItWorks />
	<Vision />
	<Proof />
	<Waitlist />
</main>
<Footer />
```

- [ ] **Step 2: Rewrite `SEO.svelte`** — remove ALL Web3/token/"listen-to-earn" language. New title: "PDM — People Driven Music" ; description: "Back the artists you love for $1 a month. PDM is a music platform where fans get closer to artists and artists earn directly — no labels, no algorithm tax." Update keywords, OG/Twitter text, JSON-LD `description`. Keep canonical/structure. Remove `EntertainmentApplication`→ keep but update description; drop token references.
- [ ] **Step 3: Verify** — `npm run check`; dev server: full page scrolls top to bottom, all sections present, anchor nav works, no console errors. View source / inspect `<head>`: no "Web3"/"token" strings remain.
- [ ] **Step 4: Commit** — `git commit -m "feat: compose landing page and rewrite SEO (drop Web3)"`

---

### Task 25: Temporary hero/CTA imagery

**Files:** Add images to `static/`; reference in `Hero.svelte` (Task 14) and optionally Waitlist.

- [ ] **Step 1:** Add 1–2 cinematic music photos to `static/` as optimized WebP (e.g. `hero.webp`, ~1920px wide). Source: Unsplash (concert/artist/studio). Provide width/height via CSS `aspect-ratio` or attributes to avoid CLS. Add descriptive `alt` (decorative background → `alt=""` + `aria-hidden`, content image → real alt).
- [ ] **Step 2:** Wire `srcset`/sizes or a single optimized asset with `loading="eager"` for hero (above fold) and `decoding="async"`.
- [ ] **Step 3: Verify** — Lighthouse/Network: hero image reasonable size, no layout shift on load.
- [ ] **Step 4: Commit** — `git commit -m "chore: add temporary cinematic hero imagery (Unsplash)"`

---

### Task 26: Remove superseded components

**Files:** Delete `src/routes/Intro.svelte`, `Problems.svelte`, `CoreFeatures.svelte`, `How.svelte`, `Join.svelte`, `Animate.svelte`, `src/lib/scroll.ts`. Remove unused icons only if confirmed unreferenced.

- [ ] **Step 1:** Grep for imports of each file to confirm no remaining references:
      Run: `grep -rn "Intro\|Problems\|CoreFeatures\|How\.svelte\|Join\.svelte\|Animate\|lib/scroll" src/` — expect only the files themselves.
- [ ] **Step 2:** Delete the files.
- [ ] **Step 3: Verify** — `npm run check` and `npm run build` succeed.
- [ ] **Step 4: Commit** — `git commit -m "chore: remove superseded landing components"`

---

## Phase 4 — Quality pass

### Task 27: Accessibility & reduced-motion audit

- [ ] **Step 1:** With `prefers-reduced-motion: reduce` enabled (DevTools → Rendering → Emulate CSS media), scroll the whole page: confirm no parallax, no soundwave animation, no marquee motion, counters show final values, reveals are instant. Fix any violations.
- [ ] **Step 2:** Keyboard-only pass: Tab through nav → toggle → all CTAs → form; visible focus rings everywhere; toggle operable with arrows/Enter; mobile sheet closes on Escape.
- [ ] **Step 3:** Contrast check key text pairs (gold on bg, muted text on bg) ≥4.5:1 (or ≥3:1 large). Adjust `--text-muted` if needed.
- [ ] **Step 4: Commit** — `git commit -m "fix: accessibility and reduced-motion audit fixes"`

### Task 28: Responsive & performance pass

- [ ] **Step 1:** Verify at 375 / 768 / 1024 / 1440px: no horizontal scroll, no overlap, readable type, bento/columns collapse correctly, nav sheet works.
- [ ] **Step 2:** Confirm images lazy-load below fold, dimensions reserved, fonts `swap`. Throttle/RAF on scroll/pointer handlers verified.
- [ ] **Step 3:** Run `npm run build && npm run preview`; smoke-test the built site.
- [ ] **Step 4: Commit** — `git commit -m "fix: responsive and performance pass"`

### Task 29: Full verification

- [ ] **Step 1:** Run `npm test` — all unit tests pass.
- [ ] **Step 2:** Run `npm run check` — zero errors.
- [ ] **Step 3:** Run `npm run lint` (prettier+eslint) — passes (run `npm run format` if needed).
- [ ] **Step 4:** Run `npm run build` — succeeds.
- [ ] **Step 5:** Manual: full scroll-through in dev server, fan/artist toggle changes hero + benefits, waitlist submit works end-to-end (Network tab shows POST to `/api/whitelist`).
- [ ] **Step 6: Commit** any final fixes — `git commit -m "chore: final verification fixes"`

---

## Self-Review Notes (coverage vs spec)

- Positioning/messaging (no crypto, $1 direct, fan/artist) → Tasks 9, 14, 16, 17, 24 (SEO). ✓
- Visual system tokens/type/motion → Tasks 2, 3, 5, 6. ✓
- All 11 sections → Tasks 13–23. ✓
- Signature effects (spotlight, kinetic heading, soundwave, tilt bento, marquee, parallax, Lenis) → Tasks 5, 10, 12, 14, 18, 21. ✓
- A11y/perf guardrails + reduced motion → Tasks 4, 6, 27, 28. ✓
- Reuse `/api/whitelist`, confetti, localStorage → Task 22. ✓
- Cleanup old files + SEO rewrite → Tasks 24, 26. ✓
- Temporary Unsplash imagery → Task 25. ✓
- Out-of-scope (investment UI/auth/backend) → not built; Vision only teases. ✓
