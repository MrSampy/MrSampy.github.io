const TINTS = ['var(--color-accent-200)', 'var(--color-accent-2-200)', 'var(--color-neutral-200)'];

document.addEventListener('DOMContentLoaded', () => {
  renderSkills();
  renderLanguages();
  renderExperience();
  renderProjects();
  renderEducation();
  renderContactLinks();
  initRise();
  initVine();
  initScrollSpy();
  initReveal();
  initPointer();
  initTouchMotion();
  initWorkPreview();
  initForm();
});

function el(tag, className, html) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (html != null) node.innerHTML = html;
  return node;
}

function esc(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

/* ─── Render ─────────────────────────────────────────────────────────────── */
function renderSkills() {
  const grid = document.getElementById('skillsGrid');
  DATA.skills.forEach((g, i) => {
    const pills = g.items.map((s, j) => `<span class="pill" style="--i:${j}">${esc(s)}</span>`).join('');
    const card = el('div', 'skill-card', `
      <div class="skill-head">
        <h3>${esc(g.label)}</h3>
        <span class="skill-count" style="background:${TINTS[i % TINTS.length]}">${String(g.items.length).padStart(2, '0')}</span>
      </div>
      <div class="pills">${pills}</div>
    `);
    card.setAttribute('data-reveal', '');
    grid.appendChild(card);
  });
}

function renderLanguages() {
  const list = document.getElementById('langList');
  DATA.languages.forEach(l => {
    const level = /native/i.test(l.level) ? 'native' : l.level;
    list.appendChild(el('span', 'lang', `<i></i>${esc(l.name)} — ${esc(level)}`));
  });
}

function renderExperience() {
  const list = document.getElementById('xpList');
  DATA.experience.forEach(job => {
    const card = el('div', 'xp', `
      <div class="xp-when">
        <span class="xp-period">${esc(job.period)}</span>
        <span class="xp-loc">${esc(job.location || '')}</span>
      </div>
      <div class="xp-body">
        <h3>${esc(job.role)}</h3>
        <p class="xp-company">${esc(job.company)}</p>
        <p class="xp-summary">${esc(job.summary || job.description.join('. '))}</p>
      </div>
    `);
    card.setAttribute('data-reveal', '');
    list.appendChild(card);
  });
}

function renderProjects() {
  const list = document.getElementById('workList');
  DATA.projects.forEach((p, i) => {
    const href = p.github || p.demo || '#work';
    const row = el('a', 'work-row', `
      <span class="work-num">${String(i + 1).padStart(2, '0')}</span>
      <span class="work-meta">
        <span class="work-title">${esc(p.title)}</span>
        <span class="work-stack">${esc(p.tags.join(' · '))}</span>
      </span>
      <span class="work-arrow">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.75" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7"></path><path d="M8 7h9v9"></path></svg>
      </span>
    `);
    row.href = href;
    if (href !== '#work') { row.target = '_blank'; row.rel = 'noopener'; }
    row.dataset.index = i;
    list.appendChild(row);

    const detail = el('div', 'work-detail', `
      <div class="preview-tags">${p.tags.slice(0, 3).map(t => `<span class="preview-tag">${esc(t)}</span>`).join('')}</div>
      <p>${esc(p.description)}</p>
      ${href !== '#work' ? `<a class="btn btn-primary" href="${esc(href)}" target="_blank" rel="noopener">${p.github ? 'Open on GitHub' : 'Open live'} ↗</a>` : ''}
    `);
    detail.style.background = TINTS[i % TINTS.length];
    list.appendChild(detail);
  });
  list.appendChild(el('div', 'work-end'));
}

function renderEducation() {
  const list = document.getElementById('eduList');
  DATA.education.forEach(e => {
    list.appendChild(el('div', 'edu', `
      <span class="edu-period">${esc(e.period)}</span>
      <h3>${esc(e.degree)}</h3>
      <span class="edu-school">${esc(e.institution)}</span>
    `));
  });
}

function renderContactLinks() {
  const box = document.getElementById('contactLinks');
  const P = DATA.personal;
  const links = [
    { label: 'LinkedIn', href: P.linkedin },
    { label: 'GitHub', href: P.github },
    { label: 'Email', href: `mailto:${P.email}` },
    { label: 'Telegram', href: P.telegram },
    { label: 'CV (PDF)', href: 'assets/CV.pdf', download: true },
  ];
  links.forEach(l => {
    const a = el('a', 'contact-pill', esc(l.label));
    a.href = l.href;
    if (l.download) a.setAttribute('download', '');
    else if (!l.href.startsWith('mailto:')) { a.target = '_blank'; a.rel = 'noopener'; }
    box.appendChild(a);
  });
}

/* ─── Motion ─────────────────────────────────────────────────────────────── */
// The rise keyframes fill forwards with `transform: none`, which would override
// the hover transforms; drop the animation once it has played.
function initRise() {
  document.querySelectorAll('.rise').forEach(node => {
    node.addEventListener('animationend', () => node.classList.add('risen'), { once: true });
  });
}

function initVine() {
  const svg = document.getElementById('vine');
  const NS = 'http://www.w3.org/2000/svg';
  let stem, leaves = [], flowers = [], total = 0, docH = 0;

  // Petals only: the footer's SK mark sits above the SVG and acts as the core.
  const makeFlower = (x, y, L, count) => {
    const W = L * 0.42;
    const place = document.createElementNS(NS, 'g');
    place.setAttribute('transform', `translate(${x} ${y})`);
    const flower = document.createElementNS(NS, 'g');
    flower.setAttribute('class', 'vine-flower');
    for (let i = 0; i < count; i++) {
      const turn = document.createElementNS(NS, 'g');
      turn.setAttribute('transform', `rotate(${i * 360 / count})`);
      const petal = document.createElementNS(NS, 'path');
      petal.setAttribute('class', 'vine-petal' + (i % 2 ? ' alt' : ''));
      petal.setAttribute('d', `M 0 0 C ${-W} ${-L * 0.4}, ${-W * 0.6} ${-L}, 0 ${-L} C ${W * 0.6} ${-L}, ${W} ${-L * 0.4}, 0 0 Z`);
      petal.style.setProperty('--ox', `${W}px`); petal.style.setProperty('--oy', `${L}px`);
      petal.style.setProperty('--i', i);
      turn.appendChild(petal);
      flower.appendChild(turn);
    }
    place.appendChild(flower);
    svg.appendChild(place);
    return flower;
  };
  const footer = document.querySelector('.footer');
  const footerMark = document.querySelector('.footer-mark');
  // scrollHeight would include the vine itself, so a shrinking page could
  // never be detected; measure the content by the footer's bottom edge.
  const contentHeight = () => Math.round(footer.offsetTop + footer.offsetHeight);

  const build = () => {
    docH = contentHeight();
    const narrow = innerWidth < 720;
    const cx = narrow ? 7 : 22, amp = narrow ? 2 : 12, wave = narrow ? 260 : 340;
    const L = narrow ? 40 : 48;
    const mr = footerMark.getBoundingClientRect();
    const mx = mr.left + mr.width / 2, my = mr.top + scrollY + mr.height / 2;
    const w = mx + L + 12;
    svg.setAttribute('width', w); svg.setAttribute('height', docH);
    svg.setAttribute('viewBox', `0 0 ${w} ${docH}`);
    svg.innerHTML = '';

    // The wave runs down to the footer, then the stem swings under the SK
    // mark and grows into it — the mark is the heart of the closing flower.
    const footerTop = footer.offsetTop;
    let d = `M ${cx} 0`;
    let y = 0, side = 1;
    for (; y + wave <= footerTop; y += wave, side = -side) {
      const y2 = y + wave;
      d += ` C ${cx + amp * side} ${y + wave * 0.3}, ${cx + amp * side} ${y2 - wave * 0.3}, ${cx} ${y2}`;
    }
    const dip = my + mr.height * 0.9;
    d += ` C ${cx} ${footerTop + (dip - footerTop) * 0.5}, ${cx} ${dip}, ${(cx + mx) / 2} ${dip}`;
    d += ` C ${mx - 4} ${dip}, ${mx} ${my + mr.height * 0.5}, ${mx} ${my}`;
    stem = document.createElementNS(NS, 'path');
    stem.setAttribute('class', 'vine-stem');
    stem.setAttribute('d', d);
    svg.appendChild(stem);
    total = stem.getTotalLength();
    stem.style.strokeDasharray = `${total}`;
    stem.style.strokeDashoffset = `${total}`;

    leaves = []; flowers = [];
    const step = narrow ? 200 : 230, size = narrow ? 6 : 14;
    const tailLen = (my - footerTop) + (mx - cx) + 40;
    for (let len = step * 0.8, n = 0; len < total - tailLen; len += step, n++) {
      const p = stem.getPointAtLength(len);
      const ahead = stem.getPointAtLength(Math.min(total, len + 2));
      const dir = Math.sign(ahead.x - p.x) || (n % 2 ? 1 : -1);
      // Narrow screens have no gutter to spare, so leaves hug the stem.
      const angle = narrow ? (dir > 0 ? -70 : -110) : (dir > 0 ? -40 : -140);
      const g = document.createElementNS(NS, 'g');
      g.setAttribute('transform', `translate(${p.x} ${p.y}) rotate(${angle})`);
      const leaf = document.createElementNS(NS, 'path');
      leaf.setAttribute('class', 'vine-leaf' + (leaves.length % 3 === 1 ? ' alt' : ''));
      leaf.setAttribute('d', `M 0 0 C ${size * 0.9} ${-size * 0.4}, ${size * 1.6} ${size * 0.2}, ${size * 1.9} ${size * 0.9} C ${size * 1.1} ${size * 1.1}, ${size * 0.3} ${size * 0.8}, 0 0 Z`);
      g.appendChild(leaf);
      svg.appendChild(g);
      const bb = leaf.getBBox();
      leaf.style.setProperty('--ox', `${-bb.x}px`); leaf.style.setProperty('--oy', `${-bb.y}px`);
      leaf.dataset.len = len;
      leaves.push(leaf);
    }
    const bloom = makeFlower(mx, my, L, 8);
    bloom.dataset.len = total - 2;
    flowers.push(bloom);
    drawn = target();
    render();
  };

  // The tip sits a little below the middle of the viewport so the growth is
  // always visible while scrolling; it eases toward that point each frame.
  const target = () => {
    const atEnd = scrollY + innerHeight >= docH - 2;
    return total * (atEnd ? 1 : Math.min(1, (scrollY + innerHeight * 0.58) / docH));
  };
  let drawn = 0, ticking = false, lastT = 0;
  const render = () => {
    stem.style.strokeDashoffset = `${total - drawn}`;
    leaves.forEach(l => l.classList.toggle('on', +l.dataset.len <= drawn));
    flowers.forEach(f => f.classList.toggle('on', +f.dataset.len <= drawn));
  };
  const tick = (now) => {
    const dt = Math.min(100, now - lastT); lastT = now;
    const goal = target();
    drawn += (goal - drawn) * (1 - Math.exp(-dt / 140));
    if (Math.abs(goal - drawn) < 0.5) { drawn = goal; ticking = false; } else requestAnimationFrame(tick);
    render();
  };
  const update = () => { if (!stem || ticking) return; ticking = true; lastT = performance.now(); requestAnimationFrame(tick); };

  build();
  window.addEventListener('scroll', update, { passive: true });
  let raf = 0;
  const rebuild = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(() => { if (contentHeight() !== docH || svg.clientWidth === 0) build(); }); };
  window.addEventListener('resize', rebuild);
  new ResizeObserver(rebuild).observe(document.body);
}

