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
      background: var(--surface, rgba(7, 10, 20, 0.95));
      border: 1px solid var(--border-h, rgba(16, 185, 129, 0.45));
      color: var(--p-light, #34d399);
      font-family: 'JetBrains Mono', monospace;
      font-size: 12.5px;
      padding: 10px 20px;
      border-radius: 40px;
      display: flex;
      align-items: center;
      gap: 10px;
      z-index: 99999;
      backdrop-filter: blur(16px);
      box-shadow: 0 8px 32px var(--p-glow, rgba(16, 185, 129, 0.25)), 0 0 0 1px var(--p-glow, rgba(16, 185, 129, 0.1));
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
