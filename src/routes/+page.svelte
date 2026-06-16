<script lang="ts">
	import SEO from './SEO.svelte';
	import Nav from '$lib/components/landing/Nav.svelte';
	import Hero from '$lib/components/landing/Hero.svelte';
	import Problem from '$lib/components/landing/Problem.svelte';
	import Shift from '$lib/components/landing/Shift.svelte';
	import TwoSides from '$lib/components/landing/TwoSides.svelte';
	import Product from '$lib/components/landing/Product.svelte';
	import HowItWorks from '$lib/components/landing/HowItWorks.svelte';
	import Vision from '$lib/components/landing/Vision.svelte';
	import Proof from '$lib/components/landing/Proof.svelte';
	import Waitlist from '$lib/components/landing/Waitlist.svelte';
	import Footer from '$lib/components/landing/Footer.svelte';
</script>

<SEO />
<Nav />
<main>
	<Hero />
	<Problem />
	<Shift />
	<TwoSides />
	<Product />
	<HowItWorks />
	<Vision />
	<Proof />
	<Waitlist />
</main>
<Footer />
