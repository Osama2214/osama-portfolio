/* ─────────────────────────────────────────────
   OSAMA AHMED PORTFOLIO — script.js
   ───────────────────────────────────────────── */

// ── MOUSE GLOW ──────────────────────────────
const mouseGlow = document.getElementById('mouseGlow');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isTouchDevice = ('ontouchstart' in window || navigator.maxTouchPoints > 0);

if (!prefersReducedMotion && !isTouchDevice) {
  document.addEventListener('mousemove', (e) => {
    mouseGlow.style.setProperty('--mx', e.clientX + 'px');
    mouseGlow.style.setProperty('--my', e.clientY + 'px');
  });
} else if (mouseGlow) {
  mouseGlow.style.display = 'none';
}

// ── PARTICLE CANVAS ──────────────────────────
(function () {
  if (prefersReducedMotion) return;
  const canvas = document.getElementById('particles');
  const ctx = canvas.getContext('2d');

  let isMatrixActive = false;
  const charArr = "01010101010101010101111111111111C#PHPDEVNETMVCAPIHTMLCSSJS";
  let columns = [];
  const fontSize = 14;

  function initMatrix() {
    columns = [];
    const numColumns = Math.floor(canvas.width / fontSize) + 1;
    for (let i = 0; i < numColumns; i++) {
      columns.push({
        y: Math.random() * -canvas.height,
        speed: Math.random() * 2 + 1.5
      });
    }
  }

  let N = window.innerWidth < 768 ? 28 : 80;
  let CONNECT_DIST = window.innerWidth < 768 ? 85 : 120;
  let CELL_SIZE = CONNECT_DIST;
  const particles = [];

  function initParticles() {
    particles.length = 0;
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
  }

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const targetN = window.innerWidth < 768 ? 28 : 80;
    if (targetN !== N) {
      N = targetN;
      CONNECT_DIST = window.innerWidth < 768 ? 85 : 120;
      CELL_SIZE = CONNECT_DIST;
      initParticles();
    }
    
    if (isMatrixActive) {
      initMatrix();
    }
  }
  resize();
  initParticles();
  window.addEventListener('resize', resize);

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
    if (isMatrixActive) {
      ctx.fillStyle = 'rgba(5, 8, 18, 0.08)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = fontSize + 'px monospace';

      for (let i = 0; i < columns.length; i++) {
        const char = charArr[Math.floor(Math.random() * charArr.length)];
        const x = i * fontSize;
        const y = columns[i].y;

        // Highlight head character in white, trails in matrix green
        ctx.fillStyle = Math.random() > 0.98 ? '#ffffff' : '#10b981';
        ctx.fillText(char, x, y);

        columns[i].y += columns[i].speed;

        if (columns[i].y > canvas.height && Math.random() > 0.975) {
          columns[i].y = 0;
        }
      }
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const grid = buildGrid();

      for (let i = 0; i < particles.length; i++) {
        const p  = particles[i];
        const cx = Math.floor(p.x / CELL_SIZE);
        const cy = Math.floor(p.y / CELL_SIZE);

        for (let ox = -1; ox <= 1; ox++) {
          for (let oy = -1; oy <= 1; oy++) {
            const bucket = grid.get((cx + ox) + ',' + (cy + oy));
            if (!bucket) continue;

            for (const j of bucket) {
              if (j <= i) continue;
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
    }

    requestAnimationFrame(draw);
  }

  // ── Extra Hacker Mode Effects ─────────────────────────────
  let hackerMsgInterval = null;
  let hackerScanlines = null;

  const hackerMessages = [
    'Accessing mainframe...',
    'Bypassing firewall... DONE',
    'Root access granted',
    'Decrypting SSL layer...',
    'Injecting payload... success',
    'Port scan complete: 3 open',
    'SSH tunnel established',
    'Memory dump in progress...',
    'Kernel exploited',
    'Obfuscating trace...',
    'DNS poisoned',
    'sudo rm -rf /ego',
    'git push --force origin main',
    'npm install malicious-pkg',
    '> Wake up, Neo...',
    'The Matrix has you.',
  ];

  function spawnHackerMsg() {
    const msg = hackerMessages[Math.floor(Math.random() * hackerMessages.length)];
    const el = document.createElement('div');
    el.className = 'hacker-float-msg';
    el.textContent = '> ' + msg;
    el.style.cssText = `
      position: fixed;
      bottom: ${20 + Math.random() * 120}px;
      left: ${10 + Math.random() * 60}vw;
      z-index: 9998;
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
      color: #00ff41;
      text-shadow: 0 0 8px #00ff41;
      opacity: 0;
      pointer-events: none;
      animation: hackerMsgAnim 3.5s ease forwards;
    `;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 3600);
  }

  function activateHackerExtras() {
    // Scanlines overlay
    hackerScanlines = document.createElement('div');
    hackerScanlines.id = 'hackerScanlines';
    hackerScanlines.style.cssText = `
      position: fixed; inset: 0; z-index: 9990; pointer-events: none;
      background: repeating-linear-gradient(
        to bottom,
        transparent 0px,
        transparent 3px,
        rgba(0,255,65,0.03) 3px,
        rgba(0,255,65,0.03) 4px
      );
      animation: scanlineFlicker 0.1s infinite;
    `;
    document.body.appendChild(hackerScanlines);

    // Crosshair cursor
    document.body.style.cursor = 'crosshair';

    // Glitch class on hero heading
    const heroName = document.querySelector('.hero-name, h1');
    if (heroName) heroName.classList.add('glitch-text');

    // Floating messages
    spawnHackerMsg();
    hackerMsgInterval = setInterval(spawnHackerMsg, 2200);
  }

  function deactivateHackerExtras() {
    if (hackerScanlines) { hackerScanlines.remove(); hackerScanlines = null; }
    document.body.style.cursor = '';
    const heroName = document.querySelector('.hero-name, h1');
    if (heroName) heroName.classList.remove('glitch-text');
    clearInterval(hackerMsgInterval);
    document.querySelectorAll('.hacker-float-msg').forEach(e => e.remove());
  }

  // Toggle button handler
  const matrixToggleBtn = document.getElementById('matrixToggle');
  const mobileMatrixToggleBtn = document.getElementById('mobileMatrixToggle');

  function toggleHackerMode() {
    isMatrixActive = !isMatrixActive;
    document.body.classList.toggle('matrix-mode');

    const desktopLabel = matrixToggleBtn && matrixToggleBtn.querySelector('.hacker-label');
    const mobileLabel  = mobileMatrixToggleBtn && mobileMatrixToggleBtn.querySelector('.mobile-hacker-label');

    if (isMatrixActive) {
      initMatrix();
      activateHackerExtras();
      if (desktopLabel) desktopLabel.textContent = 'Space Mode';
      if (mobileLabel)  mobileLabel.textContent  = 'Space Mode';
    } else {
      deactivateHackerExtras();
      if (desktopLabel) desktopLabel.textContent = 'Hacker Mode';
      if (mobileLabel)  mobileLabel.textContent  = 'Hacker Mode';
    }
  }

  if (matrixToggleBtn)       matrixToggleBtn.addEventListener('click', toggleHackerMode);
  if (mobileMatrixToggleBtn) mobileMatrixToggleBtn.addEventListener('click', toggleHackerMode);

  draw();
})();

// ── NAVBAR SCROLL ────────────────────────────
const navbar = document.getElementById('navbar');
const scrollIndicator = document.querySelector('.scroll-indicator');
let isScrolled = false;
let isFaded = false;

window.addEventListener('scroll', () => {
  const sy = window.scrollY;
  if (sy > 20) {
    if (!isScrolled) {
      navbar.classList.add('scrolled');
      isScrolled = true;
    }
  } else {
    if (isScrolled) {
      navbar.classList.remove('scrolled');
      isScrolled = false;
    }
  }
  
  if (scrollIndicator) {
    if (sy > 50) {
      if (!isFaded) {
        scrollIndicator.classList.add('fade-out');
        isFaded = true;
      }
    } else {
      if (isFaded) {
        scrollIndicator.classList.remove('fade-out');
        isFaded = false;
      }
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

const navLinksMap = {};
navLinks.forEach(link => {
  const href = link.getAttribute('href');
  if (href && href.startsWith('#')) {
    navLinksMap[href.slice(1)] = link;
  }
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const active = navLinksMap[entry.target.id];
      navLinks.forEach(l => l.classList.remove('active'));
      if (active) {
        active.classList.add('active');
        movePillTo(active);
      } else if (navPill) {
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
document.querySelectorAll('.project-card, .cert-card, .contact-card').forEach(el => {
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

// ── INTERACTIVE IDE RUN CODE ──────────────────
const runCodeBtn = document.getElementById('run-code-btn');
const closeConsoleBtn = document.getElementById('close-console-btn');
const consoleOutput = document.getElementById('consoleOutput');
const consoleLines = document.querySelectorAll('#consoleBody .console-line');

// HTML templates for states
const runHTML = `<svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg><span>Run</span>`;
const stopHTML = `<svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><rect x="4" y="4" width="16" height="16" rx="2"/></svg><span>Stop</span>`;

function openTerminal() {
  runCodeBtn.classList.add('stop-state');
  runCodeBtn.innerHTML = stopHTML;
  consoleOutput.classList.add('open');
  consoleLines.forEach(line => line.classList.remove('visible'));
  consoleLines.forEach((line, index) => {
    let delay = 150 + index * 180;
    if (index === 1) {
      delay = 450;
    } else if (index > 1) {
      delay = 450 + (index - 1) * 200;
    }
    setTimeout(() => {
      // Only show if the terminal is still open
      if (consoleOutput.classList.contains('open')) {
        line.classList.add('visible');
      }
    }, delay);
  });
}

function closeTerminal() {
  runCodeBtn.classList.remove('stop-state');
  runCodeBtn.innerHTML = runHTML;
  consoleOutput.classList.remove('open');
  consoleLines.forEach(line => line.classList.remove('visible'));
}

if (runCodeBtn && consoleOutput) {
  runCodeBtn.addEventListener('click', () => {
    const isActive = runCodeBtn.classList.contains('stop-state');
    if (isActive) {
      closeTerminal();
    } else {
      // Rotate effect on click
      runCodeBtn.classList.add('running');
      setTimeout(() => runCodeBtn.classList.remove('running'), 600);
      openTerminal();
    }
  });
}

if (closeConsoleBtn && consoleOutput) {
  closeConsoleBtn.addEventListener('click', () => {
    closeTerminal();
  });
}

// ── DEV TOOLS DROPDOWN ───────────────────────────────────
(function () {
  const dropdown = document.getElementById('devToolsDropdown');
  const btn = document.getElementById('devToolsBtn');
  if (!dropdown || !btn) return;

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdown.classList.toggle('open');
  });

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (!dropdown.contains(e.target)) {
      dropdown.classList.remove('open');
    }
  });

  // Close dropdown when an item is clicked
  dropdown.querySelectorAll('.dev-tools-item').forEach(item => {
    item.addEventListener('click', () => {
      dropdown.classList.remove('open');
    });
  });
})();

// ── INTERACTIVE TIMELINE ───────────────────────────────────
(function () {
  // Pulse animation when node enters viewport
  const timelineItems = document.querySelectorAll('.it-item');
  if (timelineItems.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
        }
      });
    }, { threshold: 0.4 });

    timelineItems.forEach(item => observer.observe(item));
  }

  // Future node — click to reveal "Maybe Your Company?"
  const futureCard = document.getElementById('futureCard');
  if (futureCard) {
    futureCard.addEventListener('click', () => {
      futureCard.classList.toggle('revealed');
    });
  }
})();

// ── DEVELOPER TERMINAL CONSOLE ENGINE ──────────────────
(function () {
  const terminalPanel = document.getElementById('terminalPanel');
  const terminalToggle = document.getElementById('terminalToggle');
  const mobileTerminalToggle = document.getElementById('mobileTerminalToggle');
  const terminalCloseBtn = document.getElementById('terminalCloseBtn');
  const terminalOutput = document.getElementById('terminalOutput');
  const terminalInput = document.getElementById('terminalInput');
  const terminalInputGhost = document.getElementById('terminalInputGhost');

  if (!terminalPanel || !terminalInput) return;

  const commands = ['help', 'about', 'skills', 'projects', 'experience', 'contact', 'coffee', 'coffee++', '3am', 'clear', 'theme', 'cv', 'social', 'secret', 'hack', 'guess'];
  const themes = ['default', 'theme-green', 'theme-cyan', 'theme-amber'];
  let currentThemeIdx = 0;

  const commandHistory = [];
  let historyIdx = 0;
  let activeSubMode = null; // 'projects', 'contact', or 'guess'
  let isTyping = false; // block input while printing typing animations
  let guessTarget = 0;
  let guessAttempts = 0;

  function openTerminalPanel() {
    terminalPanel.classList.add('open');
    setTimeout(() => {
      terminalInput.focus();
    }, 100);
  }

  function closeTerminalPanel() {
    terminalPanel.classList.remove('open');
    terminalInput.blur();
  }

  if (terminalToggle) terminalToggle.addEventListener('click', openTerminalPanel);
  if (mobileTerminalToggle) {
    mobileTerminalToggle.addEventListener('click', (e) => {
      e.preventDefault();
      // Close mobile menu first
      const navMobile = document.getElementById('navMobile');
      const hamburger = document.getElementById('hamburger');
      if (navMobile) navMobile.classList.remove('open');
      if (hamburger) {
        const spans = hamburger.querySelectorAll('span');
        spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
      }
      openTerminalPanel();
    });
  }
  if (terminalCloseBtn) terminalCloseBtn.addEventListener('click', closeTerminalPanel);

  // Click anywhere in terminal to focus input
  terminalPanel.addEventListener('click', (e) => {
    // If user is selecting text, don't hijack focus
    if (window.getSelection().toString() === '') {
      terminalInput.focus();
    }
  });

  // Print helper
  function printLine(text, className = '') {
    const line = document.createElement('div');
    line.className = 'terminal-line ' + className;
    line.textContent = text;
    terminalOutput.appendChild(line);
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
    return line;
  }

  // HTML print helper (for special outputs like ASCII art or links)
  function printHTML(html, className = '') {
    const line = document.createElement('div');
    line.className = 'terminal-line ' + className;
    line.innerHTML = html;
    terminalOutput.appendChild(line);
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
    return line;
  }

  // Typewriter text writer
  function typeText(lineElement, text, speed = 20) {
    return new Promise((resolve) => {
      let idx = 0;
      function write() {
        if (idx < text.length) {
          lineElement.textContent += text.charAt(idx);
          idx++;
          terminalOutput.scrollTop = terminalOutput.scrollHeight;
          setTimeout(write, speed);
        } else {
          resolve();
        }
      }
      write();
    });
  }

  // Progress Bar simulator
  function simulateProgressBar(lineElement, label, speed = 50, blocksCount = 10) {
    return new Promise((resolve) => {
      let current = 0;
      function tick() {
        if (current <= blocksCount) {
          const progress = '█'.repeat(current) + ' '.repeat(blocksCount - current);
          lineElement.textContent = `[${progress}] ${Math.round((current / blocksCount) * 100)}% - ${label}`;
          current++;
          terminalOutput.scrollTop = terminalOutput.scrollHeight;
          setTimeout(tick, speed);
        } else {
          resolve();
        }
      }
      tick();
    });
  }

  // Skills concurrent progress bars
  function animateSkillsBars() {
    const skillList = [
      { name: 'PHP', blocks: 10 },
      { name: 'Laravel', blocks: 8 },
      { name: 'SQL & Database', blocks: 8 },
      { name: 'Java', blocks: 6 },
      { name: 'HTML & CSS', blocks: 6 },
      { name: 'React', blocks: 3 }
    ];

    const promises = skillList.map(skill => {
      const line = printLine('');
      let current = 0;
      return new Promise(resolve => {
        function frame() {
          if (current <= skill.blocks) {
            const filled = '█'.repeat(current);
            const spaces = ' '.repeat(10 - current);
            line.textContent = `${filled}${spaces} ${skill.name}`;
            current++;
            terminalOutput.scrollTop = terminalOutput.scrollHeight;
            setTimeout(frame, 80 + Math.random() * 40);
          } else {
            resolve();
          }
        }
        frame();
      });
    });

    return Promise.all(promises);
  }

  // Ghost autocomplete helper
  function updateGhostText() {
    const val = terminalInput.value;
    if (val && activeSubMode === null) {
      const match = commands.find(c => c.startsWith(val.toLowerCase()));
      if (match) {
        terminalInputGhost.textContent = val + match.slice(val.length);
      } else {
        terminalInputGhost.textContent = '';
      }
    } else {
      terminalInputGhost.textContent = '';
    }
  }

  terminalInput.addEventListener('input', updateGhostText);

  // Command handlers
  async function handleCommand(cmdStr) {
    const trimmed = cmdStr.trim();
    if (!trimmed) return;

    printLine(`> ${trimmed}`, 'info');

    // Add to history
    commandHistory.push(trimmed);
    historyIdx = commandHistory.length;

    // Check sub-modes first
    if (activeSubMode === 'projects') {
      await handleProjectsSelection(trimmed);
      return;
    }
    if (activeSubMode === 'contact') {
      await handleContactSelection(trimmed);
      return;
    }
    if (activeSubMode === 'guess') {
      handleGuessInput(trimmed);
      return;
    }

    const args = trimmed.split(' ');
    const cmd = args[0].toLowerCase();

    isTyping = true;
    terminalInput.disabled = true;

    switch (cmd) {
      case 'help':
        const mob = window.innerWidth < 768;
        printLine('Available Commands:', 'banner');
        printLine(mob ? '  about      - Bio'                        : '  about      - A short biography about me');
        printLine(mob ? '  skills     - Tech stack'                 : '  skills     - Visual display of my core technical stack');
        printLine(mob ? '  projects   - My projects'                : '  projects   - Interactive list of my built projects');
        printLine(mob ? '  experience - Education history'          : '  experience - Detailed educational & scholarship history');
        printLine(mob ? '  contact    - Reach out'                  : '  contact    - Channels to reach out or connect with me');
        printLine(mob ? '  cv         - Open resume'                : '  cv         - Simulates and opens my resume PDF');
        printLine(mob ? '  coffee     - Energize'                   : '  coffee     - Energize the terminal developer');
        printLine(mob ? '  theme      - Change colors'              : '  theme      - Cycle console colors (purple, green, cyan, amber)');
        printLine(mob ? '  social     - GitHub & LinkedIn'          : '  social     - Quick links to GitHub & LinkedIn');
        printLine(mob ? '  clear      - Clear console'              : '  clear      - Wipes the console history clean');
        printLine(mob ? '  hack       - Hack sequence'              : '  hack       - Initiate terminal hack sequence');
        printLine(mob ? '  guess      - Number game'                : '  guess      - Play a number guessing game');
        printLine(mob ? '  secret     - [LOCKED]'                   : '  secret     - [LOCKED] You need root access first...');
        break;

      case 'about':
        const loadingLine = printLine('', 'loading');
        await typeText(loadingLine, 'Loading bio...', 15);
        await new Promise(r => setTimeout(r, 350));
        loadingLine.remove();

        const aboutLine = printLine('');
        await typeText(aboutLine, "Hi,\nI'm Osama Ahmed.\n\nBackend Developer & 3rd-year IT student at EELU.\n\nBuilt Munjez — a full offline desktop productivity app — solo.\nCurrently mastering ASP.NET Core & PHP/Laravel.\nAvailable for Internships ✅\n", 15);
        break;

      case 'skills':
        printLine('Loading technical stack visualizer...', 'loading');
        await new Promise(r => setTimeout(r, 400));
        await animateSkillsBars();
        break;

      case 'projects':
        printLine('1. Munjez            (Productivity Desktop App)');
        printLine('2. Munjez Website    (Marketing & Landing Page)');
        printLine('3. Osama Café        (Coffee Shop Landing Page)');
        printLine('');
        printLine('Choose project number [1-3]:', 'info');
        activeSubMode = 'projects';
        break;

      case 'experience':
        printLine('Digital Egypt Pioneers Initiative (DEPI) - Trainee (2026-Present)', 'banner');
        printLine('  - Stack: Full Stack .NET (C#, ASP.NET Core, EF, SQL Server)');
        printLine('  - Coverage: Architecture design, soft skills, agile frameworks.');
        printLine('');
        printLine('National Telecommunication Institute (NTI) - Trainee (2026-Present)', 'banner');
        printLine('  - Stack: Full Stack PHP (OOP, Laravel MVC, MySQL, Bootstrap)');
        printLine('  - Coverage: Daily bootcamp style project shipping.');
        printLine('');
        printLine('Egyptian E-Learning University (EELU) - B.Sc. IT (2024-2028 Expected)', 'banner');
        printLine('  - 3rd Year student focusing on software engineering foundations.');
        break;

      case 'contact':
        printLine('Contact Channels:', 'banner');
        printLine('  [email]    - osamaahmed.dev00@gmail.com');
        printLine('  [linkedin] - Osama Ahmed');
        printLine('  [github]   - @Osama2214');
        printLine('');
        printLine('Type target keyword (e.g. github, linkedin, email) to open:', 'info');
        activeSubMode = 'contact';
        break;

      case 'cv':
        const cvLine = printLine('', 'loading');
        await typeText(cvLine, 'Downloading CV...', 20);
        const cvProgress = printLine('');
        await simulateProgressBar(cvProgress, 'Osama_Ahmed_CV.pdf', 80, 10);
        printLine('Done ✔', 'success');
        window.open('Osama_Ahmed_CV.pdf', '_blank');
        break;

      case 'coffee':
        const grindLine = printLine('', 'loading');
        await typeText(grindLine, 'Grinding Beans...', 25);
        const grindProgress = printLine('');
        await simulateProgressBar(grindProgress, 'Grinding', 50, 6);
        
        const brewLine = printLine('', 'loading');
        await typeText(brewLine, '\nBrewing...', 25);
        const brewProgress = printLine('');
        await simulateProgressBar(brewProgress, 'Extraction', 80, 10);
        
        printHTML('<pre style="color:var(--term-accent); font-family: monospace; line-height: 1.2;">\n    (  )   (  )\n     )  )   )  )\n    (__(___(___)\n    |          | ]\n    |          |\n    |__________|\n</pre>');
        printLine('☕ Developer Energy +100', 'success');
        break;

      case 'coffee++':
        printLine('[EASTER EGG] Overclocking coffee module...', 'loading');
        await new Promise(r => setTimeout(r, 600));
        const megaBrewProgress = printLine('');
        await simulateProgressBar(megaBrewProgress, 'MEGA BREW', 40, 12);
        printHTML(String.raw`<pre style="color: #f59e0b; font-family: 'JetBrains Mono', monospace; font-size: 13px; line-height: 1.3; white-space: pre !important;">  ) ) )
 ( ( (
  ) ) )
..........
|  MEGA  |
| COFFEE | ]
|        |
|________|</pre>`);
        printLine('[WIN] DEVELOPER ENERGY +9999 — MAXIMUM OVERDRIVE', 'success');
        printLine('[WARNING] Productivity levels exceeding safe limits.', 'error');
        if (window.triggerCoffeeOverdrive) window.triggerCoffeeOverdrive();
        document.body.style.transition = 'filter 0.15s';
        document.body.style.filter = 'brightness(1.5)';
        setTimeout(() => { document.body.style.filter = ''; }, 200);
        break;

      case '3am':
        printLine('[EASTER EGG] Simulating 3 AM Midnight Mode...', 'loading');
        await new Promise(r => setTimeout(r, 400));
        if (window.triggerMidnightMode) window.triggerMidnightMode();
        printLine('[SUCCESS] 3 AM Night-Owl Mode Activated!', 'success');
        break;

      case 'clear':
        // Remove all lines except the initial banner header
        Array.from(terminalOutput.children).forEach(el => {
          if (!el.classList.contains('banner')) el.remove();
        });
        break;

      case 'theme':
        terminalPanel.classList.remove(...themes.filter(t => t !== 'default'));
        currentThemeIdx = (currentThemeIdx + 1) % themes.length;
        const targetTheme = themes[currentThemeIdx];
        if (targetTheme !== 'default') {
          terminalPanel.classList.add(targetTheme);
        }
        printLine(`Console theme switched to: ${targetTheme.replace('theme-', '')}`, 'success');
        break;

      case 'social':
        printHTML('LinkedIn: <a href="https://www.linkedin.com/in/osama-ahmed-67127222a" target="_blank" style="color:var(--term-accent)">Osama Ahmed</a>');
        printHTML('GitHub: <a href="https://github.com/Osama2214" target="_blank" style="color:var(--term-accent)">@Osama2214</a>');
        break;

      case 'secret':
        if (terminalPanel.classList.contains('access-granted')) {
          printLine('[UNLOCKED] Decryption Successful. Secret Document Unlocked:', 'success');
          printLine('  - Access Level   : Recruiter Mode (Activated)');
          printLine('  - Special Code   : CHIEF_DEVELOPER_OSAMA_2026');
          printLine('  - Objective      : Hire Osama Ahmed or schedule an interview!');
          printLine('  - Hidden Feature : Try typing "coffee" or "theme" to customize.');
        } else {
          printLine('[DENIED] Access restricted. Insufficient privileges.', 'error');
          await new Promise(r => setTimeout(r, 400));
          printLine('  HINT: Only a system administrator can unlock this.', 'loading');
          await new Promise(r => setTimeout(r, 400));
          printLine('  HINT: Try running a privileged command... maybe "sudo" something?', 'loading');
          await new Promise(r => setTimeout(r, 400));
          printLine('  HINT: The right action might get someone... employed.', 'loading');
        }
        break;

      case 'hack':
        const hackLine1 = printLine('', 'loading');
        await typeText(hackLine1, 'Initiating hack sequence...', 18);
        await new Promise(r => setTimeout(r, 300));
        const hackLine2 = printLine('', 'loading');
        await typeText(hackLine2, 'Bypassing firewall...', 18);
        await new Promise(r => setTimeout(r, 250));
        const hackLine3 = printLine('', 'loading');
        await typeText(hackLine3, 'Injecting payload...', 18);
        await new Promise(r => setTimeout(r, 300));
        const hackLine4 = printLine('', 'loading');
        await typeText(hackLine4, 'Decrypting database...', 18);
        await new Promise(r => setTimeout(r, 400));
        printLine('[ERROR 403] Target is Osama Ahmed. Hack Aborted.', 'error');
        printLine('[REASON]   Developer too good to be hacked.', 'error');
        break;

      case 'guess':
        guessTarget = Math.floor(Math.random() * 100) + 1;
        guessAttempts = 0;
        printLine('[GAME] Number Guessing — started!', 'banner');
        printLine(`I'm thinking of a number between 1 and 100.`);
        printLine('Type your guess and press Enter:');
        activeSubMode = 'guess';
        break;

      case 'sudo':
        if (args.slice(1).join(' ').toLowerCase() === 'hire osama') {
          terminalPanel.classList.add('access-granted');
          printLine('Access Granted.', 'success');
          printLine('Welcome Recruiter.', 'success');
          printHTML(String.raw`<pre style="font-family: 'JetBrains Mono', Consolas, Monaco, 'Courier New', Courier, monospace !important; font-size: 11px; line-height: 1.35; margin-top: 8px; white-space: pre !important;">  
  ___   ____      _     __  __     _      _   _  _____  ____   _____  _  _ 
 / _ \ / ___|    / \   |  \/  |   / \    | | | || ____||  _ \ | ____|| || |
| | | |\___ \   / _ \  | |\/| |  / _ \   | |_| ||  _|  | |_) ||  _|  | || |
| |_| | ___) | / ___ \ | |  | | / ___ \  |  _  || |___ |  _ < | |___ |_||_|
 \___/ |____/ /_/   \_\|_|  |_|/_/   \_\ |_| |_||_____||_| \_\|_____|(_)(_)
                                                                           </pre>`);
          triggerConfettiEffect();
        } else {
          printLine('Access Denied', 'error');
        }
        break;

      default:
        printLine(`command not found: "${cmd}". Type "help" to see available commands.`, 'error');
        break;
    }

    isTyping = false;
    terminalInput.disabled = false;
    terminalInput.value = '';
    terminalInputGhost.textContent = '';
    
    // Maintain focus
    setTimeout(() => {
      terminalInput.focus();
    }, 10);
  }

  // Handle Projects mode selection
  async function handleProjectsSelection(choice) {
    activeSubMode = null; // reset state
    terminalInput.value = '';
    terminalInputGhost.textContent = '';

    if (choice === '1') {
      printLine('Munjez — Productivity Desktop App', 'banner');
      printLine('Status: Free & Shipped (Windows, Linux, Android)');
      printLine('Tech Stack: React, TypeScript, Tauri, Rust, Vite, Firebase');
      printLine('Features: Smart Tasks, 4-view Calendar (Hijri), Pomodoro, Habit Tracker, Stopwatch, White Noise Mixer.');
      printHTML('Website: <a href="https://munjez-website.vercel.app" target="_blank" style="color:var(--term-accent)">https://munjez-website.vercel.app</a>');
      printHTML('GitHub:  <a href="https://github.com/Osama2214/munjez-releases" target="_blank" style="color:var(--term-accent)">github.com/Osama2214/munjez-releases</a>');
    } else if (choice === '2') {
      printLine('Munjez Website — Marketing & Landing Page', 'banner');
      printLine('Status: Live');
      printLine('Tech Stack: HTML, CSS, JavaScript, Vercel');
      printLine('Features: Bilingual (Arabic & English), full changelog, download links, privacy policy.');
      printHTML('Live Site: <a href="https://munjez-website.vercel.app" target="_blank" style="color:var(--term-accent)">https://munjez-website.vercel.app</a>');
      printHTML('GitHub:   <a href="https://github.com/Osama2214/munjez-website" target="_blank" style="color:var(--term-accent)">github.com/Osama2214/munjez-website</a>');
    } else if (choice === '3') {
      printLine('Osama Café — Specialty Coffee Shop & Roastery Web', 'banner');
      printLine('Status: Live');
      printLine('Tech Stack: HTML5, CSS3, JavaScript');
      printLine('Features: Fluid typography, glassmorphism nav, dynamic animations, scroll-triggered hooks, zero-dependency.');
      printHTML('Live Site: <a href="https://nti-task-2.vercel.app/" target="_blank" style="color:var(--term-accent)">https://nti-task-2.vercel.app/</a>');
      printHTML('GitHub:   <a href="https://github.com/Osama2214/NTI-Task-2" target="_blank" style="color:var(--term-accent)">github.com/Osama2214/NTI-Task-2</a>');
    } else {
      printLine('Invalid selection. Exited project selector.', 'error');
    }

    setTimeout(() => {
      terminalInput.focus();
    }, 10);
  }

  // Handle Contact mode selection
  async function handleContactSelection(choice) {
    activeSubMode = null;
    terminalInput.value = '';
    terminalInputGhost.textContent = '';

    const cleaned = choice.toLowerCase().trim();
    if (cleaned === 'github') {
      printLine('Opening GitHub profile...', 'success');
      window.open('https://github.com/Osama2214', '_blank');
    } else if (cleaned === 'linkedin') {
      printLine('Opening LinkedIn profile...', 'success');
      window.open('https://www.linkedin.com/in/osama-ahmed-67127222a', '_blank');
    } else if (cleaned === 'email') {
      printLine('Opening mail client...', 'success');
      window.open('mailto:osamaahmed.dev00@gmail.com', '_blank');
    } else {
      printLine('Unknown contact keyword. Exited contact selector.', 'error');
    }

    setTimeout(() => { terminalInput.focus(); }, 10);
  }

  // Handle Guess Game mode
  function handleGuessInput(input) {
    const num = parseInt(input.trim());
    if (isNaN(num) || num < 1 || num > 100) {
      printLine('Please enter a valid number between 1 and 100.', 'error');
      return;
    }
    guessAttempts++;
    if (num === guessTarget) {
      printLine(`[WIN] Correct! Guessed in ${guessAttempts} attempt${guessAttempts > 1 ? 's' : ''}.`, 'success');
      printLine('Type "guess" to play again anytime.');
      activeSubMode = null;
    } else if (num < guessTarget) {
      printLine('[^] Too low!  Go higher.', 'loading');
    } else {
      printLine('[v] Too high! Go lower.', 'loading');
    }
    terminalInput.value = '';
    terminalInputGhost.textContent = '';
    setTimeout(() => { terminalInput.focus(); }, 10);
  }

  // Trigger visual confetti effect on recruiter hire
  function triggerConfettiEffect() {
    const duration = 3000;
    const end = Date.now() + duration;
    
    const colors = ['#10b981', '#34d399', '#a78bfa', '#06b6d4', '#fbbf24', '#f472b6'];

    function frame() {
      if (Date.now() > end) return;
      
      const particle = document.createElement('div');
      particle.style.position = 'fixed';
      particle.style.width = Math.random() * 8 + 4 + 'px';
      particle.style.height = Math.random() * 8 + 4 + 'px';
      particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      particle.style.left = Math.random() * window.innerWidth + 'px';
      particle.style.bottom = '0px';
      particle.style.zIndex = '99999';
      particle.style.borderRadius = '50%';
      particle.style.pointerEvents = 'none';

      document.body.appendChild(particle);

      let velocityY = Math.random() * -12 - 6;
      let velocityX = (Math.random() - 0.5) * 6;
      let posY = window.innerHeight;
      let posX = parseFloat(particle.style.left);

      function update() {
        velocityY += 0.35; // gravity
        posY += velocityY;
        posX += velocityX;
        particle.style.top = posY + 'px';
        particle.style.left = posX + 'px';

        if (posY < window.innerHeight + 20) {
          requestAnimationFrame(update);
        } else {
          particle.remove();
        }
      }
      update();

      setTimeout(frame, 40);
    }
    frame();
  }

  // Key Event Handling
  terminalInput.addEventListener('keydown', (e) => {
    if (isTyping) {
      e.preventDefault();
      return;
    }

    // Enter Key
    if (e.key === 'Enter') {
      const val = terminalInput.value;
      handleCommand(val);
      return;
    }

    // Up Arrow
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length === 0) return;
      if (historyIdx > 0) {
        historyIdx--;
        terminalInput.value = commandHistory[historyIdx];
        updateGhostText();
      }
      return;
    }

    // Down Arrow
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIdx < commandHistory.length - 1) {
        historyIdx++;
        terminalInput.value = commandHistory[historyIdx];
        updateGhostText();
      } else {
        historyIdx = commandHistory.length;
        terminalInput.value = '';
        updateGhostText();
      }
      return;
    }

    // Tab Key
    if (e.key === 'Tab') {
      e.preventDefault();
      if (activeSubMode !== null) return;
      const val = terminalInput.value;
      if (val) {
        const match = commands.find(c => c.startsWith(val.toLowerCase()));
        if (match) {
          terminalInput.value = match;
          updateGhostText();
        }
      }
    }
  });
})();

