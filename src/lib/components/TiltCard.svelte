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
