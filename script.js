/* ─────────────────────────────────────────────
   OSAMA AHMED PORTFOLIO — script.js
   ───────────────────────────────────────────── */

// ── MOUSE GLOW ──────────────────────────────
const mouseGlow = document.getElementById('mouseGlow');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReducedMotion) {
  document.addEventListener('mousemove', (e) => {
    mouseGlow.style.setProperty('--mx', e.clientX + 'px');
    mouseGlow.style.setProperty('--my', e.clientY + 'px');
  });
}

// ── PARTICLE CANVAS ──────────────────────────
(function () {
  if (prefersReducedMotion) return;
  const canvas = document.getElementById('particles');
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const N = 80;
  const CONNECT_DIST = 120;   // max distance to draw a connecting line
  const CELL_SIZE     = CONNECT_DIST; // grid cell = connection radius, so only 3x3 neighbor cells need checking
  const particles = [];

  for (let i = 0; i < N; i++) {
    particles.push({
      x:  Math.random() * canvas.width,
      y:  Math.random() * canvas.height,
      r:  Math.random() * 1.5 + 0.3,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      a:  Math.random(),
    });
  }

  // Bucket particles into a grid keyed by "cellX,cellY" so we only ever
  // compare each particle against neighbors in its own + surrounding 8 cells,
  // instead of every other particle on the canvas (O(n) avg instead of O(n²)).
  function buildGrid() {
    const grid = new Map();
    for (let i = 0; i < particles.length; i++) {
      const p  = particles[i];
      const cx = Math.floor(p.x / CELL_SIZE);
      const cy = Math.floor(p.y / CELL_SIZE);
      const key = cx + ',' + cy;
      let bucket = grid.get(key);
      if (!bucket) { bucket = []; grid.set(key, bucket); }
      bucket.push(i);
    }
    return grid;
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const grid = buildGrid();

    // Connections — only check the 3x3 neighborhood of grid cells around each particle
    for (let i = 0; i < particles.length; i++) {
      const p  = particles[i];
      const cx = Math.floor(p.x / CELL_SIZE);
      const cy = Math.floor(p.y / CELL_SIZE);

      for (let ox = -1; ox <= 1; ox++) {
        for (let oy = -1; oy <= 1; oy++) {
          const bucket = grid.get((cx + ox) + ',' + (cy + oy));
          if (!bucket) continue;

          for (const j of bucket) {
            if (j <= i) continue; // each pair checked exactly once (i < j)
            const q = particles[j];
            const dx = p.x - q.x;
            const dy = p.y - q.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < CONNECT_DIST) {
              const alpha = (1 - dist / CONNECT_DIST) * 0.15;
              ctx.beginPath();
              ctx.strokeStyle = `rgba(124, 58, 237, ${alpha})`;
              ctx.lineWidth = 0.5;
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(q.x, q.y);
              ctx.stroke();
            }
          }
        }
      }
    }

    // Dots
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > canvas.width)  p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(167, 139, 250, ${p.a * 0.6})`;
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }

  draw();
})();

// ── NAVBAR SCROLL ────────────────────────────
const navbar = document.getElementById('navbar');
const scrollIndicator = document.querySelector('.scroll-indicator');
window.addEventListener('scroll', () => {
  if (window.scrollY > 20) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  
  if (scrollIndicator) {
    if (window.scrollY > 50) {
      scrollIndicator.classList.add('fade-out');
    } else {
      scrollIndicator.classList.remove('fade-out');
    }
  }
}, { passive: true });

// ── MOBILE MENU ──────────────────────────────
const hamburger = document.getElementById('hamburger');
const navMobile = document.getElementById('navMobile');

hamburger.addEventListener('click', () => {
  navMobile.classList.toggle('open');
  const spans = hamburger.querySelectorAll('span');
  const open  = navMobile.classList.contains('open');
  if (open) {
    spans[0].style.transform = 'translateY(7px) rotate(45deg)';
    spans[1].style.opacity   = '0';
    spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
  } else {
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }
});

// Close on link click
navMobile.querySelectorAll('.nav-mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    navMobile.classList.remove('open');
    const spans = hamburger.querySelectorAll('span');
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  });
});

// ── ACTIVE NAV LINK ──────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-link');
const navPill   = document.getElementById('navPill');

function movePillTo(link) {
  if (!link || !navPill) return;
  navPill.style.left   = link.offsetLeft + 'px';
  navPill.style.width  = link.offsetWidth + 'px';
  navPill.style.opacity = '1';
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(l => l.classList.remove('active'));
      const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
      if (active) {
        active.classList.add('active');
        movePillTo(active);
      } else {
        // No matching nav link (e.g. hero/home section) — hide the pill
        navPill.style.opacity = '0';
      }
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => observer.observe(s));

// Keep pill aligned on resize
window.addEventListener('resize', () => {
  const current = document.querySelector('.nav-link.active');
  if (current) movePillTo(current);
});

// ── TYPEWRITER ───────────────────────────────
const titles = [
  'Backend Developer',
  '.NET & PHP Developer',
  'App Builder',
  'Problem Solver',
  'IT Student',
];

let tIdx = 0, cIdx = 0, deleting = false;
const dynamicTitle = document.getElementById('dynamicTitle');

function type() {
  const current = titles[tIdx];
  if (!deleting) {
    dynamicTitle.textContent = current.slice(0, cIdx + 1);
    cIdx++;
    if (cIdx === current.length) {
      deleting = true;
      setTimeout(type, 1800);
      return;
    }
  } else {
    dynamicTitle.textContent = current.slice(0, cIdx - 1);
    cIdx--;
    if (cIdx === 0) {
      deleting = false;
      tIdx = (tIdx + 1) % titles.length;
    }
  }
  setTimeout(type, deleting ? 50 : 90);
}

setTimeout(type, 800);

// ── UNIFIED SCROLL-TRIGGER OBSERVER ──────────
// Reveal, count-up, language bars, and skill-pill stagger are all "animate once
// then unobserve" effects — so they share one IntersectionObserver instance
// instead of four, each firing its own callback set and rootMargin/threshold
// pass over the page. (The nav active-link observer stays separate below since
// it's a continuous tracker, not a one-shot animation.)
const revealEls    = document.querySelectorAll('[class*="reveal-"]');
const statNums     = document.querySelectorAll('.stat-num');
const langFills    = document.querySelectorAll('.lang-fill');
const skillGroups  = document.querySelectorAll('.skill-group');

// Each animation type keeps the intersection ratio it originally required,
// since a single observer can only have one rootMargin/threshold set —
// we pass every needed threshold value in and filter per-element in the callback.
const SCROLL_THRESHOLDS = { reveal: 0.1, count: 0.8, lang: 0.5, skill: 0.2 };

function animateReveal(el) {
  const delay = parseInt(el.dataset.delay || '0');
  setTimeout(() => el.classList.add('visible'), delay);
}

function animateCount(el) {
  const target = parseInt(el.dataset.target || '0', 10);
  // Guard against 0, negative, or invalid targets (avoids divide-by-zero / Infinity interval delay)
  if (!Number.isFinite(target) || target <= 0) {
    el.textContent = Number.isFinite(target) ? target : 0;
    return;
  }
  const dur   = 1500;
  const step  = dur / target;
  let current = 0;
  const timer = setInterval(() => {
    current++;
    el.textContent = current;
    if (current >= target) clearInterval(timer);
  }, step);
}

function animateLangBar(el) {
  const w = el.style.width;
  el.style.width = '0';
  requestAnimationFrame(() => {
    setTimeout(() => { el.style.width = w; }, 100);
  });
}

function animateSkillGroup(groupEl) {
  const pills = groupEl.querySelectorAll('.skill-pill');
  pills.forEach((p, i) => {
    setTimeout(() => {
      p.style.opacity   = '1';
      p.style.transform = 'translateY(0)';
    }, i * 60);
  });
}

const scrollObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const el = entry.target;
    let type, ratioNeeded;

    if (el.classList.contains('stat-num'))         { type = 'count'; ratioNeeded = SCROLL_THRESHOLDS.count; }
    else if (el.classList.contains('lang-fill'))    { type = 'lang';  ratioNeeded = SCROLL_THRESHOLDS.lang; }
    else if (el.classList.contains('skill-group'))  { type = 'skill'; ratioNeeded = SCROLL_THRESHOLDS.skill; }
    else                                             { type = 'reveal'; ratioNeeded = SCROLL_THRESHOLDS.reveal; }

    if (!entry.isIntersecting || entry.intersectionRatio < ratioNeeded) return;

    if (type === 'reveal')      animateReveal(el);
    else if (type === 'count')  animateCount(el);
    else if (type === 'lang')   animateLangBar(el);
    else if (type === 'skill')  animateSkillGroup(el);

    scrollObserver.unobserve(el);
  });
}, {
  threshold: [0.1, 0.2, 0.5, 0.8],
  rootMargin: '0px 0px -60px 0px'
});

revealEls.forEach(el => scrollObserver.observe(el));
statNums.forEach(el => scrollObserver.observe(el));
langFills.forEach(el => scrollObserver.observe(el));

// ── TILT EFFECT on Project Cards ─────────────
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect   = card.getBoundingClientRect();
    const x      = e.clientX - rect.left;
    const y      = e.clientY - rect.top;
    const cx     = rect.width  / 2;
    const cy     = rect.height / 2;
    const rotX   = ((y - cy) / cy) * 4;
    const rotY   = ((x - cx) / cx) * -4;
    card.style.transform = `
      translateY(-4px)
      rotateX(${rotX}deg)
      rotateY(${rotY}deg)
    `;
    card.style.transition = 'transform 0.1s ease';
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)';
  });
});

// ── SKILL PILLS STAGGER (init + observe via the shared scrollObserver above) ──
skillGroups.forEach(g => {
  g.querySelectorAll('.skill-pill').forEach(p => {
    p.style.opacity    = '0';
    p.style.transform  = 'translateY(12px)';
    p.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
  });
  scrollObserver.observe(g);
});

// ── CURSOR GLOW on CARDS ─────────────────────
document.querySelectorAll('.project-card, .cert-card, .contact-card').forEach(el => {
  el.addEventListener('mousemove', (e) => {
    const rect = el.getBoundingClientRect();
    const x    = e.clientX - rect.left;
    const y    = e.clientY - rect.top;
    el.style.setProperty('--cx', x + 'px');
    el.style.setProperty('--cy', y + 'px');
  });
});

// ── SMOOTH SCROLL for all anchor links ───────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ── CODE CARD TYPING ANIMATION ───────────────
const codeLines = document.querySelectorAll('#codeBody .code-line');
codeLines.forEach((line, i) => {
  line.style.opacity = '0';
  line.style.transform = 'translateX(-10px)';
  line.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
  setTimeout(() => {
    line.style.opacity = '1';
    line.style.transform = 'translateX(0)';
  }, 500 + i * 120);
});

// ── CONTACT FORM (Formspree AJAX) ────────────
const contactForm   = document.getElementById('contactForm');
const formStatus     = document.getElementById('formStatus');
const sendBtn        = document.getElementById('send-message-btn');
const sendLabel      = document.getElementById('send-message-label');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    sendBtn.disabled = true;
    sendLabel.textContent = 'Sending...';
    formStatus.textContent = '';
    formStatus.className = 'form-status';

    try {
      const response = await fetch(contactForm.action, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        formStatus.textContent = "Thanks! Your message has been sent — I'll get back to you soon.";
        formStatus.classList.add('success');
        contactForm.reset();
      } else {
        formStatus.textContent = "Something went wrong. Please try again or email me directly.";
        formStatus.classList.add('error');
      }
    } catch (err) {
      formStatus.textContent = "Network error. Please try again or email me directly.";
      formStatus.classList.add('error');
    } finally {
      sendBtn.disabled = false;
      sendLabel.textContent = 'Send Message';
    }
  });
}

// ── FOOTER YEAR ──────────────────────────────
// Already hardcoded as 2026 in HTML

console.log('%c 🚀 Osama Ahmed Portfolio ', 'background:#7c3aed;color:#fff;font-size:16px;padding:8px 16px;border-radius:8px;font-weight:bold;');
console.log('%c Built with ❤️ from Egypt ', 'color:#a78bfa;font-size:13px;');

// ── PROJECTS SHOW MORE / LESS ──────────────────
const projectsToggleBtn = document.getElementById('projects-toggle-btn');
const projectsToggleText = document.getElementById('projects-toggle-text');
const projectsToggleIcon = document.getElementById('projects-toggle-icon');
const hiddenProjects = document.querySelectorAll('.project-card.more-project');

if (projectsToggleBtn && hiddenProjects.length > 0) {
  projectsToggleBtn.addEventListener('click', () => {
    const isShowingMore = projectsToggleBtn.classList.contains('showing-more');
    if (isShowingMore) {
      // Show Less logic
      hiddenProjects.forEach(el => {
        el.classList.add('hide-project');
      });
      projectsToggleBtn.classList.remove('showing-more');
      projectsToggleText.textContent = 'Show More';
      if (projectsToggleIcon) projectsToggleIcon.style.transform = 'rotate(0deg)';
    } else {
      // Show More logic
      hiddenProjects.forEach(el => {
        el.classList.remove('hide-project');
      });
      projectsToggleBtn.classList.add('showing-more');
      projectsToggleText.textContent = 'Show Less';
      if (projectsToggleIcon) projectsToggleIcon.style.transform = 'rotate(180deg)';
    }
  });
}