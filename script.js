const TINTS = ['var(--color-accent-200)', 'var(--color-accent-2-200)', 'var(--color-neutral-200)'];
const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const FINE = window.matchMedia('(pointer: fine)').matches;

document.addEventListener('DOMContentLoaded', () => {
  renderMetrics();
  renderNow();
  renderSkills();
  renderLanguages();
  renderExperience();
  renderProjects();
  renderEducation();
  renderContactLinks();
  initRise();
  initVine();
  initCritter();
  initScrollSpy();
  initReveal();
  initCounters();
  initExpanders();
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

const fmt = n => new Intl.NumberFormat('en-US').format(n);
const pills = (items, cls = 'pill') => items.map((s, j) => `<span class="${cls}" style="--i:${j}">${esc(s)}</span>`).join('');

/* ─── Render ─────────────────────────────────────────────────────────────── */
function renderMetrics() {
  const grid = document.getElementById('metrics');
  DATA.metrics.forEach(m => {
    const node = el('div', 'metric', `
      <span class="metric-num" data-count="${m.value}" data-suffix="${esc(m.suffix)}">${fmt(m.value)}${esc(m.suffix)}</span>
      <span class="metric-label">${esc(m.label)}</span>
    `);
    node.setAttribute('data-reveal', '');
    grid.appendChild(node);
  });
}

function renderNow() {
  const list = document.getElementById('nowList');
  DATA.now.doing.forEach(item => list.appendChild(el('li', null, esc(item))));
  document.getElementById('lookingFor').textContent = DATA.now.lookingFor;
}

function renderSkills() {
  const grid = document.getElementById('skillsGrid');
  DATA.skills.forEach((g, i) => {
    const card = el('div', 'skill-card' + (g.exploring ? ' exploring' : ''), `
      <div class="skill-head">
        <div>
          ${g.exploring ? '<span class="skill-kicker">Side projects &amp; study</span>' : ''}
          <h3>${esc(g.label)}</h3>
        </div>
        <span class="skill-count" style="background:${TINTS[i % TINTS.length]}">${String(g.items.length).padStart(2, '0')}</span>
      </div>
      <div class="pills">${pills(g.items)}</div>
    `);
    card.setAttribute('data-reveal', '');
    grid.appendChild(card);
  });
}

function renderLanguages() {
  const list = document.getElementById('langList');
  DATA.languages.forEach(l => {
    list.appendChild(el('span', 'lang', `<i></i>${esc(l.name)} — ${esc(l.level)}`));
  });
}

function renderExperience() {
  const X = DATA.experience;
  const list = document.getElementById('xpList');
  const group = el('div', 'xp-group', `
    <div class="xp-group-head">
      <span class="xp-company">${esc(X.company)}</span>
      <span class="xp-group-period">${esc(X.period)}</span>
    </div>
    <p class="xp-intro">${esc(X.intro)}</p>
  `);
  group.setAttribute('data-reveal', '');
  list.appendChild(group);
  const cards = el('div', 'xp-cards');
  list.appendChild(cards);

  X.roles.forEach((job, i) => {
    const metrics = job.highlights.map(h => `
      <div class="xp-metric"><span class="xp-metric-v">${esc(h.value)}</span><span class="xp-metric-t">${esc(h.text)}</span></div>
    `).join('');
    const card = el('article', 'xp' + (job.current ? ' current' : ''), `
      <div class="xp-when">
        <span class="xp-period">${esc(job.period)}</span>
        <span class="xp-loc">${esc(job.location || '')}</span>
      </div>
      <div class="xp-body">
        <h3>${esc(job.role)}</h3>
        <p class="xp-summary">${esc(job.summary)}</p>
        <div class="xp-stack">${pills(job.stack, 'chip')}</div>
        <div class="xp-metrics">${metrics}</div>
        <button type="button" class="xp-toggle" data-expander="xp" aria-expanded="false" aria-controls="xpMore${i}">
          <span class="xp-toggle-open">Details</span><span class="xp-toggle-close">Less</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>
        </button>
        <div class="expander xp-more" id="xpMore${i}">
          <div class="expander-inner"><ul class="xp-bullets">${job.bullets.map(b => `<li>${esc(b)}</li>`).join('')}</ul></div>
        </div>
      </div>
    `);
    card.setAttribute('data-reveal', '');
    cards.appendChild(card);
  });
}

function renderProjects() {
  const list = document.getElementById('workList');
  DATA.projects.forEach((p, i) => {
    const row = el('button', 'work-row', `
      <span class="work-num">${String(i + 1).padStart(2, '0')}</span>
      <span class="work-meta">
        <span class="work-title" style="view-transition-name: work-title-${i}">${esc(p.title)}</span>
        <span class="work-stack">${esc(p.stack.join(' · '))}</span>
      </span>
      <span class="work-arrow">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.75" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7"></path><path d="M8 7h9v9"></path></svg>
      </span>
    `);
    row.type = 'button';
    row.dataset.index = i;
    row.dataset.expander = 'work';
    row.setAttribute('aria-expanded', 'false');
    row.setAttribute('aria-controls', `case${i}`);
    row.style.setProperty('view-transition-name', `work-row-${i}`);
    list.appendChild(row);

    const links = [
      p.demo && `<a class="btn btn-primary" href="${esc(p.demo)}" target="_blank" rel="noopener">Open live ↗</a>`,
      p.github && `<a class="btn btn-secondary" href="${esc(p.github)}" target="_blank" rel="noopener">GitHub ↗</a>`,
    ].filter(Boolean).join('');
    const meta = [p.kind, p.role, p.year].filter(Boolean).map(t => `<span class="case-meta">${esc(t)}</span>`).join('');
    const detail = el('div', 'expander work-detail', `
      <div class="expander-inner">
        <div class="case" style="background:${TINTS[i % TINTS.length]}">
          <div class="case-head">
            <div class="case-metas">${meta}</div>
            <div class="pills">${pills(p.stack, 'chip')}</div>
          </div>
          <div class="case-grid">
            <div class="case-col"><h4>Problem</h4><p>${esc(p.problem)}</p></div>
            <div class="case-col"><h4>What I built</h4><p>${esc(p.built)}</p></div>
            <div class="case-col"><h4>Outcome</h4><p>${esc(p.outcome)}</p></div>
          </div>
          <div class="case-foot">
            ${links || (p.confidential ? '<span class="case-note">Client work — code and demo are not public.</span>' : '')}
            <span class="preview-dots" aria-hidden="true"><span class="dot-accent"></span><span class="dot-accent2"></span><span class="dot-text"></span></span>
          </div>
        </div>
      </div>
    `);
    detail.id = `case${i}`;
    detail.style.setProperty('view-transition-name', `work-detail-${i}`);
    list.appendChild(detail);
  });
  list.appendChild(el('div', 'work-end'));
}

function renderEducation() {
  const list = document.getElementById('eduList');
  DATA.education.forEach(e => {
    list.appendChild(el('div', 'edu' + (e.current ? ' current' : ''), `
      <span class="edu-period">${esc(e.period)}${e.current ? ' · in progress' : ''}</span>
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
    { label: 'Phone', href: `tel:${P.phone.replace(/\s+/g, '')}` },
    { label: 'Telegram', href: P.telegram },
    { label: 'CV (PDF)', href: P.cvFile, download: P.cvName },
  ];
  links.forEach(l => {
    const a = el('a', 'contact-pill', esc(l.label));
    a.href = l.href;
    if (l.download) a.setAttribute('download', l.download);
    else if (/^https?:/.test(l.href)) { a.target = '_blank'; a.rel = 'noopener'; }
    box.appendChild(a);
  });
}

/* ─── Interaction ────────────────────────────────────────────────────────── */
function initExpanders() {
  const buttons = [...document.querySelectorAll('[data-expander]')];
  const setOpen = (btn, open) => {
    const panel = document.getElementById(btn.getAttribute('aria-controls'));
    btn.setAttribute('aria-expanded', String(open));
    btn.classList.toggle('open', open);
    panel.classList.toggle('open', open);
  };
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const open = btn.getAttribute('aria-expanded') !== 'true';
      const exclusive = btn.dataset.expander === 'work';
      const apply = () => {
        if (exclusive) buttons.forEach(b => { if (b !== btn && b.dataset.expander === 'work') setOpen(b, false); });
        setOpen(btn, open);
      };
      // Same-document View Transition: rows glide and the case cross-fades.
      // The CSS height transition is suppressed for its duration so the new
      // snapshot is captured in its final state.
      if (exclusive && document.startViewTransition && !REDUCED && document.visibilityState === 'visible') {
        document.documentElement.classList.add('vt');
        const done = () => document.documentElement.classList.remove('vt');
        const t = document.startViewTransition(apply);
        // A transition skipped by the browser rejects all three promises.
        t.ready.catch(() => {});
        t.updateCallbackDone.catch(() => {});
        t.finished.then(done, done);
      } else apply();
    });
  });
}

function initCounters() {
  const nodes = [...document.querySelectorAll('[data-count]')];
  if (REDUCED || !nodes.length || !('IntersectionObserver' in window)) return;
  const animate = node => {
    const target = +node.dataset.count, suffix = node.dataset.suffix || '';
    const t0 = performance.now(), dur = 900;
    const tick = now => {
      const p = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - p, 3);
      node.textContent = fmt(Math.round(target * e)) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  nodes.forEach(n => { n.textContent = '0' + (n.dataset.suffix || ''); });
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => { if (en.isIntersecting) { io.unobserve(en.target); animate(en.target); } });
  }, { threshold: 0.4 });
  nodes.forEach(n => io.observe(n));
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
    if (REDUCED) return total;
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

function initCritter() {
  const el = document.getElementById('critter');
  const toggle = document.getElementById('critterToggle');
  const rand = (a, b) => a + Math.random() * (b - a);
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const W = () => el.offsetWidth, H = () => el.offsetHeight;
  const TOP = 90;
  const maxX = () => Math.max(8, innerWidth - W() - 8), maxY = () => Math.max(TOP, innerHeight - H() - 8);

  let x = clamp(rand(40, innerWidth - 100), 8, maxX()), y = clamp(rand(innerHeight * 0.5, innerHeight - 80), TOP, maxY());
  // The sprite faces left; scaleX(-1) turns it to the right.
  let tx = x, ty = y, facing = 1, resting = 0, flee = 0, scared = 0, last = 0, running = false, raf = 0;
  let mx = -1e4, my = -1e4;

  const pick = () => { tx = rand(8, maxX()); ty = rand(TOP, maxY()); };
  const render = () => { el.style.transform = `translate(${x}px, ${y}px) scaleX(${facing})`; };

  // Freeze, then bolt away from the threat (or in a random direction).
  const scare = (fx, fy) => {
    if (scared > 0 || flee > 0) return;
    const cxp = x + W() / 2, cyp = y + H() / 2;
    const ax = fx == null ? (Math.random() < 0.5 ? -1 : 1) : Math.sign(cxp - fx) || 1;
    const ay = fy == null ? (Math.random() < 0.5 ? -1 : 1) : Math.sign(cyp - fy) || 1;
    tx = clamp(cxp + ax * rand(220, 420) - W() / 2, 8, maxX());
    ty = clamp(cyp + ay * rand(80, 200) - H() / 2, TOP, maxY());
    scared = 0.45; flee = 1.6; resting = 0;
    el.classList.remove('scared'); void el.offsetWidth; el.classList.add('scared');
  };

  window.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; }, { passive: true });
  // Touch: a tap near the snail startles it; the stale point is cleared so it
  // does not keep running from where the finger was.
  window.addEventListener('touchstart', e => {
    const t = e.touches[0]; mx = t.clientX; my = t.clientY;
    setTimeout(() => { mx = my = -1e4; }, 250);
  }, { passive: true });
  // A hard scroll fling on touch devices also startles it.
  let lastScroll = scrollY, lastScrollT = performance.now();
  window.addEventListener('scroll', () => {
    const now = performance.now(), v = Math.abs(scrollY - lastScroll) / Math.max(1, now - lastScrollT) * 1000;
    lastScroll = scrollY; lastScrollT = now;
    if (running && v > 2600 && !FINE) scare();
  }, { passive: true });

  const step = (now) => {
    if (!running) return;
    const dt = Math.min(0.1, (now - last) / 1000 || 0); last = now;

    const cxp = x + W() / 2, cyp = y + H() / 2;
    if (Math.hypot(mx - cxp, my - cyp) < Math.max(W(), H()) * 2.4) scare(mx, my);

    if (scared > 0) scared -= dt;
    else if (flee > 0) flee -= dt;
    el.classList.toggle('flee', scared <= 0 && flee > 0);

    if (scared > 0) {
      el.classList.remove('moving');
    } else if (resting > 0) {
      resting -= dt;
      if (resting <= 0) pick();
      el.classList.remove('moving');
    } else {
      const dx = tx - x, dy = ty - y, d = Math.hypot(dx, dy);
      const speed = flee > 0 ? 180 : 22;
      if (d < 1.5) {
        resting = rand(1.5, 5);
      } else {
        const s = Math.min(d, speed * dt);
        x += dx / d * s; y += dy / d * s;
        if (Math.abs(dx) > 2) facing = dx > 0 ? -1 : 1;
        el.classList.add('moving');
      }
    }
    render();
    raf = requestAnimationFrame(step);
  };

  window.addEventListener('resize', () => {
    x = clamp(x, 8, maxX()); y = clamp(y, TOP, maxY());
    pick();
    render();
  });

  const start = () => {
    if (running) return;
    running = true; last = 0;
    render();
    el.classList.add('awake');
    raf = requestAnimationFrame(step);
  };
  const stop = () => {
    running = false;
    cancelAnimationFrame(raf);
    el.classList.remove('awake', 'moving', 'flee', 'scared');
  };
  const setEnabled = (on) => {
    on ? start() : stop();
    toggle.textContent = on ? 'Snail: on' : 'Snail: off';
    toggle.setAttribute('aria-pressed', String(on));
    try { localStorage.setItem('snail', on ? 'on' : 'off'); } catch {}
  };

  let saved = null;
  try { saved = localStorage.getItem('snail'); } catch {}
  const enabled = saved ? saved === 'on' : !REDUCED;
  toggle.addEventListener('click', () => setEnabled(!running));
  setEnabled(enabled);
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
  if (REDUCED || !('IntersectionObserver' in window)) {
    els.forEach(node => node.classList.add('in'));
    return;
  }
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
  if (!FINE) return;
  const hero = document.getElementById('hero');
  let mx = innerWidth / 2, my = innerHeight / 2;

  window.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; }, { passive: true });

  // Under reduced motion only the eyes follow the pointer.
  const tilts = REDUCED ? [] : [...document.querySelectorAll('[data-tilt]')];
  const magnets = REDUCED ? [] : [...document.querySelectorAll('[data-magnet]')];
  const eyes = [...document.querySelectorAll('[data-eye]')];
  const parallax = REDUCED ? [] : [...document.querySelectorAll('[data-parallax]')].map(node => ({ el: node.parentElement, k: +node.getAttribute('data-parallax') }));

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
  if (FINE) return;

  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const eyes = [...document.querySelectorAll('[data-eye]')];
  const tilts = REDUCED ? [] : [...document.querySelectorAll('[data-tilt]')];
  const parallax = REDUCED ? [] : [...document.querySelectorAll('[data-parallax]')].map(node => ({ el: node.parentElement, k: +node.getAttribute('data-parallax') }));
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
  rows.forEach(row => io.observe(row));
}

function initWorkPreview() {
  if (!FINE) return;
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
      if (row.getAttribute('aria-expanded') === 'true') return;
      const p = DATA.projects[+row.dataset.index];
      tags.innerHTML = p.stack.slice(0, 2).map(t => `<span class="preview-tag">${esc(t)}</span>`).join('');
      text.textContent = p.summary;
      preview.style.background = TINTS[+row.dataset.index % TINTS.length];
      preview.hidden = false;
    });
    row.addEventListener('mouseleave', () => { preview.hidden = true; });
    row.addEventListener('click', () => { preview.hidden = true; });
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
