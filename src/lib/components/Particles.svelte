<script lang="ts">
	import { onMount } from 'svelte';
	import { prefersReducedMotion } from '$lib/motion/prefersReducedMotion';

	let { count = 46, color = '255, 216, 119' }: { count?: number; color?: string } = $props();
	let canvas: HTMLCanvasElement;

	type P = {
		x: number; // normalized 0..1
		y: number;
		r: number;
		vy: number; // upward drift
		drift: number; // horizontal sway amplitude
		phase: number;
		tw: number; // twinkle speed
		base: number; // base opacity
	};

	const rand = (a: number, b: number) => a + Math.random() * (b - a);

	onMount(() => {
		const ctx = canvas.getContext('2d');
		if (!ctx) return;
		const reduce = prefersReducedMotion();
		let raf = 0;
		let w = 0,
			h = 0,
			dpr = 1;

		const make = (): P => ({
			x: Math.random(),
			y: Math.random(),
			r: rand(0.6, 2.2),
			vy: rand(0.006, 0.022),
			drift: rand(0.2, 0.9),
			phase: Math.random() * Math.PI * 2,
			tw: rand(0.4, 1.1),
			base: rand(0.12, 0.55)
		});

		let parts: P[] = Array.from({ length: count }, make);

		const resize = () => {
			dpr = Math.min(window.devicePixelRatio || 1, 2);
			w = canvas.clientWidth;
			h = canvas.clientHeight;
			canvas.width = w * dpr;
			canvas.height = h * dpr;
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
		};

		let last = performance.now();
		const draw = (t: number) => {
			const dt = Math.min((t - last) / 1000, 0.05);
			last = t;
			ctx.clearRect(0, 0, w, h);
			for (const p of parts) {
				if (!reduce) {
					p.y -= p.vy * dt;
					p.phase += p.tw * dt;
					if (p.y < -0.02) {
						p.y = 1.02;
						p.x = Math.random();
					}
				}
				const sway = Math.sin(p.phase) * p.drift * 12;
				const px = p.x * w + sway;
				const py = p.y * h;
				const op = reduce ? p.base * 0.6 : p.base * (0.55 + 0.45 * Math.sin(p.phase * 1.3));
				ctx.beginPath();
				ctx.arc(px, py, p.r, 0, Math.PI * 2);
				ctx.fillStyle = `rgba(${color}, ${op})`;
				ctx.fill();
			}
			if (!reduce) raf = requestAnimationFrame(draw);
		};

		resize();
		window.addEventListener('resize', resize);
		if (!reduce) {
			raf = requestAnimationFrame(draw);
		} else {
			last = performance.now();
			draw(last);
		}

		return () => {
			cancelAnimationFrame(raf);
			window.removeEventListener('resize', resize);
		};
	});
</script>

<canvas bind:this={canvas} style="width:100%;height:100%;display:block" aria-hidden="true"></canvas>
