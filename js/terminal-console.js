// ── DEVELOPER TERMINAL CONSOLE ENGINE ──────────────────
(function () {
  const terminalPanel = document.getElementById('terminalPanel');
  const terminalToggle = document.getElementById('terminalToggle');
  const mobileTerminalToggle = document.getElementById('mobileTerminalToggle');
  const terminalCloseBtn = document.getElementById('terminalCloseBtn');
  const terminalOutput = document.getElementById('terminalOutput');
  const terminalInput = document.getElementById('terminalInput');
  const terminalInputGhost = document.getElementById('terminalInputGhost');

  if (!terminalPanel || !terminalInput) return;

  const commands = ['help', 'about', 'skills', 'projects', 'experience', 'contact', 'github', 'guestbook', 'reactions', 'coffee', 'coffee++', '3am', 'clear', 'theme', 'cv', 'social', 'secret', 'hack', 'guess'];
  const themes = ['default', 'theme-green', 'theme-cyan', 'theme-amber'];
  let currentThemeIdx = 0;

  const commandHistory = [];
  let historyIdx = 0;
  let activeSubMode = null; // 'projects', 'contact', or 'guess'
  let isTyping = false; // block input while printing typing animations
  let guessTarget = 0;
  let guessAttempts = 0;

  function openTerminalPanel() {
    // Terminal is a desktop experience — never open it on phone-sized screens
    // (covers the command palette / any trigger, not just the mobile menu item).
    if (window.matchMedia('(max-width: 768px)').matches) return;
    terminalPanel.classList.add('open');
    setTimeout(() => {
      terminalInput.focus();
    }, 100);
  }

  function closeTerminalPanel() {
    terminalPanel.classList.remove('open');
    terminalInput.blur();
  }

  if (terminalToggle) terminalToggle.addEventListener('click', openTerminalPanel);
  if (mobileTerminalToggle) {
    mobileTerminalToggle.addEventListener('click', (e) => {
      e.preventDefault();
      // Close mobile menu first
      const navMobile = document.getElementById('navMobile');
      const hamburger = document.getElementById('hamburger');
      if (navMobile) navMobile.classList.remove('open');
      if (hamburger) {
        const spans = hamburger.querySelectorAll('span');
        spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
      }
      openTerminalPanel();
    });
  }
  if (terminalCloseBtn) terminalCloseBtn.addEventListener('click', closeTerminalPanel);

  // ── Resize by dragging the top edge ──
  const resizeHandle = document.getElementById('terminalResizeHandle');
  if (resizeHandle) {
    let dragging = false, startY = 0, startH = 0;
    const MIN_H = 160;
    const maxH = () => Math.round(window.innerHeight * 0.92);

    resizeHandle.addEventListener('pointerdown', (e) => {
      dragging = true;
      startY = e.clientY;
      startH = terminalPanel.getBoundingClientRect().height;
      terminalPanel.style.transition = 'none';       // no lag while dragging
      terminalPanel.classList.add('is-resizing');
      document.body.style.userSelect = 'none';
      try { resizeHandle.setPointerCapture(e.pointerId); } catch (_) {}
      e.preventDefault();
    });

    resizeHandle.addEventListener('pointermove', (e) => {
      if (!dragging) return;
      let h = startH + (startY - e.clientY);          // drag up → taller, down → shorter
      h = Math.max(MIN_H, Math.min(maxH(), h));
      terminalPanel.style.height = h + 'px';
    });

    const endDrag = (e) => {
      if (!dragging) return;
      dragging = false;
      terminalPanel.style.transition = '';
      terminalPanel.classList.remove('is-resizing');
      document.body.style.userSelect = '';
      try { resizeHandle.releasePointerCapture(e.pointerId); } catch (_) {}
    };
    resizeHandle.addEventListener('pointerup', endDrag);
    resizeHandle.addEventListener('pointercancel', endDrag);
  }

  // Click anywhere in terminal to focus input
  terminalPanel.addEventListener('click', (e) => {
    // If user is selecting text, don't hijack focus
    if (window.getSelection().toString() === '') {
      terminalInput.focus();
    }
  });

  // Print helper
  function printLine(text, className = '') {
    const line = document.createElement('div');
    line.className = 'terminal-line ' + className;
    line.textContent = text;
    terminalOutput.appendChild(line);
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
    return line;
  }

  // HTML print helper (for special outputs like ASCII art or links)
  function printHTML(html, className = '') {
    const line = document.createElement('div');
    line.className = 'terminal-line ' + className;
    line.innerHTML = html;
    terminalOutput.appendChild(line);
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
    return line;
  }

  // Typewriter text writer
  function typeText(lineElement, text, speed = 20) {
    return new Promise((resolve) => {
      let idx = 0;
      function write() {
        if (idx < text.length) {
          lineElement.textContent += text.charAt(idx);
          idx++;
          terminalOutput.scrollTop = terminalOutput.scrollHeight;
          setTimeout(write, speed);
        } else {
          resolve();
        }
      }
      write();
    });
  }

  // Progress Bar simulator
  function simulateProgressBar(lineElement, label, speed = 50, blocksCount = 10) {
    return new Promise((resolve) => {
      let current = 0;
      function tick() {
        if (current <= blocksCount) {
          const progress = '█'.repeat(current) + ' '.repeat(blocksCount - current);
          lineElement.textContent = `[${progress}] ${Math.round((current / blocksCount) * 100)}% - ${label}`;
          current++;
          terminalOutput.scrollTop = terminalOutput.scrollHeight;
          setTimeout(tick, speed);
        } else {
          resolve();
        }
      }
      tick();
    });
  }

  // Skills concurrent progress bars
  function animateSkillsBars() {
    const skillList = [
      { name: 'PHP / Laravel', blocks: 8 },
      { name: 'C# / ASP.NET', blocks: 7 },
      { name: 'SQL & Databases', blocks: 8 },
      { name: 'RESTful APIs', blocks: 6 },
      { name: 'JavaScript', blocks: 7 },
      { name: 'HTML & CSS', blocks: 8 },
      { name: 'React', blocks: 4 }
    ];

    const promises = skillList.map(skill => {
      const line = printLine('');
      let current = 0;
      return new Promise(resolve => {
        function frame() {
          if (current <= skill.blocks) {
            const filled = '█'.repeat(current);
            const spaces = ' '.repeat(10 - current);
            line.textContent = `${filled}${spaces} ${skill.name}`;
            current++;
            terminalOutput.scrollTop = terminalOutput.scrollHeight;
            setTimeout(frame, 80 + Math.random() * 40);
          } else {
            resolve();
          }
        }
        frame();
      });
    });

    return Promise.all(promises);
  }

  // Ghost autocomplete helper
  function updateGhostText() {
    const val = terminalInput.value;
    if (val && activeSubMode === null) {
      const match = commands.find(c => c.startsWith(val.toLowerCase()));
      if (match) {
        terminalInputGhost.textContent = val + match.slice(val.length);
      } else {
        terminalInputGhost.textContent = '';
      }
    } else {
      terminalInputGhost.textContent = '';
    }
  }

  terminalInput.addEventListener('input', updateGhostText);

  // Command handlers
  async function handleCommand(cmdStr) {
    const trimmed = cmdStr.trim();
    if (!trimmed) return;

    printLine(`> ${trimmed}`, 'info');

    // Add to history
    commandHistory.push(trimmed);
    historyIdx = commandHistory.length;

    // Check sub-modes first
    if (activeSubMode === 'projects') {
      await handleProjectsSelection(trimmed);
      return;
    }
    if (activeSubMode === 'contact') {
      await handleContactSelection(trimmed);
      return;
    }
    if (activeSubMode === 'guess') {
      handleGuessInput(trimmed);
      return;
    }

    const args = trimmed.split(' ');
    const cmd = args[0].toLowerCase();

    isTyping = true;
    terminalInput.disabled = true;

    switch (cmd) {
      case 'help':
        const mob = window.innerWidth < 768;
        printLine('Available Commands:', 'banner');
        printLine(mob ? '  about      - Bio'                        : '  about      - A short biography about me');
        printLine(mob ? '  skills     - Tech stack'                 : '  skills     - Visual display of my core technical stack');
        printLine(mob ? '  projects   - My projects'                : '  projects   - Interactive list of my built projects');
        printLine(mob ? '  experience - Education history'          : '  experience - Detailed educational & scholarship history');
        printLine(mob ? '  contact    - Reach out'                  : '  contact    - Channels to reach out or connect with me');
        printLine(mob ? '  github     - Live GitHub stats'          : '  github     - Live GitHub stats (repos, stars, followers)');
        printLine(mob ? '  guestbook  - Sign the guestbook'         : '  guestbook  - Recent messages + jump to the guestbook');
        printLine(mob ? '  reactions  - Project reactions'          : '  reactions  - Live like/love/star counts per project');
        printLine(mob ? '  cv         - Open resume'                : '  cv         - Simulates and opens my resume PDF');
        printLine(mob ? '  coffee     - Energize'                   : '  coffee     - Energize the terminal developer');
        printLine(mob ? '  theme      - Change colors'              : '  theme      - Cycle console colors (purple, green, cyan, amber)');
        printLine(mob ? '  social     - GitHub & LinkedIn'          : '  social     - Quick links to GitHub & LinkedIn');
        printLine(mob ? '  clear      - Clear console'              : '  clear      - Wipes the console history clean');
        printLine(mob ? '  hack       - Hack sequence'              : '  hack       - Initiate terminal hack sequence');
        printLine(mob ? '  guess      - Number game'                : '  guess      - Play a number guessing game');
        printLine(mob ? '  secret     - [LOCKED]'                   : '  secret     - [LOCKED] You need root access first...');
        break;

      case 'about':
        const loadingLine = printLine('', 'loading');
        await typeText(loadingLine, 'Loading bio...', 15);
        await new Promise(r => setTimeout(r, 350));
        loadingLine.remove();

        const aboutLine = printLine('');
        await typeText(aboutLine, "Hi,\nI'm Osama Ahmed.\n\nBackend Developer & 3rd-year IT student at EELU.\n\nBuilt Munjez — a full offline desktop productivity app — solo.\nCurrently mastering ASP.NET Core & PHP/Laravel.\nAvailable for Internships ✅\n", 15);
        break;

      case 'skills':
        printLine('Loading technical stack visualizer...', 'loading');
        await new Promise(r => setTimeout(r, 400));
        await animateSkillsBars();
        break;

      case 'projects':
        printLine('1. Munjez            (Productivity Desktop App)');
        printLine('2. Munjez Website    (Marketing & Landing Page)');
        printLine('3. Osama Café        (Coffee Shop Landing Page)');
        printLine('');
        printLine('Choose project number [1-3]:', 'info');
        activeSubMode = 'projects';
        break;

      case 'experience':
        printLine('Digital Egypt Pioneers Initiative (DEPI) - Trainee (2026-Present)', 'banner');
        printLine('  - Stack: Full Stack .NET (C#, ASP.NET Core, EF, SQL Server)');
        printLine('  - Coverage: Architecture design, soft skills, agile frameworks.');
        printLine('');
        printLine('National Telecommunication Institute (NTI) - Trainee (2026-Present)', 'banner');
        printLine('  - Stack: Full Stack PHP (OOP, Laravel MVC, MySQL, Bootstrap)');
        printLine('  - Coverage: Daily bootcamp style project shipping.');
        printLine('');
        printLine('Egyptian E-Learning University (EELU) - B.Sc. IT (2024-2028 Expected)', 'banner');
        printLine('  - 3rd Year student focusing on software engineering foundations.');
        break;

      case 'contact':
        printLine('Contact Channels:', 'banner');
        printLine('  [email]    - osamaahmed.dev00@gmail.com');
        printLine('  [linkedin] - Osama Ahmed');
        printLine('  [github]   - @Osama2214');
        printLine('');
        printLine('Type target keyword (e.g. github, linkedin, email) to open:', 'info');
        activeSubMode = 'contact';
        break;

      case 'cv':
        const cvLine = printLine('', 'loading');
        await typeText(cvLine, 'Downloading CV...', 20);
        const cvProgress = printLine('');
        await simulateProgressBar(cvProgress, 'Osama_Ahmed_CV.pdf', 80, 10);
        printLine('Done ✔', 'success');
        window.open('Osama_Ahmed_CV.pdf', '_blank');
        break;

      case 'coffee':
        const grindLine = printLine('', 'loading');
        await typeText(grindLine, 'Grinding Beans...', 25);
        const grindProgress = printLine('');
        await simulateProgressBar(grindProgress, 'Grinding', 50, 6);
        
        const brewLine = printLine('', 'loading');
        await typeText(brewLine, '\nBrewing...', 25);
        const brewProgress = printLine('');
        await simulateProgressBar(brewProgress, 'Extraction', 80, 10);
        
        printHTML('<pre style="color:var(--term-accent); font-family: monospace; line-height: 1.2;">\n    (  )   (  )\n     )  )   )  )\n    (__(___(___)\n    |          | ]\n    |          |\n    |__________|\n</pre>');
        printLine('☕ Developer Energy +100', 'success');
        break;

      case 'coffee++':
        printLine('[EASTER EGG] Overclocking coffee module...', 'loading');
        await new Promise(r => setTimeout(r, 600));
        const megaBrewProgress = printLine('');
        await simulateProgressBar(megaBrewProgress, 'MEGA BREW', 40, 12);
        printHTML(String.raw`<pre style="color: #f59e0b; font-family: 'JetBrains Mono', monospace; font-size: 13px; line-height: 1.3; white-space: pre !important;">  ) ) )
 ( ( (
  ) ) )
..........
|  MEGA  |
| COFFEE | ]
|        |
|________|</pre>`);
        printLine('[WIN] DEVELOPER ENERGY +9999 — MAXIMUM OVERDRIVE', 'success');
        printLine('[WARNING] Productivity levels exceeding safe limits.', 'error');
        if (window.triggerCoffeeOverdrive) window.triggerCoffeeOverdrive();
        document.body.style.transition = 'filter 0.15s';
        document.body.style.filter = 'brightness(1.5)';
        setTimeout(() => { document.body.style.filter = ''; }, 200);
        break;

      case '3am':
        printLine('[EASTER EGG] Simulating 3 AM Midnight Mode...', 'loading');
        await new Promise(r => setTimeout(r, 400));
        if (window.triggerMidnightMode) window.triggerMidnightMode();
        printLine('[SUCCESS] 3 AM Night-Owl Mode Activated!', 'success');
        break;

      case 'clear':
        // Remove all lines except the initial banner header
        Array.from(terminalOutput.children).forEach(el => {
          if (!el.classList.contains('banner')) el.remove();
        });
        break;

      case 'theme':
        terminalPanel.classList.remove(...themes.filter(t => t !== 'default'));
        currentThemeIdx = (currentThemeIdx + 1) % themes.length;
        const targetTheme = themes[currentThemeIdx];
        if (targetTheme !== 'default') {
          terminalPanel.classList.add(targetTheme);
        }
        printLine(`Console theme switched to: ${targetTheme.replace('theme-', '')}`, 'success');
        break;

      case 'social':
        printHTML('LinkedIn: <a href="https://www.linkedin.com/in/osama-ahmed-67127222a" target="_blank" style="color:var(--term-accent)">Osama Ahmed</a>');
        printHTML('GitHub: <a href="https://github.com/Osama2214" target="_blank" style="color:var(--term-accent)">@Osama2214</a>');
        break;

      case 'secret':
        if (terminalPanel.classList.contains('access-granted')) {
          printLine('[UNLOCKED] Decryption Successful. Secret Document Unlocked:', 'success');
          printLine('  - Access Level   : Recruiter Mode (Activated)');
          printLine('  - Special Code   : CHIEF_DEVELOPER_OSAMA_2026');
          printLine('  - Objective      : Hire Osama Ahmed or schedule an interview!');
          printLine('  - Hidden Feature : Try typing "coffee" or "theme" to customize.');
        } else {
          printLine('[DENIED] Access restricted. Insufficient privileges.', 'error');
          await new Promise(r => setTimeout(r, 400));
          printLine('  HINT: Only a system administrator can unlock this.', 'loading');
          await new Promise(r => setTimeout(r, 400));
          printLine('  HINT: Try running a privileged command... maybe "sudo" something?', 'loading');
          await new Promise(r => setTimeout(r, 400));
          printLine('  HINT: The right action might get someone... employed.', 'loading');
        }
        break;

      case 'hack':
        const hackLine1 = printLine('', 'loading');
        await typeText(hackLine1, 'Initiating hack sequence...', 18);
        await new Promise(r => setTimeout(r, 300));
        const hackLine2 = printLine('', 'loading');
        await typeText(hackLine2, 'Bypassing firewall...', 18);
        await new Promise(r => setTimeout(r, 250));
        const hackLine3 = printLine('', 'loading');
        await typeText(hackLine3, 'Injecting payload...', 18);
        await new Promise(r => setTimeout(r, 300));
        const hackLine4 = printLine('', 'loading');
        await typeText(hackLine4, 'Decrypting database...', 18);
        await new Promise(r => setTimeout(r, 400));
        printLine('[ERROR 403] Target is Osama Ahmed. Hack Aborted.', 'error');
        printLine('[REASON]   Developer too good to be hacked.', 'error');
        break;

      case 'guess':
        guessTarget = Math.floor(Math.random() * 100) + 1;
        guessAttempts = 0;
        printLine('[GAME] Number Guessing — started!', 'banner');
        printLine(`I'm thinking of a number between 1 and 100.`);
        printLine('Type your guess and press Enter:');
        activeSubMode = 'guess';
        break;

      case 'sudo':
        if (args.slice(1).join(' ').toLowerCase() === 'hire osama') {
          terminalPanel.classList.add('access-granted');
          printLine('Access Granted.', 'success');
          printLine('Welcome Recruiter.', 'success');
          printHTML(String.raw`<pre style="font-family: 'JetBrains Mono', Consolas, Monaco, 'Courier New', Courier, monospace !important; font-size: 11px; line-height: 1.35; margin-top: 8px; white-space: pre !important;">  
  ___   ____      _     __  __     _      _   _  _____  ____   _____  _  _ 
 / _ \ / ___|    / \   |  \/  |   / \    | | | || ____||  _ \ | ____|| || |
| | | |\___ \   / _ \  | |\/| |  / _ \   | |_| ||  _|  | |_) ||  _|  | || |
| |_| | ___) | / ___ \ | |  | | / ___ \  |  _  || |___ |  _ < | |___ |_||_|
 \___/ |____/ /_/   \_\|_|  |_|/_/   \_\ |_| |_||_____||_| \_\|_____|(_)(_)
                                                                           </pre>`);
          triggerConfettiEffect();
        } else {
          printLine('Access Denied', 'error');
        }
        break;

      case 'github': {
        printLine('Fetching live GitHub stats...', 'loading');
        try {
          const res = await fetch('/api/github', { headers: { Accept: 'application/json' } });
          const d = await res.json();
          if (d && !d.error) {
            printLine(`@${d.login}${d.name ? ' — ' + d.name : ''}`, 'banner');
            printLine(`  Public Repos : ${d.repos}`);
            printLine(`  Total Stars  : ${d.stars}`);
            printLine(`  Followers    : ${d.followers}`);
            if (Array.isArray(d.top) && d.top.length) {
              printLine('  Top repos    :');
              d.top.slice(0, 3).forEach(rp => printLine(`     - ${rp.name} (${rp.stars} stars)`));
            }
            printHTML('Profile: <a href="https://github.com/Osama2214" target="_blank" style="color:var(--term-accent)">github.com/Osama2214</a>');
          } else {
            printLine('Could not reach GitHub right now.', 'error');
          }
        } catch (e) { printLine('Could not reach GitHub right now.', 'error'); }
        break;
      }

      case 'guestbook': {
        printLine('Loading guestbook...', 'loading');
        try {
          const res = await fetch('/api/guestbook', { headers: { Accept: 'application/json' } });
          const d = await res.json();
          if (d && d.configured === false) {
            printLine('Guestbook is being set up — check back soon.', 'info');
          } else {
            const entries = d.entries || [];
            printLine(`Guestbook — ${entries.length} message${entries.length === 1 ? '' : 's'} signed.`, 'banner');
            entries.slice(0, 3).forEach(e => printLine(`  ${e.name}: ${String(e.message).slice(0, 60)}`));
            printLine('Opening the Guestbook — sign it!', 'success');
            const gb = document.getElementById('guestbook');
            if (gb) { closeTerminalPanel(); gb.scrollIntoView({ behavior: 'smooth' }); }
          }
        } catch (e) { printLine('Could not load the guestbook.', 'error'); }
        break;
      }

      case 'reactions': {
        printLine('Loading live project reactions...', 'loading');
        try {
          const res = await fetch('/api/reactions', { headers: { Accept: 'application/json' } });
          const d = await res.json();
          if (d && d.reactions) {
            const names = { 'munjez': 'Munjez', 'munjez-website': 'Munjez Website', 'osama-cafe': 'Osama Café' };
            printLine('Live Project Reactions:', 'banner');
            Object.keys(d.reactions).forEach(p => {
              const c = d.reactions[p];
              printLine(`  ${(names[p] || p).padEnd(15)} like ${c.like}  ·  love ${c.love}  ·  star ${c.star}`);
            });
            printLine('React on the Projects section!', 'info');
          } else {
            printLine('Reactions are not available right now.', 'error');
          }
        } catch (e) { printLine('Could not load reactions.', 'error'); }
        break;
      }

      default:
        printLine(`command not found: "${cmd}". Type "help" to see available commands.`, 'error');
        break;
    }

    isTyping = false;
    terminalInput.disabled = false;
    terminalInput.value = '';
    terminalInputGhost.textContent = '';
    
    // Maintain focus
    setTimeout(() => {
      terminalInput.focus();
    }, 10);
  }

  // Handle Projects mode selection
  async function handleProjectsSelection(choice) {
    activeSubMode = null; // reset state
    terminalInput.value = '';
    terminalInputGhost.textContent = '';

    if (choice === '1') {
      printLine('Munjez — Productivity Desktop App', 'banner');
      printLine('Status: Free & Shipped (Windows, Linux, Android)');
      printLine('Tech Stack: React, TypeScript, Tauri, Rust, Vite, Firebase');
      printLine('Features: Smart Tasks, 4-view Calendar (Hijri), Pomodoro, Habit Tracker, Stopwatch, White Noise Mixer.');
      printHTML('Website: <a href="https://munjez-website.vercel.app" target="_blank" style="color:var(--term-accent)">https://munjez-website.vercel.app</a>');
      printHTML('GitHub:  <a href="https://github.com/Osama2214/munjez-releases" target="_blank" style="color:var(--term-accent)">github.com/Osama2214/munjez-releases</a>');
    } else if (choice === '2') {
      printLine('Munjez Website — Marketing & Landing Page', 'banner');
      printLine('Status: Live');
      printLine('Tech Stack: HTML, CSS, JavaScript, Vercel');
      printLine('Features: Bilingual (Arabic & English), full changelog, download links, privacy policy.');
      printHTML('Live Site: <a href="https://munjez-website.vercel.app" target="_blank" style="color:var(--term-accent)">https://munjez-website.vercel.app</a>');
      printHTML('GitHub:   <a href="https://github.com/Osama2214/munjez-website" target="_blank" style="color:var(--term-accent)">github.com/Osama2214/munjez-website</a>');
    } else if (choice === '3') {
      printLine('Osama Café — Specialty Coffee Shop & Roastery Web', 'banner');
      printLine('Status: Live');
      printLine('Tech Stack: HTML5, CSS3, JavaScript');
      printLine('Features: Fluid typography, glassmorphism nav, dynamic animations, scroll-triggered hooks, zero-dependency.');
      printHTML('Live Site: <a href="https://coffee-landing-osama.vercel.app/" target="_blank" style="color:var(--term-accent)">https://coffee-landing-osama.vercel.app/</a>');
      printHTML('GitHub:   <a href="https://github.com/Osama2214/NTI-Full-Stack-Web-Development/tree/main/Task-2/osama-cafe" target="_blank" style="color:var(--term-accent)">NTI-Full-Stack-Web-Development/Task-2/osama-cafe</a>');
    } else {
      printLine('Invalid selection. Exited project selector.', 'error');
    }

    setTimeout(() => {
      terminalInput.focus();
    }, 10);
  }

  // Handle Contact mode selection
  async function handleContactSelection(choice) {
    activeSubMode = null;
    terminalInput.value = '';
    terminalInputGhost.textContent = '';

    const cleaned = choice.toLowerCase().trim();
    if (cleaned === 'github') {
      printLine('Opening GitHub profile...', 'success');
      window.open('https://github.com/Osama2214', '_blank');
    } else if (cleaned === 'linkedin') {
      printLine('Opening LinkedIn profile...', 'success');
      window.open('https://www.linkedin.com/in/osama-ahmed-67127222a', '_blank');
    } else if (cleaned === 'email') {
      printLine('Opening mail client...', 'success');
      window.open('mailto:osamaahmed.dev00@gmail.com', '_blank');
    } else {
      printLine('Unknown contact keyword. Exited contact selector.', 'error');
    }

    setTimeout(() => { terminalInput.focus(); }, 10);
  }

  // Handle Guess Game mode
  function handleGuessInput(input) {
    const num = parseInt(input.trim());
    if (isNaN(num) || num < 1 || num > 100) {
      printLine('Please enter a valid number between 1 and 100.', 'error');
      return;
    }
    guessAttempts++;
    if (num === guessTarget) {
      printLine(`[WIN] Correct! Guessed in ${guessAttempts} attempt${guessAttempts > 1 ? 's' : ''}.`, 'success');
      printLine('Type "guess" to play again anytime.');
      activeSubMode = null;
    } else if (num < guessTarget) {
      printLine('[^] Too low!  Go higher.', 'loading');
    } else {
      printLine('[v] Too high! Go lower.', 'loading');
    }
    terminalInput.value = '';
    terminalInputGhost.textContent = '';
    setTimeout(() => { terminalInput.focus(); }, 10);
  }

  // Trigger visual confetti effect on recruiter hire
  function triggerConfettiEffect() {
    const duration = 3000;
    const end = Date.now() + duration;
    
    const colors = ['#10b981', '#34d399', '#a78bfa', '#06b6d4', '#fbbf24', '#f472b6'];

    function frame() {
      if (Date.now() > end) return;
      
      const particle = document.createElement('div');
      particle.style.position = 'fixed';
      particle.style.width = Math.random() * 8 + 4 + 'px';
      particle.style.height = Math.random() * 8 + 4 + 'px';
      particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      particle.style.left = Math.random() * window.innerWidth + 'px';
      particle.style.bottom = '0px';
      particle.style.zIndex = '99999';
      particle.style.borderRadius = '50%';
      particle.style.pointerEvents = 'none';

      document.body.appendChild(particle);

      let velocityY = Math.random() * -12 - 6;
      let velocityX = (Math.random() - 0.5) * 6;
      let posY = window.innerHeight;
      let posX = parseFloat(particle.style.left);

      function update() {
        velocityY += 0.35; // gravity
        posY += velocityY;
        posX += velocityX;
        particle.style.top = posY + 'px';
        particle.style.left = posX + 'px';

        if (posY < window.innerHeight + 20) {
          requestAnimationFrame(update);
        } else {
          particle.remove();
        }
      }
      update();

      setTimeout(frame, 40);
    }
    frame();
  }

  // Key Event Handling
  terminalInput.addEventListener('keydown', (e) => {
    if (isTyping) {
      e.preventDefault();
      return;
    }

    // Enter Key
    if (e.key === 'Enter') {
      const val = terminalInput.value;
      handleCommand(val);
      return;
    }

    // Up Arrow
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length === 0) return;
      if (historyIdx > 0) {
        historyIdx--;
        terminalInput.value = commandHistory[historyIdx];
        updateGhostText();
      }
      return;
    }

    // Down Arrow
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIdx < commandHistory.length - 1) {
        historyIdx++;
        terminalInput.value = commandHistory[historyIdx];
        updateGhostText();
      } else {
        historyIdx = commandHistory.length;
        terminalInput.value = '';
        updateGhostText();
      }
      return;
    }

    // Tab Key
    if (e.key === 'Tab') {
      e.preventDefault();
      if (activeSubMode !== null) return;
      const val = terminalInput.value;
      if (val) {
        const match = commands.find(c => c.startsWith(val.toLowerCase()));
        if (match) {
          terminalInput.value = match;
          updateGhostText();
        }
      }
    }
  });
})();

