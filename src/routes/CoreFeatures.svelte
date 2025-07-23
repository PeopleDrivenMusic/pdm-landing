<script>
	import { onDestroy, onMount } from 'svelte';
	import Animate from './Animate.svelte';
	import { fade, scale } from 'svelte/transition';
	import { quadOut } from 'svelte/easing';
	import confetti from 'canvas-confetti';
	import IconHeadphones from './icons/IconHeadphones.svelte';
	import IconTickets from './icons/IconTickets.svelte';
	import IconNotes from './icons/IconNotes.svelte';
	import IconShop from './icons/IconShop.svelte';

	let interval;
	let canvasEl;

	const features = [
		{
			title: 'Listen to Earn',
			description:
				'Get rewarded for your attention. Listen to music, engage with artists, and earn PDM tokens in return.',
			icon: IconHeadphones
		},
		{
			title: 'Fair Ticketing',
			description:
				'No more scalpers or bots. Tickets are distributed transparently and fairly — true fans get the first shot.',
			icon: IconTickets
		},
		{
			title: 'Music Marketplace',
			description:
				'Support your favorite artists by purchasing merch, attending events, or investing in tracks with future royalties.',
			icon: IconShop
		},
		{
			title: 'Social Player',
			description:
				'Comment, like, share and listen — all for free. Every interaction counts: your activity helps artists grow, reach new fans.',
			icon: IconNotes
		}
	];
	onMount(() => {
		const customConfetti = confetti.create(canvasEl, {
			resize: true,
			useWorker: true
		});
		interval = setInterval(() => {
			for (let i = 0; i < 15; i++) {
				customConfetti({
					particleCount: 1,
					startVelocity: 0, // случайная скорость
					ticks: 300 + Math.random() * 200, // живут дольше
					gravity: Math.random() * 0.2, // чуть разная гравитация
					origin: {
						x: Math.random(), // по всей ширине экрана
						y: Math.random() * 0.9 // чуть выше экрана
					},
					angle: 90 + (Math.random() * 20 - 10), // +/-10° разброс
					spread: 30 + Math.random() * 20,
					colors: ['#FFD700', '#FFC107', '#FFECB3', '#fff4cc', '#d4a017'],
					shapes: ['square'],
					scalar: 0.7 + Math.random() * 0.6 // размер от 0.7 до 1.3
				});
			}
		}, 150); // чаще, но меньше за раз — распределение плавнее
	});

	onDestroy(() => {
		clearInterval(interval);
	});
</script>

<div class="confetti-container">
	<canvas bind:this={canvasEl} class="confetti-canvas"></canvas>
	<section class="core">
		<Animate variant="fade" duration={1} delay={0}>
			<div class="core-cta">
				<h2>Core Features</h2>
				<p>
					Experience music like never before. PDM puts the power back in the hands of fans and
					artists
				</p>
			</div>
		</Animate>
		<div class="features-grid">
			{#each features as feature}
			<Animate variant="fade" duration={1} delay={Math.random() * 0.3}>

				<div class="feature-card">
					<div class="icon">
						<svelte:component this={feature.icon} />
					</div>
					<h3>{feature.title}</h3>
					<p>
						{feature.description}
					</p>
				</div>
			</Animate>
			{/each}
		</div>
	</section>
	<div class="fade-overlay"></div>
	<div class="fade-overlay-second"></div>
</div>

<style lang="scss">
	.confetti-container {
		position: relative;
		background-image: url('/bg3.png');
		background-size: cover;
		background-position: center;

		.fade-overlay-second {
			position: absolute;
			bottom: 0;
			left: 0;
			width: 100%;
			height: 10vh;
			background: linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, #1a1a1a 100%);
			z-index: 2;
			pointer-events: none;
		}
		.fade-overlay {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 10vh;
			background: linear-gradient(to top, rgba(0, 0, 0, 0) 0%, #1a1a1a 100%);
			z-index: 2;
			pointer-events: none;
		}
		.confetti-canvas {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			pointer-events: none;
			z-index: 0;
		}
	}
	.core {
		position: relative;
		z-index: 1;
		// background: linear-gradient(to bottom, #fcf9ed 0%, #f5f1dd 40%, #e0d6b0 100%);

		h2 {
			text-shadow:
				0 0 10px rgba(255, 225, 103, 0.7),
				0 0 20px rgba(255, 225, 103, 0.5),
				0 0 40px rgba(255, 225, 103, 0.3);
			animation: flicker 3.5s infinite ease-in-out;
		}
		p {
			text-align: center;
			margin-top: 2rem;
		}

		.features-grid {
			display: grid;
			margin-top: 7rem;
			grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
			gap: 2rem;
			max-width: 100%;
			width: 100%;
		}
		.feature-card {
			backdrop-filter: blur(4px);
			background: rgba(248, 213, 73, 0.1);
			border: 1px solid rgba(255, 215, 0, 0.1);
			border-radius: 1rem;
			padding: 2rem;
			height: 100%;
			box-shadow: 0 0 10px rgba(255, 215, 0, 0.1);
			transition: all 0.3s ease;
			color: #f5deb3;
			font-family: 'Georgia', serif;
			text-align: center;
			cursor: pointer;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: start;
			.icon {
				width: 150px;
				color: var(--main-color);
			}

			h3 {
				font-size: 2.2rem;
				letter-spacing: 2px;
				color: var(--main-color);
				margin: 0;
				display: flex;
				align-items: center;
				height: 79px;
			}
			p {
				font-size: 1.5rem;
			}
		}

		.feature-card:hover {
			transform: scale(1.05);
			box-shadow:
				0 0 20px rgba(255, 215, 0, 0.3),
				0 0 40px rgba(255, 215, 0, 0.2);
			background: rgba(248, 213, 73, 0.2);
			transition:
				transform 0.3s ease,
				box-shadow 0.3s ease,
				background 0.3s ease;
		}

		.feature-title {
			font-size: 1.5rem;
			font-weight: bold;
			color: #f9d976;
			margin-bottom: 0.5rem;
		}

		.feature-description {
			font-size: 1rem;
			color: #ddd;
			line-height: 1.4;
		}
	}
	@keyframes flicker {
		0%,
		100% {
			text-shadow:
				0 0 10px rgba(255, 225, 103, 0.7),
				0 0 20px rgba(255, 225, 103, 0.5);
		}
		50% {
			text-shadow:
				0 0 25px rgba(255, 225, 103, 1),
				0 0 35px rgba(255, 225, 103, 0.7);
		}
	}
</style>
