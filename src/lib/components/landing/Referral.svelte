<script lang="ts">
	import { reveal } from '$lib/actions/reveal';
	import { referral } from '$lib/content';
</script>

<section id="referral" class="referral">
	<div class="card" use:reveal={{ y: 30 }}>
		<div class="glow" aria-hidden="true"></div>
		<div class="text">
			<p class="kicker">{referral.kicker}</p>
			<h2>{referral.heading}</h2>
			<p class="body">{referral.body}</p>
			<a class="cta" href="#waitlist">Get your referral link</a>
		</div>

		<div class="rate" aria-hidden="true">
			<span class="rate-label">You earn</span>
			<div class="rate-figure">
				<span class="old">{referral.rateDefault}</span>
				<span class="new">{referral.rateEarly}</span>
			</div>
			<span class="rate-note">for early-access members</span>
		</div>
	</div>
</section>

<style lang="scss">
	.referral {
		padding: clamp(4rem, 9vh, 7rem) clamp(1.25rem, 5vw, 3rem);
	}
	.card {
		position: relative;
		max-width: var(--maxw);
		margin: 0 auto;
		display: grid;
		grid-template-columns: 1.3fr 0.7fr;
		gap: clamp(2rem, 5vw, 4rem);
		align-items: center;
		overflow: hidden;
		border: 1px solid rgba(255, 216, 119, 0.18);
		border-radius: 28px;
		background:
			radial-gradient(120% 160% at 100% 0%, rgba(255, 216, 119, 0.08), transparent 55%),
			rgba(20, 20, 26, 0.5);
		backdrop-filter: blur(16px);
		-webkit-backdrop-filter: blur(16px);
		padding: clamp(2.25rem, 5vw, 4rem);
		box-shadow:
			0 40px 90px -36px rgba(0, 0, 0, 0.7),
			inset 0 1px 0 rgba(255, 255, 255, 0.04);
	}
	.glow {
		position: absolute;
		top: -40%;
		right: -10%;
		width: 50%;
		height: 120%;
		background: radial-gradient(closest-side, rgba(255, 216, 119, 0.16), transparent 70%);
		filter: blur(60px);
		pointer-events: none;
	}
	.text {
		position: relative;
	}
	.kicker {
		text-transform: uppercase;
		letter-spacing: 4px;
		font-size: 0.8rem;
		color: var(--gold);
		margin-bottom: 1rem;
	}
	h2 {
		font-size: clamp(2rem, 4.5vw, 3.2rem);
		font-style: italic;
		line-height: 1.05;
		max-width: 16ch;
	}
	.body {
		color: var(--text-muted);
		font-size: clamp(1.02rem, 1.6vw, 1.2rem);
		max-width: 46ch;
		margin-top: 1.25rem;
		line-height: 1.6;
	}
	.cta {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-height: 50px;
		margin-top: 1.75rem;
		padding: 0 1.6rem;
		border-radius: 999px;
		background: var(--gold);
		color: #1a1a1a;
		font-weight: 700;
		font-size: 0.98rem;
		transition: all var(--dur-base) var(--ease-out);
		&:hover {
			transform: translateY(-2px);
			filter: brightness(1.05);
		}
	}
	.rate {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		gap: 0.4rem;
		padding: clamp(1.5rem, 3vw, 2rem);
		border-left: 1px solid var(--line);
	}
	.rate-label {
		text-transform: uppercase;
		letter-spacing: 2px;
		font-size: 0.72rem;
		color: var(--text-muted);
	}
	.rate-figure {
		display: flex;
		align-items: baseline;
		gap: 0.6rem;
	}
	.old {
		font-family: var(--font-display);
		font-style: italic;
		font-size: clamp(1.4rem, 3vw, 2rem);
		color: var(--text-muted);
		opacity: 0.55;
		text-decoration: line-through;
		text-decoration-color: rgba(244, 236, 224, 0.35);
	}
	.new {
		font-family: var(--font-display);
		font-style: italic;
		font-size: clamp(3rem, 8vw, 5rem);
		line-height: 1;
		color: var(--gold);
		text-shadow: 0 0 30px rgba(255, 216, 119, 0.2);
	}
	.rate-note {
		font-size: 0.82rem;
		color: var(--text-muted);
		max-width: 18ch;
	}
	@media (max-width: 820px) {
		.card {
			grid-template-columns: 1fr;
			gap: 2rem;
		}
		h2 {
			max-width: none;
		}
		.rate {
			border-left: 0;
			border-top: 1px solid var(--line);
			padding-top: 2rem;
		}
	}
</style>
