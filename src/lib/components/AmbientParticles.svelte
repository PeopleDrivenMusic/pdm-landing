<script lang="ts">
	import { onMount } from 'svelte';
	import { prefersReducedMotion } from '$lib/motion/prefersReducedMotion';

	let {
		/** Number of glowing motes. Scaled down a touch on small screens. */
		count = 120,
		/** `fixed` = full-viewport ambient layer behind the whole page.
		 *  `fill`  = absolutely fills the nearest positioned parent (e.g. hero). */
		variant = 'fixed',
		/** Overall brightness multiplier (0–1+). */
		intensity = 1,
		/** Drift/twinkle speed multiplier. */
		speed = 1
	}: {
		count?: number;
		variant?: 'fixed' | 'fill';
		intensity?: number;
		speed?: number;
	} = $props();

	let canvas: HTMLCanvasElement;

	const rand = (a: number, b: number) => a + Math.random() * (b - a);

	type Mote = {
		x: number; // normalized 0..1
		y: number;
		r: number; // glow radius in px (half sprite size)
		vy: number; // upward drift (normalized / s)
		drift: number; // horizontal sway amplitude (px)
		phase: number;
		tw: number; // twinkle speed
		base: number; // base opacity
		sp: number; // sprite variant index
		flick: number; // fast flicker speed (ember shimmer)
	};

	onMount(() => {
		const ctx = canvas.getContext('2d');
		if (!ctx) return;
		const reduce = prefersReducedMotion();

		// Pre-render glowing circle sprites: a crisp hot core wrapped in a soft warm
		// halo — round embers, no flare. A few colour temperatures (gold, ember-amber,
		// white-hot) keep the field from looking uniform & synthetic.
		const SPRITE = 128;
		const C = SPRITE / 2;

		const buildSprite = (halo: string, mid: string): HTMLCanvasElement => {
			const s = document.createElement('canvas');
			s.width = s.height = SPRITE;
			const x = s.getContext('2d')!;

			// Soft outer halo.
			const g = x.createRadialGradient(C, C, 0, C, C, C);
			g.addColorStop(0, mid);
			g.addColorStop(0.22, mid);
			g.addColorStop(0.55, halo);
			g.addColorStop(1, 'rgba(255, 180, 70, 0)');
			x.fillStyle = g;
			x.fillRect(0, 0, SPRITE, SPRITE);

			// Crisp white-hot core.
			x.globalCompositeOperation = 'lighter';
			const cg = x.createRadialGradient(C, C, 0, C, C, SPRITE * 0.11);
			cg.addColorStop(0, 'rgba(255,255,255,1)');
			cg.addColorStop(0.55, 'rgba(255,248,224,0.92)');
			cg.addColorStop(1, 'rgba(255,240,200,0)');
			x.fillStyle = cg;
			x.fillRect(0, 0, SPRITE, SPRITE);

			return s;
		};

		const sprites = [
			// gold — the common dust
			buildSprite('rgba(255,205,110,0.35)', 'rgba(255,228,160,0.85)'),
			// ember amber — warmer, a touch redder
			buildSprite('rgba(255,150,60,0.32)', 'rgba(255,196,120,0.8)'),
			// white-hot — the headline embers
			buildSprite('rgba(255,215,130,0.4)', 'rgba(255,244,210,0.95)')
		];

		let w = 0,
			h = 0,
			dpr = 1;

		// Size distribution: lots of fine sparks, a few bright headline embers
		// (pow biases small). Bigger motes get the flared white-hot sprite.
		const make = (): Mote => {
			const k = Math.pow(Math.random(), 2.2);
			const big = k > 0.62;
			return {
				x: Math.random(),
				y: Math.random(),
				r: 4 + k * 20,
				vy: rand(0.004, 0.02),
				drift: rand(6, 26),
				phase: Math.random() * Math.PI * 2,
				tw: rand(0.3, 0.9),
				base: 0.3 + (1 - k) * 0.55,
				// Big ones flare (sprite 2); rest split between gold & amber.
				sp: big ? 2 : Math.random() < 0.7 ? 0 : 1,
				flick: rand(6, 13)
			};
		};

		let parts: Mote[] = [];

		const build = () => {
			const n = w < 640 ? Math.round(count * 0.55) : count;
			parts = Array.from({ length: n }, make);
		};

		const resize = () => {
			dpr = Math.min(window.devicePixelRatio || 1, 2);
			w = canvas.clientWidth;
			h = canvas.clientHeight;
			canvas.width = w * dpr;
			canvas.height = h * dpr;
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
			if (!parts.length) build();
		};

		// Pointer reaction: a gentle parallax (bigger motes lead) plus a soft local
		// push so dust eases away from the cursor. Eased so it never feels twitchy.
		let mx = -1,
			my = -1, // current cursor (px in canvas space), -1 = absent
			tmx = -1,
			tmy = -1; // target
		const onMove = (e: PointerEvent) => {
			const rect = canvas.getBoundingClientRect();
			tmx = e.clientX - rect.left;
			tmy = e.clientY - rect.top;
		};
		const onLeave = () => {
			tmx = -1;
			tmy = -1;
		};
		const PUSH_R = 130; // px radius of the cursor's influence
		const PUSH = 26; // px max displacement at the centre

		let raf = 0;
		let last = performance.now();
		const draw = (t: number) => {
			const dt = Math.min((t - last) / 1000, 0.05) * speed;
			last = t;
			// Ease the cursor toward its target (keep -1 sentinel when absent).
			if (tmx < 0) {
				mx = my = -1;
			} else {
				mx = mx < 0 ? tmx : mx + (tmx - mx) * 0.12;
				my = my < 0 ? tmy : my + (tmy - my) * 0.12;
			}
			const hasMouse = mx >= 0;

			ctx.clearRect(0, 0, w, h);
			ctx.globalCompositeOperation = 'lighter';
			for (const p of parts) {
				if (!reduce) {
					p.y -= p.vy * dt;
					p.phase += p.tw * dt;
					if (p.y < -0.04) {
						p.y = 1.04;
						p.x = Math.random();
					}
				}
				const sway = Math.sin(p.phase) * p.drift;
				// Depth from glow size: larger = "closer", so it parallaxes more.
				const depth = (p.r - 4) / 20;
				let px = p.x * w + sway;
				let py = p.y * h;
				if (hasMouse) {
					// Parallax: nudge toward the cursor side, scaled by depth.
					px += ((mx - w / 2) / w) * (4 + depth * 22);
					py += ((my - h / 2) / h) * (4 + depth * 22);
					// Local push: shove dust out of the cursor's bubble.
					const dx = px - mx;
					const dy = py - my;
					const dist = Math.hypot(dx, dy);
					if (dist < PUSH_R && dist > 0.01) {
						const f = (1 - dist / PUSH_R) * PUSH;
						px += (dx / dist) * f;
						py += (dy / dist) * f;
					}
				}
				// Twinkle = slow breath; flicker = fast ember shimmer layered on top.
				const twinkle = reduce
					? 0.8
					: (0.6 + 0.4 * Math.sin(p.phase * 1.4)) *
						(0.82 + 0.18 * Math.sin(p.phase * p.flick + p.x * 30));
				const op = Math.min(1, p.base * twinkle * intensity);
				const s = p.r;
				ctx.globalAlpha = op;
				ctx.drawImage(sprites[p.sp], px - s, py - s, s * 2, s * 2);
			}
			ctx.globalAlpha = 1;
			ctx.globalCompositeOperation = 'source-over';
			if (!reduce) raf = requestAnimationFrame(draw);
		};

		resize();
		window.addEventListener('resize', resize);
		const fine = window.matchMedia('(pointer: fine)').matches;
		if (!reduce) {
			last = performance.now();
			if (fine) {
				window.addEventListener('pointermove', onMove, { passive: true });
				window.addEventListener('pointerleave', onLeave);
			}
			raf = requestAnimationFrame(draw);
		} else {
			draw(performance.now());
		}

		return () => {
			cancelAnimationFrame(raf);
			window.removeEventListener('resize', resize);
			window.removeEventListener('pointermove', onMove);
			window.removeEventListener('pointerleave', onLeave);
		};
	});
</script>

<canvas bind:this={canvas} class={variant} aria-hidden="true"></canvas>

<style>
	canvas {
		display: block;
		pointer-events: none;
	}
	.fill {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
	}
	.fixed {
		position: fixed;
		inset: 0;
		width: 100vw;
		height: 100vh;
		z-index: -1;
	}
</style>
