<script lang="ts">
	import { faq } from '$lib/content';

	// Current live domain. When pdm.live goes live, switch this single constant
	// (and the static sitemap.xml / robots.txt) and add a 301 from the old host.
	const SITE = 'https://pdm-landing.vercel.app';

	// Single JSON-LD graph: Organization + WebSite + WebApplication + FAQPage.
	// The FAQPage entries are generated from the same data the page renders,
	// so the structured data always matches visible content.
	const jsonLd = {
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@type': 'Organization',
				'@id': `${SITE}/#organization`,
				name: 'People Driving Music',
				alternateName: 'PDM',
				url: `${SITE}/`,
				logo: `${SITE}/favicon.png`,
				// No public social profiles yet — add real URLs to `sameAs` when they go live.
				contactPoint: {
					'@type': 'ContactPoint',
					contactType: 'customer support',
					email: 'izobov.pdm@gmail.com'
				}
			},
			{
				'@type': 'WebSite',
				'@id': `${SITE}/#website`,
				name: 'PDM',
				alternateName: 'People Driving Music',
				url: `${SITE}/`,
				publisher: { '@id': `${SITE}/#organization` }
			},
			{
				'@type': 'WebApplication',
				'@id': `${SITE}/#webapp`,
				name: 'PDM',
				alternateName: 'People Driving Music',
				url: `${SITE}/`,
				applicationCategory: 'MusicApplication',
				operatingSystem: 'Web',
				description:
					'PDM is a music platform where fans back the artists they love for $1/month and get closer than ever, while artists earn directly.',
				offers: {
					'@type': 'Offer',
					price: '1.00',
					priceCurrency: 'USD',
					description: 'Subscribe to an artist for $1/month. 80% goes directly to the artist.'
				},
				publisher: { '@id': `${SITE}/#organization` }
			},
			{
				'@type': 'FAQPage',
				'@id': `${SITE}/#faq`,
				mainEntity: faq.map((item) => ({
					'@type': 'Question',
					name: item.q,
					acceptedAnswer: { '@type': 'Answer', text: item.a }
				}))
			}
		]
	};
</script>

<svelte:head>
	<title>PDM — People Driving Music | Back artists for $1/month</title>
	<meta
		name="description"
		content="Back the artists you love for $1/month and get closer than ever — while artists earn directly, no label cut. Fans and artists welcome. Join the waitlist."
	/>
	<meta name="robots" content="index, follow, max-image-preview:large" />
	<meta
		name="keywords"
		content="PDM, People Driving Music, music platform, support artists, fan community, direct artist support, music streaming, artist subscriptions, back artists, $1 per month music"
	/>
	<link rel="canonical" href="{SITE}/" />

	<meta property="og:site_name" content="PDM" />
	<meta property="og:title" content="PDM — People Driving Music | Back artists for $1/month" />
	<meta
		property="og:description"
		content="Back the artists you love for $1/month and get closer than ever. Fans lead, artists earn directly. Join the waitlist."
	/>
	<meta property="og:url" content="{SITE}/" />
	<meta property="og:type" content="website" />
	<meta property="og:image" content="{SITE}/concert-bg.webp" />
	<meta property="og:image:type" content="image/webp" />
	<meta property="og:image:width" content="1920" />
	<meta property="og:image:height" content="1080" />
	<meta property="og:image:alt" content="PDM — People Driving Music" />
	<meta property="og:locale" content="en_US" />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="PDM — People Driving Music | Back artists for $1/month" />
	<meta
		name="twitter:description"
		content="Back the artists you love for $1/month. Fans get closer, artists earn directly. Join the waitlist."
	/>
	<meta name="twitter:image" content="{SITE}/concert-bg.webp" />
	<meta name="twitter:image:alt" content="PDM — People Driving Music" />

	<!-- eslint-disable-next-line svelte/no-at-html-tags -- trusted, app-generated JSON-LD -->
	{@html `<script type="application/ld+json">${JSON.stringify(jsonLd)}<\/script>`}
</svelte:head>
