export type Audience = 'fan' | 'artist';

/** Narrows an arbitrary value to a valid `Audience`, or `null` if it isn't one. */
export function parseAudience(value: unknown): Audience | null {
	return value === 'fan' || value === 'artist' ? value : null;
}

let current = $state<Audience>('fan');

export const audience = {
	get value(): Audience {
		return current;
	},
	set(next: Audience) {
		current = next;
	},
	toggle() {
		current = current === 'fan' ? 'artist' : 'fan';
	}
};
