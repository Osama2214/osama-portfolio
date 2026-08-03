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

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
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

console.log('%c 🚀 Osama Ahmed Portfolio ', 'background:#7c3aed;color:#fff;font-size:16px;padding:8px 16px;border-radius:8px;font-weight:bold;');
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
      // Show Less logic
      hiddenProjects.forEach(el => {
        el.classList.add('hide-project');
      });
      projectsToggleBtn.classList.remove('showing-more');
      projectsToggleText.textContent = 'Show More';
      if (projectsToggleIcon) projectsToggleIcon.style.transform = 'rotate(0deg)';
    } else {
      // Show More logic
      hiddenProjects.forEach(el => {
        el.classList.remove('hide-project');
      });
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
  runCodeBtn.innerHTML = stopHTML;
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
  runCodeBtn.innerHTML = runHTML;
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

