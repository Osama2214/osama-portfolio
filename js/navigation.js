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

// ── ACTIVE NAV LINK ──────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-link');
const navPill   = document.getElementById('navPill');

function movePillTo(link) {
  if (!link || !navPill) return;
  navPill.style.left   = link.offsetLeft + 'px';
  navPill.style.width  = link.offsetWidth + 'px';
  navPill.style.opacity = '1';
}

const navLinksMap = {};
navLinks.forEach(link => {
  const href = link.getAttribute('href');
  if (href && href.startsWith('#')) {
    navLinksMap[href.slice(1)] = link;
  }
});

// Use a thin horizontal detection band near the middle of the viewport instead
// of an area threshold — a percentage threshold can never be reached by sections
// that are taller than the viewport (e.g. Projects), leaving them un-highlighted.
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const active = navLinksMap[entry.target.id];
      navLinks.forEach(l => l.classList.remove('active'));
      if (active) {
        active.classList.add('active');
        movePillTo(active);
      } else if (navPill) {
        // No matching nav link (e.g. hero/home section) — hide the pill
        navPill.style.opacity = '0';
      }
    }
  });
}, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });

sections.forEach(s => observer.observe(s));

// Keep pill aligned on resize
  window.addEventListener('resize', () => {
    const current = document.querySelector('.nav-link.active');
    if (current) movePillTo(current);
  });

