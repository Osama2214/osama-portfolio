/* ── GUESTBOOK ── live demo talking to the /api/guestbook serverless function ──
   GET on load to render recent messages, POST to sign it. All user content is
   HTML-escaped before it ever touches innerHTML. Degrades gracefully when the
   backend storage hasn't been configured yet. */
(function () {
  const form   = document.getElementById('gbForm');
  const listEl = document.getElementById('gbList');
  if (!form || !listEl) return;

  const API        = '/api/guestbook';
  const nameInput  = document.getElementById('gb-name');
  const msgInput   = document.getElementById('gb-message');
  const submitBtn  = document.getElementById('gbSubmit');
  const submitLbl  = document.getElementById('gbSubmitLabel');
  const statusEl   = document.getElementById('gbStatus');
  const emptyEl    = document.getElementById('gbEmpty');
  const countEl    = document.getElementById('gbCount');
  const barEl      = document.getElementById('gbCooldownBar');
  const fillEl     = document.getElementById('gbCooldownFill');

  const COOLDOWN = 30; // seconds — must match RL_WINDOW in api/guestbook.js
  let cooldownTimer = null;
  let cooldownEndsAt = 0;

  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));

  function timeAgo(ts) {
    const s = Math.floor((Date.now() - ts) / 1000);
    if (s < 60) return 'just now';
    const m = Math.floor(s / 60); if (m < 60) return m + 'm ago';
    const h = Math.floor(m / 60); if (h < 24) return h + 'h ago';
    const d = Math.floor(h / 24); if (d < 30) return d + 'd ago';
    return new Date(ts).toLocaleDateString();
  }

  function initials(name) {
    const parts = String(name).trim().split(/\s+/).slice(0, 2);
    return parts.map((w) => w[0] || '').join('').toUpperCase() || '?';
  }

  function entryHTML(e) {
    return (
      '<li class="gb-entry">' +
        '<div class="gb-avatar">' + esc(initials(e.name)) + '</div>' +
        '<div class="gb-body">' +
          '<div class="gb-meta">' +
            '<span class="gb-name">' + esc(e.name) + '</span>' +
            '<span class="gb-time">' + esc(timeAgo(e.at)) + '</span>' +
          '</div>' +
          '<p class="gb-msg">' + esc(e.message) + '</p>' +
        '</div>' +
      '</li>'
    );
  }

  function updateCount() {
    if (countEl) countEl.textContent = String(listEl.children.length);
  }

  function render(entries) {
    if (!entries.length) {
      listEl.innerHTML = '';
      if (emptyEl) emptyEl.hidden = false;
      updateCount();
      return;
    }
    if (emptyEl) emptyEl.hidden = true;
    listEl.innerHTML = entries.map(entryHTML).join('');
    updateCount();
  }

  // Clean inline icons (stroke-based, inherit the status colour) — no emoji.
  const STATUS_ICONS = {
    success: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
    error:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
    muted:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>',
  };

  function setStatus(msg, kind) {
    if (!statusEl) return;
    if (!msg) { statusEl.innerHTML = ''; statusEl.className = 'gb-status'; return; }
    statusEl.innerHTML = (STATUS_ICONS[kind] || '') + '<span>' + esc(msg) + '</span>';
    statusEl.className = 'gb-status' + (kind ? ' gb-status-' + kind : '');
  }

  function disableForm(reason) {
    form.classList.add('gb-form-off');
    if (submitBtn) submitBtn.disabled = true;
    if (nameInput) nameInput.disabled = true;
    if (msgInput) msgInput.disabled = true;
    setStatus(reason, 'muted');
  }

  // ── Cooldown timer ─────────────────────────────────────────
  function inCooldown() { return Date.now() < cooldownEndsAt; }
  function remaining() { return Math.max(0, Math.ceil((cooldownEndsAt - Date.now()) / 1000)); }

  function endCooldown() {
    if (cooldownTimer) { clearInterval(cooldownTimer); cooldownTimer = null; }
    cooldownEndsAt = 0;
    submitBtn.disabled = false;
    submitBtn.classList.remove('gb-btn-cooling');
    if (submitLbl) submitLbl.textContent = 'Sign Guestbook';
    if (barEl) barEl.hidden = true;
  }

  function tickCooldown() {
    const s = remaining();
    if (s <= 0) { endCooldown(); return; }
    submitBtn.disabled = true;
    submitBtn.classList.add('gb-btn-cooling');
    if (submitLbl) submitLbl.textContent = 'Wait ' + s + 's';
  }

  function startCooldown(seconds) {
    const secs = Math.max(1, Math.round(seconds || COOLDOWN));
    cooldownEndsAt = Date.now() + secs * 1000;

    // animate the progress bar draining over the remaining time
    if (barEl && fillEl) {
      barEl.hidden = false;
      fillEl.style.transition = 'none';
      fillEl.style.width = '100%';
      void fillEl.offsetWidth; // force reflow so the next transition runs
      fillEl.style.transition = 'width ' + secs + 's linear';
      fillEl.style.width = '0%';
    }

    tickCooldown();
    if (cooldownTimer) clearInterval(cooldownTimer);
    cooldownTimer = setInterval(tickCooldown, 250);
  }

  async function load() {
    try {
      const r = await fetch(API, { headers: { Accept: 'application/json' } });
      const data = await r.json();
      if (data && data.configured === false) {
        if (emptyEl) emptyEl.hidden = true;
        disableForm('The guestbook backend is being set up — check back soon.');
        return;
      }
      render((data && data.entries) || []);
    } catch (err) {
      setStatus('Could not reach the guestbook right now.', 'error');
      if (emptyEl) emptyEl.hidden = true;
    }
  }

  form.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    if (form.website && form.website.value) return; // honeypot tripped

    if (inCooldown()) {
      setStatus('Please wait ' + remaining() + 's before posting again.', 'error');
      return;
    }

    const name = (nameInput.value || '').trim();
    const message = (msgInput.value || '').trim();
    if (!name || !message) {
      setStatus('Please fill in your name and a message.', 'error');
      return;
    }

    submitBtn.disabled = true;
    if (submitLbl) submitLbl.textContent = 'Signing…';
    setStatus('');

    try {
      const r = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, message, website: form.website ? form.website.value : '' }),
      });
      const data = await r.json().catch(() => ({}));

      if (r.ok && data.entry) {
        if (emptyEl) emptyEl.hidden = true;
        listEl.insertAdjacentHTML('afterbegin', entryHTML(data.entry));
        updateCount();
        msgInput.value = '';
        setStatus('Thanks for signing the guestbook!', 'success');
        startCooldown(COOLDOWN);
      } else if (r.status === 429) {
        setStatus(data.error || 'Please wait before posting again.', 'error');
        startCooldown(Number(data.retryAfter) || COOLDOWN);
      } else if (r.status === 503) {
        setStatus(data.error || 'Guestbook is not configured yet.', 'muted');
      } else {
        setStatus(data.error || 'Something went wrong. Please try again.', 'error');
      }
    } catch (err) {
      setStatus('Network error — please try again.', 'error');
    } finally {
      // Don't clobber the cooldown countdown running in the button.
      if (!inCooldown()) {
        submitBtn.disabled = false;
        if (submitLbl) submitLbl.textContent = 'Sign Guestbook';
      }
    }
  });

  load();
})();
