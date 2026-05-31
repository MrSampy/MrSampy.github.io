(function () {
  'use strict';

  window.initBackground = function () {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas || typeof THREE === 'undefined') return;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.z = 5;

    function fitToDisplay() {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (canvas.width !== w || canvas.height !== h) {
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      }
    }
    fitToDisplay();

    const isMobile = () => window.innerWidth < 768;
    let mobile = isMobile();

    const L1 = mobile ? 150 : 600; 
    const L2 = mobile ?  50 : 200;

    function makeLayer(count, velScale) {
      const pos  = new Float32Array(count * 3);
      const orig = new Float32Array(count * 3);
      const vel  = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        const x = Math.random() * 30 - 15;
        const y = Math.random() * 30 - 15;
        const z = Math.random() * 15 - 10;
        pos[i*3] = orig[i*3] = x;
        pos[i*3+1] = orig[i*3+1] = y;
        pos[i*3+2] = orig[i*3+2] = z;
        vel[i*3]   = (Math.random() - 0.5) * velScale;
        vel[i*3+1] = (Math.random() - 0.5) * velScale;
        vel[i*3+2] = (Math.random() - 0.5) * (velScale * 0.33);
      }
      return { pos, orig, vel };
    }

    const l1 = makeLayer(L1, 0.0006);
    const l1Attr = new THREE.BufferAttribute(l1.pos, 3).setUsage(THREE.DynamicDrawUsage);

    const l1Geo = new THREE.BufferGeometry();
    l1Geo.setAttribute('position', l1Attr);
    const l1Pts  = new THREE.Points(l1Geo,
      new THREE.PointsMaterial({ color: 0x6366f1, size: 0.025, transparent: true, opacity: 0.8 }));

    const l1GlowGeo = new THREE.BufferGeometry();
    l1GlowGeo.setAttribute('position', l1Attr);
    const l1Glow = new THREE.Points(l1GlowGeo,
      new THREE.PointsMaterial({ color: 0x6366f1, size: 0.05, transparent: true, opacity: 0.05 }));

    const l2 = makeLayer(L2, 0.0009);
    const l2Attr = new THREE.BufferAttribute(l2.pos, 3).setUsage(THREE.DynamicDrawUsage);

    const l2Geo = new THREE.BufferGeometry();
    l2Geo.setAttribute('position', l2Attr);
    const l2Pts  = new THREE.Points(l2Geo,
      new THREE.PointsMaterial({ color: 0x06b6d4, size: 0.015, transparent: true, opacity: 0.8 }));

    const l2GlowGeo = new THREE.BufferGeometry();
    l2GlowGeo.setAttribute('position', l2Attr);
    const l2Glow = new THREE.Points(l2GlowGeo,
      new THREE.PointsMaterial({ color: 0x06b6d4, size: 0.03, transparent: true, opacity: 0.05 }));

    const MAX_LINES   = 300;
    const MAX_DIST    = 1.8;
    const MAX_DIST_SQ = MAX_DIST * MAX_DIST;

    const linePosArr = new Float32Array(MAX_LINES * 6);
    const lineColArr = new Float32Array(MAX_LINES * 6);
    const linePosAttr = new THREE.BufferAttribute(linePosArr, 3).setUsage(THREE.DynamicDrawUsage);
    const lineColAttr = new THREE.BufferAttribute(lineColArr, 3).setUsage(THREE.DynamicDrawUsage);

    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', linePosAttr);
    lineGeo.setAttribute('color',    lineColAttr);
    lineGeo.setDrawRange(0, 0);

    const lineSegs = new THREE.LineSegments(lineGeo,
      new THREE.LineBasicMaterial({ vertexColors: true, transparent: true }));

    const group = new THREE.Group();
    group.add(l1Pts, l1Glow, l2Pts, l2Glow, lineSegs);
    scene.add(group);

    let mouseX = 0, mouseY = 0;
    const _v   = new THREE.Vector3();
    const _dir = new THREE.Vector3();
    const _wp  = new THREE.Vector3();

    window.addEventListener('mousemove', e => {
      mouseX = (e.clientX / window.innerWidth  - 0.5) * 2;
      mouseY = -(e.clientY / window.innerHeight - 0.5) * 2;
      if (!mobile) applyRepel();
    });

    function applyRepel() {
      _v.set(mouseX, mouseY, 0.5).unproject(camera);
      _dir.copy(_v).sub(camera.position).normalize();
      const t = -camera.position.z / _dir.z;
      _wp.copy(camera.position).addScaledVector(_dir, t);

      repelLayer(l1.pos, l1.orig, L1);
      repelLayer(l2.pos, l2.orig, L2);
    }

    function repelLayer(pos, orig, count) {
      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        const dx = pos[i3]   - _wp.x;
        const dy = pos[i3+1] - _wp.y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < 2.0 && d > 0.001) {
          const f = (1 - d / 2.0) * 0.3;
          pos[i3]   += (dx / d) * f;
          pos[i3+1] += (dy / d) * f;
        }
      }
    }

    let paused = false;
    document.addEventListener('visibilitychange', () => { paused = document.hidden; });

    function updateLayer(p, speed) {
      const { pos, orig, vel } = p;
      const n = pos.length / 3;
      for (let i = 0; i < n; i++) {
        const i3 = i * 3;

        orig[i3]   += vel[i3]   * speed;
        orig[i3+1] += vel[i3+1] * speed;
        orig[i3+2] += vel[i3+2] * speed;

        if (orig[i3]   >  15) orig[i3]   = -15;
        if (orig[i3]   < -15) orig[i3]   =  15;
        if (orig[i3+1] >  15) orig[i3+1] = -15;
        if (orig[i3+1] < -15) orig[i3+1] =  15;
        if (orig[i3+2] >   5) orig[i3+2] = -10;
        if (orig[i3+2] < -10) orig[i3+2] =   5;

        pos[i3]   += (orig[i3]   - pos[i3])   * 0.02;
        pos[i3+1] += (orig[i3+1] - pos[i3+1]) * 0.02;
        pos[i3+2] += (orig[i3+2] - pos[i3+2]) * 0.02;
      }
    }

    const CR = 0x06 / 255, CG = 0xb6 / 255, CB = 0xd4 / 255;

    function updateLines() {
      let li = 0;

      outer:
      for (let i = 0; i < L1; i++) {
        const i3 = i * 3;
        let neighbors = 0;

        for (let j = i + 1; j < L1; j++) {
          if (li >= MAX_LINES) break outer;
          if (neighbors >= 50) break;

          const j3 = j * 3;
          const dx = l1.pos[i3]   - l1.pos[j3];
          const dy = l1.pos[i3+1] - l1.pos[j3+1];
          const dz = l1.pos[i3+2] - l1.pos[j3+2];
          const d2 = dx*dx + dy*dy + dz*dz;

          if (d2 < MAX_DIST_SQ) {
            const opacity = (1 - Math.sqrt(d2) / MAX_DIST) * 0.4;
            const base = li * 6;

            linePosArr[base]   = l1.pos[i3];   linePosArr[base+1] = l1.pos[i3+1]; linePosArr[base+2] = l1.pos[i3+2];
            linePosArr[base+3] = l1.pos[j3];   linePosArr[base+4] = l1.pos[j3+1]; linePosArr[base+5] = l1.pos[j3+2];

            lineColArr[base]   = CR * opacity;  lineColArr[base+1] = CG * opacity;  lineColArr[base+2] = CB * opacity;
            lineColArr[base+3] = CR * opacity;  lineColArr[base+4] = CG * opacity;  lineColArr[base+5] = CB * opacity;

            li++;
            neighbors++;
          }
        }
      }

      lineGeo.setDrawRange(0, li * 2);
      linePosAttr.needsUpdate = true;
      lineColAttr.needsUpdate = true;
    }

    let lastTime = 0;

    function animate(time) {
      requestAnimationFrame(animate);
      if (paused) return;
      fitToDisplay();

      const delta = time - lastTime;
      lastTime = time;
      mobile = isMobile();

      updateLayer(l1, 1.0);
      updateLayer(l2, 1.5);
      l1Attr.needsUpdate = true;
      l2Attr.needsUpdate = true;

      group.rotation.y += 0.00015;
      group.rotation.x += 0.00008;

      camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.05;
      camera.position.y += (mouseY * 0.5 - camera.position.y) * 0.05;
      camera.lookAt(scene.position);

      if (!mobile) {
        lineSegs.visible = true;
        if (delta < 32 || lastTime === 0) updateLines();
      } else {
        lineSegs.visible = false;
        lineGeo.setDrawRange(0, 0);
      }

      renderer.render(scene, camera);
    }

    requestAnimationFrame(animate);
  };

  document.addEventListener('DOMContentLoaded', window.initBackground);
})();
