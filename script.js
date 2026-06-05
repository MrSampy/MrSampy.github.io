/* ─── Init ───────────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  renderAbout();
  renderAboutStats();
  renderExpectations();
  renderSkills();
  renderLanguages();
  renderTimeline();
  renderProjects();
  renderEducation();
  renderContact();
  initTypewriter();
  initTerminal();
  initNavbar();
  initReveal();
  initCursor();
  initHamburger();
  initFormSubmit();
});

/* ─── Render: About ──────────────────────────────────────────────────────── */
function renderAbout() {
  document.getElementById('aboutText').textContent = DATA.personal.about;
}

/* ─── Render: About stat card ────────────────────────────────────────────── */
function renderAboutStats() {
  const el = document.getElementById('aboutStats');
  if (!el) return;
  const rows = [
    { k: 'Primary stack', v: '.NET / C#' },
    { k: 'AI / ML',       v: 'PyTorch · RAG' },
    { k: 'Based in',      v: 'Stavanger, NO' },
    { k: 'Open to',       v: 'New opportunities' },
  ];
  rows.forEach(r => {
    const row = document.createElement('div');
    row.className = 'about-stat-row';
    row.innerHTML = `<span class="about-stat-key">${r.k}</span><span class="about-stat-val">${r.v}</span>`;
    el.appendChild(row);
  });
}

/* ─── Render: Expectations ───────────────────────────────────────────────── */
function renderExpectations() {
  const list = document.getElementById('expectationsList');
  if (!list) return;
  DATA.expectations.forEach(item => {
    const li = document.createElement('li');
    li.className = 'exp-item';
    li.textContent = item;
    list.appendChild(li);
  });
}

/* ─── Render: Languages ──────────────────────────────────────────────────── */
function renderLanguages() {
  const grid = document.getElementById('langGrid');
  if (!grid) return;
  DATA.languages.forEach(lang => {
    const card = document.createElement('div');
    card.className = 'lang-card';
    card.innerHTML = `
      <div class="lang-info">
        <span class="lang-name">${lang.name}</span>
        <span class="lang-level">${lang.level}</span>
      </div>
      <div class="lang-bar-row">
        <div class="lang-bar-track">
          <div class="lang-bar-fill" style="width:0%"
               data-width="${lang.bar}"></div>
        </div>
        <span class="lang-pct">${lang.bar}%</span>
      </div>
    `;
    grid.appendChild(card);
  });
}

/* ─── Render: Skills — domain panels ────────────────────────────────────── */
/* Lucide icon SVG paths (inline, no CDN dependency) */
const LUCIDE = {
  server: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="8" x="2" y="2" rx="2" ry="2"/><rect width="20" height="8" x="2" y="14" rx="2" ry="2"/><line x1="6" x2="6.01" y1="6" y2="6"/><line x1="6" x2="6.01" y1="18" y2="18"/></svg>`,
  'layout-panel-left': `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 3v18"/><path d="M3 9h6"/><path d="M3 15h6"/></svg>`,
  'brain-circuit': `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/><path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"/><path d="M17.599 6.5a3 3 0 0 0 .399-1.375"/><path d="M6.003 5.125A3 3 0 0 0 6.401 6.5"/><path d="M3.477 10.896a4 4 0 0 1 .585-.396"/><path d="M19.938 10.5a4 4 0 0 1 .585.396"/><path d="M6 18a4 4 0 0 1-1.967-.516"/><path d="M19.967 17.484A4 4 0 0 1 18 18"/></svg>`,
  container: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M22 7.7c0-.6-.4-1.2-.8-1.5l-6.3-3.9a1.72 1.72 0 0 0-1.7 0l-10.3 6c-.5.2-.9.8-.9 1.4v6.6c0 .5.4 1.2.8 1.5l6.3 3.9a1.72 1.72 0 0 0 1.7 0l10.3-6c.5-.3.9-1 .9-1.5Z"/><polyline points="6.17 3.6 12 7.42 17.83 3.6"/><polyline points="6.17 20.4 12 16.58 17.83 20.4"/><line x1="12" x2="12" y1="7.42" y2="16.58"/></svg>`,
};

