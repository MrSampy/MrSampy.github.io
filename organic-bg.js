import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.min.js';

/* Organic background: a washed terracotta blob with a lens-shaped iris set into it.
   Everything stays in the light 100–500 ramp steps so page type keeps its contrast. */

const BLOB_VERT = `
uniform float uTime, uAmp, uBurst, uPokeStrength;
uniform vec3 uPoke;
varying vec3 vN, vP;
varying float vD;
float wob(vec3 p, float t){
  float d = sin(p.x*1.6+t)*sin(p.y*1.7-t*0.8)*sin(p.z*1.5+t*0.6);
  d += 0.5*sin(p.x*3.1-t*1.3)*sin(p.y*2.9+t)*sin(p.z*3.3-t*0.7);
  d += 0.25*sin(p.x*6.2+t*0.9)*sin(p.y*5.7-t*1.6)*sin(p.z*6.1+t*1.1);
  return d/1.75;
}
float disp(vec3 p){
  float d = wob(p, uTime) * (uAmp + uBurst);
  float dd = distance(p, uPoke);
  d -= uPokeStrength * exp(-dd*dd*2.2);
  return d;
}
vec3 displaced(vec3 p){ return p * (1.0 + disp(p)); }
void main(){
  vec3 p = normalize(position);
  vec3 t1 = normalize(cross(p, vec3(0.037, 0.998, 0.041)));
  vec3 t2 = normalize(cross(p, t1));
  float e = 0.035;
  vec3 a = displaced(p);
  vec3 b = displaced(normalize(p + t1*e));
  vec3 c = displaced(normalize(p + t2*e));
  vec3 n = normalize(cross(b-a, c-a));
  if (dot(n, p) < 0.0) n = -n;
  vN = normalize(normalMatrix * n);
  vD = disp(p);
  vec4 mv = modelViewMatrix * vec4(a, 1.0);
  vP = mv.xyz;
  gl_Position = projectionMatrix * mv;
}`;

const BLOB_FRAG = `
uniform vec3 uColorA, uColorB, uRim, uGround, uLight;
varying vec3 vN, vP;
varying float vD;
void main(){
  vec3 base = mix(uColorA, uColorB, smoothstep(-0.28, 0.34, vD));
  float lam = max(dot(vN, normalize(uLight)), 0.0);
  float wrap = 0.5 + 0.5 * dot(vN, normalize(vec3(-0.4, -0.6, 0.5)));
  vec3 col = base * (0.86 + 0.17*lam + 0.07*wrap);
  col = mix(col, uGround, 0.16);
  float fres = pow(1.0 - max(dot(vN, normalize(-vP)), 0.0), 2.4);
  col = mix(col, uRim, fres*0.55);
  gl_FragColor = vec4(col, 1.0);
}`;

/* Lens-shaped eye: almond aperture (two offset circles), fibrous iris,
   broken instrument rings, dilating pupil, glints, lid crease. */
