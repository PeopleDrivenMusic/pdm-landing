import { describe, it, expect, beforeEach } from 'vitest';
import { audience } from './audience.svelte';

describe('audience store', () => {
	beforeEach(() => audience.set('fan'));

	it('defaults to fan', () => {
		expect(audience.value).toBe('fan');
	});
	it('set switches role', () => {
		audience.set('artist');
		expect(audience.value).toBe('artist');
	});
	it('toggle flips between fan and artist', () => {
		audience.toggle();
		expect(audience.value).toBe('artist');
		audience.toggle();
		expect(audience.value).toBe('fan');
	});
});
