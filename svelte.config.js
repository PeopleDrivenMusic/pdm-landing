import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import vercel from '@sveltejs/adapter-vercel';
import adapter from '@sveltejs/adapter-vercel';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		adapter: vercel()
	}
};

export default config;
