<script lang="ts">
	import { fade } from 'svelte/transition';
	import { reveal } from '$lib/actions/reveal';
	import { audience } from '$lib/stores/audience.svelte';
	import { benefits, benefitsIntro, unlockPass } from '$lib/content';
</script>

<section id="unlock" class="benefits">
	<div class="inner">
		{#key audience.value}
			<p class="kicker" use:reveal>{benefitsIntro[audience.value].kicker}</p>
			<h2 use:reveal={{ delay: 80 }} in:fade={{ duration: 280 }}>
				{benefitsIntro[audience.value].heading}
			</h2>
		{/key}

		{#key audience.value}
			<div class="pass" use:reveal={{ delay: 120, y: 30 }} in:fade={{ duration: 280 }}>
				<!-- Stub: the headline value of the membership. -->
				<aside class="stub">
					<div class="stub-top">
						<span class="big">{unlockPass[audience.value].big}</span>
						<span class="unit">{unlockPass[audience.value].unit}</span>
					</div>
					<span class="stub-rule" aria-hidden="true"></span>
					<div class="stub-bottom">
						<span class="pass-label">{unlockPass[audience.value].label}</span>
						<span class="brand">PDM</span>
					</div>
				</aside>

				<!-- Ticket perforation. -->
				<div class="perf" aria-hidden="true"></div>

				<!-- The unlocks, listed like a pass's inclusions. -->
				<ul class="unlocks">
					{#each benefits[audience.value] as b, i (b.title)}
						<li use:reveal={{ delay: 200 + i * 70, y: 16 }}>
							<span class="ico" aria-hidden="true">
								{#if b.title === 'Exclusive drops'}
									<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"
										><circle cx="12" cy="12" r="9" /><circle
											cx="12"
											cy="12"
											r="2.6"
											fill="currentColor"
											stroke="none"
										/></svg
									>
								{:else if b.title === 'Ad-free listening'}
									<svg
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="1.8"
										stroke-linecap="round"
										stroke-linejoin="round"
										><circle cx="12" cy="12" r="9" /><path d="M5.6 5.6l12.8 12.8" /></svg
									>
								{:else if b.title === 'Offline mode'}
									<svg
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="1.8"
										stroke-linecap="round"
										stroke-linejoin="round"
										><path d="M12 3v12" /><path d="M8 11l4 4 4-4" /><path d="M4 21h16" /></svg
									>
								{:else if b.title === 'Presale access'}
									<svg
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="1.8"
										stroke-linecap="round"
										stroke-linejoin="round"
										><path
											d="M3 8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2 2 2 0 0 0 0 4 2 2 0 0 1-2 2H5a2 2 0 0 1-2-2 2 2 0 0 0 0-4z"
										/><path d="M14 6v12" stroke-dasharray="2 2" /></svg
									>
								{:else if b.title === 'Community & comments'}
									<svg
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="1.8"
										stroke-linecap="round"
										stroke-linejoin="round"
										><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg
									>
								{:else if b.title === 'Direct income'}
									<svg
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="1.8"
										stroke-linecap="round"
										stroke-linejoin="round"
										><path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg
									>
								{:else if b.title === 'Your community'}
									<svg
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="1.8"
										stroke-linecap="round"
										stroke-linejoin="round"
										><circle cx="12" cy="8" r="3.2" /><path d="M5 20a7 7 0 0 1 14 0" /><circle
											cx="5"
											cy="10"
											r="1.6"
										/><circle cx="19" cy="10" r="1.6" /></svg
									>
								{:else if b.title === 'Feed & store'}
									<svg
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="1.8"
										stroke-linecap="round"
										stroke-linejoin="round"
										><path d="M4 9h16l-1 11H5z" /><path d="M8 9a4 4 0 0 1 8 0" /></svg
									>
								{:else if b.title === 'Fan analytics'}
									<svg
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="1.8"
										stroke-linecap="round"
										stroke-linejoin="round"><path d="M4 20V10M10 20V4M16 20v-7M22 20H2" /></svg
									>
								{:else}
									<svg
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="1.8"
										stroke-linecap="round"
										stroke-linejoin="round"
										><path d="M4 7h16M4 12h16M4 17h16" /><circle
											cx="9"
											cy="7"
											r="2"
											fill="currentColor"
											stroke="none"
										/><circle cx="15" cy="17" r="2" fill="currentColor" stroke="none" /></svg
									>
								{/if}
							</span>
							<div class="t">
								<h3>{b.title}</h3>
								<p>{b.desc}</p>
							</div>
							<span class="check" aria-hidden="true">
								<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"
									stroke-linecap="round" stroke-linejoin="round"><path d="M5 13l4 4L19 7" /></svg
								>
							</span>
						</li>
					{/each}
				</ul>
			</div>
		{/key}
	</div>
</section>

<style lang="scss">
	.benefits {
		padding: clamp(6rem, 12vh, 10rem) clamp(1.25rem, 5vw, 3rem);
	}
	.inner {
		max-width: 1080px;
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
		margin-bottom: clamp(3rem, 7vh, 4.5rem);
	}

	/* ---- The pass ---- */
	.pass {
		position: relative;
		display: grid;
		grid-template-columns: minmax(210px, 0.42fr) 1px minmax(0, 1fr);
		text-align: left;
		border-radius: 24px;
		overflow: hidden;
		border: 1px solid rgba(255, 255, 255, 0.08);
		background:
			linear-gradient(180deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.01)),
			var(--bg-elev);
		box-shadow:
			inset 0 1px 0 0 rgba(255, 255, 255, 0.05),
			0 40px 80px -42px rgba(0, 0, 0, 0.9);
	}

	/* ---- Stub (left) ---- */
	.stub {
		position: relative;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		gap: clamp(1.5rem, 4vw, 2.5rem);
		padding: clamp(1.8rem, 3.4vw, 2.75rem);
		background:
			radial-gradient(120% 95% at 0% 0%, rgba(255, 216, 119, 0.18), transparent 58%),
			linear-gradient(180deg, rgba(255, 216, 119, 0.06), rgba(255, 216, 119, 0.015));
	}
	.big {
		display: block;
		font-family: var(--font-display);
		font-style: italic;
		font-size: clamp(3rem, 6vw, 4.6rem);
		line-height: 0.85;
		color: var(--gold);
		text-shadow: 0 0 44px rgba(255, 216, 119, 0.28);
	}
	.unit {
		display: block;
		margin-top: 0.7rem;
		text-transform: uppercase;
		letter-spacing: 2.5px;
		font-size: 0.74rem;
		color: var(--text-muted);
	}
	.stub-rule {
		height: 1px;
		background: linear-gradient(90deg, rgba(255, 216, 119, 0.55), transparent);
	}
	.stub-bottom {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 1rem;
	}
	.pass-label {
		text-transform: uppercase;
		letter-spacing: 3px;
		font-size: 0.82rem;
		font-weight: 600;
		color: var(--text);
	}
	.brand {
		font-family: var(--font-display);
		font-style: italic;
		font-size: 1.1rem;
		color: rgba(255, 216, 119, 0.7);
	}

	/* ---- Perforation (ticket tear) ---- */
	.perf {
		position: relative;
		width: 1px;
		justify-self: center;
		background-image: linear-gradient(
			to bottom,
			rgba(244, 236, 224, 0.32) 0 7px,
			transparent 7px 15px
		);
		background-size: 1px 15px;
		background-repeat: repeat-y;
	}
	/* Punched notches carved from the top and bottom edges. */
	.perf::before,
	.perf::after {
		content: '';
		position: absolute;
		left: 50%;
		width: 22px;
		height: 22px;
		border-radius: 50%;
		background: var(--bg);
		transform: translateX(-50%);
	}
	.perf::before {
		top: -12px;
	}
	.perf::after {
		bottom: -12px;
	}

	/* ---- Unlocks (right) ---- */
	.unlocks {
		list-style: none;
		margin: 0;
		padding: clamp(0.6rem, 1.5vw, 1.1rem) clamp(1.1rem, 2.4vw, 1.9rem);
		display: flex;
		flex-direction: column;
	}
	li {
		position: relative;
		display: grid;
		grid-template-columns: auto 1fr auto;
		align-items: center;
		gap: clamp(0.9rem, 2vw, 1.4rem);
		padding: clamp(0.95rem, 1.9vw, 1.3rem) clamp(0.4rem, 1vw, 0.85rem);
		border-radius: 14px;
		transition:
			background var(--dur-base) var(--ease-out),
			transform var(--dur-base) var(--ease-out);
	}
	li + li::before {
		content: '';
		position: absolute;
		top: 0;
		left: clamp(0.4rem, 1vw, 0.85rem);
		right: clamp(0.4rem, 1vw, 0.85rem);
		height: 1px;
		background: linear-gradient(90deg, transparent, var(--line) 12%, var(--line) 88%, transparent);
	}
	.ico {
		flex: none;
		width: 46px;
		height: 46px;
		display: grid;
		place-items: center;
		border-radius: 12px;
		background: rgba(255, 216, 119, 0.08);
		color: var(--gold);
		border: 1px solid rgba(255, 216, 119, 0.2);
		transition: all var(--dur-base) var(--ease-out);
		svg {
			width: 23px;
			height: 23px;
		}
	}
	.t {
		min-width: 0;
	}
	h3 {
		font-family: var(--font-sans);
		font-weight: 700;
		font-size: 1.08rem;
		color: var(--text);
		margin: 0 0 0.15rem;
	}
	p {
		color: var(--text-muted);
		font-size: 0.92rem;
		line-height: 1.5;
		margin: 0;
	}
	.check {
		flex: none;
		width: 26px;
		height: 26px;
		display: grid;
		place-items: center;
		border-radius: 50%;
		color: var(--gold);
		background: rgba(255, 216, 119, 0.1);
		opacity: 0.55;
		transition: all var(--dur-base) var(--ease-out);
		svg {
			width: 14px;
			height: 14px;
		}
	}
	/* Hover only on real pointer devices — on touch it sticks after a tap
	   and reads as a stuck/awkward state. */
	@media (hover: hover) and (pointer: fine) {
		li:hover {
			background: linear-gradient(90deg, rgba(255, 216, 119, 0.06), transparent 70%);
			transform: translateX(4px);
			.ico {
				background: var(--gold);
				color: #1a1a1a;
				border-color: var(--gold);
				box-shadow: 0 0 18px rgba(255, 216, 119, 0.4);
			}
			.check {
				opacity: 1;
				background: var(--gold);
				color: #1a1a1a;
			}
		}
	}

	@media (max-width: 720px) {
		.pass {
			grid-template-columns: 1fr;
			grid-template-rows: auto 1px 1fr;
		}
		.stub {
			flex-direction: row;
			align-items: flex-end;
			justify-content: space-between;
			gap: 1.25rem;
		}
		.stub-rule {
			display: none;
		}
		.stub-bottom {
			flex-direction: column;
			align-items: flex-end;
			gap: 0.35rem;
		}
		/* Perforation runs horizontally on stacked layout. */
		.perf {
			width: auto;
			height: 1px;
			justify-self: stretch;
			background-image: linear-gradient(
				to right,
				rgba(244, 236, 224, 0.32) 0 7px,
				transparent 7px 15px
			);
			background-size: 15px 1px;
			background-repeat: repeat-x;
		}
		.perf::before {
			top: 50%;
			left: -12px;
			transform: translateY(-50%);
		}
		.perf::after {
			top: 50%;
			left: auto;
			right: -12px;
			bottom: auto;
			transform: translateY(-50%);
		}
		p {
			font-size: 0.88rem;
		}
	}
</style>