// ── EASTER EGGS ─────────────────────────────────────────
(function () {

  /* ── Toast Notification System ── */
  function showToast(message, duration = 4000) {
    const existing = document.getElementById('easterToast');
    if (existing) existing.remove();

    const isMobile = window.innerWidth < 768;

    const toast = document.createElement('div');
    toast.id = 'easterToast';
    toast.innerHTML = `<span class="toast-msg">${message}</span>`;
    toast.style.cssText = `
      position: fixed;
      ${isMobile ? 'top: 70px; left: 16px; right: 16px;' : 'bottom: 28px; left: 28px;'}
      transform: ${isMobile ? 'translateY(-120%)' : 'translateX(-120%)'};
      background: rgba(5, 8, 18, 0.95);
      border: 1px solid rgba(124, 58, 237, 0.45);
      color: #c4b5fd;
      font-family: 'JetBrains Mono', monospace;
      font-size: 12.5px;
      padding: 10px 20px;
      border-radius: 40px;
      display: flex;
      align-items: center;
      gap: 10px;
      z-index: 99999;
      backdrop-filter: blur(16px);
      box-shadow: 0 8px 32px rgba(124,58,237,0.25), 0 0 0 1px rgba(124,58,237,0.1);
      opacity: 0;
      transition: opacity 0.35s ease, transform 0.4s cubic-bezier(0.34, 1.4, 0.64, 1);
      pointer-events: none;
      ${isMobile ? '' : 'white-space: nowrap;'}
    `;
    document.body.appendChild(toast);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translate(0, 0)';
      });
    });

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = isMobile ? 'translateY(-120%)' : 'translateX(-120%)';
      setTimeout(() => toast.remove(), 400);
    }, duration);
  }

  /* ── 1. Konami Code → Full Screen Matrix Rain Canvas ── */
  const konamiSeq = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
  let konamiUserKeys = [];

  function startKonamiMatrix() {
    let canvas = document.getElementById('konamiMatrixCanvas');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.id = 'konamiMatrixCanvas';
      document.body.appendChild(canvas);

      const exitBtn = document.createElement('button');
      exitBtn.className = 'konami-exit-btn';
      exitBtn.innerHTML = '✖ Exit Konami Matrix';
      exitBtn.onclick = () => {
        canvas.classList.remove('active');
        exitBtn.remove();
      };
      document.body.appendChild(exitBtn);
    }

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.classList.add('active');

    const chars = '01ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz<>/{}=+*';
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = Array(columns).fill(1);

    function drawMatrix() {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#10b981';
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
      if (canvas.classList.contains('active')) {
        requestAnimationFrame(drawMatrix);
      }
    }
    drawMatrix();
  }

  document.addEventListener('keydown', (e) => {
    konamiUserKeys.push(e.code);
    if (konamiUserKeys.length > konamiSeq.length) {
      konamiUserKeys.shift();
    }
    if (konamiUserKeys.join(',') === konamiSeq.join(',')) {
      konamiUserKeys = [];
      startKonamiMatrix();
      showToast('Konami Code Activated — Matrix Stream Engaged!', 5000);
    }
  });

  /* ── 2. Logo 5x Click → Live Dev Inspection HUD & Precision Inspector ── */
  const logo = document.querySelector('.nav-logo');
  if (logo) {
    let logoClicks = 0;
    let logoTimer;
    logo.addEventListener('click', (e) => {
      e.preventDefault();
      logoClicks++;
      clearTimeout(logoTimer);
      logoTimer = setTimeout(() => { logoClicks = 0; }, 2000);

      if (logoClicks >= 5) {
        logoClicks = 0;
        toggleDevHud();
      }
    });
  }

  let devHudActive = false;
  let inspectorActive = false;
  let fpsCount = 60;
  let frameCount = 0;
  let lastTime = performance.now();

  function toggleDevHud() {
    devHudActive = !devHudActive;
    let hud = document.getElementById('devHud');
    let overlay = document.getElementById('devInspectorOverlay');
    let detailsModal = document.getElementById('devInspectDetailsModal');

    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'devInspectorOverlay';
      overlay.innerHTML = '<span id="devInspectorTag" class="tag-top"></span>';
      document.body.appendChild(overlay);
    }

    if (!detailsModal) {
      detailsModal = document.createElement('div');
      detailsModal.id = 'devInspectDetailsModal';
      document.body.appendChild(detailsModal);
    }

    if (devHudActive) {
      if (!hud) {
        hud = document.createElement('div');
        hud.id = 'devHud';
        hud.innerHTML = `
          <div class="dev-hud-stat"><strong>DEV HUD</strong></div>
          <div class="dev-hud-stat"><span id="hudFps">60</span> FPS</div>
          <div class="dev-hud-stat"><span id="hudDom">${document.getElementsByTagName('*').length}</span> DOM</div>
          <div class="dev-hud-stat"><span id="hudViewport">${window.innerWidth}×${window.innerHeight}</span></div>
          <button class="dev-hud-btn" id="hudInspectBtn">Inspect Elements</button>
          <button class="dev-hud-btn" id="hudCloseBtn">✖ Close</button>
        `;
        document.body.appendChild(hud);

        document.getElementById('hudCloseBtn').onclick = () => toggleDevHud();

        const inspectBtn = document.getElementById('hudInspectBtn');
        inspectBtn.onclick = () => {
          inspectorActive = !inspectorActive;
          inspectBtn.classList.toggle('active', inspectorActive);
          showToast(inspectorActive ? 'Hover or click any element on page!' : 'Inspector Disabled');
          if (!inspectorActive) {
            overlay.style.display = 'none';
            detailsModal.style.display = 'none';
          }
        };
      }
      hud.style.display = 'flex';
      if (window.innerWidth > 768) showToast('Developer Mode Enabled — HUD Active!');
      startFpsMeter();
    } else {
      if (hud) hud.style.display = 'none';
      if (overlay) overlay.style.display = 'none';
      if (detailsModal) detailsModal.style.display = 'none';
      inspectorActive = false;
    }
  }

  window.addEventListener('resize', () => {
    const vp = document.getElementById('hudViewport');
    if (vp) vp.textContent = `${window.innerWidth}×${window.innerHeight}`;
  });

  function startFpsMeter() {
    function loop() {
      if (!devHudActive) return;
      frameCount++;
      const now = performance.now();
      if (now - lastTime >= 1000) {
        fpsCount = frameCount;
        frameCount = 0;
        lastTime = now;
        const fpsEl = document.getElementById('hudFps');
        if (fpsEl) fpsEl.textContent = fpsCount;
      }
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
  }

  // Hover Inspector & Click Details logic
  let lastMouseX = 0, lastMouseY = 0;

  function updateInspectorPosition(x, y) {
    if (!inspectorActive) return;
    const target = document.elementFromPoint(x, y);
    if (!target || target.closest('#devHud') || target.closest('#devInspectorOverlay') || target.closest('#devInspectDetailsModal')) return;

    const rect = target.getBoundingClientRect();
    const overlay = document.getElementById('devInspectorOverlay');
    const tag = document.getElementById('devInspectorTag');

    if (overlay && tag) {
      overlay.style.display = 'block';
      overlay.style.top = `${rect.top}px`;
      overlay.style.left = `${rect.left}px`;
      overlay.style.width = `${rect.width}px`;
      overlay.style.height = `${rect.height}px`;

      const idStr = target.id ? `#${target.id}` : '';
      const clsStr = target.className && typeof target.className === 'string' ? `.${target.className.split(' ')[0]}` : '';
      tag.textContent = `<${target.tagName.toLowerCase()}${idStr}${clsStr}>  [${Math.round(rect.width)} × ${Math.round(rect.height)} px]`;

      // Smart tag vertical positioning (prevent top screen clipping)
      if (rect.top < 38) {
        tag.className = 'tag-bottom';
      } else {
        tag.className = 'tag-top';
      }

      // Smart tag horizontal positioning (prevent right/left screen clipping)
      const tagWidth = tag.offsetWidth || 180;
      if (rect.left + tagWidth > window.innerWidth - 12) {
        tag.style.left = 'auto';
        tag.style.right = '0';
      } else {
        tag.style.left = '0';
        tag.style.right = 'auto';
      }
    }
  }

  document.addEventListener('mousemove', (e) => {
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
    updateInspectorPosition(lastMouseX, lastMouseY);
  });

  window.addEventListener('scroll', () => {
    if (inspectorActive) {
      updateInspectorPosition(lastMouseX, lastMouseY);
    }
  }, { passive: true });

  // Click on element while inspecting to show CSS Details Modal
  document.addEventListener('click', (e) => {
    if (!inspectorActive) return;
    const target = e.target;
    if (!target || target.closest('#devHud') || target.closest('#devInspectorOverlay') || target.closest('#devInspectDetailsModal')) return;

    e.preventDefault();
    e.stopPropagation();

    const comp = window.getComputedStyle(target);
    const rect = target.getBoundingClientRect();
    const modal = document.getElementById('devInspectDetailsModal');

    if (modal) {
      const idStr = target.id ? `#${target.id}` : '';
      const clsStr = target.className && typeof target.className === 'string' ? `.${target.className.split(' ')[0]}` : '';
      modal.innerHTML = `
        <div class="inspect-details-title">&lt;${target.tagName.toLowerCase()}${idStr}${clsStr}&gt;</div>
        <div class="inspect-details-row"><span class="inspect-details-key">Dimensions:</span><span class="inspect-details-val">${Math.round(rect.width)} × ${Math.round(rect.height)} px</span></div>
        <div class="inspect-details-row"><span class="inspect-details-key">Display:</span><span class="inspect-details-val">${comp.display}</span></div>
        <div class="inspect-details-row"><span class="inspect-details-key">Font Size:</span><span class="inspect-details-val">${comp.fontSize}</span></div>
        <div class="inspect-details-row"><span class="inspect-details-key">Padding:</span><span class="inspect-details-val">${comp.padding}</span></div>
        <div class="inspect-details-row"><span class="inspect-details-key">Margin:</span><span class="inspect-details-val">${comp.margin}</span></div>
        <div style="margin-top:12px; text-align:right;">
          <button class="dev-hud-btn" onclick="document.getElementById('devInspectDetailsModal').style.display='none'">Close Details</button>
        </div>
      `;
      modal.style.display = 'block';
    }
  }, true);

  /* ── 3. 3 AM Midnight Mode & Steaming Mug Widget ── */
  function enableMidnightMode() {
    document.body.classList.add('midnight-mode');
    showToast('3AM Midnight Mode Engaged — Dark Night Owl Theme Activated', 6000);

    let mug = document.getElementById('steamingCoffeeWidget');
    if (!mug) {
      mug = document.createElement('div');
      mug.id = 'steamingCoffeeWidget';
      mug.innerHTML = '<span>3AM Coffee Fuel — Steaming Warm</span>';
      document.body.appendChild(mug);
    }
  }

  window.triggerMidnightMode = enableMidnightMode;

  const hour = new Date().getHours();
  if (hour === 3) {
    setTimeout(enableMidnightMode, 2000);
  }



  /* ── 5. Type "404" Anywhere → Glitch CRT Portal ── */
  let typedBuffer = '';
  let bufferTimer;

  function show404GlitchOverlay() {
    let overlay = document.getElementById('glitch404Overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'glitch404Overlay';
      overlay.innerHTML = `
        <div class="glitch-code">404</div>
        <div class="glitch-msg">SYSTEM CRITICAL: PAGE DISSOLVED INTO THE VOID</div>
        <button class="glitch-restore-btn" id="glitchRestoreBtn">Warp Back to Reality</button>
      `;
      document.body.appendChild(overlay);

      document.getElementById('glitchRestoreBtn').onclick = () => {
        overlay.classList.remove('active');
        showToast('Restored back to safe dimension!');
      };
    }
    overlay.classList.add('active');
  }

  document.addEventListener('keypress', (e) => {
    const tag = document.activeElement.tagName.toLowerCase();
    if (tag === 'input' || tag === 'textarea') return;

    typedBuffer += e.key;
    clearTimeout(bufferTimer);
    bufferTimer = setTimeout(() => { typedBuffer = ''; }, 1500);

    if (typedBuffer.includes('404')) {
      typedBuffer = '';
      show404GlitchOverlay();
    }
  });

  /* ── 6. Coffee++ → Hyperdrive Speed Mode ── */
  window.triggerCoffeeOverdrive = function() {
    document.body.classList.add('coffee-overdrive');
    showToast('COFFEE OVERDRIVE! Website Hyper-Speed Activated!', 6000);
    setTimeout(() => {
      document.body.classList.remove('coffee-overdrive');
    }, 10000);
  };

  /* ── 7. Expose shared helpers for other modules (e.g. Portfolio OS Settings) ── */
  window.easterShowToast = showToast;
  window.easterStartKonamiMatrix = startKonamiMatrix;



})();

