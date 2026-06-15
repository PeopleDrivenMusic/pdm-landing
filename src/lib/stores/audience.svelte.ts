export type Audience = 'fan' | 'artist';

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
