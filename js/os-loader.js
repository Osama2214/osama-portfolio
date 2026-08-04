/* ── PORTFOLIO OS — lazy loader ──
   The Portfolio OS is ~130KB of JS plus its app/game styles, but it only ever
   appears when the user launches it. So we keep it OUT of the initial page load
   and fetch it on demand the first time the launch button is clicked. Both the
   navbar button and the command palette route through #launchOsBtn, so a single
   interception covers every entry point. */
(function () {
  const btn = document.getElementById('launchOsBtn');
  if (!btn) return;

  const V = '?v=20260804';
  let started = false;

  function inject(tag, attrs) {
    return new Promise((resolve, reject) => {
      const el = document.createElement(tag);
      Object.assign(el, attrs);
      el.onload = resolve;
      el.onerror = reject;
      (tag === 'link' ? document.head : document.body).appendChild(el);
    });
  }

  async function boot() {
    if (started) return;
    started = true;
    btn.classList.add('os-btn-loading');

    // Styles first (fire-and-forget — the boot animation covers their load).
    inject('link', { rel: 'stylesheet', href: 'css/os-apps.css' + V });
    inject('link', { rel: 'stylesheet', href: 'css/os-games.css' + V });

    try {
      // os-games.js must run before portfolio-os.js (it exposes window.buildGame etc.)
      await inject('script', { src: 'js/os-games.js' + V });
      await inject('script', { src: 'js/portfolio-os.js' + V });
      btn.classList.remove('os-btn-loading');
      // portfolio-os.js has now attached the real click handler → trigger the boot.
      btn.click();
    } catch (e) {
      started = false;
      btn.classList.remove('os-btn-loading');
    }
  }

  btn.addEventListener('click', boot, { once: true });
})();