/* ══════════════════════════════════════════════════════════════
   PORTFOLIO OS — v1.0.0
══════════════════════════════════════════════════════════════ */
(function PortfolioOS() {
  'use strict';

  // ── DOM References ──────────────────────────────────────────
  const osRoot         = document.getElementById('portfolioOS');
  const bootScreen     = document.getElementById('posBootScreen');
  const desktop        = document.getElementById('posDesktop');
  const windowsCont    = document.getElementById('posWindowsContainer');
  const taskbarApps    = document.getElementById('posTaskbarApps');
  const clockEl        = document.getElementById('posClock');
  const launchBtn      = document.getElementById('launchOsBtn');
  const shutdownBtnTop = document.getElementById('posShutdownBtn');
  const shutdownScreen = document.getElementById('posShutdownScreen');
  const shutdownText   = document.getElementById('posShutdownText');
  const shutdownBarWrap= document.getElementById('posShutdownBarWrap');
  const shutdownBar    = document.getElementById('posShutdownBar');
  const iconsGrid      = document.getElementById('posIconsGrid');
  const dockWrap       = document.getElementById('posDockWrap');

  // Boot status text
  const bootStatusEl = document.getElementById('posBootStatus');
  const BOOT_STAGES  = [
    'Booting Portfolio OS...',
    'Loading Kernel...',
    'Initializing Desktop Environment...',
  ];

  if (!osRoot || !launchBtn) return;

  // ── State ───────────────────────────────────────────────────
  let zTop          = 10;
  let openWindows   = {};          // appId → { el, taskbarBtn, minimized }
  let clockInterval = null;
  let musicEnabled  = false;
  let particlesEnabled = true;
  let osTheme       = 'site-purple';
  let audioCtx      = null;
  let musicNodes    = {};
  let ambientAudio  = null;
  let ambientFadeTimer = null;
  let startupAudio  = null;
  let shutdownAudio = null;
  let desktopIconsReady = false;
  let didDragDesktopIcon = false;
  let brandIconObserver = null;
  let isBooting     = false;
  let isShuttingDown= false;
  const DESKTOP_ICON_POS_KEY = 'portfolio-os-icon-positions-v3';
  const DESKTOP_GRID = { x: 22, y: 24, col: 86, row: 74 };
  const POS_ICONS = {
    github: '<svg class="pos-brand-icon" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.42-4.04-1.42-.55-1.39-1.33-1.76-1.33-1.76-1.09-.74.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.49.99.11-.77.42-1.3.76-1.6-2.66-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23A11.5 11.5 0 0 1 12 5.4c1.02.01 2.05.14 3.01.4 2.29-1.55 3.3-1.23 3.3-1.23.65 1.66.24 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.81 5.62-5.48 5.92.43.37.82 1.1.82 2.22v3.29c0 .32.22.7.82.58A12.01 12.01 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>',
    linkedin: '<svg class="pos-brand-icon" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.23 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.23 0z"/></svg>',
    external: '<svg class="pos-action-icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>',
    download: '<svg class="pos-action-icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M5 21h14"/></svg>'
  };

  // ── App Definitions ─────────────────────────────────────────
  const APP_META = {
    terminal : { title: 'Terminal',  icon: '🖥️',  w: 680, h: 440, x: 140, y: 60  },
    projects : { title: 'Projects',  icon: '📂',  w: 720, h: 480, x: 160, y: 70  },
    resume   : { title: 'Resume',    icon: '📄',  w: 680, h: 500, x: 180, y: 50  },
    browser  : { title: 'Browser',   icon: '🌐',  w: 780, h: 520, x: 120, y: 40  },
    settings : { title: 'Settings',  icon: '⚙️',  w: 400, h: 470, x: 300, y: 80  },
    contact  : { title: 'Contact',   icon: '📧',  w: 420, h: 400, x: 320, y: 100 },
    trash    : { title: 'Trash',     icon: '🗑️',  w: 380, h: 300, x: 350, y: 120 },
    games    : { title: 'Games',     icon: '🎮',  w: 420, h: 320, x: 260, y: 70  },
    snake    : { title: 'Snake',     icon: '🐍',  w: 400, h: 520, x: 200, y: 60  },
    xo       : { title: 'Tic-Tac-Toe', icon: '❌',  w: 380, h: 480, x: 220, y: 60 },
    flappy   : { title: 'Flappy Bird', icon: '🐦',  w: 420, h: 560, x: 240, y: 50 },
  };
  const GAME_APP_IDS = ['snake', 'xo', 'flappy'];

  // Project data — matches the real projects on the site
  const PROJECTS = [
    {
      id: 'munjez',
      name: 'Munjez',
      icon: '🖥️',
      badge: 'Featured',
      type: 'Productivity Desktop App',
      desc: 'A full-featured offline productivity app — Tasks, Calendar (Hijri), Pomodoro, Habits, Stopwatch & White Noise. Built solo, runs natively on Windows, Linux & Android. No account, no internet required.',
      tech: ['React', 'TypeScript', 'Tauri', 'Rust', 'Vite', 'Firebase'],
      live: 'https://munjez-website.vercel.app',
      github: 'https://github.com/Osama2214/munjez-releases',
    },
    {
      id: 'munjez-website',
      name: 'Munjez Website',
      icon: '🌐',
      badge: 'Open Source',
      type: 'Marketing & Landing Page',
      desc: 'The official marketing website for Munjez — bilingual (Arabic & English), full changelog, download links, and privacy policy. Built as a static site with pure HTML, CSS & JS.',
      tech: ['HTML', 'CSS', 'JavaScript', 'Vercel'],
      live: 'https://munjez-website.vercel.app',
      github: 'https://github.com/Osama2214/munjez-website',
    },
    {
      id: 'osama-cafe',
      name: 'Osama Café',
      icon: '☕',
      badge: 'Open Source',
      type: 'Specialty Coffee Shop & Roastery Web',
      desc: 'A premium, highly interactive coffee shop landing page. Custom fluid typography, sticky glassmorphism nav, dynamic animations, scroll-triggered hooks, and a zero-dependency responsive architecture.',
      tech: ['HTML5', 'CSS3', 'JavaScript'],
      live: 'https://nti-task-2.vercel.app/',
      github: 'https://github.com/Osama2214/NTI-Task-2',
    },
  ];

  // ── Launch Button ────────────────────────────────────────────
  launchBtn.addEventListener('click', () => {
    if (!isBooting) startOS();
  });

  // ESC to exit during boot only
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isBooting) exitOS();
  });

  // ── Boot Sequence ────────────────────────────────────────────
  function startOS() {
    isBooting = true;
    document.documentElement.classList.add('pos-os-active');
    document.body.classList.add('pos-os-active');
    document.body.style.overflow = 'hidden';
    osRoot.classList.remove('pos-hidden');
    setupOsBrandIcons();
    bootScreen.classList.remove('pos-hidden');
    desktop.classList.add('pos-hidden');
    shutdownScreen.classList.add('pos-hidden');

    // Reset status text
    if (bootStatusEl) bootStatusEl.textContent = BOOT_STAGES[0];

    // Cycle through stages with fade transitions
    cycleBootText(0);
  }

  async function cycleBootText(idx) {
    const delays = [1500, 1200, 1000];
    if (idx >= BOOT_STAGES.length) {
      await sleep(300);
      showDesktop();
      return;
    }
    if (bootStatusEl) {
      bootStatusEl.classList.remove('pos-status-fade');
      bootStatusEl.textContent = BOOT_STAGES[idx];
    }
    await sleep(delays[idx]);
    if (bootStatusEl) bootStatusEl.classList.add('pos-status-fade');
    await sleep(280);
    cycleBootText(idx + 1);
  }

  function showDesktop() {
    bootScreen.classList.add('pos-hidden');
    desktop.classList.remove('pos-hidden');
    isBooting = false;
    initDesktopIconLayout();
    startClock();
    playStartupSound();
    if (musicEnabled) startAmbientMusic();
  }

  // ── Clock ────────────────────────────────────────────────────
  function startClock() {
    function updateClock() {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
      clockEl.textContent = `${h}:${m}  ${days[now.getDay()]}`;
    }
    updateClock();
    clockInterval = setInterval(updateClock, 10000);
  }

  // ── Desktop Icon Click ───────────────────────────────────────
  function setupOsBrandIcons() {
    decorateOsBrandLinks(osRoot);
    if (brandIconObserver) return;
    brandIconObserver = new MutationObserver((mutations) => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE) decorateOsBrandLinks(node);
        });
      });
    });
    brandIconObserver.observe(osRoot, { childList: true, subtree: true });
  }

  function decorateOsBrandLinks(root) {
    if (!root || !root.querySelectorAll) return;
    root.querySelectorAll('a.pos-file-detail-link, a.pos-contact-link').forEach(link => {
      if (link.dataset.brandIconReady === 'true') return;
      const label = link.textContent.toLowerCase();
      let icon = '';
      let text = '';
      if (label.includes('github')) {
        icon = POS_ICONS.github;
        text = 'GitHub';
      } else if (label.includes('linkedin')) {
        icon = POS_ICONS.linkedin;
        text = 'LinkedIn';
      } else {
        return;
      }
      link.dataset.brandIconReady = 'true';
      const contactIcon = link.querySelector('.pos-contact-link-icon');
      if (contactIcon) {
        contactIcon.innerHTML = icon;
      } else {
        link.innerHTML = `${icon}<span>${text}</span>`;
      }
    });
  }

  iconsGrid.addEventListener('click', (e) => {
    if (didDragDesktopIcon) {
      didDragDesktopIcon = false;
      return;
    }
    const icon = e.target.closest('.pos-icon');
    if (!icon) return;
    const appId = icon.dataset.app;
    if (appId) openApp(appId);
  });

  // Double-click to reopen
  iconsGrid.addEventListener('dblclick', (e) => {
    const icon = e.target.closest('.pos-icon');
    if (!icon) return;
    const appId = icon.dataset.app;
    if (appId && openWindows[appId]) focusWindow(openWindows[appId].el);
  });

  // ── Desktop Context Menu (right-click) ────────────────────────
  let ctxMenuEl = null;

  function closeContextMenu() {
    if (!ctxMenuEl) return;
    ctxMenuEl.remove();
    ctxMenuEl = null;
    document.removeEventListener('mousedown', onCtxOutsideClick, true);
    document.removeEventListener('keydown', onCtxEscape, true);
    window.removeEventListener('blur', closeContextMenu);
  }
  function onCtxOutsideClick(e) {
    if (ctxMenuEl && !ctxMenuEl.contains(e.target)) closeContextMenu();
  }
  function onCtxEscape(e) {
    if (e.key === 'Escape') closeContextMenu();
  }

  function openContextMenu(clientX, clientY, items) {
    closeContextMenu();

    const menu = document.createElement('div');
    menu.className = 'pos-context-menu';
    menu.innerHTML = items.map(item => item.sep
      ? '<div class="pos-ctx-sep"></div>'
      : `<button class="pos-ctx-item" type="button" data-key="${item.key}">
           <span class="pos-ctx-icon">${item.icon || ''}</span><span>${item.label}</span>
         </button>`
    ).join('');

    desktop.appendChild(menu);
    ctxMenuEl = menu;

    // Position, clamped so it never spills off-screen
    const mw = menu.offsetWidth, mh = menu.offsetHeight;
    const x = Math.max(8, Math.min(clientX, window.innerWidth  - mw - 8));
    const y = Math.max(8, Math.min(clientY, window.innerHeight - mh - 8));
    menu.style.left = x + 'px';
    menu.style.top  = y + 'px';
    requestAnimationFrame(() => menu.classList.add('pos-ctx-open'));

    menu.addEventListener('click', (e) => {
      const btn = e.target.closest('.pos-ctx-item');
      if (!btn) return;
      const item = items.find(i => i.key === btn.dataset.key);
      closeContextMenu();
      if (item && item.action) item.action();
    });

    document.addEventListener('mousedown', onCtxOutsideClick, true);
    document.addEventListener('keydown', onCtxEscape, true);
    window.addEventListener('blur', closeContextMenu);
  }

  function resetAllDesktopIconPositions() {
    Array.from(iconsGrid.querySelectorAll('.pos-icon')).forEach((icon, index) => {
      const pos = getDefaultIconPosition(index, icon);
      setDesktopIconPosition(icon, pos.x, pos.y);
    });
    saveDesktopIconPositions();
  }

  function cycleOsTheme() {
    const order = ['site-purple', 'cyan-blue', 'deep-violet'];
    applyOsTheme(order[(order.indexOf(osTheme) + 1) % order.length]);
  }

  desktop.addEventListener('contextmenu', (e) => {
    if (e.target.closest('.pos-window') || e.target.closest('.pos-topbar') || e.target.closest('.pos-dock-wrap')) return;
    e.preventDefault();

    const iconEl = e.target.closest('.pos-icon');

    if (iconEl) {
      const appId = iconEl.dataset.app;
      const meta = APP_META[appId];
      openContextMenu(e.clientX, e.clientY, [
        { key: 'open',  icon: '↗', label: `Open ${meta ? meta.title : ''}`, action: () => openApp(appId) },
        { sep: true },
        { key: 'reset', icon: '⟲', label: 'Reset Icon Position', action: () => {
            const idx = Array.from(iconsGrid.querySelectorAll('.pos-icon')).indexOf(iconEl);
            const pos = getDefaultIconPosition(idx, iconEl);
            setDesktopIconPosition(iconEl, pos.x, pos.y);
            saveDesktopIconPositions();
          } },
      ]);
      return;
    }

    openContextMenu(e.clientX, e.clientY, [
      { key: 'refresh', icon: '⟳', label: 'Refresh', action: () => {
          desktop.classList.add('pos-desktop-refresh');
          setTimeout(() => desktop.classList.remove('pos-desktop-refresh'), 300);
        } },
      { sep: true },
      { key: 'arrange', icon: '▦', label: 'Arrange Icons', action: resetAllDesktopIconPositions },
      { key: 'theme',   icon: '🎨', label: 'Next Wallpaper Theme', action: cycleOsTheme },
      { sep: true },
      { key: 'terminal', icon: '🖥️', label: 'Open Terminal Here', action: () => openApp('terminal') },
      { key: 'settings', icon: '⚙️', label: 'Display Settings', action: () => openApp('settings') },
    ]);
  });

  // ── App Launcher ─────────────────────────────────────────────
  function initDesktopIconLayout() {
    const icons = Array.from(iconsGrid.querySelectorAll('.pos-icon'));
    const saved = getSavedDesktopIconPositions();

    icons.forEach((icon, index) => {
      const appId = icon.dataset.app;
      const pos = saved[appId] || getDefaultIconPosition(index, icon);
      setDesktopIconPosition(icon, pos.x, pos.y);
      if (!icon.dataset.dragReady) {
        makeDesktopIconDraggable(icon);
        icon.dataset.dragReady = 'true';
      }
    });

    desktopIconsReady = true;
  }

  function getDefaultIconPosition(index, icon) {
    if (icon && icon.dataset.app === 'trash') {
      return clampDesktopIconPosition(Infinity, Infinity, icon);
    }
    return { x: DESKTOP_GRID.x, y: DESKTOP_GRID.y + index * DESKTOP_GRID.row };
  }

  function getSavedDesktopIconPositions() {
    try {
      return JSON.parse(localStorage.getItem(DESKTOP_ICON_POS_KEY) || '{}') || {};
    } catch (err) {
      return {};
    }
  }

  function saveDesktopIconPositions() {
    const positions = {};
    iconsGrid.querySelectorAll('.pos-icon').forEach(icon => {
      positions[icon.dataset.app] = {
        x: parseFloat(icon.style.left) || 0,
        y: parseFloat(icon.style.top) || 0
      };
    });
    localStorage.setItem(DESKTOP_ICON_POS_KEY, JSON.stringify(positions));
  }

  function clampDesktopIconPosition(x, y, icon) {
    const maxX = Math.max(0, iconsGrid.clientWidth - icon.offsetWidth - 8);
    const maxY = Math.max(0, iconsGrid.clientHeight - icon.offsetHeight - 8);
    return {
      x: Math.min(Math.max(8, x), maxX),
      y: Math.min(Math.max(8, y), maxY)
    };
  }

  function snapDesktopIconPosition(x, y, icon) {
    const rawCol = Math.round((x - DESKTOP_GRID.x) / DESKTOP_GRID.col);
    const rawRow = Math.round((y - DESKTOP_GRID.y) / DESKTOP_GRID.row);
    const snappedX = DESKTOP_GRID.x + Math.max(0, rawCol) * DESKTOP_GRID.col;
    const snappedY = DESKTOP_GRID.y + Math.max(0, rawRow) * DESKTOP_GRID.row;
    return clampDesktopIconPosition(snappedX, snappedY, icon);
  }

  function setDesktopIconPosition(icon, x, y) {
    const pos = clampDesktopIconPosition(x, y, icon);
    icon.style.left = pos.x + 'px';
    icon.style.top = pos.y + 'px';
  }

  function setDesktopIconSnappedPosition(icon, x, y) {
    const pos = snapDesktopIconPosition(x, y, icon);
    icon.style.left = pos.x + 'px';
    icon.style.top = pos.y + 'px';
  }

  function makeDesktopIconDraggable(icon) {
    let dragging = false;
    let pointerId = null;
    let startX = 0, startY = 0, startLeft = 0, startTop = 0;

    icon.addEventListener('pointerdown', (e) => {
      if (e.button !== 0) return;
      dragging = true;
      pointerId = e.pointerId;
      didDragDesktopIcon = false;
      startX = e.clientX;
      startY = e.clientY;
      startLeft = parseFloat(icon.style.left) || 0;
      startTop = parseFloat(icon.style.top) || 0;
      icon.setPointerCapture(pointerId);
    });

    icon.addEventListener('pointermove', (e) => {
      if (!dragging || e.pointerId !== pointerId) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      if (!didDragDesktopIcon && Math.hypot(dx, dy) < 4) return;
      didDragDesktopIcon = true;
      icon.classList.add('pos-icon-dragging');
      setDesktopIconPosition(icon, startLeft + dx, startTop + dy);
    });

    icon.addEventListener('pointerup', (e) => {
      if (!dragging || e.pointerId !== pointerId) return;
      dragging = false;
      icon.classList.remove('pos-icon-dragging');
      try { icon.releasePointerCapture(pointerId); } catch (err) {}
      if (didDragDesktopIcon) {
        setDesktopIconSnappedPosition(icon, parseFloat(icon.style.left) || 0, parseFloat(icon.style.top) || 0);
        saveDesktopIconPositions();
      }
    });

    icon.addEventListener('pointercancel', () => {
      dragging = false;
      icon.classList.remove('pos-icon-dragging');
    });
  }

  window.addEventListener('resize', () => {
    if (!desktopIconsReady) return;
    iconsGrid.querySelectorAll('.pos-icon').forEach(icon => {
      setDesktopIconPosition(icon, parseFloat(icon.style.left) || 0, parseFloat(icon.style.top) || 0);
    });
    saveDesktopIconPositions();
  });

  function openApp(appId) {
    // If already open, restore + focus
    if (openWindows[appId]) {
      const state = openWindows[appId];
      if (state.el.classList.contains('pos-win-minimized')) {
        restoreWindow(appId);
      } else {
        focusWindow(state.el);
      }
      return;
    }

    const meta = APP_META[appId];
    if (!meta) return;

    // Stagger offset if multiple windows
    const offset = Object.keys(openWindows).length * 22;
    const winEl = createWindow(appId, meta, offset);
    windowsCont.appendChild(winEl);

    // Build app content
    const body = winEl.querySelector('.pos-win-body');
    buildAppContent(appId, body);

    // Taskbar
    const taskBtn = createTaskbarBtn(meta.icon, meta.title, appId);
    taskbarApps.appendChild(taskBtn);

    openWindows[appId] = { el: winEl, taskbarBtn: taskBtn, minimized: false };
    focusWindow(winEl);

    makeWindowDraggable(winEl);
    makeWindowResizable(winEl);

    // Release the one-shot entrance animation once it finishes so it stops
    // pinning `transform` — otherwise it would fight with the genie
    // minimize/restore animation later.
    setTimeout(() => { winEl.style.animation = 'none'; }, 260);
  }

  // ── Window Factory ───────────────────────────────────────────
  function createWindow(appId, meta, offset) {
    const el = document.createElement('div');
    el.className = 'pos-window';
    el.dataset.appId = appId;

    // Position
    const maxX = window.innerWidth  - meta.w - 40;
    const maxY = window.innerHeight - meta.h - 80;
    const x = Math.min(meta.x + offset, Math.max(120, maxX));
    const y = Math.min(meta.y + offset, Math.max(50,  maxY));
    el.style.cssText = `width:${meta.w}px;height:${meta.h}px;left:${x}px;top:${y}px`;

    el.innerHTML = `
      <div class="pos-win-header" data-win-handle>
        <div class="pos-win-title">
          <span class="pos-win-icon">${meta.icon}</span>
          <span>${meta.title}</span>
        </div>
        <div class="pos-win-controls">
          <button class="pos-win-btn pos-win-minimize" title="Minimize">─</button>
          <button class="pos-win-btn pos-win-maximize" title="Maximize">□</button>
          <button class="pos-win-btn pos-win-close" title="Close">✕</button>
        </div>
      </div>
      <div class="pos-win-body"></div>
      <div class="pos-win-resize"></div>
    `;

    // Control buttons
    el.querySelector('.pos-win-close').addEventListener('click', () => closeWindow(appId));
    el.querySelector('.pos-win-minimize').addEventListener('click', () => minimizeWindow(appId));
    el.querySelector('.pos-win-maximize').addEventListener('click', () => maximizeWindow(appId));

    // Focus on click
    el.addEventListener('mousedown', () => focusWindow(el), true);

    return el;
  }

  // ── Window Controls ──────────────────────────────────────────
  function updateDockVisibility() {
    const gameMaximized = Object.keys(openWindows).some(id => {
      const el = openWindows[id].el;
      return GAME_APP_IDS.includes(id) &&
        el.classList.contains('pos-win-maximized') &&
        !el.classList.contains('pos-win-minimized') &&
        !el.classList.contains('pos-win-minimizing');
    });
    if (dockWrap) dockWrap.classList.toggle('pos-dock-hidden', gameMaximized);
  }

  function focusWindow(el) {
    // Unfocus all
    document.querySelectorAll('.pos-window').forEach(w => w.classList.remove('pos-win-focused'));
    document.querySelectorAll('.pos-taskbar-app').forEach(b => b.classList.remove('pos-app-active'));

    el.classList.add('pos-win-focused');
    el.style.zIndex = ++zTop;

    const appId = el.dataset.appId;
    const state = openWindows[appId];
    if (state && state.taskbarBtn) state.taskbarBtn.classList.add('pos-app-active');
    updateDockVisibility();
  }

  function closeWindow(appId) {
    const state = openWindows[appId];
    if (!state) return;
    state.el.remove();
    state.taskbarBtn && state.taskbarBtn.remove();
    delete openWindows[appId];
    updateDockVisibility();
  }

  function minimizeWindow(appId) {
    const state = openWindows[appId];
    if (!state || state.el.classList.contains('pos-win-minimized') || state.el.classList.contains('pos-win-minimizing')) return;
    const el = state.el;
    state.minimized = true;
    el.classList.remove('pos-win-focused');
    el.classList.add('pos-win-minimizing');
    state.taskbarBtn && state.taskbarBtn.classList.remove('pos-app-active');
    updateDockVisibility();
    genieAnimate(el, state.taskbarBtn, 'out', () => {
      el.classList.remove('pos-win-minimizing');
      el.classList.add('pos-win-minimized');
    });
  }

  function restoreWindow(appId) {
    const state = openWindows[appId];
    if (!state) return;
    const el = state.el;
    el.classList.remove('pos-win-minimized', 'pos-win-minimizing');
    state.minimized = false;
    genieAnimate(el, state.taskbarBtn, 'in');
    focusWindow(el);
  }

  function toggleMinimize(appId) {
    const state = openWindows[appId];
    if (!state) return;
    if (state.el.classList.contains('pos-win-minimized')) {
      restoreWindow(appId);
    } else if (state.el.classList.contains('pos-win-focused')) {
      minimizeWindow(appId);
    } else {
      focusWindow(state.el);
    }
  }

  // ── Genie-style minimize/restore animation ──────────────────
  // Approximates the macOS "genie effect" by animating a scale + translate
  // from the window's own rect toward its dock icon's rect (and back).
  function genieAnimate(win, btn, direction, onDone) {
    if (!btn) { onDone && onDone(); return; }

    const winRect = win.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();

    const dx = (btnRect.left + btnRect.width  / 2) - (winRect.left + winRect.width  / 2);
    const dy = (btnRect.top  + btnRect.height / 2) - (winRect.top  + winRect.height / 2);
    const sx = Math.max(0.04, btnRect.width  / winRect.width);
    const sy = Math.max(0.04, btnRect.height / winRect.height);
    const shrunk = `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`;

    win.style.transformOrigin = '50% 50%';

    let done = false;
    let fallbackTimer = null;

    function finishAnimation() {
      if (done) return;
      done = true;
      win.removeEventListener('transitionend', onTransitionEnd);
      if (fallbackTimer) clearTimeout(fallbackTimer);
      win.style.transition = '';
      if (direction === 'in') { win.style.transform = ''; win.style.opacity = ''; }
      onDone && onDone();
    }

    function onTransitionEnd(e) {
      if (e.target !== win || e.propertyName !== 'transform') return;
      finishAnimation();
    }

    if (direction === 'out') {
      win.style.transition = 'transform 0.34s cubic-bezier(0.55,0,0.85,0.35), opacity 0.22s ease 0.12s';
      win.addEventListener('transitionend', onTransitionEnd);
      fallbackTimer = setTimeout(finishAnimation, 430);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          win.style.transform = shrunk;
          win.style.opacity = '0';
        });
      });
    } else {
      win.style.transition = 'none';
      win.style.transform = shrunk;
      win.style.opacity = '0';
      void win.offsetWidth; // force reflow before animating back
      win.style.transition = 'transform 0.4s cubic-bezier(0.16,1,0.3,1), opacity 0.3s ease';
      win.addEventListener('transitionend', onTransitionEnd);
      fallbackTimer = setTimeout(finishAnimation, 500);
      requestAnimationFrame(() => {
        win.style.transform = 'translate(0,0) scale(1)';
        win.style.opacity = '1';
      });
    }
  }

  function maximizeWindow(appId) {
    const state = openWindows[appId];
    if (!state) return;
    const el = state.el;
    const wasMax = el.classList.contains('pos-win-maximized');
    if (!wasMax) {
      // Save previous size/pos
      el.dataset.prevStyle = el.getAttribute('style');
      el.classList.add('pos-win-maximized');
    } else {
      el.classList.remove('pos-win-maximized');
      if (el.dataset.prevStyle) el.setAttribute('style', el.dataset.prevStyle);
    }
    el.dispatchEvent(new Event('pos-win-resize'));
    updateDockVisibility();
  }

  // ── Draggable ────────────────────────────────────────────────
  function makeWindowDraggable(win) {
    const header = win.querySelector('[data-win-handle]');
    let startX, startY, startL, startT, dragging = false;

    header.addEventListener('mousedown', (e) => {
      if (e.target.closest('.pos-win-controls')) return;
      if (win.classList.contains('pos-win-maximized')) return;
      dragging = true;
      startX = e.clientX; startY = e.clientY;
      startL = parseInt(win.style.left) || 0;
      startT = parseInt(win.style.top)  || 0;
      header.classList.add('pos-dragging');
      e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
      if (!dragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      const topbarH = 40;
      const newLeft = Math.max(0, startL + dx);
      const newTop  = Math.max(topbarH, startT + dy);
      win.style.left = newLeft + 'px';
      win.style.top  = newTop  + 'px';
    });

    document.addEventListener('mouseup', () => {
      if (dragging) {
        dragging = false;
        header.classList.remove('pos-dragging');
      }
    });
  }

  // ── Resizable ────────────────────────────────────────────────
  function makeWindowResizable(win) {
    const handle = win.querySelector('.pos-win-resize');
    let resizing = false, startX, startY, startW, startH;

    handle.addEventListener('mousedown', (e) => {
      if (win.classList.contains('pos-win-maximized')) return;
      resizing = true;
      startX = e.clientX; startY = e.clientY;
      startW = win.offsetWidth; startH = win.offsetHeight;
      e.preventDefault(); e.stopPropagation();
    });

    document.addEventListener('mousemove', (e) => {
      if (!resizing) return;
      const newW = Math.max(320, startW + (e.clientX - startX));
      const newH = Math.max(200, startH + (e.clientY - startY));
      win.style.width  = newW + 'px';
      win.style.height = newH + 'px';
      win.dispatchEvent(new Event('pos-win-resize'));
    });

    document.addEventListener('mouseup', () => { resizing = false; });
  }

  // ── Taskbar Button ───────────────────────────────────────────
  function createTaskbarBtn(icon, title, appId) {
    const btn = document.createElement('button');
    btn.className = 'pos-taskbar-app pos-app-running';
    btn.title = title;
    btn.innerHTML = `<span class="pos-taskbar-icon">${icon}</span><span class="pos-taskbar-label">${title}</span>`;
    btn.addEventListener('click', () => toggleMinimize(appId));
    return btn;
  }

  // ═════════════════════════════════════════
  // APP CONTENT BUILDERS
  // ═════════════════════════════════════════

  function buildAppContent(appId, body) {
    body.style.overflow = 'hidden';
    body.style.display  = 'flex';
    body.style.flexDirection = 'column';

    switch (appId) {
      case 'terminal': buildTerminal(body); break;
      case 'projects': buildProjects(body); break;
      case 'resume':   buildResume(body);   break;
      case 'browser':  buildBrowser(body);  break;
      case 'settings': buildSettings(body); break;
      case 'contact':  buildContact(body);  break;
      case 'trash':    buildTrash(body);    break;
      case 'games':    buildGames(body);    break;
      case 'snake':    buildGame(body);     break;
      case 'xo':       buildXO(body);       break;
      case 'flappy':   buildFlappy(body);   break;
    }
  }

  // ── APP: Terminal ────────────────────────────────────────────
  function buildTerminal(body) {
    body.innerHTML = `
      <div class="pos-terminal" style="height:100%">
        <div style="display:flex;align-items:center;padding:8px 16px;background:rgba(0,0,0,0.4);border-bottom:1px solid rgba(255,255,255,0.05);border-top:2px solid var(--pos-accent);flex-shrink:0">
          <span style="flex:1;text-align:center;font-size:11.5px;color:rgba(255,255,255,0.35)">Terminal — Portfolio OS</span>
        </div>
        <div class="pos-term-output" id="posTermOut"></div>
        <div class="pos-term-input-row">
          <span class="pos-term-prompt-sym">root@portfolio:~$</span>
          <div class="pos-term-input-wrapper">
            <input type="text" class="pos-term-input" id="posTermIn" autocomplete="off" spellcheck="false" placeholder="type 'help'..." />
            <span id="posTermInGhost" class="pos-term-input-ghost"></span>
          </div>
        </div>
      </div>`;

    const out = body.querySelector('#posTermOut');
    const inp = body.querySelector('#posTermIn');
    const ghost = body.querySelector('#posTermInGhost');

    const cmdHistory = [];
    let histIdx = 0;
    let typing = false;
    let activeSubMode = null; // 'projects', 'contact', or 'guess'
    let guessTarget = 0;
    let guessAttempts = 0;
    let accessGranted = false;

    function tLine(text, cls = 'pos-t-output') {
      const d = document.createElement('div');
      d.className = `pos-term-line ${cls}`;
      d.textContent = text;
      out.appendChild(d);
      out.scrollTop = out.scrollHeight;
      return d;
    }
    function tHTML(html, cls = 'pos-t-output') {
      const d = document.createElement('div');
      d.className = `pos-term-line ${cls}`;
      d.innerHTML = html;
      out.appendChild(d);
      out.scrollTop = out.scrollHeight;
      return d;
    }
    function typeOut(text, cls, speed = 18) {
      return new Promise(resolve => {
        const d = document.createElement('div');
        d.className = `pos-term-line ${cls}`;
        out.appendChild(d);
        let i = 0;
        const t = setInterval(() => {
          d.textContent += text[i++];
          out.scrollTop = out.scrollHeight;
          if (i >= text.length) { clearInterval(t); resolve(); }
        }, speed);
      });
    }
    function progressBar(label, blocks = 14, speed = 60) {
      return new Promise(resolve => {
        const d = document.createElement('div');
        d.className = 'pos-term-line pos-t-loading';
        out.appendChild(d);
        let i = 0;
        const t = setInterval(() => {
          const filled = '█'.repeat(i);
          const empty  = '░'.repeat(blocks - i);
          d.textContent = `${label} [${filled}${empty}] ${Math.round(i/blocks*100)}%`;
          out.scrollTop = out.scrollHeight;
          if (++i > blocks) { clearInterval(t); resolve(); }
        }, speed);
      });
    }

    // Banner — same style as main site terminal
    tLine('Portfolio OS — Terminal v1.0', 'pos-t-banner');
    tLine('Osama Ahmed · Backend Dev & IT Student at EELU', 'pos-t-banner');
    tLine('─────────────────────────────────────────────', 'pos-t-banner');
    tLine("Type 'help' to list commands.", 'pos-t-info');
    tLine('', '');

    const CMDS = ['help','about','skills','projects','experience','contact','cv','coffee','social','clear','hack','guess','secret','sudo'];

    // Ghost autocomplete helper (same behavior as the outside terminal)
    function updateGhostText() {
      const val = inp.value;
      if (val && activeSubMode === null) {
        const match = CMDS.find(c => c.startsWith(val.toLowerCase()));
        ghost.textContent = match ? val + match.slice(val.length) : '';
      } else {
        ghost.textContent = '';
      }
    }
    inp.addEventListener('input', updateGhostText);

    async function handleProjectsSelection(choice) {
      activeSubMode = null;
      if (choice === '1') {
        tLine('Munjez — Productivity Desktop App', 'pos-t-banner');
        tLine('Status: Free & Shipped (Windows, Linux, Android)');
        tLine('Tech Stack: React, TypeScript, Tauri, Rust, Vite, Firebase');
        tLine('Features: Smart Tasks, 4-view Calendar (Hijri), Pomodoro, Habit Tracker, Stopwatch, White Noise Mixer.');
        tHTML('Website: <a href="https://munjez-website.vercel.app" target="_blank" style="color:var(--pos-accent)">munjez-website.vercel.app</a>');
        tHTML('GitHub:  <a href="https://github.com/Osama2214/munjez-releases" target="_blank" style="color:var(--pos-accent)">github.com/Osama2214/munjez-releases</a>');
      } else if (choice === '2') {
        tLine('Munjez Website — Marketing & Landing Page', 'pos-t-banner');
        tLine('Status: Live');
        tLine('Tech Stack: HTML, CSS, JavaScript, Vercel');
        tLine('Features: Bilingual (Arabic & English), full changelog, download links, privacy policy.');
        tHTML('Live Site: <a href="https://munjez-website.vercel.app" target="_blank" style="color:var(--pos-accent)">munjez-website.vercel.app</a>');
        tHTML('GitHub:   <a href="https://github.com/Osama2214/munjez-website" target="_blank" style="color:var(--pos-accent)">github.com/Osama2214/munjez-website</a>');
      } else if (choice === '3') {
        tLine('Osama Café — Specialty Coffee Shop & Roastery Web', 'pos-t-banner');
        tLine('Status: Live');
        tLine('Tech Stack: HTML5, CSS3, JavaScript');
        tLine('Features: Fluid typography, glassmorphism nav, dynamic animations, scroll-triggered hooks, zero-dependency.');
        tHTML('Live Site: <a href="https://nti-task-2.vercel.app/" target="_blank" style="color:var(--pos-accent)">nti-task-2.vercel.app</a>');
        tHTML('GitHub:   <a href="https://github.com/Osama2214/NTI-Task-2" target="_blank" style="color:var(--pos-accent)">github.com/Osama2214/NTI-Task-2</a>');
      } else {
        tLine('Invalid selection. Exited project selector.', 'pos-t-error');
      }
    }

    async function handleContactSelection(choice) {
      activeSubMode = null;
      const cleaned = choice.toLowerCase().trim();
      if (cleaned === 'github') {
        tLine('Opening GitHub profile...', 'pos-t-success');
        window.open('https://github.com/Osama2214', '_blank');
      } else if (cleaned === 'linkedin') {
        tLine('Opening LinkedIn profile...', 'pos-t-success');
        window.open('https://www.linkedin.com/in/osama-ahmed-67127222a', '_blank');
      } else if (cleaned === 'email') {
        tLine('Opening mail client...', 'pos-t-success');
        window.open('mailto:osamaahmed.dev00@gmail.com', '_blank');
      } else {
        tLine('Unknown contact keyword. Exited contact selector.', 'pos-t-error');
      }
    }

    function handleGuessInput(raw) {
      const num = parseInt(raw.trim());
      if (isNaN(num) || num < 1 || num > 100) {
        tLine('Please enter a valid number between 1 and 100.', 'pos-t-error');
        return;
      }
      guessAttempts++;
      if (num === guessTarget) {
        tLine(`[WIN] Correct! Guessed in ${guessAttempts} attempt${guessAttempts > 1 ? 's' : ''}.`, 'pos-t-success');
        tLine('Type "guess" to play again anytime.', 'pos-t-info');
        activeSubMode = null;
      } else if (num < guessTarget) {
        tLine('[^] Too low!  Go higher.', 'pos-t-loading');
      } else {
        tLine('[v] Too high! Go lower.', 'pos-t-loading');
      }
    }

    async function handle(raw) {
      if (typing) return;
      const trimmedRaw = raw.trim();
      tHTML(`<span style="color:var(--pos-accent)">root@portfolio:~$ </span>${raw}`, 'pos-t-prompt');
      if (trimmedRaw) { cmdHistory.unshift(raw); }
      histIdx = 0;

      if (!trimmedRaw) return;
      typing = true;
      inp.disabled = true;

      // Sub-modes first (mirrors the outside terminal)
      if (activeSubMode === 'projects') { await handleProjectsSelection(trimmedRaw); typing = false; inp.disabled = false; inp.focus(); tLine('', ''); return; }
      if (activeSubMode === 'contact')  { await handleContactSelection(trimmedRaw);  typing = false; inp.disabled = false; inp.focus(); tLine('', ''); return; }
      if (activeSubMode === 'guess')    { handleGuessInput(trimmedRaw);              typing = false; inp.disabled = false; inp.focus(); tLine('', ''); return; }

      const args = trimmedRaw.split(' ');
      const cmd = args[0].toLowerCase();

      switch (cmd) {
        case 'help':
          tLine('Available commands:', 'pos-t-info');
          CMDS.forEach(c => tHTML(`  <span style="color:var(--pos-accent)">${c.padEnd(12)}</span><span style="color:var(--pos-text-2)">— ${getCmdDesc(c)}</span>`));
          break;
        case 'about':
          await typeOut("Hi, I'm Osama Ahmed.", 'pos-t-success', 22);
          await typeOut('Backend Developer & 3rd-year IT student at EELU.', 'pos-t-output', 18);
          await typeOut('Built Munjez — a full offline desktop productivity app — solo.', 'pos-t-output', 16);
          await typeOut('Currently mastering ASP.NET Core & PHP/Laravel.', 'pos-t-output', 18);
          await typeOut('Available for Internships ✅', 'pos-t-info', 22);
          break;
        case 'skills':
          tLine('Loading technical stack visualizer...', 'pos-t-loading');
          await progressBar('PHP           ', 10); await sleep(50);
          await progressBar('Laravel       ', 8);  await sleep(50);
          await progressBar('SQL & Database', 8);  await sleep(50);
          await progressBar('Java          ', 6);  await sleep(50);
          await progressBar('HTML & CSS    ', 6);  await sleep(50);
          await progressBar('React         ', 3);
          break;
        case 'projects':
          tLine('1. Munjez            (Productivity Desktop App)');
          tLine('2. Munjez Website    (Marketing & Landing Page)');
          tLine('3. Osama Café        (Coffee Shop Landing Page)');
          tLine('');
          tLine('Choose project number [1-3]:', 'pos-t-info');
          activeSubMode = 'projects';
          break;
        case 'experience':
          tLine('Digital Egypt Pioneers Initiative (DEPI) - Trainee (2026-Present)', 'pos-t-banner');
          tLine('  - Stack: Full Stack .NET (C#, ASP.NET Core, EF, SQL Server)');
          tLine('  - Coverage: Architecture design, soft skills, agile frameworks.');
          tLine('');
          tLine('National Telecommunication Institute (NTI) - Trainee (2026-Present)', 'pos-t-banner');
          tLine('  - Stack: Full Stack PHP (OOP, Laravel MVC, MySQL, Bootstrap)');
          tLine('  - Coverage: Daily bootcamp style project shipping.');
          tLine('');
          tLine('Egyptian E-Learning University (EELU) - B.Sc. IT (2024-2028 Expected)', 'pos-t-banner');
          tLine('  - 3rd Year student focusing on software engineering foundations.');
          break;
        case 'contact':
          tLine('Contact Channels:', 'pos-t-banner');
          tLine('  [email]    - osamaahmed.dev00@gmail.com');
          tLine('  [linkedin] - Osama Ahmed');
          tLine('  [github]   - @Osama2214');
          tLine('');
          tLine('Type target keyword (e.g. github, linkedin, email) to open:', 'pos-t-info');
          activeSubMode = 'contact';
          break;
        case 'cv':
          tLine('Downloading CV...', 'pos-t-loading');
          await progressBar('Osama_Ahmed_CV.pdf', 10, 80);
          tLine('Done ✔', 'pos-t-success');
          window.open('/Osama_Ahmed_CV.pdf', '_blank');
          break;
        case 'social':
          tHTML('LinkedIn: <a href="https://www.linkedin.com/in/osama-ahmed-67127222a" target="_blank" style="color:var(--pos-accent)">Osama Ahmed</a>');
          tHTML('GitHub: <a href="https://github.com/Osama2214" target="_blank" style="color:var(--pos-accent)">@Osama2214</a>');
          break;
        case 'coffee':
          tLine('Grinding Beans...', 'pos-t-loading');
          await progressBar('Grinding', 6, 50);
          tLine('Brewing...', 'pos-t-loading');
          await progressBar('Extraction', 10, 80);
          tLine('    (  )   (  )', 'pos-t-output');
          tLine('     )  )   )  )', 'pos-t-output');
          tLine('    (__(___(___)', 'pos-t-output');
          tLine('    |          | ]', 'pos-t-output');
          tLine('    |          |', 'pos-t-output');
          tLine('    |__________|', 'pos-t-output');
          tLine('☕ Developer Energy +100', 'pos-t-success');
          break;
        case 'hack':
          tLine('Initiating hack sequence...', 'pos-t-loading');
          await sleep(300);
          tLine('Bypassing firewall...', 'pos-t-loading');
          await sleep(250);
          tLine('Injecting payload...', 'pos-t-loading');
          await sleep(300);
          tLine('Decrypting database...', 'pos-t-loading');
          await sleep(400);
          tLine('[ERROR 403] Target is Osama Ahmed. Hack Aborted.', 'pos-t-error');
          tLine('[REASON]   Developer too good to be hacked.', 'pos-t-error');
          break;
        case 'guess':
          guessTarget = Math.floor(Math.random() * 100) + 1;
          guessAttempts = 0;
          tLine('[GAME] Number Guessing — started!', 'pos-t-banner');
          tLine("I'm thinking of a number between 1 and 100.");
          tLine('Type your guess and press Enter:');
          activeSubMode = 'guess';
          break;
        case 'secret':
          if (accessGranted) {
            tLine('[UNLOCKED] Decryption Successful. Secret Document Unlocked:', 'pos-t-success');
            tLine('  - Access Level   : Recruiter Mode (Activated)');
            tLine('  - Special Code   : CHIEF_DEVELOPER_OSAMA_2026');
            tLine('  - Objective      : Hire Osama Ahmed or schedule an interview!');
            tLine('  - Hidden Feature : Try typing "coffee" to fuel up.');
          } else {
            tLine('[DENIED] Access restricted. Insufficient privileges.', 'pos-t-error');
            await sleep(350);
            tLine('  HINT: Only a system administrator can unlock this.', 'pos-t-loading');
            await sleep(350);
            tLine('  HINT: Try running a privileged command... maybe "sudo" something?', 'pos-t-loading');
            await sleep(350);
            tLine('  HINT: The right action might get someone... employed.', 'pos-t-loading');
          }
          break;
        case 'sudo':
          if (args.slice(1).join(' ').toLowerCase() === 'hire osama') {
            accessGranted = true;
            tLine('Access Granted.', 'pos-t-success');
            tLine('Welcome Recruiter.', 'pos-t-success');
          } else {
            tLine('Access Denied', 'pos-t-error');
          }
          break;
        case 'clear':
          out.innerHTML = '';
          tLine('Portfolio OS Terminal v1.0', 'pos-t-banner');
          tLine('──────────────────────────', 'pos-t-banner');
          break;
        default:
          tHTML(`<span style="color:#ef4444">bash: ${cmd}: command not found</span>  (try 'help')`);
      }

      tLine('', '');
      typing = false;
      inp.disabled = false;
      inp.focus();
      ghost.textContent = '';
    }

    function getCmdDesc(c) {
      const d = {
        help:'list commands', about:'a short biography about me', skills:'visual display of my core technical stack',
        projects:'interactive list of my built projects', experience:'educational & scholarship history',
        contact:'channels to reach out or connect with me', cv:'simulates and opens my resume PDF',
        coffee:'energize the terminal developer', social:'quick links to GitHub & LinkedIn',
        clear:'wipes the console history clean', hack:'initiate terminal hack sequence',
        guess:'play a number guessing game', secret:'[LOCKED] you need root access first...',
        sudo:'privileged command'
      };
      return d[c] || '';
    }

    inp.addEventListener('keydown', (e) => {
      if (typing) { e.preventDefault(); return; }

      if (e.key === 'Enter') { handle(inp.value); inp.value = ''; ghost.textContent = ''; }
      if (e.key === 'ArrowUp')   { histIdx = Math.min(histIdx+1, cmdHistory.length-1); inp.value = cmdHistory[histIdx] || ''; updateGhostText(); }
      if (e.key === 'ArrowDown') { histIdx = Math.max(histIdx-1, 0);                   inp.value = cmdHistory[histIdx] || ''; updateGhostText(); }

      if (e.key === 'Tab') {
        e.preventDefault();
        if (activeSubMode !== null) return;
        const val = inp.value;
        if (val) {
          const match = CMDS.find(c => c.startsWith(val.toLowerCase()));
          if (match) { inp.value = match; updateGhostText(); }
        }
      }
    });

    // Auto-focus when window becomes active
    body.closest('.pos-window').addEventListener('mousedown', () => inp.focus(), true);
    setTimeout(() => inp.focus(), 100);
  }

  // ── APP: Projects ─────────────────────────────────────────────
  function buildProjects(body) {
    body.style.overflow = 'hidden';
    body.innerHTML = `
      <div class="pos-explorer" style="height:100%;overflow:hidden">
        <div class="pos-explorer-sidebar">
          <div class="pos-explorer-sidebar-title">Favorites</div>
          <div class="pos-sidebar-item pos-item-active" data-folder="projects">📂 Projects</div>
          <div class="pos-explorer-sidebar-title" style="margin-top:12px">Quick</div>
          <div class="pos-sidebar-item" data-folder="readme">📄 README</div>
          <div class="pos-sidebar-item" data-folder="about">👤 About</div>
        </div>
        <div class="pos-explorer-main" id="posExplorerMain">
          <div class="pos-explorer-path" id="posExplorerPath">📂 Projects/</div>
          <div id="posExplorerContent"></div>
        </div>
      </div>`;

    const mainContent = body.querySelector('#posExplorerContent');
    const pathEl      = body.querySelector('#posExplorerPath');
    const sidebar     = body.querySelector('.pos-explorer-sidebar');

    function showRoot() {
      pathEl.textContent = '📂 Projects/';
      mainContent.innerHTML = '';
      const grid = document.createElement('div');
      grid.className = 'pos-file-grid';
      PROJECTS.forEach(p => {
        const item = document.createElement('button');
        item.className = 'pos-file-item';
        item.innerHTML = `<span class="pos-file-item-icon">${p.icon}</span><span class="pos-file-item-name">${p.name}</span>`;
        item.addEventListener('click', () => showProject(p));
        grid.appendChild(item);
      });
      mainContent.appendChild(grid);
    }

    function showProject(p) {
      pathEl.textContent = `📂 Projects / ${p.name}/`;
      mainContent.innerHTML = '';

      const back = document.createElement('button');
      back.className = 'pos-back-btn';
      back.innerHTML = '← Back';
      back.addEventListener('click', showRoot);
      mainContent.appendChild(back);

      const techTags = (p.tech || []).map(t =>
        `<span style="display:inline-flex;align-items:center;padding:2px 8px;background:var(--pos-control-bg);border:1px solid var(--pos-border);border-radius:4px;font-size:11px;color:var(--pos-accent);font-family:'JetBrains Mono',monospace">${t}</span>`
      ).join('');

      const detail = document.createElement('div');
      detail.className = 'pos-file-detail';
      detail.innerHTML = `
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">
          <span style="font-size:28px">${p.icon}</span>
          <div>
            <h3 style="margin:0;font-size:16px;color:var(--pos-text)">${p.name}</h3>
            <span style="font-size:11px;color:var(--pos-text-2)">${p.type || ''}</span>
          </div>
          ${p.badge ? `<span style="margin-left:auto;padding:2px 8px;background:var(--pos-control-bg-h);border:1px solid var(--pos-border);border-radius:12px;font-size:10px;font-weight:600;color:var(--pos-accent);white-space:nowrap">${p.badge}</span>` : ''}
        </div>
        <p style="margin:0 0 14px">${p.desc}</p>
        ${techTags ? `<div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:16px">${techTags}</div>` : ''}
        <div class="pos-file-detail-links">
          ${p.live ? `<a href="${p.live}" target="_blank" class="pos-file-detail-link pos-link-primary">🌐 Live Demo</a>` : ''}
          ${p.github ? `<a href="${p.github}" target="_blank" class="pos-file-detail-link pos-link-secondary">🐙 GitHub</a>` : ''}
        </div>`;
      mainContent.appendChild(detail);
    }

    function showReadme() {
      pathEl.textContent = '📄 README.md';
      mainContent.innerHTML = '';
      const back = document.createElement('button');
      back.className = 'pos-back-btn';
      back.innerHTML = '← Back';
      back.addEventListener('click', () => { showRoot(); sidebar.querySelector('[data-folder="projects"]').click(); });
      mainContent.appendChild(back);
      const d = document.createElement('div');
      d.className = 'pos-file-detail';
      d.innerHTML = `
        <h3>📄 README.md</h3>
        <p style="font-family:JetBrains Mono,monospace;font-size:12px;line-height:1.9;color:var(--pos-text)">
          <strong style="color:var(--pos-accent)"># Osama Ahmed — Portfolio</strong><br><br>
          Backend Developer & 3rd-year IT student at EELU 🇪🇬<br>
          Currently mastering ASP.NET Core & PHP/Laravel<br><br>
          <strong style="color:var(--pos-accent)">## Projects</strong><br>
          - Munjez (React · TypeScript · Tauri · Rust)<br>
          - Munjez Website (HTML · CSS · JS)<br>
          - Osama Café (HTML5 · CSS3 · JS)<br><br>
          <strong style="color:var(--pos-accent)">## Contact</strong><br>
          osamaahmed.dev00@gmail.com
        </p>`;
      mainContent.appendChild(d);
    }

    function showAbout() {
      pathEl.textContent = '👤 About Osama';
      mainContent.innerHTML = '';
      const back = document.createElement('button');
      back.className = 'pos-back-btn';
      back.innerHTML = '← Back';
      back.addEventListener('click', showRoot);
      mainContent.appendChild(back);
      const d = document.createElement('div');
      d.className = 'pos-file-detail';
      d.innerHTML = `
        <h3>👤 Osama Ahmed</h3>
        <p>3rd-year IT student at EELU, Egypt. Passionate about building real software from scratch.
        Built Munjez — a full offline productivity desktop app — solo. Currently mastering
        <strong>ASP.NET Core</strong> & <strong>PHP/Laravel</strong>, seeking an internship to grow.</p>
        <div class="pos-file-detail-links">
          <a href="https://github.com/Osama2214" target="_blank" class="pos-file-detail-link pos-link-secondary">🐙 GitHub</a>
          <a href="https://www.linkedin.com/in/osama-ahmed-67127222a" target="_blank" class="pos-file-detail-link pos-link-secondary">💼 LinkedIn</a>
        </div>`;
      mainContent.appendChild(d);
    }

    sidebar.addEventListener('click', (e) => {
      const item = e.target.closest('.pos-sidebar-item');
      if (!item) return;
      sidebar.querySelectorAll('.pos-sidebar-item').forEach(s => s.classList.remove('pos-item-active'));
      item.classList.add('pos-item-active');
      const folder = item.dataset.folder;
      if (folder === 'projects') showRoot();
      if (folder === 'readme')   showReadme();
      if (folder === 'about')    showAbout();
    });

    showRoot();
  }

  // ── APP: Resume ───────────────────────────────────────────────
  function buildResume(body) {
    body.innerHTML = `
      <div class="pos-resume" style="height:100%">
        <div class="pos-resume-toolbar">
          <span class="pos-resume-toolbar-title">📄 Osama_Ahmed_CV.pdf</span>
          <div class="pos-resume-toolbar-actions">
            <a href="/Osama_Ahmed_CV.pdf" target="_blank" class="pos-toolbar-btn">↗ Open in Tab</a>
            <a href="/Osama_Ahmed_CV.pdf" download class="pos-toolbar-btn">⬇ Download</a>
          </div>
        </div>
        <div class="pos-resume-iframe-wrap">
          <iframe src="/Osama_Ahmed_CV.pdf" title="Osama Ahmed CV"></iframe>
        </div>
      </div>`;
    const toolbarButtons = body.querySelectorAll('.pos-toolbar-btn');
    if (toolbarButtons[0]) toolbarButtons[0].innerHTML = `${POS_ICONS.external}<span>Open in Tab</span>`;
    if (toolbarButtons[1]) toolbarButtons[1].innerHTML = `${POS_ICONS.download}<span>Download</span>`;
  }

  // ── APP: Browser ──────────────────────────────────────────────
  function buildBrowser(body) {
    const pageURL = window.location.href;
    body.innerHTML = `
      <div class="pos-browser" style="height:100%">
        <div class="pos-browser-bar">
          <button class="pos-browser-nav-btn" id="posBrowserReload" title="Reload">↺</button>
          <div class="pos-browser-url">
            <span class="pos-browser-url-lock">🔒</span>
            <span>${pageURL}</span>
          </div>
          <a href="${pageURL}" target="_blank" class="pos-browser-nav-btn" title="Open in new tab">↗</a>
        </div>
        <div class="pos-browser-iframe-wrap">
          <iframe id="posBrowserIframe" src="${pageURL}" title="Portfolio Browser" sandbox="allow-scripts allow-same-origin allow-forms"></iframe>
        </div>
      </div>`;

    const iframe = body.querySelector('#posBrowserIframe');
    body.querySelector('#posBrowserReload').addEventListener('click', () => {
      iframe.src = iframe.src;
    });
  }

  // ── APP: Settings ─────────────────────────────────────────────
  function buildSettings(body) {
    body.style.overflow = 'auto';
    const themeLabels = { 'site-purple': 'Site Purple', 'cyan-blue': 'Cyan Blue', 'deep-violet': 'Deep Violet' };
    body.innerHTML = `
      <div class="pos-settings">
        <div class="pos-settings-section-title">System</div>

        <div class="pos-setting-row">
          <div class="pos-setting-row-info">
            <div class="pos-setting-row-label">Particles</div>
            <div class="pos-setting-row-sub">Background particle animation</div>
          </div>
          <label class="pos-toggle">
            <input type="checkbox" id="posParticlesToggle" ${particlesEnabled ? 'checked' : ''} />
            <span class="pos-toggle-track"></span>
          </label>
        </div>

        <div class="pos-setting-row">
          <div class="pos-setting-row-info">
            <div class="pos-setting-row-label">Ambient Music</div>
            <div class="pos-setting-row-sub">Background OS ambiance</div>
          </div>
          <label class="pos-toggle">
            <input type="checkbox" id="posMusicToggle" ${musicEnabled ? 'checked' : ''} />
            <span class="pos-toggle-track"></span>
          </label>
        </div>

        <div class="pos-setting-row">
          <div class="pos-setting-row-info">
            <div class="pos-setting-row-label">Theme</div>
            <div class="pos-setting-row-sub">Desktop color scheme</div>
          </div>
          <div class="pos-custom-select" id="posThemeSelect" data-value="${osTheme}">
            <button class="pos-custom-select-btn" type="button" aria-haspopup="listbox" aria-expanded="false">
              <span>${themeLabels[osTheme]}</span>
            </button>
            <div class="pos-custom-select-menu" role="listbox">
              <button class="pos-custom-option ${osTheme==='site-purple' ? 'pos-option-active' : ''}" type="button" data-value="site-purple" role="option">Site Purple</button>
              <button class="pos-custom-option ${osTheme==='cyan-blue' ? 'pos-option-active' : ''}" type="button" data-value="cyan-blue" role="option">Cyan Blue</button>
              <button class="pos-custom-option ${osTheme==='deep-violet' ? 'pos-option-active' : ''}" type="button" data-value="deep-violet" role="option">Deep Violet</button>
            </div>
          </div>
        </div>

        <div class="pos-settings-divider"></div>
        <div class="pos-settings-section-title">About</div>
        <div class="pos-setting-row pos-about-row" id="posAboutRow" style="cursor:pointer;user-select:none;">
          <div class="pos-setting-row-info">
            <div class="pos-setting-row-label">Portfolio OS</div>
            <div class="pos-setting-row-sub" id="posVersionSub">Version 1.0.0 — Built by Osama Ahmed</div>
          </div>
        </div>

        <div class="pos-settings-divider"></div>
        <button class="pos-settings-shutdown" id="posSettingsShutdown">
          ⏻  Shutdown Portfolio OS
        </button>
      </div>`;

    // Particles toggle
    body.querySelector('#posParticlesToggle').addEventListener('change', function () {
      particlesEnabled = this.checked;
      // Try to pause/resume the main site's canvas
      const canvas = document.getElementById('particles');
      if (canvas) canvas.style.opacity = particlesEnabled ? '1' : '0';
    });

    // Music toggle
    body.querySelector('#posMusicToggle').addEventListener('change', async function () {
      musicEnabled = this.checked;
      if (musicEnabled) {
        const started = await startAmbientMusic();
        if (!started) {
          musicEnabled = false;
          this.checked = false;
        }
      } else {
        stopAmbientMusic();
      }
    });

    setupSettingsSelect(body.querySelector('#posThemeSelect'), (value) => {
      applyOsTheme(value);
    });

    // Shutdown
    body.querySelector('#posSettingsShutdown').addEventListener('click', () => triggerShutdown());

    // Version easter egg — click 5x to unlock
    const aboutRow = body.querySelector('#posAboutRow');
    const versionSub = body.querySelector('#posVersionSub');
    if (aboutRow && versionSub) {
      let clicks = 0;
      let clickTimer;
      const originalText = versionSub.textContent;
      const hints = ['Again?', 'Keep going...', 'Almost there...', 'One more...'];

      aboutRow.addEventListener('click', () => {
        clicks++;
        clearTimeout(clickTimer);
        clickTimer = setTimeout(() => { clicks = 0; }, 1800);

        aboutRow.animate(
          [{ transform: 'scale(1)' }, { transform: 'scale(0.98)' }, { transform: 'scale(1)' }],
          { duration: 220, easing: 'ease-out' }
        );

        if (clicks < 5) {
          versionSub.textContent = hints[clicks - 1] || originalText;
          return;
        }

        // Unlocked!
        clicks = 0;
        versionSub.textContent = 'Version 1.0.0 — Made with ☕, 🔥 and way too little sleep';
        aboutRow.classList.add('pos-about-unlocked');
        setTimeout(() => aboutRow.classList.remove('pos-about-unlocked'), 900);
        setTimeout(() => { versionSub.textContent = originalText; }, 5000);

        if (typeof window.easterShowToast === 'function') {
          window.easterShowToast('🎉 Achievement Unlocked: Curious Clicker!', 4000);
        }

        // Confetti burst inside the settings panel
        const panel = body.querySelector('.pos-settings') || body;
        const rowRect = aboutRow.getBoundingClientRect();
        const panelRect = panel.getBoundingClientRect();
        const originX = rowRect.left - panelRect.left + rowRect.width / 2;
        const originY = rowRect.top - panelRect.top + rowRect.height / 2;
        const colors = ['#a78bfa', '#7c3aed', '#c4b5fd', '#f472b6', '#38bdf8'];

        for (let i = 0; i < 22; i++) {
          const bit = document.createElement('span');
          const angle = Math.random() * Math.PI * 2;
          const dist = 60 + Math.random() * 90;
          const dx = Math.cos(angle) * dist;
          const dy = Math.sin(angle) * dist;
          const size = 4 + Math.random() * 5;
          bit.style.cssText = `
            position: absolute;
            left: ${originX}px;
            top: ${originY}px;
            width: ${size}px;
            height: ${size}px;
            background: ${colors[i % colors.length]};
            border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
            pointer-events: none;
            z-index: 9999;
            opacity: 1;
          `;
          panel.style.position = panel.style.position || 'relative';
          panel.appendChild(bit);
          bit.animate(
            [
              { transform: 'translate(0,0) rotate(0deg)', opacity: 1 },
              { transform: `translate(${dx}px, ${dy}px) rotate(${Math.random() * 360}deg)`, opacity: 0 }
            ],
            { duration: 700 + Math.random() * 400, easing: 'cubic-bezier(0.2,0.8,0.2,1)' }
          ).onfinish = () => bit.remove();
        }
      });
    }
  }

  function setupSettingsSelect(selectEl, onChange) {
    if (!selectEl) return;

    const trigger = selectEl.querySelector('.pos-custom-select-btn');
    const options = selectEl.querySelectorAll('.pos-custom-option');
    const settingsPanel = selectEl.closest('.pos-settings');

    function closeSelect() {
      selectEl.classList.remove('pos-select-open');
      trigger.setAttribute('aria-expanded', 'false');
    }

    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      document.querySelectorAll('.pos-custom-select.pos-select-open').forEach(el => {
        if (el !== selectEl) {
          el.classList.remove('pos-select-open');
          const btn = el.querySelector('.pos-custom-select-btn');
          if (btn) btn.setAttribute('aria-expanded', 'false');
        }
      });
      const isOpen = selectEl.classList.toggle('pos-select-open');
      trigger.setAttribute('aria-expanded', String(isOpen));
    });

    options.forEach(option => {
      option.addEventListener('click', (e) => {
        e.stopPropagation();
        const value = option.dataset.value;
        selectEl.dataset.value = value;
        trigger.querySelector('span').textContent = option.textContent;
        options.forEach(o => o.classList.toggle('pos-option-active', o === option));
        closeSelect();
        onChange(value);
      });
    });

    if (settingsPanel) settingsPanel.addEventListener('click', closeSelect);
  }

  // OS Theme
  function applyOsTheme(theme) {
    osTheme = theme;
    const themes = {
      'site-purple': {
        accent: '#a78bfa',
        accent2: '#06b6d4',
        glow: 'rgba(124,58,237,0.4)',
        dim: 'rgba(124,58,237,0.15)',
        bg: '#050812',
        surface: '#080d1a',
        surface2: '#0c1223',
        header: '#080d1a',
        topbar: 'rgba(3,6,16,0.92)',
        dock: 'rgba(10,14,26,0.7)',
        control: 'rgba(124,58,237,0.08)',
        controlH: 'rgba(124,58,237,0.18)',
        desktop: 'radial-gradient(ellipse at 15% 15%, rgba(124,58,237,0.12) 0%, transparent 45%), radial-gradient(ellipse at 85% 85%, rgba(6,182,212,0.07) 0%, transparent 45%), radial-gradient(ellipse at 50% 100%, rgba(124,58,237,0.05) 0%, transparent 50%), linear-gradient(160deg, #050812 0%, #03060f 100%)'
      },
      'cyan-blue': {
        accent: '#22d3ee',
        accent2: '#38bdf8',
        glow: 'rgba(34,211,238,0.34)',
        dim: 'rgba(34,211,238,0.14)',
        bg: '#031018',
        surface: '#061722',
        surface2: '#082132',
        header: '#061724',
        topbar: 'rgba(2,16,24,0.92)',
        dock: 'rgba(4,24,34,0.72)',
        control: 'rgba(34,211,238,0.08)',
        controlH: 'rgba(34,211,238,0.18)',
        desktop: 'radial-gradient(ellipse at 18% 18%, rgba(34,211,238,0.13) 0%, transparent 44%), radial-gradient(ellipse at 88% 82%, rgba(56,189,248,0.11) 0%, transparent 46%), radial-gradient(ellipse at 50% 100%, rgba(14,165,233,0.08) 0%, transparent 52%), linear-gradient(160deg, #031018 0%, #020812 100%)'
      },
      'deep-violet': {
        accent: '#8b5cf6',
        accent2: '#c084fc',
        glow: 'rgba(139,92,246,0.45)',
        dim: 'rgba(139,92,246,0.18)',
        bg: '#080516',
        surface: '#100a23',
        surface2: '#17102f',
        header: '#100a23',
        topbar: 'rgba(8,5,18,0.93)',
        dock: 'rgba(16,10,35,0.72)',
        control: 'rgba(139,92,246,0.1)',
        controlH: 'rgba(139,92,246,0.22)',
        desktop: 'radial-gradient(ellipse at 16% 16%, rgba(139,92,246,0.17) 0%, transparent 44%), radial-gradient(ellipse at 86% 78%, rgba(192,132,252,0.11) 0%, transparent 45%), radial-gradient(ellipse at 50% 100%, rgba(91,33,182,0.10) 0%, transparent 52%), linear-gradient(160deg, #080516 0%, #03020a 100%)'
      },
    };
    const t = themes[theme] || themes['site-purple'];
    const r = document.documentElement;
    r.style.setProperty('--pos-accent',     t.accent);
    r.style.setProperty('--pos-accent-2',   t.accent2);
    r.style.setProperty('--pos-accent-glow', t.glow);
    r.style.setProperty('--pos-accent-dim',  t.dim);
    r.style.setProperty('--pos-bg',          t.bg);
    r.style.setProperty('--pos-surface',     t.surface);
    r.style.setProperty('--pos-surface-2',   t.surface2);
    r.style.setProperty('--pos-win-header',  t.header);
    r.style.setProperty('--pos-topbar-bg',   t.topbar);
    r.style.setProperty('--pos-dock-bg',     t.dock);
    r.style.setProperty('--pos-control-bg',  t.control);
    r.style.setProperty('--pos-control-bg-h', t.controlH);
    r.style.setProperty('--pos-desktop-bg',  t.desktop);
    r.style.setProperty('--pos-border',     `rgba(${hexToRgb(t.accent)},0.18)`);
    r.style.setProperty('--pos-border-2',   `rgba(${hexToRgb(t.accent)},0.08)`);
  }

  function hexToRgb(hex) {
    const r = parseInt(hex.slice(1,3),16);
    const g = parseInt(hex.slice(3,5),16);
    const b = parseInt(hex.slice(5,7),16);
    return `${r},${g},${b}`;
  }

  // ── APP: Contact ──────────────────────────────────────────────
  function buildContact(body) {
    body.style.overflow = 'auto';
    body.innerHTML = `
      <div class="pos-contact">
        <div class="pos-contact-header">
          <div class="pos-contact-avatar">👨‍💻</div>
          <div>
            <div class="pos-contact-name">Osama Ahmed</div>
            <div class="pos-contact-title-text">Backend Dev & IT Student at EELU</div>
          </div>
        </div>

        <a href="https://github.com/Osama2214" target="_blank" class="pos-contact-link">
          <div class="pos-contact-link-icon" style="background:rgba(255,255,255,0.04)">🐙</div>
          <div>
            <div class="pos-contact-link-text">GitHub</div>
            <div class="pos-contact-link-sub">github.com/Osama2214</div>
          </div>
          <span class="pos-contact-link-arrow">→</span>
        </a>

        <a href="https://www.linkedin.com/in/osama-ahmed-67127222a" target="_blank" class="pos-contact-link">
          <div class="pos-contact-link-icon" style="background:rgba(10,102,194,0.15)">💼</div>
          <div>
            <div class="pos-contact-link-text">LinkedIn</div>
            <div class="pos-contact-link-sub">linkedin.com/in/osama-ahmed-67127222a</div>
          </div>
          <span class="pos-contact-link-arrow">→</span>
        </a>

        <a href="mailto:osamaahmed.dev00@gmail.com" class="pos-contact-link">
          <div class="pos-contact-link-icon" style="background:rgba(239,68,68,0.1)">📧</div>
          <div>
            <div class="pos-contact-link-text">Email</div>
            <div class="pos-contact-link-sub">osamaahmed.dev00@gmail.com</div>
          </div>
          <span class="pos-contact-link-arrow">→</span>
        </a>
      </div>`;
  }

  // ── APP: Trash ─────────────────────────────────────────────────
  function buildTrash(body) {
    body.style.overflow = 'hidden';
    body.innerHTML = `
      <div class="pos-trash">
        <div class="pos-trash-icon" id="posTrashIcon">🗑️</div>
        <div class="pos-trash-text">Trash is empty</div>
        <div class="pos-trash-sub">Nothing to delete here... yet.<br>Your regrets are safe 😏</div>
        <button class="pos-trash-empty-btn" id="posEmptyTrash">🗑 Empty Trash</button>
      </div>`;

    body.querySelector('#posEmptyTrash').addEventListener('click', () => {
      const icon = body.querySelector('#posTrashIcon');
      icon.style.transform = 'scale(1.3) rotate(-10deg)';
      setTimeout(() => {
        icon.style.transform = '';
        icon.textContent = '✨';
        body.querySelector('.pos-trash-text').textContent = 'Trash emptied!';
        body.querySelector('.pos-trash-sub').textContent  = 'All your regrets are gone. Fresh start!';
      }, 300);
    });
  }

  // ── APP: Games (launcher) ──────────────────────────────────────
  const GAMES_LIST = [
    { id: 'snake',  icon: '🐍', name: 'Snake' },
    { id: 'xo',     icon: '❌', name: 'Tic-Tac-Toe' },
    { id: 'flappy', icon: '🐦', name: 'Flappy Bird' },
  ];
  function buildGames(body) {
    body.style.overflow = 'hidden';
    body.innerHTML = `
      <div style="padding:18px">
        <div class="pos-file-grid" id="posGamesGrid"></div>
      </div>`;

    const grid = body.querySelector('#posGamesGrid');
    GAMES_LIST.forEach(g => {
      const item = document.createElement('button');
      item.className = 'pos-file-item';
      item.innerHTML = `<span class="pos-file-item-icon">${g.icon}</span><span class="pos-file-item-name">${g.name}</span>`;
      item.addEventListener('click', () => openApp(g.id));
      grid.appendChild(item);
    });
  }

  // ── APP: Snake ───────────────────────────────────────────────
  const SNAKE_BEST_KEY = 'portfolio-os-snake-best';
  function buildGame(body) {
    body.style.overflow = 'hidden';
    body.innerHTML = `
      <div class="pos-game">
        <div class="pos-game-hud">
          <div class="pos-game-stat">SCORE <span id="posGameScore">0</span></div>
          <div class="pos-game-stat">BEST <span id="posGameBest">0</span></div>
          <button class="pos-game-restart" id="posGameRestart" type="button" title="Restart">⟲</button>
        </div>
        <div class="pos-game-board-area">
          <div class="pos-game-board-wrap">
            <canvas id="posGameCanvas" width="360" height="360"></canvas>
            <div class="pos-game-overlay" id="posGameOverlay">
              <div class="pos-game-overlay-title">🐍 Snake</div>
              <div class="pos-game-overlay-sub" id="posGameOverlaySub">Arrow Keys or WASD to move</div>
              <button class="pos-game-overlay-btn" id="posGameStartBtn" type="button">Press to Start</button>
            </div>
          </div>
        </div>
        <div class="pos-game-hint">Move: Arrows / WASD &nbsp;·&nbsp; Pause: Space</div>
      </div>`;

    const winEl     = body.closest('.pos-window');
    const boardArea = body.querySelector('.pos-game-board-area');
    const boardWrap = body.querySelector('.pos-game-board-wrap');
    const canvas    = body.querySelector('#posGameCanvas');
    const ctx       = canvas.getContext('2d');
    const scoreEl   = body.querySelector('#posGameScore');
    const bestEl    = body.querySelector('#posGameBest');
    const overlay   = body.querySelector('#posGameOverlay');
    const overlaySub= body.querySelector('#posGameOverlaySub');
    const startBtn  = body.querySelector('#posGameStartBtn');
    const restartBtn= body.querySelector('#posGameRestart');

    const COLS = 18, ROWS = 18;
    const START_SPEED = 130, MIN_SPEED = 70;
    let CELL = canvas.width / COLS;

    function resizeBoard() {
      if (!winEl.isConnected) { boardResizeObserver.disconnect(); return; }
      const size = Math.max(160, Math.floor(Math.min(boardArea.clientWidth, boardArea.clientHeight)));
      if (size === canvas.width) return;
      boardWrap.style.width  = size + 'px';
      boardWrap.style.height = size + 'px';
      canvas.width  = size;
      canvas.height = size;
      CELL = canvas.width / COLS;
      draw();
    }
    const boardResizeObserver = new ResizeObserver(resizeBoard);
    boardResizeObserver.observe(boardArea);
    winEl.addEventListener('pos-win-resize', resizeBoard);

    let snake, dir, nextDir, food, score, best, speed, running, paused, tickTimer;

    function loadBest() {
      try { return parseInt(localStorage.getItem(SNAKE_BEST_KEY), 10) || 0; }
      catch (err) { return 0; }
    }
    function saveBest(v) {
      try { localStorage.setItem(SNAKE_BEST_KEY, String(v)); } catch (err) {}
    }

    function placeFood() {
      let pos;
      do {
        pos = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) };
      } while (snake.some(s => s.x === pos.x && s.y === pos.y));
      food = pos;
    }

    function resetGame() {
      snake = [{ x: 8, y: 9 }, { x: 7, y: 9 }, { x: 6, y: 9 }];
      dir = { x: 1, y: 0 };
      nextDir = { x: 1, y: 0 };
      score = 0;
      speed = START_SPEED;
      running = false;
      paused = false;
      scoreEl.textContent = '0';
      placeFood();
      draw();
    }

    function startGame() {
      resetGame();
      running = true;
      overlay.classList.remove('pos-game-overlay-visible');
      clearInterval(tickTimer);
      tickTimer = setInterval(tick, speed);
    }

    function stopLoop() {
      clearInterval(tickTimer);
      running = false;
    }

    function gameOver() {
      stopLoop();
      const isNewBest = score > best;
      if (isNewBest) { best = score; saveBest(best); bestEl.textContent = String(best); }
      overlaySub.innerHTML = `Score: <b>${score}</b>${isNewBest ? ' &mdash; <span class="pos-game-newbest">New Best!</span>' : ''}`;
      body.querySelector('.pos-game-overlay-title').textContent = 'Game Over';
      startBtn.textContent = 'Play Again';
      overlay.classList.add('pos-game-overlay-visible');
    }

    function togglePause() {
      if (!running) return;
      paused = !paused;
      if (paused) {
        clearInterval(tickTimer);
        body.querySelector('.pos-game-overlay-title').textContent = 'Paused';
        overlaySub.textContent = `Score: ${score}`;
        startBtn.textContent = 'Resume';
        overlay.classList.add('pos-game-overlay-visible');
      } else {
        overlay.classList.remove('pos-game-overlay-visible');
        tickTimer = setInterval(tick, speed);
      }
    }

    function tick() {
      // Auto-cleanup once this window's DOM is gone
      if (!canvas.isConnected) { clearInterval(tickTimer); return; }

      dir = nextDir;
      const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };

      if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS ||
          snake.some(s => s.x === head.x && s.y === head.y)) {
        gameOver();
        return;
      }

      snake.unshift(head);

      if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreEl.textContent = String(score);
        placeFood();
        speed = Math.max(MIN_SPEED, START_SPEED - Math.floor(score / 50) * 6);
        clearInterval(tickTimer);
        tickTimer = setInterval(tick, speed);
      } else {
        snake.pop();
      }

      draw();
    }

    function draw() {
      if (!snake || !food) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Board
      ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--pos-surface-2') || '#0c1223';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Food
      const accent2 = getComputedStyle(document.documentElement).getPropertyValue('--pos-accent-2').trim() || '#06b6d4';
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(food.x * CELL + CELL / 2, food.y * CELL + CELL / 2, CELL / 2.6, 0, Math.PI * 2);
      ctx.fill();

      // Snake
      const accent = getComputedStyle(document.documentElement).getPropertyValue('--pos-accent').trim() || '#a78bfa';
      snake.forEach((s, i) => {
        ctx.fillStyle = i === 0 ? accent2 : accent;
        ctx.globalAlpha = i === 0 ? 1 : Math.max(0.45, 1 - i * 0.03);
        ctx.fillRect(s.x * CELL + 1, s.y * CELL + 1, CELL - 2, CELL - 2);
      });
      ctx.globalAlpha = 1;
    }

    function setDirection(dx, dy) {
      if (!running || paused) return;
      // Ignore reversal onto the snake's own neck
      if (dir.x === -dx && dir.y === -dy) return;
      nextDir = { x: dx, y: dy };
    }

    function onKeyDown(e) {
      if (!winEl.isConnected) { document.removeEventListener('keydown', onKeyDown); return; }
      if (!winEl.classList.contains('pos-win-focused')) return;

      switch (e.key) {
        case 'ArrowUp': case 'w': case 'W': e.preventDefault(); setDirection(0, -1); break;
        case 'ArrowDown': case 's': case 'S': e.preventDefault(); setDirection(0, 1); break;
        case 'ArrowLeft': case 'a': case 'A': e.preventDefault(); setDirection(-1, 0); break;
        case 'ArrowRight': case 'd': case 'D': e.preventDefault(); setDirection(1, 0); break;
        case ' ': e.preventDefault(); togglePause(); break;
      }
    }

    document.addEventListener('keydown', onKeyDown);
    startBtn.addEventListener('click', startGame);
    restartBtn.addEventListener('click', startGame);

    best = loadBest();
    bestEl.textContent = String(best);
    resetGame();
    overlay.classList.add('pos-game-overlay-visible');
  }

  // ── APP: Tic-Tac-Toe ─────────────────────────────────────────
  const XO_SCORE_KEY = 'portfolio-os-xo-score';
  function buildXO(body) {
    body.style.overflow = 'hidden';
    body.innerHTML = `
      <div class="pos-xo">
        <div class="pos-xo-hud">
          <div class="pos-xo-score-box"><span class="pos-xo-score-label pos-xo-label-x">X</span><span id="posXoScoreX">0</span></div>
          <div class="pos-xo-score-box"><span class="pos-xo-score-label">Draws</span><span id="posXoScoreD">0</span></div>
          <div class="pos-xo-score-box"><span class="pos-xo-score-label pos-xo-label-o">O</span><span id="posXoScoreO">0</span></div>
        </div>
        <div class="pos-xo-modebar">
          <button class="pos-xo-mode-btn pos-xo-mode-active" data-mode="cpu" type="button">vs Computer</button>
          <button class="pos-xo-mode-btn" data-mode="2p" type="button">2 Player</button>
        </div>
        <div class="pos-xo-status" id="posXoStatus">Your turn — X</div>
        <div class="pos-xo-board" id="posXoBoard"></div>
        <button class="pos-xo-restart" id="posXoRestart" type="button">⟲ New Round</button>
      </div>`;

    const boardEl    = body.querySelector('#posXoBoard');
    const statusEl   = body.querySelector('#posXoStatus');
    const modeBtns   = body.querySelectorAll('.pos-xo-mode-btn');
    const restartBtn = body.querySelector('#posXoRestart');
    const scoreXEl   = body.querySelector('#posXoScoreX');
    const scoreOEl   = body.querySelector('#posXoScoreO');
    const scoreDEl   = body.querySelector('#posXoScoreD');

    const LINES = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];

    let mode = 'cpu';
    let board, current, over, scores;

    function loadScores() {
      try { return JSON.parse(localStorage.getItem(XO_SCORE_KEY)) || { x: 0, o: 0, draw: 0 }; }
      catch (err) { return { x: 0, o: 0, draw: 0 }; }
    }
    function saveScores() {
      try { localStorage.setItem(XO_SCORE_KEY, JSON.stringify(scores)); } catch (err) {}
    }
    function renderScores() {
      scoreXEl.textContent = String(scores.x);
      scoreOEl.textContent = String(scores.o);
      scoreDEl.textContent = String(scores.draw);
    }

    function cellEl(i) { return boardEl.children[i]; }

    function buildBoardDOM() {
      boardEl.innerHTML = '';
      const frag = document.createDocumentFragment();
      for (let i = 0; i < 9; i++) {
        const c = document.createElement('button');
        c.type = 'button';
        c.className = 'pos-xo-cell';
        c.dataset.i = i;
        frag.appendChild(c);
      }
      boardEl.appendChild(frag);
    }

    function checkResult(b) {
      for (const line of LINES) {
        const [a, b1, c] = line;
        if (b[a] && b[a] === b[b1] && b[a] === b[c]) return { winner: b[a], line };
      }
      if (b.every(v => v)) return { winner: 'draw', line: null };
      return null;
    }

    function minimax(b, depth, isMax) {
      const res = checkResult(b);
      if (res) {
        if (res.winner === 'O') return 10 - depth;
        if (res.winner === 'X') return depth - 10;
        return 0;
      }
      if (isMax) {
        let best = -Infinity;
        for (let i = 0; i < 9; i++) if (!b[i]) { b[i] = 'O'; best = Math.max(best, minimax(b, depth + 1, false)); b[i] = null; }
        return best;
      } else {
        let best = Infinity;
        for (let i = 0; i < 9; i++) if (!b[i]) { b[i] = 'X'; best = Math.min(best, minimax(b, depth + 1, true)); b[i] = null; }
        return best;
      }
    }

    function computerMove() {
      let bestScore = -Infinity, move = -1;
      for (let i = 0; i < 9; i++) if (!board[i]) {
        board[i] = 'O';
        const score = minimax(board, 0, false);
        board[i] = null;
        if (score > bestScore) { bestScore = score; move = i; }
      }
      if (move !== -1) placeMark(move, 'O');
    }

    function updateStatus() {
      if (over) return;
      statusEl.textContent = mode === 'cpu'
        ? (current === 'X' ? 'Your turn — X' : 'Computer is thinking...')
        : `Player ${current}'s turn`;
    }

    function disableBoard() {
      Array.from(boardEl.children).forEach(c => c.disabled = true);
    }

    function placeMark(i, mark) {
      if (over || board[i]) return;
      board[i] = mark;
      const el = cellEl(i);
      el.textContent = mark;
      el.classList.add('pos-xo-mark', mark === 'X' ? 'pos-xo-x' : 'pos-xo-o');
      el.disabled = true;

      const res = checkResult(board);
      if (res) {
        over = true;
        if (res.winner === 'draw') {
          scores.draw++;
          statusEl.textContent = "It's a draw!";
        } else {
          scores[res.winner.toLowerCase()]++;
          statusEl.textContent = mode === 'cpu'
            ? (res.winner === 'X' ? 'You win! 🎉' : 'Computer wins!')
            : `Player ${res.winner} wins! 🎉`;
          res.line.forEach(idx => cellEl(idx).classList.add('pos-xo-win-cell'));
        }
        saveScores();
        renderScores();
        disableBoard();
        return;
      }

      current = current === 'X' ? 'O' : 'X';
      updateStatus();

      if (!over && mode === 'cpu' && current === 'O') {
        boardEl.classList.add('pos-xo-board-disabled');
        setTimeout(() => {
          if (!boardEl.isConnected) return;
          computerMove();
          boardEl.classList.remove('pos-xo-board-disabled');
        }, 450);
      }
    }

    function newRound() {
      board = Array(9).fill(null);
      current = 'X';
      over = false;
      boardEl.classList.remove('pos-xo-board-disabled');
      buildBoardDOM();
      updateStatus();
    }

    boardEl.addEventListener('click', (e) => {
      const cell = e.target.closest('.pos-xo-cell');
      if (!cell || over) return;
      if (mode === 'cpu' && current !== 'X') return;
      placeMark(parseInt(cell.dataset.i, 10), current);
    });

    modeBtns.forEach(b => b.addEventListener('click', () => {
      mode = b.dataset.mode;
      modeBtns.forEach(x => x.classList.toggle('pos-xo-mode-active', x === b));
      newRound();
    }));

    restartBtn.addEventListener('click', newRound);

    scores = loadScores();
    renderScores();
    newRound();
  }

  // ── APP: Flappy Bird ─────────────────────────────────────────
  const FLAPPY_BEST_KEY = 'portfolio-os-flappy-best';
  function buildFlappy(body) {
    body.style.overflow = 'hidden';
    body.innerHTML = `
      <div class="pos-game">
        <div class="pos-game-hud">
          <div class="pos-game-stat">SCORE <span id="posFlapScore">0</span></div>
          <div class="pos-game-stat">BEST <span id="posFlapBest">0</span></div>
          <button class="pos-game-restart" id="posFlapRestart" type="button" title="Restart">⟲</button>
        </div>
        <div class="pos-game-board-area">
          <div class="pos-game-board-wrap" id="posFlapWrap">
            <canvas id="posFlapCanvas" width="320" height="480"></canvas>
            <div class="pos-game-overlay" id="posFlapOverlay">
              <div class="pos-game-overlay-title">🐦 Flappy</div>
              <div class="pos-game-overlay-sub" id="posFlapOverlaySub">Space / Click to flap</div>
              <button class="pos-game-overlay-btn" id="posFlapStartBtn" type="button">Press to Start</button>
            </div>
          </div>
        </div>
        <div class="pos-game-hint">Flap: Space / Click / Tap</div>
      </div>`;

    const winEl        = body.closest('.pos-window');
    const boardArea    = body.querySelector('.pos-game-board-area');
    const boardWrap     = body.querySelector('#posFlapWrap');
    const canvas        = body.querySelector('#posFlapCanvas');
    const ctx            = canvas.getContext('2d');
    const scoreEl        = body.querySelector('#posFlapScore');
    const bestEl         = body.querySelector('#posFlapBest');
    const overlay        = body.querySelector('#posFlapOverlay');
    const overlaySub     = body.querySelector('#posFlapOverlaySub');
    const overlayTitle   = body.querySelector('.pos-game-overlay-title');
    const startBtn       = body.querySelector('#posFlapStartBtn');
    const restartBtn     = body.querySelector('#posFlapRestart');

    const BASE_W = 320, BASE_H = 480;
    const GRAVITY = 1500, FLAP_V = -380, PIPE_SPEED = 150, PIPE_GAP = 130, PIPE_W = 52, PIPE_INTERVAL = 1.5, BIRD_R = 13, BIRD_X = 70, GROUND_H = 24;

    let bird, pipes, score, best, state, spawnTimer, rafId, lastTs;

    function loadBest() {
      try { return parseInt(localStorage.getItem(FLAPPY_BEST_KEY), 10) || 0; }
      catch (err) { return 0; }
    }
    function saveBest(v) {
      try { localStorage.setItem(FLAPPY_BEST_KEY, String(v)); } catch (err) {}
    }

    function resetGame() {
      bird = { y: BASE_H / 2, vy: 0 };
      pipes = [];
      score = 0;
      spawnTimer = 0;
      state = 'idle';
      scoreEl.textContent = '0';
    }

    function spawnPipe() {
      const margin = 40;
      const gapY = margin + Math.random() * (BASE_H - GROUND_H - margin * 2 - PIPE_GAP);
      pipes.push({ x: BASE_W + PIPE_W, gapY, passed: false });
    }

    function startGame() {
      resetGame();
      state = 'playing';
      overlay.classList.remove('pos-game-overlay-visible');
      lastTs = performance.now();
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(loop);
    }

    function endGame() {
      state = 'over';
      const isNewBest = score > best;
      if (isNewBest) { best = score; saveBest(best); bestEl.textContent = String(best); }
      overlayTitle.textContent = 'Game Over';
      overlaySub.innerHTML = `Score: <b>${score}</b>${isNewBest ? ' &mdash; <span class="pos-game-newbest">New Best!</span>' : ''}`;
      startBtn.textContent = 'Play Again';
      overlay.classList.add('pos-game-overlay-visible');
    }

    function flap() {
      if (state === 'idle' || state === 'over') { startGame(); bird.vy = FLAP_V; return; }
      if (state === 'playing') bird.vy = FLAP_V;
    }

    function rectCircleCollide(cx, cy, r, rx, ry, rw, rh) {
      const closestX = Math.max(rx, Math.min(cx, rx + rw));
      const closestY = Math.max(ry, Math.min(cy, ry + rh));
      const dx = cx - closestX, dy = cy - closestY;
      return (dx * dx + dy * dy) < r * r;
    }

    function update(dt) {
      bird.vy += GRAVITY * dt;
      bird.y += bird.vy * dt;
      if (bird.y - BIRD_R < 0) { bird.y = BIRD_R; bird.vy = 0; }
      if (bird.y + BIRD_R > BASE_H - GROUND_H) {
        bird.y = BASE_H - GROUND_H - BIRD_R;
        endGame();
        return;
      }

      spawnTimer += dt;
      if (spawnTimer >= PIPE_INTERVAL) { spawnTimer = 0; spawnPipe(); }

      for (let i = pipes.length - 1; i >= 0; i--) {
        const p = pipes[i];
        p.x -= PIPE_SPEED * dt;
        if (!p.passed && p.x + PIPE_W < BIRD_X) {
          p.passed = true;
          score++;
          scoreEl.textContent = String(score);
        }
        if (p.x < -PIPE_W) { pipes.splice(i, 1); continue; }

        const topH = p.gapY;
        const botY = p.gapY + PIPE_GAP;
        if (rectCircleCollide(BIRD_X, bird.y, BIRD_R, p.x, 0, PIPE_W, topH) ||
            rectCircleCollide(BIRD_X, bird.y, BIRD_R, p.x, botY, PIPE_W, BASE_H - GROUND_H - botY)) {
          endGame();
          return;
        }
      }
    }

    function draw() {
      const scaleX = canvas.width / BASE_W, scaleY = canvas.height / BASE_H;
      ctx.save();
      ctx.setTransform(scaleX, 0, 0, scaleY, 0, 0);
      ctx.clearRect(0, 0, BASE_W, BASE_H);

      const accent2  = getComputedStyle(document.documentElement).getPropertyValue('--pos-accent-2').trim() || '#06b6d4';
      const surface2 = getComputedStyle(document.documentElement).getPropertyValue('--pos-surface-2').trim() || '#0c1223';

      ctx.fillStyle = surface2;
      ctx.fillRect(0, 0, BASE_W, BASE_H);

      ctx.fillStyle = accent2;
      pipes.forEach(p => {
        ctx.fillRect(p.x, 0, PIPE_W, p.gapY);
        ctx.fillRect(p.x, p.gapY + PIPE_GAP, PIPE_W, BASE_H - GROUND_H - (p.gapY + PIPE_GAP));
      });

      ctx.fillStyle = 'rgba(255,255,255,0.06)';
      ctx.fillRect(0, BASE_H - GROUND_H, BASE_W, GROUND_H);

      ctx.save();
      ctx.translate(BIRD_X, bird ? bird.y : BASE_H / 2);
      const vy = bird ? bird.vy : 0;
      const rot = Math.max(-0.5, Math.min(0.9, vy / 500));
      ctx.rotate(rot);

      // body — matches the 🐦 icon's pink/magenta rendering on Windows, not the OS theme
      const BIRD_BODY = '#ec4899';
      const BIRD_WING = '#be185d';
      ctx.fillStyle = BIRD_BODY;
      ctx.beginPath();
      ctx.ellipse(0, 0, BIRD_R, BIRD_R * 0.82, 0, 0, Math.PI * 2);
      ctx.fill();

      // wing — flaps up when rising, down when falling
      const wingFlap = Math.max(-1, Math.min(1, -vy / 320));
      ctx.fillStyle = BIRD_WING;
      ctx.beginPath();
      ctx.ellipse(-BIRD_R * 0.1, BIRD_R * 0.12 * wingFlap, BIRD_R * 0.62, BIRD_R * 0.36, -0.35 * wingFlap, 0, Math.PI * 2);
      ctx.fill();

      // eye
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(BIRD_R * 0.38, -BIRD_R * 0.28, BIRD_R * 0.32, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(BIRD_R * 0.48, -BIRD_R * 0.28, BIRD_R * 0.15, 0, Math.PI * 2);
      ctx.fill();

      // beak
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.moveTo(BIRD_R * 0.72, 0);
      ctx.lineTo(BIRD_R * 1.35, -BIRD_R * 0.1);
      ctx.lineTo(BIRD_R * 0.72, BIRD_R * 0.32);
      ctx.closePath();
      ctx.fill();

      ctx.restore();

      ctx.restore();
    }

    function loop(ts) {
      if (!canvas.isConnected) { rafId = null; return; }
      const dt = Math.min(0.033, (ts - lastTs) / 1000);
      lastTs = ts;
      if (state === 'playing') update(dt);
      draw();
      rafId = (state === 'playing') ? requestAnimationFrame(loop) : null;
    }

    function resizeBoard() {
      if (!winEl.isConnected) { boardResizeObserver.disconnect(); return; }
      const availW = boardArea.clientWidth, availH = boardArea.clientHeight;
      let w = availW, h = w * BASE_H / BASE_W;
      if (h > availH) { h = availH; w = h * BASE_W / BASE_H; }
      w = Math.max(160, Math.floor(w));
      h = Math.max(240, Math.floor(h));
      if (w === canvas.width && h === canvas.height) return;
      boardWrap.style.width  = w + 'px';
      boardWrap.style.height = h + 'px';
      canvas.width  = w;
      canvas.height = h;
      draw();
    }
    const boardResizeObserver = new ResizeObserver(resizeBoard);
    boardResizeObserver.observe(boardArea);
    winEl.addEventListener('pos-win-resize', resizeBoard);

    function onKeyDown(e) {
      if (!winEl.isConnected) { document.removeEventListener('keydown', onKeyDown); return; }
      if (!winEl.classList.contains('pos-win-focused')) return;
      if (e.key === ' ' || e.key === 'ArrowUp') { e.preventDefault(); flap(); }
    }
    document.addEventListener('keydown', onKeyDown);

    canvas.addEventListener('mousedown', () => flap());
    startBtn.addEventListener('click', startGame);
    restartBtn.addEventListener('click', startGame);

    best = loadBest();
    bestEl.textContent = String(best);
    resetGame();
    draw();
    overlayTitle.textContent = '🐦 Flappy';
    overlaySub.textContent = 'Space / Click to flap';
    startBtn.textContent = 'Press to Start';
    overlay.classList.add('pos-game-overlay-visible');
  }

  // ═════════════════════════════════════════
  // SHUTDOWN
  // ═════════════════════════════════════════
  function triggerShutdown() {
    if (isShuttingDown) return;
    isShuttingDown = true;
    playShutdownSound();

    // Close settings window if open
    shutdownScreen.classList.remove('pos-hidden');

    // Progress bar for shutdown
    shutdownBarWrap.classList.remove('pos-hidden');
    const sBar = shutdownBarWrap.querySelector('.pos-boot-bar');
    let pct = 0;
    const t = setInterval(() => {
      pct += 2;
      sBar.style.width = pct + '%';
      if (pct >= 100) {
        clearInterval(t);
        // Show thank you
        body_shutdownText();
      }
    }, 40);
  }

  function body_shutdownText() {
    const spinner = shutdownScreen.querySelector('.pos-shutdown-spinner');
    spinner.style.display = 'none';
    shutdownBarWrap.classList.add('pos-hidden');
    shutdownText.textContent = 'Thank You. 👋';
    shutdownText.style.fontSize = '22px';

    setTimeout(() => exitOS(), 1800);
  }

  function exitOS() {
    stopAmbientMusic();
    clearInterval(clockInterval);
    isShuttingDown = false;
    isBooting = false;

    // Reset state
    Object.keys(openWindows).forEach(id => {
      openWindows[id].el.remove();
      openWindows[id].taskbarBtn && openWindows[id].taskbarBtn.remove();
    });
    openWindows = {};
    taskbarApps.innerHTML = '';
    updateDockVisibility();

    // Reset boot status
    if (bootStatusEl) {
      bootStatusEl.classList.remove('pos-status-fade');
      bootStatusEl.textContent = BOOT_STAGES[0];
    }
    shutdownText.textContent = 'Shutting Down...';
    shutdownText.style.fontSize = '';
    if (shutdownScreen.querySelector('.pos-shutdown-spinner')) {
      shutdownScreen.querySelector('.pos-shutdown-spinner').style.display = '';
    }

    // Restore theme defaults
    const r = document.documentElement;
    [
      '--pos-accent',
      '--pos-accent-2',
      '--pos-accent-glow',
      '--pos-accent-dim',
      '--pos-bg',
      '--pos-surface',
      '--pos-surface-2',
      '--pos-win-header',
      '--pos-topbar-bg',
      '--pos-dock-bg',
      '--pos-control-bg',
      '--pos-control-bg-h',
      '--pos-desktop-bg',
      '--pos-border',
      '--pos-border-2'
    ].forEach(v => r.style.removeProperty(v));

    // Fade out
    osRoot.style.transition = 'opacity 0.5s ease';
    osRoot.style.opacity = '0';
    setTimeout(() => {
      osRoot.classList.add('pos-hidden');
      osRoot.style.opacity = '';
      osRoot.style.transition = '';
      document.documentElement.classList.remove('pos-os-active');
      document.body.classList.remove('pos-os-active');
      document.body.style.overflow = '';
      if (brandIconObserver) {
        brandIconObserver.disconnect();
        brandIconObserver = null;
      }
    }, 500);
  }

  // Shutdown buttons
  shutdownBtnTop.addEventListener('click', () => triggerShutdown());

  // ═════════════════════════════════════════
  // AMBIENT MUSIC (Web Audio API)
  // ═════════════════════════════════════════
  async function startAmbientMusic() {
    try {
      if (audioCtx) {
        if (audioCtx.state === 'suspended') await audioCtx.resume();
        return audioCtx.state === 'running';
      }
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.state === 'suspended') await audioCtx.resume();
      const masterGain = audioCtx.createGain();
      masterGain.gain.setValueAtTime(0, audioCtx.currentTime);
      masterGain.gain.linearRampToValueAtTime(0.16, audioCtx.currentTime + 0.8);
      masterGain.connect(audioCtx.destination);

      // Ambient pad — slow oscillating chord
      const freqs = [130.81, 164.81, 196.00, 261.63]; // C3, E3, G3, C4
      const oscs  = [];
      freqs.forEach((freq, i) => {
        const osc  = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        const lfo  = audioCtx.createOscillator();
        const lfoG = audioCtx.createGain();

        osc.type      = i % 2 ? 'triangle' : 'sine';
        osc.frequency.value = freq;
        lfo.type      = 'sine';
        lfo.frequency.value = 0.08 + i * 0.025;
        lfoG.gain.value = 0.12;

        lfo.connect(lfoG);
        lfoG.connect(osc.frequency);
        gain.gain.value = 0.18;
        osc.connect(gain);
        gain.connect(masterGain);

        osc.start();
        lfo.start();
        oscs.push(osc, lfo);
      });

      // Low-mid pulse so laptop speakers can actually reproduce it.
      const subOsc  = audioCtx.createOscillator();
      const subGain = audioCtx.createGain();
      subOsc.type = 'triangle';
      subOsc.frequency.value = 174.61; // F3
      subGain.gain.value = 0.16;
      subOsc.connect(subGain);
      subGain.connect(masterGain);
      subOsc.start();
      oscs.push(subOsc);

      musicNodes = { ctx: audioCtx, master: masterGain, oscs };
      return audioCtx.state === 'running';
    } catch (err) {
      console.warn('Audio not available:', err);
      audioCtx = null;
      musicNodes = {};
      return false;
    }
  }

  function stopAmbientMusic() {
    if (!audioCtx) return;
    try {
      musicNodes.master && musicNodes.master.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.5);
      setTimeout(() => {
        musicNodes.oscs && musicNodes.oscs.forEach(o => { try { o.stop(); } catch(e){} });
        audioCtx.close();
        audioCtx = null;
        musicNodes = {};
      }, 600);
    } catch(e) {}
  }

  async function startAmbientMusic() {
    try {
      if (!ambientAudio) {
        ambientAudio = new Audio('audio/ambient.mp3');
        ambientAudio.loop = true;
        ambientAudio.preload = 'auto';
      }

      if (ambientFadeTimer) {
        clearInterval(ambientFadeTimer);
        ambientFadeTimer = null;
      }

      ambientAudio.volume = 0;
      await ambientAudio.play();

      const targetVolume = 0.12;
      ambientFadeTimer = setInterval(() => {
        ambientAudio.volume = Math.min(targetVolume, ambientAudio.volume + 0.045);
        if (ambientAudio.volume >= targetVolume) {
          clearInterval(ambientFadeTimer);
          ambientFadeTimer = null;
        }
      }, 40);

      return true;
    } catch (err) {
      console.warn('Ambient audio file could not play:', err);
      return false;
    }
  }

  async function playStartupSound() {
    try {
      if (!startupAudio) {
        startupAudio = new Audio('audio/startup.mp3');
        startupAudio.preload = 'auto';
      }

      startupAudio.pause();
      startupAudio.currentTime = 0;
      startupAudio.volume = 0.13;
      await startupAudio.play();
    } catch (err) {
      console.warn('Startup sound not available:', err);
    }
  }

  async function playShutdownSound() {
    try {
      if (!shutdownAudio) {
        shutdownAudio = new Audio('audio/shutdown.mp3');
        shutdownAudio.preload = 'auto';
      }

      shutdownAudio.pause();
      shutdownAudio.currentTime = 0;
      shutdownAudio.volume = 0.13;
      await shutdownAudio.play();
    } catch (err) {
      console.warn('Shutdown sound not available:', err);
    }
  }

  function stopAmbientMusic() {
    if (!ambientAudio) return;

    if (ambientFadeTimer) {
      clearInterval(ambientFadeTimer);
      ambientFadeTimer = null;
    }

    ambientFadeTimer = setInterval(() => {
      ambientAudio.volume = Math.max(0, ambientAudio.volume - 0.06);
      if (ambientAudio.volume <= 0) {
        clearInterval(ambientFadeTimer);
        ambientFadeTimer = null;
        ambientAudio.pause();
        ambientAudio.currentTime = 0;
      }
    }, 35);
  }

  // ── Utility ──────────────────────────────────────────────────
  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

})();

