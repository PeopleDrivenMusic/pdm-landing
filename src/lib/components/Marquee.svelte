<script lang="ts">
	let { items = [] as string[], speed = 30 }: { items?: string[]; speed?: number } = $props();
</script>

<div class="marquee" aria-hidden="true">
	<div class="track" style="--speed:{speed}s">
		{#each [...items, ...items] as item, i (i)}
			<span class="item">{item}</span>
		{/each}
	</div>
</div>

<style lang="scss">
	.marquee {
		overflow: hidden;
		width: 100%;
		mask-image: linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent);
	}
	.track {
		display: inline-flex;
		gap: 3rem;
		white-space: nowrap;
		animation: scroll var(--speed) linear infinite;
	}
	.item {
		color: var(--text-muted);
		font: 500 1.1rem var(--font-sans);
		letter-spacing: 1px;
	}
	@keyframes scroll {
		to {
			transform: translateX(-50%);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.track {
			animation: none;
		}
	}
</style>
