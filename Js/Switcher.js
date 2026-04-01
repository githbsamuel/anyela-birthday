
(function () {
  'use strict';

  const THEMES = [
    { id: 'dawn',   label: '', icon: '🌅' },
    { id: 'sunny',  label: '',  icon: '☀️'  },
    { id: 'rain',   label: '',   icon: '🌧️'  },
    { id: 'sunset', label: '',icon: '🌇'  },
    { id: 'night',  label: '',    icon: '🌙'  }
  ];

  const DEFAULT = 'night';
  let current = THEMES.findIndex(t => t.id === DEFAULT);

  const STYLE = `
    #theme-switcher {
      position: fixed; top: 14px; left: 50%;
      transform: translateX(-50%);
      z-index: 9100; user-select: none; -webkit-user-select: none;
    }
    #ts-pill {
      display: flex; align-items: center;
      background: rgba(8,8,18,0.62);
      backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px);
      border: 1px solid rgba(255,255,255,0.15);
      border-radius: 999px; padding: 5px 7px; gap: 2px;
      box-shadow: 0 6px 28px rgba(0,0,0,0.45), 0 1px 0 rgba(255,255,255,0.06) inset;
      position: relative;
    }
    #ts-thumb {
      position: absolute; top: 5px; left: 7px;
      height: calc(100% - 10px); border-radius: 999px;
      background: rgba(255,255,255,0.13);
      border: 1px solid rgba(255,255,255,0.28);
      pointer-events: none;
      transition: left .36s cubic-bezier(.4,0,.2,1), width .36s cubic-bezier(.4,0,.2,1);
      box-shadow: 0 2px 10px rgba(0,0,0,0.3);
    }
    .ts-btn {
      position: relative; z-index: 2;
      display: flex; flex-direction: column; align-items: center; gap: 2px;
      background: none; border: none; cursor: pointer;
      padding: 7px 12px; border-radius: 999px; outline: none;
      -webkit-tap-highlight-color: transparent;
    }
    .ts-icon { font-size:17px; line-height:1; display:block; transition:transform .22s; }
    .ts-btn:hover .ts-icon  { transform: scale(1.18); }
    .ts-btn.active .ts-icon { transform: scale(1.12); }
    .ts-lbl {
      font-size:9px; font-weight:700; letter-spacing:0.25px;
      color: rgba(255,255,255,0.6); white-space:nowrap;
      transition: color .25s; font-family: system-ui, sans-serif;
    }
    .ts-btn.active .ts-lbl { color: #fff; }
    body, .garden, .grass-blade, .cloud,
    .cloud1,.cloud2,.cloud3,.cloud4,.cloud5 {
      transition: background 0.75s ease, background-color 0.75s ease !important;
    }
    @media (max-width:520px) {
      .ts-btn  { padding: 6px 9px; }
      .ts-icon { font-size: 15px; }
      .ts-lbl  { font-size: 8px;  }
    }
  `;


  function build() {
    const el = document.createElement('div');
    el.id = 'theme-switcher';
    el.innerHTML = `
      <div id="ts-pill">
        <div id="ts-thumb"></div>
        ${THEMES.map((t, i) => `
          <button class="ts-btn${i === current ? ' active' : ''}"
                  data-i="${i}" title="${t.label}" aria-label="${t.label}">
            <span class="ts-icon">${t.icon}</span>
            <span class="ts-lbl">${t.label}</span>
          </button>`).join('')}
      </div>`;
    document.body.appendChild(el);

    const style = document.createElement('style');
    style.textContent = STYLE;
    document.head.appendChild(style);
  }

 
  function moveThumb(idx, instant) {
    const pill  = document.getElementById('ts-pill');
    const thumb = document.getElementById('ts-thumb');
    const btn   = pill && pill.querySelectorAll('.ts-btn')[idx];
    if (!thumb || !btn || !pill) return;

    const pillR = pill.getBoundingClientRect();
    const btnR  = btn.getBoundingClientRect();

    thumb.style.transition = instant
      ? 'none'
      : 'left .36s cubic-bezier(.4,0,.2,1), width .36s cubic-bezier(.4,0,.2,1)';
    thumb.style.left  = (btnR.left - pillR.left) + 'px';
    thumb.style.width = btnR.width + 'px';

    pill.querySelectorAll('.ts-btn').forEach((b, i) => b.classList.toggle('active', i === idx));
  }

  function createNightEls() {
    if (document.querySelector('.stars-layer')) return;

    const layer = document.createElement('div');
    layer.className = 'stars-layer';
    Object.assign(layer.style, {
      position:'fixed', inset:'0', pointerEvents:'none',
      zIndex:'0', display:'none', overflow:'hidden'
    });
    for (let i = 0; i < 130; i++) {
      const s   = document.createElement('div');
      const sz  = 1 + Math.random() * 2.4;
      const dur = 1.8 + Math.random() * 3;
      const del = Math.random() * 5;
      Object.assign(s.style, {
        position:'absolute',
        left: (Math.random() * 100) + 'vw',
        top:  (Math.random() * 78)  + 'vh',
        width: sz + 'px', height: sz + 'px',
        borderRadius: '50%', background: 'white',
        opacity: 0.5 + Math.random() * 0.5,
        animation: `starTwinkle ${dur}s ${del}s ease-in-out infinite alternate`
      });
      layer.appendChild(s);
    }
    document.body.insertBefore(layer, document.body.firstChild);

    const moon = document.createElement('div');
    moon.className = 'moon-el';
    Object.assign(moon.style, {
      position:'fixed', top:'9%', left:'11%',
      width:'68px', height:'68px', borderRadius:'50%',
      background:'radial-gradient(circle at 38% 36%, #f8f0d0 0%, #d4ca88 55%, #a89e68 100%)',
      boxShadow:'0 0 30px rgba(240,230,180,0.4), inset -9px -5px 0 rgba(0,0,0,0.14)',
      display:'none', zIndex:'1',
      animation:'moonGlow 5s ease-in-out infinite alternate'
    });
    document.body.insertBefore(moon, document.body.firstChild);
  }


  function apply(idx, animate) {
    const prevId = THEMES[current].id;
    current = idx;
    const id = THEMES[idx].id;

    document.documentElement.setAttribute('data-theme', id);
    moveThumb(idx, !animate);

    const isRain  = id === 'rain';
    const hasSun  = id === 'sunny' || id === 'dawn' || id === 'sunset';
    const isNight = id === 'night';

  
    if (typeof Rain !== 'undefined') {
      isRain ? Rain.enable() : Rain.disable();
    }

  
    const rc = document.getElementById('rain-container');
    const lt = document.getElementById('lightning');
    if (rc) rc.style.display = isRain ? '' : 'none';
    if (lt) { lt.style.display = isRain ? '' : 'none'; lt.style.opacity = '0'; }

    document.querySelectorAll('.puddle').forEach(p => p.style.display = isRain ? '' : 'none');


    const oc = document.querySelector('.overcast');
    if (oc) oc.style.opacity = isRain ? '1' : '0';


    const sun = document.querySelector('.sun-el');
    if (sun) sun.style.display = hasSun ? '' : 'none';


    const stars = document.querySelector('.stars-layer');
    const moon  = document.querySelector('.moon-el');
    if (stars) stars.style.display = isNight ? '' : 'none';
    if (moon)  moon.style.display  = isNight ? '' : 'none';
  }


  function nearestIdx(clientX) {
    const btns = document.querySelectorAll('.ts-btn');
    let best = 0, bestD = Infinity;
    btns.forEach((b, i) => {
      const r = b.getBoundingClientRect();
      const d = Math.abs(clientX - (r.left + r.width / 2));
      if (d < bestD) { bestD = d; best = i; }
    });
    return best;
  }


  function setupInteraction() {
    const pill = document.getElementById('ts-pill');
    if (!pill) return;
    let drag = false;

    pill.querySelectorAll('.ts-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        apply(+btn.dataset.i, true);
      });
    });

    pill.addEventListener('mousedown', () => { drag = true; });
    document.addEventListener('mousemove', e => {
      if (!drag) return;
      const i = nearestIdx(e.clientX);
      if (i !== current) moveThumb(i, false);
    });
    document.addEventListener('mouseup', e => {
      if (!drag) return;
      drag = false;
      apply(nearestIdx(e.clientX), true);
    });

    pill.addEventListener('touchstart', () => { drag = true; }, { passive: true });
    document.addEventListener('touchmove', e => {
      if (!drag) return;
      const i = nearestIdx(e.touches[0].clientX);
      if (i !== current) moveThumb(i, false);
    }, { passive: true });
    document.addEventListener('touchend', e => {
      if (!drag) return;
      drag = false;
      apply(nearestIdx(e.changedTouches[0].clientX), true);
    });
  }

  function init() {
    createNightEls();
    build();
    requestAnimationFrame(() => requestAnimationFrame(() => {
      apply(current, false);
      setupInteraction();
    }));
  }

  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', init)
    : init();
})();