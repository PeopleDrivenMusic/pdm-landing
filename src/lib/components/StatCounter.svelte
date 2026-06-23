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
