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

  let particleRgb = '255, 255, 255';
  let particleNodeRgb = '226, 232, 240';

  function updateThemeParticleColors() {
    if (document.body.classList.contains('matrix-mode') || document.documentElement.classList.contains('matrix-mode')) {
      particleRgb = '16, 185, 129';
      particleNodeRgb = '52, 211, 153';
    } else {
      const computed = getComputedStyle(document.documentElement);
      particleRgb = (computed.getPropertyValue('--particle-rgb') || '255, 255, 255').trim();
      particleNodeRgb = (computed.getPropertyValue('--particle-node-rgb') || '226, 232, 240').trim();
    }
  }

  updateThemeParticleColors();
  window.addEventListener('themeChanged', updateThemeParticleColors);

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
                ctx.strokeStyle = `rgba(${particleRgb}, ${alpha})`;
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
        ctx.fillStyle = `rgba(${particleNodeRgb}, ${p.a * 0.6})`;
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
      color: #34d399;
      text-shadow: 0 0 10px #10b981, 0 0 20px rgba(16, 185, 129, 0.4);
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
    document.documentElement.classList.toggle('matrix-mode');
    updateThemeParticleColors();

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

// ── 3D INTERACTIVE CARD TILT EFFECT ──────────────────────
(function () {
  if (prefersReducedMotion || isTouchDevice) return;

  const cards = document.querySelectorAll('.project-card, .service-card, .exp-card, .edu-academic-card, .contact-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Calculate tilt angles so the spot under the mouse cursor dips back into 3D perspective space
      const rotateX = ((y - centerY) / centerY) * -3.5;
      const rotateY = ((x - centerX) / centerX) * 3.5;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
    });
  });
})();

