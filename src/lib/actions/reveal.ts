import type { Action } from 'svelte/action';
import { prefersReducedMotion } from '$lib/motion/prefersReducedMotion';

interface RevealOptions {
	delay?: number; // ms
	y?: number; // px translateY start offset
	once?: boolean;
}

/** Fades + slides an element into view on scroll. Respects reduced motion
 *  (shows immediately, no transform). Uses transform/opacity only. */
export const reveal: Action<HTMLElement, RevealOptions | undefined> = (node, options) => {
	const { delay = 0, y = 24, once = true } = options ?? {};

	if (prefersReducedMotion()) {
		node.style.opacity = '1';
		return {};
	}

	node.style.opacity = '0';
	node.style.transform = `translateY(${y}px)`;
	node.style.transition = `opacity var(--dur-slow) var(--ease-out) ${delay}ms, transform var(--dur-slow) var(--ease-out) ${delay}ms`;
	node.style.willChange = 'opacity, transform';

	const show = () => {
		node.style.opacity = '1';
		node.style.transform = 'translateY(0)';
	};
	const hide = () => {
		node.style.opacity = '0';
		node.style.transform = `translateY(${y}px)`;
	};

	const io = new IntersectionObserver(
		(entries) => {
			for (const e of entries) {
				if (e.isIntersecting) {
					show();
					if (once) io.unobserve(node);
				} else if (!once) {
					hide();
				}
			}
		},
		{ threshold: 0.15, rootMargin: '0px 0px -10% 0px' }
	);
	io.observe(node);

	return { destroy: () => io.disconnect() };
};
