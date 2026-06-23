import type { Audience } from './stores/audience.svelte';

export interface JoinInput {
	email: string;
	role: Audience;
	/** Optional qualifying answer: artists-to-back (fan) or fanbase size (artist). */
	scale?: string;
	/** This person's own referral code (handed out on signup). */
	refCode?: string;
	/** The refCode that referred this person, read from the ?ref= URL param. */
	referredBy?: string;
}

/** Generates a short, URL-safe referral code. */
export function makeRefCode(): string {
	const raw =
		typeof crypto !== 'undefined' && crypto.randomUUID
			? crypto.randomUUID().replace(/-/g, '')
			: Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
	return raw.slice(0, 7).toUpperCase();
}

/** Reads the inbound referral code from the current URL (?ref=CODE). */
export function readReferredBy(): string {
	if (typeof window === 'undefined') return '';
	try {
		return new URL(window.location.href).searchParams.get('ref')?.trim().toUpperCase() ?? '';
	} catch {
		return '';
	}
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
