// ── COMMAND PALETTE (CTRL/CMD + K) ──────────────────────────────
(function () {
  const overlay  = document.getElementById('cmdkOverlay');
  const panel    = document.getElementById('cmdkPanel');
  const input    = document.getElementById('cmdkInput');
  const list     = document.getElementById('cmdkList');
  const trigger  = document.getElementById('cmdkDropdownToggle');
  const mobileTrigger = document.getElementById('mobileCmdkToggle');
  if (!overlay || !input || !list) return;

  const svgHome     = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>';
  const svgUser     = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>';
  const svgCode     = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>';
  const svgGh       = '<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>';
  const svgFolder   = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>';
  const svgAward    = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>';
  const svgMail     = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>';
  const svgBook     = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>';
  const svgTerminal = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>';
  const svgSkull    = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/><path d="M9 16s1-1.5 3-1.5 3 1.5 3 1.5"/></svg>';
  const svgMonitor  = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><polyline points="8 21 12 17 16 21"/></svg>';
  const svgDownload = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>';
  const svgClip     = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="2" width="6" height="4" rx="1"/><path d="M9 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-3"/></svg>';
  const svgExternal = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>';
  const svgSettings = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>';
  const svgBriefcase = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>';

  function scrollTo(hash) {
    const target = document.querySelector(hash);
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function clickEl(id) {
    const el = document.getElementById(id);
    if (el) el.click();
  }

  function showCmdkToast(message) {
    let toast = document.getElementById('cmdkToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'cmdkToast';
      toast.className = 'cmdk-toast';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    requestAnimationFrame(() => toast.classList.add('show'));
    clearTimeout(toast._hideTimer);
    toast._hideTimer = setTimeout(() => toast.classList.remove('show'), 2200);
  }

  const commands = [
    { group: 'Navigate', icon: svgHome, label: 'Go to Home', keywords: 'home hero top', action: () => scrollTo('#home') },
    { group: 'Navigate', icon: svgUser, label: 'Go to About', keywords: 'about me who', action: () => scrollTo('#about') },
    { group: 'Navigate', icon: svgSettings, label: 'Go to Services', keywords: 'services offered web dev backend api database', action: () => scrollTo('#services') },
    { group: 'Navigate', icon: svgFolder, label: 'Go to Projects', keywords: 'projects work munjez cafe', action: () => scrollTo('#projects') },
    { group: 'Navigate', icon: svgBriefcase, label: 'Go to Experience', keywords: 'experience internship depi nti training', action: () => scrollTo('#experience') },
    { group: 'Navigate', icon: svgCode, label: 'Go to Skills', keywords: 'skills stack tech', action: () => scrollTo('#skills') },
    { group: 'Navigate', icon: svgAward, label: 'Go to Education & Certs', keywords: 'education certifications ccna eelu journey', action: () => scrollTo('#education') },
    { group: 'Navigate', icon: svgBook, label: 'Go to Testimonials', keywords: 'testimonials reviews clients feedback', action: () => scrollTo('#testimonials') },
    { group: 'Navigate', icon: svgMail, label: 'Go to Contact', keywords: 'contact message form', action: () => scrollTo('#contact') },

    { group: 'Actions', icon: svgTerminal, label: 'Open Terminal Console', keywords: 'terminal console dev tools', action: () => clickEl('terminalToggle'), hint: 'toggles' },
    { group: 'Actions', icon: svgSkull, label: 'Toggle Hacker Mode', keywords: 'hacker matrix theme green', action: () => clickEl('matrixToggle'), hint: 'toggles' },
    { group: 'Actions', icon: svgMonitor, label: 'Launch Portfolio OS', keywords: 'os desktop launch boot', action: () => clickEl('launchOsBtn') },
    { group: 'Actions', icon: svgDownload, label: 'Download CV', keywords: 'resume cv pdf download', action: () => window.open('Osama_Ahmed_CV.pdf', '_blank') },
    { group: 'Actions', icon: svgClip, label: 'Copy Email Address', keywords: 'email copy contact mail', action: () => {
        navigator.clipboard.writeText('osamaahmed.dev00@gmail.com').then(() => showCmdkToast('Email copied to clipboard!'));
      } },

    { group: 'Links', icon: svgGh, label: 'Open GitHub Profile', keywords: 'github profile osama2214', action: () => window.open('https://github.com/Osama2214', '_blank'), hint: '↗' },
    { group: 'Links', icon: svgExternal, label: 'Open LinkedIn Profile', keywords: 'linkedin connect', action: () => window.open('https://www.linkedin.com/in/osama-ahmed-67127222a', '_blank'), hint: '↗' },
    { group: 'Links', icon: svgExternal, label: 'Open Munjez App Website', keywords: 'munjez app productivity', action: () => window.open('https://munjez-website.vercel.app', '_blank'), hint: '↗' },
  ];

  let filtered = commands.slice();
  let activeIdx = 0;

  function render() {
    if (!filtered.length) {
      list.innerHTML = '<div class="cmdk-empty">No matching commands.</div>';
      return;
    }
    let html = '';
    let lastGroup = null;
    filtered.forEach((cmd, i) => {
      if (cmd.group !== lastGroup) {
        html += `<div class="cmdk-group-label">${cmd.group}</div>`;
        lastGroup = cmd.group;
      }
      html += `<button type="button" class="cmdk-item${i === activeIdx ? ' active' : ''}" data-idx="${i}">${cmd.icon}<span>${cmd.label}</span>${cmd.hint ? `<span class="cmdk-item-hint">${cmd.hint}</span>` : ''}</button>`;
    });
    list.innerHTML = html;
    const activeEl = list.querySelector('.cmdk-item.active');
    if (activeEl) activeEl.scrollIntoView({ block: 'nearest' });
  }

  function filterCommands(query) {
    const q = query.trim().toLowerCase();
    if (!q) {
      filtered = commands.slice();
    } else {
      filtered = commands
        .filter(c => (c.label + ' ' + c.keywords).toLowerCase().includes(q))
        .sort((a, b) => {
          const aStarts = a.label.toLowerCase().startsWith(q) ? 0 : 1;
          const bStarts = b.label.toLowerCase().startsWith(q) ? 0 : 1;
          return aStarts - bStarts;
        });
    }
    activeIdx = 0;
    render();
  }

  function runCommand(idx) {
    const cmd = filtered[idx];
    if (!cmd) return;
    closePalette();
    setTimeout(() => cmd.action(), 80);
  }

  function openPalette() {
    overlay.classList.add('open');
    input.value = '';
    filterCommands('');
    setTimeout(() => input.focus(), 60);
    document.addEventListener('keydown', onKeydown);
  }

  function closePalette() {
    overlay.classList.remove('open');
    input.blur();
    document.removeEventListener('keydown', onKeydown);
  }

  function onKeydown(e) {
    if (e.key === 'Escape') {
      e.preventDefault();
      closePalette();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      activeIdx = Math.min(activeIdx + 1, filtered.length - 1);
      render();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      activeIdx = Math.max(activeIdx - 1, 0);
      render();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      runCommand(activeIdx);
    }
  }

  document.addEventListener('keydown', (e) => {
    // Use e.code (physical key position) instead of e.key so the shortcut
    // still fires under non-Latin keyboard layouts (Arabic, etc.), where
    // the K key produces a different character than "k".
    const isK = e.code === 'KeyK';
    if ((e.ctrlKey || e.metaKey) && isK) {
      e.preventDefault();
      if (overlay.classList.contains('open')) {
        closePalette();
      } else {
        openPalette();
      }
    }
  });

  input.addEventListener('input', () => filterCommands(input.value));

  list.addEventListener('click', (e) => {
    const item = e.target.closest('.cmdk-item');
    if (item) runCommand(Number(item.dataset.idx));
  });

  list.addEventListener('mousemove', (e) => {
    const item = e.target.closest('.cmdk-item');
    if (item) {
      const idx = Number(item.dataset.idx);
      if (idx !== activeIdx) {
        activeIdx = idx;
        render();
      }
    }
  });

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closePalette();
  });

  if (trigger) trigger.addEventListener('click', openPalette);
  if (mobileTrigger) {
    mobileTrigger.addEventListener('click', (e) => {
      e.preventDefault();
      const navMobile = document.getElementById('navMobile');
      const hamburger = document.getElementById('hamburger');
      if (navMobile) navMobile.classList.remove('open');
      if (hamburger) {
        const spans = hamburger.querySelectorAll('span');
        spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
      }
      openPalette();
    });
  }
})();
