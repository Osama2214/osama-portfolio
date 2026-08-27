// ── CODE CARD TYPING ANIMATION ───────────────
const codeLines = document.querySelectorAll('#codeBody .code-line');
codeLines.forEach((line, i) => {
  line.style.opacity = '0';
  line.style.transform = 'translateX(-10px)';
  line.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
  setTimeout(() => {
    line.style.opacity = '1';
    line.style.transform = 'translateX(0)';
  }, 500 + i * 120);
});

// ── CONTACT FORM (Formspree AJAX) ────────────
const contactForm   = document.getElementById('contactForm');
const formStatus     = document.getElementById('formStatus');
const sendBtn        = document.getElementById('send-message-btn');
const sendLabel      = document.getElementById('send-message-label');

// Custom validation — the form has novalidate on it, so none of this relies
// on (or fights with) the browser's native "Please fill out this field"
// popup. Same required/email-format rules, just styled to match the site
// instead of an OS-native tooltip.
const cfFields = {
  name:    { input: document.getElementById('cf-name'),    error: document.getElementById('cf-name-error') },
  email:   { input: document.getElementById('cf-email'),   error: document.getElementById('cf-email-error') },
  message: { input: document.getElementById('cf-message'), error: document.getElementById('cf-message-error') },
};

function cfSetError(field, message) {
  field.input.closest('.form-group').classList.add('has-error');
  field.error.textContent = message;
}
function cfClearError(field) {
  field.input.closest('.form-group').classList.remove('has-error');
  field.error.textContent = '';
}
function cfValidateField(key) {
  const field = cfFields[key];
  const value = field.input.value.trim();
  if (!value) {
    cfSetError(field, key === 'email' ? 'Please enter your email.' : key === 'name' ? 'Please enter your name.' : 'Please write a message.');
    return false;
  }
  if (key === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    cfSetError(field, "That email doesn't look right.");
    return false;
  }
  cfClearError(field);
  return true;
}

if (contactForm) {
  // Clear a field's error the moment the user starts fixing it, instead of
  // making them re-submit to find out it's okay now.
  Object.keys(cfFields).forEach((key) => {
    cfFields[key].input.addEventListener('input', () => {
      if (cfFields[key].input.value.trim()) cfValidateField(key);
    });
  });

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const keys = Object.keys(cfFields);
    const results = keys.map(cfValidateField);
    if (results.includes(false)) {
      cfFields[keys[results.indexOf(false)]].input.focus();
      return;
    }

    sendBtn.disabled = true;
    sendLabel.textContent = 'Sending...';
    formStatus.textContent = '';
    formStatus.className = 'form-status';

    try {
      const response = await fetch(contactForm.action, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        formStatus.textContent = "Thanks! Your message has been sent — I'll get back to you soon.";
        formStatus.classList.add('success');
        contactForm.reset();
      } else {
        formStatus.textContent = "Something went wrong. Please try again or email me directly.";
        formStatus.classList.add('error');
      }
    } catch (err) {
      formStatus.textContent = "Network error. Please try again or email me directly.";
      formStatus.classList.add('error');
    } finally {
      sendBtn.disabled = false;
      sendLabel.textContent = 'Send Message';
    }
  });
}

// ── FOOTER YEAR ──────────────────────────────
// Already hardcoded as 2026 in HTML

console.log('%c 🚀 Osama Ahmed Portfolio ', 'background:#ffffff;color:#050505;font-size:16px;padding:8px 16px;border-radius:8px;font-weight:bold;');
console.log('%c Built with ❤️ from Egypt ', 'color:#a78bfa;font-size:13px;');

// ── PROJECTS SHOW MORE / LESS ──────────────────
const projectsToggleBtn = document.getElementById('projects-toggle-btn');
const projectsToggleText = document.getElementById('projects-toggle-text');
const projectsToggleIcon = document.getElementById('projects-toggle-icon');
const hiddenProjects = document.querySelectorAll('.project-card.more-project');

if (projectsToggleBtn && hiddenProjects.length > 0) {
  projectsToggleBtn.addEventListener('click', () => {
    const isShowingMore = projectsToggleBtn.classList.contains('showing-more');
    if (isShowingMore) {
      // Show Less
      hiddenProjects.forEach(el => el.classList.add('hide-project'));
      projectsToggleBtn.classList.remove('showing-more');
      projectsToggleText.textContent = 'Show More';
      if (projectsToggleIcon) projectsToggleIcon.style.transform = 'rotate(0deg)';
    } else {
      // Show More
      hiddenProjects.forEach(el => el.classList.remove('hide-project'));
      projectsToggleBtn.classList.add('showing-more');
      projectsToggleText.textContent = 'Show Less';
      if (projectsToggleIcon) projectsToggleIcon.style.transform = 'rotate(180deg)';
    }
  });
}

// ── INTERACTIVE IDE RUN CODE ──────────────────
const runCodeBtn = document.getElementById('run-code-btn');
const closeConsoleBtn = document.getElementById('close-console-btn');
const consoleOutput = document.getElementById('consoleOutput');
const consoleLines = document.querySelectorAll('#consoleBody .console-line');

// HTML templates for states
const runHTML = `<svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg><span>Run</span>`;
const stopHTML = `<svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><rect x="4" y="4" width="16" height="16" rx="2"/></svg><span>Stop</span>`;

function openTerminal() {
  runCodeBtn.classList.add('stop-state');
  consoleOutput.classList.add('open');
  consoleLines.forEach(line => line.classList.remove('visible'));
  consoleLines.forEach((line, index) => {
    let delay = 150 + index * 180;
    if (index === 1) {
      delay = 450;
    } else if (index > 1) {
      delay = 450 + (index - 1) * 200;
    }
    setTimeout(() => {
      // Only show if the terminal is still open
      if (consoleOutput.classList.contains('open')) {
        line.classList.add('visible');
      }
    }, delay);
  });
}

