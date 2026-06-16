<script lang="ts">
	const year = new Date().getFullYear();
	const social = [
		{ label: 'Instagram', href: 'https://instagram.com' },
		{ label: 'X', href: 'https://x.com' },
		{ label: 'TikTok', href: 'https://tiktok.com' }
	];
</script>

<footer class="footer">
	<div class="inner">
		<div class="brand-col">
			<span class="brand">PDM</span>
			<p class="tagline">People Driving Music</p>
		</div>

		<nav class="col" aria-label="Footer">
			<span class="head">Explore</span>
			<a href="#how">How it works</a>
			<a href="#product">Product</a>
			<a href="#vision">Vision</a>
		</nav>

		<nav class="col" aria-label="Social">
			<span class="head">Follow</span>
			{#each social as s (s.label)}
				<a href={s.href} target="_blank" rel="noopener noreferrer">{s.label}</a>
			{/each}
		</nav>

		<div class="col">
			<span class="head">Contact</span>
			<a href="mailto:hello@pdm.live">hello@pdm.live</a>
		</div>
	</div>

	<div class="bottom">
		<span>© {year} PDM. All rights reserved.</span>
		<div class="legal">
			<a href="/privacy">Privacy</a>
			<a href="/terms">Terms</a>
		</div>
	</div>
</footer>

<style lang="scss">
	.footer {
		border-top: 1px solid var(--line);
		padding: clamp(3rem, 8vh, 5rem) clamp(1.25rem, 5vw, 3rem) 2rem;
	}
	.inner {
		max-width: var(--maxw);
		margin: 0 auto;
		display: grid;
		grid-template-columns: 1.5fr 1fr 1fr 1fr;
		gap: 2rem;
	}
	.brand {
		font-family: var(--font-display);
		font-weight: 600;
		font-size: 1.6rem;
		color: var(--gold);
	}
	.tagline {
		color: var(--text-muted);
		margin-top: 0.5rem;
	}
	.col {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		.head {
			color: var(--text);
			font-weight: 600;
			margin-bottom: 0.25rem;
		}
		a {
			color: var(--text-muted);
			transition: color var(--dur-base) var(--ease-out);
			&:hover {
				color: var(--gold);
			}
		}
	}
	.bottom {
		max-width: var(--maxw);
		margin: clamp(2.5rem, 6vh, 4rem) auto 0;
		padding-top: 1.5rem;
		border-top: 1px solid var(--line);
		display: flex;
		justify-content: space-between;
		gap: 1rem;
		flex-wrap: wrap;
		color: var(--text-muted);
		font-size: 0.9rem;
		.legal {
			display: flex;
			gap: 1.5rem;
			a:hover {
				color: var(--gold);
			}
		}
	}
	@media (max-width: 768px) {
		.inner {
			grid-template-columns: 1fr 1fr;
		}
	}
</style>
