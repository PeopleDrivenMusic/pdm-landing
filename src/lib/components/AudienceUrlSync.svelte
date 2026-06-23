<script lang="ts">
	import { onMount } from 'svelte';
	import { audience, parseAudience, type Audience } from '$lib/stores/audience.svelte';

	const STORAGE_KEY = 'pdm:audience';
	const PARAM = 'for';

	// Gate the syncing effect until after onMount has resolved the initial value,
	// so the effect's first run (writing URL/localStorage) can't race the init or
	// re-trigger itself via the store.
	let initialized = $state(false);

	onMount(() => {
		// Priority: ?for= query param -> localStorage -> existing default ('fan').
		let resolved: Audience | null = null;

		const fromUrl = parseAudience(new URLSearchParams(window.location.search).get(PARAM));
		if (fromUrl) {
			resolved = fromUrl;
		} else {
			try {
				resolved = parseAudience(window.localStorage.getItem(STORAGE_KEY));
			} catch {
				resolved = null;
			}
		}

		if (resolved) {
			audience.set(resolved);
		}

		initialized = true;
	});

	$effect(() => {
		// Read the store value so this effect re-runs on every change.
		const value = audience.value;

		// Skip until initialization is done (and implicitly skip during SSR,
		// since onMount/initialized only ever flips on the client).
		if (!initialized) return;

		try {
			window.localStorage.setItem(STORAGE_KEY, value);
		} catch {
			// Ignore storage failures (e.g. private mode / disabled storage).
		}

		// Update the `for` param in place: preserve pathname + hash, no new history
		// entry, no navigation, no scroll.
		const url = new URL(window.location.href);
		if (url.searchParams.get(PARAM) !== value) {
			url.searchParams.set(PARAM, value);
			window.history.replaceState(window.history.state, '', url);
		}
	});
</script>
