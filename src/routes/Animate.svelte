<script lang="ts">
	import { onDestroy, onMount } from 'svelte';

	let inView = $state(false);
	let element: HTMLDivElement;
	let {
		variant = 'fade',
		duration = 1,
		delay = 0,
		children
	}: { variant?: string; duration?: number; delay?: number; children?: any } = $props();
	let observer: IntersectionObserver;

	onMount(() => {
		observer = new IntersectionObserver(([entry]) => {
			inView = entry.isIntersecting;
		});

		if (element) observer.observe(element);
	});

	onDestroy(() => {
		if (element) observer?.unobserve(element);
	});
</script>

<div
	bind:this={element}
	style="--duration: {duration}s; --delay: {delay}s; height: 100%; width: 100%;"
>
	<div
		style="height: 100%;"
		class={inView ? `enter-${variant}` : `exit-${variant}`}
		class:enter-animation={inView}
		class:exit-animation={!inView}
	>
		{@render children?.()}
	</div>
</div>

<style>
	.enter-animation {
		opacity: 1;
		transition-duration: var(--duration);
		transition-delay: var(--delay);
		transform: scale(1) translateX(0) translateY(0);
	}
	.exit-animation {
		opacity: 0;
		transition-duration: 0.5;
		transition-delay: 0.2s;
		pointer-events: none;
	}
	.exit-top {
		transform: translateY(-200px);
	}
	.exit-bottom {
		transform: translateY(100px);
	}
	.exit-left {
		transform: translateX(-200px);
	}
	.exit-right {
		transform: translateX(200px);
	}
	.exit-scale {
		transform: scale(0);
	}
</style>