function closeTerminal() {
  runCodeBtn.classList.remove('stop-state');
  consoleOutput.classList.remove('open');
  consoleLines.forEach(line => line.classList.remove('visible'));
}

if (runCodeBtn && consoleOutput) {
  runCodeBtn.addEventListener('click', () => {
    const isActive = runCodeBtn.classList.contains('stop-state');
    if (isActive) {
      closeTerminal();
    } else {
      // Rotate effect on click
      runCodeBtn.classList.add('running');
      setTimeout(() => runCodeBtn.classList.remove('running'), 600);
      openTerminal();
    }
  });
}

if (closeConsoleBtn && consoleOutput) {
  closeConsoleBtn.addEventListener('click', () => {
    closeTerminal();
  });
}

// ── DEV TOOLS DROPDOWN ───────────────────────────────────
(function () {
  const dropdown = document.getElementById('devToolsDropdown');
  const btn = document.getElementById('devToolsBtn');
  if (!dropdown || !btn) return;

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdown.classList.toggle('open');
  });

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (!dropdown.contains(e.target)) {
      dropdown.classList.remove('open');
    }
  });

  // Close dropdown when an item is clicked
  dropdown.querySelectorAll('.dev-tools-item').forEach(item => {
    item.addEventListener('click', () => {
      dropdown.classList.remove('open');
    });
  });
})();

// ── INTERACTIVE TIMELINE ───────────────────────────────────
(function () {
  // Pulse animation when node enters viewport
  const timelineItems = document.querySelectorAll('.it-item');
  if (timelineItems.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
        }
      });
    }, { threshold: 0.4 });

    timelineItems.forEach(item => observer.observe(item));
  }

  // Future node — click to reveal "Maybe Your Company?"
  const futureCard = document.getElementById('futureCard');
  if (futureCard) {
    futureCard.addEventListener('click', () => {
      futureCard.classList.toggle('revealed');
    });
  }
})();

// ── TESTIMONIALS DRAG / TOUCH SWIPE ─────────────────
(function () {
  const marquee = document.querySelector('.testi-marquee');
  const track = document.getElementById('testiTrack');
  if (!marquee || !track) return;

  let isDragging = false;
  let startX = 0;
  let currentTranslate = 0;
  let prevTranslate = 0;
  let resumeTimer = null;

  const totalDuration = 56.7; // seconds
  const loopWidth = 1700; // px

  function getTranslateX() {
    const style = window.getComputedStyle(track);
    const matrix = new WebKitCSSMatrix(style.transform);
    return matrix.m41 || 0;
  }

  function startDrag(e) {
    if (resumeTimer) clearTimeout(resumeTimer);
    isDragging = true;
    startX = e.pageX || (e.touches && e.touches[0].pageX);
    currentTranslate = getTranslateX();
    prevTranslate = currentTranslate;

    // Release CSS animation keyframe lock so inline transform moves freely!
    track.style.animation = 'none';
    track.style.transform = `translateX(${prevTranslate}px)`;
    marquee.classList.add('is-dragging');
  }

  function drag(e) {
    if (!isDragging) return;
    const x = e.pageX || (e.touches && e.touches[0].pageX);
    if (x === undefined) return;

    const diff = (x - startX) * 1.4;
    let newX = prevTranslate + diff;

    // Wrap bounds (-1700px loop)
    while (newX > 0) newX -= loopWidth;
    while (newX < -loopWidth) newX += loopWidth;

    track.style.transform = `translateX(${newX}px)`;
    currentTranslate = newX;
  }

  function resumeAutoScroll() {
    if (isDragging) return;
    let pos = currentTranslate % loopWidth;
    if (pos > 0) pos -= loopWidth;

    // Calculate negative animation delay to pick up smoothly from current position
    const progress = Math.abs(pos) / loopWidth;
    const negativeDelay = -1 * progress * totalDuration;

    track.style.transform = '';
    track.style.animation = `testi-scroll ${totalDuration}s linear infinite`;
    track.style.animationDelay = `${negativeDelay}s`;
  }

  function endDrag() {
    if (!isDragging) return;
    isDragging = false;
    marquee.classList.remove('is-dragging');

    // Resume auto-scroll after 3 seconds of inactivity
    if (resumeTimer) clearTimeout(resumeTimer);
    resumeTimer = setTimeout(resumeAutoScroll, 3000);
  }

  marquee.addEventListener('mousedown', startDrag);
  window.addEventListener('mousemove', drag);
  window.addEventListener('mouseup', endDrag);

  marquee.addEventListener('touchstart', startDrag, { passive: true });
  window.addEventListener('touchmove', drag, { passive: true });
  window.addEventListener('touchend', endDrag);
})();

// ── EMAIL COPY TO CLIPBOARD ──────────────────────────
(function () {
  const copyBtn = document.getElementById('copy-email-btn');
  if (!copyBtn) return;

  const emailText = 'osamaahmed.dev00@gmail.com';

  copyBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();

    navigator.clipboard.writeText(emailText).then(() => {
      const originalHTML = copyBtn.innerHTML;
      copyBtn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--p-light)" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg><span class="copy-tooltip">${emailText} <strong class="copy-action-text" style="color:var(--p-light);background:var(--p-glow);border-color:var(--p-h);">✓ Copied!</strong></span>`;

      setTimeout(() => {
        copyBtn.innerHTML = originalHTML;
      }, 2500);
    });
  });
})();

