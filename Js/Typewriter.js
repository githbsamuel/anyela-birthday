(function () {
  'use strict';

  const SPEED_CHAR  = 28;
  const SPEED_PAUSE = 380;
  const SPEED_SPACE = 48;

  let animating = false;

  const SELECTORS = '#letter h2, #letter .letter-date, #letter p, #letter .signature-label, #letter .signature';

  function charDelay(ch) {
    if ('.!?…'.includes(ch)) return SPEED_PAUSE;
    if (',;:'.includes(ch))  return SPEED_PAUSE / 2;
    if (ch === ' ')           return SPEED_SPACE;
    return SPEED_CHAR;
  }

  function typeElement(el, text) {
    return new Promise(resolve => {
      el.textContent = '';
      el.style.visibility = 'visible';

      let i = 0;
      function next() {
        if (i >= text.length) return resolve();
        el.textContent += text[i];
        i++;
        setTimeout(next, charDelay(text[i - 1]));
      }
      next();
    });
  }

  async function runTypewriter() {
    animating = true;

    const els       = Array.from(document.querySelectorAll(SELECTORS));
    const texts     = els.map(el => {
      const text = el.textContent;
      el.textContent = '';
      el.style.visibility = 'hidden';
      return text;
    });

    for (let i = 0; i < els.length; i++) {
      await typeElement(els[i], texts[i]);
    }

    animating = false;
  }

  function restore() {
    // Solo restaura visibilidad si se interrumpe externamente (back home)
    document.querySelectorAll(SELECTORS).forEach(el => {
      el.style.visibility = 'visible';
    });
    animating = false;
  }

  window.Typewriter = {
    start:   runTypewriter,
    restore,
    get animating() { return animating; }
  };
})();