<script lang="ts">
	import { audience, type Audience } from '$lib/stores/audience.svelte';
	let { size = 'md' }: { size?: 'sm' | 'md' } = $props();
	const options: { value: Audience; label: string }[] = [
		{ value: 'fan', label: "I'm a fan" },
		{ value: 'artist', label: "I'm an artist" }
	];

	function onKeydown(e: KeyboardEvent) {
		if (
			e.key === 'ArrowLeft' ||
			e.key === 'ArrowRight' ||
			e.key === 'ArrowUp' ||
			e.key === 'ArrowDown'
		) {
			e.preventDefault();
			audience.toggle();
		}
	}
</script>

<div class="toggle {size}" role="radiogroup" aria-label="Choose your role">
	{#each options as opt (opt.value)}
		<button
			type="button"
			role="radio"
			aria-checked={audience.value === opt.value}
			tabindex={audience.value === opt.value ? 0 : -1}
			class:on={audience.value === opt.value}
			onclick={() => audience.set(opt.value)}
			onkeydown={onKeydown}
		>
			{opt.label}
		</button>
	{/each}
</div>

<style lang="scss">
	.toggle {
		display: inline-flex;
		gap: 2px;
		padding: 4px;
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.07);
		border: 1px solid var(--line);
		button {
			cursor: pointer;
			border: 0;
			background: transparent;
			color: var(--text-muted);
			font: 500 0.95rem var(--font-sans);
			padding: 10px 18px;
			min-height: 44px;
			border-radius: 999px;
			transition:
				color var(--dur-base) var(--ease-out),
				background var(--dur-base) var(--ease-out);
			&.on {
				background: var(--gold);
				color: #1a1a1a;
				font-weight: 700;
			}
		}
		&.sm button {
			padding: 6px 12px;
			min-height: 36px;
			font-size: 0.8rem;
		}
	}
</style>
