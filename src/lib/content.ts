import type { Audience } from './stores/audience.svelte';

export const hero: Record<Audience, { kicker: string; heading: string[]; sub: string }> = {
	fan: {
		kicker: 'People Driving Music',
		heading: ['Where fans', "don't just listen —", 'they lead.'],
		sub: 'Back the artists you love for $1 a month. Get closer than ever — and put your money where the music is.'
	},
	artist: {
		kicker: 'People Driving Music',
		heading: ['Your music.', 'Your fans.', 'Your income.'],
		sub: 'Earn directly from the people who love your work. No labels skimming, no algorithm tax — just you and your fans.'
	}
};

export const problemStats = [
	{ value: 0.003, prefix: '$', decimals: 3, label: 'paid to artists per stream' },
	{ value: 100, suffix: '%', decimals: 0, label: 'of fans reduced to a play-count' }
];

export const shift = {
	heading: 'One dollar. Straight to the artist.',
	body: '$1/month per artist — 80% goes directly to them. No middlemen, no noise. Just real support for the music you believe in.',
	artistShare: 80
};

export const benefits: Record<Audience, { title: string; desc: string }[]> = {
	fan: [
		{
			title: 'Exclusive drops',
			desc: 'Private posts, demos and behind-the-scenes from the artists you back.'
		},
		{
			title: 'Community chat',
			desc: 'A real room with the artist and fellow fans — paid-only, no spam.'
		},
		{ title: 'Comment & connect', desc: 'Your voice on every track and post. Be heard, not counted.' },
		{ title: 'Offline & ad-free', desc: 'Cache your artist and listen with zero ads.' },
		{ title: 'Be early', desc: 'First access to tickets, merch and releases.' }
	],
	artist: [
		{ title: 'Direct income', desc: 'Subscriptions land in your pocket — paid out fast.' },
		{ title: 'Your community', desc: 'A private space to talk to the fans who fund you.' },
		{ title: 'Your feed & store', desc: 'Post exclusives, sell merch and tickets, your way.' },
		{
			title: 'Loyal superfans',
			desc: 'Reward the people who show up — and turn listeners into backers.'
		},
		{ title: 'Real growth', desc: 'Reach new fans and build a base that actually pays.' }
	]
};

export const steps = [
	{ n: 1, title: 'Discover & listen', desc: 'Stream freely and find artists you love.' },
	{ n: 2, title: 'Subscribe for $1', desc: 'Back an artist — 80% goes straight to them.' },
	{ n: 3, title: 'Unlock & grow', desc: 'Get exclusives, join the community, grow together.' }
];

export const vision = {
	heading: 'And this is just the first verse.',
	body: 'Today you back the music. Tomorrow you grow with it — as the artists you championed rise.'
};

export const genres = [
	'Hip-Hop',
	'Indie',
	'Electronic',
	'R&B',
	'Pop',
	'Jazz',
	'Metal',
	'Lo-fi',
	'Afrobeats',
	'Classical'
];
