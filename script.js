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
  initSpine();
  initScrollSpy();
  initReveal();
  initCounters();
  initExpanders();
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
  DATA.skills.forEach(g => {
    grid.appendChild(el('div', 'skill-card' + (g.exploring ? ' exploring' : ''), `
      <div class="skill-head">
        <div>
          ${g.exploring ? '<span class="skill-kicker">Side projects &amp; study</span>' : ''}
          <h3>${esc(g.label)}</h3>
        </div>
        <span class="skill-count">${String(g.items.length).padStart(2, '0')}</span>
      </div>
      <div class="pills">${pills(g.items)}</div>
    `));
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
    cards.appendChild(el('article', 'xp' + (job.current ? ' current' : ''), `
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
    `));
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

// Section headings settle in; evidence is in the DOM at first paint.
function initReveal() {
  const els = document.querySelectorAll('[data-reveal]');
  if (REDUCED || !('IntersectionObserver' in window)) {
    els.forEach(node => { node.style.opacity = '1'; });
    return;
  }
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        en.target.style.opacity = '1';
        io.unobserve(en.target);
      }
    });
  }, { threshold: 0.2 });
  els.forEach(node => {
    node.style.opacity = '0';
    node.style.transition = 'opacity .2s var(--ease-out)';
    io.observe(node);
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
