<script lang="ts">
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { gsap } from 'gsap';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';
	import KineticHeading from '$lib/components/KineticHeading.svelte';
	import Soundwave from '$lib/components/Soundwave.svelte';
	import { audience } from '$lib/stores/audience.svelte';
	import { hero } from '$lib/content';
	import { prefersReducedMotion } from '$lib/motion/prefersReducedMotion';
	import { getLenis } from '$lib/motion/smoothScroll';

	let bg: HTMLDivElement;

	function scrollTo(e: MouseEvent, href: string) {
		const target = document.querySelector(href);
		if (!target) return;
		e.preventDefault();
		const lenis = getLenis();
		if (lenis) lenis.scrollTo(target as HTMLElement, { offset: -80 });
		else target.scrollIntoView({ behavior: 'smooth' });
	}

	onMount(() => {
		if (prefersReducedMotion() || window.matchMedia('(max-width: 768px)').matches) return;
		gsap.registerPlugin(ScrollTrigger);
		const tween = gsap.to(bg, {
			yPercent: 18,
			ease: 'none',
			scrollTrigger: { trigger: bg, start: 'top top', end: 'bottom top', scrub: true }
		});
		return () => {
			tween.scrollTrigger?.kill();
			tween.kill();
		};
	});
</script>

<section id="top" class="hero">
	<div class="bg" bind:this={bg}></div>
	<div class="overlay"></div>
	<div class="glow" aria-hidden="true"></div>

	<div class="content">
		{#key audience.value}
			<div class="swap" in:fade={{ duration: 320 }}>
				<p class="kicker">{hero[audience.value].kicker}</p>
				<KineticHeading lines={hero[audience.value].heading} />
				<p class="sub">{hero[audience.value].sub}</p>
			</div>
		{/key}

		<div class="ctas">
			<a class="primary" href="#waitlist" onclick={(e) => scrollTo(e, '#waitlist')}
				>Join the waitlist</a
			>
			<a class="ghost" href="#how" onclick={(e) => scrollTo(e, '#how')}>See how it works</a>
		</div>
	</div>

	<div class="wave"><Soundwave height={130} /></div>
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
		padding: clamp(5rem, 12vh, 9rem) clamp(1.25rem, 5vw, 4rem) 0;
	}
	.bg {
		position: absolute;
		inset: -10% 0 0;
		height: 120%;
		background:
			url('/concert-bg.webp') center / cover no-repeat;
		z-index: 0;
		will-change: transform;
	}
	.overlay {
		position: absolute;
		inset: 0;
		background: linear-gradient(180deg, rgba(10, 10, 11, 0.35) 0%, rgba(10, 10, 11, 0.92) 92%);
		z-index: 1;
	}
	.glow {
		position: absolute;
		top: 38%;
		left: 14%;
		width: min(620px, 70vw);
		height: 360px;
		background: radial-gradient(closest-side, var(--glow), transparent 70%);
		filter: blur(20px);
		z-index: 1;
		pointer-events: none;
	}
	.content {
		position: relative;
		z-index: 2;
		max-width: var(--maxw);
		width: 100%;
		margin: 0 auto;
	}
	.kicker {
		text-transform: uppercase;
		letter-spacing: 4px;
		font-size: 0.8rem;
		color: var(--gold);
		margin-bottom: 1rem;
	}
	.sub {
		color: var(--text-muted);
		font-size: clamp(1.05rem, 2vw, 1.3rem);
		max-width: 60ch;
		margin-top: 1.5rem;
	}
	.ctas {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		margin-top: 2.5rem;
	}
	.primary,
	.ghost {
		display: inline-flex;
		align-items: center;
		min-height: 52px;
		padding: 0 1.6rem;
		border-radius: 999px;
		font-weight: 700;
		font-size: 1rem;
		transition:
			filter var(--dur-base) var(--ease-out),
			background var(--dur-base) var(--ease-out),
			border-color var(--dur-base) var(--ease-out);
	}
	.primary {
		background: var(--gold);
		color: #1a1a1a;
		box-shadow: 0 10px 40px -10px var(--glow);
		&:hover {
			filter: brightness(1.07);
		}
	}
	.ghost {
		border: 1px solid var(--line);
		color: var(--text);
		font-weight: 500;
		&:hover {
			border-color: var(--gold);
			background: rgba(255, 216, 119, 0.06);
		}
	}
	.wave {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 1;
		opacity: 0.55;
		pointer-events: none;
		mask-image: linear-gradient(90deg, transparent, #000 20%, #000 80%, transparent);
	}
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
	@media (prefers-reduced-motion: reduce) {
		.cue span {
			animation: none;
		}
	}
</style>
