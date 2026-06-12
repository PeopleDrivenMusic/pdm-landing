<script lang="ts">
	import { onMount } from 'svelte';
	import Button from './Button.svelte';

	let canvas: HTMLCanvasElement;

	type Bar = {
		base: number;
		phase: number;
		peak: number;
		speed: number;
	};

	type SmokeParticle = {
		alpha: number;
		driftPhase: number;
		driftSpeed: number;
		radius: number;
		rotation: number;
		rotationVelocity: number;
		scaleX: number;
		scaleY: number;
		x: number;
		xVelocity: number;
		y: number;
		yVelocity: number;
	};

	type WaveformData = {
		bars?: number;
		duration: number;
		frames?: number[];
		fps: number;
		values?: number[];
	};

	function joinWhitelist() {
		document.getElementById('join')?.scrollIntoView({ behavior: 'smooth' });
	}

	onMount(() => {
		const rawContext = canvas.getContext('2d');
		if (!rawContext) return;

		const context: CanvasRenderingContext2D = rawContext;
		const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
		const barCount = reducedMotion.matches ? 46 : 84;
		const particleCount = reducedMotion.matches ? 12 : 30;
		const maxVelocity = reducedMotion.matches ? 0.26 : 1.22;
		let audioWaveform: WaveformData | null = null;
		const bars: Bar[] = Array.from({ length: barCount }, (_, index) => {
			const progress = index / (barCount - 1);
			const centerWeight = Math.sin(progress * Math.PI);
			const verseShape =
				0.28 +
				Math.exp(-Math.pow((progress - 0.18) / 0.09, 2)) * 0.34 +
				Math.exp(-Math.pow((progress - 0.37) / 0.075, 2)) * 0.68 +
				Math.exp(-Math.pow((progress - 0.58) / 0.105, 2)) * 0.82 +
				Math.exp(-Math.pow((progress - 0.78) / 0.08, 2)) * 0.46;

			return {
				base: verseShape * (0.54 + centerWeight * 0.62),
				phase: Math.random() * Math.PI * 2,
				peak: Math.random(),
				speed: 0.72 + Math.random() * 1.35
			};
		});

		let width = 0;
		let height = 0;
		let animation = 0;
		let lastDraw = 0;
		let renderedFrames = 0;
		const startedAt = performance.now();
		const frameInterval = reducedMotion.matches ? 160 : 34;
		const smokeSprite = document.createElement('canvas');
		const smokeSpriteContext = smokeSprite.getContext('2d');
		const smokeParticles: SmokeParticle[] = [];

		createSmokeSprite();

		void fetch('/hero-waveform.json')
			.then((response) => (response.ok ? response.json() : null))
			.then((data: WaveformData | null) => {
				if (((data?.frames?.length && data.bars) || data?.values?.length) && data.fps > 0 && data.duration > 0) {
					audioWaveform = data;
				}
			})
			.catch(() => {
				audioWaveform = null;
			});

		function resize() {
			const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
			width = canvas.clientWidth || window.innerWidth;
			height = canvas.clientHeight || window.innerHeight;
			canvas.width = Math.floor(width * pixelRatio);
			canvas.height = Math.floor(height * pixelRatio);
			context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
			context.imageSmoothingEnabled = false;
			resetSmokeParticles();
		}

		function randomBetween(min: number, max: number) {
			return Math.random() * (max - min) + min;
		}

		function createSmokeSprite() {
			if (!smokeSpriteContext) return;

			const size = 256;
			smokeSprite.width = size;
			smokeSprite.height = size;
			smokeSpriteContext.clearRect(0, 0, size, size);

			const puffs = [
				{ x: 0.5, y: 0.5, radius: 0.42, alpha: 0.4 },
				{ x: 0.38, y: 0.44, radius: 0.32, alpha: 0.26 },
				{ x: 0.63, y: 0.43, radius: 0.34, alpha: 0.28 },
				{ x: 0.48, y: 0.31, radius: 0.28, alpha: 0.18 },
				{ x: 0.55, y: 0.66, radius: 0.33, alpha: 0.2 },
				{ x: 0.29, y: 0.62, radius: 0.24, alpha: 0.14 },
				{ x: 0.74, y: 0.57, radius: 0.25, alpha: 0.14 }
			];

			for (const puff of puffs) {
				const x = puff.x * size;
				const y = puff.y * size;
				const radius = puff.radius * size;
				const gradient = smokeSpriteContext.createRadialGradient(x, y, 0, x, y, radius);
				gradient.addColorStop(0, `rgba(210, 210, 198, ${puff.alpha})`);
				gradient.addColorStop(0.45, `rgba(128, 125, 112, ${puff.alpha * 0.4})`);
				gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
				smokeSpriteContext.fillStyle = gradient;
				smokeSpriteContext.fillRect(0, 0, size, size);
			}
		}

		function resetSmokeParticles() {
			smokeParticles.length = 0;

			for (let index = 0; index < particleCount; index += 1) {
				const centerBias = Math.sin((index / Math.max(1, particleCount - 1)) * Math.PI);

				smokeParticles.push({
					alpha: randomBetween(0.12, 0.27),
					driftPhase: randomBetween(0, Math.PI * 2),
					driftSpeed: randomBetween(0.42, 1.35),
					radius: randomBetween(width * 0.12, width * 0.22) * (0.72 + centerBias * 0.28),
					rotation: randomBetween(0, Math.PI * 2),
					rotationVelocity: randomBetween(-0.0042, 0.0042),
					scaleX: randomBetween(1.22, 2.25),
					scaleY: randomBetween(0.58, 0.86),
					x: randomBetween(-width * 0.04, width * 1.04),
					xVelocity: randomBetween(-maxVelocity, maxVelocity),
					y: randomBetween(height * 0.55, height * 0.88),
					yVelocity: randomBetween(-maxVelocity * 0.48, maxVelocity * 0.48)
				});
			}
		}

		function updateSmoke(time: number) {
			if (!smokeParticles.length) return;

			for (const particle of smokeParticles) {
				const seconds = time * 0.001;
				const gust =
					Math.sin(seconds * particle.driftSpeed + particle.driftPhase) * maxVelocity * 0.86 +
					Math.sin(seconds * (particle.driftSpeed * 0.37) + particle.driftPhase * 2.1) * maxVelocity * 0.52;
				const lift =
					Math.cos(seconds * (particle.driftSpeed * 0.74) + particle.driftPhase) * maxVelocity * 0.36 +
					Math.sin(seconds * (particle.driftSpeed * 1.9) + particle.driftPhase * 0.7) * maxVelocity * 0.2;

				particle.x += particle.xVelocity + gust;
				particle.y += particle.yVelocity + lift;
				particle.rotation += particle.rotationVelocity;
				particle.xVelocity += Math.sin(seconds * 0.53 + particle.driftPhase) * 0.006;
				particle.yVelocity += Math.cos(seconds * 0.41 + particle.driftPhase * 1.6) * 0.003;
				particle.xVelocity = Math.max(-maxVelocity, Math.min(maxVelocity, particle.xVelocity));
				particle.yVelocity = Math.max(-maxVelocity * 0.58, Math.min(maxVelocity * 0.58, particle.yVelocity));

				const horizontalPadding = particle.radius * particle.scaleX * 0.46;
				const verticalPadding = particle.radius * 0.42;
				const minX = -horizontalPadding;
				const maxX = width + horizontalPadding;
				const minY = height * 0.47;
				const maxY = height * 0.94 + verticalPadding;

				if (particle.x >= maxX) {
					particle.xVelocity = -Math.abs(particle.xVelocity);
					particle.x = maxX;
				} else if (particle.x <= minX) {
					particle.xVelocity = Math.abs(particle.xVelocity);
					particle.x = minX;
				}

				if (particle.y >= maxY) {
					particle.yVelocity = -Math.abs(particle.yVelocity);
					particle.y = maxY;
				} else if (particle.y <= minY) {
					particle.yVelocity = Math.abs(particle.yVelocity);
					particle.y = minY;
				}
			}
		}

		function drawSmoke(time: number, waveHeight: number) {
			if (!smokeSpriteContext) return;

			const pulse = 0.84 + Math.sin(time * 0.00042) * 0.12;

			context.save();
			context.globalCompositeOperation = 'screen';
			context.imageSmoothingEnabled = true;
			context.filter = `blur(${Math.max(8, waveHeight * 0.055)}px)`;

			for (const particle of smokeParticles) {
				const seconds = time * 0.001;
				const localPulse = 0.88 + Math.sin(seconds * particle.driftSpeed + particle.driftPhase) * 0.12;
				const radius = particle.radius * pulse * localPulse;
				const alpha = particle.alpha * (0.72 + Math.sin(seconds * particle.driftSpeed * 0.68 + particle.driftPhase) * 0.18 + localPulse * 0.22);

				context.save();
				context.translate(particle.x, particle.y);
				context.rotate(particle.rotation + Math.sin(seconds * 0.28 + particle.driftPhase) * 0.08);
				context.scale(particle.scaleX + Math.sin(seconds * 0.22 + particle.driftPhase) * 0.16, particle.scaleY);
				context.globalAlpha = alpha;
				context.drawImage(smokeSprite, -radius, -radius, radius * 2, radius * 2);
				context.restore();
			}

			context.restore();
		}

		function sampleAudioEnvelope(seconds: number) {
			if (!audioWaveform) return 0;

			const { duration, fps, values } = audioWaveform;
			if (!values?.length) return 0;

			const wrappedSeconds = ((seconds % duration) + duration) % duration;
			const exactIndex = wrappedSeconds * fps;
			const leftIndex = Math.floor(exactIndex) % values.length;
			const rightIndex = (leftIndex + 1) % values.length;
			const mix = exactIndex - Math.floor(exactIndex);
			const left = values[leftIndex] / 1000;
			const right = values[rightIndex] / 1000;

			return left + (right - left) * mix;
		}

		function sampleAudioFrame(seconds: number, progress: number) {
			if (!audioWaveform?.frames?.length || !audioWaveform.bars) return sampleAudioEnvelope(seconds + progress);

			const { bars: sourceBars, duration, fps, frames } = audioWaveform;
			const frameCount = Math.floor(frames.length / sourceBars);
			const wrappedSeconds = ((seconds % duration) + duration) % duration;
			const exactFrame = wrappedSeconds * fps;
			const frameA = Math.floor(exactFrame) % frameCount;
			const frameB = (frameA + 1) % frameCount;
			const frameMix = exactFrame - Math.floor(exactFrame);
			const exactBar = progress * (sourceBars - 1);
			const barA = Math.floor(exactBar);
			const barB = Math.min(sourceBars - 1, barA + 1);
			const barMix = exactBar - barA;

			function valueAt(frame: number, bar: number) {
				return frames[frame * sourceBars + bar] / 1000;
			}

			const top = valueAt(frameA, barA) + (valueAt(frameA, barB) - valueAt(frameA, barA)) * barMix;
			const bottom = valueAt(frameB, barA) + (valueAt(frameB, barB) - valueAt(frameB, barA)) * barMix;

			return top + (bottom - top) * frameMix;
		}

		function amplitude(bar: Bar, progress: number, time: number) {
			const seconds = time * 0.001;
			const centerLift = Math.sin(progress * Math.PI);

			if (audioWaveform) {
				const audioStartOffsetSeconds = 0.55;
				const visualPlaybackRate = 0.42;
				const elapsedSeconds = audioStartOffsetSeconds + (time - startedAt) * 0.001 * visualPlaybackRate;
				const drift = Math.sin(elapsedSeconds * 0.48 + bar.phase) * 0.018 + Math.sin(elapsedSeconds * 0.19 + bar.peak * 8) * 0.012;
				const shiftedProgress = Math.max(0, Math.min(1, progress + drift));
				const current =
					sampleAudioFrame(elapsedSeconds + bar.phase * 0.035, shiftedProgress) * 0.78 +
					sampleAudioFrame(elapsedSeconds + 0.72 + bar.peak * 0.28, progress) * 0.22;
				const previous = sampleAudioFrame(elapsedSeconds - 1 / audioWaveform.fps, shiftedProgress);
				const transient = Math.max(0, current - previous) * 0.7;
				const shaped = Math.pow(Math.min(1, current * 0.96 + transient), 0.82);

				return Math.min(1, Math.max(0.07, shaped * (0.9 + centerLift * 0.1)));
			}

			const kick = Math.pow(Math.max(0, Math.sin(seconds * Math.PI * 1.92 - progress * 3.2)), 5);
			const snare = Math.pow(Math.max(0, Math.sin(seconds * Math.PI * 0.96 + progress * 13)), 7);
			const vocal =
				Math.sin(seconds * 2.5 * bar.speed + bar.phase) * 0.16 +
				Math.sin(seconds * 5.8 + progress * 24 + bar.phase) * 0.1;
			const travelingPeak = Math.exp(-Math.pow((progress - ((seconds * 0.075 + bar.peak) % 1)) / 0.045, 2)) * 0.42;

			return Math.min(1, Math.max(0.08, bar.base * (0.56 + kick * 0.42 + snare * 0.24 + vocal + travelingPeak) * (0.62 + centerLift * 0.34)));
		}

		function currentPulse(time: number) {
			if (reducedMotion.matches) return 0.22;

			if (audioWaveform) {
				const audioStartOffsetSeconds = 0.55;
				const visualPlaybackRate = 0.42;
				const elapsedSeconds = audioStartOffsetSeconds + (time - startedAt) * 0.001 * visualPlaybackRate;
				const left = sampleAudioFrame(elapsedSeconds, 0.24);
				const midLeft = sampleAudioFrame(elapsedSeconds, 0.38);
				const center = sampleAudioFrame(elapsedSeconds, 0.5);
				const midRight = sampleAudioFrame(elapsedSeconds, 0.62);
				const right = sampleAudioFrame(elapsedSeconds, 0.76);
				const previousCenter = sampleAudioFrame(elapsedSeconds - 0.22, 0.5);
				const average = (left + midLeft * 1.1 + center * 1.55 + midRight * 1.1 + right) / 5.75;
				const transient = Math.max(0, center - previousCenter) * 2.2;

				return Math.max(0.06, Math.min(1, Math.pow(average, 0.68) * 0.72 + transient * 0.42));
			}

			return 0.28 + Math.sin(time * 0.002) * 0.12;
		}

		function drawBackground(centerY: number, waveWidth: number, waveHeight: number, time: number) {
			const pulse = currentPulse(time);
			const breathe = 0.18 + pulse * 0.82;
			const bleed = Math.max(96, width * 0.14);
			const sourceX = width * 1.18;
			const sourceY = -height * 0.1;
			const cornerX = width;
			const cornerY = 0;
			const targetX = width * (0.46 + pulse * 0.022);
			const targetY = centerY + waveHeight * (0.52 + pulse * 0.08);
			context.clearRect(0, 0, width, height);
			const base = context.createLinearGradient(0, 0, width, height);
			base.addColorStop(0, '#010101');
			base.addColorStop(0.34, '#070503');
			base.addColorStop(0.68, '#151008');
			base.addColorStop(1, '#241a0b');
			context.fillStyle = base;
			context.fillRect(0, 0, width, height);

			context.save();
			context.globalCompositeOperation = 'lighter';
			context.filter = `blur(${48 + breathe * 34}px)`;
			const beam = context.createLinearGradient(cornerX, cornerY, targetX - waveWidth * 0.82, targetY + waveHeight * 0.72);
			beam.addColorStop(0, `rgba(255, 223, 123, ${0.045 + breathe * 0.08})`);
			beam.addColorStop(0.48, `rgba(252, 211, 77, ${0.03 + breathe * 0.05})`);
			beam.addColorStop(0.86, `rgba(98, 70, 20, ${0.01 + breathe * 0.024})`);
			beam.addColorStop(1, 'rgba(0, 0, 0, 0)');
			context.fillStyle = beam;
			context.beginPath();
			context.moveTo(sourceX, sourceY);
			context.quadraticCurveTo(width * 0.92, height * 0.1, targetX - waveWidth * 1.02, targetY - waveHeight * 0.92);
			context.lineTo(targetX + waveWidth * 0.3, targetY + waveHeight * 1.58);
			context.quadraticCurveTo(width * 0.96, height * 0.42, sourceX + width * 0.12, sourceY + height * 0.26);
			context.closePath();
			context.fill();

			context.filter = `blur(${30 + breathe * 18}px)`;
			const core = context.createLinearGradient(cornerX, cornerY, targetX - waveWidth * 0.54, targetY + waveHeight * 0.72);
			core.addColorStop(0, `rgba(255, 241, 196, ${0.022 + breathe * 0.044})`);
			core.addColorStop(0.62, `rgba(255, 223, 123, ${0.012 + breathe * 0.026})`);
			core.addColorStop(1, 'rgba(0, 0, 0, 0)');
			context.fillStyle = core;
			context.beginPath();
			context.moveTo(sourceX, sourceY);
			context.quadraticCurveTo(width * 0.94, height * 0.15, targetX - waveWidth * 0.68, targetY - waveHeight * 0.32);
			context.lineTo(targetX + waveWidth * 0.12, targetY + waveHeight * 1.08);
			context.quadraticCurveTo(width * 0.95, height * 0.36, sourceX + width * 0.08, sourceY + height * 0.2);
			context.closePath();
			context.fill();

			context.filter = 'none';
			context.translate(targetX - waveWidth * 0.13, targetY + waveHeight * 0.28);
			context.rotate(0.4);
			context.scale(1.42, 0.5);
			const landingRadius = waveWidth * (0.54 + breathe * 0.24);
			const landing = context.createRadialGradient(0, 0, 0, 0, 0, landingRadius);
			landing.addColorStop(0, `rgba(255, 223, 123, ${0.032 + breathe * 0.135})`);
			landing.addColorStop(0.48, `rgba(252, 211, 77, ${0.018 + breathe * 0.07})`);
			landing.addColorStop(1, 'rgba(0, 0, 0, 0)');
			context.fillStyle = landing;
			context.fillRect(-width - bleed, -height - bleed, width * 2 + bleed * 2, height * 2 + bleed * 2);
			context.restore();

			const floor = context.createLinearGradient(0, centerY + waveHeight * 0.12, 0, centerY + waveHeight * 1.55);
			floor.addColorStop(0, 'rgba(0, 0, 0, 0)');
			floor.addColorStop(0.52, `rgba(255, 223, 123, ${0.006 + breathe * 0.04})`);
			floor.addColorStop(1, 'rgba(0, 0, 0, 0)');
			context.fillStyle = floor;
			context.fillRect(-bleed, centerY + waveHeight * 0.12, width + bleed * 2, waveHeight * 1.43);

			const sourceGlow = context.createRadialGradient(cornerX, cornerY, 0, cornerX, cornerY, width * (0.28 + breathe * 0.08));
			sourceGlow.addColorStop(0, `rgba(255, 239, 186, ${0.035 + breathe * 0.075})`);
			sourceGlow.addColorStop(0.58, `rgba(255, 223, 123, ${0.014 + breathe * 0.032})`);
			sourceGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
			context.fillStyle = sourceGlow;
			context.fillRect(0, 0, width, height);

			const sweep = context.createLinearGradient(cornerX, cornerY, targetX - waveWidth * 0.78, targetY + waveHeight * 0.74);
			sweep.addColorStop(0, 'rgba(0, 0, 0, 0)');
			sweep.addColorStop(0.58, `rgba(255, 223, 123, ${0.01 + breathe * 0.032})`);
			sweep.addColorStop(1, 'rgba(0, 0, 0, 0)');
			context.fillStyle = sweep;
			context.fillRect(0, 0, width, height);

			const upperCut = context.createLinearGradient(0, 0, 0, centerY + waveHeight * 0.42);
			upperCut.addColorStop(0, 'rgba(0, 0, 0, 0.3)');
			upperCut.addColorStop(0.64, 'rgba(0, 0, 0, 0.2)');
			upperCut.addColorStop(1, 'rgba(0, 0, 0, 0)');
			context.fillStyle = upperCut;
			context.fillRect(0, 0, width, centerY + waveHeight * 0.42);
		}

		function drawDot(x: number, y: number, size: number, alpha: number) {
			context.globalAlpha = alpha;
			context.fillRect(x - size / 2, y - size / 2, size, size);
		}

		function drawWaveform(centerY: number, time: number, waveWidth: number, waveHeight: number) {
			const left = (width - waveWidth) / 2;
			const step = waveWidth / (bars.length - 1);
			const dotSize = Math.max(2.3, Math.min(5.4, step * 0.42));
			const dotGap = dotSize * 1.55;
			const rawAmps = bars.map((bar, index) => amplitude(bar, index / (bars.length - 1), time));
			const minAmp = Math.min(...rawAmps);
			const maxAmp = Math.max(...rawAmps);
			const meanAmp = rawAmps.reduce((total, amp) => total + amp, 0) / rawAmps.length;
			const rangeAmp = maxAmp - minAmp;
			const sensitivity = Math.max(0.72, Math.min(1, (meanAmp - 0.12) / 0.42));

			context.save();
			context.globalCompositeOperation = 'lighter';
			context.fillStyle = '#ffdf7b';

			for (let index = 0; index < bars.length; index += 1) {
				const progress = index / (bars.length - 1);
				const x = left + index * step;
				const rawAmp = rawAmps[index];
				const localContrast = rangeAmp > 0.001 ? (rawAmp - minAmp) / rangeAmp : 0.5;
				const expanded = Math.pow(localContrast, 0.58);
				const locallySensitiveAmp = meanAmp * 0.24 + expanded * 0.76;
				const amp = Math.max(0.035, Math.min(0.96, rawAmp * (1 - sensitivity) + locallySensitiveAmp * sensitivity));
				const halfDots = Math.max(1, Math.round((amp * waveHeight) / dotGap));
				const edgeFade = Math.sin(progress * Math.PI);
				const highlight = 0.45 + Math.pow(amp, 1.8) * 0.55;

				for (let dot = -halfDots; dot <= halfDots; dot += 1) {
					const distance = Math.abs(dot) / Math.max(halfDots, 1);
					const y = centerY + dot * dotGap;
					const lowerSide = dot > 0 ? dot / Math.max(halfDots, 1) : 0;
					const rightCatch = Math.max(0, progress - 0.42) * 1.24;
					const reflection = Math.min(0.22, rightCatch * (0.05 + lowerSide * 0.18) * (1 - distance * 0.18));
					const alpha = (0.18 + highlight * 0.58) * (1 - distance * 0.42) * (0.42 + edgeFade * 0.58) + reflection;
					const size = (dot === 0 ? dotSize * 0.78 : dotSize * (0.72 + (1 - distance) * 0.34)) * (1 + reflection * 0.28);

					drawDot(x, y, size, alpha);
				}
			}

			const baseline = context.createLinearGradient(left, 0, left + waveWidth, 0);
			baseline.addColorStop(0, 'rgba(255, 223, 123, 0)');
			baseline.addColorStop(0.5, 'rgba(255, 249, 214, 0.62)');
			baseline.addColorStop(1, 'rgba(255, 223, 123, 0)');
			context.beginPath();
			context.strokeStyle = baseline;
			context.lineWidth = 1;
			context.globalAlpha = 1;
			context.moveTo(left, centerY);
			context.lineTo(left + waveWidth, centerY);
			context.stroke();

			context.restore();
		}

		function draw(time: number) {
			if (time - lastDraw < frameInterval) {
				animation = requestAnimationFrame(draw);
				return;
			}

			lastDraw = time;
			renderedFrames += 1;

			const centerY = height * 0.43;
			const waveWidth = Math.min(width * 0.86, 980);
			const waveHeight = Math.min(Math.max(height * 0.18, 86), 178);

			drawBackground(centerY, waveWidth, waveHeight, time);
			updateSmoke(time);
			drawSmoke(time, waveHeight);
			drawWaveform(centerY, time, waveWidth, waveHeight);

			const elapsed = time - startedAt;
			if (!reducedMotion.matches || elapsed < 900 || renderedFrames < 2) {
				animation = requestAnimationFrame(draw);
			}
		}

		resize();
		window.addEventListener('resize', resize);
		animation = requestAnimationFrame(draw);

		return () => {
			window.removeEventListener('resize', resize);
			cancelAnimationFrame(animation);
		};
	});
