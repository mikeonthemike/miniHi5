/* ── miniHi5 v2.0 ────────────────────────────────────────── */

(function () {
  "use strict";

  /* ── Config ────────────────────────────────────────────── */
  const STORAGE_KEY = "minihi5";
  const ANIM_DURATION = 650;

  const responses = [
    "Boom!",
    "Get Some!",
    "Alright!",
    "My hero!",
    "Nice one!",
    "Oh Yeah!",
    "Way to Go!",
    "Get In!",
    "Legend!",
    "Unstoppable!",
    "You rock!",
    "Superstar!",
    "Nailed it!",
    "High five!",
    "Keep going!",
  ];

  /* ── State ─────────────────────────────────────────────── */
  let state = loadState();

  function todayKey() {
    return new Date().toISOString().slice(0, 10);
  }

  function defaultState() {
    return { total: 0, today: 0, todayDate: todayKey(), streak: 0, lastDate: null };
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaultState();
      const s = JSON.parse(raw);
      if (s.todayDate !== todayKey()) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const wasYesterday = s.lastDate === yesterday.toISOString().slice(0, 10);
        s.today = 0;
        s.todayDate = todayKey();
        if (!wasYesterday) s.streak = 0;
      }
      return s;
    } catch {
      return defaultState();
    }
  }

  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  /* ── DOM refs ──────────────────────────────────────────── */
  let hand, handZone, countEl, todayEl, streakEl, toastContainer, confettiCanvas, ctx;

  document.addEventListener("DOMContentLoaded", () => {
    hand           = document.getElementById("hand");
    handZone       = document.getElementById("hand-zone");
    countEl        = document.getElementById("count");
    todayEl        = document.getElementById("today-count");
    streakEl       = document.getElementById("streak");
    toastContainer = document.getElementById("toast-container");
    confettiCanvas = document.getElementById("confetti-canvas");
    ctx            = confettiCanvas.getContext("2d");

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    renderStats();

    handZone.addEventListener("click", giveHighFive);
    handZone.addEventListener("touchstart", (e) => e.preventDefault(), { passive: false });
  });

  function resizeCanvas() {
    if (!confettiCanvas) return;
    confettiCanvas.width  = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
  }

  /* ── Core action ───────────────────────────────────────── */
  let busy = false;

  function giveHighFive() {
    if (busy) return;
    busy = true;

    hand.src = "high-five.gif?" + Date.now();

    handZone.classList.add("slap");
    document.body.classList.add("shake");

    playSlap();
    launchConfetti();

    setTimeout(() => {
      state.total++;
      state.today++;
      state.todayDate = todayKey();
      state.lastDate  = todayKey();
      if (state.today === 1) state.streak++;
      saveState();

      renderStats(true);

      const msg = responses[Math.floor(Math.random() * responses.length)];
      showToast(msg);

      hand.src = "palm2x.png";
      handZone.classList.remove("slap");
      document.body.classList.remove("shake");

      busy = false;
    }, ANIM_DURATION);
  }

  /* ── Render stats ──────────────────────────────────────── */
  function renderStats(animate) {
    if (countEl)  countEl.textContent  = state.total;
    if (todayEl)  todayEl.textContent  = state.today;
    if (streakEl) streakEl.textContent = state.streak;

    if (animate) {
      [countEl, todayEl, streakEl].forEach((el) => {
        if (!el) return;
        el.classList.remove("pop");
        void el.offsetWidth;
        el.classList.add("pop");
      });
    }
  }

  /* ── Toast ─────────────────────────────────────────────── */
  function showToast(text) {
    const t = document.createElement("div");
    t.className = "toast";
    t.textContent = text;
    toastContainer.appendChild(t);
    setTimeout(() => t.remove(), 2600);
  }

  /* ── Confetti (canvas-based) ───────────────────────────── */
  const particles = [];
  let animating = false;

  function launchConfetti() {
    const colors = ["#f7b731", "#f76b1c", "#eb3b5a", "#8854d0", "#3867d6", "#20bf6b", "#fff"];
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight * 0.38;

    for (let i = 0; i < 140; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 5 + Math.random() * 12;
      particles.push({
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed * (0.6 + Math.random()),
        vy: Math.sin(angle) * speed * (0.6 + Math.random()) - 4,
        size: 6 + Math.random() * 10,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 14,
        life: 1,
        decay: 0.006 + Math.random() * 0.009,
        shape: Math.random() > 0.5 ? "rect" : "circle",
      });
    }

    if (!animating) {
      animating = true;
      requestAnimationFrame(tickConfetti);
    }
  }

  function tickConfetti() {
    ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.18;
      p.vx *= 0.985;
      p.rotation += p.rotationSpeed;
      p.life -= p.decay;

      if (p.life <= 0) { particles.splice(i, 1); continue; }

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.globalAlpha = p.life;
      ctx.fillStyle = p.color;

      if (p.shape === "rect") {
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }

    if (particles.length > 0) {
      requestAnimationFrame(tickConfetti);
    } else {
      animating = false;
    }
  }

  /* ── Audio (Web Audio API — no external files needed) ──── */
  let audioCtx;

  function playSlap() {
    try {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();

      const duration = 0.12;
      const now = audioCtx.currentTime;

      const noise = audioCtx.createBufferSource();
      const buf = audioCtx.createBuffer(1, audioCtx.sampleRate * duration, audioCtx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * 0.6;
      noise.buffer = buf;

      const bandpass = audioCtx.createBiquadFilter();
      bandpass.type = "bandpass";
      bandpass.frequency.value = 1800;
      bandpass.Q.value = 0.8;

      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(0.7, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      noise.connect(bandpass).connect(gain).connect(audioCtx.destination);
      noise.start(now);
      noise.stop(now + duration);
    } catch {
      /* audio not supported — silent fallback */
    }
  }
})();
