<script lang="ts">
	import { browser } from '$app/environment';
	import { onDestroy, onMount } from 'svelte';
	import PdmCore3D from './PdmCore3D.svelte';
	import SEO from './SEO.svelte';

	type Role = 'artist' | 'fan';

	let scrollProgress = $state(0);
	let email = $state('');
	let role = $state<Role>('artist');
	let isLoading = $state(false);
	let submitted = $state(false);
	let formError = $state('');
	let storySection: HTMLElement;
	let storyProgress = $state(0);
	let storyStep = $derived(Math.min(3, Math.floor(storyProgress * 4)));

	const platformCards = [
		{ label: 'Streaming', detail: 'passive plays', x: -34, y: -28 },
		{ label: 'Social', detail: 'lost posts', x: 32, y: -31 },
		{ label: 'Video', detail: 'split content', x: -39, y: 9 },
		{ label: 'Ticketing', detail: 'resellers win', x: 36, y: 11 },
		{ label: 'Merch', detail: 'separate shop', x: -24, y: 36 },
		{ label: 'Donations', detail: 'no fan graph', x: 25, y: 36 }
	];

	const productCards = [
		{ title: 'Fan Chat', value: '1.2k online', note: 'subscriber-only community' },
		{ title: 'Ticket Drop', value: '82% claimed', note: 'early access for true fans' },
		{ title: 'Merch Signal', value: '$18.4k', note: 'direct demand this month' },
		{ title: 'Artist Pulse', value: '+32%', note: 'paid fanbase growth' }
	];

	const artistBenefits = [
		'Publish music, videos, posts and announcements from one command center.',
		'Turn loyal fans into subscriptions, merch buyers and early ticket holders.',
		'See fanbase analytics that actually help plan releases, drops and tours.',
		'Build future campaigns for songs, albums and tours without losing the relationship.'
	];

	const fanBenefits = [
		'Join the subscriber chat and feel closer than a like on a public feed.',
		'Get exclusive drops, demos, videos and announcements from artists you love.',
		'Access tickets earlier and unlock potential merch benefits as a real supporter.',
		'Back future releases and share in the upside when crowdfunding arrives.'
	];

	const incomeNodes = [
		{ label: 'Subscribers', value: '100k' },
		{ label: 'Merch', value: '$42k' },
		{ label: 'Tickets', value: '8.7k' },
		{ label: 'Retention', value: '71%' }
	];

	const storySlides = [
		{
			kicker: 'Scene 01',
			title: 'The artist is split across too many worlds.',
			text: 'Music in one app. Posts in another. Tickets elsewhere. Real fans get lost between platforms.'
		},
		{
			kicker: 'Scene 02',
			title: 'PDM pulls the whole fan relationship into orbit.',
			text: 'Content, chat, subscriptions, drops, tickets and merch become one living artist system.'
		},
		{
			kicker: 'Scene 03',
			title: 'The signal changes from plays to loyalty.',
			text: 'A passive waveform becomes paid subscribers, active community and real demand.'
		},
		{
			kicker: 'Scene 04',
			title: 'A fanbase becomes the career engine.',
			text: 'Artists see who cares, where demand grows and what to launch next.'
		}
	];

	function clamp(value: number, min = 0, max = 1) {
		return Math.min(Math.max(value, min), max);
	}

	function storyCardStyle(card: { x: number; y: number }, index: number) {
		const pull = clamp((storyProgress - 0.16) / 0.34);
		const exit = clamp((storyProgress - 0.66) / 0.2);
		const orbit = Math.sin(storyProgress * Math.PI * 2 + index) * 9;
		const x = card.x * (1 - pull) + Math.cos(index) * 18 * pull + orbit * (1 - exit);
		const y = card.y * (1 - pull) + Math.sin(index * 1.7) * 16 * pull;
		const scale = 1 - pull * 0.1 - exit * 0.36;
		const opacity = 1 - exit * 0.88;

		return `transform: translate(calc(-50% + ${x}%), calc(-50% + ${y}%)) scale(${scale}); opacity: ${opacity};`;
	}

	function storyDashboardStyle(index: number) {
		const reveal = clamp((storyProgress - 0.52) / 0.28);
		const y = 42 - reveal * 42 + index * 2;
		const rotate = -5 + reveal * 5 + index * 1.5;
		return `opacity: ${reveal}; transform: translateY(${y}px) rotate(${rotate}deg) scale(${0.88 + reveal * 0.12});`;
	}

	function updateScroll() {
		const max = document.documentElement.scrollHeight - window.innerHeight;
		scrollProgress = max > 0 ? Math.min(window.scrollY / max, 1) : 0;

		if (storySection) {
			const rect = storySection.getBoundingClientRect();
			const travel = rect.height - window.innerHeight;
			storyProgress = travel > 0 ? clamp(-rect.top / travel) : 0;
		}
	}

	async function submitWaitlist() {
		if (!email || isLoading) return;

		isLoading = true;
		formError = '';

		try {
			const response = await fetch('/api/whitelist', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, role })
			});

			if (!response.ok) {
				formError = 'Something went wrong. Please try again.';
				return;
			}

			submitted = true;
			localStorage.setItem('pdm-join', JSON.stringify({ email, role }));
		} catch {
			formError = 'Connection failed. Please try again.';
		} finally {
			isLoading = false;
		}
	}

	onMount(() => {
		const storedData = localStorage.getItem('pdm-join');
		if (storedData) {
			const parsed = JSON.parse(storedData);
			email = parsed.email;
			role = parsed.role;
			submitted = true;
		}

		updateScroll();
		window.addEventListener('scroll', updateScroll, { passive: true });
	});

	onDestroy(() => {
		if (browser) {
			window.removeEventListener('scroll', updateScroll);
		}
	});
</script>

<SEO />