const EYE_FRAG = `
precision highp float;
uniform float uTime, uLid, uDilate, uBurst;
uniform vec2 uGaze;
uniform vec3 uSclera, uShade, uIrisLo, uIrisHi, uRing, uPupil, uLine, uGlint;
varying vec2 vUv;

float lens(vec2 p, float h, float r){
  return max(length(p - vec2(0.0, -h)) - r, length(p - vec2(0.0, h)) - r);
}
float arc(float rad, float target, float w){
  return smoothstep(w, 0.0, abs(rad - target));
}

void main(){
  vec2 p = (vUv - 0.5) * 2.0;
  float h = mix(0.72, 1.14, uLid);
  float d = lens(p, h, 1.15);
  float inside = smoothstep(0.012, -0.004, d);
  if (inside < 0.003) { discard; }

  vec3 col = uSclera;
  // lid shading so the white sits back into the page
  col = mix(col, uShade, smoothstep(-0.30, 0.0, d) * 0.85);

  float rIris = 0.40;
  vec2 g = clamp(uGaze, vec2(-1.0), vec2(1.0)) * vec2(0.17, 0.055);
  vec2 q = p - g;
  float rad = length(q) / rIris;
  float ang = atan(q.y, q.x);

  // fibrous iris
  float fib = sin(ang*118.0 + sin(ang*11.0)*2.6 + uTime*0.15)*0.5 + 0.5;
  float fib2 = sin(ang*47.0 - uTime*0.08 + rad*4.0)*0.5 + 0.5;
  float fibre = mix(fib, fib2, 0.45) * smoothstep(0.22, 1.0, rad);
  vec3 iris = mix(uIrisHi, uIrisLo, 0.35 + 0.55*fibre - 0.25*smoothstep(1.0, 0.2, rad));
  iris = mix(iris, uIrisHi, pow(1.0 - min(rad, 1.0), 2.2) * 0.5);

  // broken instrument rings
  float gaps = step(0.34, fract(ang / 6.2831853 * 7.0 + uTime*0.04));
  float rings = arc(rad, 0.56, 0.035) * gaps
              + arc(rad, 0.74, 0.028) * step(0.5, fract(ang / 6.2831853 * 11.0 - uTime*0.03))
              + arc(rad, 0.90, 0.022);
  iris = mix(iris, uRing, clamp(rings, 0.0, 1.0) * 0.85);

  // limbal ring + iris body
  float irisMask = smoothstep(1.02, 0.97, rad);
  col = mix(col, iris, irisMask);
  col = mix(col, uLine, arc(rad, 0.99, 0.045) * 0.75);

  // pupil, dilating on click
  float rPup = 0.40 + uDilate * 0.16;
  col = mix(col, uPupil, smoothstep(rPup + 0.035, rPup, rad));
  col = mix(col, uRing, arc(rad, rPup + 0.05, 0.02) * 0.6);

  // glints
  float gl1 = smoothstep(0.16, 0.0, length((q - vec2(-0.115, 0.085)) * vec2(1.0, 1.5)));
  float gl2 = smoothstep(0.07, 0.0, length((q - vec2(0.085, -0.05)) * vec2(1.2, 1.0)));
  col = mix(col, uGlint, gl1 * 0.9 + gl2 * 0.55);

  // lid rim + crease above it
  float rim = smoothstep(0.016, 0.0, abs(d));
  float crease = smoothstep(0.014, 0.0, abs(lens(p - vec2(0.0, -0.085), h, 1.15)));
  col = mix(col, uLine, rim * 0.8);
  col = mix(col, uRing, crease * 0.35 * step(0.0, p.y));

  gl_FragColor = vec4(col, inside);
}`;

