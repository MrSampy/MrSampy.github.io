const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.addEventListener('DOMContentLoaded', () => {
  renderMetrics();
  renderNow();
  renderAvailability();
  renderSkills();
  renderLanguages();
  renderExperience();
  renderProjects();
  renderEducation();
  renderContactLinks();
  splitName();
  initSpine();
  initGlass();
  initScrollSpy();
  initReveal();
  initCounters();
  initExpanders();
  initLoad();
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
const pills = (items, cls = 'pill') => items.map(s => `<span class="${cls}">${esc(s)}</span>`).join('');

/* ─── Render ─────────────────────────────────────────────────────────────── */
function renderMetrics() {
  const grid = document.getElementById('metrics');
  DATA.metrics.forEach(m => {
    grid.appendChild(el('div', 'metric', `
      <span class="metric-num" data-count="${m.value}" data-suffix="${esc(m.suffix)}">${fmt(m.value)}${esc(m.suffix)}</span>
      <span class="metric-label">${esc(m.label)}</span>
    `));
  });
}

function renderNow() {
  const list = document.getElementById('nowList');
  DATA.now.doing.forEach(item => list.appendChild(el('li', null, esc(item))));
  document.getElementById('lookingFor').textContent = DATA.now.lookingFor;
}

function renderAvailability() {
  document.getElementById('heroAvail').textContent = DATA.availability;
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
        <span class="skill-count">${String(g.items.length).padStart(2, '0')}</span>
      </div>
      <div class="pills">${pills(g.items)}</div>
    `);
    card.setAttribute('data-reveal', '');
    card.style.setProperty('--i', i % 3);
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
  list.appendChild(el('div', 'xp-group', `
    <div class="xp-group-head">
      <span class="xp-company">${esc(X.company)}</span>
      <span class="xp-group-period">${esc(X.period)}</span>
    </div>
    <p class="xp-intro">${esc(X.intro)}</p>
  `));

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
    card.style.setProperty('--i', i % 3);
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
        <span class="work-summary">${esc(p.summary)}</span>
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
    list.appendChild(row);

    const links = [
      p.demo && `<a class="btn btn-primary" href="${esc(p.demo)}" target="_blank" rel="noopener">Open live ↗</a>`,
      p.github && `<a class="btn btn-secondary" href="${esc(p.github)}" target="_blank" rel="noopener">GitHub ↗</a>`,
    ].filter(Boolean).join('');
    const meta = [p.kind, p.role, p.year].filter(Boolean).map(t => `<span class="case-meta">${esc(t)}</span>`).join('');
    const detail = el('div', 'expander work-detail', `
      <div class="expander-inner">
        <div class="case">
          <div class="case-head">
            <div class="case-metas">${meta}</div>
            <div class="pills">${pills(p.stack, 'chip')}</div>
          </div>
          <div class="case-grid">
            <div class="case-col"><h4>Problem</h4><p>${esc(p.problem)}</p></div>
            <div class="case-col"><h4>What I built</h4><p>${esc(p.built)}</p></div>
            <div class="case-col"><h4>Outcome</h4><p>${esc(p.outcome)}</p></div>
          </div>
          ${links || (p.confidential ? '<p class="case-note">Client work — the code and the product are not public.</p>' : '')}
        </div>
      </div>
    `);
    detail.id = `case${i}`;
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

/* ─── The one signature motion ───────────────────────────────────────────── */
// A line in the margin that draws itself as you read. It is the only thing on
// the page that moves without being pressed, and it moves only with the scroll.
function initSpine() {
  const fill = document.querySelector('.spine span');
  if (!fill) return;
  if (REDUCED) { fill.style.transform = 'scaleY(1)'; return; }

  let queued = false;
  const draw = () => {
    queued = false;
    const max = document.documentElement.scrollHeight - innerHeight;
    fill.style.transform = `scaleY(${max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 1})`;
  };
  const onScroll = () => { if (!queued) { queued = true; requestAnimationFrame(draw); } };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  draw();
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
      // Same-document View Transition: the row glides to its new place and the
      // case cross-fades. The height transition is suppressed for its duration
      // so the new snapshot is captured in its final state.
      if (exclusive && document.startViewTransition && !REDUCED && document.visibilityState === 'visible') {
        document.documentElement.classList.add('vt');
        const done = () => document.documentElement.classList.remove('vt');
        const t = document.startViewTransition(apply);
        // A transition the browser skips rejects all three promises.
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
    const to = +node.dataset.count, from = +node.dataset.from || 0, suffix = node.dataset.suffix || '';
    const t0 = performance.now(), dur = 900;
    const tick = now => {
      const p = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - p, 3);
      node.textContent = fmt(Math.round(from + (to - from) * e)) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  nodes.forEach(n => { n.textContent = fmt(+n.dataset.from || 0) + (n.dataset.suffix || ''); });
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => { if (en.isIntersecting) { io.unobserve(en.target); animate(en.target); } });
  }, { threshold: 0.4 });
  nodes.forEach(n => io.observe(n));
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

// Content settles into place as it arrives — it is in the DOM at first paint,
// so a reader who scrolls past it fast still reads it.
function initReveal() {
  const els = document.querySelectorAll('[data-reveal]');
  if (REDUCED || !('IntersectionObserver' in window)) {
    els.forEach(node => node.classList.add('in'));
    return;
  }
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        en.target.classList.add('in');
        io.unobserve(en.target);
      }
    });
  }, { threshold: 0.12 });
  els.forEach(node => { node.classList.add('pending'); io.observe(node); });
}

// The one licensed exception to "nothing runs on a timer": an hourglass that
// only moves when you scroll is a clock that ticks when you look away. It runs
// on time — but only while it is actually on screen, and it restarts its cycle
// each time it comes back, so you always catch it from full.
function initGlass() {
  const glass = document.getElementById('glass');
  if (!glass) return;
  const top = document.getElementById('hgTop');
  const bot = document.getElementById('hgBot');
  const stream = document.getElementById('hgStream');
  const TOP_Y = 3.4, BOT_Y = 28.6, H = 11.8;
  const DRAIN = 3600, HOLD = 250, FLIP = 650, CYCLE = DRAIN + HOLD + FLIP;

  const sand = (p) => {
    top.setAttribute('y', (TOP_Y + H * p).toFixed(2));
    top.setAttribute('height', (H * (1 - p)).toFixed(2));
    bot.setAttribute('y', (BOT_Y - H * p).toFixed(2));
    bot.setAttribute('height', (H * p).toFixed(2));
    stream.style.opacity = p > 0.015 && p < 0.985 ? '1' : '0';
  };

  if (REDUCED) { sand(0.45); return; }

  let raf = 0, t0 = 0, running = false;
  const frame = (now) => {
    if (!running) return;
    raf = requestAnimationFrame(frame);
    const t = (now - t0) % CYCLE;
    if (t < DRAIN) {
      sand(t / DRAIN);
      glass.style.transform = 'rotate(0deg)';
    } else if (t < DRAIN + HOLD) {
      sand(1);
    } else {
      // Drained and turned 180° looks exactly like full and upright, so the
      // wrap back to the start of the cycle is invisible.
      sand(1);
      glass.style.transform = `rotate(${(180 * (t - DRAIN - HOLD)) / FLIP}deg)`;
    }
  };
  const run = (on) => {
    if (on === running) return;
    running = on;
    if (on) { t0 = performance.now(); raf = requestAnimationFrame(frame); }
    else cancelAnimationFrame(raf);
  };

  sand(0);
  if (!('IntersectionObserver' in window)) return run(true);
  const io = new IntersectionObserver(
    e => run(e[0].isIntersecting && document.visibilityState === 'visible'),
    { threshold: 0.4 }
  );
  io.observe(glass);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState !== 'visible') run(false);
    else {
      const r = glass.getBoundingClientRect();
      run(r.top < innerHeight && r.bottom > 0);
    }
  });
}

/* ─── The law: the pointer is a load ─────────────────────────────────────── */
// Every disc leans toward it, the name gives under it, the badge spins up as
// it approaches — and all of it settles back the moment the reader leaves.
// One loop, one rule. On touch the load is the scroll instead.
function splitName() {
  const h = document.querySelector('.hero-name');
  if (!h) return;
  const text = h.textContent.trim();
  h.textContent = '';
  h.setAttribute('aria-label', text);
  [...text].forEach(ch => {
    const s = el('span', 'hero-ch' + (ch === ' ' ? ' space' : ''), ch === ' ' ? '&nbsp;' : esc(ch));
    s.setAttribute('aria-hidden', 'true');
    h.appendChild(s);
  });
}

function initLoad() {
  if (REDUCED) return;
  const eyes = [...document.querySelectorAll('[data-eye]')];
  const chars = [...document.querySelectorAll('.hero-ch')];
  const ring = document.querySelector('.hero-badge .ring');
  const badge = document.querySelector('.hero-badge');
  if (!eyes.length && !chars.length) return;

  let px = -1e4, py = -1e4, pointerAt = -1e9;   // the load, in viewport space
  let spin = 0, rate = 0, vel = 0, lastY = scrollY;

  // Drive off the input that actually arrives rather than a media query: a
  // laptop with a touchscreen reports a coarse pointer and still has a mouse.
  window.addEventListener('pointermove', e => {
    if (e.pointerType === 'touch') return;      // a finger is a press, not a hover
    px = e.clientX; py = e.clientY; pointerAt = performance.now();
  }, { passive: true });
  document.documentElement.addEventListener('pointerleave', () => { pointerAt = -1e9; });

  // A tap is a load too.
  chars.forEach(c => {
    c.addEventListener('pointerdown', () => { c.classList.remove('hit'); void c.offsetWidth; c.classList.add('hit'); });
    c.addEventListener('animationend', () => c.classList.remove('hit'));
  });

  const near = r => r.bottom > -60 && r.top < innerHeight + 60;

  const loop = () => {
    requestAnimationFrame(loop);
    vel = vel * 0.86 + (scrollY - lastY) * 0.14;
    lastY = scrollY;
    const live = performance.now() - pointerAt < 2500;

    // Read every rect before writing a single transform.
    const eyeR = eyes.map(n => n.parentElement.getBoundingClientRect());
    const charR = live ? chars.map(n => n.getBoundingClientRect()) : null;
    const badgeR = live && badge ? badge.getBoundingClientRect() : null;

    eyes.forEach((n, i) => {
      const r = eyeR[i];
      if (!near(r)) return;
      let dx, dy;
      if (live) {
        dx = px - (r.left + r.width / 2);
        dy = py - (r.top + r.height / 2);
      } else {
        // No pointer: the scroll is the load.
        dx = 0;
        dy = Math.max(-1, Math.min(1, vel / 26)) * r.width;
      }
      const d = Math.hypot(dx, dy) || 1;
      const m = Math.min(d, r.width * 0.26);
      n.style.transform = `translate(${(dx / d) * m}px, ${(dy / d) * m}px)`;
    });

    if (!live) {
      rate = rate > 0.004 ? rate * 0.94 : 0;
      chars.forEach(n => { if (n.style.transform) n.style.transform = ''; });
      return;
    }

    chars.forEach((n, i) => {
      const r = charR[i];
      if (!near(r)) return;
      const dx = px - (r.left + r.width / 2);
      const dy = py - (r.top + r.height / 2);
      n.style.transform = `translateY(${-11 * Math.exp(-(dx * dx + dy * dy) / 22500)}px)`;
    });

    if (ring && badgeR && near(badgeR)) {
      const dx = px - (badgeR.left + badgeR.width / 2);
      const dy = py - (badgeR.top + badgeR.height / 2);
      rate += (Math.exp(-(dx * dx + dy * dy) / 67600) * 1.5 - rate) * 0.06;
      if (rate > 0.004) {
        spin += rate;
        ring.style.transform = `rotate(${spin}deg)`;
      }
    }
  };
  requestAnimationFrame(loop);
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
