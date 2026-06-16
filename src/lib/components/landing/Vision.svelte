<script lang="ts">
	import { reveal } from '$lib/actions/reveal';
	import { vision } from '$lib/content';
</script>

<section id="vision" class="vision">
	<div class="drift" aria-hidden="true"></div>
	<div class="inner">
		<h2 use:reveal>{vision.heading}</h2>
		<p use:reveal={{ delay: 120 }}>{vision.body}</p>
	</div>
</section>

<style lang="scss">
	.vision {
		position: relative;
		padding: clamp(7rem, 16vh, 12rem) clamp(1.25rem, 5vw, 3rem);
		overflow: hidden;
		text-align: center;
	}
	.drift {
		position: absolute;
		inset: -20%;
		background:
			radial-gradient(40% 40% at 30% 40%, rgba(255, 216, 119, 0.1), transparent 70%),
			radial-gradient(40% 40% at 70% 60%, rgba(123, 108, 255, 0.08), transparent 70%);
		animation: drift 16s ease-in-out infinite alternate;
		pointer-events: none;
	}
	@keyframes drift {
		from {
			transform: translate3d(-3%, -2%, 0) scale(1);
		}
		to {
			transform: translate3d(3%, 2%, 0) scale(1.1);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.drift {
			animation: none;
		}
	}
	.inner {
		position: relative;
		max-width: 760px;
		margin: 0 auto;
	}
	h2 {
		font-style: italic;
		font-size: clamp(2.4rem, 7vw, 4.5rem);
		line-height: 1.05;
	}
	p {
		color: var(--text-muted);
		font-size: clamp(1.1rem, 2vw, 1.4rem);
		max-width: 44ch;
		margin: 1.5rem auto 0;
	}
</style>