function renderSkills() {
  const grid = document.getElementById('skillsGrid');
  if (!grid) return;
  DATA.skills.forEach((domain, i) => {
    const card = document.createElement('div');
    card.className = 'skill-card reveal';
    if (i % 2 === 1) card.classList.add('reveal-delay');
    // set CSS custom prop for the top-bar color
    card.style.setProperty('--domain-color', `var(${domain.colorVar})`);

    const tags = domain.items
      .map(name => `<span class="tag">${name}</span>`)
      .join('');

    card.innerHTML = `
      <div class="skill-domain-header">
        <div class="skill-domain-icon" style="color:var(${domain.colorVar})">
          ${LUCIDE[domain.icon] || ''}
        </div>
        <div class="skill-domain-meta">
          <div class="skill-cat">${domain.label}</div>
          <div class="skill-path">~/skills/${domain.key}</div>
        </div>
      </div>
      <p class="skill-blurb">${domain.blurb}</p>
      <div class="skill-tags">${tags}</div>
    `;
    grid.appendChild(card);
  });
}

/* ─── Render: Timeline ───────────────────────────────────────────────────── */
function renderTimeline() {
  const tl = document.getElementById('timeline');
  DATA.experience.forEach((job, i) => {
    const item = document.createElement('div');
    item.className = `tl-item${job.current ? ' current' : ''} reveal`;

    const bullets = job.description.map(d => `<li>${d}</li>`).join('');
    item.innerHTML = `
      <div class="tl-dot"></div>
      <div class="tl-header" data-idx="${i}">
        <div class="tl-meta">
          <div class="tl-period">${job.period}</div>
          <div class="tl-role">${job.role}</div>
          <div class="tl-company">@ ${job.company}</div>
        </div>
        <span class="tl-chevron">▼</span>
      </div>
      <div class="tl-body" id="tlBody${i}">
        <ul>${bullets}</ul>
      </div>
    `;
    tl.appendChild(item);

    const header = item.querySelector('.tl-header');
    header.addEventListener('click', () => toggleAccordion(header, i));
    if (job.current) toggleAccordion(header, i);
  });
}

function toggleAccordion(header, idx) {
  const body = document.getElementById(`tlBody${idx}`);
  const isOpen = body.classList.contains('open');
  body.classList.toggle('open', !isOpen);
  header.classList.toggle('open', !isOpen);
}

