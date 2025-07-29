<script>
	let { disabled= false, click, text } = $props();
</script>

<button class="button" class:disabled onclick={click}> 
    {@render text()}
</button>

<style lang="scss">
	/* your styles go here */
	.button {
		padding: 1rem 2rem;
		font-size: 1.2rem;
		font-weight: 600;
		border: 2px solid #fcd34d;
		border-radius: 0.75rem;
		background-color: transparent;
		color: #fff;
		cursor: pointer;
		position: relative;
		z-index: 1;
		overflow: hidden;
		transition: all 0.3s ease;

		box-shadow:
			0 0 5px #fcd34d66,
			0 0 10px #fcd34d44,
			inset 0 0 5px #fcd34d33;

		&:hover {
			background-color: #fcd34d22;
			color: #fff;
			box-shadow:
				0 0 8px #fcd34d99,
				0 0 20px #fcd34d66,
				inset 0 0 10px #fcd34d44;
			transform: scale(1.02);
		}

		&:active {
			transform: scale(0.98);
			box-shadow:
				0 0 5px #fcd34dcc,
				0 0 15px #fcd34d88,
				inset 0 0 8px #fcd34d55;
		}

		&::before {
			content: '';
			position: absolute;
			inset: 0;
			background: radial-gradient(circle, #fcd34d33 0%, transparent 70%);
			z-index: -1;
			animation: pulse-btn 4s ease-in-out infinite;
			border-radius: inherit;
		}

		&.disabled {
			cursor: not-allowed;
			opacity: 0.5;
			transform: none;
			box-shadow: none;
			border-color: #fcd34d55;
			color: #ccc;

			&::before {
				animation: none;
				background: transparent;
			}
		}
	}

	@keyframes pulse-btn {
		0% {
			opacity: 0.5;
			transform: scale(1);
		}
		50% {
			opacity: 1;
			transform: scale(1.05);
		}
		100% {
			opacity: 0.5;
			transform: scale(1);
		}
	}
</style>
