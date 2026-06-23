<script lang="ts">
	import SEO from './SEO.svelte';
	import AudienceUrlSync from '$lib/components/AudienceUrlSync.svelte';
	import Nav from '$lib/components/landing/Nav.svelte';
	import Hero from '$lib/components/landing/Hero.svelte';
	import Problem from '$lib/components/landing/Problem.svelte';
	import Shift from '$lib/components/landing/Shift.svelte';
	import Steps from '$lib/components/landing/Steps.svelte';
	import Benefits from '$lib/components/landing/Benefits.svelte';
	import Referral from '$lib/components/landing/Referral.svelte';
	import Faq from '$lib/components/landing/Faq.svelte';
	import Waitlist from '$lib/components/landing/Waitlist.svelte';
	import Footer from '$lib/components/landing/Footer.svelte';
</script>

<AudienceUrlSync />
<SEO />
<Nav />
<main>
	<Hero />
	<Problem />
	<Shift />
	<Steps />
	<Benefits />
	<Referral />
	<Faq />
	<Waitlist />
</main>
<Footer />
