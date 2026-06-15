import { describe, it, expect, vi } from 'vitest';
import { submitWaitlist } from './waitlist';

describe('submitWaitlist', () => {
	it('rejects empty email', async () => {
		const res = await submitWaitlist({ email: '', role: 'fan' }, vi.fn());
		expect(res.ok).toBe(false);
		expect(res.error).toBe('email-required');
	});

	it('posts to /api/whitelist and returns ok on 200', async () => {
		const fetchMock = vi.fn().mockResolvedValue({ ok: true });
		const res = await submitWaitlist({ email: 'a@b.com', role: 'artist' }, fetchMock);
		expect(fetchMock).toHaveBeenCalledWith(
			'/api/whitelist',
			expect.objectContaining({ method: 'POST' })
		);
		expect(res.ok).toBe(true);
	});

	it('returns error on non-ok response', async () => {
		const fetchMock = vi.fn().mockResolvedValue({ ok: false });
		const res = await submitWaitlist({ email: 'a@b.com', role: 'fan' }, fetchMock);
		expect(res.ok).toBe(false);
		expect(res.error).toBe('request-failed');
	});
});
