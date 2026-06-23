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
