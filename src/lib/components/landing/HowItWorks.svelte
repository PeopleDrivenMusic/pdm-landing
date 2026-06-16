<script lang="ts">
	import { reveal } from '$lib/actions/reveal';
	import { steps } from '$lib/content';
</script>

<section id="how" class="how">
	<div class="inner">
		<p class="kicker" use:reveal>How it works</p>
		<h2 use:reveal={{ delay: 80 }}>From first listen to first row.</h2>

		<div class="steps">
			<div class="line" use:reveal={{ delay: 120 }}></div>
			{#each steps as step, i}
				<div class="step" use:reveal={{ delay: 160 + i * 120, y: 30 }}>
					<span class="num">{step.n}</span>
					<h3>{step.title}</h3>
					<p>{step.desc}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<style lang="scss">
	.how {
		padding: clamp(6rem, 12vh, 10rem) clamp(1.25rem, 5vw, 3rem);
	}
	.inner {
		max-width: var(--maxw);
		margin: 0 auto;
		text-align: center;
	}
	.kicker {
		text-transform: uppercase;
		letter-spacing: 4px;
		font-size: 0.8rem;
		color: var(--gold);
		margin-bottom: 1rem;
	}
	h2 {
		font-size: clamp(2.2rem, 6vw, 4rem);
		font-style: italic;
		margin-bottom: clamp(3rem, 8vh, 5rem);
	}
	.steps {
		position: relative;
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 2rem;
	}
	.line {
		position: absolute;
		top: 28px;
		left: 16%;
		right: 16%;
		height: 2px;
		background: linear-gradient(90deg, var(--gold), var(--gold-deep));
		transform-origin: left;
		animation: grow 1.2s var(--ease-out) 0.2s both;
	}
	@keyframes grow {
		from {
			transform: scaleX(0);
		}
		to {
			transform: scaleX(1);
		}
	}
	.step {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		gap: 0.6rem;
	}
	.num {
		width: 58px;
		height: 58px;
		display: grid;
		place-items: center;
		border-radius: 50%;
		background: var(--bg-elev);
		border: 1px solid var(--gold);
		color: var(--gold);
		font-family: var(--font-display);
		font-size: 1.6rem;
		position: relative;
		z-index: 1;
	}
	h3 {
		font-family: var(--font-sans);
		font-weight: 700;
		font-size: 1.3rem;
	}
	p {
		color: var(--text-muted);
		max-width: 26ch;
	}
	@media (prefers-reduced-motion: reduce) {
		.line {
			animation: none;
		}
	}
	@media (max-width: 768px) {
		.steps {
			grid-template-columns: 1fr;
			gap: 2.5rem;
		}
		.line {
			top: 0;
			bottom: 0;
			left: 28px;
			right: auto;
			width: 2px;
			height: auto;
			transform-origin: top;
			animation-name: growV;
		}
		@keyframes growV {
			from {
				transform: scaleY(0);
			}
			to {
				transform: scaleY(1);
			}
		}
		.step {
			flex-direction: row;
			text-align: left;
			align-items: flex-start;
			gap: 1.25rem;
		}
		p {
			max-width: none;
		}
	}
</style>
