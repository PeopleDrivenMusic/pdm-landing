import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		host: true,        // или '127.0.0.1' или 'localhost'
		port: 3000         // или любой другой порт, например 5174
	}
});