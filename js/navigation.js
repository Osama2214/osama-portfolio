// ── NAVBAR SCROLL ────────────────────────────
const navbar = document.getElementById('navbar');
const scrollIndicator = document.querySelector('.scroll-indicator');
let isScrolled = false;
let isFaded = false;

window.addEventListener('scroll', () => {
  const sy = window.scrollY;
  if (sy > 20) {
    if (!isScrolled) {
      navbar.classList.add('scrolled');
      isScrolled = true;
    }
  } else {
    if (isScrolled) {
      navbar.classList.remove('scrolled');
      isScrolled = false;
    }
  }
  
  if (scrollIndicator) {
    if (sy > 50) {
      if (!isFaded) {
        scrollIndicator.classList.add('fade-out');
        isFaded = true;
      }
    } else {
      if (isFaded) {
        scrollIndicator.classList.remove('fade-out');
        isFaded = false;
      }
    }
  }
}, { passive: true });

// ── MOBILE MENU ──────────────────────────────
const hamburger = document.getElementById('hamburger');
const navMobile = document.getElementById('navMobile');

hamburger.addEventListener('click', () => {
  navMobile.classList.toggle('open');
  const spans = hamburger.querySelectorAll('span');
  const open  = navMobile.classList.contains('open');
  if (open) {
    spans[0].style.transform = 'translateY(7px) rotate(45deg)';
    spans[1].style.opacity   = '0';
    spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
  } else {
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }
});

// Close on link click
navMobile.querySelectorAll('.nav-mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    navMobile.classList.remove('open');
    const spans = hamburger.querySelectorAll('span');
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  });
});

// ── ACTIVE NAV LINK & MAGNETIC PILL ──────────────
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');
const navPill  = document.getElementById('navPill');
const navLinksContainer = document.querySelector('.nav-links');
let isPillInitialized = false;

function movePillTo(link, animate = true) {
  if (!link || !navPill) return;

  if (!isPillInitialized || animate === false) {
    navPill.style.transition = 'none';
    navPill.style.left = link.offsetLeft + 'px';
    navPill.style.width = link.offsetWidth + 'px';
    navPill.style.opacity = '1';
    void navPill.offsetWidth; // Force reflow
    navPill.style.transition = '';
    isPillInitialized = true;
    return;
  }

  navPill.style.left   = link.offsetLeft + 'px';
  navPill.style.width  = link.offsetWidth + 'px';
  navPill.style.opacity = '1';
}

// Hover gliding logic
navLinks.forEach(link => {
  link.addEventListener('mouseenter', () => {
    movePillTo(link, true);
  });
});

if (navLinksContainer) {
  navLinksContainer.addEventListener('mouseleave', () => {
    const currentActive = document.querySelector('.nav-link.active');
    if (currentActive) {
      movePillTo(currentActive, true);
    } else if (navPill) {
      navPill.style.opacity = '0';
    }
  });
}

const navLinksMap = {};
navLinks.forEach(link => {
  const href = link.getAttribute('href');
  if (href && href.startsWith('#')) {
    navLinksMap[href.slice(1)] = link;
  }
});

const observer = new IntersectionObserver((entries) => {
  if (window.scrollY < 200) {
    navLinks.forEach(l => l.classList.remove('active'));
    if (navPill && (!navLinksContainer || !navLinksContainer.matches(':hover'))) {
      navPill.style.opacity = '0';
    }
    return;
  }

  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const active = navLinksMap[entry.target.id];
      navLinks.forEach(l => l.classList.remove('active'));
      if (active) {
        active.classList.add('active');
        const isHovered = navLinksContainer && navLinksContainer.matches(':hover');
        if (!isHovered) {
          movePillTo(active, true);
        }
      } else if (navPill && (!navLinksContainer || !navLinksContainer.matches(':hover'))) {
        navPill.style.opacity = '0';
      }
    }
  });
}, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });

sections.forEach(s => observer.observe(s));

// Clear active link and hide pill when in Hero section (top of page)
window.addEventListener('scroll', () => {
  if (window.scrollY < 200) {
    navLinks.forEach(l => l.classList.remove('active'));
    if (navPill && (!navLinksContainer || !navLinksContainer.matches(':hover'))) {
      navPill.style.opacity = '0';
    }
  }
}, { passive: true });

// Initial positioning without animation on DOMContentLoaded & load
function initPillPosition() {
  if (window.scrollY < 200) {
    navLinks.forEach(l => l.classList.remove('active'));
    if (navPill) navPill.style.opacity = '0';
    return;
  }
  const current = document.querySelector('.nav-link.active');
  if (current) {
    movePillTo(current, false);
  } else if (navPill) {
    navPill.style.opacity = '0';
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPillPosition);
} else {
  initPillPosition();
}
window.addEventListener('load', initPillPosition);

// Keep pill aligned on resize
window.addEventListener('resize', () => {
  if (window.scrollY < 200) {
    if (navPill && (!navLinksContainer || !navLinksContainer.matches(':hover'))) {
      navPill.style.opacity = '0';
    }
    return;
  }
  const current = document.querySelector('.nav-link.active') || document.querySelector('.nav-link:hover');
  if (current) movePillTo(current, false);
});

