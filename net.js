/* The net runs under the whole page.

   One object: a lattice with one knot per test in the platform suite, carrying
   seven weights — the seven insurers in production. It is not a band you pass;
   it is the ground the site sits on. Scrolling the page tightens the lattice
   from 24 x 24 to 64 x 64 knots, which is the suite's own growth from 600 tests
   to 4,100, and the sag under the weights comes out of it as it tightens. The
   camera rides high and far for most of the page and drops down close in the
   suite section, where you can press the net and feel it give.

   Nothing runs on a timer. three.js is fetched only when the reader gets near
   the suite section, and the same numbers render as a flat SVG without it. */
(() => {
  const THREE_URL = 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.min.js';
  const band = document.querySelector('.net');
  const canvas = document.getElementById('stage');
  if (!band || !canvas) return;
  const countEl = document.getElementById('netCount');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, t) => a + (b - a) * t;
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

  // How far the reader is through the page: the suite grew over four years,
  // so it grows over the whole document rather than inside one band.
  const pageProgress = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    return max > 0 ? clamp(scrollY / max, 0, 1) : 1;
  };
  // 1 when the suite section is centred, 0 when it is a screen away.
  const focusOn = () => {
    const r = band.getBoundingClientRect();
    const off = r.top + r.height / 2 - innerHeight / 2;
    return clamp(1 - Math.abs(off) / (innerHeight * 1.15), 0, 1);
  };
  const grown = p => Math.pow(p, 1.35);
  const sideFor = p => Math.round(M_MIN + (N - M_MIN) * grown(p));
  const sagScale = p => 1.8 - 0.8 * grown(p);

  let shownSide = -1;
  const syncCount = () => {
    const m = sideFor(pageProgress());
    if (m !== shownSide) {
      shownSide = m;
      if (countEl) countEl.textContent = fmt(m * m);
    }
  };
  syncCount();
  window.addEventListener('scroll', syncCount, { passive: true });
  window.addEventListener('resize', syncCount);

  /* ── Fallback: the same net, flat, drawn before anything is fetched ────── */
  (() => {
    const host = band.querySelector('.net-fallback');
    if (!host) return;
    const M = 26;
    const px = (x, z, y) => [500 + x * 7.4 * (1 + z * 0.004), 210 + z * 3.1 - y * 5.2];
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
  }, { rootMargin: '900px 0px' });
  near.observe(band);

  async function start() {
    let THREE;
    try { THREE = await import(THREE_URL); } catch { return; }

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
    } catch { return; }
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
    renderer.setClearAlpha(0);

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(new THREE.Color('#f5ead8'), 110, 260);

    const camera = new THREE.PerspectiveCamera(42, 1, 1, 460);
    scene.add(new THREE.HemisphereLight(0xf5ead8, 0x56633f, 0.75));
    const key = new THREE.DirectionalLight(0xfff0db, 0.9);
    key.position.set(40, 70, 50);
    scene.add(key);

    const MAX = N * N;
    const pos = new THREE.BufferAttribute(new Float32Array(MAX * 3), 3);
    const col = new THREE.BufferAttribute(new Float32Array(MAX * 3), 3);
    const base = new Float32Array(MAX);

    const lineMat = new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.9 });
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', pos);
    lineGeo.setAttribute('color', col);
    scene.add(new THREE.LineSegments(lineGeo, lineMat));

    const dotMat = new THREE.PointsMaterial({ vertexColors: true, size: 0.9, sizeAttenuation: true, transparent: true, opacity: 0.9 });
    const dotGeo = new THREE.BufferGeometry();
    dotGeo.setAttribute('position', pos);
    dotGeo.setAttribute('color', col);
    scene.add(new THREE.Points(dotGeo, dotMat));

    const rest = new THREE.Color('#7a8a5e');
    const loadedTone = new THREE.Color('#c67139');
    for (let i = 0; i < MAX; i++) col.setXYZ(i, rest.r, rest.g, rest.b);

    const ballMat = new THREE.MeshLambertMaterial({ color: '#201e1d', flatShading: true, transparent: true, opacity: 1 });
    const balls = WEIGHTS.map(([, , r]) => {
      const m = new THREE.Mesh(new THREE.IcosahedronGeometry(r, 1), ballMat);
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

    const ray = new THREE.Raycaster();
    const ground = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const hitAt = new THREE.Vector3();
    const press = { x: 0, z: 0, load: 0, want: 0 };
    const look = { x: 0, y: 0, tx: 0, ty: 0 };
    const PRESS_DEPTH = 11, PRESS_SIGMA = 17;

    const aim = (e) => {
      ray.setFromCamera(
        new THREE.Vector2((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1),
        camera
      );
      if (ray.ray.intersectPlane(ground, hitAt)) { press.x = hitAt.x; press.z = hitAt.z; }
    };

    const build = () => {
      const p = pageProgress(), f = focusOn();
      setGrid(sideFor(p));
      const k = sagScale(p), L = press.load;
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

      // Far and high over most of the page; down close in the suite section.
      // The lean toward the pointer is what makes it read as an object.
      lineMat.opacity = lerp(0.26, 0.95, f);
      dotMat.opacity = lerp(0.18, 0.95, f);
      ballMat.opacity = lerp(0.3, 1, f);
      // A portrait viewport has far less horizontal field, so stand further
      // back and keep the whole net in frame.
      const pull = clamp(1.7 / camera.aspect, 1, 1.9);
      camera.position.set(look.x * 16, lerp(96, 30, f) * pull + look.y * 9, lerp(168, 92, f) * pull);
      camera.lookAt(look.x * 5, lerp(-34, -7, f) + look.y * 3, 0);
    };

    const resize = () => {
      renderer.setSize(innerWidth, innerHeight, false);
      camera.aspect = innerWidth / innerHeight;
      camera.updateProjectionMatrix();
    };

    resize();
    build();
    canvas.classList.add('ready');
    band.classList.add('ready');

    if (reduced) {
      renderer.render(scene, camera);
      const redraw = () => { resize(); build(); renderer.render(scene, camera); };
      window.addEventListener('resize', redraw);
      window.addEventListener('scroll', redraw, { passive: true });
      return;
    }

    let raf = 0, running = false, lastKey = '';
    const frame = () => {
      raf = requestAnimationFrame(frame);
      const d = press.want - press.load;
      press.load += d * (d > 0 ? 0.22 : 0.1);
      if (Math.abs(d) < 0.002) press.load = press.want;
      look.x += (look.tx - look.x) * 0.07;
      look.y += (look.ty - look.y) * 0.07;
      // Nothing moved, nothing to draw: a still reader costs no GPU.
      const key = Math.round(scrollY) + '|' + look.x.toFixed(3) + '|' + look.y.toFixed(3)
        + '|' + press.load.toFixed(3) + '|' + innerWidth + 'x' + innerHeight;
      if (key === lastKey) return;
      lastKey = key;
      build();
      renderer.render(scene, camera);
    };
    const run = (on) => {
      if (on === running) return;
      running = on;
      if (on) { raf = requestAnimationFrame(frame); } else cancelAnimationFrame(raf);
    };
    run(document.visibilityState === 'visible');
    document.addEventListener('visibilitychange', () => run(document.visibilityState === 'visible'));
    window.addEventListener('resize', resize);

    // The pointer leans the whole scene; pressing inside the suite section
    // puts a real load on the net.
    window.addEventListener('pointermove', e => {
      if (e.pointerType !== 'touch') {
        look.tx = clamp((e.clientX / innerWidth) * 2 - 1, -1, 1);
        look.ty = clamp(1 - (e.clientY / innerHeight) * 2, -1, 1);
      }
      if (press.want) aim(e);
    }, { passive: true });

    band.addEventListener('pointerdown', e => {
      aim(e);
      press.want = 1;
      try { band.setPointerCapture(e.pointerId); } catch {}
      band.classList.add('pressing');
    });
    const release = () => { press.want = 0; band.classList.remove('pressing'); };
    band.addEventListener('pointerup', release);
    band.addEventListener('pointercancel', release);
  }
})();
