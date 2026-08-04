/* ── PROJECT REACTIONS ── talks to the /api/reactions serverless function ──
   Loads counts on page load, lets a visitor toggle like/love/star per project,
   remembers their own choices in localStorage, and reconciles with the server
   count on every action. Degrades quietly when the backend isn't configured. */
(function () {
  const bars = document.querySelectorAll('.project-reactions');
  if (!bars.length) return;

  const API    = '/api/reactions';
  const LS_KEY = 'portfolio-reactions'; // { "project:type": true }

  const readMine  = () => { try { return JSON.parse(localStorage.getItem(LS_KEY)) || {}; } catch { return {}; } };
  const writeMine = (m) => { try { localStorage.setItem(LS_KEY, JSON.stringify(m)); } catch {} };
  const mine = readMine();

  // Build an index: project -> type -> { btn, countEl }
  const index = {};
  bars.forEach((bar) => {
    const project = bar.dataset.project;
    index[project] = {};
    bar.querySelectorAll('.preact').forEach((btn) => {
      const type = btn.dataset.type;
      const countEl = btn.querySelector('.preact-count');
      index[project][type] = { btn, countEl };
      if (mine[project + ':' + type]) btn.classList.add('preact-on');
      btn.addEventListener('click', () => onReact(project, type));
    });
  });

  function setCount(project, type, n) {
    const cell = index[project] && index[project][type];
    if (cell) cell.countEl.textContent = String(Math.max(0, n));
  }

  async function load() {
    try {
      const r = await fetch(API, { headers: { Accept: 'application/json' } });
      const data = await r.json();
      if (!data || data.configured === false || !data.reactions) return;
      Object.keys(data.reactions).forEach((project) => {
        const counts = data.reactions[project] || {};
        Object.keys(counts).forEach((type) => setCount(project, type, counts[type]));
      });
    } catch (_) { /* leave counts at their default 0 */ }
  }

  async function onReact(project, type) {
    const cell = index[project] && index[project][type];
    if (!cell || cell.btn.disabled) return;

    const key   = project + ':' + type;
    const wasOn = !!mine[key];
    const delta = wasOn ? -1 : 1;
    const prev  = parseInt(cell.countEl.textContent, 10) || 0;

    // Optimistic update
    cell.btn.disabled = true;
    cell.btn.classList.toggle('preact-on', !wasOn);
    cell.btn.classList.add('preact-pop');
    setTimeout(() => cell.btn.classList.remove('preact-pop'), 300);
    setCount(project, type, prev + delta);
    if (wasOn) delete mine[key]; else mine[key] = true;
    writeMine(mine);

    try {
      const r = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ project, type, delta }),
      });
      const data = await r.json().catch(() => ({}));
      if (r.ok && typeof data.count === 'number') {
        setCount(project, type, data.count); // trust the server's number
      } else {
        revert();
      }
    } catch (_) {
      revert();
    } finally {
      cell.btn.disabled = false;
    }

    function revert() {
      setCount(project, type, prev);
      cell.btn.classList.toggle('preact-on', wasOn);
      if (wasOn) mine[key] = true; else delete mine[key];
      writeMine(mine);
    }
  }

  load();
})();
