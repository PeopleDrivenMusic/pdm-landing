<script lang="ts">
	import { reveal } from '$lib/actions/reveal';
	import StatCounter from '$lib/components/StatCounter.svelte';
	import { shift } from '$lib/content';
</script>

<section class="shift">
	<div class="glow" aria-hidden="true"></div>
	<div class="inner">
		<p class="kicker" use:reveal>The shift</p>
		<h2 use:reveal={{ delay: 80 }}>{shift.heading}</h2>
		<p class="body" use:reveal={{ delay: 160 }}>{shift.body}</p>

		<div class="flow" use:reveal={{ delay: 220 }}>
			<span class="node">You</span>
			<span class="link"><span class="amount">$1</span></span>
			<span class="node artist">The artist</span>
		</div>

		<div class="share" use:reveal={{ delay: 300 }}>
			<StatCounter value={shift.artistShare} suffix="%" />
			<p class="caption">goes straight to the artist</p>
		</div>
	</div>
</section>

<style lang="scss">
	.shift {
		position: relative;
		padding: clamp(6rem, 12vh, 10rem) clamp(1.25rem, 5vw, 3rem);
		overflow: hidden;
	}
	.glow {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: min(800px, 90vw);
		height: 500px;
		background: radial-gradient(closest-side, var(--glow), transparent 70%);
		filter: blur(50px);
		opacity: 0.5;
		pointer-events: none;
	}
	.inner {
		position: relative;
		max-width: 900px;
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
		max-width: 16ch;
		margin: 0 auto;
	}
	.body {
		color: var(--text-muted);
		font-size: clamp(1.1rem, 2vw, 1.35rem);
		max-width: 54ch;
		margin: 1.5rem auto 0;
	}
	.flow {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 1rem;
		margin: clamp(3rem, 7vh, 4.5rem) auto 0;
		flex-wrap: wrap;
	}
	.node {
		border: 1px solid var(--line);
		border-radius: 999px;
		padding: 0.75rem 1.5rem;
		font-weight: 600;
		background: var(--bg-elev);
		&.artist {
			border-color: var(--gold);
			color: var(--gold);
		}
	}
	.link {
		position: relative;
		flex: 0 1 200px;
		height: 2px;
		background: var(--line);
		min-width: 120px;
		&::after {
			content: '';
			position: absolute;
			inset: 0;
			background: linear-gradient(90deg, var(--gold), var(--gold-deep));
			transform-origin: left;
			animation: fill 1s var(--ease-out) 0.3s both;
		}
	}
	.amount {
		position: absolute;
		top: -28px;
		left: 50%;
		transform: translateX(-50%);
		color: var(--gold);
		font-family: var(--font-display);
		font-weight: 600;
		font-size: 1.3rem;
	}
	@keyframes fill {
		from {
			transform: scaleX(0);
		}
		to {
			transform: scaleX(1);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.link::after {
			animation: none;
		}
	}
	.share {
		margin-top: clamp(3rem, 7vh, 4.5rem);
	}
	.caption {
		color: var(--text-muted);
		margin-top: 0.5rem;
		font-size: 1.1rem;
	}
</style>