/* ─── Render: Projects ───────────────────────────────────────────────────── */
function renderProjects() {
  const grid = document.getElementById('projectsGrid');
  DATA.projects.forEach((p, i) => {
    const card = document.createElement('div');
    card.className = 'project-card reveal';
    if (i % 2 === 1) card.classList.add('reveal-delay');

    // Extract first hex color from gradient for accent
    const accentMatch = p.gradient.match(/#[0-9a-fA-F]{6}/);
    const accentColor = accentMatch ? accentMatch[0] : '#34E1F2';

    // Build translucent glow from accent (used in ::after strip)
    const hex = accentColor.replace('#', '');
    const r = parseInt(hex.slice(0,2),16);
    const g = parseInt(hex.slice(2,4),16);
    const b = parseInt(hex.slice(4,6),16);
    const paGlow = `rgba(${r},${g},${b},0.10)`;

    card.style.setProperty('--pa', accentColor);
    card.style.setProperty('--pa-gradient', p.gradient);
    card.style.setProperty('--pa-glow', paGlow);

    const tags  = p.tags.map(t => `<span class="tag">${t}</span>`).join('');
    const ghBtn = p.github
      ? `<a href="${p.github}" class="btn btn-outline btn-sm" target="_blank" rel="noopener">GitHub ↗</a>`
      : '';
    const demoBtn = p.demo
      ? `<a href="${p.demo}" class="btn btn-outline btn-sm" target="_blank" rel="noopener">Live ↗</a>`
      : '';
    const actions = (ghBtn || demoBtn)
      ? `<div class="project-actions">${ghBtn}${demoBtn}</div>`
      : '';

    card.innerHTML = `
      <div class="project-header">
        <div class="project-dots">
          <span class="project-dot project-dot-r"></span>
          <span class="project-dot project-dot-y"></span>
          <span class="project-dot project-dot-g"></span>
          <span class="project-path">~/projects/0${i + 1}</span>
        </div>
        <a class="project-arrow"${p.github ? ` href="${p.github}" target="_blank" rel="noopener"` : ''}>↗</a>
      </div>
      <div class="project-body">
        <div class="project-title">${p.title}</div>
        <div class="project-desc">${p.description}</div>
        <div class="project-tags">${tags}</div>
      </div>
      ${actions}
    `;
    grid.appendChild(card);
  });
}

/* ─── Render: Education ──────────────────────────────────────────────────── */
function renderEducation() {
  const grid = document.getElementById('eduGrid');
  DATA.education.forEach((edu, i) => {
    const card = document.createElement('div');
    card.className = 'edu-card reveal';
    if (i % 2 === 1) card.classList.add('reveal-delay');

    card.innerHTML = `
      ${edu.current ? '<span class="edu-badge">Current</span>' : ''}
      <div class="edu-period">${edu.period}</div>
      <div class="edu-degree">${edu.degree}</div>
      <div class="edu-institution">${edu.institution}</div>
      <div class="edu-desc">${edu.description}</div>
    `;
    grid.appendChild(card);
  });
}

/* ─── Render: Contact ────────────────────────────────────────────────────── */
function renderContact() {
  const info = document.getElementById('contactInfo');
  const links = [
    { icon: '✉', label: 'Email',    value: DATA.personal.email,
      href: `mailto:${DATA.personal.email}` },
    { icon: '⌥', label: 'GitHub',   value: 'MrSampy',
      href: DATA.personal.github },
    { icon: '↗', label: 'LinkedIn', value: 'serhiy-kolosov',
      href: DATA.personal.linkedin },
    { icon: '✈', label: 'Telegram', value: '@MrSampy',
      href: DATA.personal.telegram },
    { icon: '◉', label: 'Location', value: DATA.personal.location,
      href: null },
  ];
  links.forEach(l => {
    const el = document.createElement(l.href ? 'a' : 'div');
    el.className = 'contact-link-item';
    if (l.href) { el.href = l.href; el.target = '_blank'; el.rel = 'noopener'; }
    el.innerHTML = `
      <div class="cli-icon">${l.icon}</div>
      <div>
        <div class="cli-label">${l.label}</div>
        <div class="cli-value">${l.value}</div>
      </div>
    `;
    info.appendChild(el);
  });
}

/* ─── Terminal typing widget (hero) ─────────────────────────────────────── */
function initTerminal() {
  const body = document.getElementById('termBody');
  if (!body) return;

  const lines = [
    { cmd: 'whoami',          out: 'serhii.kolosov — full-stack & ai engineer', outClass: 'tg' },
    { cmd: 'cat ~/stack.txt', out: 'enterprise .NET  ×  applied machine learning', outClass: 'tv' },
    { cmd: 'location --now',  out: 'Stavanger, Norway · UTC+1', outClass: '' },
  ];

  let lineIdx  = 0;
  let charIdx  = 0;
  let rendered = [];   // fully typed lines already in DOM

  function buildBody() {
    body.innerHTML = '';
    // re-render completed lines
    rendered.forEach(l => {
      const cmdDiv = document.createElement('div');
      cmdDiv.innerHTML = `<span class="tc">$</span> ${l.cmd}`;
      body.appendChild(cmdDiv);
      const outDiv = document.createElement('div');
      outDiv.innerHTML = `<span class="${l.outClass || 'tg'}">${l.out}</span>`;
      body.appendChild(outDiv);
    });
    // current typing line
    if (lineIdx < lines.length) {
      const cur = lines[lineIdx];
      const partial = cur.cmd.slice(0, charIdx);
      const curDiv = document.createElement('div');
      curDiv.innerHTML = `<span class="tc">$</span> ${partial}<span class="term-caret">▍</span>`;
      body.appendChild(curDiv);
    } else {
      // all done — idle caret
      const idleDiv = document.createElement('div');
      idleDiv.innerHTML = `<span class="tc">$</span> <span class="term-caret">▍</span>`;
      body.appendChild(idleDiv);
    }
  }

  function tick() {
    if (lineIdx >= lines.length) return;
    const cur = lines[lineIdx];
    if (charIdx < cur.cmd.length) {
      charIdx++;
      buildBody();
      setTimeout(tick, 48);
    } else {
      // finished typing command → show output after short pause
      setTimeout(() => {
        rendered.push(cur);
        lineIdx++;
        charIdx = 0;
        buildBody();
        if (lineIdx < lines.length) setTimeout(tick, 400);
      }, 380);
    }
  }

  buildBody();
  setTimeout(tick, 900);
}

/* ─── Typewriter (hero role) ─────────────────────────────────────────────── */
function initTypewriter() {
  const el = document.getElementById('typewriter');
  if (!el) return;
  const strings = DATA.personal.titles;
  let sIdx = 0, cIdx = 0, deleting = false;

  function tick() {
    const current = strings[sIdx];
    if (deleting) {
      el.textContent = current.slice(0, cIdx - 1);
      cIdx--;
    } else {
      el.textContent = current.slice(0, cIdx + 1);
      cIdx++;
    }
    if (!deleting && cIdx === current.length) {
      deleting = true;
      setTimeout(tick, 2000);
      return;
    }
    if (deleting && cIdx === 0) {
      deleting = false;
      sIdx = (sIdx + 1) % strings.length;
    }
    setTimeout(tick, deleting ? 42 : 88);
  }
  setTimeout(tick, 500);
}

/* ─── Navbar scroll + scroll-spy ────────────────────────────────────────── */
function initNavbar() {
  const navbar  = document.getElementById('navbar');
  const links   = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  function onScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 140) current = sec.id;
    });
    links.forEach(l => {
      l.classList.toggle('active', l.getAttribute('href') === `#${current}`);
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ─── Intersection Observer reveal ──────────────────────────────────────── */
function initReveal() {
  const io = new IntersectionObserver(
    entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
    { threshold: 0.08 }
  );
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  // Animate language bars when they scroll into view
  const barIO = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.querySelectorAll('.lang-bar-fill').forEach(fill => {
          fill.style.width = fill.dataset.width + '%';
        });
        barIO.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('.lang-card').forEach(card => barIO.observe(card));
}

/* ─── Custom cursor ──────────────────────────────────────────────────────── */
function initCursor() {
  const dot      = document.getElementById('cursor');
  const ring     = document.getElementById('cursorFollower');
  if (!dot || window.matchMedia('(pointer:coarse)').matches) return;

  let mx = 0, my = 0, fx = 0, fy = 0;
  document.body.classList.add('cursor-active');

  /* Dot follows instantly */
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  }, { passive: true });

  /* Ring follows with spring lag */
  (function animRing() {
    fx += (mx - fx) * 0.10;
    fy += (my - fy) * 0.10;
    ring.style.left = fx + 'px';
    ring.style.top  = fy + 'px';
    requestAnimationFrame(animRing);
  })();

  /* Hover state on interactive elements */
  const targets = 'a, button, .tl-header, .project-card, .skill-card, .lang-card, .contact-link-item';
  document.querySelectorAll(targets).forEach(el => {
    el.addEventListener('mouseenter', () => {
      dot.classList.add('is-hover');
      ring.classList.add('is-hover');
    });
    el.addEventListener('mouseleave', () => {
      dot.classList.remove('is-hover');
      ring.classList.remove('is-hover');
    });
  });

  /* Hide when leaving window */
  document.addEventListener('mouseleave', () => {
    dot.style.opacity  = '0';
    ring.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    dot.style.opacity  = '';
    ring.style.opacity = '';
  });
}

/* ─── Hamburger ──────────────────────────────────────────────────────────── */
function initHamburger() {
  const btn   = document.getElementById('hamburger');
  const links = document.getElementById('navLinks');
  if (!btn || !links) return;

  btn.addEventListener('click', () => {
    btn.classList.toggle('open');
    links.classList.toggle('open');
  });
  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      btn.classList.remove('open');
      links.classList.remove('open');
    });
  });
}

/* ─── Form submit ────────────────────────────────────────────────────────── */
function initFormSubmit() {
  const form = document.getElementById('contactForm');
  form.addEventListener('submit', async e => {
    const btn    = form.querySelector('button[type="submit"]');
    const action = form.getAttribute('action');

    if (action.includes('YOUR_FORM_ID')) {
      e.preventDefault();
      btn.textContent = 'Configure Formspree first!';
      btn.style.opacity = '0.6';
      return;
    }

    btn.textContent = 'Sending…';
    btn.disabled    = true;
  });
}
