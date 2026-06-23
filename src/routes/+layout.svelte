<script lang="ts">
	import '@fontsource/fraunces/latin-600.css';
	import '@fontsource/fraunces/latin-600-italic.css';
	import '@fontsource/dm-sans/latin-400.css';
	import '@fontsource/dm-sans/latin-500.css';
	import '@fontsource/dm-sans/latin-700.css';
	import '@fontsource/sora/latin-700.css';
	import '@fontsource/sora/latin-800.css';
	import 'lenis/dist/lenis.css';
	import '$lib/styles/global.scss';
	import { onMount } from 'svelte';
	import { initSmoothScroll } from '$lib/motion/smoothScroll';

	let { children } = $props();

	onMount(() => initSmoothScroll());
</script>

{@render children()}
