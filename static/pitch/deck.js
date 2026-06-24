/* PDM investor deck — slide navigation + golden ember backdrop.
   Shared by en.html and ru.html. No dependencies. */
(() => {
	const deck = document.querySelector('.deck');
	const slides = Array.from(document.querySelectorAll('.slide'));
	const counter = document.querySelector('.counter');
	const progress = document.querySelector('.progress');
	if (!deck || !slides.length) return;

	let current = 0;

	const setCounter = () => {
		if (counter) counter.innerHTML = `<b>${current + 1}</b> / ${slides.length}`;
		if (progress) progress.style.width = `${((current + 1) / slides.length) * 100}%`;
	};

	const go = (i) => {
		current = Math.max(0, Math.min(slides.length - 1, i));
		slides[current].scrollIntoView({ behavior: 'smooth', block: 'start' });
		setCounter();
	};

	// Keep the counter in sync when the user free-scrolls.
	let ticking = false;
	deck.addEventListener(
		'scroll',
		() => {
			if (ticking) return;
			ticking = true;
			requestAnimationFrame(() => {
				const mid = deck.scrollTop + deck.clientHeight / 2;
				let idx = 0;
				slides.forEach((s, i) => {
					if (s.offsetTop <= mid) idx = i;
				});
				current = idx;
				setCounter();
				ticking = false;
			});
		},
		{ passive: true }
	);

	window.addEventListener('keydown', (e) => {
		switch (e.key) {
			case 'ArrowRight':
			case 'ArrowDown':
			case 'PageDown':
			case ' ':
				e.preventDefault();
				go(current + 1);
				break;
			case 'ArrowLeft':
			case 'ArrowUp':
			case 'PageUp':
				e.preventDefault();
				go(current - 1);
				break;
			case 'Home':
				e.preventDefault();
				go(0);
				break;
			case 'End':
				e.preventDefault();
				go(slides.length - 1);
				break;
		}
	});

	setCounter();

	/* ---- Golden ember backdrop (adapted from AmbientParticles.svelte) ------ */
	const canvas = document.getElementById('embers');
	const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	if (!canvas || reduce) return;
	const ctx = canvas.getContext('2d');
	if (!ctx) return;

	const SPRITE = 128;
	const C = SPRITE / 2;
	const buildSprite = (halo, mid) => {
		const s = document.createElement('canvas');
		s.width = s.height = SPRITE;
		const x = s.getContext('2d');
		const g = x.createRadialGradient(C, C, 0, C, C, C);
		g.addColorStop(0, mid);
		g.addColorStop(0.22, mid);
		g.addColorStop(0.55, halo);
		g.addColorStop(1, 'rgba(255,180,70,0)');
		x.fillStyle = g;
		x.fillRect(0, 0, SPRITE, SPRITE);
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
		buildSprite('rgba(255,205,110,0.35)', 'rgba(255,228,160,0.85)'),
		buildSprite('rgba(255,150,60,0.32)', 'rgba(255,196,120,0.8)'),
		buildSprite('rgba(255,215,130,0.4)', 'rgba(255,244,210,0.95)')
	];

	const rand = (a, b) => a + Math.random() * (b - a);
	let w = 0,
		h = 0,
		dpr = 1;
	const COUNT = 16;
	let parts = [];
	const make = () => {
		const k = Math.pow(Math.random(), 2.2);
		const big = k > 0.62;
		return {
			x: Math.random(),
			y: Math.random(),
			r: 4 + k * 18,
			vy: rand(0.004, 0.018),
			drift: rand(6, 24),
			phase: Math.random() * Math.PI * 2,
			tw: rand(0.3, 0.9),
			base: 0.28 + (1 - k) * 0.5,
			sp: big ? 2 : Math.random() < 0.7 ? 0 : 1,
			flick: rand(6, 13)
		};
	};

	const resize = () => {
		dpr = Math.min(window.devicePixelRatio || 1, 2);
		w = window.innerWidth;
		h = window.innerHeight;
		canvas.width = w * dpr;
		canvas.height = h * dpr;
		canvas.style.width = w + 'px';
		canvas.style.height = h + 'px';
		ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
		if (!parts.length) parts = Array.from({ length: COUNT }, make);
	};

	let last = performance.now();
	const draw = (t) => {
		const dt = Math.min((t - last) / 1000, 0.05);
		last = t;
		ctx.clearRect(0, 0, w, h);
		ctx.globalCompositeOperation = 'lighter';
		for (const p of parts) {
			p.y -= p.vy * dt;
			p.phase += p.tw * dt;
			if (p.y < -0.05) {
				p.y = 1.05;
				p.x = Math.random();
			}
			const sway = Math.sin(p.phase) * p.drift;
			const px = p.x * w + sway;
			const py = p.y * h;
			const twinkle =
				(0.6 + 0.4 * Math.sin(p.phase * 1.4)) *
				(0.82 + 0.18 * Math.sin(p.phase * p.flick + p.x * 30));
			ctx.globalAlpha = Math.min(1, p.base * twinkle * 0.85);
			const s = p.r;
			ctx.drawImage(sprites[p.sp], px - s, py - s, s * 2, s * 2);
		}
		ctx.globalAlpha = 1;
		ctx.globalCompositeOperation = 'source-over';
		requestAnimationFrame(draw);
	};

	resize();
	window.addEventListener('resize', resize);
	requestAnimationFrame(draw);
})();
