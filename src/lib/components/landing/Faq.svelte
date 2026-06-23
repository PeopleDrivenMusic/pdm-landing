<script lang="ts">
	import { reveal } from '$lib/actions/reveal';
	import { faq } from '$lib/content';
</script>

<section id="faq" class="faq">
	<div class="inner">
		<p class="kicker" use:reveal>Questions</p>
		<h2 use:reveal={{ delay: 80 }}>Everything you might ask.</h2>

		<div class="list">
			{#each faq as item, i (item.q)}
				<details class="item" use:reveal={{ delay: 120 + i * 60, y: 24 }}>
					<summary>
						<span class="q">{item.q}</span>
						<svg
							class="icon"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							aria-hidden="true"
						>
							<path d="M12 5v14M5 12h14" stroke-linecap="round" />
						</svg>
					</summary>
					<p class="a">{item.a}</p>
				</details>
			{/each}
		</div>
	</div>
</section>

<style lang="scss">
	.faq {
		padding: clamp(6rem, 12vh, 10rem) clamp(1.25rem, 5vw, 3rem);
	}
	.inner {
		max-width: 820px;
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
		margin-bottom: clamp(2.5rem, 6vh, 4rem);
	}
	.list {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		text-align: left;
	}
	.item {
		background: rgba(255, 255, 255, 0.02);
		border: 1px solid rgba(244, 236, 224, 0.06);
		border-radius: 14px;
		backdrop-filter: blur(8px);
		-webkit-backdrop-filter: blur(8px);
		overflow: hidden;
		transition:
			border-color var(--dur-base) var(--ease-out),
			background var(--dur-base) var(--ease-out);

		&:hover {
			border-color: rgba(255, 216, 119, 0.2);
		}
		&[open] {
			border-color: rgba(255, 216, 119, 0.25);
			background: rgba(255, 255, 255, 0.035);
		}
	}
	summary {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding: 1.4rem 1.6rem;
		cursor: pointer;
		list-style: none;
		min-height: 44px;

		&::-webkit-details-marker {
			display: none;
		}
		&:focus-visible {
			outline: 2px solid var(--gold);
			outline-offset: -2px;
			border-radius: 14px;
		}
	}
	.q {
		font-family: var(--font-sans);
		font-weight: 600;
		font-size: clamp(1rem, 2vw, 1.15rem);
		color: var(--text);
	}
	.icon {
		width: 20px;
		height: 20px;
		flex: none;
		color: var(--gold);
		transition: transform var(--dur-base) var(--ease-out);
	}
	.item[open] .icon {
		transform: rotate(45deg);
	}
	.a {
		padding: 0 1.6rem 1.5rem;
		margin: 0;
		color: var(--text-muted);
		font-size: 1rem;
		line-height: 1.65;
		max-width: 65ch;
	}
	@media (prefers-reduced-motion: reduce) {
		.icon {
			transition: none;
		}
	}
</style>
