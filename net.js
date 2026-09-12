/* The suite, as an object: a 64 × 64 lattice — one knot per test — with seven
   weights on it, one per insurer in production. Nothing here moves on its own;
   the pointer is a load. three.js is fetched only when the band comes close. */
(() => {
  const THREE_URL = 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.min.js';
  const band = document.querySelector('.net');
  if (!band) return;
  const canvas = band.querySelector('.net-canvas');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const S = (window.DATA && DATA.suite) || { lattice: 64, tenants: 7 };
  const N = S.lattice;
  const SIZE = 110;
  const HALF = SIZE / 2;

  // Seven weights: x, z, radius. Fixed rather than random so the still frame
  // is the same every visit and already shows the net under load.
  const WEIGHTS = [
    [-36, -20, 5.4], [-12, 4, 6.4], [13, -27, 4.8], [31, 12, 5.8],
    [-26, 27, 4.9], [3, 31, 5.4], [39, -7, 4.4],
  ].slice(0, S.tenants);

  const knotX = i => -HALF + (i % N) * (SIZE / (N - 1));
  const knotZ = i => -HALF + Math.floor(i / N) * (SIZE / (N - 1));

  // Sag under the seven weights — precomputed once, never recomputed.
  const sagAt = (x, z) => {
    let y = 0;
    for (let w = 0; w < WEIGHTS.length; w++) {
      const dx = x - WEIGHTS[w][0], dz = z - WEIGHTS[w][1];
      const r = WEIGHTS[w][2], sigma = r * 2.7;
      y -= r * 1.55 * Math.exp(-(dx * dx + dz * dz) / (sigma * sigma));
    }
    return y;
  };

  /* ── Fallback: the same net, flat, drawn before anything is fetched ────── */
  const drawFallback = () => {
    const host = band.querySelector('.net-fallback');
    if (!host) return;
    const M = 26;                                   // coarser grid for SVG
    const px = (x, z, y) => {
      const depth = 1 + z * 0.004;
      return [500 + x * 7.4 * depth, 210 + z * 3.1 - y * 5.2];
    };
    const at = k => -HALF + k * (SIZE / (M - 1));
    const line = pts => `<polyline points="${pts.join(' ')}" />`;
    let d = '';
    for (let i = 0; i < M; i++) {
      const row = [], col = [];
      for (let j = 0; j < M; j++) {
        const a = px(at(j), at(i), sagAt(at(j), at(i)));
        const b = px(at(i), at(j), sagAt(at(i), at(j)));
        row.push(a[0].toFixed(1) + ',' + a[1].toFixed(1));
        col.push(b[0].toFixed(1) + ',' + b[1].toFixed(1));
      }
      d += line(row) + line(col);
    }
    const balls = WEIGHTS.map(([x, z, r]) => {
      const c = px(x, z, sagAt(x, z) + r);
      return `<circle cx="${c[0].toFixed(1)}" cy="${c[1].toFixed(1)}" r="${(r * 7.0).toFixed(1)}" />`;
    }).join('');
    host.innerHTML =
      `<svg viewBox="0 0 1000 470" preserveAspectRatio="xMidYMid slice" aria-hidden="true">` +
      `<g class="nf-mesh" fill="none" stroke-width="1">${d}</g>` +
      `<g class="nf-weights">${balls}</g></svg>`;
  };
  drawFallback();

  let started = false;
  const near = new IntersectionObserver(entries => {
    if (started || !entries.some(e => e.isIntersecting)) return;
    started = true;
    near.disconnect();
    start();
  }, { rootMargin: '700px 0px' });
  near.observe(band);

  async function start() {
    let THREE;
    try { THREE = await import(THREE_URL); } catch { return; }

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
    } catch { return; }
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));

    const cream = new THREE.Color('#f5ead8');
    const scene = new THREE.Scene();
    scene.background = cream;
    scene.fog = new THREE.Fog(cream, 95, 215);

    const camera = new THREE.PerspectiveCamera(42, 1, 1, 400);
    camera.position.set(0, 30, 92);
    camera.lookAt(0, -7, 0);

    scene.add(new THREE.HemisphereLight(0xf5ead8, 0x56633f, 0.75));
    const key = new THREE.DirectionalLight(0xfff0db, 0.9);
    key.position.set(40, 70, 50);
    scene.add(key);

    /* One position buffer shared by the lines and the knots, so a frame
       updates 4,096 vertices and the index does the rest. */
    const COUNT = N * N;
    const pos = new THREE.BufferAttribute(new Float32Array(COUNT * 3), 3);
    const col = new THREE.BufferAttribute(new Float32Array(COUNT * 3), 3);
    const base = new Float32Array(COUNT);

    for (let i = 0; i < COUNT; i++) {
      const x = knotX(i), z = knotZ(i);
      base[i] = sagAt(x, z);
      pos.setXYZ(i, x, base[i], z);
    }

    const idx = [];
    for (let r = 0; r < N; r++) {
      for (let c = 0; c < N - 1; c++) {
        idx.push(r * N + c, r * N + c + 1);
        idx.push(c * N + r, (c + 1) * N + r);
      }
    }
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', pos);
    lineGeo.setAttribute('color', col);
    lineGeo.setIndex(idx);
    scene.add(new THREE.LineSegments(lineGeo, new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.9 })));

    const dotGeo = new THREE.BufferGeometry();
    dotGeo.setAttribute('position', pos);
    dotGeo.setAttribute('color', col);
    scene.add(new THREE.Points(dotGeo, new THREE.PointsMaterial({ vertexColors: true, size: 0.9, sizeAttenuation: true })));

    const rest = new THREE.Color('#7a8a5e');
    const loaded = new THREE.Color('#c67139');
    for (let i = 0; i < COUNT; i++) col.setXYZ(i, rest.r, rest.g, rest.b);

    const balls = WEIGHTS.map(([x, z, r]) => {
      const m = new THREE.Mesh(
        new THREE.IcosahedronGeometry(r, 1),
        new THREE.MeshLambertMaterial({ color: '#201e1d', flatShading: true })
      );
      m.position.set(x, sagAt(x, z) + r * 0.86, z);
      scene.add(m);
      return m;
    });

    const resize = () => {
      const w = band.clientWidth, h = band.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };

    // The pointer is a load: press and the net gives, release and it settles.
    const ray = new THREE.Raycaster();
    const ground = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const hit = new THREE.Vector3();
    const press = { x: 0, z: 0, load: 0, want: 0 };
    const PRESS_DEPTH = 11, PRESS_SIGMA = 17;

    const aim = (e) => {
      const r = canvas.getBoundingClientRect();
      ray.setFromCamera(
        new THREE.Vector2(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1),
        camera
      );
      if (ray.ray.intersectPlane(ground, hit)) { press.x = hit.x; press.z = hit.z; }
    };

    const shape = () => {
      const L = press.load;
      for (let i = 0; i < COUNT; i++) {
        let y = base[i];
        let dip = 0;
        if (L > 0.001) {
          const dx = knotX(i) - press.x, dz = knotZ(i) - press.z;
          dip = PRESS_DEPTH * L * Math.exp(-(dx * dx + dz * dz) / (PRESS_SIGMA * PRESS_SIGMA));
          y -= dip;
        }
        pos.setY(i, y);
        const t = Math.min(1, dip / 4);
        col.setXYZ(i, rest.r + (loaded.r - rest.r) * t, rest.g + (loaded.g - rest.g) * t, rest.b + (loaded.b - rest.b) * t);
      }
      pos.needsUpdate = true;
      col.needsUpdate = true;
      // The weights ride the surface they are standing on.
      balls.forEach((m, k) => {
        const [x, z, r] = WEIGHTS[k];
        let y = sagAt(x, z);
        if (L > 0.001) {
          const dx = x - press.x, dz = z - press.z;
          y -= PRESS_DEPTH * L * Math.exp(-(dx * dx + dz * dz) / (PRESS_SIGMA * PRESS_SIGMA));
        }
        m.position.y = y + r * 0.86;
      });
    };

    resize();
    shape();

    if (reduced) {
      renderer.render(scene, camera);
      window.addEventListener('resize', () => { resize(); renderer.render(scene, camera); });
      band.classList.add('ready');
      return;
    }

    let raf = 0, running = false;
    const frame = () => {
      raf = requestAnimationFrame(frame);
      const d = press.want - press.load;
      press.load += d * (d > 0 ? 0.22 : 0.1);
      if (Math.abs(d) < 0.002) press.load = press.want;
      shape();
      renderer.render(scene, camera);
    };
    const run = (on) => {
      if (on === running) return;
      running = on;
      if (on) raf = requestAnimationFrame(frame); else cancelAnimationFrame(raf);
    };

    const onScreen = new IntersectionObserver(
      entries => run(entries[0].isIntersecting && document.visibilityState === 'visible'),
      { rootMargin: '120px 0px' }
    );
    onScreen.observe(band);
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState !== 'visible') return run(false);
      const r = band.getBoundingClientRect();
      run(r.bottom > -120 && r.top < innerHeight + 120);
    });
    window.addEventListener('resize', resize);

    canvas.addEventListener('pointerdown', e => {
      aim(e);
      press.want = 1;
      try { canvas.setPointerCapture(e.pointerId); } catch {}
      band.classList.add('pressing');
    });
    canvas.addEventListener('pointermove', e => { if (press.want) aim(e); });
    const release = () => { press.want = 0; band.classList.remove('pressing'); };
    canvas.addEventListener('pointerup', release);
    canvas.addEventListener('pointercancel', release);

    band.classList.add('ready');
  }
})();
