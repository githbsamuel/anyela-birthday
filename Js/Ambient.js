(function () {
  'use strict';

  // ─── Síntesis de sonido con Web Audio API (sin archivos externos) ──────────

  let ctx = null;
  let masterGain = null;
  let currentTheme = null;
  let activeNodes = [];   // nodos activos para poder detenerlos
  let fadeTimer   = null;

  const VOLUME = 0.18;  // volumen maestro de ambiente (sutil)

  function getCtx() {
    if (!ctx) {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0, ctx.currentTime);
      masterGain.connect(ctx.destination);
    }
    // Reanudar si el navegador lo suspendió
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  // ── Utilidades ─────────────────────────────────────────────────────────────

  function randBetween(a, b) { return a + Math.random() * (b - a); }

  function stopAll() {
    activeNodes.forEach(n => {
      try { n.stop(ctx ? ctx.currentTime + 0.3 : 0); } catch(_) {}
    });
    activeNodes = [];
  }

  function fadeTo(vol, duration) {
    if (!masterGain) return;
    masterGain.gain.cancelScheduledValues(ctx.currentTime);
    masterGain.gain.setValueAtTime(masterGain.gain.value, ctx.currentTime);
    masterGain.gain.linearRampToValueAtTime(vol, ctx.currentTime + duration);
  }

  // ── Generadores de sonido ──────────────────────────────────────────────────

  // Gota de lluvia: click rápido + resonancia baja
  function scheduleDrop() {
    if (!ctx || currentTheme !== 'rain') return;
    const ac = getCtx();

    // Ruido corto filtrado → sonido de gota
    const bufLen = ac.sampleRate * 0.08;
    const buf    = ac.createBuffer(1, bufLen, ac.sampleRate);
    const data   = buf.getChannelData(0);
    for (let i = 0; i < bufLen; i++) data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufLen * 0.15));

    const src = ac.createBufferSource();
    src.buffer = buf;

    const bp = ac.createBiquadFilter();
    bp.type            = 'bandpass';
    bp.frequency.value = randBetween(800, 2200);
    bp.Q.value         = randBetween(0.8, 2.5);

    const g = ac.createGain();
    g.gain.value = randBetween(0.3, 0.9);

    src.connect(bp); bp.connect(g); g.connect(masterGain);
    src.start();
    activeNodes.push(src);

    // Programar la siguiente gota
    setTimeout(scheduleDrop, randBetween(80, 340));
  }

  // Lluvia continua: ruido de fondo filtrado
  function startRain() {
    const ac = getCtx();

    // Buffer de ruido largo (8 s, se loopea)
    const seconds = 8;
    const buf     = ac.createBuffer(1, ac.sampleRate * seconds, ac.sampleRate);
    const data    = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;

    const noise = ac.createBufferSource();
    noise.buffer = buf;
    noise.loop   = true;

    const lp = ac.createBiquadFilter();
    lp.type            = 'lowpass';
    lp.frequency.value = 1000;

    const g = ac.createGain();
    g.gain.value = 0.35;

    noise.connect(lp); lp.connect(g); g.connect(masterGain);
    noise.start();
    activeNodes.push(noise);

    // Gotas individuales encima
    scheduleDrop();
  }

  // Grillo: oscilador chirp periódico
  function scheduleCricket() {
    if (!ctx || currentTheme !== 'night') return;
    const ac = getCtx();

    const freq  = randBetween(3200, 4800);
    const chirps = Math.floor(randBetween(3, 8));
    const chirpDur = 0.04;
    const gap      = 0.06;

    for (let i = 0; i < chirps; i++) {
      const osc = ac.createOscillator();
      osc.type            = 'sine';
      osc.frequency.value = freq;

      const g = ac.createGain();
      const t0 = ac.currentTime + i * (chirpDur + gap);
      g.gain.setValueAtTime(0,    t0);
      g.gain.linearRampToValueAtTime(randBetween(0.06, 0.14), t0 + 0.01);
      g.gain.linearRampToValueAtTime(0, t0 + chirpDur);

      osc.connect(g); g.connect(masterGain);
      osc.start(t0);
      osc.stop(t0 + chirpDur + 0.01);
      activeNodes.push(osc);
    }

    setTimeout(scheduleCricket, randBetween(600, 2200));
  }

  // Pájaro: dos silbidos suaves con glide de frecuencia
  function scheduleBird() {
    if (!ctx || (currentTheme !== 'dawn' && currentTheme !== 'sunny')) return;
    const ac = getCtx();

    const calls = Math.floor(randBetween(2, 5));
    let offset  = 0;

    for (let i = 0; i < calls; i++) {
      const osc = ac.createOscillator();
      osc.type = 'sine';

      const baseFreq = randBetween(1800, 3400);
      const t0 = ac.currentTime + offset;
      const dur = randBetween(0.12, 0.28);

      osc.frequency.setValueAtTime(baseFreq, t0);
      osc.frequency.linearRampToValueAtTime(baseFreq * randBetween(1.1, 1.4), t0 + dur * 0.6);
      osc.frequency.linearRampToValueAtTime(baseFreq * 0.9, t0 + dur);

      const g = ac.createGain();
      g.gain.setValueAtTime(0, t0);
      g.gain.linearRampToValueAtTime(randBetween(0.05, 0.12), t0 + dur * 0.2);
      g.gain.linearRampToValueAtTime(0, t0 + dur);

      osc.connect(g); g.connect(masterGain);
      osc.start(t0);
      osc.stop(t0 + dur + 0.05);
      activeNodes.push(osc);

      offset += dur + randBetween(0.08, 0.22);
    }

    setTimeout(scheduleBird, randBetween(1800, 5000));
  }

  // Brisa suave (sunset): ruido muy filtrado y tenue
  function startBreeze() {
    const ac = getCtx();
    const seconds = 6;
    const buf  = ac.createBuffer(1, ac.sampleRate * seconds, ac.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;

    const src = ac.createBufferSource();
    src.buffer = buf;
    src.loop   = true;

    const lp = ac.createBiquadFilter();
    lp.type            = 'lowpass';
    lp.frequency.value = 300;

    const g = ac.createGain();
    g.gain.value = 0.18;

    src.connect(lp); lp.connect(g); g.connect(masterGain);
    src.start();
    activeNodes.push(src);
  }

  // ── API pública ────────────────────────────────────────────────────────────

  function setTheme(themeId) {
    if (themeId === currentTheme) return;
    currentTheme = themeId;

    getCtx(); // asegura contexto activo

    // Fade out → limpiar → fade in nuevo
    fadeTo(0, 0.6);
    clearTimeout(fadeTimer);
    fadeTimer = setTimeout(() => {
      stopAll();
      if (!themeId) return;

      switch (themeId) {
        case 'rain':   startRain();    break;
        case 'night':  scheduleCricket(); break;
        case 'dawn':   scheduleBird(); break;
        case 'sunny':  scheduleBird(); break;
        case 'sunset': startBreeze();  break;
      }

      fadeTo(VOLUME, 0.8);
    }, 650);
  }

  function init(initialTheme) {
    // No arrancamos hasta que el usuario interactúe (política del navegador)
    // El Music.js ya maneja el primer clic; nosotros enganchamos ahí.
    const trigger = () => {
      getCtx();
      setTheme(initialTheme);
    };

    // Si Music ya arrancó, el contexto de audio del navegador ya está desbloqueado
    document.addEventListener('click', trigger, { once: true });
    document.addEventListener('touchend', trigger, { once: true });
  }

  window.Ambient = { setTheme, init };
})();