function initScrollSpy() {
  const links = [...document.querySelectorAll('.nav-links a')];
  const sections = [...document.querySelectorAll('section[id]')];
  const onScroll = () => {
    const line = scrollY + innerHeight * 0.35;
    let current = null;
    sections.forEach(sec => { if (sec.offsetTop <= line) current = sec; });
    if (scrollY + innerHeight >= document.documentElement.scrollHeight - 2) current = sections[sections.length - 1];
    links.forEach(l => l.classList.toggle('active', !!current && l.hash === `#${current.id}`));
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

function initReveal() {
  const els = document.querySelectorAll('[data-reveal]');
  if (!('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        en.target.style.opacity = '1';
        en.target.style.transform = 'translateY(0)';
        en.target.classList.add('in');
        io.unobserve(en.target);
      }
    });
  }, { threshold: 0.15 });
  els.forEach((node, i) => {
    node.style.opacity = '0';
    node.style.transform = 'translateY(28px)';
    node.style.transition = `opacity .7s ease ${(i % 4) * 0.08}s, transform .7s cubic-bezier(.2,.8,.2,1) ${(i % 4) * 0.08}s`;
    io.observe(node);
  });
}

function initPointer() {
  if (!window.matchMedia('(pointer: fine)').matches) return;
  const hero = document.getElementById('hero');
  let mx = innerWidth / 2, my = innerHeight / 2;

  window.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; }, { passive: true });

  const tilts = [...document.querySelectorAll('[data-tilt]')];
  const magnets = [...document.querySelectorAll('[data-magnet]')];
  const eyes = [...document.querySelectorAll('[data-eye]')];
  const parallax = [...document.querySelectorAll('[data-parallax]')].map(node => ({ el: node.parentElement, k: +node.getAttribute('data-parallax') }));

  const loop = () => {
    if (hero.getBoundingClientRect().bottom > 0) {
      const nx = mx / innerWidth - 0.5, ny = my / innerHeight - 0.5;
      parallax.forEach(({ el: node, k }) => { node.style.translate = `${nx * k}px ${ny * k}px`; });
      tilts.forEach(node => {
        const r = node.getBoundingClientRect();
        const dx = (mx - (r.left + r.width / 2)) / innerWidth, dy = (my - (r.top + r.height / 2)) / innerHeight;
        node.style.transform = `perspective(900px) rotateY(${dx * 22}deg) rotateX(${-dy * 16}deg)`;
      });
    }
    magnets.forEach(node => {
      const r = node.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight) return;
      const k = +node.getAttribute('data-magnet') || 0.3;
      const dx = mx - (r.left + r.width / 2), dy = my - (r.top + r.height / 2);
      const d = Math.hypot(dx, dy), reach = Math.max(r.width, r.height) * 1.1;
      node.style.transform = d < reach ? `translate(${dx * k}px, ${dy * k}px)` : 'translate(0,0)';
    });
    eyes.forEach(node => {
      const r = node.parentElement.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight) return;
      const dx = mx - (r.left + r.width / 2), dy = my - (r.top + r.height / 2);
      const d = Math.hypot(dx, dy) || 1, m = Math.min(d, r.width * 0.28);
      node.style.transform = `translate(${dx / d * m}px, ${dy / d * m}px)`;
    });
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
}

