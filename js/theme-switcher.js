/* ══════════════════════════════════════════════════════════════
   FLOATING THEME & FONT SWITCHER LOGIC
══════════════════════════════════════════════════════════════ */
(function () {
  const STORAGE_KEY = 'osama-portfolio-theme';
  const DEFAULT_THEME = 'platinum-gold';

  const FONT_STORAGE_KEY = 'osama-portfolio-font-suite';
  const DEFAULT_FONT = 'futuristic-urbanist';

  const THEMES = [
    { id: 'monochrome', name: 'Monochrome Silver', swatchClass: 'swatch-monochrome' },
    { id: 'gold', name: 'Luxe Gold', swatchClass: 'swatch-gold' },
    { id: 'platinum-gold', name: 'Platinum & Gold Fusion', swatchClass: 'swatch-platinum-gold' },
    { id: 'emerald', name: 'Emerald Cyber', swatchClass: 'swatch-emerald' }
  ];

  const FONTS = [
    { id: 'futuristic-urbanist', name: 'Futuristic Urbanist', desc: 'Urbanist + Inter' }
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

    window.dispatchEvent(new CustomEvent('fontSuiteChanged', { detail: { font: fontId } }));
  }

  // Set initial theme & font suite before render to prevent flash
  const initialTheme = getSavedTheme();
  const initialFont = getSavedFontSuite();
  document.documentElement.setAttribute('data-theme', initialTheme);
  document.documentElement.setAttribute('data-font-suite', initialFont);

  // Expose global helpers for Portfolio OS & Terminal Console
  window.setPortfolioTheme = setTheme;
  window.setPortfolioFontSuite = setFontSuite;
  window.getPortfolioTheme = getSavedTheme;
  window.getPortfolioFontSuite = getSavedFontSuite;
})();
