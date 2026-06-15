import type { Audience } from './stores/audience.svelte';

export interface JoinInput {
	email: string;
	role: Audience;
}
export interface JoinResult {
	ok: boolean;
	error?: 'email-required' | 'request-failed' | 'network-error';
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function submitWaitlist(
	input: JoinInput,
	fetchFn: typeof fetch = fetch
): Promise<JoinResult> {
	if (!input.email || !EMAIL_RE.test(input.email)) {
		return { ok: false, error: 'email-required' };
	}
	try {
		const res = await fetchFn('/api/whitelist', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(input)
		});
		if (!res.ok) return { ok: false, error: 'request-failed' };
		return { ok: true };
	} catch {
		return { ok: false, error: 'network-error' };
	}
}

const STORAGE_KEY = 'pdm-join';

export function persistJoin(input: JoinInput): void {
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(input));
	} catch {
		/* ignore */
	}
}

export function loadStoredJoin(): JoinInput | null {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		return raw ? (JSON.parse(raw) as JoinInput) : null;
	} catch {
		return null;
	}
}
