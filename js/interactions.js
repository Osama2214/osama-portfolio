// ── TYPEWRITER ───────────────────────────────
const titles = [
  'Full-Stack Web Developer',
  'Business Website Developer',
  'Web Application Developer',
  'E-Commerce Developer',
  'Backend & API Developer',
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

// ── TILT EFFECT on Cards ─────────────
document.querySelectorAll('.project-card, .service-card, .exp-card').forEach(card => {
  let rect = null;
  card.addEventListener('mouseenter', () => {
    rect = card.getBoundingClientRect();
  });
  card.addEventListener('mousemove', (e) => {
    if (!rect) return;
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
    rect = null;
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
document.querySelectorAll('.project-card, .service-card, .exp-card, .cert-card, .contact-card').forEach(el => {
  let rect = null;
  el.addEventListener('mouseenter', () => {
    rect = el.getBoundingClientRect();
  });
  el.addEventListener('mousemove', (e) => {
    if (!rect) return;
    const x    = e.clientX - rect.left;
    const y    = e.clientY - rect.top;
    el.style.setProperty('--cx', x + 'px');
    el.style.setProperty('--cy', y + 'px');
  });
  el.addEventListener('mouseleave', () => {
    rect = null;
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

