<script lang="ts">
	import { reveal } from '$lib/actions/reveal';
	import AudienceToggle from '$lib/components/AudienceToggle.svelte';
	import { audience } from '$lib/stores/audience.svelte';
	import { benefits } from '$lib/content';
</script>

<section class="two-sides">
	<div class="inner">
		<p class="kicker" use:reveal>Two sides, one platform</p>
		<h2 use:reveal={{ delay: 80 }}>What you unlock.</h2>
		<div class="toggle" use:reveal={{ delay: 140 }}><AudienceToggle /></div>

		{#key audience.value}
			<div class="grid">
				{#each benefits[audience.value] as b, i (b.title)}
					<article class="card" use:reveal={{ delay: i * 60, y: 28 }}>
						<h3>{b.title}</h3>
						<p>{b.desc}</p>
					</article>
				{/each}
			</div>
		{/key}
	</div>
</section>

<style lang="scss">
	.two-sides {
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
	}
	.toggle {
		margin: 1.75rem 0 3rem;
	}
	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
		gap: 1.25rem;
		text-align: left;
	}
	.card {
		background: var(--bg-elev);
		border: 1px solid var(--line);
		border-left: 2px solid var(--gold);
		border-radius: 14px;
		padding: 1.75rem;
		transition:
			background var(--dur-base) var(--ease-out),
			border-color var(--dur-base) var(--ease-out),
			transform var(--dur-base) var(--ease-out);
		&:hover {
			background: var(--bg-elev-2);
			transform: translateY(-4px);
		}
		h3 {
			font-family: var(--font-sans);
			font-weight: 700;
			font-size: 1.2rem;
			color: var(--gold);
			margin-bottom: 0.5rem;
		}
		p {
			color: var(--text-muted);
			line-height: 1.55;
		}
	}
</style>
