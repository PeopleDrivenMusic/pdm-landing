<script lang="ts">
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { gsap } from 'gsap';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';
	import KineticHeading from '$lib/components/KineticHeading.svelte';
	import Particles from '$lib/components/Particles.svelte';
	import { audience } from '$lib/stores/audience.svelte';
	import { hero, heroBadge, heroPerks } from '$lib/content';
	import { prefersReducedMotion } from '$lib/motion/prefersReducedMotion';
	import { getLenis } from '$lib/motion/smoothScroll';

	let root: HTMLElement;
	let bg: HTMLDivElement;
	let spot: HTMLDivElement;
	let orbA: HTMLDivElement;
	let orbB: HTMLDivElement;

	// Backdrop auto-carousel (cross-fade + Ken Burns zoom).
	const slides = ['/bg1.webp', '/slid3.webp', '/slide5.webp', '/slide4.webp', '/slide2.webp'];
	let current = $state(0);

	function scrollTo(e: MouseEvent, href: string) {
		const target = document.querySelector(href);
		if (!target) return;
		e.preventDefault();
		const lenis = getLenis();
		if (lenis) lenis.scrollTo(target as HTMLElement, { offset: -80 });
		else target.scrollIntoView({ behavior: 'smooth' });
	}

	onMount(() => {
		const reduce = prefersReducedMotion();
		const fine = window.matchMedia('(pointer: fine)').matches;
		const desktop = window.matchMedia('(min-width: 769px)').matches;

		gsap.registerPlugin(ScrollTrigger);

		const ctx = gsap.context(() => {
			// Entrance choreography (skip when reduced — elements stay at rest).
			if (!reduce) {
				const tl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.9 } });
				tl.from('.badge', { y: 18, autoAlpha: 0 }, 0.1)
					.from('.cta-btn', { y: 22, autoAlpha: 0, stagger: 0.1 }, 0.45)
					.from('.float', { y: 28, autoAlpha: 0, scale: 0.94, stagger: 0.15 }, 0.6);
			}

			// Parallax on the backdrop while scrolling.
			if (!reduce && desktop) {
				gsap.to(bg, {
					yPercent: 18,
					ease: 'none',
					scrollTrigger: { trigger: root, start: 'top top', end: 'bottom top', scrub: true }
				});
			}

			// Slow drifting glow orbs.
			if (!reduce) {
				gsap.to(orbA, {
					xPercent: 12,
					yPercent: -14,
					duration: 11,
					ease: 'sine.inOut',
					repeat: -1,
					yoyo: true
				});
				gsap.to(orbB, {
					xPercent: -16,
					yPercent: 10,
					duration: 13,
					ease: 'sine.inOut',
					repeat: -1,
					yoyo: true
				});
			}
		}, root);

		// Auto-advance the backdrop carousel (skip when reduced — static image).
		let slideTimer: ReturnType<typeof setInterval> | undefined;
		if (!reduce) {
			slideTimer = setInterval(() => {
				current = (current + 1) % slides.length;
			}, 6000);
		}

		// Cursor-tracked spotlight + card depth parallax.
		let onMove: ((e: PointerEvent) => void) | null = null;
		if (!reduce && fine && desktop) {
			gsap.set(spot, { autoAlpha: 1 });
			const xS = gsap.quickTo(spot, 'x', { duration: 0.9, ease: 'power3' });
			const yS = gsap.quickTo(spot, 'y', { duration: 0.9, ease: 'power3' });
			const cards = gsap.utils.toArray<HTMLElement>('.float', root);
			const movers = cards.map((c) => ({
				x: gsap.quickTo(c, 'x', { duration: 1, ease: 'power3' }),
				y: gsap.quickTo(c, 'y', { duration: 1, ease: 'power3' }),
				depth: Number(c.dataset.depth ?? 20)
			}));

			onMove = (e: PointerEvent) => {
				const r = root.getBoundingClientRect();
				const px = e.clientX - r.left;
				const py = e.clientY - r.top;
				xS(px);
				yS(py);
				const nx = px / r.width - 0.5;
				const ny = py / r.height - 0.5;
				for (const m of movers) {
					m.x(-nx * m.depth);
					m.y(-ny * m.depth);
				}
			};
			root.addEventListener('pointermove', onMove);
		}

		return () => {
			if (onMove) root.removeEventListener('pointermove', onMove);
			if (slideTimer) clearInterval(slideTimer);
			ctx.revert();
		};
	});
