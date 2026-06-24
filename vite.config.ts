import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		host: true, // или '127.0.0.1' или 'localhost'
		port: 5173 // 3000 попадает в зарезервированный Windows диапазон (winnat) → EACCES
	}
});
