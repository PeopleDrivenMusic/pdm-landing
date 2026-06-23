<script lang="ts">
	import { fade } from 'svelte/transition';
	import { reveal } from '$lib/actions/reveal';
	import { audience, type Audience } from '$lib/stores/audience.svelte';
	import { steps } from '$lib/content';

	const headings: Record<Audience, string> = {
		fan: 'From first listen to front row.',
		artist: 'Your space, your fans, your terms.'
	};
</script>

<section id="how" class="how">
	<div class="inner">
		<p class="kicker" use:reveal>How it works</p>
		{#key audience.value}
			<h2 use:reveal={{ delay: 80 }} in:fade={{ duration: 280 }}>{headings[audience.value]}</h2>
		{/key}

		{#key audience.value}
			<ol class="steps" in:fade={{ duration: 280 }}>
				<div class="line" use:reveal={{ delay: 120 }} aria-hidden="true"></div>
				{#each steps[audience.value] as step, i (step.n)}
					<li class="step" use:reveal={{ delay: 160 + i * 130, y: 30 }}>
						<span class="num">{step.n}</span>
						<h3>{step.title}</h3>
						<p>{step.desc}</p>
					</li>
				{/each}
			</ol>
		{/key}
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
		margin-bottom: clamp(3.5rem, 8vh, 5.5rem);
	}
	.steps {
		position: relative;
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: clamp(1.5rem, 4vw, 3rem);
	}
	.line {
		position: absolute;
		top: 33px;
		left: 18%;
		right: 18%;
		height: 1px;
		background: linear-gradient(90deg, transparent, var(--gold), transparent);
		transform-origin: left;
		animation: grow 1.2s var(--ease-out) 0.3s both;
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
		gap: 0.85rem;
		position: relative;
		z-index: 1;
	}
	.num {
		width: 66px;
		height: 66px;
		display: grid;
		place-items: center;
		border-radius: 50%;
		background: var(--bg);
		border: 1px solid rgba(255, 216, 119, 0.4);
		color: var(--gold);
		font-family: var(--font-display);
		font-style: italic;
		font-size: 1.8rem;
		box-shadow: 0 0 28px rgba(255, 216, 119, 0.14);
		transition: all var(--dur-base) var(--ease-out);
	}
	.step:hover .num {
		background: var(--gold);
		color: #1a1a1a;
		box-shadow: 0 0 26px rgba(255, 216, 119, 0.4);
	}
	h3 {
		font-family: var(--font-sans);
		font-weight: 700;
		font-size: 1.3rem;
		color: var(--text);
		margin-top: 0.5rem;
	}
	p {
		color: var(--text-muted);
		max-width: 26ch;
		font-size: 0.96rem;
		line-height: 1.6;
		margin: 0;
	}
	@media (prefers-reduced-motion: reduce) {
		.line {
			animation: none;
		}
	}
	@media (max-width: 768px) {
		.steps {
			grid-template-columns: 1fr;
			gap: 2.75rem;
		}
		.line {
			top: 0;
			bottom: 0;
			left: 33px;
			right: auto;
			width: 1px;
			height: auto;
			background: linear-gradient(180deg, transparent, var(--gold), transparent);
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
			align-items: flex-start;
			text-align: left;
			gap: 1.5rem;
		}
		.num {
			flex: none;
		}
		h3 {
			margin-top: 0;
		}
		p {
			max-width: none;
		}
	}
</style>