</script>

<section id="top" class="hero" bind:this={root}>
	<div class="bg" bind:this={bg}>
		{#each slides as src, i (src)}
			<div
				class="slide"
				class:active={i === current}
				style="background-image: url({src})"
				aria-hidden="true"
			></div>
		{/each}
	</div>
	<div class="overlay"></div>
	<div class="grain" aria-hidden="true"></div>
	<div class="particles" aria-hidden="true"><Particles /></div>
	<div class="orb orb-gold" bind:this={orbA} aria-hidden="true"></div>
	<div class="orb orb-cool" bind:this={orbB} aria-hidden="true"></div>
	<div class="spot" bind:this={spot} aria-hidden="true"></div>

	<div class="content">
		<span class="badge"><i class="dot"></i>{heroBadge}</span>

		{#key audience.value}
			<div class="swap" in:fade={{ duration: 320 }}>
				<p class="kicker">{hero[audience.value].kicker}</p>
				<KineticHeading lines={hero[audience.value].heading} />
				<p class="sub">{hero[audience.value].sub}</p>
			</div>
		{/key}

		<div class="ctas">
			<a class="cta-btn primary" href="#waitlist" onclick={(e) => scrollTo(e, '#waitlist')}>
				<span>Join the waitlist</span>
			</a>
			<a class="cta-btn ghost" href="#how" onclick={(e) => scrollTo(e, '#how')}>See how it works</a>
		</div>
	</div>

	<!-- Floating cards (decorative; the message is in the copy above). -->
	<aside class="float card-perks" data-depth="32" aria-hidden="true">
		{#key audience.value}
			<div class="swap-perks" in:fade={{ duration: 280 }}>
				<span class="tag">{heroPerks[audience.value].title}</span>
				<ul class="perks">
					{#each heroPerks[audience.value].items as item (item)}
						<li>
							<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4">
								<path d="M5 13l4 4 10-11" stroke-linecap="round" stroke-linejoin="round" />
							</svg>{item}
						</li>
					{/each}
				</ul>
			</div>
		{/key}
	</aside>

	<aside class="float card-split" data-depth="20" aria-hidden="true">
		<span class="cap">Every subscription</span>
		<div class="flow">
			<span class="amt in">$1.00</span>
			<svg viewBox="0 0 24 24" class="arrow" fill="none" stroke="currentColor" stroke-width="2">
				<path d="M5 12h14M13 6l6 6-6 6" stroke-linecap="round" stroke-linejoin="round" />
			</svg>
			<span class="amt out">$0.80</span>
		</div>
		<small>straight to the artist</small>
	</aside>

	<a class="cue" href="#how" onclick={(e) => scrollTo(e, '#how')} aria-label="Scroll down">
		<span></span>
	</a>
</section>

<style lang="scss">
	.hero {
		position: relative;
		min-height: 100dvh;
		display: flex;
		align-items: center;
		overflow: hidden;
		padding: clamp(5.5rem, 11vh, 8rem) clamp(1.25rem, 5vw, 4rem) clamp(3rem, 7vh, 5rem);
	}

	/* ── Backdrop layers ─────────────────────────────── */
	.bg {
		position: absolute;
		inset: -10% 0 0;
		height: 120%;
		z-index: 0;
		will-change: transform;
	}
	.slide {
		position: absolute;
		inset: 0;
		background: center / cover no-repeat;
		opacity: 0;
		transform: scale(1.04);
		/* slow reverse on the outgoing slide so it never snaps back */
		transition:
			opacity 2.4s ease-in-out,
			transform 16s linear;
		will-change: opacity, transform;
	}
	.slide.active {
		opacity: 1;
		transform: scale(1.16);
		/* linear, constant zoom across the whole life of the slide */
		transition:
			opacity 2.4s ease-in-out,
			transform 8s linear;
	}
	@media (prefers-reduced-motion: reduce) {
		.slide,
		.slide.active {
			transform: none;
			transition: opacity 2.4s ease-in-out;
		}
	}
	.overlay {
		position: absolute;
		inset: 0;
		z-index: 1;
		background:
			/* seat the top-right card without crushing the photo */
			radial-gradient(90% 70% at 82% 6%, rgba(10, 10, 11, 0.48), transparent 60%),
			/* darken the left text column for legibility */
				linear-gradient(
					90deg,
					rgba(10, 10, 11, 0.78) 0%,
					rgba(10, 10, 11, 0.34) 42%,
					transparent 70%
				),
			/* gentle bottom fade into the page */
				linear-gradient(
					180deg,
					rgba(10, 10, 11, 0.24) 0%,
					rgba(10, 10, 11, 0.32) 50%,
					rgba(10, 10, 11, 0.84) 90%,
					var(--bg) 100%
				);
	}
	.particles {
		position: absolute;
		inset: 0;
		z-index: 2;
		pointer-events: none;
	}
	.grain {
		position: absolute;
		inset: 0;
		z-index: 2;
		opacity: 0.05;
		pointer-events: none;
		mix-blend-mode: overlay;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
	}
	.orb {
		position: absolute;
		z-index: 1;
		border-radius: 50%;
		filter: blur(70px);
		pointer-events: none;
		will-change: transform;
	}
	.orb-gold {
		top: 18%;
		left: 8%;
		width: min(560px, 60vw);
		height: min(560px, 60vw);
		background: radial-gradient(closest-side, rgba(255, 216, 119, 0.34), transparent 70%);
	}
	.orb-cool {
		bottom: 6%;
		right: 4%;
		width: min(520px, 56vw);
		height: min(520px, 56vw);
		background: radial-gradient(closest-side, rgba(124, 152, 255, 0.22), transparent 70%);
	}
	.spot {
		position: absolute;
		left: 0;
		top: 0;
		width: 640px;
		height: 640px;
		margin: -320px 0 0 -320px;
		z-index: 1;
		opacity: 0;
		visibility: hidden;
		pointer-events: none;
		background: radial-gradient(closest-side, rgba(255, 216, 119, 0.16), transparent 72%);
		will-change: transform;
	}

	/* ── Content ─────────────────────────────────────── */
	.content {
		position: relative;
		z-index: 3;
		max-width: var(--maxw);
		width: 100%;
		margin: 0 auto;
	}
	.badge {
		display: inline-flex;
		align-items: center;
		gap: 0.55rem;
		padding: 0.45rem 0.9rem;
		border-radius: 999px;
		border: 1px solid var(--line);
		background: rgba(255, 255, 255, 0.04);
		backdrop-filter: blur(8px);
		font-size: 0.78rem;
		letter-spacing: 0.5px;
		color: var(--text-muted);
		margin-bottom: 1.6rem;
	}
	.dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: var(--gold);
		box-shadow: 0 0 0 0 rgba(255, 216, 119, 0.55);
		animation: pulse 2.4s ease-out infinite;
	}
	@keyframes pulse {
		0% {
			box-shadow: 0 0 0 0 rgba(255, 216, 119, 0.5);
		}
		70%,
		100% {
			box-shadow: 0 0 0 9px rgba(255, 216, 119, 0);
		}
	}

	.kicker {
		text-transform: uppercase;
		letter-spacing: 4px;
		font-size: 0.8rem;
		color: var(--gold);
		margin-bottom: 1rem;
	}

	/* Bold grotesque headline — reads strong at large display sizes. */
	.hero :global(.kinetic) {
		font-family: 'Sora', var(--font-sans);
		font-style: normal;
		font-weight: 800;
		letter-spacing: -0.025em;
		line-height: 1.04;
	}
	/* Restore a comfortable gap between words (KineticHeading strips the space). */
	.hero :global(.kinetic .word-wrap) {
		padding-right: 0.3em;
	}
	/* Metallic editorial sheen on the kinetic headline. */
	.hero :global(.kinetic .word) {
		background: linear-gradient(180deg, #fdf6e7 0%, #efe2cc 52%, #d9ad4e 100%);
		-webkit-background-clip: text;
		background-clip: text;
		color: transparent;
		-webkit-text-fill-color: transparent;
	}

	.sub {
		color: var(--text-muted);
		font-size: clamp(1.05rem, 2vw, 1.3rem);
		max-width: 52ch;
		margin-top: 1.5rem;
	}

	.ctas {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		margin-top: 2.5rem;
	}
	.cta-btn {
		position: relative;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-height: 54px;
		padding: 0 1.7rem;
		border-radius: 999px;
		font-weight: 700;
		font-size: 1rem;
		overflow: hidden;
		transition:
			transform var(--dur-base) var(--ease-out),
			filter var(--dur-base) var(--ease-out),
			border-color var(--dur-base) var(--ease-out),
			background var(--dur-base) var(--ease-out);
	}
	.primary {
		background: linear-gradient(135deg, #ffe6a0 0%, var(--gold) 45%, var(--gold-deep) 100%);
		color: #1a1a1a;
		box-shadow: 0 14px 44px -12px var(--glow);
		span {
			position: relative;
			z-index: 1;
		}
		/* shimmer sweep */
		&::after {
			content: '';
			position: absolute;
			inset: 0;
			transform: translateX(-120%);
			background: linear-gradient(
				100deg,
				transparent 30%,
				rgba(255, 255, 255, 0.55) 50%,
				transparent 70%
			);
		}
		&:hover {
			transform: translateY(-2px);
			filter: brightness(1.04);
		}
		&:hover::after {
			transition: transform 0.85s var(--ease-out);
			transform: translateX(120%);
		}
	}
	.ghost {
		border: 1px solid var(--line);
		color: var(--text);
		font-weight: 500;
		background: rgba(255, 255, 255, 0.02);
		&:hover {
			transform: translateY(-2px);
			border-color: var(--gold);
			background: rgba(255, 216, 119, 0.07);
		}
	}

	/* ── Floating glass cards ────────────────────────── */
	.float {
		position: absolute;
		z-index: 3;
		border-radius: 18px;
		border: 1px solid rgba(255, 255, 255, 0.12);
		background: rgba(20, 20, 26, 0.55);
		backdrop-filter: blur(16px);
		box-shadow: 0 24px 60px -24px rgba(0, 0, 0, 0.7);
		padding: 1rem 1.1rem;
		will-change: transform;
	}
	.tag {
		display: inline-block;
		font-size: 0.7rem;
		letter-spacing: 1.2px;
		text-transform: uppercase;
		color: var(--gold);
	}
	.card-perks {
		top: 16%;
		right: clamp(2rem, 6vw, 5rem);
		width: 250px;
		animation: floaty 7s ease-in-out infinite;
		.perks {
			list-style: none;
			margin: 0.7rem 0 0;
			padding: 0;
			display: flex;
			flex-direction: column;
			gap: 0.55rem;
			li {
				display: flex;
				align-items: center;
				gap: 0.55rem;
				font-size: 0.88rem;
				color: var(--text);
				svg {
					width: 16px;
					height: 16px;
					flex: none;
					color: var(--gold);
				}
			}
		}
	}
	.card-split {
		bottom: 20%;
		right: clamp(7rem, 16vw, 14rem);
		width: 220px;
		animation: floaty 8.5s ease-in-out infinite reverse;
		.cap {
			font-size: 0.72rem;
			letter-spacing: 0.5px;
			color: var(--text-muted);
		}
		.flow {
			display: flex;
			align-items: center;
			gap: 0.6rem;
			margin: 0.5rem 0 0.4rem;
		}
		.amt {
			font-family: var(--font-display);
			font-size: 1.45rem;
			font-weight: 600;
			font-variant-numeric: tabular-nums;
		}
		.in {
			color: var(--text-muted);
		}
		.out {
			color: var(--gold);
		}
		.arrow {
			width: 22px;
			height: 22px;
			color: var(--gold);
		}
		small {
			font-size: 0.76rem;
			color: var(--text-muted);
		}
	}
	@keyframes floaty {
		0%,
		100% {
			translate: 0 0;
		}
		50% {
			translate: 0 -12px;
		}
	}
	/* ── Scroll cue ──────────────────────────────────── */
	.cue {
		position: absolute;
		bottom: 1.5rem;
		left: 50%;
		transform: translateX(-50%);
		z-index: 3;
		width: 26px;
		height: 42px;
		border: 2px solid var(--text-muted);
		border-radius: 999px;
		display: flex;
		justify-content: center;
		span {
			width: 4px;
			height: 8px;
			margin-top: 7px;
			background: var(--gold);
			border-radius: 2px;
			animation: cue 1.6s ease-in-out infinite;
		}
	}
	@keyframes cue {
		0%,
		100% {
			transform: translateY(0);
			opacity: 1;
		}
		50% {
			transform: translateY(10px);
			opacity: 0.3;
		}
	}

	/* ── Responsive ──────────────────────────────────── */
	@media (max-width: 1100px) {
		.card-split {
			display: none;
		}
		.card-perks {
			top: 9%;
			right: clamp(1rem, 4vw, 3rem);
		}
	}
	@media (max-width: 880px) {
		.float {
			display: none;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.dot,
		.cue span,
		.card-perks,
		.card-split {
			animation: none;
		}
	}
</style>
