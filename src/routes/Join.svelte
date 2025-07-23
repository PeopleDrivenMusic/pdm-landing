<script>
	import { onMount } from 'svelte';
	import Animate from './Animate.svelte';
	
	let email = $state();
	let role = $state('listener');
	let isLoading = $state(false);
	let submitted = $state(false);
	async function submit() {
		if (!email || !role || isLoading) {
			return;
		}
		try {
			isLoading = true;
			const res = await fetch('/api/whitelist', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, role })
			});
			isLoading = false;

			if (!res.ok) {
				return;
			}
			submitted = true;
			localStorage.setItem('pdm-join', JSON.stringify({ email, role }));
		} catch (e) {
			console.error(e);
			isLoading = false;
		}
	}


	onMount(() => {
		const storedData = localStorage.getItem('pdm-join');
		if (storedData) {
			const { email: storedEmail, role: storedRole } = JSON.parse(storedData);
			email = storedEmail;
			role = storedRole;
			submitted = true;
		}
	});
</script>

<section class="join">
	<Animate variant="fade" duration={1} delay={0}>
		<h2 class="neon-title">Join the revolution</h2>
	</Animate>

	<Animate variant="fade">
		<div class="form">
			<label>
				<span class="email-label">Email*</span>
				<input type="email" bind:value={email} name="" id="" placeholder="Enter your email" />
			</label>
			<div class="radio-group">
				<label class="radio-option">
					<input type="radio" bind:group={role} value="artist" />
					<span class="custom-radio"></span>
					<span class="label-text">I’m an artist</span>
				</label>

				<label class="radio-option">
					<input type="radio" bind:group={role} value="listener" />
					<span class="custom-radio"></span>
					<span class="label-text">I’m a listener</span>
				</label>
			</div>

			{#if submitted}
				<p class="success-message" >Thanks for joining! 💥</p>
			{:else}
				<button class="button" class:disabled={isLoading} onclick={submit}
					>{#if isLoading}
						submitting...
					{:else}
						Join revolution
					{/if}
				</button>
			{/if}
		</div>
	</Animate>
</section>

<style lang="scss">
	.join {
		position: relative;
		z-index: 0;
		padding: 5rem 2rem;
		color: rgb(255 255 255 / 0.7);
		overflow: visible;
		&::before {
			content: '';
			position: absolute;
			inset: 0;
			z-index: -1;
			background: radial-gradient(circle, rgba(255, 235, 59) 0%, transparent 70%);
			animation: pulse-bg 4s ease-in-out infinite;
			filter: blur(40px);
		}

		.form {
			padding-block: 2rem;
			max-width: 800px;
			display: flex;
			flex-direction: column;
			gap: 2rem;
			margin: auto;
			position: relative;
			overflow: visible;

			@keyframes pulse-bg {
				0%,
				100% {
					opacity: 0.1;
					transform: scale(1);
				}
				50% {
					opacity: 0.2;
					transform: scale(1.05);
				}
			}

			.email-label {
				color: var(--main-color);
				font-size: large;
			}

			input {
				width: 100%;
				padding: 1rem;
				border: 1px solid rgba(248, 213, 73, 0.1);
				border-radius: 8px;
				background: rgba(50, 50, 50, 0.5);
				color: white;
				font-size: 1rem;
				outline: none;
				filter: blur(1);
				transition:
					border-color 0.3s,
					background 0.3s;

				&:focus {
					border-color: var(--main-color);
					background: rgba(0, 0, 0, 0.7);
					box-shadow: 0 0 6px #fff17699;
				}
				&::placeholder {
					color: rgba(255, 255, 255, 0.5);
				}
			}
			.radio-group {
				display: flex;
				gap: 2rem;
				align-items: center;
			}

			.radio-option {
				display: flex;
				align-items: center;
				cursor: pointer;
				font-size: 1.1rem;
				color: rgba(255, 255, 255, 0.6);
				transition: color 0.3s ease;
			}

			.radio-option input[type='radio'] {
				display: none;
			}

			.custom-radio {
				position: relative;
				width: 20px;
				height: 20px;
				border: 2px solid #fcd34d;
				border-radius: 50%;
				margin-right: 0.5rem;
				box-sizing: border-box;
				display: flex;
				align-items: center;
				justify-content: center;
				transition:
					border 0.3s ease,
					box-shadow 0.3s ease;
			}

			.custom-radio::after {
				content: '';
				width: 10px;
				height: 10px;
				background-color: #fcd34d;
				border-radius: 50%;
				transform: scale(0);
				transition: transform 0.2s ease;
				box-shadow: 0 0 6px #fcd34d88;
			}

			input[type='radio']:checked + .custom-radio::after {
				transform: scale(1);
			}

			input[type='radio']:checked + .custom-radio {
				border-color: #fff176;
				box-shadow: 0 0 6px #fff17699;
			}

			input[type='radio']:checked + .custom-radio + .label-text {
				color: #fff;
			}

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
		}
	}

	/* HTML:  */
</style>
