<script>
	import SEO from './SEO.svelte';
	import Intro from './Intro.svelte';
	import Problems from './Problems.svelte';
	import CoreFeatures from './CoreFeatures.svelte';
	import How from './How.svelte';
	import Join from './Join.svelte';

</script>

<SEO />

<Intro />
<div class="wrapper">
	<Problems />
	<CoreFeatures />
	<How />
	<Join/>
</div>

<style lang="scss">
	.wrapper {
		background-color: #1a1a1a;
		color: #fff;
		position: relative;
		z-index: 1;
	}
	:global {
		* {
			scrollbar-width: thin;
			scrollbar-color: var(--main-color) #1a1a1a;

			&::-webkit-scrollbar {
				width: 8px;
			}

			&::-webkit-scrollbar-track {
				background: #1a1a1a;
			}

			&::-webkit-scrollbar-thumb {
				background-color: var(--main-color);
				border-radius: 4px;
			}

			&::-webkit-scrollbar-thumb:hover {
				background-color: #555;
			}
		}
		section {
			min-height: 100vh;
			width: 100%;
			padding: clamp(2rem, 3vw, 5rem);
			overflow-x: hidden;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: start;
			color: rgb(255 255 255 / 0.7);
			h2 {
				color: var(--main-color);
				font-size: clamp(2rem, 6vw, 4rem);
				text-align: center;
				margin: 0 auto;
				max-width: 800px;
			}
			p {
				font-size: clamp(1.2rem, 2.5vw, 2rem);
				max-width: 800px;
				margin: 0 auto;
			}
		}
	}
</style>
