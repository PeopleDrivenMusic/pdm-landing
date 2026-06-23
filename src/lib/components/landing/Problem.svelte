<script lang="ts">
	import { fade } from 'svelte/transition';
	import { reveal } from '$lib/actions/reveal';
	import { audience } from '$lib/stores/audience.svelte';
	import { problem } from '$lib/content';
</script>

<section class="problem">
	<div class="inner">
		<div class="layout">
			<!-- Left: the thesis. Sticks while the ledger of pains scrolls past. -->
			<div class="thesis">
				<p class="kicker" use:reveal>{problem[audience.value].kicker}</p>
				{#key audience.value}
					<h2 use:reveal={{ delay: 60 }} in:fade={{ duration: 280 }}>
						{problem[audience.value].heading}
					</h2>
				{/key}
			</div>

			<!-- Right: the ledger of pains. -->
			{#key audience.value}
				<ol class="pains" in:fade={{ duration: 280 }}>
					{#each problem[audience.value].pains as pain, i (pain)}
						<li use:reveal={{ delay: i * 90, y: 24 }}>
							<span class="num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
							<p>{pain}</p>
						</li>
					{/each}
				</ol>
			{/key}
		</div>

		{#key audience.value}
			<p class="close" use:reveal in:fade={{ duration: 280 }}>
				{problem[audience.value].close}
			</p>
		{/key}
	</div>
</section>

<style lang="scss">
	.problem {
		position: relative;
		padding: clamp(6rem, 12vh, 10rem) clamp(1.25rem, 5vw, 3rem);
		overflow: hidden;
	}
	/* Faint ambient wash so the section reads as a distinct cinematic "act". */
	.problem::before {
		content: '';
		position: absolute;
		inset: 0;
		background: radial-gradient(60% 50% at 80% 0%, rgba(255, 216, 119, 0.05), transparent 70%);
		pointer-events: none;
	}
	.inner {
		position: relative;
		max-width: 1140px;
		margin: 0 auto;
	}
	.layout {
		display: grid;
		grid-template-columns: minmax(0, 0.82fr) minmax(0, 1.18fr);
		gap: clamp(2rem, 6vw, 5rem);
		align-items: start;
	}

	/* ---- Thesis (left) ---- */
	.thesis {
		position: sticky;
		top: clamp(6rem, 18vh, 10rem);
	}
	.kicker {
		text-transform: uppercase;
		letter-spacing: 4px;
		font-size: 0.8rem;
		color: var(--gold);
		margin-bottom: 1.25rem;
	}
	h2 {
		font-size: clamp(2rem, 4.4vw, 3.4rem);
		font-style: italic;
		line-height: 1.08;
		margin: 0;
		max-width: 14ch;
	}

	/* ---- Ledger of pains (right) ---- */
	.pains {
		list-style: none;
		margin: 0;
		padding: 0;
	}
	li {
		position: relative;
		display: grid;
		grid-template-columns: auto 1fr;
		gap: clamp(1.1rem, 2.5vw, 2rem);
		align-items: baseline;
		padding: clamp(1.5rem, 3vw, 2.1rem) 0;
		transition: transform var(--dur-base) var(--ease-out);
	}
	/* Animated gradient hairline above each row. */
	li::before {
		content: '';
		position: absolute;
		left: 0;
		right: 0;
		top: 0;
		height: 1px;
		background: linear-gradient(90deg, var(--line), transparent 85%);
	}
	li:last-child::after {
		content: '';
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		height: 1px;
		background: linear-gradient(90deg, var(--line), transparent 85%);
	}
	.num {
		font-family: var(--font-display);
		font-style: italic;
		font-size: clamp(1.8rem, 3.4vw, 2.8rem);
		line-height: 1;
		color: transparent;
		-webkit-text-stroke: 1px rgba(244, 236, 224, 0.28);
		font-variant-numeric: tabular-nums;
		transition:
			color var(--dur-base) var(--ease-out),
			-webkit-text-stroke-color var(--dur-base) var(--ease-out),
			text-shadow var(--dur-base) var(--ease-out);
	}
	li p {
		color: var(--text);
		font-size: clamp(1.05rem, 1.7vw, 1.35rem);
		line-height: 1.5;
		margin: 0;
	}
	li:hover {
		transform: translateX(6px);
		.num {
			color: var(--gold);
			-webkit-text-stroke-color: transparent;
			text-shadow: 0 0 26px rgba(255, 216, 119, 0.4);
		}
	}

	/* ---- Closing punchline ---- */
	.close {
		text-align: center;
		font-family: var(--font-display);
		font-style: italic;
		font-size: clamp(1.5rem, 3.2vw, 2.4rem);
		color: var(--text);
		max-width: 24ch;
		margin: clamp(4rem, 10vh, 6.5rem) auto 0;
		line-height: 1.3;
		&::before {
			content: '';
			display: block;
			width: 56px;
			height: 2px;
			background: linear-gradient(90deg, var(--gold), var(--gold-deep));
			border-radius: 2px;
			margin: 0 auto 1.8rem;
			box-shadow: 0 0 18px rgba(255, 216, 119, 0.35);
		}
	}

	@media (max-width: 820px) {
		.layout {
			grid-template-columns: 1fr;
			gap: clamp(2.25rem, 7vw, 3rem);
		}
		.thesis {
			position: static;
		}
		h2 {
			max-width: 18ch;
		}
	}
</style>
