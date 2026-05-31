/* ─── Init ───────────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  renderAbout();
  renderExpectations();
  renderSkills();
  renderLanguages();
  renderTimeline();
  renderProjects();
  renderEducation();
  renderContact();
  initTypewriter();
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
      <div class="lang-bar-track">
        <div class="lang-bar-fill" style="width: ${lang.bar}%"></div>
      </div>
    `;
    grid.appendChild(card);
  });
}

/* ─── Render: Skills ─────────────────────────────────────────────────────── */
function renderSkills() {
  const grid = document.getElementById('skillsGrid');
  DATA.skills.forEach((cat, i) => {
    const card = document.createElement('div');
    card.className = 'skill-card reveal';
    if (i % 2 === 1) card.classList.add('reveal-delay');

    const tags = cat.items.map(name => `<span class="tag">${name}</span>`).join('');
    card.innerHTML = `
      <div class="skill-cat">${cat.category}</div>
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
    if (i % 3 === 1) card.classList.add('reveal-delay');

    const tags = p.tags.map(t => `<span class="tag">${t}</span>`).join('');
    const ghBtn = p.github
      ? `<a href="${p.github}" class="btn btn-icon" target="_blank" rel="noopener">GitHub ↗</a>`
      : '';
    const demoBtn = p.demo
      ? `<a href="${p.demo}" class="btn btn-icon" target="_blank" rel="noopener">Live ↗</a>`
      : '';

    card.innerHTML = `
      <div class="project-thumb" style="background:${p.gradient}">
        <span>${p.title}</span>
      </div>
      <div class="project-body">
        <div class="project-title">${p.title}</div>
        <div class="project-desc">${p.description}</div>
        <div class="project-tags">${tags}</div>
      </div>
      <div class="project-actions">${ghBtn}${demoBtn}</div>
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
    { icon: '✉', label: 'Email', value: DATA.personal.email, href: `mailto:${DATA.personal.email}` },
    { icon: '⌥', label: 'GitHub', value: 'github.com/MrSampy', href: DATA.personal.github },
    { icon: '◉', label: 'Location', value: DATA.personal.location, href: null },
  ];
  links.forEach(l => {
    const a = document.createElement(l.href ? 'a' : 'div');
    a.className = 'contact-link-item';
    if (l.href) { a.href = l.href; a.target = '_blank'; a.rel = 'noopener'; }
    a.innerHTML = `
      <div class="cli-icon">${l.icon}</div>
      <div>
        <div class="cli-label">${l.label}</div>
        <div class="cli-value">${l.value}</div>
      </div>
    `;
    info.appendChild(a);
  });
}

/* ─── Typewriter ─────────────────────────────────────────────────────────── */
function initTypewriter() {
  const el = document.getElementById('typewriter');
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
      setTimeout(tick, 2200);
      return;
    }
    if (deleting && cIdx === 0) {
      deleting = false;
      sIdx = (sIdx + 1) % strings.length;
    }
    setTimeout(tick, deleting ? 48 : 95);
  }
  setTimeout(tick, 600);
}

/* ─── Navbar scroll ──────────────────────────────────────────────────────── */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const links = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  function onScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 40);

    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
    });
    links.forEach(l => {
      l.classList.toggle('active', l.getAttribute('href') === `#${current}`);
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ─── Intersection Observer (reveal) ────────────────────────────────────── */
function initReveal() {
  const io = new IntersectionObserver(
    entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
    { threshold: 0.12 }
  );
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
}

/* ─── Custom cursor ──────────────────────────────────────────────────────── */
function initCursor() {
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');
  if (!cursor) return;

  let mx = 0, my = 0, fx = 0, fy = 0;
  document.body.classList.add('cursor-active');

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top = my + 'px';
  });

  function animFollower() {
    fx += (mx - fx) * 0.12;
    fy += (my - fy) * 0.12;
    follower.style.left = fx + 'px';
    follower.style.top = fy + 'px';
    requestAnimationFrame(animFollower);
  }
  animFollower();

  document.querySelectorAll('a, button, .tl-header, .project-card, .skill-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.transform = 'translate(-50%,-50%) scale(1.8)';
      follower.style.width = '50px';
      follower.style.height = '50px';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.transform = 'translate(-50%,-50%) scale(1)';
      follower.style.width = '30px';
      follower.style.height = '30px';
    });
  });
}

/* ─── Hamburger ──────────────────────────────────────────────────────────── */
function initHamburger() {
  const btn = document.getElementById('hamburger');
  const links = document.getElementById('navLinks');

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
    const btn = form.querySelector('button[type="submit"]');
    const action = form.getAttribute('action');

    if (action.includes('YOUR_FORM_ID')) {
      e.preventDefault();
      btn.textContent = 'Configure Formspree first!';
      btn.style.opacity = '0.6';
      return;
    }

    btn.textContent = 'Sending…';
    btn.disabled = true;
  });
}