<svelte:head>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Inter:wght@400;500;600;700;800&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<main class="landing" style={`--scroll-progress: ${scrollProgress}; --story-progress: ${storyProgress}`}>
	<section class="hero">
		<div class="stage" aria-hidden="true">
			<div class="stage-bg"></div>
			<div class="beam beam-left"></div>
			<div class="beam beam-right"></div>
			<div class="grain"></div>
		</div>

		<header class="nav">
			<a class="brand" href="#top" aria-label="PDM home">PDM</a>
			<nav aria-label="Primary navigation">
				<a href="#model">Model</a>
				<a href="#artists">Artists</a>
				<a href="#fans">Fans</a>
				<a href="#join">Join</a>
			</nav>
		</header>

		<div id="top" class="hero-grid">
			<div class="hero-copy">
				<p class="eyebrow">People Driving Music</p>
				<h1>Plays don't build careers. Fans do.</h1>
				<p class="lead">
					PDM is a premium music superapp where artists turn listeners into loyal
					subscribers through music, video, posts, chats, tickets, merch and future
					fan-funded releases.
				</p>
				<div class="actions">
					<a class="primary-action" href="#join">Request artist access</a>
					<a class="secondary-action" href="#fans">Explore fan benefits</a>
				</div>
				<div class="hero-stats" aria-label="Product highlights">
					<div><strong>1 hub</strong><span>for the fan relationship</span></div>
					<div><strong>80%</strong><span>artist-first subscription vision</span></div>
					<div><strong>0 noise</strong><span>built for real fan loyalty</span></div>
				</div>
			</div>

			<div class="constellation" aria-label="PDM product preview">
				<div class="hero-core">
					<div class="core-fallback" aria-hidden="true">PDM</div>
					<PdmCore3D progress={storyProgress} />
				</div>
				<div class="logo-orbit">
					<span>PDM</span>
					<div class="orbit-ring ring-one"></div>
					<div class="orbit-ring ring-two"></div>
				</div>

				{#each productCards as card, index}
					<div class={`orbit-card card-${index + 1}`}>
						<span>{card.title}</span>
						<strong>{card.value}</strong>
						<small>{card.note}</small>
					</div>
				{/each}

				<div class="player-panel">
					<div class="album-art"></div>
					<div>
						<strong>Midnight Signal</strong>
						<span>Aurora Vale</span>
					</div>
					<div class="player-bars">
						<i></i><i></i><i></i><i></i><i></i>
					</div>
				</div>
			</div>
		</div>
	</section>

	<section class="story-section" bind:this={storySection}>
		<div class="story-sticky">
			<div class="story-copy">
				<p class="section-kicker">{storySlides[storyStep].kicker}</p>
				<h2>{storySlides[storyStep].title}</h2>
				<p>{storySlides[storyStep].text}</p>
				<div class="story-timeline" aria-label="Scroll story progress">
					{#each storySlides as slide, index}
						<span class:active={index <= storyStep}>{slide.kicker}</span>
					{/each}
				</div>
			</div>

			<div class="story-world" aria-label="Animated PDM product story">
				<div class="story-core">
					<div class="core-fallback" aria-hidden="true">PDM</div>
					<PdmCore3D progress={storyProgress} />
				</div>

				<div class="platform-cloud">
					{#each platformCards as card, index}
						<div class="story-fragment" style={storyCardStyle(card, index)}>
							<strong>{card.label}</strong>
							<span>{card.detail}</span>
						</div>
					{/each}
				</div>

				<div class="signal-lab">
					<svg viewBox="0 0 900 260" aria-hidden="true">
						<defs>
							<linearGradient id="storyGoldLine" x1="0" x2="1">
								<stop offset="0%" stop-color="#fff0a3" />
								<stop offset="50%" stop-color="#f0a900" />
								<stop offset="100%" stop-color="#ffffff" />
							</linearGradient>
						</defs>
						<path
							class="story-wave"
							d="M20 150 C70 62 112 238 160 150 S250 62 300 150 S390 238 440 150 S530 62 580 150 S670 238 720 150 S810 62 880 120"
						/>
						<path class="story-growth" d="M20 224 C150 216 250 188 344 170 S530 108 642 88 S760 66 880 32" />
					</svg>
					<div class="signal-labels">
						<span>plays</span>
						<strong>loyal fan income</strong>
					</div>
				</div>

				<div class="story-dashboard">
					{#each productCards as card, index}
						<div class="dashboard-tile" style={storyDashboardStyle(index)}>
							<span>{card.title}</span>
							<strong>{card.value}</strong>
							<small>{card.note}</small>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</section>

	<section class="problem-section">
		<div class="section-kicker">The old model is breaking</div>
		<div class="split-heading">
			<h2>Artists are fighting an attention economy that rewards volume, not loyalty.</h2>
			<p>
				AI can flood streaming platforms with endless tracks. Algorithms can move attention
				overnight. Artists still have to stitch together Spotify, Instagram, YouTube, Patreon,
				ticketing tools and merch stores just to reach the people who care.
			</p>
		</div>
		<div class="noise-grid">
			<div class="noise-card">
				<span>01</span>
				<h3>Streaming pays for passive plays</h3>
				<p>Fractions move through the system while the artist rarely owns the fan relationship.</p>
			</div>
			<div class="noise-card">
				<span>02</span>
				<h3>Real fans are scattered</h3>
				<p>Announcements live in one app, videos in another, tickets somewhere else.</p>
			</div>
			<div class="noise-card">
				<span>03</span>
				<h3>Fans pay platforms first</h3>
				<p>The people who love an artist often fund the platform more than the artist.</p>
			</div>
		</div>
	</section>

	<section id="model" class="fusion-section">
		<div class="fusion-copy">
			<p class="section-kicker">From fragmented tools to one fanbase system</p>
			<h2>One place for music, community and commerce.</h2>
			<p>
				PDM gathers the whole fan relationship into a single premium surface: content, chat,
				subscriptions, tickets, merch and future crowdfunding.
			</p>
		</div>

		<div class="fusion-visual" aria-label="Platforms merging into PDM">
			{#each platformCards as card}
				<div
					class="fragment"
					style={`--x: ${card.x}%; --y: ${card.y}%; --pull: ${Math.min(scrollProgress * 2.4, 1)}`}
				>
					<strong>{card.label}</strong>
					<span>{card.detail}</span>
				</div>
			{/each}
			<div class="fusion-core">
				<span>PDM</span>
				<small>fanbase OS</small>
			</div>
		</div>
	</section>

	<section class="wave-section">
		<div class="wave-copy">
			<p class="section-kicker">The new revenue logic</p>
			<h2>From passive plays to loyal fan income.</h2>
			<p>
				The artist economy should be measured by active fans, paid community, ticket demand,
				merch conversion and long-term retention.
			</p>
		</div>
		<div class="wave-visual" aria-hidden="true">
			<svg viewBox="0 0 900 280" role="img">
				<defs>
					<linearGradient id="goldLine" x1="0" x2="1">
						<stop offset="0%" stop-color="#fff0a3" />
						<stop offset="50%" stop-color="#f0a900" />
						<stop offset="100%" stop-color="#ffffff" />
					</linearGradient>
				</defs>
				<path
					class="sound-wave"
					d="M20 150 C70 60 110 240 160 150 S250 60 300 150 S390 240 440 150 S530 60 580 150 S670 240 720 150 S810 60 880 120"
				/>
				<path class="income-line" d="M20 230 C160 220 220 190 330 170 S520 105 630 88 S760 70 880 36" />
			</svg>
			<div class="income-nodes">
				{#each incomeNodes as node}
					<div>
						<strong>{node.value}</strong>
						<span>{node.label}</span>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<section id="artists" class="audience-section artist-side">
		<div class="audience-copy">
			<p class="section-kicker">For artists</p>
			<h2>Stop renting attention. Build an owned fanbase.</h2>
			<p>
				PDM gives artists one operating layer for releases, content, announcements, community,
				tickets, merch and fan intelligence.
			</p>
		</div>
		<div class="benefit-panel">
			{#each artistBenefits as benefit, index}
				<div class="benefit-row">
					<span>{String(index + 1).padStart(2, '0')}</span>
					<p>{benefit}</p>
				</div>
			{/each}
		</div>
	</section>

	<section id="fans" class="audience-section fan-side">
		<div class="fan-pass">
			<div class="pass-top">
				<span>True Fan Access</span>
				<strong>PDM</strong>
			</div>
			<div class="pass-center">
				<h3>Closer than a follow.</h3>
				<p>Subscriber chat, drops, tickets, merch benefits and future release participation.</p>
			</div>
			<div class="pass-stripe"></div>
		</div>
		<div class="audience-copy">
			<p class="section-kicker">For fans</p>
			<h2>Your support should mean more than removing ads.</h2>
			<div class="fan-list">
				{#each fanBenefits as benefit}
					<p>{benefit}</p>
				{/each}
			</div>
		</div>
	</section>

	<section class="product-section">
		<div class="section-kicker">Product preview</div>
		<h2>A superapp surface for the entire artist world.</h2>
		<div class="dashboard-showcase">
			<div class="sidebar-preview">
				<strong>PDM</strong>
				<span>Home</span>
				<span>Music</span>
				<span>Artists</span>
				<span>Tickets</span>
				<span>Crowdfunding</span>
			</div>
			<div class="main-preview">
				<div class="preview-hero">
					<h3>Aurora Vale</h3>
					<p>1.5m followers · 100k subscribers</p>
					<button>Subscribe</button>
				</div>
				<div class="preview-grid">
					<div><strong>Community</strong><span>1.2k online</span></div>
					<div><strong>Next drop</strong><span>Nov 24</span></div>
					<div><strong>Ticket demand</strong><span>Los Angeles +41%</span></div>
				</div>
			</div>
		</div>
	</section>

	<section id="join" class="join-section">
		<div class="join-copy">
			<p class="section-kicker">Private access</p>
			<h2>Build the fanbase that pays back.</h2>
			<p>
				Join the early list as an artist building a loyal community or as a fan who wants a
				closer relationship with the music they love.
			</p>
		</div>

		<form class="access-card" onsubmit={(event) => { event.preventDefault(); submitWaitlist(); }}>
			<div class="access-header">
				<span>PDM ACCESS</span>
				<strong>{submitted ? 'REQUESTED' : 'INVITE'}</strong>
			</div>
			<div class="role-toggle" aria-label="Choose your role">
				<button type="button" class:active={role === 'artist'} onclick={() => (role = 'artist')}>
					Artist
				</button>
				<button type="button" class:active={role === 'fan'} onclick={() => (role = 'fan')}>Fan</button>
			</div>
			<label>
				<span>Email</span>
				<input type="email" placeholder="you@music.world" bind:value={email} disabled={submitted} />
			</label>
			{#if formError}
				<p class="form-error">{formError}</p>
			{/if}
			<button class="submit-button" type="submit" disabled={isLoading || submitted}>
				{#if submitted}
					Access requested
				{:else if isLoading}
					Requesting...
				{:else}
					Join early access
				{/if}
			</button>
		</form>
	</section>
</main>

<style lang="scss">
	:global(html) {
		background: #070707;
	}

	:global(body) {
		min-height: 100vh;
		background: #070707;
		color: #fff;
		font-family: 'Inter', system-ui, sans-serif;
	}

	:global(a) {
		color: inherit;
		text-decoration: none;
	}

	:global(button),
	:global(input) {
		font: inherit;
	}

	.landing {
		--gold: #f2a900;
		--gold-bright: #ffe58a;
		--ink: #090909;
		--panel: rgb(255 255 255 / 0.065);
		--line: rgb(255 255 255 / 0.12);
		--muted: rgb(255 255 255 / 0.66);
		background:
			radial-gradient(circle at 50% 0%, rgb(242 169 0 / 0.18), transparent 35rem),
			linear-gradient(180deg, #0b0b0b 0%, #050505 100%);
		overflow: hidden;
	}

	.hero,
	.problem-section,
	.fusion-section,
	.wave-section,
	.audience-section,
	.product-section,
	.join-section {
		position: relative;
		width: 100%;
		padding: clamp(4.5rem, 8vw, 8rem) clamp(1.25rem, 4vw, 5rem);
	}

	.hero {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		padding-top: 1.4rem;
	}

	.stage,
	.stage-bg,
	.beam,
	.grain {
		position: absolute;
		inset: 0;
		pointer-events: none;
	}

	.stage {
		overflow: hidden;
	}

	.stage-bg {
		background:
			linear-gradient(180deg, rgb(0 0 0 / 0.15), #070707 92%),
			url('/concert-bg.webp') center / cover;
		filter: saturate(0.72) brightness(0.42);
		transform: scale(1.08);
	}

	.beam {
		width: 30vw;
		height: 150vh;
		top: -25vh;
		background: linear-gradient(90deg, transparent, rgb(255 229 138 / 0.28), transparent);
		filter: blur(20px);
		opacity: 0.72;
		transform-origin: top center;
		mix-blend-mode: screen;
	}

	.beam-left {
		left: 5vw;
		transform: rotate(22deg);
		animation: sweepLeft 9s ease-in-out infinite;
	}

	.beam-right {
		right: 6vw;
		transform: rotate(-24deg);
		animation: sweepRight 11s ease-in-out infinite;
	}

	.grain {
		background-image:
			linear-gradient(rgb(255 255 255 / 0.03) 1px, transparent 1px),
			linear-gradient(90deg, rgb(255 255 255 / 0.025) 1px, transparent 1px);
		background-size: 42px 42px;
		mask-image: linear-gradient(to bottom, transparent, black 16%, black 82%, transparent);
		opacity: 0.26;
	}

	.nav {
		position: relative;
		z-index: 5;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		width: min(1180px, 100%);
		margin: 0 auto;
		padding: 0.8rem 0;
	}

	.brand {
		font-family: 'DM Serif Display', Georgia, serif;
		font-size: clamp(2rem, 5vw, 3.5rem);
		color: var(--gold-bright);
		text-shadow: 0 0 28px rgb(242 169 0 / 0.45);
	}

	.nav nav {
		display: flex;
		gap: clamp(0.8rem, 2vw, 1.8rem);
		color: rgb(255 255 255 / 0.72);
		font-size: 0.95rem;
	}

	.nav nav a:hover {
		color: #fff;
	}

	.hero-grid {
		position: relative;
		z-index: 2;
		display: grid;
		grid-template-columns: minmax(0, 0.95fr) minmax(360px, 1.05fr);
		align-items: center;
		gap: clamp(2rem, 5vw, 5rem);
		width: min(1180px, 100%);
		min-height: calc(100vh - 7rem);
		margin: 0 auto;
	}

	.eyebrow,
	.section-kicker {
		color: var(--gold-bright);
		font-size: 0.78rem;
		font-weight: 800;
		letter-spacing: 0.18em;
		text-transform: uppercase;
	}

	h1,
	h2 {
		margin: 0;
		color: #fff;
		letter-spacing: 0;
		line-height: 0.92;
	}

	h1 {
		max-width: 760px;
		font-size: clamp(3.6rem, 7.2vw, 6.45rem);
	}

	h2 {
		font-size: clamp(3rem, 6.4vw, 6.6rem);
	}

	.lead,
	.split-heading p,
	.fusion-copy p,
	.wave-copy p,
	.audience-copy > p,
	.join-copy p {
		color: var(--muted);
		font-size: clamp(1.05rem, 1.55vw, 1.35rem);
		line-height: 1.65;
	}

	.actions {
		display: flex;
		flex-wrap: wrap;
		gap: 0.9rem;
		margin-top: 2rem;
	}

	.primary-action,
	.secondary-action,
	.submit-button,
	.preview-hero button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-height: 3.3rem;
		padding: 0 1.35rem;
		border: 1px solid rgb(255 255 255 / 0.16);
		border-radius: 999px;
		font-weight: 800;
		transition:
			transform 0.25s ease,
			border-color 0.25s ease,
			background 0.25s ease;
	}

	.primary-action,
	.submit-button,
	.preview-hero button {
		border-color: transparent;
		background: linear-gradient(135deg, #ffe58a, #f2a900 52%, #9a6200);
		color: #090909;
		box-shadow: 0 20px 70px rgb(242 169 0 / 0.28);
	}

	.secondary-action {
		background: rgb(255 255 255 / 0.07);
		color: #fff;
		backdrop-filter: blur(16px);
	}

	.primary-action:hover,
	.secondary-action:hover,
	.submit-button:hover,
	.preview-hero button:hover {
		transform: translateY(-2px);
	}

	.hero-stats {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 0.8rem;
		margin-top: 3rem;
	}

	.hero-stats div {
		padding: 1rem;
		border: 1px solid var(--line);
		border-radius: 18px;
		background: rgb(255 255 255 / 0.055);
		backdrop-filter: blur(16px);
	}

	.hero-stats strong,
	.income-nodes strong {
		display: block;
		color: #fff;
		font-size: 1.15rem;
	}

	.hero-stats span,
	.income-nodes span {
		display: block;
		margin-top: 0.35rem;
		color: rgb(255 255 255 / 0.55);
		font-size: 0.78rem;
		line-height: 1.35;
	}

	.constellation {
		position: relative;
		min-height: 690px;
		border-radius: 42px;
		border: 1px solid rgb(255 255 255 / 0.13);
		background:
			radial-gradient(circle at 50% 42%, rgb(242 169 0 / 0.18), transparent 18rem),
			linear-gradient(140deg, rgb(255 255 255 / 0.08), rgb(255 255 255 / 0.02));
		box-shadow:
			inset 0 1px 0 rgb(255 255 255 / 0.12),
			0 40px 110px rgb(0 0 0 / 0.52);
		backdrop-filter: blur(18px);
		overflow: hidden;
	}

	.hero-core {
		position: absolute;
		inset: -2%;
		z-index: 2;
		opacity: 1;
	}

	.core-fallback {
		position: absolute;
		inset: 50% auto auto 50%;
		z-index: 0;
		display: grid;
		width: min(52%, 340px);
		aspect-ratio: 1;
		place-items: center;
		border: 1px solid rgb(255 229 138 / 0.38);
		border-radius: 50%;
		background:
			radial-gradient(circle, rgb(242 169 0 / 0.3), rgb(9 9 9 / 0.42) 58%, transparent 70%),
			conic-gradient(from calc(var(--story-progress) * 360deg), transparent, rgb(255 229 138 / 0.22), transparent);
		color: var(--gold-bright);
		font-family: 'DM Serif Display', Georgia, serif;
		font-size: clamp(4rem, 8vw, 7rem);
		text-shadow:
			0 0 24px rgb(242 169 0 / 0.78),
			0 0 90px rgb(242 169 0 / 0.42);
		transform: translate(-50%, -50%);
		box-shadow:
			0 0 90px rgb(242 169 0 / 0.22),
			inset 0 0 40px rgb(255 229 138 / 0.08);
		animation: corePulse 4s ease-in-out infinite;
		pointer-events: none;
	}

	.logo-orbit {
		position: absolute;
		inset: 50% auto auto 50%;
		z-index: 2;
		display: grid;
		width: min(58%, 330px);
		aspect-ratio: 1;
		place-items: center;
		transform: translate(-50%, -52%);
		pointer-events: none;
		opacity: 0;
	}

	.logo-orbit span {
		position: relative;
		z-index: 2;
		font-family: 'DM Serif Display', Georgia, serif;
		font-size: clamp(4.8rem, 10vw, 8rem);
		color: var(--gold-bright);
		text-shadow:
			0 0 28px rgb(242 169 0 / 0.75),
			0 0 90px rgb(242 169 0 / 0.38);
	}

	.orbit-ring {
		position: absolute;
		inset: 0;
		border: 1px solid rgb(255 229 138 / 0.28);
		border-radius: 50%;
	}

	.ring-one {
		animation: rotateOrbit 18s linear infinite;
	}

	.ring-two {
		inset: 14%;
		border-style: dashed;
		animation: rotateOrbit 24s linear infinite reverse;
	}

	.orbit-card,
	.player-panel {
		position: absolute;
		border: 1px solid rgb(255 255 255 / 0.13);
		border-radius: 20px;
		background: rgb(14 14 14 / 0.78);
		box-shadow: 0 24px 70px rgb(0 0 0 / 0.32);
		backdrop-filter: blur(18px);
	}

	.orbit-card {
		width: min(42%, 230px);
		padding: 1rem;
		animation: floatCard 6s ease-in-out infinite;
	}

	.orbit-card span,
	.access-header span {
		color: rgb(255 255 255 / 0.52);
		font-size: 0.8rem;
		font-weight: 700;
		text-transform: uppercase;
	}

	.orbit-card strong {
		display: block;
		margin-top: 0.35rem;
		color: #fff;
		font-size: clamp(1.25rem, 2.4vw, 2rem);
	}

	.orbit-card small {
		display: block;
		margin-top: 0.4rem;
		color: rgb(255 255 255 / 0.58);
		line-height: 1.35;
	}

	.card-1 {
		top: 7%;
		left: 8%;
	}

	.card-2 {
		top: 12%;
		right: 7%;
		animation-delay: -1s;
	}

	.card-3 {
		right: 7%;
		bottom: 22%;
		animation-delay: -2s;
	}

	.card-4 {
		bottom: 26%;
		left: 6%;
		animation-delay: -3s;
	}

	.player-panel {
		z-index: 3;
		left: 8%;
		right: 8%;
		bottom: 7%;
		display: grid;
		grid-template-columns: 64px 1fr auto;
		align-items: center;
		gap: 1rem;
		padding: 1rem;
	}

	.album-art {
		width: 64px;
		aspect-ratio: 1;
		border-radius: 14px;
		background:
			linear-gradient(135deg, #ffff00, #ffe58a 45%, #171717 46%),
			radial-gradient(circle at 65% 20%, black 0 8%, transparent 9%);
		box-shadow: 0 0 36px rgb(255 238 0 / 0.28);
	}

	.player-panel strong,
	.player-panel span {
		display: block;
	}

	.player-panel span {
		margin-top: 0.25rem;
		color: rgb(255 255 255 / 0.54);
	}

	.player-bars {
		display: flex;
		align-items: end;
		gap: 0.25rem;
		height: 34px;
	}

	.player-bars i {
		width: 5px;
		border-radius: 999px;
		background: var(--gold);
		animation: equalize 0.9s ease-in-out infinite;
	}

	.player-bars i:nth-child(1) {
		height: 35%;
	}

	.player-bars i:nth-child(2) {
		height: 78%;
		animation-delay: -0.1s;
	}

	.player-bars i:nth-child(3) {
		height: 50%;
		animation-delay: -0.2s;
	}

	.player-bars i:nth-child(4) {
		height: 92%;
		animation-delay: -0.3s;
	}

	.player-bars i:nth-child(5) {
		height: 42%;
		animation-delay: -0.4s;
	}

	.problem-section,
	.wave-section,
	.product-section {
		background: #070707;
	}

	.split-heading {
		display: grid;
		grid-template-columns: minmax(0, 1.25fr) minmax(280px, 0.75fr);
		gap: clamp(2rem, 5vw, 5rem);
		align-items: end;
		max-width: 1180px;
		margin: 1rem auto 0;
	}

	.noise-grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 1rem;
		max-width: 1180px;
		margin: 4rem auto 0;
	}

	.noise-card,
	.benefit-panel,
	.fan-pass,
	.dashboard-showcase,
	.access-card {
		border: 1px solid var(--line);
		background: var(--panel);
		box-shadow: 0 24px 80px rgb(0 0 0 / 0.28);
		backdrop-filter: blur(18px);
	}

	.noise-card {
		min-height: 260px;
		padding: 1.4rem;
		border-radius: 28px;
	}

	.noise-card span {
		color: var(--gold);
		font-weight: 900;
	}

	.noise-card h3 {
		margin: 3.5rem 0 1rem;
		color: #fff;
		font-size: clamp(1.5rem, 2.3vw, 2.35rem);
		line-height: 1.02;
	}

	.noise-card p,
	.benefit-row p,
	.fan-list p,
	.preview-grid span {
		color: rgb(255 255 255 / 0.62);
		line-height: 1.55;
	}

	.fusion-section {
		display: grid;
		grid-template-columns: minmax(0, 0.82fr) minmax(420px, 1fr);
		gap: clamp(2rem, 5vw, 5rem);
		align-items: center;
		max-width: 1320px;
		margin: 0 auto;
	}

	.fusion-copy p {
		max-width: 540px;
	}

	.fusion-visual {
		position: relative;
		min-height: 660px;
		border-radius: 42px;
		background:
			radial-gradient(circle at center, rgb(242 169 0 / 0.16), transparent 17rem),
			linear-gradient(150deg, rgb(255 255 255 / 0.08), transparent);
		border: 1px solid var(--line);
		overflow: hidden;
	}

	.fragment {
		position: absolute;
		top: calc(50% + (var(--y) * (1 - var(--pull))));
		left: calc(50% + (var(--x) * (1 - var(--pull))));
		width: 160px;
		padding: 0.95rem;
		border: 1px solid rgb(255 255 255 / 0.13);
		border-radius: 16px;
		background: rgb(255 255 255 / 0.07);
		transform: translate(-50%, -50%) scale(calc(1 - var(--pull) * 0.18));
		transition: transform 0.2s ease;
	}

	.fragment strong,
	.fragment span {
		display: block;
	}

	.fragment strong {
		color: #fff;
	}

	.fragment span {
		margin-top: 0.35rem;
		color: rgb(255 255 255 / 0.54);
		font-size: 0.84rem;
	}

	.fusion-core {
		position: absolute;
		inset: 50% auto auto 50%;
		display: grid;
		width: 230px;
		aspect-ratio: 1;
		place-items: center;
		border: 1px solid rgb(255 229 138 / 0.38);
		border-radius: 50%;
		background: radial-gradient(circle, rgb(242 169 0 / 0.3), rgb(9 9 9 / 0.86) 72%);
		box-shadow: 0 0 100px rgb(242 169 0 / 0.34);
		transform: translate(-50%, -50%);
	}

	.fusion-core span {
		font-family: 'DM Serif Display', Georgia, serif;
		color: var(--gold-bright);
		font-size: 4.7rem;
		line-height: 0.8;
	}

	.fusion-core small {
		margin-top: -2.6rem;
		color: rgb(255 255 255 / 0.62);
		text-transform: uppercase;
		letter-spacing: 0.15em;
	}

	.wave-section {
		display: grid;
		grid-template-columns: minmax(0, 0.85fr) minmax(420px, 1.15fr);
		gap: clamp(2rem, 5vw, 5rem);
		align-items: center;
		max-width: 1320px;
		margin: 0 auto;
	}

	.wave-visual {
		border: 1px solid var(--line);
		border-radius: 36px;
		background: linear-gradient(145deg, rgb(255 255 255 / 0.08), rgb(255 255 255 / 0.025));
		padding: clamp(1rem, 3vw, 2rem);
		box-shadow: inset 0 1px 0 rgb(255 255 255 / 0.09);
	}

	.wave-visual svg {
		width: 100%;
		min-height: 280px;
		overflow: visible;
	}

	.sound-wave,
	.income-line {
		fill: none;
		stroke-linecap: round;
		stroke-width: 8;
	}

	.sound-wave {
		stroke: rgb(255 255 255 / 0.18);
		stroke-dasharray: 18 16;
		animation: waveMove 8s linear infinite;
	}

	.income-line {
		stroke: url('#goldLine');
		filter: drop-shadow(0 0 20px rgb(242 169 0 / 0.65));
		stroke-dasharray: 950;
		stroke-dashoffset: calc(950 - (var(--scroll-progress) * 1500));
	}

	.income-nodes {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 0.8rem;
	}

	.income-nodes div {
		padding: 1rem;
		border: 1px solid rgb(255 255 255 / 0.1);
		border-radius: 18px;
		background: rgb(0 0 0 / 0.25);
	}

	.audience-section {
		display: grid;
		grid-template-columns: minmax(0, 0.9fr) minmax(380px, 1.1fr);
		gap: clamp(2rem, 5vw, 5rem);
		align-items: center;
		max-width: 1320px;
		margin: 0 auto;
	}

	.benefit-panel {
		border-radius: 34px;
		padding: clamp(1rem, 2.5vw, 1.6rem);
	}

	.benefit-row {
		display: grid;
		grid-template-columns: 64px 1fr;
		gap: 1rem;
		padding: 1.2rem 0;
		border-bottom: 1px solid rgb(255 255 255 / 0.1);
	}

	.benefit-row:last-child {
		border-bottom: 0;
	}

	.benefit-row span {
		color: var(--gold-bright);
		font-weight: 900;
	}

	.benefit-row p,
	.fan-list p {
		margin: 0;
		font-size: clamp(1rem, 1.4vw, 1.2rem);
	}

	.fan-side {
		grid-template-columns: minmax(380px, 0.9fr) minmax(0, 1.1fr);
	}

	.fan-pass {
		position: relative;
		min-height: 520px;
		border-radius: 34px;
		padding: 1.4rem;
		background:
			radial-gradient(circle at 30% 20%, rgb(255 229 138 / 0.26), transparent 12rem),
			linear-gradient(145deg, rgb(255 255 255 / 0.11), rgb(255 255 255 / 0.04));
		overflow: hidden;
	}

	.pass-top {
		display: flex;
		align-items: center;
		justify-content: space-between;
		color: rgb(255 255 255 / 0.68);
		font-weight: 800;
		text-transform: uppercase;
		letter-spacing: 0.12em;
	}

	.pass-top strong {
		font-family: 'DM Serif Display', Georgia, serif;
		color: var(--gold-bright);
		font-size: 3rem;
		letter-spacing: 0;
		text-shadow: 0 0 36px rgb(242 169 0 / 0.5);
	}

	.pass-center {
		position: absolute;
		right: 1.5rem;
		bottom: 4rem;
		left: 1.5rem;
	}

	.pass-center h3 {
		margin: 0;
		color: #fff;
		font-size: clamp(3rem, 6vw, 5.8rem);
		line-height: 0.9;
	}

	.pass-center p {
		max-width: 540px;
		color: rgb(255 255 255 / 0.66);
		font-size: 1.1rem;
		line-height: 1.6;
	}

	.pass-stripe {
		position: absolute;
		left: -10%;
		right: -10%;
		bottom: 1.6rem;
		height: 0.7rem;
		background: linear-gradient(90deg, transparent, var(--gold), var(--gold-bright), transparent);
		box-shadow: 0 0 44px rgb(242 169 0 / 0.54);
	}

	.fan-list {
		display: grid;
		gap: 1rem;
		margin-top: 2rem;
	}

	.fan-list p {
		padding: 1rem 0 1rem 1rem;
		border-left: 2px solid var(--gold);
	}

	.product-section {
		max-width: 1320px;
		margin: 0 auto;
	}

	.product-section h2 {
		max-width: 920px;
		margin-top: 1rem;
	}

	.dashboard-showcase {
		display: grid;
		grid-template-columns: 230px 1fr;
		min-height: 620px;
		margin-top: 3rem;
		border-radius: 38px;
		overflow: hidden;
	}

	.sidebar-preview {
		display: flex;
		flex-direction: column;
		gap: 1.2rem;
		padding: 2rem;
		background: rgb(0 0 0 / 0.22);
		border-right: 1px solid rgb(255 255 255 / 0.1);
	}

	.sidebar-preview strong {
		margin-bottom: 1.5rem;
		font-family: 'DM Serif Display', Georgia, serif;
		color: var(--gold);
		font-size: 3.2rem;
	}

	.sidebar-preview span {
		color: rgb(255 255 255 / 0.62);
		font-weight: 700;
	}

	.main-preview {
		display: grid;
		align-content: end;
		gap: 1rem;
		padding: clamp(1.4rem, 4vw, 3rem);
		background:
			linear-gradient(180deg, transparent, rgb(0 0 0 / 0.72)),
			radial-gradient(circle at 70% 0%, rgb(242 169 0 / 0.26), transparent 24rem);
	}

	.preview-hero {
		position: relative;
		min-height: 260px;
		padding: 1.4rem;
		border-radius: 28px;
		background: linear-gradient(180deg, rgb(255 255 255 / 0.09), rgb(255 255 255 / 0.035));
	}

	.preview-hero h3 {
		position: absolute;
		left: 1.4rem;
		bottom: 4rem;
		margin: 0;
		color: #fff;
		font-size: clamp(2.8rem, 5vw, 5rem);
	}

	.preview-hero p {
		position: absolute;
		left: 1.4rem;
		bottom: 2rem;
		margin: 0;
		color: rgb(255 255 255 / 0.62);
		font-weight: 700;
	}

	.preview-hero button {
		position: absolute;
		right: 1.4rem;
		bottom: 1.7rem;
		border: 0;
	}

	.preview-grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 1rem;
	}

	.preview-grid div {
		min-height: 130px;
		padding: 1.1rem;
		border: 1px solid rgb(255 255 255 / 0.1);
		border-radius: 22px;
		background: rgb(0 0 0 / 0.25);
	}

	.preview-grid strong,
	.preview-grid span {
		display: block;
	}

	.preview-grid strong {
		color: #fff;
		font-size: 1.3rem;
	}

	.join-section {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(360px, 480px);
		gap: clamp(2rem, 5vw, 5rem);
		align-items: center;
		max-width: 1180px;
		min-height: 80vh;
		margin: 0 auto;
	}

	.access-card {
		position: relative;
		border-radius: 34px;
		padding: 1.4rem;
		background:
			linear-gradient(145deg, rgb(255 229 138 / 0.14), rgb(255 255 255 / 0.055)),
			#111;
		overflow: hidden;
	}

	.access-card::before {
		content: '';
		position: absolute;
		inset: 0;
		border: 1px solid transparent;
		border-radius: inherit;
		background: linear-gradient(135deg, transparent, rgb(255 229 138 / 0.85), transparent) border-box;
		mask:
			linear-gradient(#000 0 0) padding-box,
			linear-gradient(#000 0 0);
		mask-composite: exclude;
		pointer-events: none;
		animation: borderGlow 4s linear infinite;
	}

	.access-header {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
	}

	.access-header strong {
		color: var(--gold-bright);
		font-size: 0.9rem;
		letter-spacing: 0.14em;
	}

	.role-toggle {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.6rem;
		margin: 2.4rem 0 1rem;
		padding: 0.35rem;
		border: 1px solid rgb(255 255 255 / 0.12);
		border-radius: 999px;
		background: rgb(0 0 0 / 0.22);
	}

	.role-toggle button {
		min-height: 2.8rem;
		border: 0;
		border-radius: 999px;
		background: transparent;
		color: rgb(255 255 255 / 0.62);
		cursor: pointer;
		font-weight: 800;
	}

	.role-toggle button.active {
		background: var(--gold);
		color: #080808;
	}

	.access-card label {
		display: grid;
		gap: 0.5rem;
		color: rgb(255 255 255 / 0.66);
		font-weight: 800;
	}

	.access-card input {
		width: 100%;
		min-height: 3.3rem;
		border: 1px solid rgb(255 255 255 / 0.14);
		border-radius: 16px;
		background: rgb(0 0 0 / 0.28);
		color: #fff;
		padding: 0 1rem;
		outline: 0;
	}

	.access-card input:focus {
		border-color: var(--gold-bright);
		box-shadow: 0 0 0 4px rgb(242 169 0 / 0.14);
	}

	.submit-button {
		width: 100%;
		margin-top: 1rem;
		border: 0;
		cursor: pointer;
	}

	.submit-button:disabled {
		cursor: default;
		opacity: 0.72;
		transform: none;
	}

	.form-error {
		margin: 0.8rem 0 0;
		color: #ffb7a6;
	}

	@keyframes sweepLeft {
		50% {
			transform: rotate(31deg) translateX(5vw);
		}
	}

	.story-section {
		position: relative;
		height: 440vh;
		background:
			radial-gradient(circle at 70% 20%, rgb(242 169 0 / 0.13), transparent 28rem),
			linear-gradient(180deg, #070707, #0b0b0b 42%, #070707);
	}

	.story-sticky {
		position: sticky;
		top: 0;
		display: grid;
		grid-template-columns: minmax(0, 0.8fr) minmax(420px, 1.2fr);
		align-items: center;
		gap: clamp(2rem, 5vw, 5rem);
		width: min(1320px, 100%);
		height: 100vh;
		margin: 0 auto;
		padding: clamp(4rem, 6vw, 6rem) clamp(1.25rem, 4vw, 5rem);
		overflow: hidden;
	}

	.story-copy {
		position: relative;
		z-index: 3;
	}

	.story-copy h2 {
		margin-top: 1rem;
		font-size: clamp(3.1rem, 6.6vw, 7rem);
		transition:
			opacity 0.35s ease,
			transform 0.35s ease;
	}

	.story-copy p:not(.section-kicker) {
		max-width: 570px;
		color: var(--muted);
		font-size: clamp(1.04rem, 1.5vw, 1.3rem);
		line-height: 1.7;
	}

	.story-timeline {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 0.45rem;
		max-width: 560px;
		margin-top: 2rem;
	}

	.story-timeline span {
		position: relative;
		padding-top: 0.75rem;
		color: rgb(255 255 255 / 0.36);
		font-size: 0.72rem;
		font-weight: 900;
		letter-spacing: 0.13em;
		text-transform: uppercase;
	}

	.story-timeline span::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 2px;
		border-radius: 999px;
		background: rgb(255 255 255 / 0.18);
	}

	.story-timeline span.active {
		color: var(--gold-bright);
	}

	.story-timeline span.active::before {
		background: linear-gradient(90deg, var(--gold), var(--gold-bright));
		box-shadow: 0 0 20px rgb(242 169 0 / 0.5);
	}

	.story-world {
		position: relative;
		min-height: min(76vh, 760px);
		border: 1px solid rgb(255 255 255 / 0.11);
		border-radius: 42px;
		background:
			radial-gradient(circle at 50% 42%, rgb(242 169 0 / 0.18), transparent 20rem),
			linear-gradient(145deg, rgb(255 255 255 / 0.08), rgb(255 255 255 / 0.02));
		box-shadow:
			inset 0 1px 0 rgb(255 255 255 / 0.13),
			0 44px 120px rgb(0 0 0 / 0.48);
		overflow: hidden;
	}

	.story-world::before {
		content: '';
		position: absolute;
		inset: -20%;
		background: conic-gradient(
			from calc(var(--story-progress) * 360deg),
			transparent,
			rgb(255 229 138 / 0.16),
			transparent,
			rgb(126 167 255 / 0.08),
			transparent
		);
		filter: blur(28px);
		opacity: 0.7;
		animation: rotateOrbit 20s linear infinite;
	}

	.story-core {
		position: absolute;
		inset: 0;
		z-index: 1;
		transform:
			translateY(calc((0.5 - var(--story-progress)) * 42px))
			scale(calc(0.88 + var(--story-progress) * 0.18));
		transition: transform 0.12s linear;
	}

	.story-core .core-fallback {
		width: min(48%, 360px);
	}

	.platform-cloud,
	.signal-lab,
	.story-dashboard {
		position: absolute;
		inset: 0;
		z-index: 2;
	}

	.story-fragment {
		position: absolute;
		top: 50%;
		left: 50%;
		width: 176px;
		padding: 0.95rem;
		border: 1px solid rgb(255 255 255 / 0.16);
		border-radius: 18px;
		background: rgb(9 9 9 / 0.72);
		box-shadow: 0 22px 70px rgb(0 0 0 / 0.36);
		backdrop-filter: blur(18px);
		transition:
			transform 0.16s linear,
			opacity 0.16s linear;
	}

	.story-fragment strong,
	.story-fragment span {
		display: block;
	}

	.story-fragment strong {
		color: #fff;
	}

	.story-fragment span {
		margin-top: 0.3rem;
		color: rgb(255 255 255 / 0.55);
		font-size: 0.84rem;
	}

	.signal-lab {
		display: grid;
		align-content: end;
		padding: clamp(1rem, 3vw, 2rem);
		opacity: calc((var(--story-progress) - 0.36) * 4);
		pointer-events: none;
	}

	.signal-lab svg {
		width: 100%;
		min-height: 250px;
		overflow: visible;
	}

	.story-wave,
	.story-growth {
		fill: none;
		stroke-linecap: round;
		stroke-width: 8;
	}

	.story-wave {
		stroke: rgb(255 255 255 / 0.16);
		stroke-dasharray: 16 15;
		stroke-dashoffset: calc(var(--story-progress) * -420);
	}

	.story-growth {
		stroke: url('#storyGoldLine');
		filter: drop-shadow(0 0 22px rgb(242 169 0 / 0.75));
		stroke-dasharray: 960;
		stroke-dashoffset: calc(960 - (var(--story-progress) * 1500));
	}

	.signal-labels {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
		margin-top: -1rem;
		color: rgb(255 255 255 / 0.48);
		font-weight: 900;
		text-transform: uppercase;
		letter-spacing: 0.12em;
	}

	.signal-labels strong {
		color: var(--gold-bright);
		text-shadow: 0 0 24px rgb(242 169 0 / 0.45);
	}

	.story-dashboard {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		align-content: end;
		gap: 0.8rem;
		padding: clamp(1rem, 3vw, 2rem);
		pointer-events: none;
	}

	.dashboard-tile {
		min-height: 118px;
		padding: 1rem;
		border: 1px solid rgb(255 255 255 / 0.14);
		border-radius: 20px;
		background: rgb(9 9 9 / 0.78);
		box-shadow: 0 24px 70px rgb(0 0 0 / 0.34);
		backdrop-filter: blur(18px);
		transition:
			transform 0.14s linear,
			opacity 0.14s linear;
	}

	.dashboard-tile span,
	.dashboard-tile strong,
	.dashboard-tile small {
		display: block;
	}

	.dashboard-tile span {
		color: rgb(255 255 255 / 0.52);
		font-size: 0.78rem;
		font-weight: 900;
		text-transform: uppercase;
		letter-spacing: 0.1em;
	}

	.dashboard-tile strong {
		margin-top: 0.4rem;
		color: #fff;
		font-size: clamp(1.7rem, 3vw, 2.4rem);
	}

	.dashboard-tile small {
		margin-top: 0.3rem;
		color: rgb(255 255 255 / 0.58);
		line-height: 1.35;
	}

	@keyframes sweepRight {
		50% {
			transform: rotate(-34deg) translateX(-5vw);
		}
	}

	@keyframes rotateOrbit {
		to {
			transform: rotate(360deg);
		}
	}

	@keyframes floatCard {
		50% {
			transform: translateY(-12px);
		}
	}

	@keyframes equalize {
		50% {
			height: 18%;
			opacity: 0.5;
		}
	}

	@keyframes waveMove {
		to {
			stroke-dashoffset: -260;
		}
	}

	@keyframes borderGlow {
		50% {
			opacity: 0.45;
		}
	}

	@keyframes corePulse {
		50% {
			transform: translate(-50%, -50%) scale(1.04);
			filter: saturate(1.18);
		}
	}

	@media (max-width: 980px) {
		.hero-grid,
		.story-sticky,
		.split-heading,
		.fusion-section,
		.wave-section,
		.audience-section,
		.fan-side,
		.join-section {
			grid-template-columns: 1fr;
		}

		.constellation,
		.story-world,
		.fusion-visual {
			min-height: 560px;
		}

		.story-section {
			height: auto;
		}

		.story-sticky {
			position: relative;
			height: auto;
			min-height: 100vh;
		}

		.noise-grid,
		.preview-grid,
		.income-nodes {
			grid-template-columns: 1fr;
		}

		.dashboard-showcase {
			grid-template-columns: 1fr;
		}

		.sidebar-preview {
			display: none;
		}
	}

	@media (max-width: 680px) {
		.nav {
			align-items: flex-start;
		}

		.nav nav {
			display: none;
		}

		.hero,
		.problem-section,
		.fusion-section,
		.wave-section,
		.audience-section,
		.product-section,
		.join-section {
			padding-inline: 1rem;
		}

		h1 {
			font-size: clamp(3.4rem, 17vw, 5.4rem);
		}

		h2 {
			font-size: clamp(2.6rem, 13vw, 4.2rem);
		}

		.hero-stats {
			grid-template-columns: 1fr;
		}

		.constellation {
			min-height: 620px;
			border-radius: 28px;
		}

		.story-world {
			min-height: 620px;
			border-radius: 28px;
		}

		.orbit-card {
			width: 45%;
		}

		.story-fragment {
			width: 136px;
			padding: 0.8rem;
		}

		.story-dashboard {
			grid-template-columns: 1fr;
		}

		.signal-labels {
			font-size: 0.68rem;
		}

		.player-panel {
			grid-template-columns: 54px 1fr;
		}

		.player-bars {
			display: none;
		}

		.fragment {
			width: 132px;
		}

		.fusion-core {
			width: 190px;
		}

		.fusion-core span {
			font-size: 3.8rem;
		}

		.benefit-row {
			grid-template-columns: 1fr;
		}

		.fan-pass {
			min-height: 470px;
		}

		.preview-hero h3 {
			font-size: 2.8rem;
		}

		.preview-hero button {
			right: auto;
			left: 1.4rem;
			bottom: 6.5rem;
		}
	}
</style>
