<div class="wrapper">
	<div class="bg" />
	<div class="cta">
		<h1 class="title">PDM</h1>
		<p class="subtitle">WHERE FANS DON'T JUST LISTEN - THEY LEAD</p>
	</div>
	<div class="crowd" />
	<div class="fade-overlay"></div>
</div>

<style style="scss">
	.wrapper {
		position: relative;
		width: 100%;
		height: 100vh;
		overflow: hidden;
	}
	.bg {
		position: fixed;
		inset: 0;
		background-image: url('/concert-bg.jpg');
		background-size: cover;
		width: 100%;
		height: 100vh;
		background-position: center;
		filter: brightness(0.6);
		z-index: -1;
	}
	.crowd {
		position: absolute;
		background-image: url('/crowd.png');
		bottom: 0;
		left: 0;
		width: 100%;
		height: 100vh;
		background-position: center;
		background-size: cover;
		z-index: 1;
		filter: brightness(0.6);
	}
	.cta {
		position: fixed;
		top: 40%;
		left: 50%;
		transform: translate(-50%, -50%);
		text-align: center;
		color: white;
		z-index: -1;
		.title {
			margin: 0;
			font-size: clamp(8rem, 15vw, 20rem);
			letter-spacing: 2px;
			color: var(--main-color);
			text-shadow:
				0 0 10px rgba(255, 225, 103, 0.7),
				0 0 20px rgba(255, 225, 103, 0.5),
				0 0 40px rgba(255, 225, 103, 0.3);
			animation: flicker 3.5s infinite ease-in-out;
		}
		.subtitle {
			margin: 0;
			font-size: clamp(1.2rem, 3vw, 1.5rem);
			font-weight: 300;
			letter-spacing: 1px;
			font-family: 'Space Grotesk', sans-serif;
			color: rgba(255, 255, 255, 0.85);
			text-shadow: 0 0 8px rgba(0, 0, 0, 0.6);
		}
	}
	.fade-overlay {
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 30vh;
		background: linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, #1a1a1a 100%);
		z-index: 2;
		pointer-events: none;
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