const EYE_VERT = `
varying vec2 vUv;
void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;

class OrganicBg extends HTMLElement {
  static get observedAttributes() { return ['amp', 'enabled']; }

  connectedCallback() {
    if (this.renderer) return;
    this.style.cssText = 'display:block;width:100%;height:100%';
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const small = innerWidth < 720;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setSize(innerWidth, innerHeight);
    renderer.domElement.style.cssText = 'display:block;width:100%;height:100%';
    this.appendChild(renderer.domElement);
    this.renderer = renderer;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, innerWidth / innerHeight, 0.1, 100);
    camera.position.set(0, 0, 6);

    const css = (v, f) => (getComputedStyle(document.body).getPropertyValue(v).trim() || f);
    // raw shaders skip three's output encoding, so hand them sRGB component values
    const col = (v, f) => new THREE.Color(css(v, f)).convertLinearToSRGB();

    this.u = {
      uTime: { value: 0 }, uAmp: { value: 0.16 }, uBurst: { value: 0 },
      uPoke: { value: new THREE.Vector3(0, 0, 2) }, uPokeStrength: { value: 0 },
      uColorA: { value: col('--color-accent-200', '#f0d5bb') },
      uColorB: { value: col('--color-accent-2-200', '#dbe0cb') },
      uRim: { value: col('--color-bg', '#f5ead8') },
      uGround: { value: col('--color-bg', '#f5ead8') },
      uLight: { value: new THREE.Vector3(-0.5, 0.8, 0.7) },
    };

    const blob = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1, small ? 14 : 26),
      new THREE.ShaderMaterial({ vertexShader: BLOB_VERT, fragmentShader: BLOB_FRAG, uniforms: this.u })
    );
    // Held to the right of the text column on wide screens, and low under it
    // on narrow ones, so the page keeps its reading contrast.
    /* Placement is derived from the camera's actual field, not a width
       breakpoint: a 728x1496 window is "wide" by pixel count but has almost no
       horizontal room, and a fixed world X puts the eye outside the frame. */
    const L = { blobX: 0, baseY: 0, blobS: 1, eyeS: 1, eyeDX: 0, eyeDY: 0, seedR: 1 };
    const layout = () => {
      const halfAt = (z) => Math.tan((camera.fov * Math.PI / 180) / 2) * (camera.position.z - z);
      const halfH = halfAt(1.5);                       // at the eye's depth
      const halfW = halfH * camera.aspect;
      const wide = camera.aspect > 1.05;
      L.eyeS = (wide ? 0.92 : 0.34) * halfH;
      L.eyeDX = wide ? 0.5 : 0.12;
      L.eyeDY = wide ? 0.85 : 0.42;
      L.blobS = (wide ? 0.67 : 0.40) * halfAt(0);
      L.seedR = wide ? halfW * 0.55 : halfW * 0.8;
      const eyeX = wide ? Math.min(halfW * 0.5, 2.45) : halfW * 0.22;
      const eyeY = wide ? halfH * 0.16 : -halfH * 0.42;
      L.blobX = eyeX + L.eyeDX;
      L.baseY = eyeY - L.eyeDY;
    };
    layout();
    blob.scale.setScalar(L.blobS);
    blob.position.set(L.blobX, L.baseY, 0);
    scene.add(blob);

    const hit = new THREE.Mesh(new THREE.SphereGeometry(1.25, 16, 12), new THREE.MeshBasicMaterial({ visible: false }));
    hit.position.copy(blob.position);
    hit.scale.copy(blob.scale);
    scene.add(hit);

    this.e = {
      uTime: { value: 0 }, uLid: { value: 0 }, uDilate: { value: 0 }, uBurst: { value: 0 },
      uGaze: { value: new THREE.Vector2(0, 0) },
      uSclera: { value: col('--color-bg', '#f5ead8') },
      uShade: { value: col('--color-accent-200', '#f0d5bb') },
      uIrisLo: { value: col('--color-accent-600', '#b2622d') },
      uIrisHi: { value: col('--color-accent-200', '#f0d5bb') },
      uRing: { value: col('--color-accent-2-400', '#a9b48c') },
      // Deeper than the handoff used: on this cream page the mid accent washed
      // out to within a few values of the background and the eye vanished.
      uPupil: { value: col('--color-accent-800', '#643312') },
      uLine: { value: col('--color-accent-700', '#8c491a') },
      uGlint: { value: col('--color-bg', '#f5ead8') },
    };

    const eye = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2, 1, 1),
      new THREE.ShaderMaterial({
        vertexShader: EYE_VERT, fragmentShader: EYE_FRAG, uniforms: this.e,
        transparent: true, depthWrite: false,
      })
    );
    eye.scale.setScalar(L.eyeS);
    eye.renderOrder = 2;
    scene.add(eye);

    // orbit rings around the eye, like the instrument arcs in the reference
    const rings = [0.92, 1.12, 1.34].map((r, i) => {
      const m = new THREE.Mesh(
        new THREE.TorusGeometry(r, 0.006 + i * 0.002, 6, 128),
        new THREE.MeshBasicMaterial({ color: col(i === 1 ? '--color-accent-300' : '--color-accent-2-300', '#c5cdad'), transparent: true, opacity: 0.85 })
      );
      m.userData = { tilt: 1.25 + i * 0.12, sp: 0.06 + i * 0.035, ph: i * 1.1 };
      m.renderOrder = 1;
      scene.add(m);
      return m;
    });

    const seedTints = ['--color-accent-2-300', '--color-accent-300', '--color-accent-2-200', '--color-accent-200', '--color-neutral-300', '--color-accent-2-300'];
    const seeds = seedTints.map((t, i) => {
      const m = new THREE.Mesh(
        new THREE.SphereGeometry(0.06 + (i % 3) * 0.035, 20, 14),
        new THREE.MeshBasicMaterial({ color: col(t, '#c5cdad') })
      );
      m.userData = {
        rNorm: 1 + (i % 3) * 0.22,
        a: (i / seedTints.length) * Math.PI * 2,
        sp: 0.12 + (i % 4) * 0.05,
        tilt: -0.5 + i * 0.22,
        home: new THREE.Vector3(),
      };
      scene.add(m);
      return m;
    });

    const ptr = { x: innerWidth * 0.6, y: innerHeight * 0.4, nx: 0, ny: 0, tx: 0, ty: 0 };
    const ray = new THREE.Raycaster();
    const ndc = new THREE.Vector2();
    const eyeNdc = new THREE.Vector3();
    let burst = 0, burstV = 0, scrollK = 0, scrollPx = 0;

    const onMove = (e) => {
      const t = e.touches ? e.touches[0] : e;
      ptr.x = t.clientX; ptr.y = t.clientY;
      ptr.tx = t.clientX / innerWidth - 0.5;
      ptr.ty = t.clientY / innerHeight - 0.5;
    };
    const onDown = () => { burstV += 0.55; };
    const onScroll = (e) => {
      const t = !e.target || e.target === document || e.target === window ? (document.scrollingElement || document.body) : e.target;
      scrollPx = t.scrollTop || window.scrollY || 0;
    };
    const onResize = () => {
      camera.aspect = innerWidth / innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(innerWidth, innerHeight);
      layout();
    };
    addEventListener('mousemove', onMove, { passive: true });
    addEventListener('touchmove', onMove, { passive: true });
    addEventListener('pointerdown', onDown, { passive: true });
    addEventListener('scroll', onScroll, { capture: true, passive: true });
    addEventListener('resize', onResize);
    this.cleanup = () => {
      removeEventListener('mousemove', onMove);
      removeEventListener('touchmove', onMove);
      removeEventListener('pointerdown', onDown);
      removeEventListener('scroll', onScroll, { capture: true });
      removeEventListener('resize', onResize);
    };

    this.baseAmp = 0.16;
    this.blink = 0;
    this.nextBlink = 3.2;
    const clock = new THREE.Clock();

    const loop = () => {
      this.raf = requestAnimationFrame(loop);
      if (this.enabled === false || document.hidden) return;
      const dt = Math.min(clock.getDelta(), 0.05);
      const t = clock.elapsedTime;

      ptr.nx += (ptr.tx - ptr.nx) * 0.06;
      ptr.ny += (ptr.ty - ptr.ny) * 0.06;
      scrollK += ((scrollPx / Math.max(1, innerHeight)) - scrollK) * 0.05;

      burstV *= 0.9;
      burst += burstV * dt * 12;
      burst *= 0.94;

      this.u.uTime.value = reduce ? 1.2 : t * 0.32 + scrollK * 0.6;
      this.u.uBurst.value = burst;
      this.u.uAmp.value = this.baseAmp * (1 + scrollK * 0.12);

      blob.rotation.y = (reduce ? 0 : t * 0.05) + ptr.nx * 0.7 + scrollK * 0.35;
      blob.rotation.x = -ptr.ny * 0.55 + scrollK * 0.12;
      blob.scale.setScalar(L.blobS);
      blob.position.x = L.blobX;
      blob.position.y = L.baseY - ptr.ny * 0.22 - scrollK * 0.18;
      hit.position.copy(blob.position);
      hit.rotation.copy(blob.rotation);
      hit.scale.copy(blob.scale);

      ndc.set((ptr.x / innerWidth) * 2 - 1, -(ptr.y / innerHeight) * 2 + 1);
      ray.setFromCamera(ndc, camera);
      const hits = ray.intersectObject(hit);
      if (hits.length) {
        const local = hit.worldToLocal(hits[0].point.clone()).normalize();
        this.u.uPoke.value.lerp(local, 0.22);
        this.u.uPokeStrength.value += (0.26 - this.u.uPokeStrength.value) * 0.12;
      } else {
        this.u.uPokeStrength.value *= 0.9;
      }

      // eye sits on the blob, tilts a little for depth, gazes at the cursor
      eye.scale.setScalar(L.eyeS);
      eye.position.set(
        blob.position.x - L.eyeDX + ptr.nx * 0.18,
        blob.position.y + L.eyeDY - ptr.ny * 0.1,
        1.5 + burst * 0.35
      );
      eye.rotation.set(-ptr.ny * 0.16, ptr.nx * 0.22, ptr.nx * 0.03);

      eyeNdc.copy(eye.position).project(camera);
      this.e.uTime.value = reduce ? 1.0 : t;
      this.e.uGaze.value.set(
        THREE.MathUtils.clamp((ndc.x - eyeNdc.x) * 0.62, -1, 1),
        THREE.MathUtils.clamp((ndc.y - eyeNdc.y) * 0.9, -1, 1)
      );
      this.e.uDilate.value += (Math.min(1, burst * 2.4) - this.e.uDilate.value) * 0.15;

      if (reduce) { this.e.uLid.value = 0; }
      else {
        if (t > this.nextBlink) { this.blink = 1; this.nextBlink = t + 2.8 + Math.random() * 4.5; }
        this.blink = Math.max(0, this.blink - dt * 7);
        this.e.uLid.value = Math.sin(Math.min(1, this.blink) * Math.PI);
      }

      rings.forEach((m, i) => {
        const d = m.userData;
        m.position.copy(eye.position);
        m.scale.setScalar(eye.scale.x * (1 + burst * 0.22));
        m.rotation.set(d.tilt + Math.sin(t * 0.2 + d.ph) * 0.12 - ptr.ny * 0.3, (reduce ? 0 : t * d.sp) + ptr.nx * 0.5 + d.ph, Math.sin(t * 0.12 + i) * 0.3);
      });

      seeds.forEach((s, i) => {
        const d = s.userData;
        const a = d.a + (reduce ? 0 : t * d.sp) + ptr.nx * 0.5;
        const r = L.seedR * d.rNorm;
        d.home.set(
          blob.position.x + Math.cos(a) * r,
          blob.position.y + Math.sin(a) * r * 0.62 + d.tilt * 0.4,
          Math.sin(a * 1.3 + i) * 1.4
        );
        const pull = 1 + burst * 1.6;
        s.position.lerp(d.home.clone().addScaledVector(d.home.clone().normalize(), (pull - 1) * 0.8), 0.12);
        s.scale.setScalar(1 + burst * 0.9);
      });

      renderer.render(scene, camera);
    };
    this.raf = requestAnimationFrame(loop);
  }

  attributeChangedCallback(n, _o, v) {
    if (n === 'amp') this.baseAmp = Math.max(0, Math.min(0.4, parseFloat(v) || 0.16));
    if (n === 'enabled') this.enabled = v !== 'false';
  }

  set amp(v) { this.setAttribute('amp', v); }
  set enabled(v) { this._en = v; }
  get enabled() { return this._en; }

  disconnectedCallback() {
    cancelAnimationFrame(this.raf);
    if (this.cleanup) this.cleanup();
    if (this.renderer) { this.renderer.dispose(); this.renderer = null; }
  }
}

if (!customElements.get('organic-bg')) customElements.define('organic-bg', OrganicBg);
