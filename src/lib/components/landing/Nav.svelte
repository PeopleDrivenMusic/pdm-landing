<script lang="ts">
	import { onMount } from 'svelte';
	import AudienceToggle from '$lib/components/AudienceToggle.svelte';
	import { getLenis } from '$lib/motion/smoothScroll';

	let scrolled = $state(false);
	let menuOpen = $state(false);

	const links = [
		{ href: '#unlock', label: 'Benefits' },
		{ href: '#how', label: 'How it works' },
		{ href: '#faq', label: 'FAQ' }
	];

	function nav(e: MouseEvent, href: string) {
		const target = document.querySelector(href);
		if (!target) return;
		e.preventDefault();
		menuOpen = false;
		const lenis = getLenis();
		if (lenis) lenis.scrollTo(target as HTMLElement, { offset: -80 });
		else target.scrollIntoView({ behavior: 'smooth' });
	}

	onMount(() => {
		let ticking = false;
		const onScroll = () => {
			if (ticking) return;
			ticking = true;
			requestAnimationFrame(() => {
				scrolled = window.scrollY > 40;
				ticking = false;
			});
		};
		const onKey = (e: KeyboardEvent) => {
			if (e.key === 'Escape') menuOpen = false;
		};
		window.addEventListener('scroll', onScroll, { passive: true });
		window.addEventListener('keydown', onKey);
		onScroll();
		return () => {
			window.removeEventListener('scroll', onScroll);
			window.removeEventListener('keydown', onKey);
		};
	});
</script>

<header class="nav" class:scrolled>
	<a class="brand" href="#top" onclick={(e) => nav(e, '#top')}>PDM</a>

	<nav class="links" aria-label="Primary">
		{#each links as link (link.href)}
			<a href={link.href} onclick={(e) => nav(e, link.href)}>{link.label}</a>
		{/each}
	</nav>

	<div class="right">
		<div class="toggle-wrap"><AudienceToggle size="sm" /></div>
		<a class="cta" href="#waitlist" onclick={(e) => nav(e, '#waitlist')}>Join the waitlist</a>
		<button
			class="burger"
			aria-label="Menu"
			aria-expanded={menuOpen}
			aria-controls="mobile-sheet"
			onclick={() => (menuOpen = !menuOpen)}
		>
			<span></span><span></span><span></span>
		</button>
	</div>
</header>

{#if menuOpen}
	<div id="mobile-sheet" class="sheet">
		<nav aria-label="Mobile">
			{#each links as link (link.href)}
				<a href={link.href} onclick={(e) => nav(e, link.href)}>{link.label}</a>
			{/each}
		</nav>
		<AudienceToggle />
		<a class="cta" href="#waitlist" onclick={(e) => nav(e, '#waitlist')}>Join the waitlist</a>
	</div>
{/if}

<style lang="scss">
	.nav {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: var(--z-nav);
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1.5rem;
		padding: 1rem clamp(1rem, 4vw, 2.5rem);
		transition:
			background var(--dur-base) var(--ease-out),
			border-color var(--dur-base) var(--ease-out);
		border-bottom: 1px solid transparent;
		&.scrolled {
			background: rgba(10, 10, 11, 0.7);
			backdrop-filter: blur(12px);
			border-bottom-color: var(--line);
		}
	}
	.brand {
		font-family: var(--font-display);
		font-weight: 600;
		font-size: 1.5rem;
		letter-spacing: 1px;
		color: var(--gold);
	}
	.links {
		display: flex;
		gap: 1.75rem;
		a {
			color: var(--text-muted);
			font-size: 0.95rem;
			transition: color var(--dur-base) var(--ease-out);
			&:hover {
				color: var(--text);
			}
		}
	}
	.right {
		display: flex;
		align-items: center;
		gap: 1rem;
	}
	.cta {
		background: var(--gold);
		color: #1a1a1a;
		font-weight: 700;
		font-size: 0.9rem;
		padding: 0.6rem 1.1rem;
		min-height: 44px;
		display: inline-flex;
		align-items: center;
		border-radius: 999px;
		transition: filter var(--dur-base) var(--ease-out);
		&:hover {
			filter: brightness(1.07);
		}
	}
	.burger {
		display: none;
		flex-direction: column;
		gap: 5px;
		width: 44px;
		height: 44px;
		align-items: center;
		justify-content: center;
		background: transparent;
		border: 0;
		cursor: pointer;
		span {
			width: 22px;
			height: 2px;
			background: var(--text);
			border-radius: 2px;
		}
	}
	.sheet {
		position: fixed;
		inset: 64px 0 0;
		z-index: var(--z-nav);
		background: rgba(10, 10, 11, 0.97);
		backdrop-filter: blur(16px);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 1.75rem;
		nav {
			display: flex;
			flex-direction: column;
			align-items: center;
			gap: 1.5rem;
			a {
				font-family: var(--font-display);
				font-size: 1.6rem;
				color: var(--text);
			}
		}
		.cta {
			font-size: 1rem;
			padding: 0.8rem 1.5rem;
		}
	}
	@media (max-width: 768px) {
		.links,
		.toggle-wrap {
			display: none;
		}
		.nav .cta {
			display: none;
		}
		.burger {
			display: flex;
		}
	}
</style>
