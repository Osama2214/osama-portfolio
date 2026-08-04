/* ── HIDDEN DEVELOPER MODE ──
   A quiet reward for anyone curious enough to open DevTools. Detection is
   heuristic (the classic outer/inner window-size gap) and purely reactive —
   it never blocks, delays, or interferes with Inspect/DevTools in any way.
   Fires once per page load: a brief freeze, a soft glitch, then a terminal-
   style overlay panel (not a full-page takeover) types out a short message,
   auto-dismisses after a few seconds, and leaves a matching note in the
   console for anyone who only checks there. */
(function () {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const GAP_THRESHOLD = 160; // px — a docked DevTools panel is much wider/taller than this
  let triggered = false;
  let pollTimer = null;
  let baselineHGap = 0; // browser chrome height (tabs/toolbar) measured before DevTools

  function widthGap()  { return (window.outerWidth  || 0) - (window.innerWidth  || 0); }
  function heightGap() { return (window.outerHeight || 0) - (window.innerHeight || 0); }

  function devtoolsLikelyOpen() {
    // Docked left/right → big width gap. Docked bottom → height gap grows past the
    // baseline chrome we measured at load. Either one means DevTools is open.
    return widthGap() > GAP_THRESHOLD || (heightGap() - baselineHGap) > GAP_THRESHOLD;
  }

  function trigger() {
    if (triggered) return;
    triggered = true;
    clearInterval(pollTimer);
    window.removeEventListener('resize', check);
    window.removeEventListener('keydown', onDevKey, true);
    runSequence();
  }

  function check() {
    if (triggered || !devtoolsLikelyOpen()) return;
    trigger();
  }

  // Keyboard detection — the most reliable signal, and dimension-independent, so
  // it still works in privacy browsers (e.g. Brave) that fuzz window sizes:
  // F12, Ctrl/Cmd+Shift+I, Ctrl/Cmd+Shift+J, Ctrl/Cmd+Shift+C.
  function onDevKey(e) {
    if (triggered) return;
    const k = (e.key || '').toLowerCase();
    const combo = e.key === 'F12' ||
      ((e.ctrlKey || e.metaKey) && e.shiftKey && (k === 'i' || k === 'j' || k === 'c'));
    if (combo) setTimeout(trigger, 300); // let DevTools begin opening first
  }
  window.addEventListener('keydown', onDevKey, true);

  // Size-based fallback (docked DevTools in browsers that report real dimensions).
  setTimeout(() => {
    baselineHGap = heightGap();
    check(); // catch the case where DevTools was already open on load
    window.addEventListener('resize', check);
    pollTimer = setInterval(check, 500);
  }, 500);

  // Manual trigger for testing / from the console: devMode()
  window.devMode = function () { runSequence(); };

  // ── Sequence ──────────────────────────────────────────────
  function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }

  function runSequence() {
    const existing = document.getElementById('dteOverlay');
    if (existing) existing.remove(); // allow a clean re-trigger (e.g. manual devMode())
    printConsoleEasterEgg();
    if (reduceMotion) { showOverlay(); return; }
    document.documentElement.classList.add('dte-freeze');
    setTimeout(() => {
      document.documentElement.classList.remove('dte-freeze');
      document.documentElement.classList.add('dte-glitch');
      setTimeout(() => {
        document.documentElement.classList.remove('dte-glitch');
        showOverlay();
      }, 380);
    }, 200);
  }

  function buildOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'dte-overlay';
    overlay.id = 'dteOverlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-label', 'Developer mode');
    overlay.innerHTML = `
      <div class="dte-panel">
        <div class="dte-panel-head">
          <span class="dte-dot"></span><span class="dte-dot"></span><span class="dte-dot"></span>
          <span class="dte-panel-title">devtools://hidden-layer</span>
          <button type="button" class="dte-close" id="dteClose" aria-label="Close">&times;</button>
        </div>
        <div class="dte-body" id="dteBody"></div>
        <div class="dte-actions" id="dteActions" hidden>
          <a class="dte-btn" href="https://github.com/Osama2214" target="_blank" rel="noopener">GitHub</a>
          <a class="dte-btn" href="https://www.linkedin.com/in/osama-ahmed-67127222a" target="_blank" rel="noopener">LinkedIn</a>
          <a class="dte-btn" href="Osama_Ahmed_CV.pdf" target="_blank" rel="noopener">Resume</a>
        </div>
      </div>`;
    document.body.appendChild(overlay);
    return overlay;
  }

  let dismissTimer = null;
  function scheduleDismiss(overlay, ms) {
    clearTimeout(dismissTimer);
    dismissTimer = setTimeout(() => closeOverlay(overlay), ms);
  }

  function closeOverlay(overlay) {
    clearTimeout(dismissTimer);
    overlay.classList.add('dte-closing');
    document.body.style.overflow = '';
    setTimeout(() => overlay.remove(), 400);
  }

  async function showOverlay() {
    const overlay = buildOverlay();
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => overlay.classList.add('dte-open'));

    const body = overlay.querySelector('#dteBody');
    const actions = overlay.querySelector('#dteActions');
    const closeBtn = overlay.querySelector('#dteClose');

    closeBtn.addEventListener('click', () => closeOverlay(overlay));
    overlay.addEventListener('click', (e) => { if (e.target === overlay) closeOverlay(overlay); });
    const onEsc = (e) => { if (e.key === 'Escape') { closeOverlay(overlay); document.removeEventListener('keydown', onEsc); } };
    document.addEventListener('keydown', onEsc);
    overlay.addEventListener('mouseenter', () => clearTimeout(dismissTimer));
    overlay.addEventListener('mouseleave', () => { if (!overlay.classList.contains('dte-closing')) scheduleDismiss(overlay, 7000); });

    function line(cls) {
      const d = document.createElement('div');
      d.className = 'dte-line ' + (cls || '');
      body.appendChild(d);
      body.scrollTop = body.scrollHeight;
      return d;
    }

    async function type(text, cls, speed) {
      const el = line(cls);
      if (reduceMotion) { el.textContent = text; return el; }
      speed = speed || 14;
      for (let i = 0; i < text.length; i++) {
        el.textContent += text[i];
        body.scrollTop = body.scrollHeight;
        await sleep(speed);
      }
      return el;
    }

    async function progress(steps, totalMs) {
      const el = line('dte-progress');
      if (reduceMotion) { el.textContent = '█'.repeat(steps) + ' 100%'; return; }
      for (let i = 0; i <= steps; i++) {
        el.textContent = '█'.repeat(i) + '░'.repeat(steps - i) + ' ' + Math.round((i / steps) * 100) + '%';
        await sleep(totalMs / steps);
      }
    }

    function checkItem(text) {
      const d = line('dte-check-item');
      d.innerHTML = '<svg class="dte-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg><span>' + text + '</span>';
    }

    // ── System auth ──
    await type('[ System ]', 'dte-heading', 10);
    await type('Developer presence detected...', 'dte-dim');
    line('');
    await type('Authenticating curiosity...', 'dte-dim');
    await progress(20, reduceMotion ? 0 : 700);
    line('');
    await type('Access Level: Developer', 'dte-success');
    await sleep(reduceMotion ? 0 : 400);
    line('');

    // ── Welcome ──
    await type('Welcome, fellow developer.', 'dte-strong');
    line('');
    await type('Most people only browse the portfolio.', 'dte-dim');
    await type('You chose to understand how it works.', 'dte-dim');
    line('');
    await type('I appreciate that.', 'dte-dim');
    line('');

    // ── Real stack (accurate — this site is vanilla, no frameworks) ──
    await type('Frontend', 'dte-heading');
    checkItem('HTML5'); checkItem('CSS3 (modular, hand-written)'); checkItem('Vanilla JavaScript (ES6+, zero build step)');
    line('');
    await type('Backend', 'dte-heading');
    checkItem('Node.js Serverless Functions'); checkItem('REST endpoints (Guestbook, Reactions, GitHub stats)'); checkItem('Upstash Redis');
    line('');
    await type('Deployment', 'dte-heading');
    checkItem('Vercel'); checkItem('Vercel Web Analytics');
    line('');

    // ── Closing ──
    await type('Good code deserves to be inspected.', 'dte-strong');
    line('');
    await type('If you like what you see,', 'dte-dim');
    await type("let's build something together.", 'dte-dim');

    actions.hidden = false;
    requestAnimationFrame(() => actions.classList.add('dte-actions-in'));
    scheduleDismiss(overlay, 7000);
  }

  // ── Console easter egg ──
  function printConsoleEasterEgg() {
    const ascii = `%c██████╗ ███████╗██╗   ██╗
██╔══██╗██╔════╝██║   ██║
██║  ██║█████╗  ██║   ██║
██║  ██║██╔══╝  ╚██╗ ██╔╝
██████╔╝███████╗ ╚████╔╝
╚═════╝ ╚══════╝  ╚═══╝`;
    const accent = 'color:#a78bfa;font-family:monospace;font-weight:bold;';
    const dim = 'color:#94a3b8;font-family:monospace;';
    const gold = 'color:#f59e0b;font-family:monospace;font-weight:bold;';

    console.log(ascii, accent);
    console.log('%cWelcome, Developer \u{1F44B}', accent);
    console.log('%cCuriosity is what builds great engineers.\n\nThanks for taking the time to inspect my work.', dim);
    console.log('%cGitHub:\n%cgithub.com/Osama2214', dim, accent);
    console.log('%cLinkedIn:\n%clinkedin.com/in/osama-ahmed-67127222a', dim, accent);
    console.log('%c\n\u{1F3C6} Achievement Unlocked\nDeveloper Mode\n+100 Curiosity XP', gold);
  }
})();
