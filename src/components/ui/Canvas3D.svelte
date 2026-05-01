<script lang="ts">
  import { onMount } from 'svelte';
  import * as THREE from 'three';

  let canvasEl: HTMLCanvasElement;
  let containerEl: HTMLDivElement;

  onMount(() => {
    if (!canvasEl) return;

    // ── Scene & orthographic iso camera ────────────────────────
    const scene = new THREE.Scene();

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
    camera.position.set(4, 4, 4);
    camera.lookAt(0, 0, 0);
    camera.updateMatrixWorld();

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasEl,
      alpha: true,
      antialias: true,
    });
    renderer.setSize(canvasEl.clientWidth, canvasEl.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // ── Camera basis vectors (for screen-aligned target lines) ─
    const camRight = new THREE.Vector3();
    const camUp = new THREE.Vector3();
    camRight.setFromMatrixColumn(camera.matrixWorld, 0).normalize();
    camUp.setFromMatrixColumn(camera.matrixWorld, 1).normalize();

    // ── Build morph geometry ───────────────────────────────────
    // Each plane is a grid with N×N divisions.
    // Start: grid lines on flat XY planes, spaced in Z.
    // End: screen-aligned parallel diagonal lines (60° on screen).
    // The shader lerps each vertex from start → end based on uProgress.

    const planeCount = 4;
    const divisions = 3; // grid lines per direction per plane
    const size = 2.0;
    const half = size / 2;
    const step = size / divisions;
    const zSpacing = 0.9;
    const zOffsets = Array.from(
      { length: planeCount },
      (_, i) => (i - (planeCount - 1) / 2) * zSpacing
    );

    // Target lines: screen-aligned at 60°
    const screenAngle = Math.PI / 3; // 60° on screen
    const lineDir = new THREE.Vector3()
      .addScaledVector(camRight, Math.cos(screenAngle))
      .addScaledVector(camUp, Math.sin(screenAngle))
      .normalize();
    const perpDir = new THREE.Vector3()
      .addScaledVector(camRight, -Math.sin(screenAngle))
      .addScaledVector(camUp, Math.cos(screenAngle))
      .normalize();

    const linesPerPlane = 2 * (divisions + 1); // horizontal + vertical
    const totalLines = planeCount * linesPerPlane;
    const lineSpacing = 0.28;
    const lineHalfLen = 3.0;

    const positions: number[] = [];
    const targets: number[] = [];
    const aLineIdx: number[] = [];
    const aPlaneIdx: number[] = [];

    let lineIdx = 0;

    for (let p = 0; p < planeCount; p++) {
      const zOff = zOffsets[p];

      // Horizontal grid lines (constant y)
      for (let i = 0; i <= divisions; i++) {
        const y = -half + i * step;
        // Start: grid position
        positions.push(-half, y, zOff, half, y, zOff);

        // End: diagonal line in screen-aligned space
        const d = (lineIdx - (totalLines - 1) / 2) * lineSpacing;
        const center = perpDir.clone().multiplyScalar(d);
        const startPt = center.clone().addScaledVector(lineDir, -lineHalfLen);
        const endPt = center.clone().addScaledVector(lineDir, lineHalfLen);
        targets.push(startPt.x, startPt.y, startPt.z, endPt.x, endPt.y, endPt.z);

        aLineIdx.push(lineIdx, lineIdx);
        aPlaneIdx.push(p, p);
        lineIdx++;
      }

      // Vertical grid lines (constant x)
      for (let i = 0; i <= divisions; i++) {
        const x = -half + i * step;
        positions.push(x, -half, zOff, x, half, zOff);

        const d = (lineIdx - (totalLines - 1) / 2) * lineSpacing;
        const center = perpDir.clone().multiplyScalar(d);
        const startPt = center.clone().addScaledVector(lineDir, -lineHalfLen);
        const endPt = center.clone().addScaledVector(lineDir, lineHalfLen);
        targets.push(startPt.x, startPt.y, startPt.z, endPt.x, endPt.y, endPt.z);

        aLineIdx.push(lineIdx, lineIdx);
        aPlaneIdx.push(p, p);
        lineIdx++;
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('aTarget', new THREE.Float32BufferAttribute(targets, 3));
    geometry.setAttribute('aLineIdx', new THREE.Float32BufferAttribute(aLineIdx, 1));
    geometry.setAttribute('aPlaneIdx', new THREE.Float32BufferAttribute(aPlaneIdx, 1));

    // ── Shaders ────────────────────────────────────────────────
    const vertexShader = /* glsl */ `
      uniform float uProgress;
      uniform vec2 uMouse;
      attribute vec3 aTarget;
      attribute float aLineIdx;
      attribute float aPlaneIdx;

      varying float vAlpha;

      const float TOTAL_LINES = ${totalLines.toFixed(1)};

      void main() {
        vec3 startPos = position;
        vec3 endPos = aTarget;

        // Stagger: lines morph with a wave based on grid position
        float stagger = aLineIdx / (TOTAL_LINES - 1.0);
        float t = clamp((uProgress - stagger * 0.5) / 0.5, 0.0, 1.0);

        // Smoothstep easing
        t = t * t * (3.0 - 2.0 * t);

        vec3 pos = mix(startPos, endPos, t);

        // Subtle pointer-reactive rotation
        float rz = uMouse.x * 0.12;
        float rx = uMouse.y * 0.08;
        float cz = cos(rz), sz = sin(rz);
        float cx = cos(rx), sx = sin(rx);

        // Rotate Z
        float xz = pos.x * cz - pos.y * sz;
        float yz = pos.x * sz + pos.y * cz;
        pos.x = xz;
        pos.y = yz;

        // Rotate X
        float yx = pos.y * cx - pos.z * sx;
        float zx = pos.y * sx + pos.z * cx;
        pos.y = yx;
        pos.z = zx;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);

        // Slight alpha variation: lines that haven't started morphing or have finished are more opaque
        vAlpha = 0.5 + 0.5 * (1.0 - abs(2.0 * t - 1.0));
      }
    `;

    const fragmentShader = /* glsl */ `
      uniform vec3 uColor;
      varying float vAlpha;

      void main() {
        gl_FragColor = vec4(uColor, vAlpha);
      }
    `;

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uProgress: { value: 0.0 },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uColor: { value: new THREE.Color('#34d399') },
      },
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
    });

    const lines = new THREE.LineSegments(geometry, material);
    scene.add(lines);

    // ── Pointer drift ──────────────────────────────────────────
    let mx = 0, my = 0;
    const onMove = (e: PointerEvent) => {
      if (!containerEl) return;
      const r = containerEl.getBoundingClientRect();
      mx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      my = ((e.clientY - r.top) / r.height - 0.5) * 2;
    };
    const onLeave = () => { mx = 0; my = 0; };
    containerEl.addEventListener('pointermove', onMove);
    containerEl.addEventListener('pointerleave', onLeave);

    // ── Resize ──────────────────────────────────────────────────
    const ro = new ResizeObserver(() => {
      if (!canvasEl) return;
      const w = canvasEl.clientWidth, h = canvasEl.clientHeight;
      const a = w / h;
      camera.left = -frustumSize * a / 2;
      camera.right = frustumSize * a / 2;
      camera.top = frustumSize / 2;
      camera.bottom = -frustumSize / 2;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
    ro.observe(canvasEl);

    // ── Animate ────────────────────────────────────────────────
    let raf: number;
    const clock = new THREE.Clock();

    function animate() {
      raf = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Breathing: 0 → 1 → 0 over ~10s cycle
      const progress = (Math.sin(t * 0.6) + 1.0) * 0.5;

      material.uniforms.uProgress.value = progress;
      material.uniforms.uMouse.value.set(mx, my);

      renderer.render(scene, camera);
    }
    animate();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      containerEl.removeEventListener('pointermove', onMove);
      containerEl.removeEventListener('pointerleave', onLeave);
      renderer.dispose();
      scene.clear();
      geometry.dispose();
      material.dispose();
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
</div>