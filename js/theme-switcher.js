/* ══════════════════════════════════════════════════════════════
   FLOATING THEME & FONT SWITCHER LOGIC
══════════════════════════════════════════════════════════════ */
(function () {
  const STORAGE_KEY = 'osama-portfolio-theme';
  const DEFAULT_THEME = 'monochrome';

  const FONT_STORAGE_KEY = 'osama-portfolio-font-suite';
  const DEFAULT_FONT = 'default';

  const THEMES = [
    { id: 'monochrome', name: 'Monochrome Silver', swatchClass: 'swatch-monochrome' },
    { id: 'gold', name: 'Luxe Gold', swatchClass: 'swatch-gold' },
    { id: 'ruby', name: 'Ruby Crimson', swatchClass: 'swatch-ruby' },
    { id: 'sunset', name: 'Amber Sunset', swatchClass: 'swatch-sunset' },
    { id: 'platinum-gold', name: 'Platinum & Gold Fusion', swatchClass: 'swatch-platinum-gold' },
    { id: 'purple', name: 'AI Original Purple', swatchClass: 'swatch-purple' },
    { id: 'emerald', name: 'Emerald Cyber', swatchClass: 'swatch-emerald' }
  ];

  const FONTS = [
    { id: 'default', name: 'Default Classic', desc: 'Space Grotesk + Plus Jakarta' },
    { id: 'modern-tech', name: 'Ultra-Modern Tech', desc: 'Outfit + Sora + Fira Code' },
    { id: 'cyber-matrix', name: 'Cyberpunk Matrix', desc: 'Chakra Petch + Rajdhani' },
    { id: 'luxury-editorial', name: 'Luxury VIP Editorial', desc: 'Cinzel + Manrope' },
    { id: 'futuristic-urbanist', name: 'Futuristic Urbanist', desc: 'Urbanist + Inter' },
    { id: 'arabic-luxury', name: 'Arabic Luxury Suite', desc: 'Alexandria + IBM Plex' },
    { id: 'retro-arcade', name: 'Retro Arcade & Pixel', desc: 'Pixelify Sans + Space Mono' },
    { id: 'minimal-serif', name: 'Modern Minimalist Serif', desc: 'Cormorant + Plus Jakarta' },
    { id: 'dev-code-core', name: 'Developer Code Core', desc: 'Fira Code + Source Code Pro' }
  ];

  function getSavedTheme() {
    return localStorage.getItem(STORAGE_KEY) || DEFAULT_THEME;
  }

  function getSavedFontSuite() {
    return localStorage.getItem(FONT_STORAGE_KEY) || DEFAULT_FONT;
  }

  function setTheme(themeId) {
    document.documentElement.setAttribute('data-theme', themeId);
    localStorage.setItem(STORAGE_KEY, themeId);
    
    document.querySelectorAll('.theme-option-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.themeId === themeId);
    });

    window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme: themeId } }));
  }

  function setFontSuite(fontId) {
    document.documentElement.setAttribute('data-font-suite', fontId);
    localStorage.setItem(FONT_STORAGE_KEY, fontId);
    
    document.querySelectorAll('.font-option-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.fontId === fontId);
    });

    window.dispatchEvent(new CustomEvent('fontSuiteChanged', { detail: { font: fontId } }));
  }

  // Set initial theme & font suite before render to prevent flash
  const initialTheme = getSavedTheme();
  const initialFont = getSavedFontSuite();
  document.documentElement.setAttribute('data-theme', initialTheme);
  document.documentElement.setAttribute('data-font-suite', initialFont);

  // Expose global helpers for Portfolio OS
  window.setPortfolioTheme = setTheme;
  window.setPortfolioFontSuite = setFontSuite;

  document.addEventListener('DOMContentLoaded', () => {
    // Create widget container
    const container = document.createElement('div');
    container.className = 'theme-switcher-widget';
    container.innerHTML = `
      <div class="theme-popover" id="themePopover">
        <div class="switcher-popover-tabs">
          <button class="switcher-tab-btn active" data-tab="themes">🎨 Colors</button>
          <button class="switcher-tab-btn" data-tab="fonts">✍️ Fonts</button>
        </div>

        <div class="theme-options-list active" id="switcherThemeList">
          ${THEMES.map(t => `
            <button class="theme-option-btn ${t.id === initialTheme ? 'active' : ''}" data-theme-id="${t.id}">
              <span class="theme-swatch ${t.swatchClass}"></span>
              <span class="theme-label">${t.name}</span>
              <span class="theme-check">✓</span>
            </button>
          `).join('')}
        </div>

        <div class="font-options-list" id="switcherFontList">
          ${FONTS.map(f => `
            <button class="font-option-btn ${f.id === initialFont ? 'active' : ''}" data-font-id="${f.id}">
              <div class="font-option-title">
                <span>${f.name}</span>
                <span class="theme-check">✓</span>
              </div>
              <div class="font-option-desc">${f.desc}</div>
            </button>
          `).join('')}
        </div>
      </div>

      <button class="theme-trigger-btn" id="themeTriggerBtn" title="Theme & Font Switcher / الألوان والخطوط" aria-label="Theme & Font Switcher">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      </button>
    `;

    document.body.appendChild(container);

    const triggerBtn = document.getElementById('themeTriggerBtn');
    const popover = document.getElementById('themePopover');
    const tabBtns = container.querySelectorAll('.switcher-tab-btn');
    const themeList = document.getElementById('switcherThemeList');
    const fontList = document.getElementById('switcherFontList');

    triggerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      popover.classList.toggle('open');
    });

    document.addEventListener('click', (e) => {
      if (!container.contains(e.target)) {
        popover.classList.remove('open');
      }
    });

    // Tab switching
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const tab = btn.dataset.tab;
        if (tab === 'themes') {
          themeList.classList.add('active');
          fontList.classList.remove('active');
        } else {
          fontList.classList.add('active');
          themeList.classList.remove('active');
        }
      });
    });

    // Theme option clicks
    container.querySelectorAll('.theme-option-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        setTheme(btn.dataset.themeId);
      });
    });

    // Font option clicks
    container.querySelectorAll('.font-option-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        setFontSuite(btn.dataset.fontId);
      });
    });
  });
})();
