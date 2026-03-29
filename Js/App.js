
(function () {
  'use strict';


  const s1           = document.getElementById('screen-1');
  const s2           = document.getElementById('screen-2');
  const s3           = document.getElementById('screen-3');
  const toEnvBtn     = document.getElementById('to-envelope');
  const openEnvBtn   = document.getElementById('open-envelope');
  const backHomeBtn  = document.getElementById('back-home');
  const envelope     = document.getElementById('envelope');
  const envFlap      = document.getElementById('env-flap');
  const letter       = document.getElementById('letter');


  function showScreen(target) {
    [s1, s2, s3].forEach(s => { s.dataset.visible = 'false'; });
    target.dataset.visible = 'true';

    const card = target.querySelector('.card');
    if (card) {
      card.classList.remove('show');
      void card.offsetWidth;
      card.classList.add('show');
    }
  }

  toEnvBtn.addEventListener('click', () => {
    if (window.Music) window.Music.tryStart();
    envelope.style.transform = 'rotateY(12deg)';
    setTimeout(() => {
      envelope.style.transform = 'rotateY(0)';
      showScreen(s2);
    }, 220);
  });


  openEnvBtn.addEventListener('click', () => {
    if (window.Music) window.Music.tryStart();
    envFlap.style.transform  = 'rotateX(-180deg) translateY(-6px)';
    envFlap.style.boxShadow  = 'none';
    envelope.style.transform = 'translateY(-6px) rotateZ(-3deg) scale(1.02)';

    setTimeout(() => {
      letter.classList.add('revealed');
      showScreen(s3);
      setTimeout(() => {
        envFlap.style.transform  = '';
        envelope.style.transform = '';
      }, 600);
    }, 420);
  });

  backHomeBtn.addEventListener('click', () => {
    letter.classList.remove('revealed');
    showScreen(s1);
  });


  envelope.addEventListener('click', () => openEnvBtn.click());

  [toEnvBtn, openEnvBtn, backHomeBtn].forEach(btn => {
    btn.addEventListener('keyup', e => {
      if (e.key === 'Enter' || e.key === ' ') btn.click();
    });
  });

  document.addEventListener('DOMContentLoaded', () => {
    s1.dataset.visible = 'true';
  });
})();