/* ══════════════════════════════════════════════════════════════
   PORTFOLIO OS — GAMES  (Snake · Tic-Tac-Toe · Flappy Bird)
   Self-contained builders: each only touches its own window body,
   the DOM, localStorage and its own Web-Audio. Extracted verbatim
   from portfolio-os.js and exposed on window so the OS app switch
   (buildAppContent) can call them. MUST load before portfolio-os.js.
══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  // ── APP: Snake ───────────────────────────────────────────────
  const SNAKE_BEST_KEY = 'portfolio-os-snake-best';
  function buildGame(body) {
    body.style.overflow = 'hidden';
    body.innerHTML = `
      <div class="pos-game">
        <div class="pos-game-hud">
          <div class="pos-game-stat">SCORE <span id="posGameScore">0</span></div>
          <div class="pos-game-stat">BEST <span id="posGameBest">0</span></div>
          <button class="pos-game-restart" id="posGameRestart" type="button" title="Restart">⟲</button>
        </div>
        <div class="pos-game-board-area">
          <div class="pos-game-board-wrap">
            <canvas id="posGameCanvas" width="360" height="360"></canvas>
            <div class="pos-game-overlay" id="posGameOverlay">
              <div class="pos-game-overlay-title">🐍 Snake</div>
              <div class="pos-game-overlay-sub" id="posGameOverlaySub">Arrow Keys or WASD to move</div>
              <button class="pos-game-overlay-btn" id="posGameStartBtn" type="button">Press to Start</button>
            </div>
          </div>
        </div>
        <div class="pos-game-hint">Move: Arrows / WASD &nbsp;·&nbsp; Pause: Space</div>
      </div>`;

    const winEl     = body.closest('.pos-window');
    const boardArea = body.querySelector('.pos-game-board-area');
    const boardWrap = body.querySelector('.pos-game-board-wrap');
    const canvas    = body.querySelector('#posGameCanvas');
    const ctx       = canvas.getContext('2d');
    const scoreEl   = body.querySelector('#posGameScore');
    const bestEl    = body.querySelector('#posGameBest');
    const overlay   = body.querySelector('#posGameOverlay');
    const overlaySub= body.querySelector('#posGameOverlaySub');
    const startBtn  = body.querySelector('#posGameStartBtn');
    const restartBtn= body.querySelector('#posGameRestart');

    const COLS = 18, ROWS = 18;
    const START_SPEED = 130, MIN_SPEED = 70;
    let CELL = canvas.width / COLS;

    function resizeBoard() {
      if (!winEl.isConnected) { boardResizeObserver.disconnect(); return; }
      const size = Math.max(160, Math.floor(Math.min(boardArea.clientWidth, boardArea.clientHeight)));
      if (size === canvas.width) return;
      boardWrap.style.width  = size + 'px';
      boardWrap.style.height = size + 'px';
      canvas.width  = size;
      canvas.height = size;
      CELL = canvas.width / COLS;
      draw();
    }
    const boardResizeObserver = new ResizeObserver(resizeBoard);
    boardResizeObserver.observe(boardArea);
    winEl.addEventListener('pos-win-resize', resizeBoard);

    let snake, dir, nextDir, food, score, best, speed, running, paused, tickTimer;

    function loadBest() {
      try { return parseInt(localStorage.getItem(SNAKE_BEST_KEY), 10) || 0; }
      catch (err) { return 0; }
    }
    function saveBest(v) {
      try { localStorage.setItem(SNAKE_BEST_KEY, String(v)); } catch (err) {}
    }

    function placeFood() {
      let pos;
      do {
        pos = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) };
      } while (snake.some(s => s.x === pos.x && s.y === pos.y));
      food = pos;
    }

    function resetGame() {
      snake = [{ x: 8, y: 9 }, { x: 7, y: 9 }, { x: 6, y: 9 }];
      dir = { x: 1, y: 0 };
      nextDir = { x: 1, y: 0 };
      score = 0;
      speed = START_SPEED;
      running = false;
      paused = false;
      scoreEl.textContent = '0';
      placeFood();
      draw();
    }

    function startGame() {
      resetGame();
      running = true;
      overlay.classList.remove('pos-game-overlay-visible');
      clearInterval(tickTimer);
      tickTimer = setInterval(tick, speed);
    }

    function stopLoop() {
      clearInterval(tickTimer);
      running = false;
    }

    function gameOver() {
      stopLoop();
      const isNewBest = score > best;
      if (isNewBest) { best = score; saveBest(best); bestEl.textContent = String(best); }
      overlaySub.innerHTML = `Score: <b>${score}</b>${isNewBest ? ' &mdash; <span class="pos-game-newbest">New Best!</span>' : ''}`;
      body.querySelector('.pos-game-overlay-title').textContent = 'Game Over';
      startBtn.textContent = 'Play Again';
      overlay.classList.add('pos-game-overlay-visible');
    }

    function togglePause() {
      if (!running) return;
      paused = !paused;
      if (paused) {
        clearInterval(tickTimer);
        body.querySelector('.pos-game-overlay-title').textContent = 'Paused';
        overlaySub.textContent = `Score: ${score}`;
        startBtn.textContent = 'Resume';
        overlay.classList.add('pos-game-overlay-visible');
      } else {
        overlay.classList.remove('pos-game-overlay-visible');
        tickTimer = setInterval(tick, speed);
      }
    }

    function tick() {
      // Auto-cleanup once this window's DOM is gone
      if (!canvas.isConnected) { clearInterval(tickTimer); return; }

      dir = nextDir;
      const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };

      if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS ||
          snake.some(s => s.x === head.x && s.y === head.y)) {
        gameOver();
        return;
      }

      snake.unshift(head);

      if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreEl.textContent = String(score);
        placeFood();
        speed = Math.max(MIN_SPEED, START_SPEED - Math.floor(score / 50) * 6);
        clearInterval(tickTimer);
        tickTimer = setInterval(tick, speed);
      } else {
        snake.pop();
      }

      draw();
    }

    function draw() {
      if (!snake || !food) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Board
      ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--pos-surface-2') || '#0c1223';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Food
      const accent2 = getComputedStyle(document.documentElement).getPropertyValue('--pos-accent-2').trim() || '#06b6d4';
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(food.x * CELL + CELL / 2, food.y * CELL + CELL / 2, CELL / 2.6, 0, Math.PI * 2);
      ctx.fill();

      // Snake
      const accent = getComputedStyle(document.documentElement).getPropertyValue('--pos-accent').trim() || '#a78bfa';
      snake.forEach((s, i) => {
        ctx.fillStyle = i === 0 ? accent2 : accent;
        ctx.globalAlpha = i === 0 ? 1 : Math.max(0.45, 1 - i * 0.03);
        ctx.fillRect(s.x * CELL + 1, s.y * CELL + 1, CELL - 2, CELL - 2);
      });
      ctx.globalAlpha = 1;
    }

    function setDirection(dx, dy) {
      if (!running || paused) return;
      // Ignore reversal onto the snake's own neck
      if (dir.x === -dx && dir.y === -dy) return;
      nextDir = { x: dx, y: dy };
    }

    function onKeyDown(e) {
      if (!winEl.isConnected) { document.removeEventListener('keydown', onKeyDown); return; }
      if (!winEl.classList.contains('pos-win-focused')) return;

      switch (e.key) {
        case 'ArrowUp': case 'w': case 'W': e.preventDefault(); setDirection(0, -1); break;
        case 'ArrowDown': case 's': case 'S': e.preventDefault(); setDirection(0, 1); break;
        case 'ArrowLeft': case 'a': case 'A': e.preventDefault(); setDirection(-1, 0); break;
        case 'ArrowRight': case 'd': case 'D': e.preventDefault(); setDirection(1, 0); break;
        case ' ': e.preventDefault(); togglePause(); break;
      }
    }

    document.addEventListener('keydown', onKeyDown);
    startBtn.addEventListener('click', startGame);
    restartBtn.addEventListener('click', startGame);

    best = loadBest();
    bestEl.textContent = String(best);
    resetGame();
    overlay.classList.add('pos-game-overlay-visible');
  }

  // ── APP: Tic-Tac-Toe ─────────────────────────────────────────
  const XO_SCORE_KEY = 'portfolio-os-xo-score';
  function buildXO(body) {
    body.style.overflow = 'hidden';
    body.innerHTML = `
      <div class="pos-xo">
        <div class="pos-xo-hud">
          <div class="pos-xo-score-box"><span class="pos-xo-score-label pos-xo-label-x">X</span><span id="posXoScoreX">0</span></div>
          <div class="pos-xo-score-box"><span class="pos-xo-score-label">Draws</span><span id="posXoScoreD">0</span></div>
          <div class="pos-xo-score-box"><span class="pos-xo-score-label pos-xo-label-o">O</span><span id="posXoScoreO">0</span></div>
        </div>
        <div class="pos-xo-modebar">
          <button class="pos-xo-mode-btn pos-xo-mode-active" data-mode="cpu" type="button">vs Computer</button>
          <button class="pos-xo-mode-btn" data-mode="2p" type="button">2 Player</button>
        </div>
        <div class="pos-xo-status" id="posXoStatus">Your turn — X</div>
        <div class="pos-xo-board" id="posXoBoard"></div>
        <button class="pos-xo-restart" id="posXoRestart" type="button">⟲ New Round</button>
      </div>`;

    const boardEl    = body.querySelector('#posXoBoard');
    const statusEl   = body.querySelector('#posXoStatus');
    const modeBtns   = body.querySelectorAll('.pos-xo-mode-btn');
    const restartBtn = body.querySelector('#posXoRestart');
    const scoreXEl   = body.querySelector('#posXoScoreX');
    const scoreOEl   = body.querySelector('#posXoScoreO');
    const scoreDEl   = body.querySelector('#posXoScoreD');

    const LINES = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];

    let mode = 'cpu';
    let board, current, over, scores;

    function loadScores() {
      try { return JSON.parse(localStorage.getItem(XO_SCORE_KEY)) || { x: 0, o: 0, draw: 0 }; }
      catch (err) { return { x: 0, o: 0, draw: 0 }; }
    }
    function saveScores() {
      try { localStorage.setItem(XO_SCORE_KEY, JSON.stringify(scores)); } catch (err) {}
    }
    function renderScores() {
      scoreXEl.textContent = String(scores.x);
      scoreOEl.textContent = String(scores.o);
      scoreDEl.textContent = String(scores.draw);
    }

    function cellEl(i) { return boardEl.children[i]; }

    function buildBoardDOM() {
      boardEl.innerHTML = '';
      const frag = document.createDocumentFragment();
      for (let i = 0; i < 9; i++) {
        const c = document.createElement('button');
        c.type = 'button';
        c.className = 'pos-xo-cell';
        c.dataset.i = i;
        frag.appendChild(c);
      }
      boardEl.appendChild(frag);
    }

    function checkResult(b) {
      for (const line of LINES) {
        const [a, b1, c] = line;
        if (b[a] && b[a] === b[b1] && b[a] === b[c]) return { winner: b[a], line };
      }
      if (b.every(v => v)) return { winner: 'draw', line: null };
      return null;
    }

    function minimax(b, depth, isMax) {
      const res = checkResult(b);
      if (res) {
        if (res.winner === 'O') return 10 - depth;
        if (res.winner === 'X') return depth - 10;
        return 0;
      }
      if (isMax) {
        let best = -Infinity;
        for (let i = 0; i < 9; i++) if (!b[i]) { b[i] = 'O'; best = Math.max(best, minimax(b, depth + 1, false)); b[i] = null; }
        return best;
      } else {
        let best = Infinity;
        for (let i = 0; i < 9; i++) if (!b[i]) { b[i] = 'X'; best = Math.min(best, minimax(b, depth + 1, true)); b[i] = null; }
        return best;
      }
    }

    function computerMove() {
      let bestScore = -Infinity, move = -1;
      for (let i = 0; i < 9; i++) if (!board[i]) {
        board[i] = 'O';
        const score = minimax(board, 0, false);
        board[i] = null;
        if (score > bestScore) { bestScore = score; move = i; }
      }
      if (move !== -1) placeMark(move, 'O');
    }

    function updateStatus() {
      if (over) return;
      statusEl.textContent = mode === 'cpu'
        ? (current === 'X' ? 'Your turn — X' : 'Computer is thinking...')
        : `Player ${current}'s turn`;
    }

    function disableBoard() {
      Array.from(boardEl.children).forEach(c => c.disabled = true);
    }

    function placeMark(i, mark) {
      if (over || board[i]) return;
      board[i] = mark;
      const el = cellEl(i);
      el.textContent = mark;
      el.classList.add('pos-xo-mark', mark === 'X' ? 'pos-xo-x' : 'pos-xo-o');
      el.disabled = true;

      const res = checkResult(board);
      if (res) {
        over = true;
        if (res.winner === 'draw') {
          scores.draw++;
          statusEl.textContent = "It's a draw!";
        } else {
          scores[res.winner.toLowerCase()]++;
          statusEl.textContent = mode === 'cpu'
            ? (res.winner === 'X' ? 'You win! 🎉' : 'Computer wins!')
            : `Player ${res.winner} wins! 🎉`;
          res.line.forEach(idx => cellEl(idx).classList.add('pos-xo-win-cell'));
        }
        saveScores();
        renderScores();
        disableBoard();
        return;
      }

      current = current === 'X' ? 'O' : 'X';
      updateStatus();

      if (!over && mode === 'cpu' && current === 'O') {
        boardEl.classList.add('pos-xo-board-disabled');
        setTimeout(() => {
          if (!boardEl.isConnected) return;
          computerMove();
          boardEl.classList.remove('pos-xo-board-disabled');
        }, 450);
      }
    }

    function newRound() {
      board = Array(9).fill(null);
      current = 'X';
      over = false;
      boardEl.classList.remove('pos-xo-board-disabled');
      buildBoardDOM();
      updateStatus();
    }

    boardEl.addEventListener('click', (e) => {
      const cell = e.target.closest('.pos-xo-cell');
      if (!cell || over) return;
      if (mode === 'cpu' && current !== 'X') return;
      placeMark(parseInt(cell.dataset.i, 10), current);
    });

    modeBtns.forEach(b => b.addEventListener('click', () => {
      mode = b.dataset.mode;
      modeBtns.forEach(x => x.classList.toggle('pos-xo-mode-active', x === b));
      newRound();
    }));

    restartBtn.addEventListener('click', newRound);

    scores = loadScores();
    renderScores();
    newRound();
  }

  // ── APP: Flappy Bird ─────────────────────────────────────────
  const FLAPPY_BEST_KEY = 'portfolio-os-flappy-best';
  function buildFlappy(body) {
    body.style.overflow = 'hidden';
    body.innerHTML = `
      <div class="pos-game">
        <div class="pos-game-hud">
          <div class="pos-game-stat">SCORE <span id="posFlapScore">0</span></div>
          <div class="pos-game-stat">BEST <span id="posFlapBest">0</span></div>
          <button class="pos-game-restart" id="posFlapRestart" type="button" title="Restart">⟲</button>
        </div>
        <div class="pos-game-board-area">
          <div class="pos-game-board-wrap" id="posFlapWrap">
            <canvas id="posFlapCanvas" width="320" height="480"></canvas>
            <div class="pos-game-overlay" id="posFlapOverlay">
              <div class="pos-game-overlay-title">🐦 Flappy</div>
              <div class="pos-game-overlay-sub" id="posFlapOverlaySub">Space / Click to flap</div>
              <button class="pos-game-overlay-btn" id="posFlapStartBtn" type="button">Press to Start</button>
            </div>
          </div>
        </div>
        <div class="pos-game-hint">Flap: Space / Click / Tap</div>
      </div>`;

    const winEl        = body.closest('.pos-window');
    const boardArea    = body.querySelector('.pos-game-board-area');
    const boardWrap     = body.querySelector('#posFlapWrap');
    const canvas        = body.querySelector('#posFlapCanvas');
    const ctx            = canvas.getContext('2d');
    const scoreEl        = body.querySelector('#posFlapScore');
    const bestEl         = body.querySelector('#posFlapBest');
    const overlay        = body.querySelector('#posFlapOverlay');
    const overlaySub     = body.querySelector('#posFlapOverlaySub');
    const overlayTitle   = body.querySelector('.pos-game-overlay-title');
    const startBtn       = body.querySelector('#posFlapStartBtn');
    const restartBtn     = body.querySelector('#posFlapRestart');

    const BASE_W = 320, BASE_H = 480;
    const GRAVITY = 1500, FLAP_V = -380, PIPE_SPEED = 150, PIPE_GAP = 130, PIPE_W = 52, PIPE_INTERVAL = 1.5, BIRD_R = 13, BIRD_X = 70, GROUND_H = 24;

    let bird, pipes, score, best, state, spawnTimer, rafId, lastTs;

    function loadBest() {
      try { return parseInt(localStorage.getItem(FLAPPY_BEST_KEY), 10) || 0; }
      catch (err) { return 0; }
    }
    function saveBest(v) {
      try { localStorage.setItem(FLAPPY_BEST_KEY, String(v)); } catch (err) {}
    }

    function resetGame() {
      bird = { y: BASE_H / 2, vy: 0 };
      pipes = [];
      score = 0;
      spawnTimer = 0;
      state = 'idle';
      scoreEl.textContent = '0';
    }

    function spawnPipe() {
      const margin = 40;
      const gapY = margin + Math.random() * (BASE_H - GROUND_H - margin * 2 - PIPE_GAP);
      pipes.push({ x: BASE_W + PIPE_W, gapY, passed: false });
    }

    function startGame() {
      resetGame();
      state = 'playing';
      overlay.classList.remove('pos-game-overlay-visible');
      lastTs = performance.now();
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(loop);
    }

    function endGame() {
      state = 'over';
      const isNewBest = score > best;
      if (isNewBest) { best = score; saveBest(best); bestEl.textContent = String(best); }
      overlayTitle.textContent = 'Game Over';
      overlaySub.innerHTML = `Score: <b>${score}</b>${isNewBest ? ' &mdash; <span class="pos-game-newbest">New Best!</span>' : ''}`;
      startBtn.textContent = 'Play Again';
      overlay.classList.add('pos-game-overlay-visible');
    }

    function flap() {
      if (state === 'idle' || state === 'over') { startGame(); bird.vy = FLAP_V; return; }
      if (state === 'playing') bird.vy = FLAP_V;
    }

    function rectCircleCollide(cx, cy, r, rx, ry, rw, rh) {
      const closestX = Math.max(rx, Math.min(cx, rx + rw));
      const closestY = Math.max(ry, Math.min(cy, ry + rh));
      const dx = cx - closestX, dy = cy - closestY;
      return (dx * dx + dy * dy) < r * r;
    }

    function update(dt) {
      bird.vy += GRAVITY * dt;
      bird.y += bird.vy * dt;
      if (bird.y - BIRD_R < 0) { bird.y = BIRD_R; bird.vy = 0; }
      if (bird.y + BIRD_R > BASE_H - GROUND_H) {
        bird.y = BASE_H - GROUND_H - BIRD_R;
        endGame();
        return;
      }

      spawnTimer += dt;
      if (spawnTimer >= PIPE_INTERVAL) { spawnTimer = 0; spawnPipe(); }

      for (let i = pipes.length - 1; i >= 0; i--) {
        const p = pipes[i];
        p.x -= PIPE_SPEED * dt;
        if (!p.passed && p.x + PIPE_W < BIRD_X) {
          p.passed = true;
          score++;
          scoreEl.textContent = String(score);
        }
        if (p.x < -PIPE_W) { pipes.splice(i, 1); continue; }

        const topH = p.gapY;
        const botY = p.gapY + PIPE_GAP;
        if (rectCircleCollide(BIRD_X, bird.y, BIRD_R, p.x, 0, PIPE_W, topH) ||
            rectCircleCollide(BIRD_X, bird.y, BIRD_R, p.x, botY, PIPE_W, BASE_H - GROUND_H - botY)) {
          endGame();
          return;
        }
      }
    }

    function draw() {
      const scaleX = canvas.width / BASE_W, scaleY = canvas.height / BASE_H;
      ctx.save();
      ctx.setTransform(scaleX, 0, 0, scaleY, 0, 0);
      ctx.clearRect(0, 0, BASE_W, BASE_H);

      const accent2  = getComputedStyle(document.documentElement).getPropertyValue('--pos-accent-2').trim() || '#06b6d4';
      const surface2 = getComputedStyle(document.documentElement).getPropertyValue('--pos-surface-2').trim() || '#0c1223';

      ctx.fillStyle = surface2;
      ctx.fillRect(0, 0, BASE_W, BASE_H);

      ctx.fillStyle = accent2;
      pipes.forEach(p => {
        ctx.fillRect(p.x, 0, PIPE_W, p.gapY);
        ctx.fillRect(p.x, p.gapY + PIPE_GAP, PIPE_W, BASE_H - GROUND_H - (p.gapY + PIPE_GAP));
      });

      ctx.fillStyle = 'rgba(255,255,255,0.06)';
      ctx.fillRect(0, BASE_H - GROUND_H, BASE_W, GROUND_H);

      ctx.save();
      ctx.translate(BIRD_X, bird ? bird.y : BASE_H / 2);
      const vy = bird ? bird.vy : 0;
      const rot = Math.max(-0.5, Math.min(0.9, vy / 500));
      ctx.rotate(rot);

      // body — matches the 🐦 icon's pink/magenta rendering on Windows, not the OS theme
      const BIRD_BODY = '#ec4899';
      const BIRD_WING = '#be185d';
      ctx.fillStyle = BIRD_BODY;
      ctx.beginPath();
      ctx.ellipse(0, 0, BIRD_R, BIRD_R * 0.82, 0, 0, Math.PI * 2);
      ctx.fill();

      // wing — flaps up when rising, down when falling
      const wingFlap = Math.max(-1, Math.min(1, -vy / 320));
      ctx.fillStyle = BIRD_WING;
      ctx.beginPath();
      ctx.ellipse(-BIRD_R * 0.1, BIRD_R * 0.12 * wingFlap, BIRD_R * 0.62, BIRD_R * 0.36, -0.35 * wingFlap, 0, Math.PI * 2);
      ctx.fill();

      // eye
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(BIRD_R * 0.38, -BIRD_R * 0.28, BIRD_R * 0.32, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(BIRD_R * 0.48, -BIRD_R * 0.28, BIRD_R * 0.15, 0, Math.PI * 2);
      ctx.fill();

      // beak
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.moveTo(BIRD_R * 0.72, 0);
      ctx.lineTo(BIRD_R * 1.35, -BIRD_R * 0.1);
      ctx.lineTo(BIRD_R * 0.72, BIRD_R * 0.32);
      ctx.closePath();
      ctx.fill();

      ctx.restore();

      ctx.restore();
    }

    function loop(ts) {
      if (!canvas.isConnected) { rafId = null; return; }
      const dt = Math.min(0.033, (ts - lastTs) / 1000);
      lastTs = ts;
      if (state === 'playing') update(dt);
      draw();
      rafId = (state === 'playing') ? requestAnimationFrame(loop) : null;
    }

    function resizeBoard() {
      if (!winEl.isConnected) { boardResizeObserver.disconnect(); return; }
      const availW = boardArea.clientWidth, availH = boardArea.clientHeight;
      let w = availW, h = w * BASE_H / BASE_W;
      if (h > availH) { h = availH; w = h * BASE_W / BASE_H; }
      w = Math.max(160, Math.floor(w));
      h = Math.max(240, Math.floor(h));
      if (w === canvas.width && h === canvas.height) return;
      boardWrap.style.width  = w + 'px';
      boardWrap.style.height = h + 'px';
      canvas.width  = w;
      canvas.height = h;
      draw();
    }
    const boardResizeObserver = new ResizeObserver(resizeBoard);
    boardResizeObserver.observe(boardArea);
    winEl.addEventListener('pos-win-resize', resizeBoard);

    function onKeyDown(e) {
      if (!winEl.isConnected) { document.removeEventListener('keydown', onKeyDown); return; }
      if (!winEl.classList.contains('pos-win-focused')) return;
      if (e.key === ' ' || e.key === 'ArrowUp') { e.preventDefault(); flap(); }
    }
    document.addEventListener('keydown', onKeyDown);

    canvas.addEventListener('mousedown', () => flap());
    startBtn.addEventListener('click', startGame);
    restartBtn.addEventListener('click', startGame);

    best = loadBest();
    bestEl.textContent = String(best);
    resetGame();
    draw();
    overlayTitle.textContent = '🐦 Flappy';
    overlaySub.textContent = 'Space / Click to flap';
    startBtn.textContent = 'Press to Start';
    overlay.classList.add('pos-game-overlay-visible');
  }

  // ── Expose builders for portfolio-os.js buildAppContent() switch ──
  window.buildGame   = buildGame;
  window.buildXO     = buildXO;
  window.buildFlappy = buildFlappy;
})();
