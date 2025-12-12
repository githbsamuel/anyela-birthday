 const s1 = document.getElementById('screen-1');
  const s2 = document.getElementById('screen-2');
  const s3 = document.getElementById('screen-3');

  const toEnvelopeBtn = document.getElementById('to-envelope');
  const openEnvBtn = document.getElementById('open-envelope');
  const backHomeBtn = document.getElementById('back-home');

  const env = document.getElementById('envelope');
  const flap = document.getElementById('env-flap');
  const letter = document.getElementById('letter');

  function showScreen(target){
    s1.dataset.visible = 'false';
    s2.dataset.visible = 'false';
    s3.dataset.visible = 'false';
    target.dataset.visible = 'true';
  
    const card = target.querySelector('.card');
    if(card){
      card.classList.remove('show');
      void card.offsetWidth;
      card.classList.add('show');
    }
  }

  toEnvelopeBtn.addEventListener('click', () => {
    env.style.transform = 'rotateY(12deg)';
    setTimeout(()=> { env.style.transform = 'rotateY(0)'; showScreen(s2); }, 220);
  });

  openEnvBtn.addEventListener('click', () => {
    flap.style.transform = 'rotateX(-180deg) translateY(-6px)';
    flap.style.boxShadow = 'none';
    env.style.transform = 'translateY(-6px) rotateZ(-3deg) scale(1.02)';
   
    setTimeout(()=> {
      letter.classList.add('revealed');
      showScreen(s3);
      setTimeout(()=> {
        flap.style.transform = '';
        env.style.transform = '';
      }, 600);
    }, 420);
  });

  backHomeBtn.addEventListener('click', () => {
    letter.classList.remove('revealed');
    showScreen(s1);
  });

  [toEnvelopeBtn, openEnvBtn, backHomeBtn].forEach(b => {
    b.addEventListener('keyup', (e) => {
      if(e.key === 'Enter' || e.key === ' ') b.click();
    });
  });

  env.addEventListener('click', () => {
    openEnvBtn.click();
  });

  document.addEventListener('DOMContentLoaded', () => {
    s1.dataset.visible = 'true';
  });

const music = document.getElementById('bg-music');
let musicStarted = false;


function tryStartMusic() {
  if (musicStarted) return;
  music.loop = true;
  const p = music.play();
  if (p !== undefined) {
    p.then(() => {
      musicStarted = true;
      document.getElementById('play-overlay').style.display = 'none';
    }).catch((err) => {
    
      console.log('Autoplay bloqueado:', err);
      document.getElementById('play-overlay').style.display = 'block';
    });
  }
}


toEnvelopeBtn.addEventListener('click', () => {
  tryStartMusic();
  env.style.transform = 'rotateY(12deg)';
  setTimeout(()=> { env.style.transform = 'rotateY(0)'; showScreen(s2); }, 220);
});


openEnvBtn.addEventListener('click', () => {
  tryStartMusic();
  flap.style.transform = 'rotateX(-180deg) translateY(-6px)';
  flap.style.boxShadow = 'none';
  env.style.transform = 'translateY(-6px) rotateZ(-3deg) scale(1.02)';
  setTimeout(()=> {
    letter.classList.add('revealed');
    showScreen(s3);
    setTimeout(()=> {
      flap.style.transform = '';
      env.style.transform = '';
    }, 600);
  }, 420);
});


document.getElementById('manual-play').addEventListener('click', () => {
  music.play().then(() => {
    musicStarted = true;
    document.getElementById('play-overlay').style.display = 'none';
  }).catch(e => console.log('No se pudo reproducir manualmente', e));
});

