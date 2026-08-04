/* ── GITHUB STATS ── pulls live numbers from /api/github and counts them up ── */
(function () {
  const box = document.getElementById('ghStats');
  if (!box) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function countUp(el, target) {
    if (prefersReduced) { el.textContent = target.toLocaleString(); return; }
    const dur = 900, start = performance.now();
    (function tick(now) {
      const p = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(eased * target).toLocaleString();
      if (p < 1) requestAnimationFrame(tick);
    })(start);
  }

  function set(stat, val) {
    const el = box.querySelector('[data-stat="' + stat + '"]');
    if (el && typeof val === 'number') countUp(el, val);
  }

  fetch('/api/github', { headers: { Accept: 'application/json' } })
    .then((r) => r.json())
    .then((data) => {
      if (!data || data.error) { box.style.display = 'none'; return; }
      set('repos', data.repos);
      set('stars', data.stars);
      set('followers', data.followers);
    })
    .catch(() => { box.style.display = 'none'; });
})();
