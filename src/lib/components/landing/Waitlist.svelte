<script lang="ts">
	import { onMount } from 'svelte';
	import { audience } from '$lib/stores/audience.svelte';
	import {
		submitWaitlist,
		persistJoin,
		loadStoredJoin,
		makeRefCode,
		readReferredBy
	} from '$lib/waitlist';
	import { waitlistScale, referral } from '$lib/content';
	import AudienceToggle from '$lib/components/AudienceToggle.svelte';
	import { reveal } from '$lib/actions/reveal';

	let email = $state('');
	let scale = $state('');
	let loading = $state(false);
	let submitted = $state(false);
	let errorMsg = $state('');
	let restored = $state(false);

	let refCode = $state('');
	let referredBy = $state('');
	let origin = $state('');
	let copied = $state(false);

	const refLink = $derived(refCode && origin ? `${origin}/?ref=${refCode}` : '');

	// Reset the qualifying answer when the user switches role (the question changes).
	let lastRole = audience.value;
	$effect(() => {
		if (audience.value !== lastRole) {
			lastRole = audience.value;
			if (!restored) scale = '';
		}
	});

	async function onSubmit(e: Event) {
		e.preventDefault();
		errorMsg = '';
		loading = true;
		const res = await submitWaitlist({ email, role: audience.value, scale, refCode, referredBy });
		loading = false;
		if (!res.ok) {
			errorMsg =
				res.error === 'email-required'
					? 'Enter a valid email.'
					: 'Something went wrong. Please try again.';
			return;
		}
		persistJoin({ email, role: audience.value, scale, refCode, referredBy });
		submitted = true;
		const { default: confetti } = await import('canvas-confetti');
		confetti({
			particleCount: 130,
			spread: 75,
			origin: { y: 0.6 },
			colors: ['#FFD877', '#E0B23A', '#F4ECE0']
		});
	}

	async function copyLink() {
		try {
			await navigator.clipboard.writeText(refLink);
			copied = true;
			setTimeout(() => (copied = false), 2000);
		} catch {
			/* clipboard blocked; user can still select the link manually */
		}
	}

	onMount(() => {
		origin = window.location.origin;
		referredBy = readReferredBy();
		const stored = loadStoredJoin();
		if (stored) {
			restored = true;
			email = stored.email;
			scale = stored.scale ?? '';
			refCode = stored.refCode ?? makeRefCode();
			audience.set(stored.role);
			submitted = true;
		} else {
			refCode = makeRefCode();
		}
	});
</script>

