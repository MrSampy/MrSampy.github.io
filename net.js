/* The suite, as an object you can load.

   One knot per test. Scrolling through the band tightens the lattice from
   24 × 24 to 64 × 64 — the suite's real growth, 600 tests to 4,100 — and the
   sag under the seven insurers comes out of it as it tightens. Pressing puts
   your own load on it. Nothing moves on a timer; three.js is fetched only when
   the band comes close, and the same numbers render as flat SVG without it. */
(() => {
  const THREE_URL = 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.min.js';
  const band = document.querySelector('.net');
  if (!band) return;
  const canvas = band.querySelector('.net-canvas');
  const countEl = document.getElementById('netCount');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const fmt = n => new Intl.NumberFormat('en-US').format(n);

  const S = (window.DATA && DATA.suite) || { lattice: 64, tenants: 7 };
  const N = S.lattice, M_MIN = 24;
  const SIZE = 110, HALF = SIZE / 2;

  // Seven weights: x, z, radius. Fixed, so the still frame is the same every
  // visit and already shows the net carrying something.
  const WEIGHTS = [
    [-36, -20, 5.4], [-12, 4, 6.4], [13, -27, 4.8], [31, 12, 5.8],
    [-26, 27, 4.9], [3, 31, 5.4], [39, -7, 4.4],
  ].slice(0, S.tenants);

  const sagAt = (x, z) => {
    let y = 0;
    for (let w = 0; w < WEIGHTS.length; w++) {
      const dx = x - WEIGHTS[w][0], dz = z - WEIGHTS[w][1];
      const r = WEIGHTS[w][2], sigma = r * 2.7;
      y -= r * 1.55 * Math.exp(-(dx * dx + dz * dz) / (sigma * sigma));
    }
    return y;
  };

  // How far the reader is through the band: 0 as it enters, 1 as it leaves.
  const progress = () => {
    const r = band.getBoundingClientRect();
    return clamp((innerHeight - r.top) / (r.height + innerHeight), 0, 1);
  };
  // Eased so the net stays visibly loose for most of the band and pulls tight
  // at the end — the suite's growth was back-loaded too.
  const grown = p => Math.pow(p, 1.6);
  const sideFor = p => Math.round(M_MIN + (N - M_MIN) * grown(p));
  // Fewer threads, more give: the sag falls out as the lattice tightens.
  const sagScale = p => 1.8 - 0.8 * grown(p);

  let shownSide = -1;
  const syncCount = () => {
    const m = sideFor(progress());
    if (m !== shownSide) {
      shownSide = m;
      if (countEl) countEl.textContent = fmt(m * m);
    }
    return m;
  };
  syncCount();
  window.addEventListener('scroll', syncCount, { passive: true });
  window.addEventListener('resize', syncCount);

  /* ── Fallback: the same net, flat, drawn before anything is fetched ────── */
  (() => {
    const host = band.querySelector('.net-fallback');
    if (!host) return;
    const M = 26;
    const px = (x, z, y) => {
      const depth = 1 + z * 0.004;
      return [500 + x * 7.4 * depth, 210 + z * 3.1 - y * 5.2];
    };
    const at = k => -HALF + k * (SIZE / (M - 1));
    let d = '';
    for (let i = 0; i < M; i++) {
      const row = [], colm = [];
      for (let j = 0; j < M; j++) {
        const a = px(at(j), at(i), sagAt(at(j), at(i)));
        const b = px(at(i), at(j), sagAt(at(i), at(j)));
        row.push(a[0].toFixed(1) + ',' + a[1].toFixed(1));
        colm.push(b[0].toFixed(1) + ',' + b[1].toFixed(1));
      }
      d += `<polyline points="${row.join(' ')}" /><polyline points="${colm.join(' ')}" />`;
    }
    const balls = WEIGHTS.map(([x, z, r]) => {
      const c = px(x, z, sagAt(x, z) + r);
      return `<circle cx="${c[0].toFixed(1)}" cy="${c[1].toFixed(1)}" r="${(r * 7).toFixed(1)}" />`;
    }).join('');
    host.innerHTML =
      `<svg viewBox="0 0 1000 470" preserveAspectRatio="xMidYMid slice" aria-hidden="true">` +
      `<g class="nf-mesh" fill="none" stroke-width="1">${d}</g>` +
      `<g class="nf-weights">${balls}</g></svg>`;
  })();

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
    scene.add(new THREE.HemisphereLight(0xf5ead8, 0x56633f, 0.75));
    const key = new THREE.DirectionalLight(0xfff0db, 0.9);
    key.position.set(40, 70, 50);
    scene.add(key);

    /* One position buffer, shared by the lines and the knots. The lattice is
       re-laid only when the knot count actually changes — a few dozen times
       over the whole band, never per frame. */
    const MAX = N * N;
    const pos = new THREE.BufferAttribute(new Float32Array(MAX * 3), 3);
    const col = new THREE.BufferAttribute(new Float32Array(MAX * 3), 3);
    const base = new Float32Array(MAX);

    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', pos);
    lineGeo.setAttribute('color', col);
    scene.add(new THREE.LineSegments(lineGeo, new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.9 })));

    const dotGeo = new THREE.BufferGeometry();
    dotGeo.setAttribute('position', pos);
    dotGeo.setAttribute('color', col);
    scene.add(new THREE.Points(dotGeo, new THREE.PointsMaterial({ vertexColors: true, size: 0.9, sizeAttenuation: true })));

    const rest = new THREE.Color('#7a8a5e');
    const loadedTone = new THREE.Color('#c67139');
    for (let i = 0; i < MAX; i++) col.setXYZ(i, rest.r, rest.g, rest.b);

    const balls = WEIGHTS.map(([x, z, r]) => {
      const m = new THREE.Mesh(
        new THREE.IcosahedronGeometry(r, 1),
        new THREE.MeshLambertMaterial({ color: '#201e1d', flatShading: true })
      );
      scene.add(m);
      return m;
    });

    let side = 0, knots = 0;
    const setGrid = (m) => {
      if (m === side) return;
      side = m;
      knots = m * m;
      const step = SIZE / (m - 1);
      for (let i = 0; i < knots; i++) {
        const x = -HALF + (i % m) * step, z = -HALF + Math.floor(i / m) * step;
        base[i] = sagAt(x, z);
        pos.setXYZ(i, x, base[i], z);
      }
      const idx = [];
      for (let r = 0; r < m; r++) {
        for (let c = 0; c < m - 1; c++) {
          idx.push(r * m + c, r * m + c + 1);
          idx.push(c * m + r, (c + 1) * m + r);
        }
      }
      lineGeo.setIndex(idx);
      lineGeo.setDrawRange(0, idx.length);
      dotGeo.setDrawRange(0, knots);
    };

    // The pointer is a load: press and the net gives, release and it settles.
    const ray = new THREE.Raycaster();
    const ground = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const hitAt = new THREE.Vector3();
    const press = { x: 0, z: 0, load: 0, want: 0 };
    const look = { x: 0, y: 0, tx: 0, ty: 0 };
    const PRESS_DEPTH = 11, PRESS_SIGMA = 17;

    const aim = (e) => {
      const r = canvas.getBoundingClientRect();
      ray.setFromCamera(
        new THREE.Vector2(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1),
        camera
      );
      if (ray.ray.intersectPlane(ground, hitAt)) { press.x = hitAt.x; press.z = hitAt.z; }
    };

    const shape = () => {
      const p = progress();
      setGrid(sideFor(p));
      const k = sagScale(p);
      const L = press.load;

      const step = SIZE / (side - 1);
      for (let i = 0; i < knots; i++) {
        let y = base[i] * k, dip = 0;
        if (L > 0.001) {
          const dx = (-HALF + (i % side) * step) - press.x;
          const dz = (-HALF + Math.floor(i / side) * step) - press.z;
          dip = PRESS_DEPTH * L * Math.exp(-(dx * dx + dz * dz) / (PRESS_SIGMA * PRESS_SIGMA));
          y -= dip;
        }
        pos.setY(i, y);
        const t = Math.min(1, dip / 4);
        col.setXYZ(i,
          rest.r + (loadedTone.r - rest.r) * t,
          rest.g + (loadedTone.g - rest.g) * t,
          rest.b + (loadedTone.b - rest.b) * t);
      }
      pos.needsUpdate = true;
      col.needsUpdate = true;

      balls.forEach((m, j) => {
        const [x, z, r] = WEIGHTS[j];
        let y = sagAt(x, z) * k;
        if (L > 0.001) {
          const dx = x - press.x, dz = z - press.z;
          y -= PRESS_DEPTH * L * Math.exp(-(dx * dx + dz * dz) / (PRESS_SIGMA * PRESS_SIGMA));
        }
        m.position.set(x, y + r * 0.86, z);
      });

      // The object turns toward the load, which is what makes it read as an
      // object rather than a picture.
      camera.position.set(look.x * 16, 30 + look.y * 9, 92);
      camera.lookAt(look.x * 5, -7 + look.y * 3, 0);
    };

    const resize = () => {
      const w = band.clientWidth, h = band.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };

    resize();
    shape();

    if (reduced) {
      renderer.render(scene, camera);
      window.addEventListener('resize', () => { resize(); shape(); renderer.render(scene, camera); });
      window.addEventListener('scroll', () => { shape(); renderer.render(scene, camera); }, { passive: true });
      band.classList.add('ready');
      return;
    }

    let raf = 0, running = false;
    const frame = () => {
      raf = requestAnimationFrame(frame);
      const d = press.want - press.load;
      press.load += d * (d > 0 ? 0.22 : 0.1);
      if (Math.abs(d) < 0.002) press.load = press.want;
      look.x += (look.tx - look.x) * 0.07;
      look.y += (look.ty - look.y) * 0.07;
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

    band.addEventListener('pointermove', e => {
      if (e.pointerType !== 'touch') {
        const r = band.getBoundingClientRect();
        look.tx = clamp(((e.clientX - r.left) / r.width) * 2 - 1, -1, 1);
        look.ty = clamp(1 - ((e.clientY - r.top) / r.height) * 2, -1, 1);
      }
      if (press.want) aim(e);
    }, { passive: true });
    band.addEventListener('pointerleave', () => { look.tx = 0; look.ty = 0; });

    canvas.addEventListener('pointerdown', e => {
      aim(e);
      press.want = 1;
      try { canvas.setPointerCapture(e.pointerId); } catch {}
      band.classList.add('pressing');
    });
    const release = () => { press.want = 0; band.classList.remove('pressing'); };
    canvas.addEventListener('pointerup', release);
    canvas.addEventListener('pointercancel', release);

    band.classList.add('ready');
  }
})();
