
(function () {
  'use strict';

  const music      = document.getElementById('bg-music');
  const overlay    = document.getElementById('play-overlay');
  const manualBtn  = document.getElementById('manual-play');
  let   started    = false;

  function tryStart() {
    if (started || !music) return;
    music.loop = true;
    const p = music.play();
    if (p !== undefined) {
      p.then(() => {
        started = true;
        if (overlay) overlay.style.display = 'none';
      }).catch(() => {
      
        if (overlay) overlay.style.display = 'block';
      });
    }
  }

  if (manualBtn) {
    manualBtn.addEventListener('click', () => {
      music.play()
        .then(() => {
          started = true;
          if (overlay) overlay.style.display = 'none';
        })
        .catch(e => console.warn('No se pudo reproducir manualmente:', e));
    });
  }


  window.Music = { tryStart };
})();