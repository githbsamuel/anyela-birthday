

const Rain = (() => {
  'use strict';


  let stormActive = false;
  let stormTimer  = null;
  let audioCtx    = null;


  function getAudioCtx() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioCtx;
  }

  document.addEventListener('click', () => getAudioCtx(), { once: true });


  function playThunder() {
    try {
      const ctx      = getAudioCtx();
      const duration = 3.5 + Math.random() * 2;
      const buffer   = ctx.createBuffer(1, Math.floor(ctx.sampleRate * duration), ctx.sampleRate);
      const data     = buffer.getChannelData(0);

      let lastOut = 0;
      for (let i = 0; i < data.length; i++) {
        const white = Math.random() * 2 - 1;
        lastOut = (lastOut + 0.02 * white) / 1.02;
        data[i] = lastOut * 18;
      }

      const source   = ctx.createBufferSource();
      source.buffer  = buffer;

      const lowpass  = ctx.createBiquadFilter();
      lowpass.type   = 'lowpass';
      lowpass.frequency.value = 120 + Math.random() * 80;
      lowpass.Q.value = 0.5;

      const gain = ctx.createGain();
      const now  = ctx.currentTime;
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.9 + Math.random() * 0.1, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.3, now + 0.4);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      source.connect(lowpass);
      lowpass.connect(gain);
      gain.connect(ctx.destination);
      source.start(now);
      source.stop(now + duration);
    } catch (e) {
     
    }
  }

  
  function flashLightning() {
    const lt = document.getElementById('lightning');
    if (!lt || lt.style.display === 'none') return;

    lt.style.opacity = '0.85';
    setTimeout(() => { lt.style.opacity = '0'; },    70);
    setTimeout(() => { lt.style.opacity = '0.6'; },  130);
    setTimeout(() => { lt.style.opacity = '0'; },    200);
    setTimeout(() => { lt.style.opacity = '0.25'; }, 280);
    setTimeout(() => { lt.style.opacity = '0'; },    360);


    setTimeout(playThunder, 400 + Math.random() * 700);
  }

  
  function stormTick() {
    if (!stormActive) return;
    flashLightning();
    stormTimer = setTimeout(stormTick, 6000 + Math.random() * 12000);
  }


  function createRaindrops() {
    const container = document.getElementById('rain-container');
    if (!container || container.childElementCount > 0) return;

    for (let i = 0; i < 160; i++) {
      const drop = document.createElement('div');
      drop.classList.add('raindrop');
      drop.style.left            = Math.random() * 100 + 'vw';
      drop.style.animationDuration = (0.35 + Math.random() * 0.5) + 's';
      drop.style.animationDelay   = (Math.random() * 2) + 's';
      drop.style.opacity           = (0.35 + Math.random() * 0.5).toString();
      drop.style.height            = (12 + Math.random() * 18) + 'px';
      container.appendChild(drop);
    }
  }


  function createSplash(puddle) {
    const splash = document.createElement('div');
    splash.classList.add('splash-ring');
    splash.style.left   = (puddle.offsetLeft + puddle.offsetWidth / 2 - 8) + 'px';
    splash.style.bottom = '4px';
    puddle.parentElement.appendChild(splash);
    setTimeout(() => splash.remove(), 700);
  }

  function startSplashes() {
    const puddles = document.querySelectorAll('.puddle');
    puddles.forEach((p, i) => { p.style.animationDelay = (i * 0.4) + 's'; });

    setInterval(() => {
      const visible = document.querySelectorAll('.puddle');
      visible.forEach(p => {
        if (Math.random() > 0.4) createSplash(p);
      });
    }, 500);
  }


  function enable() {
    stormActive = true;
    stormTimer  = setTimeout(stormTick, 1800 + Math.random() * 3000);
  }

  function disable() {
    stormActive = false;
    if (stormTimer) {
      clearTimeout(stormTimer);
      stormTimer = null;
    }
    const lt = document.getElementById('lightning');
    if (lt) lt.style.opacity = '0';
  }

  function init() {
    createRaindrops();
    startSplashes();
    /* La tormenta arranca solo si el tema inicial es lluvia */
    const theme = document.documentElement.getAttribute('data-theme');
    if (theme === 'rain' || !theme) {
      setTimeout(enable, 2000 + Math.random() * 3000);
    }
  }

  return { init, enable, disable };
})();


document.readyState === 'loading'
  ? document.addEventListener('DOMContentLoaded', Rain.init)
  : Rain.init();