function initTouchMotion() {
  if (window.matchMedia('(pointer: fine)').matches) return;

  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const eyes = [...document.querySelectorAll('[data-eye]')];
  const tilts = [...document.querySelectorAll('[data-tilt]')];
  const parallax = [...document.querySelectorAll('[data-parallax]')].map(node => ({ el: node.parentElement, k: +node.getAttribute('data-parallax') }));
  const hero = document.getElementById('hero');

  document.querySelectorAll('.hero-word').forEach(word => {
    word.addEventListener('pointerdown', () => {
      word.classList.remove('bounce');
      void word.offsetWidth;
      word.classList.add('bounce');
    });
    word.addEventListener('animationend', e => { if (e.animationName === 'bounce') word.classList.remove('bounce'); });
  });

  let gx = 0, gy = 0;
  window.addEventListener('deviceorientation', e => {
    if (e.gamma == null || e.beta == null) return;
    gx = clamp(e.gamma / 45, -1, 1);
    gy = clamp((e.beta - 45) / 45, -1, 1);
  });

  let vel = 0, last = scrollY;
  const loop = () => {
    const t = performance.now() / 1000;
    vel = vel * 0.85 + (scrollY - last) * 0.15;
    last = scrollY;

    const lookX = Math.sin(t * 0.7) * 0.12 + Math.sin(t * 1.9) * 0.05 + gx * 0.2;
    const lookY = clamp(vel / 40, -1, 1) * 0.28 + Math.cos(t * 0.9) * 0.06 + gy * 0.2;
    eyes.forEach(node => {
      const r = node.parentElement.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight) return;
      const m = r.width;
      node.style.transform = `translate(${clamp(lookX, -0.28, 0.28) * m}px, ${clamp(lookY, -0.28, 0.28) * m}px)`;
    });

    if (hero.getBoundingClientRect().bottom > 0) {
      parallax.forEach(({ el: node, k }) => { node.style.translate = `${gx * k * 0.5}px ${scrollY * k * -0.15 + gy * k * 0.5}px`; });
      tilts.forEach(node => { node.style.transform = `perspective(900px) rotateY(${gx * 14}deg) rotateX(${-gy * 10}deg)`; });
    }
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);

  const blink = () => {
    eyes.forEach(node => {
      const o = node.parentElement;
      o.classList.add('blink');
      setTimeout(() => o.classList.remove('blink'), 300);
    });
    setTimeout(blink, 2500 + Math.random() * 3000);
  };
  setTimeout(blink, 1800);

  const rows = document.querySelectorAll('.work-row');
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
  }, { threshold: 0.6 });
  rows.forEach(row => {
    io.observe(row);
    row.addEventListener('click', e => {
      e.preventDefault();
      const open = !row.classList.contains('open');
      rows.forEach(r => { r.classList.remove('open'); r.nextElementSibling.classList.remove('open'); });
      row.classList.toggle('open', open);
      row.nextElementSibling.classList.toggle('open', open);
    });
  });
}

