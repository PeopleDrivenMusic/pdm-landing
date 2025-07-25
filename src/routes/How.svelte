<script>
	import IconPlay from './icons/IconPlay.svelte';
	import IconAudio from './icons/IconAudio.svelte';
	import Animate from './Animate.svelte';
	import IconTrust from './icons/IconTrust.svelte';
	import IconGrow from './icons/IconGrow.svelte';
	import IconNft from './icons/IconNft.svelte';
	import IconDollar from './icons/IconDollar.svelte';
	import IconPeople from './icons/IconPeople.svelte';
	import IconFunds from './icons/IconFunds.svelte';
	const howItWorks = {
		listeners: [
			{
				title: 'Listen & Earn',
				description:
					'Earn PDM tokens for daily listening — the more trust you build, the more you unlock.',
				icon: IconAudio,
				animation: 'left'
			},
			{
				title: 'Boost Your Trust',
				description: 'Likes, comments, and shares increase your Trust Score and daily limits.',
				icon: IconTrust,
				animation: 'left'
			},
			{
				title: 'Earn Badges',
				description: "Prove you're a real fan — collect badges and unlock early access to tickets.",
				icon: IconNft,
				animation: 'left'
			},
			{
				title: 'Invest in Artists',
				description:
					'Buy music licenses, join crowdfunds, and share in the success of the artists.',
				icon: IconGrow,
				animation: 'left'
			}
		],
		artists: [
			{
				title: 'Get Paid for Plays',
				description: 'Earn PDM tokens whenever your tracks are played — directly, no middlemen.',
				icon: IconPlay,
				animation: 'right'
			},
			{
				title: 'Sell Merch & Tickets',
				description: 'Open your store, sell exclusive merch and manage ticketing fairly.',
				icon: IconDollar,
				animation: 'right'
			},
			{
				title: 'Run Crowdfunds',
				description: 'Launch funding campaigns for albums or tours with fan support.',
				icon: IconFunds,
				animation: 'right'
			},
			{
				title: 'Grow Your Fanbase',
				description: 'Reach new listeners, reward your most loyal fans, and build your community.',
				icon: IconPeople,
				animation: 'right'
			}
		]
	};
</script>

<section class="steps">
	<Animate variant="fade" duration={1} delay={0}>
		<h2>Two Paths. One Revolution.</h2>
	</Animate>
	<div class="journey-grid">
		<div class="column">
			<h3>Fan Journey</h3>
			{#each howItWorks.listeners as step}
				<Animate variant={step.animation} duration={1} delay={0.2}>
					<div class="journey-item">
						<div class="icon-wrapper">
							{#if step.icon}
								<svelte:component this={step.icon} />
							{/if}
						</div>
						<div class="text">
							<h4>{step.title}</h4>
							<p>{step.description}</p>
						</div>
					</div>
				</Animate>
			{/each}
		</div>
		<div class="column">
			<h3>Artist Journey</h3>
			{#each howItWorks.artists as step}
				<Animate variant={step.animation} duration={1} delay={0.2}>
					<div class="journey-item">
						<div class="icon-wrapper">
							{#if step.icon}
								<svelte:component this={step.icon} />
							{/if}
						</div>
						<div class="text">
							<h4>{step.title}</h4>
							<p>{step.description}</p>
						</div>
					</div>
				</Animate>
			{/each}
		</div>
	</div>
	<div class="fade-overlay"></div>
</section>

<style lang="scss">
	.steps {
		position: relative;
		z-index: 0;
		padding: 5rem 2rem;
		color: white;
		color: rgb(255 255 255 / 0.7);

		h2 {
			max-width: 1200px;
			margin: 0 auto;
			width: 100%;
		}
		.journey-grid {
			display: grid;
			grid-template-columns: repeat(2, minmax(300px, 1fr));
			gap: 5rem;
			width: 100%;
			max-width: 1200px;
			margin: 4rem auto 2rem;
			.column {
				display: flex;
				flex-direction: column;
				gap: 2rem;

				h3 {
					font-size: clamp(2rem, 2.5vw, 3rem);
					color: var(--main-color);
					margin: auto;
					margin-bottom: 1rem;
				}
			}

			.journey-item {
				display: flex;
				gap: 1rem;
				padding-left: 1rem;
				min-height: 185px;

				.icon-wrapper {
					width: 70px;
					height: 70px;
					display: flex;
					flex-shrink: 0;
					align-items: center;
					justify-content: center;
					background: rgba(248, 213, 73, 0.1);
					border-radius: 50%;
					flex-shrink: 0;

					:global(svg) {
						width: 40px;
						height: 40px;
						color: var(--main-color);
					}
				}
				h4 {
					font-size: clamp(1.5rem, 2vw, 2.5rem);
					// font-size: 1.8rem;
					color: var(--main-color);
					margin: 0;
				}

				p {
					// font-size: 1.1rem;
					color: rgba(255, 255, 255, 0.65);
					line-height: 1.5;
				}

				&:hover {
					transform: scale(1.05);
					transition: all 0.25s ease;
					.icon-wrapper {
						background: rgba(248, 213, 73, 0.2);
						transition: all 0.25s ease;
					}
					cursor: default;
				}
			}
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

		@media (max-width: 768px) {
			padding: 3rem 1rem;

			h2 {
				font-size: 1.8rem;
				text-align: center;
			}

			.journey-grid {
				grid-template-columns: 1fr;
				gap: 2rem;

				.column {
					h3 {
						font-size: 1.5rem;
						text-align: center;
					}
				}

				.journey-item {
					flex-direction: column;
					align-items: center;
					text-align: center;
					min-height: auto;

					.icon-wrapper {
						width: 50px;
						height: 50px;

						:global(svg) {
							width: 30px;
							height: 30px;
						}
					}

					h4 {
						font-size: 1.2rem;
					}

					p {
						font-size: 0.9rem;
					}
				}
			}
		}
	}
</style>
