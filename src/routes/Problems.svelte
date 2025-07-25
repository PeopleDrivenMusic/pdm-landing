<script>
	import Animate from './Animate.svelte';

	const text = [
		{
			title: 'Artist lose control',
			subtitle: 'Musicians have no direct connection with their audience...',
			animation: 'left'
		},
		{
			title: 'Fans stay passive',
			subtitle:
				'Listeners consume music without engagement, missing opportunities for deeper connection',
			animation: 'right'
		},
		{
			title: 'Chaos in ticket distribution',
			subtitle: 'Automated systems and scalpers dominate ticket sales, excluding real fans',
			animation: 'left'
		},
		{
			title: 'Talents disappear',
			subtitle: 'Emerging artists struggle to find visibility in an oversaturated market',
			animation: 'right'
		}
	];
</script>

<section class="problems">
	<Animate variant="fade" duration={1} delay={0}>
		<h2>The Current Reality</h2>
	</Animate>
	<div class="problem-grid">
		{#each text as problem}
			<Animate variant={problem.animation} duration={1} delay={0.2}>
				<div class="problem-item">
					<h3>{problem.title}</h3>
					<p>{problem.subtitle}</p>
				</div>
			</Animate>
		{/each}
	</div>
	<div class="cta">
		<Animate variant="fade" duration={1} delay={0.5}>
			<h2>The music industry is broken...</h2>
			<p>But what if fans could change everything?</p>
		</Animate>
	</div>
	<div class="fade-overlay"></div>
</section>

<style lang="scss">
	.problems {
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
		&::after {
			content: '';
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 20px;
			background: linear-gradient(to bottom, rgba(26, 26, 26, 0.3), rgba(26, 26, 26, 1));
			z-index: -1;
		}
		.problem-grid {
			display: grid;
			grid-template-columns: repeat(2, minmax(300px, 1fr));
			gap: 5rem;
			width: 100%;
			max-width: 1200px;
			margin: 4rem auto 2rem;

			.problem-item {
				padding-left: 1rem;
				border-left: 2px solid var(--main-color);
				transition: all 0.3s ease;
				height: 100%;
				:global(div) {
					height: 100%;
				}

				h3 {
					font-size: clamp(2rem, 2.5vw, 3rem);
					// font-size: 1.8rem;
					color: var(--main-color);
					margin-bottom: 0.5rem;
				}

				p {
					// font-size: 1.1rem;
					color: rgba(255, 255, 255, 0.65);
					line-height: 1.5;
				}

				&:hover {
					border-left: 2px solid white;
					transform: translateX(4px);
					transition: all 0.25s ease;
					cursor: default;
				}
			}

			@media screen and (max-width: 768px) {
				grid-template-columns: 1fr;
				gap: 2rem;

				.problem-item {
					padding-left: 0;
					border-left: none;
					text-align: center;

					h3 {
						font-size: clamp(1.5rem, 4vw, 2rem);
					}

					p {
						font-size: 1rem;
					}

					&:hover {
						transform: none;
						border-left: none;
					}
				}
			}
		}
		.cta {
			margin-top: 5rem;
			text-align: center;
			h2 {
				font-size: clamp(2rem, 3vw, 4rem);
				margin-bottom: 1rem;
				color: var(--main-color);
			}
		}
		&::after {
			content: '';
			position: absolute;
			bottom: 0;
			left: 0;
			width: 100%;
			height: 20px;
			background: linear-gradient(to bottom, rgba(26, 26, 26, 0), rgba(26, 26, 26, 1));
			z-index: 1;
			pointer-events: none;
		}
	}
</style>
