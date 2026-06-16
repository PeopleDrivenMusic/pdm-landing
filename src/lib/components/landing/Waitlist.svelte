<script lang="ts">
	import { onMount } from 'svelte';
	import confetti from 'canvas-confetti';
	import { audience } from '$lib/stores/audience.svelte';
	import { submitWaitlist, persistJoin, loadStoredJoin } from '$lib/waitlist';
	import AudienceToggle from '$lib/components/AudienceToggle.svelte';
	import Soundwave from '$lib/components/Soundwave.svelte';

	let email = $state('');
	let loading = $state(false);
	let submitted = $state(false);
	let errorMsg = $state('');

	async function onSubmit(e: Event) {
		e.preventDefault();
		errorMsg = '';
		loading = true;
		const res = await submitWaitlist({ email, role: audience.value });
		loading = false;
		if (!res.ok) {
			errorMsg =
				res.error === 'email-required'
					? 'Enter a valid email.'
					: 'Something went wrong — try again.';
			return;
		}
		persistJoin({ email, role: audience.value });
		submitted = true;
		confetti({
			particleCount: 120,
			spread: 70,
			origin: { y: 0.6 },
			colors: ['#FFD877', '#E0B23A', '#F4ECE0']
		});
	}

	onMount(() => {
		const stored = loadStoredJoin();
		if (stored) {
			email = stored.email;
			audience.set(stored.role);
			submitted = true;
		}
	});
</script>

<section id="waitlist" class="waitlist">
	<div class="glow" aria-hidden="true"></div>
	<h2>Be there from the first note.</h2>
	<p class="sub">Join the waitlist for early access. Fans and artists welcome.</p>

	{#if submitted}
		<p class="success" role="status">You're on the list. We'll be in touch. 🎶</p>
	{:else}
		<form onsubmit={onSubmit} novalidate>
			<AudienceToggle />
			<label class="field">
				<span>Email</span>
				<input
					type="email"
					autocomplete="email"
					bind:value={email}
					placeholder="you@email.com"
					required
				/>
			</label>
			{#if errorMsg}<p class="error" role="alert">{errorMsg}</p>{/if}
			<button type="submit" disabled={loading}>{loading ? 'Joining…' : 'Join the waitlist'}</button>
		</form>
	{/if}
	<div class="wave"><Soundwave height={90} /></div>
</section>

<style lang="scss">
	.waitlist {
		position: relative;
		text-align: center;
		padding: clamp(6rem, 14vh, 11rem) 1.5rem;
		overflow: hidden;
	}
	.glow {
		position: absolute;
		inset: 0;
		background: radial-gradient(closest-side, var(--glow), transparent 70%);
		filter: blur(40px);
		z-index: 0;
	}
	h2 {
		position: relative;
		z-index: 1;
		font-style: italic;
		font-size: clamp(2.2rem, 6vw, 4rem);
	}
	.sub {
		position: relative;
		z-index: 1;
		color: var(--text-muted);
		margin: 1rem auto 2rem;
		max-width: 48ch;
	}
	form {
		position: relative;
		z-index: 1;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		max-width: 440px;
		margin: 0 auto;
		align-items: stretch;
	}
	.field {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
		text-align: left;
		span {
			color: var(--gold);
			font-size: 0.9rem;
		}
	}
	input {
		padding: 0.9rem 1rem;
		min-height: 48px;
		border-radius: 10px;
		border: 1px solid var(--line);
		background: rgba(255, 255, 255, 0.04);
		color: var(--text);
		font-size: 1rem;
		&:focus-visible {
			border-color: var(--gold);
		}
	}
	button {
		min-height: 48px;
		border-radius: 10px;
		border: 0;
		background: var(--gold);
		color: #1a1a1a;
		font: 700 1.05rem var(--font-sans);
		cursor: pointer;
		transition: filter var(--dur-base) var(--ease-out);
		&:hover {
			filter: brightness(1.06);
		}
		&:disabled {
			opacity: 0.6;
			cursor: not-allowed;
		}
	}
	.error {
		color: #ff8a8a;
	}
	.success {
		position: relative;
		z-index: 1;
		color: var(--gold);
		font-size: 1.2rem;
	}
	.wave {
		position: relative;
		z-index: 1;
		margin-top: 2.5rem;
		opacity: 0.7;
	}
</style>
