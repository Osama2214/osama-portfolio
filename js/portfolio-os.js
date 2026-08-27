
/* ══════════════════════════════════════════════════════════════
   PORTFOLIO OS — v1.0.0
══════════════════════════════════════════════════════════════ */
(function PortfolioOS() {
  'use strict';

  // ── DOM References ──────────────────────────────────────────
  const osRoot         = document.getElementById('portfolioOS');
  const bootScreen     = document.getElementById('posBootScreen');
  const desktop        = document.getElementById('posDesktop');
  const windowsCont    = document.getElementById('posWindowsContainer');
  const taskbarApps    = document.getElementById('posTaskbarApps');
  const clockEl        = document.getElementById('posClock');
  const launchBtn      = document.getElementById('launchOsBtn');
  const shutdownBtnTop = document.getElementById('posShutdownBtn');
  const shutdownScreen = document.getElementById('posShutdownScreen');
  const shutdownText   = document.getElementById('posShutdownText');
  const shutdownBarWrap= document.getElementById('posShutdownBarWrap');
  const shutdownBar    = document.getElementById('posShutdownBar');
  const iconsGrid      = document.getElementById('posIconsGrid');
  const dockWrap       = document.getElementById('posDockWrap');

  // Boot status text
  const bootStatusEl = document.getElementById('posBootStatus');
  const BOOT_STAGES  = [
    'Booting Portfolio OS...',
    'Loading Kernel...',
    'Initializing Desktop Environment...',
  ];

  if (!osRoot || !launchBtn) return;

  // ── State ───────────────────────────────────────────────────
  let zTop          = 10;
  let openWindows   = {};          // appId → { el, taskbarBtn, minimized }
  let clockInterval = null;
  let musicEnabled  = false;
  let particlesEnabled = true;
  let osTheme       = 'site-theme';
  let audioCtx      = null;
  let musicNodes    = {};
  let ambientAudio  = null;
  let ambientFadeTimer = null;
  let startupAudio  = null;
  let shutdownAudio = null;
  let desktopIconsReady = false;
  let didDragDesktopIcon = false;
  let brandIconObserver = null;
  let isBooting     = false;
  let isShuttingDown= false;
  const DESKTOP_ICON_POS_KEY = 'portfolio-os-icon-positions-v5';
  const DESKTOP_GRID = { x: 28, y: 28, col: 104, row: 96 };
  const POS_ICONS = {
    github: '<svg class="pos-brand-icon" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.42-4.04-1.42-.55-1.39-1.33-1.76-1.33-1.76-1.09-.74.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.49.99.11-.77.42-1.3.76-1.6-2.66-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23A11.5 11.5 0 0 1 12 5.4c1.02.01 2.05.14 3.01.4 2.29-1.55 3.3-1.23 3.3-1.23.65 1.66.24 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.81 5.62-5.48 5.92.43.37.82 1.1.82 2.22v3.29c0 .32.22.7.82.58A12.01 12.01 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>',
    linkedin: '<svg class="pos-brand-icon" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.23 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.23 0z"/></svg>',
    external: '<svg class="pos-action-icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>',
    download: '<svg class="pos-action-icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M5 21h14"/></svg>'
  };

  // ── App Definitions ─────────────────────────────────────────
  const APP_META = {
    terminal : { title: 'Terminal',  icon: '🖥️',  w: 680, h: 440, x: 140, y: 60  },
    projects : { title: 'Projects',  icon: '📂',  w: 720, h: 480, x: 160, y: 70  },
    resume   : { title: 'Resume',    icon: '📄',  w: 680, h: 500, x: 180, y: 50  },
    browser  : { title: 'Browser',   icon: '🌐',  w: 780, h: 520, x: 120, y: 40  },
    settings : { title: 'Settings',  icon: '⚙️',  w: 400, h: 470, x: 300, y: 80  },
    contact  : { title: 'Contact',   icon: '📧',  w: 420, h: 400, x: 320, y: 100 },
    trash    : { title: 'Trash',     icon: '🗑️',  w: 380, h: 300, x: 350, y: 120 },
    games    : { title: 'Games',     icon: '🎮',  w: 420, h: 320, x: 260, y: 70  },
    snake    : { title: 'Snake',     icon: '🐍',  w: 400, h: 520, x: 200, y: 60  },
    xo       : { title: 'Tic-Tac-Toe', icon: '❌',  w: 380, h: 480, x: 220, y: 60 },
    flappy   : { title: 'Flappy Bird', icon: '🐦',  w: 420, h: 560, x: 240, y: 50 },
  };
  const GAME_APP_IDS = ['snake', 'xo', 'flappy'];

  // Project data — matches the real projects on the site
  const PROJECTS = [
    {
      id: 'munjez',
      name: 'Munjez',
      icon: '🖥️',
      iconImg: 'https://munjez-website.vercel.app/screenshots/icon.webp',
      liveLabel: '⬇️ Download Now',
      badge: 'Featured',
      type: 'Productivity Desktop App',
      desc: 'A full-featured offline productivity app — Tasks, Calendar (Hijri), Pomodoro, Habits, Stopwatch & White Noise. Built solo, runs natively on Windows, Linux & Android. No account, no internet required.',
      tech: ['React', 'TypeScript', 'Tauri', 'Rust', 'Vite', 'Firebase'],
      live: 'https://munjez-website.vercel.app',
      github: 'https://github.com/Osama2214/munjez-releases',
    },
    {
      id: 'munjez-website',
      name: 'Munjez Website',
      icon: '🌐',
      iconImg: 'icons/munjez-icon.webp',
      badge: 'Open Source',
      type: 'Marketing & Landing Page',
      desc: 'The official marketing website for Munjez — bilingual (Arabic & English), full changelog, download links, and privacy policy. Built as a static site with pure HTML, CSS & JS.',
      tech: ['HTML', 'CSS', 'JavaScript', 'Vercel'],
      live: 'https://munjez-website.vercel.app',
      github: 'https://github.com/Osama2214/munjez-website',
    },
    {
      id: 'pc-builder',
      name: 'PC Builder',
      icon: '🖥️',
      iconImg: 'icons/pc-builder-icon.svg',
      badge: 'Open Source',
      type: 'E-Commerce & Build Compatibility Platform',
      desc: 'A full-stack e-commerce platform for PC components built around a "Build a PC" flow that verifies part compatibility (socket, RAM type, PSU wattage, GPU/case fit). Full admin panel and an AI chat assistant that can build a cart or a PC build from the conversation.',
      tech: ['Laravel', 'PHP', 'JavaScript', 'PostgreSQL', 'Sanctum', 'Vercel'],
      live: 'https://pc-builder-sandy.vercel.app/',
      github: 'https://github.com/Osama2214/pc-builder',
    },
    {
      id: 'osama-cafe',
      name: 'Osama Café',
      icon: '☕',
      iconImg: 'icons/osama-cafe-logo.png',
      iconStyle: 'filter:brightness(1.6)',
      badge: 'Open Source',
      type: 'Coffee Shop Website & Admin Dashboard',
      desc: 'A coffee shop and roastery site with a real PHP backend behind it, not just a static page. Visitors get a fast, animated front end; the owner gets a password-protected admin dashboard to manage the menu, gallery, testimonials, and FAQ with no code changes, plus a contact form and newsletter signup that save to a real database and send automatic email.',
      tech: ['PHP', 'PDO', 'SQLite / MySQL', 'PHPMailer', 'JavaScript'],
      live: 'https://osama-cafe.onrender.com/',
      github: 'https://github.com/Osama2214/NTI-Full-Stack-Web-Development/tree/main/Task-2/osama-cafe',
    },
  ];

  // Renders a project's real icon image when available, falling back to its emoji.
  function projectIconHTML(p, size) {
    if (p.iconImg) {
      return `<img src="${p.iconImg}" alt="${p.name}" style="width:${size}px;height:${size}px;object-fit:contain;border-radius:6px;${p.iconStyle || ''}" loading="lazy" onerror="this.replaceWith(Object.assign(document.createElement('span'),{textContent:'${p.icon}',style:'font-size:${size - 2}px'}))" />`;
    }
    return `<span style="font-size:${size - 2}px">${p.icon}</span>`;
  }

  // ── Launch Button ────────────────────────────────────────────
  launchBtn.addEventListener('click', () => {
    if (!isBooting) startOS();
  });

  // ESC to exit during boot only
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isBooting) exitOS();
  });

  // ── Boot Sequence ────────────────────────────────────────────
  function startOS() {
    isBooting = true;
    document.documentElement.classList.add('pos-os-active');
    document.body.classList.add('pos-os-active');
    document.body.style.overflow = 'hidden';
    osRoot.classList.remove('pos-hidden');
    applyOsTheme('site-theme');
    setupOsBrandIcons();
    bootScreen.classList.remove('pos-hidden');
    desktop.classList.add('pos-hidden');
    shutdownScreen.classList.add('pos-hidden');

    // Reset status text
    if (bootStatusEl) bootStatusEl.textContent = BOOT_STAGES[0];

    // Cycle through stages with fade transitions
    cycleBootText(0);
  }

  async function cycleBootText(idx) {
    const delays = [1500, 1200, 1000];
    if (idx >= BOOT_STAGES.length) {
      await sleep(300);
      showDesktop();
      return;
    }
    if (bootStatusEl) {
      bootStatusEl.classList.remove('pos-status-fade');
      bootStatusEl.textContent = BOOT_STAGES[idx];
    }
    await sleep(delays[idx]);
    if (bootStatusEl) bootStatusEl.classList.add('pos-status-fade');
    await sleep(280);
    cycleBootText(idx + 1);
  }

  function showDesktop() {
    bootScreen.classList.add('pos-hidden');
    desktop.classList.remove('pos-hidden');
    isBooting = false;
    layoutIconsWhenReady();
    startClock();
    playStartupSound();
    if (musicEnabled) startAmbientMusic();
  }

  // ── Clock ────────────────────────────────────────────────────
  function startClock() {
    function updateClock() {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
      clockEl.textContent = `${h}:${m}  ${days[now.getDay()]}`;
    }
    updateClock();
    clockInterval = setInterval(updateClock, 10000);
  }

  // ── Desktop Icon Click ───────────────────────────────────────
  function setupOsBrandIcons() {
    decorateOsBrandLinks(osRoot);
    if (brandIconObserver) return;
    brandIconObserver = new MutationObserver((mutations) => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE) decorateOsBrandLinks(node);
        });
      });
    });
    brandIconObserver.observe(osRoot, { childList: true, subtree: true });
  }

  function decorateOsBrandLinks(root) {
    if (!root || !root.querySelectorAll) return;
    root.querySelectorAll('a.pos-file-detail-link, a.pos-contact-link').forEach(link => {
      if (link.dataset.brandIconReady === 'true') return;
      const label = link.textContent.toLowerCase();
      let icon = '';
      let text = '';
      if (label.includes('github')) {
        icon = POS_ICONS.github;
        text = 'GitHub';
      } else if (label.includes('linkedin')) {
        icon = POS_ICONS.linkedin;
        text = 'LinkedIn';
      } else {
        return;
      }
      link.dataset.brandIconReady = 'true';
      const contactIcon = link.querySelector('.pos-contact-link-icon');
      if (contactIcon) {
        contactIcon.innerHTML = icon;
      } else {
        link.innerHTML = `${icon}<span>${text}</span>`;
      }
    });
  }

  iconsGrid.addEventListener('click', (e) => {
    if (didDragDesktopIcon) {
      didDragDesktopIcon = false;
      return;
    }
    const icon = e.target.closest('.pos-icon');
    if (!icon) return;
    const appId = icon.dataset.app;
    if (appId) openApp(appId);
  });

  // Double-click to reopen
  iconsGrid.addEventListener('dblclick', (e) => {
    const icon = e.target.closest('.pos-icon');
    if (!icon) return;
    const appId = icon.dataset.app;
    if (appId && openWindows[appId]) focusWindow(openWindows[appId].el);
  });

  // ── Desktop Context Menu (right-click) ────────────────────────
  let ctxMenuEl = null;

  function closeContextMenu() {
    if (!ctxMenuEl) return;
    ctxMenuEl.remove();
    ctxMenuEl = null;
    document.removeEventListener('mousedown', onCtxOutsideClick, true);
    document.removeEventListener('keydown', onCtxEscape, true);
    window.removeEventListener('blur', closeContextMenu);
  }
  function onCtxOutsideClick(e) {
    if (ctxMenuEl && !ctxMenuEl.contains(e.target)) closeContextMenu();
  }
  function onCtxEscape(e) {
    if (e.key === 'Escape') closeContextMenu();
  }

  function openContextMenu(clientX, clientY, items) {
    closeContextMenu();

    const menu = document.createElement('div');
    menu.className = 'pos-context-menu';
    menu.innerHTML = items.map(item => item.sep
      ? '<div class="pos-ctx-sep"></div>'
      : `<button class="pos-ctx-item" type="button" data-key="${item.key}">
           <span class="pos-ctx-icon">${item.icon || ''}</span><span>${item.label}</span>
         </button>`
    ).join('');

    desktop.appendChild(menu);
    ctxMenuEl = menu;

    // Position, clamped so it never spills off-screen
    const mw = menu.offsetWidth, mh = menu.offsetHeight;
    const x = Math.max(8, Math.min(clientX, window.innerWidth  - mw - 8));
    const y = Math.max(8, Math.min(clientY, window.innerHeight - mh - 8));
    menu.style.left = x + 'px';
    menu.style.top  = y + 'px';
    requestAnimationFrame(() => menu.classList.add('pos-ctx-open'));

    menu.addEventListener('click', (e) => {
      const btn = e.target.closest('.pos-ctx-item');
      if (!btn) return;
      const item = items.find(i => i.key === btn.dataset.key);
      closeContextMenu();
      if (item && item.action) item.action();
    });

    document.addEventListener('mousedown', onCtxOutsideClick, true);
    document.addEventListener('keydown', onCtxEscape, true);
    window.addEventListener('blur', closeContextMenu);
  }

  function resetAllDesktopIconPositions() {
    Array.from(iconsGrid.querySelectorAll('.pos-icon')).forEach((icon, index) => {
      const pos = getDefaultIconPosition(index, icon);
      setDesktopIconPosition(icon, pos.x, pos.y);
    });
    saveDesktopIconPositions();
  }

  function cycleOsTheme() {
    const order = ['site-purple', 'cyan-blue', 'deep-violet'];
    applyOsTheme(order[(order.indexOf(osTheme) + 1) % order.length]);
  }

  desktop.addEventListener('contextmenu', (e) => {
    if (e.target.closest('.pos-window') || e.target.closest('.pos-topbar') || e.target.closest('.pos-dock-wrap')) return;
    e.preventDefault();

    const iconEl = e.target.closest('.pos-icon');

    if (iconEl) {
      const appId = iconEl.dataset.app;
      const meta = APP_META[appId];
      openContextMenu(e.clientX, e.clientY, [
        { key: 'open',  icon: '↗', label: `Open ${meta ? meta.title : ''}`, action: () => openApp(appId) },
        { sep: true },
        { key: 'reset', icon: '⟲', label: 'Reset Icon Position', action: () => {
            const idx = Array.from(iconsGrid.querySelectorAll('.pos-icon')).indexOf(iconEl);
            const pos = getDefaultIconPosition(idx, iconEl);
            setDesktopIconPosition(iconEl, pos.x, pos.y);
            saveDesktopIconPositions(iconEl);
          } },
      ]);
      return;
    }

    openContextMenu(e.clientX, e.clientY, [
      { key: 'refresh', icon: '⟳', label: 'Refresh', action: () => {
          desktop.classList.add('pos-desktop-refresh');
          setTimeout(() => desktop.classList.remove('pos-desktop-refresh'), 300);
        } },
      { sep: true },
      { key: 'arrange', icon: '▦', label: 'Arrange Icons', action: resetAllDesktopIconPositions },
      { key: 'theme',   icon: '🎨', label: 'Next Wallpaper Theme', action: cycleOsTheme },
      { sep: true },
      { key: 'terminal', icon: '🖥️', label: 'Open Terminal Here', action: () => openApp('terminal') },
      { key: 'settings', icon: '⚙️', label: 'Display Settings', action: () => openApp('settings') },
    ]);
  });

  // ── App Launcher ─────────────────────────────────────────────
  // Wait until the desktop has actually been laid out (a freshly-shown grid can
  // report clientWidth 0 for a frame or two) so icons aren't all clamped to 0,0.
  function layoutIconsWhenReady(tries) {
    tries = tries || 0;
    if (iconsGrid.clientWidth > 0 || tries > 20) { initDesktopIconLayout(); return; }
    setTimeout(() => layoutIconsWhenReady(tries + 1), 50);
  }

  function initDesktopIconLayout() {
    const icons = Array.from(iconsGrid.querySelectorAll('.pos-icon'));
    const saved = getSavedDesktopIconPositions();

    // One-time cleanup: earlier versions could freeze Trash's position into
    // localStorage (see saveDesktopIconPositions above), overriding its
    // "always the live bottom-right corner" default with a stale (x,y) from
    // whatever the window size happened to be at save time. Drop it so
    // anyone who already tripped that bug self-heals back to the corner.
    if (saved.trash) {
      delete saved.trash;
      localStorage.setItem(DESKTOP_ICON_POS_KEY, JSON.stringify(saved));
    }

    icons.forEach((icon, index) => {
      const appId = icon.dataset.app;
      const pos = saved[appId] || getDefaultIconPosition(index, icon);
      setDesktopIconPosition(icon, pos.x, pos.y);
      if (!icon.dataset.dragReady) {
        makeDesktopIconDraggable(icon);
        icon.dataset.dragReady = 'true';
      }
    });

    desktopIconsReady = true;
  }

  function getDefaultIconPosition(index, icon) {
    if (icon && icon.dataset.app === 'trash') {
      return clampDesktopIconPosition(Infinity, Infinity, icon);
    }
    const gh = (iconsGrid && iconsGrid.clientHeight) ? iconsGrid.clientHeight : (window.innerHeight - 110);
    const availableHeight = Math.max(200, gh - DESKTOP_GRID.y - 30);
    const maxRowsPerCol = Math.max(1, Math.floor(availableHeight / DESKTOP_GRID.row));

    const col = Math.floor(index / maxRowsPerCol);
    const row = index % maxRowsPerCol;

    return {
      x: DESKTOP_GRID.x + col * DESKTOP_GRID.col,
      y: DESKTOP_GRID.y + row * DESKTOP_GRID.row
    };
  }

  function getSavedDesktopIconPositions() {
    try {
      return JSON.parse(localStorage.getItem(DESKTOP_ICON_POS_KEY) || '{}') || {};
    } catch (err) {
      return {};
    }
  }

  // Persists only the icon that was actually dragged, merged into whatever's
  // already saved — NOT every icon's current on-screen position. Trash has no
  // fixed slot: its default position is computed live from the current window
  // size (bottom-right corner) every time it's untouched. Saving all icons here
  // used to freeze that live corner position into a static (x,y) the moment
  // *any* icon was dragged — including ones the user never touched — so Trash
  // would silently stop tracking the corner and appear to have "moved" on a
  // later visit at a different window size, even though nobody dragged it.
  // draggedIcon omitted → bulk save (e.g. "Arrange Icons"): persists every
  // icon *except* Trash, which must never be frozen into a static (x,y) — see
  // above. draggedIcon passed → persists just that one icon; if the user
  // deliberately drags Trash itself, that's an intentional move and is honored.
  function saveDesktopIconPositions(draggedIcon) {
    const positions = getSavedDesktopIconPositions();
    const icons = draggedIcon ? [draggedIcon] : Array.from(iconsGrid.querySelectorAll('.pos-icon'));
    icons.forEach(icon => {
      if (icon.dataset.app === 'trash' && icon !== draggedIcon) return;
      positions[icon.dataset.app] = {
        x: parseFloat(icon.style.left) || 0,
        y: parseFloat(icon.style.top) || 0
      };
    });
    localStorage.setItem(DESKTOP_ICON_POS_KEY, JSON.stringify(positions));
  }

  function clampDesktopIconPosition(x, y, icon) {
    // Fall back to viewport / default icon size if the grid isn't measured yet,
    // so positions never collapse to (0,0) and stack the icons.
    const gw = iconsGrid.clientWidth  || window.innerWidth;
    const gh = iconsGrid.clientHeight || window.innerHeight;
    const iw = icon.offsetWidth  || 80;
    const ih = icon.offsetHeight || 68;
    const maxX = Math.max(0, gw - iw - 8);
    const maxY = Math.max(0, gh - ih - 8);
    return {
      x: Math.min(Math.max(8, x), maxX),
      y: Math.min(Math.max(8, y), maxY)
    };
  }

  function findNearestFreeSlot(targetX, targetY, excludeIcon) {
    const allIcons = Array.from(iconsGrid.querySelectorAll('.pos-icon'));
    const occupied = new Set(allIcons.filter(o => o !== excludeIcon).map(o => {
      const ox = Math.round(parseFloat(o.style.left) || 0);
      const oy = Math.round(parseFloat(o.style.top) || 0);
      return `${ox},${oy}`;
    }));

    for (let radius = 0; radius < 15; radius++) {
      for (let dx = -radius; dx <= radius; dx++) {
        for (let dy = -radius; dy <= radius; dy++) {
          if (Math.abs(dx) !== radius && Math.abs(dy) !== radius) continue;
          const gx = Math.max(0, Math.round((targetX - DESKTOP_GRID.x) / DESKTOP_GRID.col) + dx);
          const gy = Math.max(0, Math.round((targetY - DESKTOP_GRID.y) / DESKTOP_GRID.row) + dy);
          const px = DESKTOP_GRID.x + gx * DESKTOP_GRID.col;
          const py = DESKTOP_GRID.y + gy * DESKTOP_GRID.row;
          const clamped = clampDesktopIconPosition(px, py, excludeIcon);
          const key = `${Math.round(clamped.x)},${Math.round(clamped.y)}`;
          if (!occupied.has(key)) {
            return clamped;
          }
        }
      }
    }
    return clampDesktopIconPosition(targetX, targetY, excludeIcon);
  }

  function snapDesktopIconPosition(x, y, icon, startLeft, startTop) {
    if (icon && icon.dataset.app === 'trash') {
      const defaultTrashPos = clampDesktopIconPosition(Infinity, Infinity, icon);
      if (Math.abs(x - defaultTrashPos.x) < 90 && Math.abs(y - defaultTrashPos.y) < 90) {
        return defaultTrashPos;
      }
    }

    const rawCol = Math.max(0, Math.round((x - DESKTOP_GRID.x) / DESKTOP_GRID.col));
    const rawRow = Math.max(0, Math.round((y - DESKTOP_GRID.y) / DESKTOP_GRID.row));
    const snappedX = DESKTOP_GRID.x + rawCol * DESKTOP_GRID.col;
    const snappedY = DESKTOP_GRID.y + rawRow * DESKTOP_GRID.row;
    let targetPos = clampDesktopIconPosition(snappedX, snappedY, icon);

    // Collision detection: Check if another icon is occupying the target slot
    const allIcons = Array.from(iconsGrid.querySelectorAll('.pos-icon'));
    const conflictingIcon = allIcons.find(other => {
      if (other === icon) return false;
      const ox = parseFloat(other.style.left) || 0;
      const oy = parseFloat(other.style.top) || 0;
      return Math.abs(ox - targetPos.x) < 20 && Math.abs(oy - targetPos.y) < 20;
    });

    if (conflictingIcon) {
      // Swap conflicting icon to dragged icon's original starting slot (or nearest free slot)
      const freePos = findNearestFreeSlot(startLeft, startTop, conflictingIcon);
      conflictingIcon.style.left = freePos.x + 'px';
      conflictingIcon.style.top = freePos.y + 'px';
      saveDesktopIconPositions(conflictingIcon);
    }

    return targetPos;
  }

  function setDesktopIconPosition(icon, x, y) {
    const pos = clampDesktopIconPosition(x, y, icon);
    icon.style.left = pos.x + 'px';
    icon.style.top = pos.y + 'px';
  }

  function setDesktopIconSnappedPosition(icon, x, y, startLeft, startTop) {
    const pos = snapDesktopIconPosition(x, y, icon, startLeft, startTop);
    icon.style.left = pos.x + 'px';
    icon.style.top = pos.y + 'px';
  }

  function makeDesktopIconDraggable(icon) {
    let dragging = false;
    let pointerId = null;
    let startX = 0, startY = 0, startLeft = 0, startTop = 0;

    icon.addEventListener('pointerdown', (e) => {
      if (e.button !== 0) return;
      dragging = true;
      pointerId = e.pointerId;
      didDragDesktopIcon = false;
      startX = e.clientX;
      startY = e.clientY;
      startLeft = parseFloat(icon.style.left) || 0;
      startTop = parseFloat(icon.style.top) || 0;
      icon.setPointerCapture(pointerId);
    });

    icon.addEventListener('pointermove', (e) => {
      if (!dragging || e.pointerId !== pointerId) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      if (!didDragDesktopIcon && Math.hypot(dx, dy) < 6) return;
      didDragDesktopIcon = true;
      icon.classList.add('pos-icon-dragging');
      setDesktopIconPosition(icon, startLeft + dx, startTop + dy);
    });

    icon.addEventListener('pointerup', (e) => {
      if (!dragging || e.pointerId !== pointerId) return;
      dragging = false;
      icon.classList.remove('pos-icon-dragging');
      try { icon.releasePointerCapture(pointerId); } catch (err) {}
      if (didDragDesktopIcon) {
        setDesktopIconSnappedPosition(icon, parseFloat(icon.style.left) || 0, parseFloat(icon.style.top) || 0, startLeft, startTop);
        saveDesktopIconPositions(icon);
      }
    });

    icon.addEventListener('pointercancel', () => {
      dragging = false;
      icon.classList.remove('pos-icon-dragging');
    });
  }

  // Re-clamp icons so a shrinking window doesn't push them off-screen — for
  // this session only. This used to also call saveDesktopIconPositions(),
  // which is the main way Trash's live "always the bottom-right corner"
  // position got permanently frozen into a stale (x,y): resize fires on
  // every browser maximize/restore/zoom, so nearly any visit would eventually
  // trigger it and leave Trash stuck wherever the window happened to be that
  // one time, even though the user never touched an icon. A fresh page load
  // already recomputes everyone's position correctly via
  // initDesktopIconLayout(), so nothing needs to be persisted here.
  window.addEventListener('resize', () => {
    if (!desktopIconsReady) return;
    const saved = getSavedDesktopIconPositions();
    Array.from(iconsGrid.querySelectorAll('.pos-icon')).forEach((icon, index) => {
      // No saved (user-placed) position for this icon → it's still on its
      // live default, so recompute that default for the new window size
      // instead of just clamping the old pixel value. This is what actually
      // keeps Trash glued to the corner as the window is resized, rather
      // than leaving it stranded wherever it happened to be before.
      if (!saved[icon.dataset.app]) {
        const pos = getDefaultIconPosition(index, icon);
        setDesktopIconPosition(icon, pos.x, pos.y);
      } else {
        setDesktopIconPosition(icon, parseFloat(icon.style.left) || 0, parseFloat(icon.style.top) || 0);
      }
    });
  });

  function openApp(appId) {
    // If already open, restore + focus
    if (openWindows[appId]) {
      const state = openWindows[appId];
      if (state.el.classList.contains('pos-win-minimized')) {
        restoreWindow(appId);
      } else {
        focusWindow(state.el);
      }
      return;
    }

    const meta = APP_META[appId];
    if (!meta) return;

    // Stagger offset if multiple windows
    const offset = Object.keys(openWindows).length * 22;
    const winEl = createWindow(appId, meta, offset);
    windowsCont.appendChild(winEl);

    // Build app content
    const body = winEl.querySelector('.pos-win-body');
    buildAppContent(appId, body);

    // Taskbar
    const taskBtn = createTaskbarBtn(meta.icon, meta.title, appId);
    taskbarApps.appendChild(taskBtn);

    openWindows[appId] = { el: winEl, taskbarBtn: taskBtn, minimized: false };
    focusWindow(winEl);

    makeWindowDraggable(winEl);
    makeWindowResizable(winEl);

    // Release the one-shot entrance animation once it finishes so it stops
    // pinning `transform` — otherwise it would fight with the genie
    // minimize/restore animation later.
    setTimeout(() => { winEl.style.animation = 'none'; }, 260);
  }

  // ── Window Factory ───────────────────────────────────────────
  function createWindow(appId, meta, offset) {
    const el = document.createElement('div');
    el.className = 'pos-window';
    el.dataset.appId = appId;

    // Position
    const maxX = window.innerWidth  - meta.w - 40;
    const maxY = window.innerHeight - meta.h - 80;
    const x = Math.min(meta.x + offset, Math.max(120, maxX));
    const y = Math.min(meta.y + offset, Math.max(50,  maxY));
    el.style.cssText = `width:${meta.w}px;height:${meta.h}px;left:${x}px;top:${y}px`;

    el.innerHTML = `
      <div class="pos-win-header" data-win-handle>
        <div class="pos-win-title">
          <span class="pos-win-icon">${meta.icon}</span>
          <span>${meta.title}</span>
        </div>
        <div class="pos-win-controls">
          <button class="pos-win-btn pos-win-minimize" title="Minimize">─</button>
          <button class="pos-win-btn pos-win-maximize" title="Maximize">□</button>
          <button class="pos-win-btn pos-win-close" title="Close">✕</button>
        </div>
      </div>
      <div class="pos-win-body"></div>
      <div class="pos-win-resize"></div>
    `;

    // Control buttons
    el.querySelector('.pos-win-close').addEventListener('click', () => closeWindow(appId));
    el.querySelector('.pos-win-minimize').addEventListener('click', () => minimizeWindow(appId));
    el.querySelector('.pos-win-maximize').addEventListener('click', () => maximizeWindow(appId));

    // Focus on click
    el.addEventListener('mousedown', () => focusWindow(el), true);

    return el;
  }

  // ── Window Controls ──────────────────────────────────────────
  function updateDockVisibility() {
    const gameMaximized = Object.keys(openWindows).some(id => {
      const el = openWindows[id].el;
      return GAME_APP_IDS.includes(id) &&
        el.classList.contains('pos-win-maximized') &&
        !el.classList.contains('pos-win-minimized') &&
        !el.classList.contains('pos-win-minimizing');
    });
    if (dockWrap) dockWrap.classList.toggle('pos-dock-hidden', gameMaximized);
  }

  function focusWindow(el) {
    // Unfocus all
    document.querySelectorAll('.pos-window').forEach(w => w.classList.remove('pos-win-focused'));
    document.querySelectorAll('.pos-taskbar-app').forEach(b => b.classList.remove('pos-app-active'));

    el.classList.add('pos-win-focused');
    el.style.zIndex = ++zTop;

    const appId = el.dataset.appId;
    const state = openWindows[appId];
    if (state && state.taskbarBtn) state.taskbarBtn.classList.add('pos-app-active');
    updateDockVisibility();
  }

  function closeWindow(appId) {
    const state = openWindows[appId];
    if (!state || state.closing) return;
    state.closing = true;
    const { el, taskbarBtn } = state;

    const isLastApp = Object.keys(openWindows).length === 1;

    if (el) {
      el.classList.remove('pos-win-focused');
      el.classList.add('pos-win-minimizing');
    }

    // Genie animate window sucking down into taskbar icon
    genieAnimate(el, taskbarBtn, 'out', () => {
      if (el) el.remove();

      if (taskbarBtn) {
        const dockEl = taskbarBtn.closest('.pos-dock');
        if (isLastApp && dockEl) {
          dockEl.classList.add('pos-dock-closing-last');
        }
        taskbarBtn.classList.add('pos-taskbar-closing');

        setTimeout(() => {
          if (taskbarBtn) taskbarBtn.remove();
          delete openWindows[appId];
          if (dockEl) dockEl.classList.remove('pos-dock-closing-last');
          updateDockVisibility();
        }, 220);
      } else {
        delete openWindows[appId];
        updateDockVisibility();
      }
    });
  }

  function minimizeWindow(appId) {
    const state = openWindows[appId];
    if (!state || state.el.classList.contains('pos-win-minimized') || state.el.classList.contains('pos-win-minimizing')) return;
    const el = state.el;
    state.minimized = true;
    el.classList.remove('pos-win-focused');
    el.classList.add('pos-win-minimizing');
    state.taskbarBtn && state.taskbarBtn.classList.remove('pos-app-active');
    updateDockVisibility();
    genieAnimate(el, state.taskbarBtn, 'out', () => {
      el.classList.remove('pos-win-minimizing');
      el.classList.add('pos-win-minimized');
    });
  }

  function restoreWindow(appId) {
    const state = openWindows[appId];
    if (!state) return;
    const el = state.el;
    el.classList.remove('pos-win-minimized', 'pos-win-minimizing');
    state.minimized = false;
    genieAnimate(el, state.taskbarBtn, 'in');
    focusWindow(el);
  }

  function toggleMinimize(appId) {
    const state = openWindows[appId];
    if (!state) return;
    if (state.el.classList.contains('pos-win-minimized')) {
      restoreWindow(appId);
    } else if (state.el.classList.contains('pos-win-focused')) {
      minimizeWindow(appId);
    } else {
      focusWindow(state.el);
    }
  }

  // ── Genie-style minimize/restore animation ──────────────────
  // Approximates the macOS "genie effect" by animating a scale + translate
  // from the window's own rect toward its dock icon's rect (and back).
  function genieAnimate(win, btn, direction, onDone) {
    if (!btn) { onDone && onDone(); return; }

    const winRect = win.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();

    const dx = (btnRect.left + btnRect.width  / 2) - (winRect.left + winRect.width  / 2);
    const dy = (btnRect.top  + btnRect.height / 2) - (winRect.top  + winRect.height / 2);
    const sx = Math.max(0.04, btnRect.width  / winRect.width);
    const sy = Math.max(0.04, btnRect.height / winRect.height);
    const shrunk = `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`;

    win.style.transformOrigin = '50% 50%';

    let done = false;
    let fallbackTimer = null;

    function finishAnimation() {
      if (done) return;
      done = true;
      win.removeEventListener('transitionend', onTransitionEnd);
      if (fallbackTimer) clearTimeout(fallbackTimer);
      win.style.transition = '';
      if (direction === 'in') { win.style.transform = ''; win.style.opacity = ''; }
      onDone && onDone();
    }

    function onTransitionEnd(e) {
      if (e.target !== win || e.propertyName !== 'transform') return;
      finishAnimation();
    }

    if (direction === 'out') {
      win.style.transition = 'transform 0.34s cubic-bezier(0.55,0,0.85,0.35), opacity 0.22s ease 0.12s';
      win.addEventListener('transitionend', onTransitionEnd);
      fallbackTimer = setTimeout(finishAnimation, 430);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          win.style.transform = shrunk;
          win.style.opacity = '0';
        });
      });
    } else {
      win.style.transition = 'none';
      win.style.transform = shrunk;
      win.style.opacity = '0';
      void win.offsetWidth; // force reflow before animating back
      win.style.transition = 'transform 0.4s cubic-bezier(0.16,1,0.3,1), opacity 0.3s ease';
      win.addEventListener('transitionend', onTransitionEnd);
      fallbackTimer = setTimeout(finishAnimation, 500);
      requestAnimationFrame(() => {
        win.style.transform = 'translate(0,0) scale(1)';
        win.style.opacity = '1';
      });
    }
  }

  function maximizeWindow(appId) {
    const state = openWindows[appId];
    if (!state) return;
    const el = state.el;
    const wasMax = el.classList.contains('pos-win-maximized');
    if (!wasMax) {
      // Save previous size/pos
      el.dataset.prevStyle = el.getAttribute('style');
      el.classList.add('pos-win-maximized');
    } else {
      el.classList.remove('pos-win-maximized');
      if (el.dataset.prevStyle) el.setAttribute('style', el.dataset.prevStyle);
    }
    el.dispatchEvent(new Event('pos-win-resize'));
    updateDockVisibility();
  }

  // ── Draggable ────────────────────────────────────────────────
  function makeWindowDraggable(win) {
    const header = win.querySelector('[data-win-handle]');
    let startX, startY, startL, startT, dragging = false;

    header.addEventListener('mousedown', (e) => {
      if (e.target.closest('.pos-win-controls')) return;
      if (win.classList.contains('pos-win-maximized')) return;
      dragging = true;
      startX = e.clientX; startY = e.clientY;
      startL = parseInt(win.style.left) || 0;
      startT = parseInt(win.style.top)  || 0;
      header.classList.add('pos-dragging');
      e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
      if (!dragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      const topbarH = 40;
      const newLeft = Math.max(0, startL + dx);
      const newTop  = Math.max(topbarH, startT + dy);
      win.style.left = newLeft + 'px';
      win.style.top  = newTop  + 'px';
    });

    document.addEventListener('mouseup', () => {
      if (dragging) {
        dragging = false;
        header.classList.remove('pos-dragging');
      }
    });
  }

  // ── Resizable ────────────────────────────────────────────────
  function makeWindowResizable(win) {
    const handle = win.querySelector('.pos-win-resize');
    let resizing = false, startX, startY, startW, startH;

    handle.addEventListener('mousedown', (e) => {
      if (win.classList.contains('pos-win-maximized')) return;
      resizing = true;
      startX = e.clientX; startY = e.clientY;
      startW = win.offsetWidth; startH = win.offsetHeight;
      e.preventDefault(); e.stopPropagation();
    });

    document.addEventListener('mousemove', (e) => {
      if (!resizing) return;
      const newW = Math.max(320, startW + (e.clientX - startX));
      const newH = Math.max(200, startH + (e.clientY - startY));
      win.style.width  = newW + 'px';
      win.style.height = newH + 'px';
      win.dispatchEvent(new Event('pos-win-resize'));
    });

    document.addEventListener('mouseup', () => { resizing = false; });
  }

  // ── Taskbar Button ───────────────────────────────────────────
  function createTaskbarBtn(icon, title, appId) {
    const btn = document.createElement('button');
    btn.className = 'pos-taskbar-app pos-app-running pos-taskbar-opening';
    btn.title = title;

    const dtImg = iconsGrid ? iconsGrid.querySelector(`.pos-icon[data-app="${appId}"] .pos-app-3d-img`) : null;
    const iconHTML = dtImg ? dtImg.outerHTML : `<span style="font-size:20px">${icon}</span>`;

    btn.innerHTML = `<span class="pos-taskbar-icon">${iconHTML}</span><span class="pos-taskbar-label">${title}</span>`;
    btn.addEventListener('click', () => toggleMinimize(appId));

    // Smoothly expand and pop icon up into dock
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        btn.classList.remove('pos-taskbar-opening');
      });
    });

    return btn;
  }

  // ═════════════════════════════════════════
  // APP CONTENT BUILDERS
  // ═════════════════════════════════════════

  function buildAppContent(appId, body) {
    body.style.overflow = 'hidden';
    body.style.display  = 'flex';
    body.style.flexDirection = 'column';

    switch (appId) {
      case 'terminal': buildTerminal(body); break;
      case 'projects': buildProjects(body); break;
      case 'resume':   buildResume(body);   break;
      case 'browser':  buildBrowser(body);  break;
      case 'settings': buildSettings(body); break;
      case 'contact':  buildContact(body);  break;
      case 'trash':    buildTrash(body);    break;
      case 'games':    buildGames(body);    break;
      case 'snake':    buildGame(body);     break;
      case 'xo':       buildXO(body);       break;
      case 'flappy':   buildFlappy(body);   break;
    }
  }

  // ── APP: Terminal ────────────────────────────────────────────
  function buildTerminal(body) {
    body.innerHTML = `
      <div class="pos-terminal" style="height:100%">
        <div style="display:flex;align-items:center;padding:8px 16px;background:rgba(0,0,0,0.4);border-bottom:1px solid rgba(255,255,255,0.05);border-top:2px solid var(--pos-accent);flex-shrink:0">
          <span style="flex:1;text-align:center;font-size:11.5px;color:rgba(255,255,255,0.35)">Terminal — Portfolio OS</span>
        </div>
        <div class="pos-term-output" id="posTermOut"></div>
        <div class="pos-term-input-row">
          <span class="pos-term-prompt-sym">root@portfolio:~$</span>
          <div class="pos-term-input-wrapper">
            <input type="text" class="pos-term-input" id="posTermIn" autocomplete="off" spellcheck="false" placeholder="type 'help'..." />
            <span id="posTermInGhost" class="pos-term-input-ghost"></span>
          </div>
        </div>
      </div>`;

    const out = body.querySelector('#posTermOut');
    const inp = body.querySelector('#posTermIn');
    const ghost = body.querySelector('#posTermInGhost');

    const cmdHistory = [];
    let histIdx = 0;
    let typing = false;
    let activeSubMode = null; // 'projects', 'contact', or 'guess'
    let guessTarget = 0;
    let guessAttempts = 0;
    let accessGranted = false;

    function tLine(text, cls = 'pos-t-output') {
      const d = document.createElement('div');
      d.className = `pos-term-line ${cls}`;
      d.textContent = text;
      out.appendChild(d);
      out.scrollTop = out.scrollHeight;
      return d;
    }
    function tHTML(html, cls = 'pos-t-output') {
      const d = document.createElement('div');
      d.className = `pos-term-line ${cls}`;
      d.innerHTML = html;
      out.appendChild(d);
      out.scrollTop = out.scrollHeight;
      return d;
    }
    function typeOut(text, cls, speed = 18) {
      return new Promise(resolve => {
        const d = document.createElement('div');
        d.className = `pos-term-line ${cls}`;
        out.appendChild(d);
        let i = 0;
        const t = setInterval(() => {
          d.textContent += text[i++];
          out.scrollTop = out.scrollHeight;
          if (i >= text.length) { clearInterval(t); resolve(); }
        }, speed);
      });
    }
    function progressBar(label, blocks = 14, speed = 60) {
      return new Promise(resolve => {
        const d = document.createElement('div');
        d.className = 'pos-term-line pos-t-loading';
        out.appendChild(d);
        let i = 0;
        const t = setInterval(() => {
          const filled = '█'.repeat(i);
          const empty  = '░'.repeat(blocks - i);
          d.textContent = `${label} [${filled}${empty}] ${Math.round(i/blocks*100)}%`;
          out.scrollTop = out.scrollHeight;
          if (++i > blocks) { clearInterval(t); resolve(); }
        }, speed);
      });
    }

    // Banner — same style as main site terminal
    tLine('Portfolio OS — Terminal v1.0', 'pos-t-banner');
    tLine('Osama Ahmed · Full Stack Developer (.NET & Laravel)', 'pos-t-banner');
    tLine('─────────────────────────────────────────────', 'pos-t-banner');
    tLine("Type 'help' to list commands.", 'pos-t-info');
    tLine('', '');

    const CMDS = ['help','about','skills','projects','experience','contact','github','reactions','cv','coffee','social','clear','hack','guess','secret','sudo'];

    // Ghost autocomplete helper (same behavior as the outside terminal)
    function updateGhostText() {
      const val = inp.value;
      if (val && activeSubMode === null) {
        const match = CMDS.find(c => c.startsWith(val.toLowerCase()));
        ghost.textContent = match ? val + match.slice(val.length) : '';
      } else {
        ghost.textContent = '';
      }
    }
    inp.addEventListener('input', updateGhostText);

    async function handleProjectsSelection(choice) {
      activeSubMode = null;
      if (choice === '1') {
        tLine('Munjez — Productivity Desktop App', 'pos-t-banner');
        tLine('Status: Free & Shipped (Windows, Linux, Android)');
        tLine('Tech Stack: React, TypeScript, Tauri, Rust, Vite, Firebase');
        tLine('Features: Smart Tasks, 4-view Calendar (Hijri), Pomodoro, Habit Tracker, Stopwatch, White Noise Mixer.');
        tHTML('Website: <a href="https://munjez-website.vercel.app" target="_blank" style="color:var(--pos-accent)">munjez-website.vercel.app</a>');
        tHTML('GitHub:  <a href="https://github.com/Osama2214/munjez-releases" target="_blank" style="color:var(--pos-accent)">github.com/Osama2214/munjez-releases</a>');
      } else if (choice === '2') {
        tLine('Munjez Website — Marketing & Landing Page', 'pos-t-banner');
        tLine('Status: Live');
        tLine('Tech Stack: HTML, CSS, JavaScript, Vercel');
        tLine('Features: Bilingual (Arabic & English), full changelog, download links, privacy policy.');
        tHTML('Live Site: <a href="https://munjez-website.vercel.app" target="_blank" style="color:var(--pos-accent)">munjez-website.vercel.app</a>');
        tHTML('GitHub:   <a href="https://github.com/Osama2214/munjez-website" target="_blank" style="color:var(--pos-accent)">github.com/Osama2214/munjez-website</a>');
      } else if (choice === '3') {
        tLine('PC Builder — E-Commerce & Build Compatibility Platform', 'pos-t-banner');
        tLine('Status: Live');
        tLine('Tech Stack: Laravel, PHP, JavaScript, PostgreSQL, Sanctum, Vercel');
        tLine('Features: Compatibility-checked PC builder, admin panel, AI chat assistant, cart/wishlist/checkout.');
        tHTML('Live Site: <a href="https://pc-builder-sandy.vercel.app/" target="_blank" style="color:var(--pos-accent)">pc-builder-sandy.vercel.app</a>');
        tHTML('GitHub:   <a href="https://github.com/Osama2214/pc-builder" target="_blank" style="color:var(--pos-accent)">github.com/Osama2214/pc-builder</a>');
      } else if (choice === '4') {
        tLine('Osama Café — Coffee Shop Website & Admin Dashboard', 'pos-t-banner');
        tLine('Status: Live');
        tLine('Tech Stack: PHP, PDO, SQLite/MySQL, PHPMailer, JavaScript');
        tLine('Features: Password-protected admin dashboard, DB-backed contact form & newsletter with auto email.');
        tHTML('Live Site: <a href="https://osama-cafe.onrender.com/" target="_blank" style="color:var(--pos-accent)">osama-cafe.onrender.com</a>');
        tHTML('GitHub:   <a href="https://github.com/Osama2214/NTI-Full-Stack-Web-Development/tree/main/Task-2/osama-cafe" target="_blank" style="color:var(--pos-accent)">NTI-Full-Stack-Web-Development/Task-2/osama-cafe</a>');
      } else {
        tLine('Invalid selection. Exited project selector.', 'pos-t-error');
      }
    }

    async function handleContactSelection(choice) {
      activeSubMode = null;
      const cleaned = choice.toLowerCase().trim();
      if (cleaned === 'github') {
        tLine('Opening GitHub profile...', 'pos-t-success');
        window.open('https://github.com/Osama2214', '_blank');
      } else if (cleaned === 'linkedin') {
        tLine('Opening LinkedIn profile...', 'pos-t-success');
        window.open('https://www.linkedin.com/in/osama-ahmed-67127222a', '_blank');
      } else if (cleaned === 'email') {
        tLine('Opening mail client...', 'pos-t-success');
        window.open('mailto:osamaahmed.dev00@gmail.com', '_blank');
      } else {
        tLine('Unknown contact keyword. Exited contact selector.', 'pos-t-error');
      }
    }

    function handleGuessInput(raw) {
      const num = parseInt(raw.trim());
      if (isNaN(num) || num < 1 || num > 100) {
        tLine('Please enter a valid number between 1 and 100.', 'pos-t-error');
        return;
      }
      guessAttempts++;
      if (num === guessTarget) {
        tLine(`[WIN] Correct! Guessed in ${guessAttempts} attempt${guessAttempts > 1 ? 's' : ''}.`, 'pos-t-success');
        tLine('Type "guess" to play again anytime.', 'pos-t-info');
        activeSubMode = null;
      } else if (num < guessTarget) {
        tLine('[^] Too low!  Go higher.', 'pos-t-loading');
      } else {
        tLine('[v] Too high! Go lower.', 'pos-t-loading');
      }
    }

    async function handle(raw) {
      if (typing) return;
      const trimmedRaw = raw.trim();
      tHTML(`<span style="color:var(--pos-accent)">root@portfolio:~$ </span>${raw}`, 'pos-t-prompt');
      if (trimmedRaw) { cmdHistory.unshift(raw); }
      histIdx = 0;

      if (!trimmedRaw) return;
      typing = true;
      inp.disabled = true;

      // Sub-modes first (mirrors the outside terminal)
      if (activeSubMode === 'projects') { await handleProjectsSelection(trimmedRaw); typing = false; inp.disabled = false; inp.focus(); tLine('', ''); return; }
      if (activeSubMode === 'contact')  { await handleContactSelection(trimmedRaw);  typing = false; inp.disabled = false; inp.focus(); tLine('', ''); return; }
      if (activeSubMode === 'guess')    { handleGuessInput(trimmedRaw);              typing = false; inp.disabled = false; inp.focus(); tLine('', ''); return; }

      const args = trimmedRaw.split(' ');
      const cmd = args[0].toLowerCase();

      switch (cmd) {
        case 'help':
          tLine('Available commands:', 'pos-t-info');
          CMDS.forEach(c => tHTML(`  <span style="color:var(--pos-accent)">${c.padEnd(12)}</span><span style="color:var(--pos-text-2)">— ${getCmdDesc(c)}</span>`));
          break;
        case 'about':
          await typeOut("Hi, I'm Osama Ahmed.", 'pos-t-success', 22);
          await typeOut('Full Stack Developer (.NET & Laravel) studying IT at EELU.', 'pos-t-output', 18);
          await typeOut('Built Munjez — a cross-platform desktop productivity app — solo.', 'pos-t-output', 16);
          await typeOut('Specialized in ASP.NET Core, PHP/Laravel & Desktop Software.', 'pos-t-output', 18);
          await typeOut('Available for Freelance & Roles ✅', 'pos-t-info', 22);
          break;
        case 'skills':
          tLine('Loading technical stack visualizer...', 'pos-t-loading');
          await progressBar('PHP / Laravel  ', 8); await sleep(50);
          await progressBar('C# / ASP.NET   ', 7); await sleep(50);
          await progressBar('SQL & Databases', 8); await sleep(50);
          await progressBar('RESTful APIs   ', 6); await sleep(50);
          await progressBar('JavaScript     ', 7); await sleep(50);
          await progressBar('HTML & CSS     ', 8); await sleep(50);
          await progressBar('Git & GitHub   ', 8);
          break;
        case 'projects':
          tLine('1. Munjez            (Productivity Desktop App)');
          tLine('2. Munjez Website    (Marketing & Landing Page)');
          tLine('3. PC Builder        (E-Commerce & Build Compatibility Platform)');
          tLine('4. Osama Café        (Coffee Shop Website & Admin Dashboard)');
          tLine('');
          tLine('Choose project number [1-4]:', 'pos-t-info');
          activeSubMode = 'projects';
          break;
        case 'experience':
          tLine('Digital Egypt Pioneers Initiative (DEPI) - Trainee (2026-Present)', 'pos-t-banner');
          tLine('  - Stack: Full Stack .NET (C#, ASP.NET Core, EF, SQL Server)');
          tLine('  - Coverage: Architecture design, soft skills, agile frameworks.');
          tLine('');
          tLine('National Telecommunication Institute (NTI) - Completed (Jul-Aug 2026)', 'pos-t-banner');
          tLine('  - Stack: Full Stack PHP (OOP, Laravel MVC, MySQL, Bootstrap)');
          tLine('  - Coverage: Daily bootcamp style project shipping. Scored 93%.');
          tLine('');
          tLine('Egyptian E-Learning University (EELU) - B.Sc. IT (2024-2028 Expected)', 'pos-t-banner');
          tLine('  - 3rd Year student focusing on software engineering foundations.');
          break;
        case 'contact':
          tLine('Contact Channels:', 'pos-t-banner');
          tLine('  [email]    - osamaahmed.dev00@gmail.com');
          tLine('  [linkedin] - Osama Ahmed');
          tLine('  [github]   - @Osama2214');
          tLine('');
          tLine('Type target keyword (e.g. github, linkedin, email) to open:', 'pos-t-info');
          activeSubMode = 'contact';
          break;
        case 'cv':
          tLine('Downloading CV...', 'pos-t-loading');
          await progressBar('Osama_Ahmed_CV.pdf', 10, 80);
          tLine('Done ✔', 'pos-t-success');
          window.open('/Osama_Ahmed_CV.pdf', '_blank');
          break;
        case 'social':
          tHTML('LinkedIn: <a href="https://www.linkedin.com/in/osama-ahmed-67127222a" target="_blank" style="color:var(--pos-accent)">Osama Ahmed</a>');
          tHTML('GitHub: <a href="https://github.com/Osama2214" target="_blank" style="color:var(--pos-accent)">@Osama2214</a>');
          break;
        case 'coffee':
          tLine('Grinding Beans...', 'pos-t-loading');
          await progressBar('Grinding', 6, 50);
          tLine('Brewing...', 'pos-t-loading');
          await progressBar('Extraction', 10, 80);
          tLine('    (  )   (  )', 'pos-t-output');
          tLine('     )  )   )  )', 'pos-t-output');
          tLine('    (__(___(___)', 'pos-t-output');
          tLine('    |          | ]', 'pos-t-output');
          tLine('    |          |', 'pos-t-output');
          tLine('    |__________|', 'pos-t-output');
          tLine('☕ Developer Energy +100', 'pos-t-success');
          break;
        case 'hack':
          tLine('Initiating hack sequence...', 'pos-t-loading');
          await sleep(300);
          tLine('Bypassing firewall...', 'pos-t-loading');
          await sleep(250);
          tLine('Injecting payload...', 'pos-t-loading');
          await sleep(300);
          tLine('Decrypting database...', 'pos-t-loading');
          await sleep(400);
          tLine('[ERROR 403] Target is Osama Ahmed. Hack Aborted.', 'pos-t-error');
          tLine('[REASON]   Developer too good to be hacked.', 'pos-t-error');
          break;
        case 'guess':
          guessTarget = Math.floor(Math.random() * 100) + 1;
          guessAttempts = 0;
          tLine('[GAME] Number Guessing — started!', 'pos-t-banner');
          tLine("I'm thinking of a number between 1 and 100.");
          tLine('Type your guess and press Enter:');
          activeSubMode = 'guess';
          break;
        case 'secret':
          if (accessGranted) {
            tLine('[UNLOCKED] Decryption Successful. Secret Document Unlocked:', 'pos-t-success');
            tLine('  - Access Level   : Recruiter Mode (Activated)');
            tLine('  - Special Code   : CHIEF_DEVELOPER_OSAMA_2026');
            tLine('  - Objective      : Hire Osama Ahmed or schedule an interview!');
            tLine('  - Hidden Feature : Try typing "coffee" to fuel up.');
          } else {
            tLine('[DENIED] Access restricted. Insufficient privileges.', 'pos-t-error');
            await sleep(350);
            tLine('  HINT: Only a system administrator can unlock this.', 'pos-t-loading');
            await sleep(350);
            tLine('  HINT: Try running a privileged command... maybe "sudo" something?', 'pos-t-loading');
            await sleep(350);
            tLine('  HINT: The right action might get someone... employed.', 'pos-t-loading');
          }
          break;
        case 'sudo':
          if (args.slice(1).join(' ').toLowerCase() === 'hire osama') {
            accessGranted = true;
            tLine('Access Granted.', 'pos-t-success');
            tLine('Welcome Recruiter.', 'pos-t-success');
          } else {
            tLine('Access Denied', 'pos-t-error');
          }
          break;
        case 'clear':
          out.innerHTML = '';
          tLine('Portfolio OS Terminal v1.0', 'pos-t-banner');
          tLine('──────────────────────────', 'pos-t-banner');
          break;
        case 'github': {
          tLine('Fetching live GitHub stats...', 'pos-t-loading');
          try {
            const res = await fetch('/api/github', { headers: { Accept: 'application/json' } });
            const d = await res.json();
            if (d && !d.error) {
              tLine(`@${d.login}${d.name ? ' — ' + d.name : ''}`, 'pos-t-banner');
              tLine(`  Public Repos : ${d.repos}`);
              tLine(`  Total Stars  : ${d.stars}`);
              tLine(`  Followers    : ${d.followers}`);
              if (Array.isArray(d.top) && d.top.length) {
                tLine('  Top repos    :');
                d.top.slice(0, 3).forEach(rp => tLine(`     - ${rp.name} (${rp.stars} stars)`));
              }
              tHTML('Profile: <a href="https://github.com/Osama2214" target="_blank" style="color:var(--pos-accent)">github.com/Osama2214</a>');
            } else {
              tLine('Could not reach GitHub right now.', 'pos-t-error');
            }
          } catch (e) { tLine('Could not reach GitHub right now.', 'pos-t-error'); }
          break;
        }
        case 'reactions': {
          tLine('Loading live project reactions...', 'pos-t-loading');
          try {
            const res = await fetch('/api/reactions', { headers: { Accept: 'application/json' } });
            const d = await res.json();
            if (d && d.reactions) {
              const names = { 'munjez': 'Munjez', 'munjez-website': 'Munjez Website', 'osama-cafe': 'Osama Café', 'pc-builder': 'PC Builder' };
              tLine('Live Project Reactions:', 'pos-t-banner');
              Object.keys(d.reactions).forEach(p => {
                const c = d.reactions[p];
                tLine(`  ${(names[p] || p).padEnd(15)} like ${c.like}  ·  love ${c.love}  ·  star ${c.star}`);
              });
              tLine('React on the Projects section!', 'pos-t-info');
            } else {
              tLine('Reactions are not available right now.', 'pos-t-error');
            }
          } catch (e) { tLine('Could not load reactions.', 'pos-t-error'); }
          break;
        }
        default:
          tHTML(`<span style="color:#ef4444">bash: ${cmd}: command not found</span>  (try 'help')`);
      }

      tLine('', '');
      typing = false;
      inp.disabled = false;
      inp.focus();
      ghost.textContent = '';
    }

    function getCmdDesc(c) {
      const d = {
        help:'list commands', about:'a short biography about me', skills:'visual display of my core technical stack',
        projects:'interactive list of my built projects', experience:'educational & scholarship history',
        contact:'channels to reach out or connect with me',
        github:'live GitHub stats (repos, stars, followers)',
        reactions:'live like/love/star counts per project', cv:'simulates and opens my resume PDF',
        coffee:'energize the terminal developer', social:'quick links to GitHub & LinkedIn',
        clear:'wipes the console history clean', hack:'initiate terminal hack sequence',
        guess:'play a number guessing game', secret:'[LOCKED] you need root access first...',
        sudo:'privileged command'
      };
      return d[c] || '';
    }

    inp.addEventListener('keydown', (e) => {
      if (typing) { e.preventDefault(); return; }

      if (e.key === 'Enter') { handle(inp.value); inp.value = ''; ghost.textContent = ''; }
      if (e.key === 'ArrowUp')   { histIdx = Math.min(histIdx+1, cmdHistory.length-1); inp.value = cmdHistory[histIdx] || ''; updateGhostText(); }
      if (e.key === 'ArrowDown') { histIdx = Math.max(histIdx-1, 0);                   inp.value = cmdHistory[histIdx] || ''; updateGhostText(); }

      if (e.key === 'Tab') {
        e.preventDefault();
        if (activeSubMode !== null) return;
        const val = inp.value;
        if (val) {
          const match = CMDS.find(c => c.startsWith(val.toLowerCase()));
          if (match) { inp.value = match; updateGhostText(); }
        }
      }
    });

    // Auto-focus when window becomes active
    body.closest('.pos-window').addEventListener('mousedown', () => inp.focus(), true);
    setTimeout(() => inp.focus(), 100);
  }

  // ── APP: Projects ─────────────────────────────────────────────
  function buildProjects(body) {
    body.style.overflow = 'hidden';
    body.innerHTML = `
      <div class="pos-explorer" style="height:100%;overflow:hidden">
        <div class="pos-explorer-sidebar">
          <div class="pos-explorer-sidebar-title">Favorites</div>
          <div class="pos-sidebar-item pos-item-active" data-folder="projects">📂 Projects</div>
          <div class="pos-explorer-sidebar-title" style="margin-top:12px">Quick</div>
          <div class="pos-sidebar-item" data-folder="readme">📄 README</div>
          <div class="pos-sidebar-item" data-folder="about">👤 About</div>
        </div>
        <div class="pos-explorer-main" id="posExplorerMain">
          <div class="pos-explorer-path" id="posExplorerPath">📂 Projects/</div>
          <div id="posExplorerContent"></div>
        </div>
      </div>`;

    const mainContent = body.querySelector('#posExplorerContent');
    const pathEl      = body.querySelector('#posExplorerPath');
    const sidebar     = body.querySelector('.pos-explorer-sidebar');

    function showRoot() {
      pathEl.textContent = '📂 Projects/';
      mainContent.innerHTML = '';
      const grid = document.createElement('div');
      grid.className = 'pos-file-grid';
      PROJECTS.forEach(p => {
        const item = document.createElement('button');
        item.className = 'pos-file-item';
        item.innerHTML = `<span class="pos-file-item-icon">${projectIconHTML(p, 26)}</span><span class="pos-file-item-name">${p.name}</span>`;
        item.addEventListener('click', () => showProject(p));
        grid.appendChild(item);
      });
      mainContent.appendChild(grid);
    }

    function showProject(p) {
      pathEl.textContent = `📂 Projects / ${p.name}/`;
      mainContent.innerHTML = '';

      const back = document.createElement('button');
      back.className = 'pos-back-btn';
      back.innerHTML = '← Back';
      back.addEventListener('click', showRoot);
      mainContent.appendChild(back);

      const techTags = (p.tech || []).map(t =>
        `<span style="display:inline-flex;align-items:center;padding:2px 8px;background:var(--pos-control-bg);border:1px solid var(--pos-border);border-radius:4px;font-size:11px;color:var(--pos-accent);font-family:'JetBrains Mono',monospace">${t}</span>`
      ).join('');

      const detail = document.createElement('div');
      detail.className = 'pos-file-detail';
      detail.innerHTML = `
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">
          ${projectIconHTML(p, 32)}
          <div>
            <h3 style="margin:0;font-size:16px;color:var(--pos-text)">${p.name}</h3>
            <span style="font-size:11px;color:var(--pos-text-2)">${p.type || ''}</span>
          </div>
          ${p.badge ? `<span style="margin-left:auto;padding:2px 8px;background:var(--pos-control-bg-h);border:1px solid var(--pos-border);border-radius:12px;font-size:10px;font-weight:600;color:var(--pos-accent);white-space:nowrap">${p.badge}</span>` : ''}
        </div>
        <p style="margin:0 0 14px">${p.desc}</p>
        ${techTags ? `<div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:16px">${techTags}</div>` : ''}
        <div class="pos-file-detail-links">
          ${p.live ? `<a href="${p.live}" target="_blank" class="pos-file-detail-link pos-link-primary">${p.liveLabel || '🌐 Live Demo'}</a>` : ''}
          ${p.github ? `<a href="${p.github}" target="_blank" class="pos-file-detail-link pos-link-secondary">🐙 GitHub</a>` : ''}
        </div>`;
      mainContent.appendChild(detail);
    }

    function showReadme() {
      pathEl.textContent = '📄 README.md';
      mainContent.innerHTML = '';
      const back = document.createElement('button');
      back.className = 'pos-back-btn';
      back.innerHTML = '← Back';
      back.addEventListener('click', () => { showRoot(); sidebar.querySelector('[data-folder="projects"]').click(); });
      mainContent.appendChild(back);
      const d = document.createElement('div');
      d.className = 'pos-file-detail';
      d.innerHTML = `
        <h3>📄 README.md</h3>
        <p style="font-family:JetBrains Mono,monospace;font-size:12px;line-height:1.9;color:var(--pos-text)">
          <strong style="color:var(--pos-accent)"># Osama Ahmed — Portfolio</strong><br><br>
          Full Stack Developer (.NET & Laravel) · EELU IT Student 🇪🇬<br>
          Specialized in ASP.NET Core, PHP/Laravel & Desktop Apps<br><br>
          <strong style="color:var(--pos-accent)">## Projects</strong><br>
          - Munjez (React · TypeScript · Tauri · Rust)<br>
          - Munjez Website (HTML · CSS · JS)<br>
          - PC Builder (Laravel · PHP · JS)<br>
          - Osama Café (HTML5 · CSS3 · JS)<br><br>
          <strong style="color:var(--pos-accent)">## Contact</strong><br>
          osamaahmed.dev00@gmail.com
        </p>`;
      mainContent.appendChild(d);
    }

    function showAbout() {
      pathEl.textContent = '👤 About Osama';
      mainContent.innerHTML = '';
      const back = document.createElement('button');
      back.className = 'pos-back-btn';
      back.innerHTML = '← Back';
      back.addEventListener('click', showRoot);
      mainContent.appendChild(back);
      const d = document.createElement('div');
      d.className = 'pos-file-detail';
      d.innerHTML = `
        <h3>👤 Osama Ahmed</h3>
        <p>Full Stack Developer specializing in <strong>ASP.NET Core</strong> &amp; <strong>PHP/Laravel</strong>.
        Built Munjez — a full offline productivity desktop app — solo. Available for freelance projects &amp; engineering roles.</p>
        <div class="pos-file-detail-links">
          <a href="https://github.com/Osama2214" target="_blank" class="pos-file-detail-link pos-link-secondary">🐙 GitHub</a>
          <a href="https://www.linkedin.com/in/osama-ahmed-67127222a" target="_blank" class="pos-file-detail-link pos-link-secondary">💼 LinkedIn</a>
        </div>`;
      mainContent.appendChild(d);
    }

    sidebar.addEventListener('click', (e) => {
      const item = e.target.closest('.pos-sidebar-item');
      if (!item) return;
      sidebar.querySelectorAll('.pos-sidebar-item').forEach(s => s.classList.remove('pos-item-active'));
      item.classList.add('pos-item-active');
      const folder = item.dataset.folder;
      if (folder === 'projects') showRoot();
      if (folder === 'readme')   showReadme();
      if (folder === 'about')    showAbout();
    });

    showRoot();
  }

  // ── APP: Resume ───────────────────────────────────────────────
  function buildResume(body) {
    body.innerHTML = `
      <div class="pos-resume" style="height:100%">
        <div class="pos-resume-toolbar">
          <span class="pos-resume-toolbar-title">📄 Osama_Ahmed_CV.pdf</span>
          <div class="pos-resume-toolbar-actions">
            <a href="/Osama_Ahmed_CV.pdf" target="_blank" class="pos-toolbar-btn">↗ Open in Tab</a>
            <a href="/Osama_Ahmed_CV.pdf" download class="pos-toolbar-btn">⬇ Download</a>
          </div>
        </div>
        <div class="pos-resume-iframe-wrap">
          <iframe src="/Osama_Ahmed_CV.pdf" title="Osama Ahmed CV"></iframe>
        </div>
      </div>`;
    const toolbarButtons = body.querySelectorAll('.pos-toolbar-btn');
    if (toolbarButtons[0]) toolbarButtons[0].innerHTML = `${POS_ICONS.external}<span>Open in Tab</span>`;
    if (toolbarButtons[1]) toolbarButtons[1].innerHTML = `${POS_ICONS.download}<span>Download</span>`;
  }

  // ── APP: Browser ──────────────────────────────────────────────
  function buildBrowser(body) {
    const pageURL = window.location.href;
    body.innerHTML = `
      <div class="pos-browser" style="height:100%">
        <div class="pos-browser-bar">
          <button class="pos-browser-nav-btn" id="posBrowserReload" title="Reload">↺</button>
          <div class="pos-browser-url">
            <span class="pos-browser-url-lock">🔒</span>
            <span>${pageURL}</span>
          </div>
          <a href="${pageURL}" target="_blank" class="pos-browser-nav-btn" title="Open in new tab">↗</a>
        </div>
        <div class="pos-browser-iframe-wrap">
          <iframe id="posBrowserIframe" src="${pageURL}" title="Portfolio Browser" sandbox="allow-scripts allow-same-origin allow-forms"></iframe>
        </div>
      </div>`;

    const iframe = body.querySelector('#posBrowserIframe');
    body.querySelector('#posBrowserReload').addEventListener('click', () => {
      iframe.src = iframe.src;
    });
  }

  // ── APP: Settings ─────────────────────────────────────────────
  function buildSettings(body) {
    body.style.overflow = 'auto';
    const themeLabels = {
      'site-theme': 'Sync with Site Theme',
      'monochrome': 'Monochrome Silver',
      'gold': 'Luxe Gold',
      'platinum-gold': 'Platinum & Gold Fusion',
      'emerald': 'Emerald Cyber'
    };
    body.innerHTML = `
      <div class="pos-settings">
        <div class="pos-settings-section-title">System</div>

        <div class="pos-setting-row">
          <div class="pos-setting-row-info">
            <div class="pos-setting-row-label">Particles</div>
            <div class="pos-setting-row-sub">Background particle animation</div>
          </div>
          <label class="pos-toggle">
            <input type="checkbox" id="posParticlesToggle" ${particlesEnabled ? 'checked' : ''} />
            <span class="pos-toggle-track"></span>
          </label>
        </div>

        <div class="pos-setting-row">
          <div class="pos-setting-row-info">
            <div class="pos-setting-row-label">Ambient Music</div>
            <div class="pos-setting-row-sub">Background OS ambiance</div>
          </div>
          <label class="pos-toggle">
            <input type="checkbox" id="posMusicToggle" ${musicEnabled ? 'checked' : ''} />
            <span class="pos-toggle-track"></span>
          </label>
        </div>

        <div class="pos-setting-row">
          <div class="pos-setting-row-info">
            <div class="pos-setting-row-label">Theme</div>
            <div class="pos-setting-row-sub">Desktop color scheme</div>
          </div>
          <div class="pos-custom-select" id="posThemeSelect" data-value="${osTheme}">
            <button class="pos-custom-select-btn" type="button" aria-haspopup="listbox" aria-expanded="false">
              <span>${themeLabels[osTheme] || 'Sync with Site Theme'}</span>
            </button>
            <div class="pos-custom-select-menu" role="listbox">
              <button class="pos-custom-option ${osTheme==='site-theme' ? 'pos-option-active' : ''}" type="button" data-value="site-theme" role="option">Sync with Site Theme</button>
              <button class="pos-custom-option ${osTheme==='monochrome' ? 'pos-option-active' : ''}" type="button" data-value="monochrome" role="option">Monochrome Silver</button>
              <button class="pos-custom-option ${osTheme==='gold' ? 'pos-option-active' : ''}" type="button" data-value="gold" role="option">Luxe Gold</button>
              <button class="pos-custom-option ${osTheme==='platinum-gold' ? 'pos-option-active' : ''}" type="button" data-value="platinum-gold" role="option">Platinum & Gold Fusion</button>
              <button class="pos-custom-option ${osTheme==='emerald' ? 'pos-option-active' : ''}" type="button" data-value="emerald" role="option">Emerald Cyber</button>
            </div>
          </div>
        </div>

        <div class="pos-setting-row">
          <div class="pos-setting-row-info">
            <div class="pos-setting-row-label">Typography</div>
            <div class="pos-setting-row-sub">Font family suite</div>
          </div>
          <div class="pos-custom-select" id="posFontSelect" data-value="${document.documentElement.getAttribute('data-font-suite') || 'futuristic-urbanist'}">
            <button class="pos-custom-select-btn" type="button" aria-haspopup="listbox" aria-expanded="false">
              <span>Futuristic Urbanist</span>
            </button>
            <div class="pos-custom-select-menu" role="listbox">
              <button class="pos-custom-option pos-option-active" type="button" data-value="futuristic-urbanist" role="option">Futuristic Urbanist</button>
            </div>
          </div>
        </div>

        <div class="pos-settings-divider"></div>
        <div class="pos-settings-section-title">About</div>
        <div class="pos-setting-row pos-about-row" id="posAboutRow" style="cursor:pointer;user-select:none;">
          <div class="pos-setting-row-info">
            <div class="pos-setting-row-label">Portfolio OS</div>
            <div class="pos-setting-row-sub" id="posVersionSub">Version 1.0.0 — Built by Osama Ahmed</div>
          </div>
        </div>

        <div class="pos-settings-divider"></div>
        <button class="pos-settings-shutdown" id="posSettingsShutdown">
          ⏻  Shutdown Portfolio OS
        </button>
      </div>`;

    // Particles toggle
    body.querySelector('#posParticlesToggle').addEventListener('change', function () {
      particlesEnabled = this.checked;
      // Try to pause/resume the main site's canvas
      const canvas = document.getElementById('particles');
      if (canvas) canvas.style.opacity = particlesEnabled ? '1' : '0';
    });

    // Music toggle
    body.querySelector('#posMusicToggle').addEventListener('change', async function () {
      musicEnabled = this.checked;
      if (musicEnabled) {
        const started = await startAmbientMusic();
        if (!started) {
          musicEnabled = false;
          this.checked = false;
        }
      } else {
        stopAmbientMusic();
      }
    });

    setupSettingsSelect(body.querySelector('#posThemeSelect'), (value) => {
      applyOsTheme(value);
    });

    setupSettingsSelect(body.querySelector('#posFontSelect'), (value) => {
      if (typeof window.setPortfolioFontSuite === 'function') {
        window.setPortfolioFontSuite(value);
      } else {
        document.documentElement.setAttribute('data-font-suite', value);
        localStorage.setItem('osama-portfolio-font-suite', value);
      }
    });

    // Shutdown
    body.querySelector('#posSettingsShutdown').addEventListener('click', () => triggerShutdown());

    // Version easter egg — click 5x to unlock
    const aboutRow = body.querySelector('#posAboutRow');
    const versionSub = body.querySelector('#posVersionSub');
    if (aboutRow && versionSub) {
      let clicks = 0;
      let clickTimer;
      const originalText = versionSub.textContent;
      const hints = ['Again?', 'Keep going...', 'Almost there...', 'One more...'];

      aboutRow.addEventListener('click', () => {
        clicks++;
        clearTimeout(clickTimer);
        clickTimer = setTimeout(() => { clicks = 0; }, 1800);

        aboutRow.animate(
          [{ transform: 'scale(1)' }, { transform: 'scale(0.98)' }, { transform: 'scale(1)' }],
          { duration: 220, easing: 'ease-out' }
        );

        if (clicks < 5) {
          versionSub.textContent = hints[clicks - 1] || originalText;
          return;
        }

        // Unlocked!
        clicks = 0;
        versionSub.textContent = 'Version 1.0.0 — Made with ☕, 🔥 and way too little sleep';
        aboutRow.classList.add('pos-about-unlocked');
        setTimeout(() => aboutRow.classList.remove('pos-about-unlocked'), 900);
        setTimeout(() => { versionSub.textContent = originalText; }, 5000);

        if (typeof window.easterShowToast === 'function') {
          window.easterShowToast('🎉 Achievement Unlocked: Curious Clicker!', 4000);
        }

        // Confetti burst inside the settings panel
        const panel = body.querySelector('.pos-settings') || body;
        const rowRect = aboutRow.getBoundingClientRect();
        const panelRect = panel.getBoundingClientRect();
        const originX = rowRect.left - panelRect.left + rowRect.width / 2;
        const originY = rowRect.top - panelRect.top + rowRect.height / 2;
        const colors = ['#ffffff', '#cbd5e1', '#e2e8f0', '#94a3b8', '#f8fafc'];

        for (let i = 0; i < 22; i++) {
          const bit = document.createElement('span');
          const angle = Math.random() * Math.PI * 2;
          const dist = 60 + Math.random() * 90;
          const dx = Math.cos(angle) * dist;
          const dy = Math.sin(angle) * dist;
          const size = 4 + Math.random() * 5;
          bit.style.cssText = `
            position: absolute;
            left: ${originX}px;
            top: ${originY}px;
            width: ${size}px;
            height: ${size}px;
            background: ${colors[i % colors.length]};
            border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
            pointer-events: none;
            z-index: 9999;
            opacity: 1;
          `;
          panel.style.position = panel.style.position || 'relative';
          panel.appendChild(bit);
          bit.animate(
            [
              { transform: 'translate(0,0) rotate(0deg)', opacity: 1 },
              { transform: `translate(${dx}px, ${dy}px) rotate(${Math.random() * 360}deg)`, opacity: 0 }
            ],
            { duration: 700 + Math.random() * 400, easing: 'cubic-bezier(0.2,0.8,0.2,1)' }
          ).onfinish = () => bit.remove();
        }
      });
    }
  }

  function setupSettingsSelect(selectEl, onChange) {
    if (!selectEl) return;

    const trigger = selectEl.querySelector('.pos-custom-select-btn');
    const options = selectEl.querySelectorAll('.pos-custom-option');
    const settingsPanel = selectEl.closest('.pos-settings');

    function closeSelect() {
      selectEl.classList.remove('pos-select-open');
      trigger.setAttribute('aria-expanded', 'false');
    }

    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      document.querySelectorAll('.pos-custom-select.pos-select-open').forEach(el => {
        if (el !== selectEl) {
          el.classList.remove('pos-select-open');
          const btn = el.querySelector('.pos-custom-select-btn');
          if (btn) btn.setAttribute('aria-expanded', 'false');
        }
      });
      const isOpen = selectEl.classList.toggle('pos-select-open');
      trigger.setAttribute('aria-expanded', String(isOpen));
    });

    options.forEach(option => {
      option.addEventListener('click', (e) => {
        e.stopPropagation();
        const value = option.dataset.value;
        selectEl.dataset.value = value;
        trigger.querySelector('span').textContent = option.textContent;
        options.forEach(o => o.classList.toggle('pos-option-active', o === option));
        closeSelect();
        onChange(value);
      });
    });

    if (settingsPanel) settingsPanel.addEventListener('click', closeSelect);
  }

  window.addEventListener('fontSuiteChanged', (e) => {
    const fontSelect = document.getElementById('posFontSelect');
    if (fontSelect && e.detail && e.detail.font) {
      const suite = e.detail.font;
      fontSelect.dataset.value = suite;
      const activeOption = fontSelect.querySelector(`.pos-custom-option[data-value="${suite}"]`);
      if (activeOption) {
        const span = fontSelect.querySelector('.pos-custom-select-btn span');
        if (span) span.textContent = activeOption.textContent;
        fontSelect.querySelectorAll('.pos-custom-option').forEach(o => o.classList.toggle('pos-option-active', o === activeOption));
      }
    }
  });

  window.addEventListener('themeChanged', (e) => {
    const themeSelect = document.getElementById('posThemeSelect');
    if (themeSelect && osTheme === 'site-theme') {
      const activeOption = themeSelect.querySelector(`.pos-custom-option[data-value="site-theme"]`);
      if (activeOption) {
        const span = themeSelect.querySelector('.pos-custom-select-btn span');
        if (span) span.textContent = activeOption.textContent;
      }
    }
  });

  // OS Theme
  function applyOsTheme(themeId) {
    osTheme = themeId;
    const r = document.documentElement;
    const props = [
      '--pos-accent', '--pos-accent-2', '--pos-accent-glow', '--pos-accent-dim',
      '--pos-bg', '--pos-surface', '--pos-surface-2', '--pos-win-header',
      '--pos-topbar-bg', '--pos-dock-bg', '--pos-control-bg', '--pos-control-bg-h',
      '--pos-desktop-bg', '--pos-border', '--pos-border-2'
    ];

    // Remove legacy inline variable overrides so CSS theme variables take full effect
    props.forEach(p => r.style.removeProperty(p));

    if (themeId !== 'site-theme') {
      const siteThemeMap = {
        'monochrome': 'monochrome',
        'gold': 'gold',
        'platinum-gold': 'platinum-gold',
        'emerald': 'emerald'
      };
      const selected = siteThemeMap[themeId] || 'platinum-gold';
      r.setAttribute('data-theme', selected);
      localStorage.setItem('osama-portfolio-theme', selected);
      window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme: selected } }));
    }
  }

  function hexToRgb(hex) {
    const r = parseInt(hex.slice(1,3),16);
    const g = parseInt(hex.slice(3,5),16);
    const b = parseInt(hex.slice(5,7),16);
    return `${r},${g},${b}`;
  }

  // ── APP: Contact ──────────────────────────────────────────────
  function buildContact(body) {
    body.style.overflow = 'auto';
    body.innerHTML = `
      <div class="pos-contact">
        <div class="pos-contact-header">
          <div class="pos-contact-avatar">👨‍💻</div>
          <div>
            <div class="pos-contact-name">Osama Ahmed</div>
            <div class="pos-contact-title-text">Full Stack Developer (.NET &amp; Laravel)</div>
          </div>
        </div>

        <a href="https://github.com/Osama2214" target="_blank" class="pos-contact-link">
          <div class="pos-contact-link-icon" style="background:rgba(255,255,255,0.04)">🐙</div>
          <div>
            <div class="pos-contact-link-text">GitHub</div>
            <div class="pos-contact-link-sub">github.com/Osama2214</div>
          </div>
          <span class="pos-contact-link-arrow">→</span>
        </a>

        <a href="https://www.linkedin.com/in/osama-ahmed-67127222a" target="_blank" class="pos-contact-link">
          <div class="pos-contact-link-icon" style="background:rgba(10,102,194,0.15)">💼</div>
          <div>
            <div class="pos-contact-link-text">LinkedIn</div>
            <div class="pos-contact-link-sub">linkedin.com/in/osama-ahmed-67127222a</div>
          </div>
          <span class="pos-contact-link-arrow">→</span>
        </a>

        <a href="mailto:osamaahmed.dev00@gmail.com" class="pos-contact-link">
          <div class="pos-contact-link-icon" style="background:rgba(239,68,68,0.1)">📧</div>
          <div>
            <div class="pos-contact-link-text">Email</div>
            <div class="pos-contact-link-sub">osamaahmed.dev00@gmail.com</div>
          </div>
          <span class="pos-contact-link-arrow">→</span>
        </a>
      </div>`;
  }

  // ── APP: Trash ─────────────────────────────────────────────────
  function buildTrash(body) {
    body.style.overflow = 'hidden';
    body.innerHTML = `
      <div class="pos-trash">
        <div class="pos-trash-icon" id="posTrashIcon">🗑️</div>
        <div class="pos-trash-text">Trash is empty</div>
        <div class="pos-trash-sub">Nothing to delete here... yet.<br>Your regrets are safe 😏</div>
        <button class="pos-trash-empty-btn" id="posEmptyTrash">🗑 Empty Trash</button>
      </div>`;

    body.querySelector('#posEmptyTrash').addEventListener('click', () => {
      const icon = body.querySelector('#posTrashIcon');
      icon.style.transform = 'scale(1.3) rotate(-10deg)';
      setTimeout(() => {
        icon.style.transform = '';
        icon.textContent = '✨';
        body.querySelector('.pos-trash-text').textContent = 'Trash emptied!';
        body.querySelector('.pos-trash-sub').textContent  = 'All your regrets are gone. Fresh start!';
      }, 300);
    });
  }

  // ── APP: Games (launcher) ──────────────────────────────────────
  const GAMES_LIST = [
    { id: 'snake',  icon: '🐍', name: 'Snake' },
    { id: 'xo',     icon: '❌', name: 'Tic-Tac-Toe' },
    { id: 'flappy', icon: '🐦', name: 'Flappy Bird' },
  ];
  function buildGames(body) {
    body.style.overflow = 'hidden';
    body.innerHTML = `
      <div style="padding:18px">
        <div class="pos-file-grid" id="posGamesGrid"></div>
      </div>`;

    const grid = body.querySelector('#posGamesGrid');
    GAMES_LIST.forEach(g => {
      const item = document.createElement('button');
      item.className = 'pos-file-item';
      item.innerHTML = `<span class="pos-file-item-icon">${g.icon}</span><span class="pos-file-item-name">${g.name}</span>`;
      item.addEventListener('click', () => openApp(g.id));
      grid.appendChild(item);
    });
  }

  // ═════════════════════════════════════════
  // SHUTDOWN
  // ═════════════════════════════════════════
  function triggerShutdown() {
    if (isShuttingDown) return;
    isShuttingDown = true;
    playShutdownSound();

    // Close settings window if open
    shutdownScreen.classList.remove('pos-hidden');

    // Progress bar for shutdown
    shutdownBarWrap.classList.remove('pos-hidden');
    const sBar = shutdownBarWrap.querySelector('.pos-boot-bar');
    let pct = 0;
    const t = setInterval(() => {
      pct += 2;
      sBar.style.width = pct + '%';
      if (pct >= 100) {
        clearInterval(t);
        // Show thank you
        body_shutdownText();
      }
    }, 40);
  }

  function body_shutdownText() {
    const spinner = shutdownScreen.querySelector('.pos-shutdown-spinner');
    spinner.style.display = 'none';
    shutdownBarWrap.classList.add('pos-hidden');
    shutdownText.textContent = 'Thank You. 👋';
    shutdownText.style.fontSize = '22px';

    setTimeout(() => exitOS(), 1800);
  }

  function exitOS() {
    stopAmbientMusic();
    clearInterval(clockInterval);
    isShuttingDown = false;
    isBooting = false;

    // Reset state
    Object.keys(openWindows).forEach(id => {
      openWindows[id].el.remove();
      openWindows[id].taskbarBtn && openWindows[id].taskbarBtn.remove();
    });
    openWindows = {};
    taskbarApps.innerHTML = '';
    updateDockVisibility();

    // Reset boot status
    if (bootStatusEl) {
      bootStatusEl.classList.remove('pos-status-fade');
      bootStatusEl.textContent = BOOT_STAGES[0];
    }
    shutdownText.textContent = 'Shutting Down...';
    shutdownText.style.fontSize = '';
    if (shutdownScreen.querySelector('.pos-shutdown-spinner')) {
      shutdownScreen.querySelector('.pos-shutdown-spinner').style.display = '';
    }

    // Restore theme defaults
    const r = document.documentElement;
    [
      '--pos-accent',
      '--pos-accent-2',
      '--pos-accent-glow',
      '--pos-accent-dim',
      '--pos-bg',
      '--pos-surface',
      '--pos-surface-2',
      '--pos-win-header',
      '--pos-topbar-bg',
      '--pos-dock-bg',
      '--pos-control-bg',
      '--pos-control-bg-h',
      '--pos-desktop-bg',
      '--pos-border',
      '--pos-border-2'
    ].forEach(v => r.style.removeProperty(v));

    // Fade out
    osRoot.style.transition = 'opacity 0.5s ease';
    osRoot.style.opacity = '0';
    setTimeout(() => {
      osRoot.classList.add('pos-hidden');
      osRoot.style.opacity = '';
      osRoot.style.transition = '';
      document.documentElement.classList.remove('pos-os-active');
      document.body.classList.remove('pos-os-active');
      document.body.style.overflow = '';
      if (brandIconObserver) {
        brandIconObserver.disconnect();
        brandIconObserver = null;
      }
    }, 500);
  }

  // Shutdown buttons
  shutdownBtnTop.addEventListener('click', () => triggerShutdown());

  // ═════════════════════════════════════════
  // AMBIENT MUSIC (Web Audio API)
  // ═════════════════════════════════════════
  async function startAmbientMusic() {
    try {
      if (audioCtx) {
        if (audioCtx.state === 'suspended') await audioCtx.resume();
        return audioCtx.state === 'running';
      }
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.state === 'suspended') await audioCtx.resume();
      const masterGain = audioCtx.createGain();
      masterGain.gain.setValueAtTime(0, audioCtx.currentTime);
      masterGain.gain.linearRampToValueAtTime(0.16, audioCtx.currentTime + 0.8);
      masterGain.connect(audioCtx.destination);

      // Ambient pad — slow oscillating chord
      const freqs = [130.81, 164.81, 196.00, 261.63]; // C3, E3, G3, C4
      const oscs  = [];
      freqs.forEach((freq, i) => {
        const osc  = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        const lfo  = audioCtx.createOscillator();
        const lfoG = audioCtx.createGain();

        osc.type      = i % 2 ? 'triangle' : 'sine';
        osc.frequency.value = freq;
        lfo.type      = 'sine';
        lfo.frequency.value = 0.08 + i * 0.025;
        lfoG.gain.value = 0.12;

        lfo.connect(lfoG);
        lfoG.connect(osc.frequency);
        gain.gain.value = 0.18;
        osc.connect(gain);
        gain.connect(masterGain);

        osc.start();
        lfo.start();
        oscs.push(osc, lfo);
      });

      // Low-mid pulse so laptop speakers can actually reproduce it.
      const subOsc  = audioCtx.createOscillator();
      const subGain = audioCtx.createGain();
      subOsc.type = 'triangle';
      subOsc.frequency.value = 174.61; // F3
      subGain.gain.value = 0.16;
      subOsc.connect(subGain);
      subGain.connect(masterGain);
      subOsc.start();
      oscs.push(subOsc);

      musicNodes = { ctx: audioCtx, master: masterGain, oscs };
      return audioCtx.state === 'running';
    } catch (err) {
      console.warn('Audio not available:', err);
      audioCtx = null;
      musicNodes = {};
      return false;
    }
  }

  function stopAmbientMusic() {
    if (!audioCtx) return;
    try {
      musicNodes.master && musicNodes.master.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.5);
      setTimeout(() => {
        musicNodes.oscs && musicNodes.oscs.forEach(o => { try { o.stop(); } catch(e){} });
        audioCtx.close();
        audioCtx = null;
        musicNodes = {};
      }, 600);
    } catch(e) {}
  }

  async function startAmbientMusic() {
    try {
      if (!ambientAudio) {
        ambientAudio = new Audio('audio/ambient.mp3');
        ambientAudio.loop = true;
        ambientAudio.preload = 'auto';
      }

      if (ambientFadeTimer) {
        clearInterval(ambientFadeTimer);
        ambientFadeTimer = null;
      }

      ambientAudio.volume = 0;
      await ambientAudio.play();

      const targetVolume = 0.12;
      ambientFadeTimer = setInterval(() => {
        ambientAudio.volume = Math.min(targetVolume, ambientAudio.volume + 0.045);
        if (ambientAudio.volume >= targetVolume) {
          clearInterval(ambientFadeTimer);
          ambientFadeTimer = null;
        }
      }, 40);

      return true;
    } catch (err) {
      console.warn('Ambient audio file could not play:', err);
      return false;
    }
  }

  async function playStartupSound() {
    try {
      if (!startupAudio) {
        startupAudio = new Audio('audio/startup.mp3');
        startupAudio.preload = 'auto';
      }

      startupAudio.pause();
      startupAudio.currentTime = 0;
      startupAudio.volume = 0.13;
      await startupAudio.play();
    } catch (err) {
      console.warn('Startup sound not available:', err);
    }
  }

  async function playShutdownSound() {
    try {
      if (!shutdownAudio) {
        shutdownAudio = new Audio('audio/shutdown.mp3');
        shutdownAudio.preload = 'auto';
      }

      shutdownAudio.pause();
      shutdownAudio.currentTime = 0;
      shutdownAudio.volume = 0.13;
      await shutdownAudio.play();
    } catch (err) {
      console.warn('Shutdown sound not available:', err);
    }
  }

  function stopAmbientMusic() {
    if (!ambientAudio) return;

    if (ambientFadeTimer) {
      clearInterval(ambientFadeTimer);
      ambientFadeTimer = null;
    }

    ambientFadeTimer = setInterval(() => {
      ambientAudio.volume = Math.max(0, ambientAudio.volume - 0.06);
      if (ambientAudio.volume <= 0) {
        clearInterval(ambientFadeTimer);
        ambientFadeTimer = null;
        ambientAudio.pause();
        ambientAudio.currentTime = 0;
      }
    }, 35);
  }

  // ── Utility ──────────────────────────────────────────────────
  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

})();

