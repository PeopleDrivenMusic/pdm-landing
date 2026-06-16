<script lang="ts">
	import { reveal } from '$lib/actions/reveal';
	import StatCounter from '$lib/components/StatCounter.svelte';
	import { problemStats } from '$lib/content';
</script>

<section class="problem">
	<div class="inner">
		<p class="kicker" use:reveal>The reality</p>
		<h2 use:reveal={{ delay: 80 }}>Streaming pays artists fractions of a cent.</h2>
		<p class="lede" use:reveal={{ delay: 160 }}>
			Fans became play-counts. Artists became content. The connection got lost in the algorithm.
		</p>

		<div class="stats">
			{#each problemStats as s, i}
				<div class="stat" use:reveal={{ delay: 200 + i * 120 }}>
					<StatCounter
						value={s.value}
						decimals={s.decimals}
						prefix={s.prefix ?? ''}
						suffix={s.suffix ?? ''}
					/>
					<p class="label">{s.label}</p>
				</div>
			{/each}
		</div>

		<blockquote use:reveal={{ delay: 300 }}>
			“The people who make the music we love see the least of what it earns.”
		</blockquote>
	</div>
</section>

<style lang="scss">
	.problem {
		padding: clamp(6rem, 12vh, 10rem) clamp(1.25rem, 5vw, 3rem);
	}
	.inner {
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
		font-size: clamp(2rem, 5vw, 3.5rem);
		font-style: italic;
		max-width: 16ch;
		margin: 0 auto;
	}
	.lede {
		color: var(--text-muted);
		font-size: clamp(1.1rem, 2vw, 1.4rem);
		max-width: 52ch;
		margin: 1.5rem auto 0;
	}
	.stats {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: clamp(2rem, 8vw, 6rem);
		margin: clamp(3rem, 8vh, 5rem) 0;
	}
	.stat {
		min-width: 220px;
	}
	.label {
		color: var(--text-muted);
		margin-top: 0.5rem;
		font-size: 1rem;
	}
	blockquote {
		margin: 0;
		font-family: var(--font-display);
		font-style: italic;
		font-size: clamp(1.3rem, 3vw, 2rem);
		color: var(--text);
		max-width: 24ch;
		margin: 0 auto;
		line-height: 1.3;
		&::before {
			content: '';
			display: block;
			width: 48px;
			height: 2px;
			background: var(--gold);
			margin: 0 auto 1.5rem;
		}
	}
</style>
