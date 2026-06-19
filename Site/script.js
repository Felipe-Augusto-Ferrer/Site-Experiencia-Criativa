/* ============================================================
   UTIL
============================================================ */
const rand = (a, b) => a + Math.random() * (b - a);
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ============================================================
   CURSOR CUSTOMIZADO
============================================================ */
const cursorDot = $('#cursorDot');
window.addEventListener('mousemove', e => {
  if (cursorDot) {
    cursorDot.style.left = e.clientX + 'px';
    cursorDot.style.top = e.clientY + 'px';
  }
});

/* ============================================================
   MENU MOBILE
============================================================ */
const navToggle = $('#navToggle');
const navLinks = $('.nav-links');
navToggle?.addEventListener('click', () => navLinks.classList.toggle('open'));
$$('.nav-links a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));

/* ============================================================
   HERO — REDE NEURAL INTERATIVA
   Pontos flutuantes que se conectam quando próximos,
   e reagem à posição do mouse (atração suave).
============================================================ */
(function neuralHero() {
  const canvas = $('#neuralCanvas');
  const ctx = canvas.getContext('2d');
  let w, h, points, mouse = { x: -9999, y: -9999 };

  function resize() {
    w = canvas.width = canvas.offsetWidth;
    h = canvas.height = canvas.offsetHeight;
  }

  function makePoints() {
    const count = Math.floor((w * h) / 16000);
    points = Array.from({ length: count }, () => ({
      x: rand(0, w), y: rand(0, h),
      vx: rand(-0.25, 0.25), vy: rand(-0.25, 0.25),
      r: rand(1.2, 2.6)
    }));
  }

  function step() {
    ctx.clearRect(0, 0, w, h);

    for (const p of points) {
      // atração suave ao mouse
      const dx = mouse.x - p.x, dy = mouse.y - p.y;
      const dist = Math.hypot(dx, dy);
      if (dist < 160) {
        p.vx += dx / dist * 0.02;
        p.vy += dy / dist * 0.02;
      }
      p.x += p.vx; p.y += p.vy;
      p.vx *= 0.98; p.vy *= 0.98;

      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;
      p.x = Math.max(0, Math.min(w, p.x));
      p.y = Math.max(0, Math.min(h, p.y));
    }

    // conexões
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        const a = points[i], b = points[j];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < 110) {
          ctx.strokeStyle = `rgba(124,255,203,${1 - d / 110})`;
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }
    // pontos
    for (const p of points) {
      ctx.beginPath();
      ctx.fillStyle = '#F2EFE6';
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }

    requestAnimationFrame(step);
  }

  window.addEventListener('resize', () => { resize(); makePoints(); });
  canvas.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });
  canvas.addEventListener('mouseleave', () => { mouse.x = -9999; mouse.y = -9999; });

  resize(); makePoints(); step();
})();

