<script lang="ts">
	import { fade } from 'svelte/transition';
	import { reveal } from '$lib/actions/reveal';
	import { audience } from '$lib/stores/audience.svelte';
	import { shift } from '$lib/content';

	const data = $derived(shift[audience.value]);
</script>

<section id="shift" class="shift">
	<div class="inner">
		<div class="copy">
			<p class="kicker" use:reveal>{data.kicker}</p>
			{#key audience.value}
				<h2 use:reveal={{ delay: 60 }} in:fade={{ duration: 280 }}>{data.heading}</h2>
				<p class="body" use:reveal={{ delay: 120 }} in:fade={{ duration: 280 }}>{data.body}</p>
			{/key}
		</div>

		<div class="visual" use:reveal={{ delay: 140, y: 30 }}>
			<div class="glow" aria-hidden="true"></div>
			{#key audience.value}
				<div class="panel" in:fade={{ duration: 320 }}>
					{#if data.versus}
						<div class="versus">
							<div class="side win">
								<span class="big">{data.versus.a}</span>
							</div>
							<span class="rel">worth more than</span>
							<div class="side lose">
								<span class="small">{data.versus.b}</span>
							</div>
						</div>
					{:else if data.points}
						<span class="lead">Step inside the fanbase</span>
						<ul class="points">
							{#each data.points as point, i (point.title)}
								<li>
									<span class="p-ico" aria-hidden="true">
										{#if i === 0}
											<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"
												><circle cx="12" cy="12" r="9" /><circle
													cx="12"
													cy="12"
													r="2.6"
													fill="currentColor"
													stroke="none"
												/></svg
											>
										{:else if i === 1}
											<svg
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												stroke-width="1.8"
												stroke-linecap="round"
												stroke-linejoin="round"
												><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg
											>
										{:else}
											<svg
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												stroke-width="1.8"
												stroke-linecap="round"
												stroke-linejoin="round"
												><path d="M12 2l2.4 4.9 5.4.8-3.9 3.8.9 5.4-4.8-2.5-4.8 2.5.9-5.4L4.2 7.7l5.4-.8z" /></svg
											>
										{/if}
									</span>
									<div class="p-text">
										<span class="p-title">{point.title}</span>
										<span class="p-note">{point.note}</span>
									</div>
								</li>
							{/each}
						</ul>
						<div class="inside">
							<div class="avatars" aria-hidden="true">
								<span></span>
								<span></span>
								<span></span>
								<span class="you">You</span>
							</div>
							<span class="inside-label">You’re in the room — not just on the playlist.</span>
						</div>
					{/if}
				</div>
			{/key}
		</div>
	</div>
</section>

<style lang="scss">
	.shift {
		padding: clamp(6rem, 12vh, 10rem) clamp(1.25rem, 5vw, 3rem);
	}
	.inner {
		max-width: var(--maxw);
		margin: 0 auto;
		display: grid;
		grid-template-columns: 1fr 0.95fr;
		gap: clamp(2.5rem, 6vw, 5rem);
		align-items: center;
	}
	.kicker {
		text-transform: uppercase;
		letter-spacing: 4px;
		font-size: 0.8rem;
		color: var(--gold);
		margin-bottom: 1rem;
	}
	h2 {
		font-size: clamp(2.2rem, 5vw, 3.6rem);
		font-style: italic;
		line-height: 1.05;
		max-width: 15ch;
	}
	.body {
		color: var(--text-muted);
		font-size: clamp(1.05rem, 1.6vw, 1.25rem);
		max-width: 48ch;
		margin-top: 1.5rem;
		line-height: 1.65;
	}

	/* ── Visual panel ── */
	.visual {
		position: relative;
	}
	.glow {
		position: absolute;
		inset: -10% -5%;
		background: radial-gradient(60% 60% at 60% 40%, rgba(255, 216, 119, 0.16), transparent 70%);
		filter: blur(50px);
		pointer-events: none;
	}
	.panel {
		position: relative;
		border: 1px solid rgba(255, 216, 119, 0.18);
		border-radius: 24px;
		background:
			linear-gradient(180deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.01)),
			var(--bg-elev);
		padding: clamp(2rem, 4vw, 2.75rem);
		box-shadow:
			0 40px 80px -34px rgba(0, 0, 0, 0.85),
			inset 0 1px 0 rgba(255, 255, 255, 0.05);
	}

	/* Fan: belonging points */
	.lead {
		display: block;
		text-transform: uppercase;
		letter-spacing: 2px;
		font-size: 0.75rem;
		color: var(--text-muted);
		margin-bottom: 1.25rem;
	}
	.points {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		li {
			display: grid;
			grid-template-columns: auto 1fr;
			gap: 1rem;
			align-items: start;
			padding: 1rem 0;
		}
		li + li {
			border-top: 1px solid var(--line);
		}
	}
	.p-ico {
		flex: none;
		width: 42px;
		height: 42px;
		display: grid;
		place-items: center;
		border-radius: 11px;
		background: rgba(255, 216, 119, 0.08);
		border: 1px solid rgba(255, 216, 119, 0.2);
		color: var(--gold);
		svg {
			width: 21px;
			height: 21px;
		}
	}
	.p-text {
		display: flex;
		flex-direction: column;
		gap: 0.15rem;
		min-width: 0;
	}
	.p-title {
		font-weight: 700;
		font-size: 1.08rem;
		color: var(--text);
	}
	.p-note {
		font-size: 0.92rem;
		line-height: 1.5;
		color: var(--text-muted);
	}
	/* Community footer — concretely "you are inside". */
	.inside {
		display: flex;
		align-items: center;
		gap: 0.9rem;
		margin-top: 1.5rem;
		padding-top: 1.4rem;
		border-top: 1px solid var(--line);
	}
	.avatars {
		display: flex;
		flex: none;
		span {
			width: 32px;
			height: 32px;
			border-radius: 50%;
			margin-left: -9px;
			border: 2px solid var(--bg-elev);
			background: linear-gradient(135deg, rgba(255, 216, 119, 0.55), rgba(224, 178, 58, 0.25));
			display: grid;
			place-items: center;
			font-size: 0.62rem;
			font-weight: 700;
			color: rgba(26, 26, 26, 0.85);
			&:first-child {
				margin-left: 0;
			}
		}
		.you {
			background: var(--gold);
			color: #1a1a1a;
			box-shadow: 0 0 14px rgba(255, 216, 119, 0.45);
		}
	}
	.inside-label {
		font-size: 0.88rem;
		line-height: 1.45;
		color: var(--text-muted);
	}

	/* Artist: versus */
	.versus {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 1rem;
	}
	.side .big {
		font-family: var(--font-display);
		font-style: italic;
		font-size: clamp(2.2rem, 5vw, 3.2rem);
		line-height: 1;
		color: var(--gold);
		text-shadow: 0 0 30px rgba(255, 216, 119, 0.18);
	}
	.rel {
		font-size: 0.9rem;
		text-transform: uppercase;
		letter-spacing: 2px;
		color: var(--text-muted);
		padding-left: 0.1rem;
	}
	.side .small {
		font-family: var(--font-display);
		font-style: italic;
		font-size: clamp(1.5rem, 3vw, 2rem);
		line-height: 1;
		color: var(--text-muted);
		opacity: 0.55;
		text-decoration: line-through;
		text-decoration-color: rgba(244, 236, 224, 0.3);
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
