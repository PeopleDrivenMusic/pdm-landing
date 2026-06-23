<script lang="ts">
	let {
		items = [] as string[],
		speed = 30,
		reverse = false
	}: { items?: string[]; speed?: number; reverse?: boolean } = $props();
</script>

<div class="marquee" aria-hidden="true" class:reverse>
	<div class="track" style="--speed:{speed}s">
		{#each [...items, ...items, ...items] as item, i (i)}
			<span class="item">{item}</span>
		{/each}
	</div>
</div>

<style lang="scss">
	.marquee {
		overflow: hidden;
		width: 100%;
		mask-image: linear-gradient(to right, transparent, #000 15%, #000 85%, transparent);
		-webkit-mask-image: linear-gradient(to right, transparent, #000 15%, #000 85%, transparent);
		display: flex;
	}
	.track {
		display: flex;
		gap: 3rem;
		white-space: nowrap;
		animation: scroll var(--speed) linear infinite;
		will-change: transform;
	}
	.reverse .track {
		animation-direction: reverse;
	}
	.item {
		color: var(--text-muted);
		font: 500 1.1rem var(--font-sans);
		letter-spacing: 2px;
		text-transform: uppercase;
		display: inline-flex;
		align-items: center;
		
		&::after {
			content: '•';
			margin-left: 3rem;
			color: rgba(255, 216, 119, 0.4);
		}
	}
	@keyframes scroll {
		to {
			transform: translate3d(-33.33%, 0, 0);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.track {
			animation: none;
		}
	}
</style>