// ── DYNAMIC PHYSICS-BASED SCROLL COLLISION SPARK SYSTEM ──
(function () {
  if (prefersReducedMotion) return;

  const sparkCanvas = document.createElement('canvas');
  sparkCanvas.id = 'sparkCanvas';
  sparkCanvas.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:999999;';
  document.body.appendChild(sparkCanvas);

  const ctx = sparkCanvas.getContext('2d');

  function resizeSparkCanvas() {
    sparkCanvas.width = window.innerWidth;
    sparkCanvas.height = window.innerHeight;
  }
  resizeSparkCanvas();
  window.addEventListener('resize', resizeSparkCanvas);

  const sparks = [];
  let lastScrollY = window.scrollY;
  let lastScrollTime = performance.now();
  let lastCollisionTime = 0;

  function spawnSparks(collisionType, velocity) {
    const now = performance.now();
    if (now - lastCollisionTime < 130) return; // 130ms collision cooldown
    lastCollisionTime = now;

    // Calculate spark intensity based on scroll velocity (rich density, 60FPS)
    const speedRatio = Math.min(Math.max(velocity, 0.4), 4.0);
    const count = Math.min(Math.floor(28 * speedRatio), 48); // Rich 48 sparks max!
    const basePower = 4.5 + speedRatio * 5.0;

    // Get current active theme RGB color for sparks
    let themeRgb = '16, 185, 129';
    if (document.body.classList.contains('matrix-mode') || document.documentElement.classList.contains('matrix-mode')) {
      themeRgb = '16, 185, 129';
    } else {
      themeRgb = getComputedStyle(document.documentElement).getPropertyValue('--particle-rgb').trim() || '229, 193, 88';
    }

    for (let i = 0; i < count; i++) {
      // Natural wide emission contact zone along the collision edge (not a single point!)
      const sparkX = (window.innerWidth - 45) + Math.random() * 40;
      const sparkY = collisionType === 'top'
        ? Math.random() * 12
        : window.innerHeight - 14 + Math.random() * 10;

      const angle = collisionType === 'top'
        ? (Math.PI * 0.1) + Math.random() * (Math.PI * 0.8)     // 140-degree downward impact spray
        : -(Math.PI * 0.1) - Math.random() * (Math.PI * 0.8);   // 140-degree upward impact spray

      const speed = (0.5 + Math.random() * 2.0) * basePower;

      // Natural directional velocity vector
      const horizontalVel = - Math.abs(Math.cos(angle)) * speed * (0.6 + Math.random() * 1.4);
      const verticalVel = collisionType === 'top'
        ? Math.abs(Math.sin(angle)) * speed * (0.8 + Math.random() * 1.3)
        : - Math.abs(Math.sin(angle)) * speed * (1.0 + Math.random() * 1.5);

      sparks.push({
        x: sparkX,
        y: sparkY,
        vx: horizontalVel,
        vy: verticalVel,
        life: 1.0,
        decay: collisionType === 'bottom' ? (0.009 + Math.random() * 0.013) : (0.016 + Math.random() * 0.022),
        size: 1.6 + Math.random() * 3.0,
        color: themeRgb,
        type: collisionType
      });
    }
  }

  let canTriggerTop = false;
  let canTriggerBottom = false;

  function updateBoundaryStates() {
    const docHeight = Math.max(
      document.documentElement.scrollHeight,
      document.body.scrollHeight,
      document.documentElement.offsetHeight
    );
    const currentScrollY = window.scrollY || window.pageYOffset || 0;
    const viewportHeight = window.innerHeight;
    const distFromBottom = docHeight - (currentScrollY + viewportHeight);

    // Arm Top trigger only when user scrolls down away from top (> 35px)
    if (currentScrollY > 35) {
      canTriggerTop = true;
    }

    // Arm Bottom trigger only when user scrolls up away from bottom (distFromBottom > 35px)
    if (distFromBottom > 35) {
      canTriggerBottom = true;
    }
  }

  function checkBoundaryCollision(velocity, direction) {
    updateBoundaryStates();

    const docHeight = Math.max(
      document.documentElement.scrollHeight,
      document.body.scrollHeight,
      document.documentElement.offsetHeight
    );
    const currentScrollY = window.scrollY || window.pageYOffset || 0;
    const viewportHeight = window.innerHeight;
    const distFromBottom = docHeight - (currentScrollY + viewportHeight);

    // Direction < 0 = scrolling UP into Top boundary from below
    if (direction < 0 && currentScrollY <= 8 && canTriggerTop) {
      spawnSparks('top', velocity);
      canTriggerTop = false; // Disarm until user scrolls down away from top again!
    }
    // Direction > 0 = scrolling DOWN into Bottom boundary from above
    else if (direction > 0 && distFromBottom <= 20 && canTriggerBottom) {
      spawnSparks('bottom', velocity);
      canTriggerBottom = false; // Disarm until user scrolls up away from bottom again!
    }
  }

  // 1. Listen to scroll events
  window.addEventListener('scroll', () => {
    const now = performance.now();
    const dt = Math.max(now - lastScrollTime, 8);
    const currentScrollY = window.scrollY || window.pageYOffset || 0;
    const scrollDiff = currentScrollY - lastScrollY;
    const velocity = Math.abs(scrollDiff) / dt;

    if (Math.abs(scrollDiff) > 0) {
      checkBoundaryCollision(velocity, scrollDiff);
    }

    lastScrollY = currentScrollY;
    lastScrollTime = now;
  }, { passive: true });

  // 2. Listen to wheel events (catches overscroll impulses)
  window.addEventListener('wheel', (e) => {
    if (Math.abs(e.deltaY) < 3) return;
    const velocity = Math.min(Math.abs(e.deltaY) * 0.025, 3.5);
    checkBoundaryCollision(velocity, e.deltaY);
  }, { passive: true });

  function renderSparks() {
    ctx.clearRect(0, 0, sparkCanvas.width, sparkCanvas.height);
    if (sparks.length === 0) {
      requestAnimationFrame(renderSparks);
      return;
    }

    // Hardware-accelerated GPU additive blending (eliminates expensive CPU shadowBlur lag)
    ctx.globalCompositeOperation = 'lighter';
    ctx.lineCap = 'round';

    for (let i = sparks.length - 1; i >= 0; i--) {
      const s = sparks[i];

      // Physics update: gravity + air resistance
      s.x += s.vx;
      s.y += s.vy;
      s.vy += (s.type === 'bottom' ? 0.35 : 0.28); // Gravity pull
      s.vx *= 0.965; // Horizontal drag
      s.life -= s.decay;

      // Ground bounce for bottom sparks when falling back down
      if (s.type === 'bottom' && s.y >= window.innerHeight - 2 && s.vy > 0) {
        s.y = window.innerHeight - 2;
        s.vy = -s.vy * 0.45; // Elastic bounce off the bottom edge!
        s.vx *= 0.65; // Floor friction
      }

      if (s.life <= 0) {
        sparks.splice(i, 1);
        continue;
      }

      const alpha = Math.max(s.life, 0).toFixed(2);

      // Pass 1: Outer glow trail line
      ctx.beginPath();
      ctx.moveTo(s.x - s.vx * 2.5, s.y - s.vy * 2.5);
      ctx.lineTo(s.x, s.y);
      ctx.strokeStyle = `rgba(${s.color}, ${(alpha * 0.6).toFixed(2)})`;
      ctx.lineWidth = s.size * 1.6;
      ctx.stroke();

      // Pass 2: Ultra-bright glowing spark core
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size * 0.6, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.fill();
    }

    // Reset composite mode
    ctx.globalCompositeOperation = 'source-over';
    requestAnimationFrame(renderSparks);
  }

  renderSparks();
})();