function initWorkPreview() {
  if (!window.matchMedia('(pointer: fine)').matches) return;
  const section = document.getElementById('work');
  const preview = document.getElementById('preview');
  const tags = document.getElementById('previewTags');
  const text = document.getElementById('previewText');

  section.addEventListener('mousemove', e => {
    const r = section.getBoundingClientRect();
    preview.style.transform = `translate(${e.clientX - r.left + 24}px, ${e.clientY - r.top - 40}px)`;
  });
  section.addEventListener('mouseleave', () => { preview.hidden = true; });
  section.querySelectorAll('.work-row').forEach(row => {
    row.addEventListener('mouseenter', () => {
      const p = DATA.projects[+row.dataset.index];
      tags.innerHTML = p.tags.slice(0, 2).map(t => `<span class="preview-tag">${esc(t)}</span>`).join('');
      text.textContent = p.description;
      preview.style.background = TINTS[+row.dataset.index % TINTS.length];
      preview.hidden = false;
    });
    row.addEventListener('mouseleave', () => { preview.hidden = true; });
  });
}

function initForm() {
  const form = document.getElementById('contactForm');
  const btn = document.getElementById('submitBtn');
  form.addEventListener('submit', async e => {
    e.preventDefault();
    btn.textContent = 'Sending…';
    btn.disabled = true;
    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });
      if (!res.ok) throw new Error(res.statusText);
      btn.textContent = 'Sent — thanks!';
      form.reset();
    } catch {
      btn.textContent = 'Something went wrong — try again';
      btn.disabled = false;
    }
  });
}
