type IdleWindow = Window &
	typeof globalThis & {
		requestIdleCallback?: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number;
		cancelIdleCallback?: (handle: number) => void;
	};

/** Run non-critical work after the browser has had a chance to paint the SSR content. */
export function runAfterInitialPaint(
	callback: () => void | Promise<void>,
	timeout = 1600
): () => void {
	if (typeof window === 'undefined') return () => {};

	const idleWindow = window as IdleWindow;
	let cancelled = false;
	let frame = 0;
	let idle = 0;
	let timer = 0;

	const run = () => {
		if (!cancelled) void callback();
	};

	frame = window.requestAnimationFrame(() => {
		if (idleWindow.requestIdleCallback) {
			idle = idleWindow.requestIdleCallback(run, { timeout });
		} else {
			timer = window.setTimeout(run, Math.min(timeout, 1200));
		}
	});

	return () => {
		cancelled = true;
		window.cancelAnimationFrame(frame);
		if (idle && idleWindow.cancelIdleCallback) idleWindow.cancelIdleCallback(idle);
		if (timer) window.clearTimeout(timer);
	};
}
