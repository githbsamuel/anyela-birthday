(function () {
  'use strict';

  const LINES = [

    { t: 0.0, text: " ⭐ " },
    { t: 4.0, text: 'muerete' },
    { t: 8.0, text: 'muerete' },
    { t: 14.0, text: 'muerete' },
    { t: 17.0, text: 'muerete' },
    { t: 21.0,  text: 'muerete' },
    { t: 22.0,  text: 'muerete' },
    

    { t: 27.0, text: 'Rise with the morning' },
    { t: 33.0, text: 'You call to me' },
    { t: 39.5, text: 'My thoughts are crawling' },
    { t: 45.5, text: "You're all I see" },

    { t: 52.0, text: "I wish I could live without you" },
    { t: 57.5, text: "But you're a part of me" },
    { t: 63.0, text: "Wherever I go" },
    { t: 67.0, text: "You'll always be next to me" },
    
    { t: 110.0, text: 'Fall into the night' },
    { t: 115.0, text: 'As I gaze into you' },
    { t: 122.0, text: 'Shine so bright' },
    { t: 129.0, text: "It's all I do" },
    
    { t: 134.0, text: "I wish I could live without you" },
    { t: 141.0, text: "But you're a part of me" },
    { t: 148.0, text: "Wherever I go" },
    { t: 150.0, text: "You'll always be next to me" },
   
    
    { t: 164.0, text: "You ll always be next to me" },
    { t: 171.0, text: "You ll always be next to me" },
    { t: 176.0, text: "You ll always be next to me" },
    { t: 182.0, text: "You'll always be next to me" },

    { t: 188.0, text: "te quiero ⭐ " },
    { t: 190.0, text: " ⭐ " },
    { t: 194.0, text: "te quiero ⭐" },

  ];

 
  const LYRICS = [
    { t: 0.0, text: " ⭐ " },
    { t: 4.0, text: 'muerete' },
    { t: 8.0, text: 'muerete' },
    { t: 14.0, text: 'muerete' },
    { t: 17.0, text: 'muerete' },
    { t: 21.0,  text: 'muerete' },
    { t: 22.0,  text: 'muerete' },
    

    { t: 27.0, text: 'Rise with the morning' },
    { t: 33.0, text: 'You call to me' },
    { t: 39.5, text: 'My thoughts are crawling' },
    { t: 45.5, text: "You're all I see" },

    { t: 52.0, text: "I wish I could live without you" },
    { t: 57.5, text: "But you're a part of me" },
    { t: 63.0, text: "Wherever I go" },
    { t: 67.0, text: "You'll always be next to me" },
    
    { t: 110.0, text: 'Fall into the night' },
    { t: 115.0, text: 'As I gaze into you' },
    { t: 122.0, text: 'Shine so bright' },
    { t: 129.0, text: "It's all I do" },
    
    { t: 134.0, text: "I wish I could live without you" },
    { t: 141.0, text: "But you're a part of me" },
    { t: 147.5, text: "Wherever I go" },
    { t: 150.0, text: "You'll always be next to me" },
    
   
    { t: 164.0, text: "You ll always be next to me" },
    { t: 171.0, text: "You ll always be next to me" },
    { t: 176.0, text: "You ll always be next to me" },
    { t: 182.0, text: "You'll always be next to me" },

    { t: 188.0, text: "te quiero ⭐ " },
    { t: 190.0, text: " ⭐ " },
    { t: 194.0, text: "te quiero ⭐" },

  ];

   const THEME_COLORS = {
    rain: { fill: '#53636e', stroke: 'rgba(42, 54, 66, 0.55)', glow: 'rgba(180,215,245,0.35)' },
    sunny: { fill: '#ff69b4', stroke: 'rgba(255,105,180,0.55)', glow: 'rgba(255,105,180,0.40)' },
    dawn: { fill: '#f0a050', stroke: 'rgba(240,120,50,0.55)', glow: 'rgba(240,140,60,0.40)' },
    sunset: { fill: '#ff7040', stroke: 'rgba(220,80,20,0.55)', glow: 'rgba(230,90,30,0.42)' },
    night: { fill: '#c0a0ff', stroke: 'rgba(160,110,255,0.55)', glow: 'rgba(160,100,255,0.40)' },
  };

  let audio = null;
  let rafId = null;
  let lastIdx = -1;
  let container = null;
  let enabled = false;

   function getTheme() {
    return document.documentElement.getAttribute('data-theme') || 'rain';
  }

  function colors() {
    return THEME_COLORS[getTheme()] || THEME_COLORS.rain;
  }

  function buildContainer() {
    if (container) return;
    container = document.createElement('div');
    container.id = 'sky-lyrics';
    Object.assign(container.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100%',
      height: 'calc(100vh - 140px)',
      pointerEvents: 'none',
      zIndex: '20',
      overflow: 'hidden',
    });
    document.body.appendChild(container);
  }

   function spawnLine(text) {
    if (!container) return;

    const c = colors();
    const el = document.createElement('div');
    el.className = 'sky-lyric-line';

     const leftPct = 8 + Math.random() * 60; 
    const topPct = 4 + Math.random() * 44;

    const tilt = (Math.random() - 0.5) * 5; 

    Object.assign(el.style, {
      position: 'absolute',
      left: leftPct + '%',
      top: topPct + '%',
      transform: `rotate(${tilt}deg) translateY(12px)`,
      fontFamily: '"Baloo 2", system-ui, cursive',
      fontSize: 'clamp(15px, 2.4vw, 26px)',
      fontWeight: '700',
      letterSpacing: '0.05em',
      color: c.fill,
      textShadow: `0 0 18px ${c.glow}, 0 0 6px ${c.glow}, -1px -1px 0 ${c.stroke}, 1px 1px 0 ${c.stroke}`,
      whiteSpace: 'nowrap',
      opacity: '0',
      transition: 'opacity 0.6s ease, transform 0.6s ease',
      willChange: 'opacity, transform',
      userSelect: 'none',
    });

    el.textContent = text;
    container.appendChild(el);

  
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.opacity = '1';
        el.style.transform = `rotate(${tilt}deg) translateY(0px)`;
      });
    });

    
    const displayDur = 4200;
    setTimeout(() => {
      el.style.opacity = '0';
      el.style.transform = `rotate(${tilt}deg) translateY(-14px)`;
      setTimeout(() => el.remove(), 700);
    }, displayDur);
  }

  function tick() {
    if (!audio || !enabled) return;
    rafId = requestAnimationFrame(tick);

    const ct = audio.currentTime;

     let idx = -1;
    for (let i = 0; i < LYRICS.length; i++) {
      if (LYRICS[i].t <= ct) idx = i;
    }

    if (idx !== lastIdx && idx >= 0) {
      lastIdx = idx;
      spawnLine(LYRICS[idx].text);
    }
  }

   function start() {
    if (enabled) return;
    enabled = true;
    buildContainer();
    lastIdx = -1;
    rafId = requestAnimationFrame(tick);
  }

  function stop() {
    enabled = false;
    cancelAnimationFrame(rafId);
    if (container) {
      container.querySelectorAll('.sky-lyric-line').forEach(el => el.remove());
    }
    lastIdx = -1;
  }

  function reset() {
    lastIdx = -1;
  }

   function init() {
    audio = document.getElementById('bg-music');
    if (!audio) return;

    audio.addEventListener('play', () => { start(); });
    audio.addEventListener('pause', () => { stop(); });
    audio.addEventListener('ended', () => { stop(); });
    audio.addEventListener('seeked', () => { reset(); lastIdx = -1; });

    const observer = new MutationObserver(() => {
      if (!container) return;
     const c = colors();
      container.querySelectorAll('.sky-lyric-line').forEach(el => {
        el.style.color = c.fill;
        el.style.textShadow = `0 0 18px ${c.glow}, 0 0 6px ${c.glow}, -1px -1px 0 ${c.stroke}, 1px 1px 0 ${c.stroke}`;
      });
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  }

  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', init)
    : init();

  window.SkyLyrics = { start, stop, reset };
})();