</script>

<section class="hero" aria-label="PDM music platform intro">
	<canvas bind:this={canvas} class="visualizer" aria-hidden="true"></canvas>
	<div class="vignette"></div>

	<div class="brand">
		<h1>PDM</h1>
		<p>WEB3 MUSIC PLATFORM <span></span> LIVE AUDIO WAVE</p>
	</div>

	<div class="join-action">
		<Button disabled={false} click={joinWhitelist}>
			{#snippet text()}
				join
			{/snippet}
		</Button>
	</div>

	<div class="fade-overlay"></div>
</section>

<style lang="scss">
	.hero {
		position: relative;
		width: 100vw;
		width: 100dvw;
		min-height: 100vh;
		min-height: 100dvh;
		height: 100vh;
		height: 100dvh;
		margin-left: calc(50% - 50vw);
		margin-left: calc(50% - 50dvw);
		padding: 0;
		overflow: hidden;
		isolation: isolate;
		background: linear-gradient(135deg, #010101 0%, #070503 35%, #151008 68%, #241a0b 100%);
		color: #fff;
	}

	.visualizer,
	.vignette,
	.fade-overlay {
		position: absolute;
		inset: 0;
		pointer-events: none;
	}

	.visualizer {
		display: block;
		z-index: 1;
		width: 100%;
		height: 100%;
	}

	.vignette {
		z-index: 2;
		background:
			radial-gradient(ellipse at 50% 45%, transparent 0%, transparent 48%, rgba(0, 0, 0, 0.16) 74%, rgba(0, 0, 0, 0.46) 100%),
			linear-gradient(180deg, rgba(0, 0, 0, 0.1), transparent 30%, transparent 76%, rgba(0, 0, 0, 0.2));
	}

	.brand,
	.join-action {
		position: absolute;
		z-index: 5;
	}

	.brand {
		left: clamp(1.3rem, 3.6vw, 3rem);
		bottom: clamp(1.4rem, 4vw, 2.7rem);
		display: flex;
		align-items: baseline;
		gap: clamp(0.8rem, 2vw, 1.2rem);

		h1 {
			margin: 0;
			color: var(--main-color);
			font-size: clamp(2.1rem, 4vw, 3.3rem);
			font-weight: 900;
			line-height: 0.9;
			letter-spacing: 0;
			text-shadow:
				0 0 18px rgba(255, 223, 123, 0.78),
				0 0 40px rgba(252, 211, 77, 0.28);
		}

		p {
			margin: 0;
			max-width: none;
			color: rgba(255, 238, 180, 0.76);
			font-size: clamp(0.66rem, 1.2vw, 0.82rem);
			font-weight: 700;
			line-height: 1;
			letter-spacing: 0;
			white-space: nowrap;
		}

		span::before {
			content: '';
			display: inline-block;
			width: 4px;
			height: 4px;
			margin: 0 0.58rem 0.12rem;
			border-radius: 50%;
			background: currentColor;
			box-shadow: 0 0 10px currentColor;
		}
	}

	.join-action {
		right: clamp(1.3rem, 3.6vw, 3rem);
		bottom: clamp(1.15rem, 3.6vw, 2.35rem);

		:global(.button) {
			min-width: 148px;
			min-height: 48px;
			background: rgba(2, 2, 2, 0.36);
			backdrop-filter: blur(14px);
		}
	}

	.fade-overlay {
		top: auto;
		z-index: 3;
		height: 1px;
		background: #020202;
	}

	@media (max-width: 720px) {
		.hero {
			min-height: 100vh;
			min-height: 100dvh;
			height: 100vh;
			height: 100dvh;
		}

		.brand {
			left: 1rem;
			right: 1rem;
			bottom: 6.8rem;
			display: block;
			text-align: center;

			h1 {
				font-size: clamp(2.8rem, 16vw, 4.2rem);
			}

			p {
				margin-top: 0.6rem;
				white-space: normal;
				line-height: 1.35;
			}
		}

		.join-action {
			left: 50%;
			right: auto;
			bottom: 2rem;
			transform: translateX(-50%);

			:global(.button) {
				width: min(210px, calc(100vw - 2rem));
			}
		}
	}
</style>