/* ============================================================
   GALERIA — 4 ESBOÇOS GENERATIVOS DIFERENTES
   Cada cartão tem seu próprio algoritmo. Clicar gera nova versão.
============================================================ */
const sketches = {
  flowfield(ctx, w, h) {
    ctx.fillStyle = '#0B0E14';
    ctx.fillRect(0, 0, w, h);
    const seed = rand(0, 1000);
    const noise = (x, y) => Math.sin((x + seed) * 0.01) + Math.cos((y - seed) * 0.013);
    for (let i = 0; i < 220; i++) {
      let x = rand(0, w), y = rand(0, h);
      ctx.strokeStyle = `hsla(${160 + rand(-20, 40)},90%,70%,.5)`;
      ctx.beginPath();
      ctx.moveTo(x, y);
      for (let s = 0; s < 26; s++) {
        const angle = noise(x, y) * Math.PI;
        x += Math.cos(angle) * 3;
        y += Math.sin(angle) * 3;
        ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
  },

  tree(ctx, w, h) {
    ctx.fillStyle = '#0B0E14';
    ctx.fillRect(0, 0, w, h);
    function branch(x, y, len, angle, depth) {
      if (depth <= 0 || len < 4) return;
      const x2 = x + Math.cos(angle) * len;
      const y2 = y + Math.sin(angle) * len;
      ctx.strokeStyle = `hsla(${10 + depth * 8},90%,${60 - depth * 3}%,.85)`;
      ctx.lineWidth = depth * 0.6;
      ctx.beginPath();
      ctx.moveTo(x, y); ctx.lineTo(x2, y2); ctx.stroke();
      const spread = rand(0.3, 0.6);
      branch(x2, y2, len * 0.78, angle - spread, depth - 1);
      branch(x2, y2, len * 0.78, angle + spread, depth - 1);
    }
    branch(w / 2, h - 4, h * 0.22, -Math.PI / 2, 9);
  },

  cells(ctx, w, h) {
    const cols = 48, rows = 34;
    const cw = w / cols, ch = h / rows;
    let grid = Array.from({ length: rows }, () => Array.from({ length: cols }, () => Math.random() > 0.7 ? 1 : 0));
    ctx.fillStyle = '#0B0E14';
    ctx.fillRect(0, 0, w, h);
    for (let gen = 0; gen < 6; gen++) {
      const next = grid.map(r => [...r]);
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          let n = 0;
          for (let dy = -1; dy <= 1; dy++)
            for (let dx = -1; dx <= 1; dx++) {
              if (dx === 0 && dy === 0) continue;
              const yy = (y + dy + rows) % rows, xx = (x + dx + cols) % cols;
              n += grid[yy][xx];
            }
          next[y][x] = grid[y][x] ? (n === 2 || n === 3 ? 1 : 0) : (n === 3 ? 1 : 0);
        }
      }
      grid = next;
    }
    for (let y = 0; y < rows; y++)
      for (let x = 0; x < cols; x++)
        if (grid[y][x]) {
          ctx.fillStyle = `hsla(${5 + (x + y) * 2},85%,62%,.9)`;
          ctx.fillRect(x * cw, y * ch, cw - 1, ch - 1);
        }
  },

  orbits(ctx, w, h) {
    ctx.fillStyle = '#0B0E14';
    ctx.fillRect(0, 0, w, h);
    const cx = w / 2, cy = h / 2;
    const rings = Math.floor(rand(5, 9));
    for (let i = 0; i < rings; i++) {
      const r = (i + 1) * (Math.min(w, h) / (rings * 2.2));
      const speed = rand(0.5, 2.4);
      const dots = Math.floor(rand(2, 6));
      ctx.strokeStyle = 'rgba(255,255,255,.08)';
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
      for (let d = 0; d < dots; d++) {
        const a = (d / dots) * Math.PI * 2 * speed;
        const x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r;
        ctx.beginPath();
        ctx.fillStyle = i % 2 ? '#FF6B5B' : '#7CFFCB';
        ctx.arc(x, y, 3.4, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
};

function renderSketch(card) {
  const canvas = card.querySelector('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = canvas.offsetWidth * 2;
  canvas.height = canvas.offsetHeight * 2;
  ctx.scale(2, 2);
  sketches[card.dataset.sketch](ctx, canvas.offsetWidth, canvas.offsetHeight);
}

$$('.art-card').forEach(card => {
  renderSketch(card);
  card.addEventListener('click', () => renderSketch(card));
});
window.addEventListener('resize', () => $$('.art-card').forEach(renderSketch));

/* ============================================================
   SOM — SEQUENCIADOR COM WEB AUDIO API
============================================================ */
(function synth() {
  const grid = $('#synthGrid');
  const STEPS = 16, ROWS = 8;
  const scale = ['C5', 'B4', 'G4', 'E4', 'D4', 'C4', 'A3', 'G3'];
  const freqs = { C5: 523.25, B4: 493.88, G4: 392.00, E4: 329.63, D4: 293.66, C4: 261.63, A3: 220.00, G3: 196.00 };

  const cells = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < STEPS; c++) {
      const cell = document.createElement('div');
      cell.className = 'synth-cell';
      cell.dataset.row = r; cell.dataset.col = c;
      cell.addEventListener('click', () => cell.classList.toggle('active'));
      grid.appendChild(cell);
      cells.push(cell);
    }
  }

  let audioCtx;
  function playNote(freq, time) {
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = $('#waveSelect').value;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.18, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.3);
    osc.connect(gain).connect(audioCtx.destination);
    osc.start(time);
    osc.stop(time + 0.3);
  }

  let step = 0, playing = false, timer = null;

  function tick() {
    cells.forEach(c => c.classList.remove('playing'));
    const col = step % STEPS;
    cells.filter(c => +c.dataset.col === col).forEach(c => {
      c.classList.add('playing');
      if (c.classList.contains('active')) {
        const row = +c.dataset.row;
        playNote(freqs[scale[row]], audioCtx.currentTime);
      }
    });
    step++;
  }

  $('#playBtn').addEventListener('click', () => {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    playing = !playing;
    $('#playBtn').textContent = playing ? '⏸ pausar' : '▶ tocar';
    if (playing) {
      const bpm = +$('#tempoRange').value;
      const interval = (60 / bpm) * 1000 / 2;
      timer = setInterval(tick, interval);
    } else {
      clearInterval(timer);
      cells.forEach(c => c.classList.remove('playing'));
    }
  });

  $('#tempoRange').addEventListener('input', () => {
    if (playing) {
      clearInterval(timer);
      const bpm = +$('#tempoRange').value;
      timer = setInterval(tick, (60 / bpm) * 1000 / 2);
    }
  });
})();

/* ============================================================
   VÍDEO — FALLBACK ANIMADO SE NÃO HOUVER ARQUIVO
============================================================ */
(function videoFallback() {
  const video = $('#processVideo');
  const fallback = $('#videoFallback');
  const canvas = $('#videoFallbackCanvas');
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = canvas.offsetWidth * 2;
    canvas.height = canvas.offsetHeight * 2;
  }

  let t = 0;
  function draw() {
    resize();
    const w = canvas.offsetWidth, h = canvas.offsetHeight;
    ctx.save(); ctx.scale(2, 2);
    ctx.fillStyle = '#0B0E14';
    ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < 5; i++) {
      const x = w / 2 + Math.cos(t * 0.02 + i) * (w / 3);
      const y = h / 2 + Math.sin(t * 0.03 + i * 1.3) * (h / 3);
      ctx.beginPath();
      ctx.fillStyle = i % 2 ? 'rgba(255,107,91,.7)' : 'rgba(124,255,203,.7)';
      ctx.arc(x, y, 14, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
    t++;
    requestAnimationFrame(draw);
  }

  // se o vídeo falhar ao carregar (arquivo ausente), mostramos o fallback
  video.addEventListener('error', () => { fallback.style.display = 'flex'; draw(); });
  // como por padrão não há arquivo real, ativamos o fallback de imediato
  fallback.style.display = 'flex';
  draw();

  video.addEventListener('loadeddata', () => { fallback.style.display = 'none'; });
})();

/* ============================================================
   LABORATÓRIO — DESENHO + SOM
============================================================ */
(function lab() {
  const canvas = $('#labCanvas');
  const ctx = canvas.getContext('2d');
  let drawing = false, muted = false, audioCtx, lastNoteTime = 0;

  function resize() {
    const ratio = window.devicePixelRatio || 1;
    canvas.width = canvas.offsetWidth * ratio;
    canvas.height = canvas.offsetHeight * ratio;
    ctx.scale(ratio, ratio);
  }
  resize();
  window.addEventListener('resize', resize);

  function pos(e) {
    const rect = canvas.getBoundingClientRect();
    const t = e.touches ? e.touches[0] : e;
    return { x: t.clientX - rect.left, y: t.clientY - rect.top };
  }

  function blip(y) {
    if (muted) return;
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const now = audioCtx.currentTime;
    if (now - lastNoteTime < 0.05) return;
    lastNoteTime = now;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    const freq = 120 + (1 - y / canvas.offsetHeight) * 700;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
    osc.connect(gain).connect(audioCtx.destination);
    osc.start(now); osc.stop(now + 0.18);
  }

  let last = null;
  function start(e) { drawing = true; last = pos(e); }
  function move(e) {
    if (!drawing) return;
    const p = pos(e);
    ctx.strokeStyle = $('#labColor').value;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(last.x, last.y);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    blip(p.y);
    last = p;
    e.preventDefault();
  }
  function end() { drawing = false; }

  canvas.addEventListener('mousedown', start);
  canvas.addEventListener('mousemove', move);
  window.addEventListener('mouseup', end);
  canvas.addEventListener('touchstart', start, { passive: true });
  canvas.addEventListener('touchmove', move, { passive: false });
  canvas.addEventListener('touchend', end);

  $('#clearLab').addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  });
  $('#muteLab').addEventListener('click', (e) => {
    muted = !muted;
    e.target.textContent = muted ? '🔇 som desligado' : '🔈 som ligado';
  });
})();
