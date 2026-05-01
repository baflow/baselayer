<script lang="ts">
  import { onMount } from 'svelte';
  import * as THREE from 'three';

  let canvasEl: HTMLCanvasElement;
  let containerEl: HTMLDivElement;

  onMount(() => {
    if (!canvasEl) return;

    const scene = new THREE.Scene();

    // Isometric-ish camera — 45° top-down angle, rotated 45° on Y
    const frustumSize = 5;
    const aspect = canvasEl.clientWidth / canvasEl.clientHeight;
    const camera = new THREE.OrthographicCamera(
      -frustumSize * aspect / 2,
      frustumSize * aspect / 2,
      frustumSize / 2,
      -frustumSize / 2,
      0.1,
      100
    );
    // Isometric angle: camera looks down at ~35.264° (arctan(1/√2))
    const isoAngle = Math.atan(Math.SQRT2);
    camera.position.set(4, 4, 4);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasEl,
      alpha: true,
      antialias: true,
    });
    renderer.setSize(canvasEl.clientWidth, canvasEl.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Emerald-400: #34d399
    const emerald = new THREE.Color('#34d399');

    // --- Circle grid: concentric rings + radial lines ---
    const circleGroup = new THREE.Group();
    const lineMaterial = new THREE.LineBasicMaterial({
      color: emerald,
      transparent: true,
      opacity: 0.5,
    });
    const lineMaterialDim = new THREE.LineBasicMaterial({
      color: emerald,
      transparent: true,
      opacity: 0.15,
    });

    // Concentric rings
    const ringRadii = [0.8, 1.6, 2.4, 3.2];
    const ringSegments = 128;
    for (const radius of ringRadii) {
      const points: THREE.Vector3[] = [];
      for (let i = 0; i <= ringSegments; i++) {
        const theta = (i / ringSegments) * Math.PI * 2;
        points.push(new THREE.Vector3(Math.cos(theta) * radius, 0, Math.sin(theta) * radius));
      }
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = radius === ringRadii[0] ? lineMaterial : lineMaterialDim;
      circleGroup.add(new THREE.Line(geometry, material));
    }

    // Radial lines (spokes)
    const spokeCount = 24;
    const spokeLength = ringRadii[ringRadii.length - 1];
    for (let i = 0; i < spokeCount; i++) {
      const theta = (i / spokeCount) * Math.PI * 2;
      const points = [
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(Math.cos(theta) * spokeLength, 0, Math.sin(theta) * spokeLength),
      ];
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      circleGroup.add(new THREE.Line(geometry, lineMaterialDim));
    }

    scene.add(circleGroup);

    // --- Scattered particles on the circle plane ---
    const particleCount = 60;
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = 0.4 + Math.random() * 2.8;
      particlePositions[i * 3] = Math.cos(angle) * r;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 0.3;
      particlePositions[i * 3 + 2] = Math.sin(angle) * r;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: emerald,
      size: 0.06,
      transparent: true,
      opacity: 0.6,
      sizeAttenuation: true,
    });
    scene.add(new THREE.Points(particleGeo, particleMat));

    // --- Bright ring outline (outermost) ---
    const outerRingPoints: THREE.Vector3[] = [];
    const outerRadius = ringRadii[ringRadii.length - 1] + 0.03;
    for (let i = 0; i <= 128; i++) {
      const theta = (i / 128) * Math.PI * 2;
      outerRingPoints.push(new THREE.Vector3(Math.cos(theta) * outerRadius, 0, Math.sin(theta) * outerRadius));
    }
    const outerRingGeo = new THREE.BufferGeometry().setFromPoints(outerRingPoints);
    const outerRingMat = new THREE.LineBasicMaterial({ color: emerald, transparent: true, opacity: 0.8 });
    scene.add(new THREE.Line(outerRingGeo, outerRingMat));

    // --- Pointer tracking ---
    let mouseX = 0;
    let mouseY = 0;

    function onPointerMove(e: PointerEvent) {
      if (!containerEl) return;
      const rect = containerEl.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    }
    function onPointerLeave() {
      mouseX = 0;
      mouseY = 0;
    }
    containerEl.addEventListener('pointermove', onPointerMove);
    containerEl.addEventListener('pointerleave', onPointerLeave);

    // --- Resize ---
    function onResize() {
      if (!canvasEl) return;
      const w = canvasEl.clientWidth;
      const h = canvasEl.clientHeight;
      const a = w / h;
      camera.left = -frustumSize * a / 2;
      camera.right = frustumSize * a / 2;
      camera.top = frustumSize / 2;
      camera.bottom = -frustumSize / 2;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }
    const resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(canvasEl);

    // --- Animate ---
    let raf: number;
    const clock = new THREE.Clock();

    function animate() {
      raf = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Slow rotation of the circle grid
      circleGroup.rotation.y = t * 0.08;

      // Subtle tilt toward pointer
      const targetRotX = mouseY * 0.1;
      const targetRotZ = -mouseX * 0.1;
      circleGroup.rotation.x += (targetRotX - circleGroup.rotation.x) * 0.04;
      circleGroup.rotation.z += (targetRotZ - circleGroup.rotation.z) * 0.04;

      // Breathing pulse on particle opacity
      particleMat.opacity = 0.4 + Math.sin(t * 1.5) * 0.2;

      renderer.render(scene, camera);
    }

    animate();

    return () => {
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      containerEl.removeEventListener('pointermove', onPointerMove);
      containerEl.removeEventListener('pointerleave', onPointerLeave);
      renderer.dispose();
      scene.clear();
    };
  });
</script>

<div
  bind:this={containerEl}
  class="w-full aspect-square rounded-xl relative overflow-hidden cursor-crosshair"
>
  <canvas
    bind:this={canvasEl}
    class="absolute inset-0 w-full h-full z-0"
  ></canvas>
  <div class="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/10 pointer-events-none"></div>
</div>