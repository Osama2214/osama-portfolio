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
  if (matrixToggleBtn) {
    matrixToggleBtn.addEventListener('click', () => {
      isMatrixActive = !isMatrixActive;
      document.body.classList.toggle('matrix-mode');

      const toggleText = matrixToggleBtn.querySelector('.hacker-label');
      if (isMatrixActive) {
        initMatrix();
        activateHackerExtras();
        if (toggleText) toggleText.textContent = 'Space Mode';
      } else {
        deactivateHackerExtras();
        if (toggleText) toggleText.textContent = 'Hacker Mode';
      }
    });
  }

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
        printLine('Available Commands:', 'banner');
        printLine('  about      - A short biography about me');
        printLine('  skills     - Visual display of my core technical stack');
        printLine('  projects   - Interactive list of my built projects');
        printLine('  experience - Detailed educational & scholarship history');
        printLine('  contact    - Channels to reach out or connect with me');
        printLine('  cv         - Simulates and opens my resume PDF');
        printLine('  coffee     - Energize the terminal developer');
        printLine('  theme      - Cycle console colors (purple, green, cyan, amber)');
        printLine('  social     - Quick links to GitHub & LinkedIn');
        printLine('  clear      - Wipes the console history clean');
        printLine('  hack       - Initiate terminal hack sequence');
        printLine('  guess      - Play a number guessing game');
        printLine('  secret     - [LOCKED] You need root access first...');
        break;

      case 'about':
        const loadingLine = printLine('', 'loading');
        await typeText(loadingLine, 'Loading bio...', 15);
        await new Promise(r => setTimeout(r, 350));
        loadingLine.remove();

        const aboutLine = printLine('');
        await typeText(aboutLine, "Hi,\nI'm Osama Ahmed.\n\nBackend Developer.\n\nPassionate about Laravel,\nPHP,\nJava\nand building scalable web apps.\n", 15);
        break;

      case 'skills':
        printLine('Loading technical stack visualizer...', 'loading');
        await new Promise(r => setTimeout(r, 400));
        await animateSkillsBars();
        break;

      case 'projects':
        printLine('1. Munjez (Productivity Desktop App)');
        printLine('2. Laundry Management System (Laravel Capstone)');
        printLine('3. Portfolio (Interactive Website)');
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
      printLine('Features: Smart Task Management, 4-view Calendar, Pomodoro Focus Timer, Habit Streak Tracker, White Noise Mixer.');
      printHTML('Website: <a href="https://munjez-website.vercel.app" target="_blank" style="color:var(--term-accent)">https://munjez-website.vercel.app</a>');
    } else if (choice === '2') {
      printLine('Laundry Management System', 'banner');
      printLine('Status: Completed (NTI Scholarship Capstone)');
      printLine('Tech Stack: PHP, Laravel, MySQL, OOP, MVC, Bootstrap');
      printLine('Features: Customer orders tracking, service pricing, billing invoice generation, payment processing, role-based auth.');
      printHTML('Source Code: <a href="https://github.com/Osama2214/NTI-Task-2" target="_blank" style="color:var(--term-accent)">https://github.com/Osama2214/NTI-Task-2</a>');
    } else if (choice === '3') {
      printLine('Osama Ahmed Portfolio', 'banner');
      printLine('Status: Live');
      printLine('Tech Stack: HTML5, CSS3, JavaScript, Vercel');
      printLine('Features: Interactive console terminal, Hacker mode (matrix), glassmorphism styles, scroll triggers, custom caching, SEO optimized.');
      printHTML('Live Site: <a href="https://osama-portfolio-six.vercel.app/" target="_blank" style="color:var(--term-accent)">https://osama-portfolio-six.vercel.app/</a>');
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

    const toast = document.createElement('div');
    toast.id = 'easterToast';
    toast.innerHTML = `<span class="toast-msg">${message}</span>`;
    toast.style.cssText = `
      position: fixed;
      bottom: 28px;
      left: 28px;
      transform: translateX(-120%);
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
      white-space: nowrap;
    `;
    document.body.appendChild(toast);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateX(0)';
      });
    });

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-120%)';
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
      showToast('Developer Mode Enabled — HUD Active!');
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