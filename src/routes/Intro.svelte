<script lang="ts">
	import { onMount } from 'svelte';
	import Button from './Button.svelte';

	let canvas: HTMLCanvasElement;

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
		bars: number;
		duration: number;
		fps: number;
		frames: number[];
		source?: string;
		windowSeconds?: number;
	};

	function joinWhitelist() {
		document.getElementById('join')?.scrollIntoView({ behavior: 'smooth' });
	}

	onMount(() => {
		const rawContext = canvas.getContext('2d');
		if (!rawContext) return;

		const context: CanvasRenderingContext2D = rawContext;
		const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
		const particleCount = reducedMotion.matches ? 12 : 30;
		const maxVelocity = reducedMotion.matches ? 0.26 : 1.22;
		let audioWaveform: WaveformData | null = null;

		let width = 0;
		let height = 0;
		let animation = 0;
		let lastDraw = 0;
		let renderedFrames = 0;
		let pointerX = 0.5;
		let pointerY = 0.43;
		let pointerIntensity = 0;
		let targetPointerX = 0.5;
		let targetPointerY = 0.43;
		let targetPointerIntensity = 0;
		const startedAt = performance.now();
		const frameInterval = reducedMotion.matches ? 160 : 34;
		const smokeSprite = document.createElement('canvas');
		const smokeSpriteContext = smokeSprite.getContext('2d');
		const smokeParticles: SmokeParticle[] = [];

		createSmokeSprite();

		void fetch('/hero-waveform.json')
			.then((response) => (response.ok ? response.json() : null))
			.then((data: WaveformData | null) => {
				if (
					data?.frames?.length &&
					data.bars > 1 &&
					data.duration > 0 &&
					data.fps > 0 &&
					data.frames.length >= data.bars
				) {
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

		function clamp(value: number, min: number, max: number) {
			return Math.max(min, Math.min(max, value));
		}

		function smoothstep(edgeA: number, edgeB: number, value: number) {
			const normalized = clamp((value - edgeA) / (edgeB - edgeA), 0, 1);

			return normalized * normalized * (3 - 2 * normalized);
		}

		function handlePointerMove(event: PointerEvent) {
			const rect = canvas.getBoundingClientRect();
			const localX = event.clientX - rect.left;
			const localY = event.clientY - rect.top;
			const normalizedX = clamp(localX / Math.max(1, rect.width), 0, 1);
			const normalizedY = clamp(localY / Math.max(1, rect.height), 0, 1);
			const waveWidth = Math.min(width * 0.9, 1040);
			const waveHeight =
				width > 720
					? Math.min(Math.max(height * 0.15, 88), 150)
					: Math.min(Math.max(height * 0.11, 72), 118);
			const left = (width - waveWidth) / 2;
			const centerY = height * 0.43;
			const progress = (localX - left) / Math.max(1, waveWidth);
			const horizontalFocus =
				smoothstep(-0.04, 0.045, progress) * (1 - smoothstep(0.955, 1.04, progress));
			const verticalFocus =
				1 -
				smoothstep(
					waveHeight * (width > 720 ? 1.08 : 1.2),
					waveHeight * (width > 720 ? 2.15 : 2.35),
					Math.abs(localY - centerY)
				);
			const focus = horizontalFocus * verticalFocus;

			targetPointerX = normalizedX;
			targetPointerY = normalizedY;
			targetPointerIntensity = (event.pointerType === 'mouse' ? 1 : 0.72) * focus;
		}

		function handlePointerLeave() {
			targetPointerIntensity = 0;
		}

		function updatePointer() {
			const follow = reducedMotion.matches ? 1 : 0.16;
			const fade =
				reducedMotion.matches || targetPointerIntensity < pointerIntensity ? 0.2 : 0.1;

			pointerX += (targetPointerX - pointerX) * follow;
			pointerY += (targetPointerY - pointerY) * follow;
			pointerIntensity += (targetPointerIntensity - pointerIntensity) * fade;
		}

		function motionFactor() {
			return reducedMotion.matches ? 0 : 1;
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
					alpha: randomBetween(0.025, 0.085),
					driftPhase: randomBetween(0, Math.PI * 2),
					driftSpeed: randomBetween(0.42, 1.35),
					radius: randomBetween(width * 0.08, width * 0.15) * (0.72 + centerBias * 0.28),
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
					Math.sin(seconds * (particle.driftSpeed * 0.37) + particle.driftPhase * 2.1) *
						maxVelocity *
						0.52;
				const lift =
					Math.cos(seconds * (particle.driftSpeed * 0.74) + particle.driftPhase) *
						maxVelocity *
						0.36 +
					Math.sin(seconds * (particle.driftSpeed * 1.9) + particle.driftPhase * 0.7) *
						maxVelocity *
						0.2;

				particle.x += particle.xVelocity + gust;
				particle.y += particle.yVelocity + lift;
				particle.rotation += particle.rotationVelocity;
				particle.xVelocity += Math.sin(seconds * 0.53 + particle.driftPhase) * 0.006;
				particle.yVelocity += Math.cos(seconds * 0.41 + particle.driftPhase * 1.6) * 0.003;
				particle.xVelocity = Math.max(-maxVelocity, Math.min(maxVelocity, particle.xVelocity));
				particle.yVelocity = Math.max(
					-maxVelocity * 0.58,
					Math.min(maxVelocity * 0.58, particle.yVelocity)
				);

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
			context.filter = 'none';

			for (const particle of smokeParticles) {
				const seconds = time * 0.001;
				const localPulse =
					0.88 + Math.sin(seconds * particle.driftSpeed + particle.driftPhase) * 0.12;
				const radius = particle.radius * pulse * localPulse;
				const alpha =
					particle.alpha *
					(0.72 +
						Math.sin(seconds * particle.driftSpeed * 0.68 + particle.driftPhase) * 0.18 +
						localPulse * 0.22);

				context.save();
				context.translate(particle.x, particle.y);
				context.rotate(particle.rotation + Math.sin(seconds * 0.28 + particle.driftPhase) * 0.08);
				context.scale(
					particle.scaleX + Math.sin(seconds * 0.22 + particle.driftPhase) * 0.16,
					particle.scaleY
				);
				context.globalAlpha = alpha;
				context.drawImage(smokeSprite, -radius, -radius, radius * 2, radius * 2);
				context.restore();
			}

			context.restore();
		}

		function currentAudioSeconds(time: number) {
			const audioStartOffsetSeconds = 0.55;
			const visualPlaybackRate = 0.52;

			return audioStartOffsetSeconds + (time - startedAt) * 0.001 * visualPlaybackRate;
		}

		function sampleAudioFrame(seconds: number, progress: number) {
			if (!audioWaveform?.frames?.length || !audioWaveform.bars) return 0;

			const { bars: sourceBars, duration, fps, frames } = audioWaveform;
			const frameCount = Math.floor(frames.length / sourceBars);
			if (frameCount <= 0) return 0;

			const wrappedSeconds = ((seconds % duration) + duration) % duration;
			const exactFrame = wrappedSeconds * fps;
			const frameA = Math.floor(exactFrame) % frameCount;
			const frameB = (frameA + 1) % frameCount;
			const frameMix = exactFrame - Math.floor(exactFrame);
			const exactBar = clamp(progress, 0, 1) * (sourceBars - 1);
			const barA = Math.floor(exactBar);
			const barB = Math.min(sourceBars - 1, barA + 1);
			const barMix = exactBar - barA;

			function valueAt(frame: number, bar: number) {
				return frames[frame * sourceBars + bar] / 1000;
			}

			const top = valueAt(frameA, barA) + (valueAt(frameA, barB) - valueAt(frameA, barA)) * barMix;
			const bottom =
				valueAt(frameB, barA) + (valueAt(frameB, barB) - valueAt(frameB, barA)) * barMix;

			return clamp(top + (bottom - top) * frameMix, 0, 1);
		}

		function sampleAudioImpulseFrame(seconds: number, progress: number) {
			return clamp((sampleAudioFrame(seconds, progress) - 0.42) / 0.58, 0, 1);
		}

		function currentAudioImpulse(time: number, seconds = currentAudioSeconds(time)) {
			if (!audioWaveform || reducedMotion.matches) return 0;

			const probes = [
				{ progress: 0.2, weight: 0.72 },
				{ progress: 0.3, weight: 1.05 },
				{ progress: 0.42, weight: 1.18 },
				{ progress: 0.5, weight: 1.36 },
				{ progress: 0.64, weight: 1.08 },
				{ progress: 0.72, weight: 0.92 },
				{ progress: 0.84, weight: 0.62 }
			];
			let current = 0;
			let previous = 0;
			let totalWeight = 0;

			for (const probe of probes) {
				current += sampleAudioImpulseFrame(seconds, probe.progress) * probe.weight;
				previous += sampleAudioImpulseFrame(seconds - 0.13, probe.progress) * probe.weight;
				totalWeight += probe.weight;
			}

			current /= totalWeight;
			previous /= totalWeight;

			const transient = Math.max(0, current - previous) * 2.2;

			return clamp(Math.pow(current, 0.86) * 0.5 + transient * 0.62, 0, 1);
		}

		function currentPulse(time: number) {
			if (reducedMotion.matches) return 0.22;

			const seconds = time * 0.001;
			const audioPulse = currentAudioImpulse(time);
			const pulse =
				0.23 +
				audioPulse * 0.31 +
				Math.sin(seconds * 0.72) * 0.035 +
				Math.sin(seconds * 1.33 + 1.7) * 0.024;

			return clamp(pulse, 0.18, 0.54);
		}

		function drawBackground(centerY: number, waveWidth: number, waveHeight: number, time: number) {
			const pulse = currentPulse(time);
			const breathe = 0.18 + pulse * 0.82;
			const bleed = Math.max(96, width * 0.14);
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
			context.translate(targetX - waveWidth * 0.13, targetY + waveHeight * 0.28);
			context.rotate(0.4);
			context.scale(1.42, 0.5);
			const landingRadius = waveWidth * (0.54 + breathe * 0.24);
			const landing = context.createRadialGradient(0, 0, 0, 0, 0, landingRadius);
			landing.addColorStop(0, `rgba(255, 223, 123, ${0.032 + breathe * 0.135})`);
			landing.addColorStop(0.48, `rgba(252, 211, 77, ${0.018 + breathe * 0.07})`);
			landing.addColorStop(1, 'rgba(0, 0, 0, 0)');
			context.fillStyle = landing;
			context.fillRect(
				-width - bleed,
				-height - bleed,
				width * 2 + bleed * 2,
				height * 2 + bleed * 2
			);
			context.restore();

			const floor = context.createLinearGradient(
				0,
				centerY + waveHeight * 0.12,
				0,
				centerY + waveHeight * 1.55
			);
			floor.addColorStop(0, 'rgba(0, 0, 0, 0)');
			floor.addColorStop(0.52, `rgba(255, 223, 123, ${0.004 + breathe * 0.018})`);
			floor.addColorStop(1, 'rgba(0, 0, 0, 0)');
			context.fillStyle = floor;
			context.fillRect(-bleed, centerY + waveHeight * 0.12, width + bleed * 2, waveHeight * 1.43);

			const sourceGlow = context.createRadialGradient(
				cornerX,
				cornerY,
				0,
				cornerX,
				cornerY,
				width * (0.28 + breathe * 0.08)
			);
			sourceGlow.addColorStop(0, `rgba(255, 239, 186, ${0.035 + breathe * 0.075})`);
			sourceGlow.addColorStop(0.58, `rgba(255, 223, 123, ${0.014 + breathe * 0.032})`);
			sourceGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
			context.fillStyle = sourceGlow;
			context.fillRect(0, 0, width, height);

			const sweep = context.createLinearGradient(
				cornerX,
				cornerY,
				targetX - waveWidth * 0.78,
				targetY + waveHeight * 0.74
			);
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

		function drawWaveform(centerY: number, time: number, waveWidth: number, waveHeight: number) {
			const left = (width - waveWidth) / 2;
			const sampleCount = width > 900 ? 720 : width > 560 ? 520 : 340;
			const lineCount = width > 720 ? 22 : 16;
			const seconds = time * 0.001;
			const motion = reducedMotion.matches ? 0 : 1;
			const audioResponsive = !!audioWaveform && !reducedMotion.matches;
			const audioSeconds = currentAudioSeconds(time);
			const audioPulse = currentAudioImpulse(time, audioSeconds);
			const pulse = 0.96 + Math.sin(seconds * 0.42) * 0.018 * motion + audioPulse * 0.085;
			const lobes = [
				{ center: 0.075, spread: 0.025, amp: 0.055, phase: 0.2, drift: 0.0015, motion: 0.05 },
				{ center: 0.2, spread: 0.058, amp: 0.34, phase: 1.4, drift: 0.0025, motion: 0.06 },
				{ center: 0.295, spread: 0.044, amp: 0.64, phase: 2.35, drift: 0.003, motion: 0.07 },
				{ center: 0.405, spread: 0.041, amp: 0.78, phase: 3.15, drift: 0.0025, motion: 0.06 },
				{ center: 0.505, spread: 0.05, amp: 0.98, phase: 0.8, drift: 0.002, motion: 0.055 },
				{ center: 0.63, spread: 0.052, amp: 0.48, phase: 1.75, drift: 0.0025, motion: 0.06 },
				{ center: 0.695, spread: 0.05, amp: 0.64, phase: 2.85, drift: 0.003, motion: 0.07 },
				{ center: 0.785, spread: 0.058, amp: 0.27, phase: 0.25, drift: 0.0025, motion: 0.06 },
				{ center: 0.895, spread: 0.052, amp: 0.12, phase: 1.05, drift: 0.002, motion: 0.05 }
			];

			type WavePoint = { x: number; y: number };
			type Strand = {
				end: number;
				phaseShift: number;
				scale: number;
				start: number;
				weave: number;
			};

			function gaussian(progress: number, center: number, spread: number, strength: number) {
				return Math.exp(-Math.pow((progress - center) / spread, 2)) * strength;
			}

			const magnetX = pointerX * width;
			const magnetY = pointerY * height;
			const magnetVerticalFocus =
				1 -
				smoothstep(
					waveHeight * (width > 720 ? 1.06 : 1.18),
					waveHeight * (width > 720 ? 2.12 : 2.32),
					Math.abs(magnetY - centerY)
				);
			const magnetAmount = reducedMotion.matches ? 0 : pointerIntensity * magnetVerticalFocus * 1.5;
			const magnetRadius = Math.max(width > 720 ? 88 : 72, waveHeight * (width > 720 ? 1.35 : 1.55));
			const magnetMaxPull = Math.max(14, waveHeight * (width > 720 ? 0.23 : 0.27));

			function magnetizePoint(x: number, y: number, progress: number, localFade = 1) {
				if (magnetAmount <= 0.002) return { x, y };

				const dxToMagnet = magnetX - x;
				const dyToMagnet = magnetY - y;
				const distance = Math.hypot(dxToMagnet, dyToMagnet);
				if (distance <= 0.001 || distance >= magnetRadius) return { x, y };

				const radialFalloff = Math.pow(
					1 - smoothstep(magnetRadius * 0.1, magnetRadius, distance),
					1.45
				);
				const edgeFade = smoothstep(0.02, 0.1, progress) * (1 - smoothstep(0.9, 0.985, progress));
				const pull = radialFalloff * edgeFade * localFade * magnetAmount;
				const pullDistance = Math.min(distance * 0.34, magnetMaxPull) * pull;
				const dx = (dxToMagnet / distance) * pullDistance;
				const dy = (dyToMagnet / distance) * pullDistance;

				return { x: x - dx, y: y - dy };
			}

			function envelopeAt(progress: number) {
				const edgeFade = Math.pow(Math.sin(progress * Math.PI), 0.54);
				const fineRipple = Math.sin(progress * 82 + seconds * 0.2 * motion) * 0.004;
				let shape = 0.01 + fineRipple;

				for (const lobe of lobes) {
					const animatedCenter =
						lobe.center + Math.sin(seconds * 0.23 + lobe.phase) * lobe.drift * motion;
					const lobeAudio = audioResponsive
						? sampleAudioImpulseFrame(audioSeconds + lobe.phase * 0.06, lobe.center)
						: 0;
					const lobeBreath =
						1 +
						Math.sin(seconds * 0.44 + lobe.phase) * lobe.motion * motion +
						lobeAudio * 0.13 +
						audioPulse * 0.045;
					shape += gaussian(progress, animatedCenter, lobe.spread, lobe.amp * lobeBreath);
				}

				const centerFill = gaussian(
					progress,
					0.515,
					0.038,
					0.06 + Math.sin(seconds * 0.46) * 0.006 * motion
				);
				const rightShoulder = gaussian(progress, 0.66, 0.04, 0.11);
				const leftPocket = gaussian(progress, 0.455, 0.032, -0.1);
				const centerSplit = gaussian(progress, 0.565, 0.032, -0.18);
				const leftSplit = gaussian(progress, 0.35, 0.028, -0.1);
				const localAudio = audioResponsive
					? sampleAudioImpulseFrame(audioSeconds + progress * 0.18, progress)
					: 0;
				const audioLift = audioResponsive ? 0.9 + localAudio * 0.18 + audioPulse * 0.08 : 1;

				const shaped =
					(shape + centerFill + rightShoulder + leftPocket + centerSplit + leftSplit) *
					edgeFade *
					pulse *
					audioLift;

				return clamp(shaped, 0.004, 1.08);
			}

			function phaseAt(progress: number) {
				return (
					progress * Math.PI * 14.8 -
					gaussian(progress, 0.27, 0.08, 0.78) +
					gaussian(progress, 0.38, 0.07, 0.96) -
					gaussian(progress, 0.49, 0.068, 1.1) +
					gaussian(progress, 0.61, 0.075, 0.9) -
					gaussian(progress, 0.72, 0.08, 0.58) +
					Math.sin(progress * Math.PI * 2.05) * 0.26
				);
			}

			function baselineCurve(progress: number) {
				return (
					gaussian(progress, 0.4, 0.055, waveHeight * 0.018) -
					gaussian(progress, 0.54, 0.064, waveHeight * 0.014) +
					Math.sin(progress * Math.PI * 2 + seconds * 0.08 * motion) * waveHeight * 0.003
				);
			}

			function traceSmooth(points: WavePoint[]) {
				if (points.length < 2) return;

				context.beginPath();
				context.moveTo(points[0].x, points[0].y);

				for (let index = 1; index < points.length - 1; index += 1) {
					const current = points[index];
					const next = points[index + 1];
					const midX = (current.x + next.x) / 2;
					const midY = (current.y + next.y) / 2;
					context.quadraticCurveTo(current.x, current.y, midX, midY);
				}

				const last = points[points.length - 1];
				context.lineTo(last.x, last.y);
			}

			function makeCenterLine() {
				const points: WavePoint[] = [];
				const samples = width > 720 ? 280 : 180;

				for (let sample = 0; sample <= samples; sample += 1) {
					const progress = sample / samples;
					const x = left + progress * waveWidth;
					const y = centerY + baselineCurve(progress);

					points.push(magnetizePoint(x, y, progress, 0.42));
				}

				return points;
			}

			function makeStrand(strand: Strand) {
				const points: WavePoint[] = [];
				const range = strand.end - strand.start;

				for (let sample = 0; sample <= sampleCount; sample += 1) {
					const localProgress = sample / sampleCount;
					const progress = strand.start + localProgress * range;
					const x = left + progress * waveWidth;
					const localFade =
						smoothstep(0, 0.085, localProgress) * (1 - smoothstep(0.915, 1, localProgress));
					const envelope = envelopeAt(progress);
					const phase = phaseAt(progress);
					const carrier =
						Math.sin(phase + strand.phaseShift + seconds * 0.035 * motion) * 0.96 +
						Math.sin(phase * 1.64 - strand.phaseShift * 0.62 + seconds * 0.028 * motion) * 0.06 +
						Math.sin(
							progress * Math.PI * (18 + strand.weave * 8) +
								strand.phaseShift * 0.36 -
								seconds * 0.045 * motion
						) *
							0.008;
					const crossingBias =
						gaussian(progress, 0.3, 0.06, Math.sin(strand.phaseShift * 0.72) * 0.08) -
						gaussian(progress, 0.5, 0.052, Math.cos(strand.phaseShift * 0.45) * 0.065) +
						gaussian(progress, 0.68, 0.065, Math.sin(strand.phaseShift * 0.55) * 0.062);
					const baselineOffset = baselineCurve(progress);
					const naturalOffset =
						(carrier + crossingBias) *
						envelope *
						strand.scale *
						waveHeight *
						localFade;
					const y = centerY + baselineOffset + naturalOffset;

					points.push(magnetizePoint(x, y, progress, localFade));
				}

				return points;
			}

			function drawFlowStrands() {
				if (reducedMotion.matches) return;

				const dashLength = Math.max(22, waveWidth * 0.028);
				const gapLength = Math.max(72, waveWidth * 0.105);
				const strands = [
					{
						end: 0.97,
						phaseShift: -1.12,
						scale: 0.98,
						start: 0.035,
						weave: 0.28,
						speed: 1.0
					},
					{
						end: 0.95,
						phaseShift: -0.2,
						scale: 1.05,
						start: 0.085,
						weave: 0.2,
						speed: 1.18
					},
					{
						end: 0.9,
						phaseShift: 0.74,
						scale: 0.86,
						start: 0.18,
						weave: 0.34,
						speed: 0.96
					}
				];

				context.save();
				context.filter = 'none';
				context.lineCap = 'round';
				context.lineJoin = 'round';
				context.setLineDash([dashLength, gapLength]);

				for (const strand of strands) {
					const stroke = context.createLinearGradient(left, centerY, left + waveWidth, centerY);
					stroke.addColorStop(0, 'rgba(255, 223, 123, 0)');
					stroke.addColorStop(0.22, `rgba(255, 225, 116, ${0.08 + audioPulse * 0.035})`);
					stroke.addColorStop(0.5, `rgba(255, 250, 214, ${0.22 + audioPulse * 0.09})`);
					stroke.addColorStop(0.78, `rgba(255, 200, 68, ${0.08 + audioPulse * 0.035})`);
					stroke.addColorStop(1, 'rgba(255, 223, 123, 0)');

					const points = makeStrand(strand);
					context.strokeStyle = stroke;
					context.lineWidth = 1.08 + audioPulse * 0.27;
					context.shadowColor = 'rgba(255, 223, 123, 0.42)';
					context.shadowBlur = 0;
					context.lineDashOffset = -(
						seconds * waveWidth * 0.045 * strand.speed +
						strand.phaseShift * 42
					);
					traceSmooth(points);
					context.stroke();
				}

				context.setLineDash([]);
				context.restore();
			}

			context.save();
			context.globalCompositeOperation = 'lighter';
			context.lineCap = 'round';
			context.lineJoin = 'round';

			const baseline = context.createLinearGradient(left, 0, left + waveWidth, 0);
			baseline.addColorStop(0, 'rgba(255, 223, 123, 0)');
			baseline.addColorStop(0.08, `rgba(255, 216, 92, ${0.3 + audioPulse * 0.14})`);
			baseline.addColorStop(0.5, `rgba(255, 249, 214, ${0.82 + audioPulse * 0.18})`);
			baseline.addColorStop(0.92, `rgba(255, 216, 92, ${0.3 + audioPulse * 0.14})`);
			baseline.addColorStop(1, 'rgba(255, 223, 123, 0)');

			context.filter = 'none';

			for (let line = 0; line < lineCount; line += 1) {
				const progress = line / (lineCount - 1);
				const distance = Math.abs(progress - 0.5) * 2;
				const trimNoise = Math.sin(line * 1.83) * 0.012;
				const phaseShift = -Math.PI + progress * Math.PI * 2 + Math.sin(line * 1.37) * 0.08;
				const alpha = (0.11 + (1 - distance) * 0.23) * (1 + audioPulse * 0.18);
				const start = clamp(
					0.012 + distance * 0.055 + Math.max(0, Math.sin(line * 0.91)) * 0.018 + trimNoise,
					0,
					0.14
				);
				const end = clamp(
					0.988 - distance * 0.052 - Math.max(0, Math.cos(line * 1.13)) * 0.016 + trimNoise,
					0.86,
					1
				);
				const scale =
					(0.58 + (1 - distance) * 0.56 + Math.sin(line * 1.61) * 0.045) *
					(line % 7 === 0 ? 0.86 : 1);
				const lineWidth = distance > 0.94 ? 0.93 : 1.23 + (1 - distance) * 0.36;
				const points = makeStrand({
					end,
					phaseShift,
					scale,
					start,
					weave: distance
				});
				const stroke = context.createLinearGradient(left, centerY, left + waveWidth, centerY);
				stroke.addColorStop(0, 'rgba(255, 223, 123, 0)');
				stroke.addColorStop(0.1, `rgba(255, 223, 123, ${alpha * 0.5})`);
				stroke.addColorStop(0.48, `rgba(255, 244, 196, ${alpha * 1.16})`);
				stroke.addColorStop(0.9, `rgba(255, 203, 84, ${alpha * 0.6})`);
				stroke.addColorStop(1, 'rgba(255, 223, 123, 0)');

				context.globalAlpha = 1;
				context.strokeStyle = stroke;
				context.lineWidth = lineWidth;
				context.globalAlpha = Math.min(1, alpha / 0.23);
				traceSmooth(points);
				context.stroke();
			}

			drawFlowStrands();

			const foregroundStroke = context.createLinearGradient(left, centerY, left + waveWidth, centerY);
			foregroundStroke.addColorStop(0, 'rgba(255, 247, 204, 0)');
			foregroundStroke.addColorStop(0.12, 'rgba(255, 225, 116, 0.22)');
			foregroundStroke.addColorStop(0.5, 'rgba(255, 247, 204, 0.5)');
			foregroundStroke.addColorStop(0.88, 'rgba(255, 218, 94, 0.24)');
			foregroundStroke.addColorStop(1, 'rgba(255, 247, 204, 0)');
			context.strokeStyle = foregroundStroke;
			context.lineWidth = 1.62;
			for (const strand of [
				{ end: 0.96, phaseShift: -0.62, scale: 1.08, start: 0.055, weave: 0.15 },
				{ end: 0.9, phaseShift: 0.26, scale: 0.94, start: 0.16, weave: 0.24 },
				{ end: 0.86, phaseShift: 0.9, scale: 0.78, start: 0.235, weave: 0.35 }
			]) {
				const points = makeStrand(strand);
				context.globalAlpha = 1;
				traceSmooth(points);
				context.stroke();
			}

			const centerLine = makeCenterLine();
			context.beginPath();
			context.strokeStyle = baseline;
			context.shadowColor = 'rgba(255, 223, 123, 0.74)';
			context.shadowBlur = 0;
			context.lineWidth = 1.8 + audioPulse * 0.45;
			context.globalAlpha = 1;
			traceSmooth(centerLine);
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
			const waveWidth = Math.min(width * 0.9, 1040);
			const waveHeight =
				width > 720
					? Math.min(Math.max(height * 0.15, 88), 150)
					: Math.min(Math.max(height * 0.11, 72), 118);

			updatePointer();
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
		window.addEventListener('pointermove', handlePointerMove, { passive: true });
		document.addEventListener('mouseleave', handlePointerLeave);
		window.addEventListener('blur', handlePointerLeave);
		animation = requestAnimationFrame(draw);

		return () => {
			window.removeEventListener('resize', resize);
			window.removeEventListener('pointermove', handlePointerMove);
			document.removeEventListener('mouseleave', handlePointerLeave);
			window.removeEventListener('blur', handlePointerLeave);
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
			radial-gradient(
				ellipse at 50% 45%,
				transparent 0%,
				transparent 48%,
				rgba(0, 0, 0, 0.16) 74%,
				rgba(0, 0, 0, 0.46) 100%
			),
			linear-gradient(
				180deg,
				rgba(0, 0, 0, 0.1),
				transparent 30%,
				transparent 76%,
				rgba(0, 0, 0, 0.2)
			);
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
