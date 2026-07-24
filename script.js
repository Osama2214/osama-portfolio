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
  let animationsLevel  = 'high';
  let osTheme       = 'site-purple';
  let audioCtx      = null;
  let musicNodes    = {};
  let isBooting     = false;
  let isShuttingDown= false;

  // ── App Definitions ─────────────────────────────────────────
  const APP_META = {
    terminal : { title: 'Terminal',  icon: '🖥️',  w: 680, h: 440, x: 140, y: 60  },
    projects : { title: 'Projects',  icon: '📂',  w: 720, h: 480, x: 160, y: 70  },
    resume   : { title: 'Resume',    icon: '📄',  w: 680, h: 500, x: 180, y: 50  },
    browser  : { title: 'Browser',   icon: '🌐',  w: 780, h: 520, x: 120, y: 40  },
    settings : { title: 'Settings',  icon: '⚙️',  w: 400, h: 470, x: 300, y: 80  },
    contact  : { title: 'Contact',   icon: '📧',  w: 420, h: 400, x: 320, y: 100 },
    trash    : { title: 'Trash',     icon: '🗑️',  w: 380, h: 300, x: 350, y: 120 },
  };

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
    document.body.style.overflow = 'hidden';
    osRoot.classList.remove('pos-hidden');
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
    startClock();
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
  iconsGrid.addEventListener('click', (e) => {
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

  // ── App Launcher ─────────────────────────────────────────────
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
  function focusWindow(el) {
    // Unfocus all
    document.querySelectorAll('.pos-window').forEach(w => w.classList.remove('pos-win-focused'));
    document.querySelectorAll('.pos-taskbar-app').forEach(b => b.classList.remove('pos-app-active'));

    el.classList.add('pos-win-focused');
    el.style.zIndex = ++zTop;

    const appId = el.dataset.appId;
    const state = openWindows[appId];
    if (state && state.taskbarBtn) state.taskbarBtn.classList.add('pos-app-active');
  }

  function closeWindow(appId) {
    const state = openWindows[appId];
    if (!state) return;
    state.el.remove();
    state.taskbarBtn && state.taskbarBtn.remove();
    delete openWindows[appId];
  }

  function minimizeWindow(appId) {
    const state = openWindows[appId];
    if (!state || state.el.classList.contains('pos-win-minimized')) return;
    const el = state.el;
    state.minimized = true;
    el.classList.remove('pos-win-focused');
    state.taskbarBtn && state.taskbarBtn.classList.remove('pos-app-active');
    genieAnimate(el, state.taskbarBtn, 'out', () => {
      el.classList.add('pos-win-minimized');
    });
  }

  function restoreWindow(appId) {
    const state = openWindows[appId];
    if (!state) return;
    const el = state.el;
    el.classList.remove('pos-win-minimized');
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

    function onTransitionEnd(e) {
      if (e.target !== win || e.propertyName !== 'transform') return;
      win.removeEventListener('transitionend', onTransitionEnd);
      win.style.transition = '';
      if (direction === 'in') { win.style.transform = ''; win.style.opacity = ''; }
      onDone && onDone();
    }

    if (direction === 'out') {
      win.style.transition = 'transform 0.36s cubic-bezier(0.55,0,0.85,0.35), opacity 0.3s ease 0.05s';
      win.addEventListener('transitionend', onTransitionEnd);
      requestAnimationFrame(() => {
        win.style.transform = shrunk;
        win.style.opacity = '0';
      });
    } else {
      win.style.transition = 'none';
      win.style.transform = shrunk;
      win.style.opacity = '0';
      void win.offsetWidth; // force reflow before animating back
      win.style.transition = 'transform 0.4s cubic-bezier(0.16,1,0.3,1), opacity 0.3s ease';
      win.addEventListener('transitionend', onTransitionEnd);
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
    });

    document.addEventListener('mouseup', () => { resizing = false; });
  }

  // ── Taskbar Button ───────────────────────────────────────────
  function createTaskbarBtn(icon, title, appId) {
    const btn = document.createElement('button');
    btn.className = 'pos-taskbar-app pos-app-running';
    btn.title = title;
    btn.innerHTML = `${icon}<span>${title}</span>`;
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
        `<span style="display:inline-flex;align-items:center;padding:2px 8px;background:rgba(124,58,237,0.12);border:1px solid rgba(124,58,237,0.25);border-radius:4px;font-size:11px;color:var(--pos-accent);font-family:'JetBrains Mono',monospace">${t}</span>`
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
          ${p.badge ? `<span style="margin-left:auto;padding:2px 8px;background:rgba(124,58,237,0.15);border:1px solid rgba(124,58,237,0.3);border-radius:12px;font-size:10px;font-weight:600;color:var(--pos-accent);white-space:nowrap">${p.badge}</span>` : ''}
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
            <div class="pos-setting-row-label">Animations</div>
            <div class="pos-setting-row-sub">UI animation quality</div>
          </div>
          <select class="pos-select" id="posAnimSelect">
            <option value="high"   ${animationsLevel==='high'   ? 'selected':''}>High</option>
            <option value="medium" ${animationsLevel==='medium' ? 'selected':''}>Medium</option>
            <option value="low"    ${animationsLevel==='low'    ? 'selected':''}>Low</option>
          </select>
        </div>

        <div class="pos-setting-row">
          <div class="pos-setting-row-info">
            <div class="pos-setting-row-label">Theme</div>
            <div class="pos-setting-row-sub">Desktop color scheme</div>
          </div>
          <select class="pos-select" id="posThemeSelect">
            <option value="site-purple" ${osTheme==='site-purple' ? 'selected':''}>Site Purple</option>
            <option value="cyan-blue"   ${osTheme==='cyan-blue'   ? 'selected':''}>Cyan Blue</option>
            <option value="deep-violet" ${osTheme==='deep-violet' ? 'selected':''}>Deep Violet</option>
          </select>
        </div>

        <div class="pos-settings-divider"></div>
        <div class="pos-settings-section-title">About</div>
        <div class="pos-setting-row">
          <div class="pos-setting-row-info">
            <div class="pos-setting-row-label">Portfolio OS</div>
            <div class="pos-setting-row-sub">Version 1.0.0 — Built by Osama Ahmed</div>
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
    body.querySelector('#posMusicToggle').addEventListener('change', function () {
      musicEnabled = this.checked;
      if (musicEnabled) startAmbientMusic();
      else stopAmbientMusic();
    });

    // Animations
    body.querySelector('#posAnimSelect').addEventListener('change', function () {
      animationsLevel = this.value;
      document.documentElement.style.setProperty('--pos-win-anim', animationsLevel === 'low' ? 'none' : '');
    });

    // Theme
    body.querySelector('#posThemeSelect').addEventListener('change', function () {
      applyOsTheme(this.value);
    });

    // Shutdown
    body.querySelector('#posSettingsShutdown').addEventListener('click', () => triggerShutdown());
  }

  // OS Theme
  function applyOsTheme(theme) {
    osTheme = theme;
    const themes = {
      'site-purple': { accent: '#a78bfa', accent2: '#06b6d4', glow: 'rgba(124,58,237,0.4)',   dim: 'rgba(124,58,237,0.15)' },
      'cyan-blue':   { accent: '#06b6d4', accent2: '#7c3aed', glow: 'rgba(6,182,212,0.35)',   dim: 'rgba(6,182,212,0.15)' },
      'deep-violet': { accent: '#7c3aed', accent2: '#a78bfa', glow: 'rgba(124,58,237,0.5)',   dim: 'rgba(124,58,237,0.2)' },
    };
    const t = themes[theme] || themes['site-purple'];
    const r = document.documentElement;
    r.style.setProperty('--pos-accent',     t.accent);
    r.style.setProperty('--pos-accent-2',   t.accent2);
    r.style.setProperty('--pos-accent-glow', t.glow);
    r.style.setProperty('--pos-accent-dim',  t.dim);
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

  // ═════════════════════════════════════════
  // SHUTDOWN
  // ═════════════════════════════════════════
  function triggerShutdown() {
    if (isShuttingDown) return;
    isShuttingDown = true;

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
    ['--pos-accent','--pos-accent-2','--pos-accent-glow','--pos-accent-dim','--pos-border','--pos-border-2'].forEach(v => r.style.removeProperty(v));

    // Fade out
    osRoot.style.transition = 'opacity 0.5s ease';
    osRoot.style.opacity = '0';
    setTimeout(() => {
      osRoot.classList.add('pos-hidden');
      osRoot.style.opacity = '';
      osRoot.style.transition = '';
      document.body.style.overflow = '';
    }, 500);
  }

  // Shutdown buttons
  shutdownBtnTop.addEventListener('click', () => triggerShutdown());

  // ═════════════════════════════════════════
  // AMBIENT MUSIC (Web Audio API)
  // ═════════════════════════════════════════
  function startAmbientMusic() {
    try {
      if (audioCtx) return;
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const masterGain = audioCtx.createGain();
      masterGain.gain.setValueAtTime(0, audioCtx.currentTime);
      masterGain.gain.linearRampToValueAtTime(0.06, audioCtx.currentTime + 2);
      masterGain.connect(audioCtx.destination);

      // Ambient pad — slow oscillating chord
      const freqs = [130.81, 164.81, 196.00, 261.63]; // C3, E3, G3, C4
      const oscs  = [];
      freqs.forEach((freq, i) => {
        const osc  = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        const lfo  = audioCtx.createOscillator();
        const lfoG = audioCtx.createGain();

        osc.type      = 'sine';
        osc.frequency.value = freq;
        lfo.type      = 'sine';
        lfo.frequency.value = 0.05 + i * 0.02;
        lfoG.gain.value = 0.3;

        lfo.connect(lfoG);
        lfoG.connect(gain.gain);
        gain.gain.value = 0.5;
        osc.connect(gain);
        gain.connect(masterGain);

        osc.start();
        lfo.start();
        oscs.push(osc, lfo);
      });

      // Sub-bass pulse
      const subOsc  = audioCtx.createOscillator();
      const subGain = audioCtx.createGain();
      subOsc.type = 'triangle';
      subOsc.frequency.value = 65.41; // C2
      subGain.gain.value = 0.4;
      subOsc.connect(subGain);
      subGain.connect(masterGain);
      subOsc.start();
      oscs.push(subOsc);

      musicNodes = { ctx: audioCtx, master: masterGain, oscs };
    } catch (err) {
      console.warn('Audio not available:', err);
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

  // ── Utility ──────────────────────────────────────────────────
  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

})();