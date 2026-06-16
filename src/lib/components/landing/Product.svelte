<script lang="ts">
	import { reveal } from '$lib/actions/reveal';
	import TiltCard from '$lib/components/TiltCard.svelte';
</script>

<section id="product" class="product">
	<div class="inner">
		<p class="kicker" use:reveal>The product</p>
		<h2 use:reveal={{ delay: 80 }}>It's real. Not a promise.</h2>
		<p class="lede" use:reveal={{ delay: 160 }}>
			Listen, belong, and back the artists you love — all in one place.
		</p>

		<div class="bento">
			<!-- Player (large) -->
			<div class="cell big" use:reveal={{ delay: 0, y: 30 }}>
				<TiltCard>
					<div class="mock player">
						<div class="art"></div>
						<div class="track">
							<span class="t-title">Midnight Pressing</span>
							<span class="t-artist">AURORA LANE</span>
						</div>
						<div class="progress"><span></span></div>
						<div class="controls">
							<span class="ic">‹‹</span>
							<span class="ic play">▶</span>
							<span class="ic">››</span>
						</div>
					</div>
				</TiltCard>
			</div>

			<!-- Artist page -->
			<div class="cell" use:reveal={{ delay: 80, y: 30 }}>
				<TiltCard>
					<div class="mock artist">
						<div class="banner"></div>
						<div class="avatar"></div>
						<span class="name">AURORA LANE</span>
						<span class="meta">12.4k fans</span>
						<div class="sub-btn">Subscribe · $1/mo</div>
					</div>
				</TiltCard>
			</div>

			<!-- Community chat -->
			<div class="cell" use:reveal={{ delay: 160, y: 30 }}>
				<TiltCard>
					<div class="mock chat">
						<div class="bubble">Demo drops tonight 🔥</div>
						<div class="bubble me">can't wait!!</div>
						<div class="bubble">you're first to hear it</div>
					</div>
				</TiltCard>
			</div>

			<!-- Feed -->
			<div class="cell wide" use:reveal={{ delay: 240, y: 30 }}>
				<TiltCard>
					<div class="mock feed">
						<div class="post">
							<div class="ph-line w60"></div>
							<div class="ph-img"></div>
						</div>
						<div class="post">
							<div class="ph-line w40"></div>
							<div class="ph-line w80"></div>
						</div>
					</div>
				</TiltCard>
			</div>
		</div>
	</div>
</section>

<style lang="scss">
	.product {
		padding: clamp(6rem, 12vh, 10rem) clamp(1.25rem, 5vw, 3rem);
	}
	.inner {
		max-width: var(--maxw);
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
	}
	.lede {
		color: var(--text-muted);
		font-size: clamp(1.05rem, 2vw, 1.3rem);
		max-width: 48ch;
		margin: 1.5rem auto 3rem;
	}
	.bento {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		grid-auto-rows: 200px;
		gap: 1.25rem;
		text-align: left;
	}
	.cell {
		:global(.tilt) {
			height: 100%;
		}
	}
	.big {
		grid-row: span 2;
	}
	.wide {
		grid-column: span 2;
	}
	.mock {
		height: 100%;
		background: var(--bg-elev);
		border: 1px solid var(--line);
		border-radius: 16px;
		padding: 1.25rem;
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}
	/* player */
	.player {
		justify-content: flex-end;
		gap: 0.85rem;
		.art {
			flex: 1;
			border-radius: 12px;
			background: linear-gradient(135deg, var(--gold), var(--gold-deep) 60%, #6b4f12);
			min-height: 90px;
		}
		.track {
			display: flex;
			flex-direction: column;
		}
		.t-title {
			font-family: var(--font-display);
			font-size: 1.25rem;
		}
		.t-artist {
			color: var(--text-muted);
			font-size: 0.8rem;
			letter-spacing: 2px;
		}
		.progress {
			height: 4px;
			background: rgba(255, 255, 255, 0.12);
			border-radius: 2px;
			span {
				display: block;
				width: 42%;
				height: 100%;
				background: var(--gold);
				border-radius: 2px;
			}
		}
		.controls {
			display: flex;
			align-items: center;
			justify-content: center;
			gap: 1.5rem;
			color: var(--text-muted);
			.play {
				width: 42px;
				height: 42px;
				display: grid;
				place-items: center;
				background: var(--gold);
				color: #1a1a1a;
				border-radius: 50%;
			}
		}
	}
	/* artist */
	.artist {
		align-items: center;
		text-align: center;
		gap: 0.4rem;
		padding-top: 0;
		.banner {
			width: calc(100% + 2.5rem);
			margin: -1.25rem -1.25rem 0;
			height: 52px;
			background: linear-gradient(120deg, var(--gold-deep), #4a3a10);
		}
		.avatar {
			width: 56px;
			height: 56px;
			border-radius: 50%;
			background: var(--bg-elev-2);
			border: 2px solid var(--gold);
			margin-top: -28px;
		}
		.name {
			font-family: var(--font-display);
			font-size: 1.1rem;
		}
		.meta {
			color: var(--text-muted);
			font-size: 0.8rem;
		}
		.sub-btn {
			margin-top: auto;
			background: var(--gold);
			color: #1a1a1a;
			font-weight: 700;
			font-size: 0.85rem;
			padding: 0.5rem 1rem;
			border-radius: 999px;
		}
	}
	/* chat */
	.chat {
		justify-content: center;
		gap: 0.6rem;
		.bubble {
			background: var(--bg-elev-2);
			padding: 0.6rem 0.85rem;
			border-radius: 14px;
			font-size: 0.85rem;
			max-width: 80%;
			align-self: flex-start;
			&.me {
				align-self: flex-end;
				background: var(--gold);
				color: #1a1a1a;
			}
		}
	}
	/* feed */
	.feed {
		gap: 0.85rem;
		.post {
			background: var(--bg-elev-2);
			border-radius: 12px;
			padding: 0.85rem;
			flex: 1;
			display: flex;
			flex-direction: column;
			gap: 0.5rem;
		}
		.ph-line {
			height: 10px;
			border-radius: 5px;
			background: rgba(255, 255, 255, 0.1);
		}
		.ph-img {
			flex: 1;
			border-radius: 8px;
			background: linear-gradient(135deg, rgba(255, 216, 119, 0.25), rgba(255, 255, 255, 0.04));
		}
		.w40 {
			width: 40%;
		}
		.w60 {
			width: 60%;
		}
		.w80 {
			width: 80%;
		}
	}
	@media (max-width: 768px) {
		.bento {
			grid-template-columns: 1fr;
			grid-auto-rows: 180px;
		}
		.big {
			grid-row: span 2;
		}
		.wide {
			grid-column: span 1;
		}
	}
</style>
