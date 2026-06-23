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
	import AmbientParticles from '$lib/components/AmbientParticles.svelte';
	import { injectAnalytics } from '@vercel/analytics/sveltekit';
	import { dev } from '$app/environment';
	import { injectSpeedInsights } from '@vercel/speed-insights/sveltekit';

	injectSpeedInsights();
	injectAnalytics({ mode: dev ? 'development' : 'production' });
	let { children } = $props();

	onMount(() => initSmoothScroll());
</script>

<!-- Page-wide ambient golden dust: a single fixed layer drifting behind every
     section, so the whole landing feels alive — not just the hero. -->
<AmbientParticles variant="fixed" count={12} intensity={0.9} />

{@render children()}
