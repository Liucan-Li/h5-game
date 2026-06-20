/* ========================================
   LeYou Game Framework — JS
   Glassmorphism Modern Minimal Theme
   ======================================== */

(function () {
  'use strict';

  const GAME_ID = document.documentElement.dataset.gameId || 'unknown';

  /* ======================================
     Performance Detection
     ====================================== */
  function detectPerfTier() {
    // Check if already set via data attribute
    const forced = document.documentElement.dataset.perfTier;
    if (forced) return forced;

    // Simple heuristic: check device memory / cores / GPU
    const mem = navigator.deviceMemory || 4; // GB, undefined on many browsers
    const cores = navigator.hardwareConcurrency || 4;

    if (mem <= 2 || cores <= 2) return 'low';
    if (mem <= 4 || cores <= 4) return 'medium';
    return 'high';
  }

  const perfTier = detectPerfTier();
  if (perfTier === 'low') {
    document.documentElement.classList.add('fw-perf-low');
  }

  /* ======================================
     Input Module
     ====================================== */
  const input = {
    _keyHandlers: {},
    _swipeHandlers: [],
    _touchStartX: 0,
    _touchStartY: 0,

    /** Register a key handler: callback(key, pressed) */
    onKey(handler) {
      const id = Date.now() + Math.random();
      this._keyHandlers[id] = handler;
      return id;
    },

    /** Remove a key handler by id */
    offKey(id) {
      delete this._keyHandlers[id];
    },

    /** Register a swipe handler: callback(direction, distance) */
    onSwipe(handler) {
      this._swipeHandlers.push(handler);
    },

    /** Set up on an element / canvas for touch events */
    attachSwipe(element) {
      const self = this;
      element.addEventListener('touchstart', function (e) {
        const t = e.touches[0];
        self._touchStartX = t.clientX;
        self._touchStartY = t.clientY;
      }, { passive: true });

      element.addEventListener('touchend', function (e) {
        const t = e.changedTouches[0];
        const dx = t.clientX - self._touchStartX;
        const dy = t.clientY - self._touchStartY;
        const absDx = Math.abs(dx), absDy = Math.abs(dy);
        if (Math.max(absDx, absDy) < 20) return;
        const dir = absDx > absDy
          ? (dx > 0 ? 'right' : 'left')
          : (dy > 0 ? 'down' : 'up');
        const dist = Math.max(absDx, absDy);
        self._swipeHandlers.forEach(fn => fn(dir, dist));
      }, { passive: true });
    },

    /** Create D-pad buttons as HTMLElement */
    createDPad(onDir) {
      const pad = document.createElement('div');
      pad.className = 'fw-dpad';
      const dirs = [
        { label: '▲', dir: 'up', cls: 'fw-dpad-up' },
        { label: '◀', dir: 'left', cls: 'fw-dpad-left' },
        { label: '', dir: '', cls: 'fw-dpad-blank' },
        { label: '▶', dir: 'right', cls: 'fw-dpad-right' },
        { label: '▼', dir: 'down', cls: 'fw-dpad-down' },
      ];
      // Grid order: row 1: blank, up, blank | row 2: left, blank, right | row 3: blank, down, blank
      const gridOrder = [
        { label: '', dir: '', cls: 'fw-dpad-blank fw-dpad-up' },     // top-left (spacer)
        { label: '▲', dir: 'up', cls: 'fw-dpad-up' },            // top-center
        { label: '', dir: '', cls: 'fw-dpad-blank' },                  // top-right (spacer)
        { label: '◀', dir: 'left', cls: 'fw-dpad-left' },        // mid-left
        { label: '', dir: '', cls: 'fw-dpad-blank' },                  // mid-center
        { label: '▶', dir: 'right', cls: 'fw-dpad-right' },      // mid-right
        { label: '', dir: '', cls: 'fw-dpad-blank' },                  // bot-left (spacer)
        { label: '▼', dir: 'down', cls: 'fw-dpad-down' },        // bot-center
        { label: '', dir: '', cls: 'fw-dpad-blank' },                  // bot-right (spacer)
      ];
      gridOrder.forEach(({ label, dir, cls }) => {
        const btn = document.createElement('button');
        btn.className = 'fw-dpad-btn ' + cls;
        if (label) {
          btn.innerHTML = label;
          if (dir) {
            btn.addEventListener('click', () => onDir(dir));
            btn.addEventListener('touchstart', (e) => { e.preventDefault(); onDir(dir); }, { passive: false });
          }
        } else {
          btn.style.visibility = 'hidden';
        }
        pad.appendChild(btn);
      });
      return pad;
    },

    _init() {
      const self = this;
      document.addEventListener('keydown', function (e) {
        Object.values(self._keyHandlers).forEach(fn => fn(e.key, true, e));
      });
      document.addEventListener('keyup', function (e) {
        Object.values(self._keyHandlers).forEach(fn => fn(e.key, false, e));
      });
    }
  };

  /* ======================================
     Storage Module
     ====================================== */
  const storage = {
    _prefix: 'leyou_',

    /** Save a value */
    save(key, value) {
      try {
        localStorage.setItem(this._prefix + GAME_ID + '_' + key, JSON.stringify(value));
      } catch (e) { /* quota exceeded, silently fail */ }
    },

    /** Load a value */
    load(key, fallback) {
      try {
        const raw = localStorage.getItem(this._prefix + GAME_ID + '_' + key);
        return raw !== null ? JSON.parse(raw) : fallback;
      } catch (e) {
        return fallback;
      }
    },

    /** Remove a key */
    remove(key) {
      try { localStorage.removeItem(this._prefix + GAME_ID + '_' + key); } catch (e) { /* */ }
    },

    /** Get high score */
    getHighScore() {
      return this.load('hi', 0);
    },

    /** Set high score, returns true if new record */
    setHighScore(score) {
      const prev = this.getHighScore();
      if (score > prev) {
        this.save('hi', score);
        return true;
      }
      return false;
    },

    /** Get everything (for leaderboard) */
    getAll() {
      const result = {};
      try {
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith(this._prefix)) {
            result[key] = JSON.parse(localStorage.getItem(key));
          }
        }
      } catch (e) { /* */ }
      return result;
    }
  };

  /* ======================================
     Audio Module (Web Audio)
     ====================================== */
  const audio = {
    _ctx: null,
    _bgmGain: null,
    _sfxGain: null,
    _bgmSource: null,
    _enabled: true,

    _ensureContext() {
      if (!this._ctx) {
        try {
          this._ctx = new (window.AudioContext || window.webkitAudioContext)();
          this._bgmGain = this._ctx.createGain();
          this._bgmGain.gain.value = 0.3;
          this._bgmGain.connect(this._ctx.destination);
          this._sfxGain = this._ctx.createGain();
          this._sfxGain.gain.value = 0.5;
          this._sfxGain.connect(this._ctx.destination);
        } catch (e) {
          this._enabled = false;
        }
      } else if (this._ctx.state === 'suspended') {
        this._ctx.resume();
      }
    },

    /** Play a simple synthesized beep */
    beep(freq, duration, type) {
      if (!this._enabled) return;
      this._ensureContext();
      if (!this._ctx) return;
      const osc = this._ctx.createOscillator();
      const gain = this._ctx.createGain();
      osc.type = type || 'square';
      osc.frequency.setValueAtTime(freq, this._ctx.currentTime);
      gain.gain.setValueAtTime(0.15, this._ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this._ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this._sfxGain);
      osc.start(this._ctx.currentTime);
      osc.stop(this._ctx.currentTime + duration);
    },

    /** Quick preset SFX */
    sfx(name) {
      switch (name) {
        case 'click': this.beep(800, 0.08, 'square'); break;
        case 'score': this.beep(600, 0.1, 'square'); setTimeout(() => this.beep(900, 0.1, 'square'), 100); break;
        case 'gameover': this.beep(300, 0.3, 'sawtooth'); setTimeout(() => this.beep(200, 0.4, 'sawtooth'), 300); break;
        case 'win': this.beep(523, 0.15, 'square'); setTimeout(() => this.beep(659, 0.15, 'square'), 150); setTimeout(() => this.beep(784, 0.2, 'square'), 300); break;
        case 'move': this.beep(440, 0.05, 'square'); break;
        case 'bump': this.beep(220, 0.1, 'sawtooth'); break;
        case 'powerup': this.beep(500, 0.1, 'sine'); setTimeout(() => this.beep(700, 0.1, 'sine'), 100); setTimeout(() => this.beep(900, 0.15, 'sine'), 200); break;
        case 'select': this.beep(660, 0.08, 'sine'); break;
        default: break;
      }
    },

    /** Start simple background music (looping tone sequence) */
    startBGM(notes) {
      if (!this._enabled) return;
      this._ensureContext();
      if (!this._ctx) return;
      this.stopBGM();
      if (!notes || !notes.length) return;
      this._bgmNotes = notes;
      this._bgmIndex = 0;
      this._playBGMLoop();
    },

    _playBGMLoop() {
      if (!this._bgmNotes || !this._bgmNotes.length) return;
      const self = this;
      const note = this._bgmNotes[this._bgmIndex];
      const osc = this._ctx.createOscillator();
      const gain = this._ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(note.freq || 440, this._ctx.currentTime);
      gain.gain.setValueAtTime(0.06, this._ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this._ctx.currentTime + (note.dur || 0.3));
      osc.connect(gain);
      gain.connect(this._bgmGain);
      osc.start(this._ctx.currentTime);
      osc.stop(this._ctx.currentTime + (note.dur || 0.3));
      this._bgmIndex = (this._bgmIndex + 1) % this._bgmNotes.length;
      this._bgmTimer = setTimeout(function () { self._playBGMLoop(); }, (note.dur || 0.3) * 1000 * 0.8);
    },

    stopBGM() {
      if (this._bgmTimer) { clearTimeout(this._bgmTimer); this._bgmTimer = null; }
      this._bgmNotes = null;
    },

    setVolume(v) {
      if (this._sfxGain) this._sfxGain.gain.value = v * 0.5;
      if (this._bgmGain) this._bgmGain.gain.value = v * 0.3;
    },

    toggle() {
      this._enabled = !this._enabled;
      if (!this._enabled) this.stopBGM();
      return this._enabled;
    }
  };

  /* ======================================
     Game Loop Module
     ====================================== */
  const loop = {
    _rafId: null,
    _intervalId: null,
    _lastTime: 0,
    _running: false,
    _updateFn: null,

    /** Start a requestAnimationFrame-based loop */
    startRAF(fn) {
      this.stop();
      this._updateFn = fn;
      this._running = true;
      this._lastTime = performance.now();
      const self = this;
      function tick(now) {
        if (!self._running) return;
        const dt = (now - self._lastTime) / 1000;
        self._lastTime = now;
        fn(dt);
        self._rafId = requestAnimationFrame(tick);
      }
      self._rafId = requestAnimationFrame(tick);
    },

    /** Start a fixed-interval loop (ms-based) */
    startInterval(fn, ms) {
      this.stop();
      this._intervalId = setInterval(fn, ms || 100);
    },

    /** Stop the current loop */
    stop() {
      this._running = false;
      if (this._rafId) { cancelAnimationFrame(this._rafId); this._rafId = null; }
      if (this._intervalId) { clearInterval(this._intervalId); this._intervalId = null; }
    }
  };

  /* ======================================
     UI Module
     ====================================== */
  const ui = {
    /** Update a score element */
    updateScore(el, value) {
      if (!el) return;
      el.textContent = value;
      el.classList.remove('fw-animate-pop');
      // Force reflow
      void el.offsetWidth;
      el.classList.add('fw-animate-pop');
    },

    /** Show/hide overlay */
    showOverlay(el) {
      if (el) el.classList.add('active');
    },

    hideOverlay(el) {
      if (el) el.classList.remove('active');
    },

    /** Create a score box element */
    createScoreBox(label, initialValue, id) {
      const box = document.createElement('div');
      box.className = 'fw-score-box';
      if (id) box.id = id;
      box.innerHTML = '<div class="fw-score-label">' + label + '</div><div class="fw-score-value" data-score="' + label + '">' + (initialValue || 0) + '</div>';
      return box;
    },

    /** Create a game over overlay */
    createOverlay(title, text, btnLabel, onRestart) {
      const overlay = document.createElement('div');
      overlay.className = 'fw-overlay';
      overlay.id = 'fw-overlay';
      overlay.innerHTML = '<div class="fw-overlay-box">'
        + '<div class="fw-overlay-title">' + title + '</div>'
        + '<div class="fw-overlay-text">' + text + '</div>'
        + '<button class="fw-btn fw-btn-primary" id="fw-restart-btn">' + (btnLabel || '重新开始') + '</button>'
        + '</div>';
      document.body.appendChild(overlay);
      document.getElementById('fw-restart-btn').addEventListener('click', onRestart);
      return overlay;
    },

    /** Format a score with commas */
    formatScore(n) {
      return n.toLocaleString();
    }
  };

  /* ======================================
     Events Module (postMessage)
     ====================================== */
  const events = {
    /** Send event to parent frame */
    emit(type, payload) {
      try {
        if (window.parent && window.parent !== window) {
          window.parent.postMessage({
            source: 'leyou-game',
            gameId: GAME_ID,
            type: type,
            payload: payload || {}
          }, '*');
        }
      } catch (e) { /* cross-origin, silently fail */ }
    },

    /** Game complete with score */
    reportComplete(score, metadata) {
      this.emit('GAME_COMPLETE', { score: score, metadata: metadata });
    },

    /** Score update (for leaderboard) */
    reportScore(score) {
      this.emit('SCORE_UPDATE', { score: score });
    },

    /** Achievement unlocked */
    reportAchievement(name) {
      this.emit('ACHIEVEMENT_UNLOCKED', { achievement: name });
    }
  };

  /* ======================================
     Init keyboard listeners
     ====================================== */
  input._init();

  /* ======================================
     Auto-apply body class
     ====================================== */
  if (document.body && !document.body.classList.contains('fw-body')) {
    document.body.classList.add('fw-body');
  }

  /* ======================================
     Export
     ====================================== */
  window.GameFramework = {
    input: input,
    storage: storage,
    audio: audio,
    loop: loop,
    ui: ui,
    events: events,
    perfTier: perfTier,
    version: '1.0.0',
    GAME_ID: GAME_ID
  };

})();