// ── COMMAND PALETTE (CTRL/CMD + K) ──────────────────────────────
(function () {
  const overlay  = document.getElementById('cmdkOverlay');
  const panel    = document.getElementById('cmdkPanel');
  const input    = document.getElementById('cmdkInput');
  const list     = document.getElementById('cmdkList');
  const trigger  = document.getElementById('cmdkDropdownToggle');
  const mobileTrigger = document.getElementById('mobileCmdkToggle');
  if (!overlay || !input || !list) return;

  const svgHome     = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>';
  const svgUser     = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>';
  const svgCode     = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>';
  const svgGh       = '<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>';
  const svgFolder   = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>';
  const svgAward    = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>';
  const svgMail     = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>';
  const svgTerminal = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>';
  const svgSkull    = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/><path d="M9 16s1-1.5 3-1.5 3 1.5 3 1.5"/></svg>';
  const svgMonitor  = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><polyline points="8 21 12 17 16 21"/></svg>';
  const svgDownload = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>';
  const svgClip     = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="2" width="6" height="4" rx="1"/><path d="M9 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-3"/></svg>';
  const svgExternal = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>';

  function scrollTo(hash) {
    const target = document.querySelector(hash);
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function clickEl(id) {
    const el = document.getElementById(id);
    if (el) el.click();
  }

  function showCmdkToast(message) {
    let toast = document.getElementById('cmdkToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'cmdkToast';
      toast.className = 'cmdk-toast';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    requestAnimationFrame(() => toast.classList.add('show'));
    clearTimeout(toast._hideTimer);
    toast._hideTimer = setTimeout(() => toast.classList.remove('show'), 2200);
  }

  const commands = [
    { group: 'Navigate', icon: svgHome, label: 'Go to Home', keywords: 'home hero top', action: () => scrollTo('#home') },
    { group: 'Navigate', icon: svgUser, label: 'Go to About', keywords: 'about me who', action: () => scrollTo('#about') },
    { group: 'Navigate', icon: svgCode, label: 'Go to Skills', keywords: 'skills stack tech', action: () => scrollTo('#skills') },
    { group: 'Navigate', icon: svgFolder, label: 'Go to Projects', keywords: 'projects work munjez cafe', action: () => scrollTo('#projects') },
    { group: 'Navigate', icon: svgAward, label: 'Go to Education & Certs', keywords: 'education certifications ccna eelu', action: () => scrollTo('#education') },
    { group: 'Navigate', icon: svgMail, label: 'Go to Contact', keywords: 'contact message form', action: () => scrollTo('#contact') },

    { group: 'Actions', icon: svgTerminal, label: 'Open Terminal Console', keywords: 'terminal console dev tools', action: () => clickEl('terminalToggle'), hint: 'toggles' },
    { group: 'Actions', icon: svgSkull, label: 'Toggle Hacker Mode', keywords: 'hacker matrix theme green', action: () => clickEl('matrixToggle'), hint: 'toggles' },
    { group: 'Actions', icon: svgMonitor, label: 'Launch Portfolio OS', keywords: 'os desktop launch boot', action: () => clickEl('launchOsBtn') },
    { group: 'Actions', icon: svgDownload, label: 'Download CV', keywords: 'resume cv pdf download', action: () => window.open('Osama_Ahmed_CV.pdf', '_blank') },
    { group: 'Actions', icon: svgClip, label: 'Copy Email Address', keywords: 'email copy contact mail', action: () => {
        navigator.clipboard.writeText('osamaahmed.dev00@gmail.com').then(() => showCmdkToast('Email copied to clipboard!'));
      } },

    { group: 'Links', icon: svgGh, label: 'Open GitHub Profile', keywords: 'github profile osama2214', action: () => window.open('https://github.com/Osama2214', '_blank'), hint: '↗' },
    { group: 'Links', icon: svgExternal, label: 'Open LinkedIn Profile', keywords: 'linkedin connect', action: () => window.open('https://www.linkedin.com/in/osama-ahmed-67127222a', '_blank'), hint: '↗' },
    { group: 'Links', icon: svgExternal, label: 'Open Munjez App Website', keywords: 'munjez app productivity', action: () => window.open('https://munjez-website.vercel.app', '_blank'), hint: '↗' },
  ];

  let filtered = commands.slice();
  let activeIdx = 0;

  function render() {
    if (!filtered.length) {
      list.innerHTML = '<div class="cmdk-empty">No matching commands.</div>';
      return;
    }
    let html = '';
    let lastGroup = null;
    filtered.forEach((cmd, i) => {
      if (cmd.group !== lastGroup) {
        html += `<div class="cmdk-group-label">${cmd.group}</div>`;
        lastGroup = cmd.group;
      }
      html += `<button type="button" class="cmdk-item${i === activeIdx ? ' active' : ''}" data-idx="${i}">${cmd.icon}<span>${cmd.label}</span>${cmd.hint ? `<span class="cmdk-item-hint">${cmd.hint}</span>` : ''}</button>`;
    });
    list.innerHTML = html;
    const activeEl = list.querySelector('.cmdk-item.active');
    if (activeEl) activeEl.scrollIntoView({ block: 'nearest' });
  }

  function filterCommands(query) {
    const q = query.trim().toLowerCase();
    if (!q) {
      filtered = commands.slice();
    } else {
      filtered = commands
        .filter(c => (c.label + ' ' + c.keywords).toLowerCase().includes(q))
        .sort((a, b) => {
          const aStarts = a.label.toLowerCase().startsWith(q) ? 0 : 1;
          const bStarts = b.label.toLowerCase().startsWith(q) ? 0 : 1;
          return aStarts - bStarts;
        });
    }
    activeIdx = 0;
    render();
  }

  function runCommand(idx) {
    const cmd = filtered[idx];
    if (!cmd) return;
    closePalette();
    setTimeout(() => cmd.action(), 80);
  }

  function openPalette() {
    overlay.classList.add('open');
    input.value = '';
    filterCommands('');
    setTimeout(() => input.focus(), 60);
    document.addEventListener('keydown', onKeydown);
  }

  function closePalette() {
    overlay.classList.remove('open');
    input.blur();
    document.removeEventListener('keydown', onKeydown);
  }

  function onKeydown(e) {
    if (e.key === 'Escape') {
      e.preventDefault();
      closePalette();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      activeIdx = Math.min(activeIdx + 1, filtered.length - 1);
      render();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      activeIdx = Math.max(activeIdx - 1, 0);
      render();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      runCommand(activeIdx);
    }
  }

  document.addEventListener('keydown', (e) => {
    // Use e.code (physical key position) instead of e.key so the shortcut
    // still fires under non-Latin keyboard layouts (Arabic, etc.), where
    // the K key produces a different character than "k".
    const isK = e.code === 'KeyK';
    if ((e.ctrlKey || e.metaKey) && isK) {
      e.preventDefault();
      if (overlay.classList.contains('open')) {
        closePalette();
      } else {
        openPalette();
      }
    }
  });

  input.addEventListener('input', () => filterCommands(input.value));

  list.addEventListener('click', (e) => {
    const item = e.target.closest('.cmdk-item');
    if (item) runCommand(Number(item.dataset.idx));
  });

  list.addEventListener('mousemove', (e) => {
    const item = e.target.closest('.cmdk-item');
    if (item) {
      const idx = Number(item.dataset.idx);
      if (idx !== activeIdx) {
        activeIdx = idx;
        render();
      }
    }
  });

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closePalette();
  });

  if (trigger) trigger.addEventListener('click', openPalette);
  if (mobileTrigger) {
    mobileTrigger.addEventListener('click', (e) => {
      e.preventDefault();
      const navMobile = document.getElementById('navMobile');
      const hamburger = document.getElementById('hamburger');
      if (navMobile) navMobile.classList.remove('open');
      if (hamburger) {
        const spans = hamburger.querySelectorAll('span');
        spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
      }
      openPalette();
    });
  }
})();