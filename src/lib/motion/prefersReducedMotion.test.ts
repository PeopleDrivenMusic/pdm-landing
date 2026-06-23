import { describe, it, expect, vi } from 'vitest';
import { prefersReducedMotion } from './prefersReducedMotion';

function mockMatch(matches: boolean) {
	window.matchMedia = vi.fn().mockReturnValue({
		matches,
		addEventListener: () => {},
		removeEventListener: () => {}
	}) as unknown as typeof window.matchMedia;
}

describe('prefersReducedMotion', () => {
	it('returns true when the media query matches', () => {
		mockMatch(true);
		expect(prefersReducedMotion()).toBe(true);
	});
	it('returns false when it does not match', () => {
		mockMatch(false);
		expect(prefersReducedMotion()).toBe(false);
	});
});
