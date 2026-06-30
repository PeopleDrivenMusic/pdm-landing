import type Lenis from 'lenis';
import { prefersReducedMotion } from './prefersReducedMotion';

let lenis: Lenis | null = null;

/** Initialise inertial smooth scroll + GSAP ScrollTrigger sync.
 *  No-op (and returns a no-op cleanup) when reduced motion is requested. */
export async function initSmoothScroll(): Promise<() => void> {
	if (typeof window === 'undefined') return () => {};

	if (prefersReducedMotion()) {
		return () => {};
	}

	const [{ default: Lenis }, { gsap }, { ScrollTrigger }] = await Promise.all([
		import('lenis'),
		import('gsap'),
		import('gsap/ScrollTrigger')
	]);

	gsap.registerPlugin(ScrollTrigger);

	lenis = new Lenis({ duration: 1.1, smoothWheel: true });
	lenis.on('scroll', ScrollTrigger.update);

	const raf = (time: number) => {
		lenis?.raf(time * 1000);
	};
	gsap.ticker.add(raf);
	gsap.ticker.lagSmoothing(0);

	return () => {
		gsap.ticker.remove(raf);
		lenis?.destroy();
		lenis = null;
	};
}

export function getLenis(): Lenis | null {
	return lenis;
}
