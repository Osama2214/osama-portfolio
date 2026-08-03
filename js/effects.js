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