<section id="waitlist" class="waitlist">
	<div class="glow" aria-hidden="true"></div>
	<div class="inner">
		<div class="pitch">
			<p class="kicker" use:reveal>Early access</p>
			<h2 use:reveal={{ delay: 60 }}>Be there from the first note.</h2>
			<p class="sub" use:reveal={{ delay: 120 }}>
				Join the waitlist for early access and founding-member perks. Fans and artists welcome.
			</p>
			<ul class="ticks" use:reveal={{ delay: 180 }}>
				{#each ['No card required to join', 'Founding-member status for early signups', 'We onboard in waves, first in line gets in first'] as tick (tick)}
					<li>
						<span class="tick" aria-hidden="true">
							<svg
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="3"
								stroke-linecap="round"
								stroke-linejoin="round"><polyline points="20 6 9 17 4 12" /></svg
							>
						</span>
						<span>{tick}</span>
					</li>
				{/each}
			</ul>
		</div>

		<div class="form-card" use:reveal={{ delay: 140, y: 30 }}>
			{#if submitted}
				<div class="success">
					<div class="success-icon">
						<svg
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2.5"
							stroke-linecap="round"
							stroke-linejoin="round"><polyline points="20 6 9 17 4 12" /></svg
						>
					</div>
					<p class="success-title" role="status">You're on the list.</p>
					<p class="success-note">
						Now skip the queue: share your link. Refer a friend and earn {referral.rateEarly} of our
						commission as an early member.
					</p>

					<div class="ref">
						<span class="ref-label">Your referral link</span>
						<div class="ref-row">
							<input
								class="ref-input"
								type="text"
								readonly
								value={refLink}
								aria-label="Your referral link"
							/>
							<button type="button" class="copy" onclick={copyLink}
								>{copied ? 'Copied' : 'Copy'}</button
							>
						</div>
					</div>
				</div>
			{:else}
				<form onsubmit={onSubmit} novalidate>
					<div class="toggle-wrap"><AudienceToggle /></div>

					<label class="field">
						<span>Email address</span>
						<input
							type="email"
							autocomplete="email"
							inputmode="email"
							bind:value={email}
							placeholder="you@email.com"
							required
						/>
					</label>

					<label class="field">
						<span>{waitlistScale[audience.value].label}</span>
						<div class="select-wrap">
							<select bind:value={scale} aria-label={waitlistScale[audience.value].label}>
								<option value="">{waitlistScale[audience.value].placeholder}</option>
								{#each waitlistScale[audience.value].options as opt (opt.value)}
									<option value={opt.value}>{opt.label}</option>
								{/each}
							</select>
							<svg
								class="chevron"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2.2"
								aria-hidden="true"
								><path d="M6 9l6 6 6-6" stroke-linecap="round" stroke-linejoin="round" /></svg
							>
						</div>
					</label>

					{#if errorMsg}<p class="error" role="alert">{errorMsg}</p>{/if}

					<button type="submit" disabled={loading}
						>{loading ? 'Joining…' : 'Join the waitlist'}</button
					>
					<p class="reassure">Free to join. No spam. Unsubscribe anytime.</p>
				</form>
			{/if}
		</div>
	</div>
</section>

<style lang="scss">
	.waitlist {
		position: relative;
		padding: clamp(6rem, 14vh, 11rem) clamp(1.25rem, 5vw, 3rem);
		overflow: hidden;
	}
	.glow {
		position: absolute;
		top: 30%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: min(1000px, 95vw);
		height: 600px;
		background: radial-gradient(closest-side, var(--glow), transparent 70%);
		filter: blur(60px);
		opacity: 0.55;
		pointer-events: none;
	}
	.inner {
		position: relative;
		z-index: 1;
		max-width: var(--maxw);
		margin: 0 auto;
		display: grid;
		grid-template-columns: 1fr 0.95fr;
		gap: clamp(2.5rem, 6vw, 5rem);
		align-items: center;
	}

	/* ── Left pitch ── */
	.kicker {
		text-transform: uppercase;
		letter-spacing: 4px;
		font-size: 0.8rem;
		color: var(--gold);
		margin-bottom: 1rem;
	}
	h2 {
		font-style: italic;
		font-size: clamp(2.2rem, 6vw, 3.8rem);
		line-height: 1.05;
		max-width: 14ch;
	}
	.sub {
		color: var(--text-muted);
		margin: 1.25rem 0 2rem;
		max-width: 44ch;
		font-size: 1.05rem;
		line-height: 1.6;
	}
	.ticks {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 0.85rem;
		li {
			display: flex;
			align-items: center;
			gap: 0.75rem;
			color: var(--text);
			font-size: 0.98rem;
			line-height: 1.4;
		}
	}
	.tick {
		flex: none;
		width: 22px;
		height: 22px;
		display: grid;
		place-items: center;
		border-radius: 50%;
		background: rgba(255, 216, 119, 0.12);
		border: 1px solid rgba(255, 216, 119, 0.4);
		color: var(--gold);
		svg {
			width: 12px;
			height: 12px;
		}
	}

	/* ── Right form card ── */
	.form-card {
		background: rgba(255, 255, 255, 0.025);
		backdrop-filter: blur(18px);
		-webkit-backdrop-filter: blur(18px);
		border: 1px solid rgba(255, 216, 119, 0.16);
		border-radius: 24px;
		padding: clamp(2rem, 4vw, 2.75rem);
		box-shadow:
			0 40px 80px -30px rgba(0, 0, 0, 0.6),
			inset 0 1px 0 rgba(255, 255, 255, 0.04);
	}
	form {
		display: flex;
		flex-direction: column;
		gap: 1.35rem;
	}
	.toggle-wrap {
		display: flex;
		justify-content: center;
		margin-bottom: 0.25rem;
	}
	.field {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		text-align: left;
		span {
			color: var(--gold);
			font-size: 0.82rem;
			font-weight: 600;
			text-transform: uppercase;
			letter-spacing: 1px;
		}
	}
	input,
	select {
		width: 100%;
		padding: 0.9rem 1.1rem;
		min-height: 52px;
		border-radius: 12px;
		border: 1px solid rgba(244, 236, 224, 0.12);
		background: rgba(0, 0, 0, 0.25);
		color: var(--text);
		font-size: 1rem;
		font-family: var(--font-sans);
		transition: all var(--dur-base) var(--ease-out);
		&:focus-visible {
			border-color: var(--gold);
			background: rgba(0, 0, 0, 0.4);
			box-shadow: 0 0 15px rgba(255, 216, 119, 0.1);
			outline: none;
		}
	}
	.select-wrap {
		position: relative;
	}
	select {
		padding-right: 2.6rem;
		cursor: pointer;
		appearance: none;
		-webkit-appearance: none;
		option {
			background: var(--bg-elev);
			color: var(--text);
		}
	}
	.chevron {
		position: absolute;
		right: 1rem;
		top: 50%;
		transform: translateY(-50%);
		width: 18px;
		height: 18px;
		color: var(--gold);
		pointer-events: none;
	}
	button {
		min-height: 54px;
		border-radius: 12px;
		border: 0;
		background: linear-gradient(135deg, #ffe6a0 0%, var(--gold) 45%, var(--gold-deep) 100%);
		color: #1a1a1a;
		font: 700 1.05rem var(--font-sans);
		cursor: pointer;
		box-shadow: 0 10px 30px -8px var(--glow);
		transition: all var(--dur-base) var(--ease-out);
		&:hover:not(:disabled) {
			transform: translateY(-2px);
			filter: brightness(1.05);
		}
		&:active:not(:disabled) {
			transform: translateY(0);
		}
		&:disabled {
			opacity: 0.6;
			cursor: not-allowed;
		}
	}
	.reassure {
		color: var(--text-muted);
		font-size: 0.82rem;
		text-align: center;
		opacity: 0.8;
		margin: 0;
	}
	.error {
		color: #ff7878;
		font-size: 0.9rem;
		margin: -0.5rem 0 0;
		text-align: left;
	}

	/* ── Success ── */
	.success {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		gap: 0.75rem;
		padding: 1.5rem 0;
	}
	.success-icon {
		width: 60px;
		height: 60px;
		display: grid;
		place-items: center;
		border-radius: 50%;
		background: rgba(57, 229, 140, 0.1);
		color: #39e58c;
		border: 1px solid rgba(57, 229, 140, 0.25);
		margin-bottom: 0.5rem;
		svg {
			width: 26px;
			height: 26px;
		}
	}
	.success-title {
		color: var(--gold);
		font-size: 1.5rem;
		font-family: var(--font-display);
		font-style: italic;
		margin: 0;
	}
	.success-note {
		color: var(--text-muted);
		margin: 0;
		font-size: 0.98rem;
		max-width: 38ch;
	}
	.ref {
		width: 100%;
		margin-top: 1.5rem;
		text-align: left;
	}
	.ref-label {
		display: block;
		color: var(--gold);
		font-size: 0.78rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 1px;
		margin-bottom: 0.5rem;
	}
	.ref-row {
		display: flex;
		gap: 0.5rem;
	}
	.ref-input {
		flex: 1;
		min-width: 0;
		padding: 0.75rem 0.9rem;
		min-height: 48px;
		border-radius: 10px;
		border: 1px solid rgba(244, 236, 224, 0.12);
		background: rgba(0, 0, 0, 0.3);
		color: var(--text);
		font-size: 0.9rem;
		font-family: var(--font-sans);
	}
	.copy {
		flex: none;
		min-height: 48px;
		padding: 0 1.1rem;
		border-radius: 10px;
		border: 1px solid rgba(255, 216, 119, 0.4);
		background: rgba(255, 216, 119, 0.08);
		color: var(--gold);
		font-weight: 700;
		font-size: 0.9rem;
		cursor: pointer;
		transition: all var(--dur-base) var(--ease-out);
		&:hover {
			background: var(--gold);
			color: #1a1a1a;
		}
	}

	@media (max-width: 880px) {
		.inner {
			grid-template-columns: 1fr;
			gap: 2.5rem;
		}
		h2 {
			max-width: none;
		}
	}
</style>
