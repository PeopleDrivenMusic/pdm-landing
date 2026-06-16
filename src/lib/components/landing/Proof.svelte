<script lang="ts">
	import { reveal } from '$lib/actions/reveal';
	import Marquee from '$lib/components/Marquee.svelte';
	import { genres } from '$lib/content';

	const perks = [
		{ title: 'Founding-member perks', desc: 'Lifetime badge and early-supporter status on your favourite artists.' },
		{ title: 'First access', desc: 'Be first into the app, first to back artists, first to the drops.' },
		{ title: 'Shape the product', desc: 'Early members help decide what PDM becomes.' }
	];
</script>

<section class="proof">
	<div class="inner">
		<p class="kicker" use:reveal>The movement</p>
		<h2 use:reveal={{ delay: 80 }}>Join the founding wave.</h2>
		<p class="lede" use:reveal={{ delay: 160 }}>
			PDM is being built with its first fans and artists. Get in before the first note.
		</p>

		<div class="perks">
			{#each perks as perk, i}
				<article class="perk" use:reveal={{ delay: 200 + i * 80, y: 28 }}>
					<h3>{perk.title}</h3>
					<p>{perk.desc}</p>
				</article>
			{/each}
		</div>
	</div>

	<div class="marquee-wrap" use:reveal={{ delay: 200 }}>
		<Marquee items={genres} />
	</div>
</section>

<style lang="scss">
	.proof {
		padding: clamp(6rem, 12vh, 10rem) 0;
	}
	.inner {
		max-width: var(--maxw);
		margin: 0 auto;
		padding: 0 clamp(1.25rem, 5vw, 3rem);
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
	.lede {
		color: var(--text-muted);
		font-size: clamp(1.05rem, 2vw, 1.3rem);
		max-width: 48ch;
		margin: 1.5rem auto 3rem;
	}
	.perks {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
		gap: 1.25rem;
		text-align: left;
	}
	.perk {
		background: var(--bg-elev);
		border: 1px solid var(--line);
		border-radius: 14px;
		padding: 1.75rem;
		h3 {
			font-family: var(--font-sans);
			font-weight: 700;
			font-size: 1.15rem;
			color: var(--gold);
			margin-bottom: 0.5rem;
		}
		p {
			color: var(--text-muted);
			line-height: 1.55;
		}
	}
	.marquee-wrap {
		margin-top: clamp(3rem, 8vh, 5rem);
		border-top: 1px solid var(--line);
		border-bottom: 1px solid var(--line);
		padding: 1.5rem 0;
	}
</style>
