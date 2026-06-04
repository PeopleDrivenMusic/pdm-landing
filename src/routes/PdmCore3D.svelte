<script lang="ts">
	import { browser } from '$app/environment';
	import { onDestroy, onMount } from 'svelte';

	let { progress = 0 }: { progress?: number } = $props();
	let host: HTMLDivElement;
	let frame = 0;
	let renderer: any;
	let scene: any;
	let camera: any;
	let core: any;
	let particles: any;
	let resizeObserver: ResizeObserver;
	const pointer = { x: 0, y: 0 };

	function movePointer(event: PointerEvent) {
		const rect = host.getBoundingClientRect();
		pointer.x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
		pointer.y = -((event.clientY - rect.top) / rect.height - 0.5) * 2;
	}

	function clearPointer() {
		pointer.x = 0;
		pointer.y = 0;
	}

	onMount(async () => {
		const THREE = await import('three');

		scene = new THREE.Scene();
		camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
		camera.position.set(0, 0, 7);

		renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
		renderer.outputColorSpace = THREE.SRGBColorSpace;
		host.appendChild(renderer.domElement);

		const ambient = new THREE.AmbientLight(0xffffff, 1.45);
		const key = new THREE.PointLight(0xffd36b, 5.2, 18);
		key.position.set(3.5, 2.8, 4.8);
		const rim = new THREE.PointLight(0x7ea7ff, 2.1, 16);
		rim.position.set(-4, -1, 3);
		scene.add(ambient, key, rim);

		core = new THREE.Group();
		scene.add(core);

		const ringMaterial = new THREE.MeshPhysicalMaterial({
			color: 0xe1a318,
			metalness: 1,
			roughness: 0.18,
			clearcoat: 1,
			clearcoatRoughness: 0.12,
			emissive: 0x3a2100,
			emissiveIntensity: 0.28
		});

		const blackMaterial = new THREE.MeshPhysicalMaterial({
			color: 0x070707,
			metalness: 0.92,
			roughness: 0.28,
			clearcoat: 0.7
		});

		const glassMaterial = new THREE.MeshPhysicalMaterial({
			color: 0xffdf7b,
			metalness: 0.2,
			roughness: 0.1,
			transmission: 0.35,
			thickness: 0.4,
			transparent: true,
			opacity: 0.55,
			emissive: 0x7b4a00,
			emissiveIntensity: 0.24
		});

		const outer = new THREE.Mesh(new THREE.TorusGeometry(1.85, 0.09, 24, 160), ringMaterial);
		const inner = new THREE.Mesh(new THREE.TorusGeometry(1.1, 0.045, 16, 120), ringMaterial);
		const disk = new THREE.Mesh(new THREE.CylinderGeometry(1.34, 1.34, 0.08, 128), blackMaterial);
		const lens = new THREE.Mesh(new THREE.SphereGeometry(0.66, 64, 64), glassMaterial);
		disk.rotation.x = Math.PI / 2;
		core.add(outer, inner, disk, lens);

		const canvas = document.createElement('canvas');
		canvas.width = 512;
		canvas.height = 512;
		const ctx = canvas.getContext('2d');
		if (ctx) {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			ctx.fillStyle = '#ffe58a';
			ctx.font = 'bold 148px Georgia, serif';
			ctx.textAlign = 'center';
			ctx.textBaseline = 'middle';
			ctx.shadowColor = '#f2a900';
			ctx.shadowBlur = 28;
			ctx.fillText('PDM', 256, 266);
		}
		const texture = new THREE.CanvasTexture(canvas);
		texture.colorSpace = THREE.SRGBColorSpace;
		const textPlane = new THREE.Mesh(
			new THREE.PlaneGeometry(1.8, 0.55),
			new THREE.MeshBasicMaterial({ map: texture, transparent: true })
		);
		textPlane.position.z = 0.72;
		core.add(textPlane);

		const count = 520;
		const positions = new Float32Array(count * 3);
		for (let i = 0; i < count; i += 1) {
			const radius = 2.45 + Math.random() * 1.7;
			const angle = Math.random() * Math.PI * 2;
			const height = (Math.random() - 0.5) * 2.5;
			positions[i * 3] = Math.cos(angle) * radius;
			positions[i * 3 + 1] = height;
			positions[i * 3 + 2] = Math.sin(angle) * radius;
		}
		const particleGeometry = new THREE.BufferGeometry();
		particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
		particles = new THREE.Points(
			particleGeometry,
			new THREE.PointsMaterial({
				color: 0xffdf7b,
				size: 0.028,
				transparent: true,
				opacity: 0.72,
				blending: THREE.AdditiveBlending,
				depthWrite: false
			})
		);
		scene.add(particles);

		function resize() {
			const width = Math.max(host.clientWidth, 1);
			const height = Math.max(host.clientHeight, 1);
			renderer.setSize(width, height, false);
			camera.aspect = width / height;
			camera.updateProjectionMatrix();
		}

		resizeObserver = new ResizeObserver(resize);
		resizeObserver.observe(host);
		resize();

		function animate() {
			const intensity = 0.35 + progress * 1.35;
			core.rotation.y += 0.006 + progress * 0.01;
			core.rotation.x += (pointer.y * 0.32 - core.rotation.x) * 0.06;
			core.rotation.z += (pointer.x * -0.26 - core.rotation.z) * 0.06;
			core.scale.setScalar(1 + Math.sin(performance.now() * 0.0015) * 0.025 + progress * 0.08);

			particles.rotation.y -= 0.002 + progress * 0.006;
			particles.rotation.x += 0.0008;
			particles.material.opacity = 0.34 + intensity * 0.34;
			key.intensity = 3.6 + intensity * 3.2;

			camera.position.x += (pointer.x * 0.45 - camera.position.x) * 0.04;
			camera.position.y += (pointer.y * 0.28 - camera.position.y) * 0.04;
			camera.lookAt(0, 0, 0);
			renderer.render(scene, camera);
			frame = requestAnimationFrame(animate);
		}

		animate();
	});

	onDestroy(() => {
		if (!browser) return;

		cancelAnimationFrame(frame);
		resizeObserver?.disconnect();
		renderer?.dispose();
		if (renderer?.domElement?.parentNode) {
			renderer.domElement.parentNode.removeChild(renderer.domElement);
		}
	});
</script>

<div
	class="core-3d"
	bind:this={host}
	onpointermove={movePointer}
	onpointerleave={clearPointer}
	aria-label="Interactive PDM fanbase core"
	role="img"
></div>

<style>
	.core-3d {
		position: absolute;
		inset: 0;
		min-height: 100%;
		cursor: grab;
	}

	.core-3d:active {
		cursor: grabbing;
	}

	.core-3d :global(canvas) {
		display: block;
		width: 100%;
		height: 100%;
	}
</style>
