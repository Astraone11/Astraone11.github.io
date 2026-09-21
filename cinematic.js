(() => {
  const hero = document.querySelector('#home');
  if (!hero) return;
  const stage = hero.querySelector('.hero-stage');
  const view = hero.querySelector('#hero-3d-view');
  const intro = hero.querySelector('.hero-copy');
  const bottom = hero.querySelector('.hero-bottom');
  const controls = hero.querySelector('.hero-3d-controls');
  const cards = [...hero.querySelectorAll('[data-story]')];
  const film = hero.querySelector('.story-film');
  const filmVideo = hero.querySelector('#porsche-film');
  const railNumber = hero.querySelector('#story-number');
  const railProgress = hero.querySelector('#story-progress');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const clamp = (value, min = 0, max = 1) => Math.max(min, Math.min(max, value));
  const range = (value, start, end) => clamp((value - start) / (end - start));
  const bell = (value, start, peak, end) => Math.min(range(value, start, peak), 1 - range(value, peak, end));
  const sceneNames = ['intro','reveal','orbit','wheel','wheel-mask','performance','side','headlight','light','exterior','technical','film','fullscreen','return','final'];
  const sceneCards = { orbit: cards.find(el => el.dataset.story === 'orbit'), wheel: cards.find(el => el.dataset.story === 'wheel'), performance: cards.find(el => el.dataset.story === 'performance'), side: cards.find(el => el.dataset.story === 'side'), headlight: cards.find(el => el.dataset.story === 'headlight'), technical: cards.find(el => el.dataset.story === 'technical'), final: cards.find(el => el.dataset.story === 'final') };
  let pending = false;

  function show(element, opacity, y = 0, scale = 1) {
    if (!element) return;
    element.style.opacity = opacity.toFixed(3);
    element.style.transform = `translate3d(0,${y.toFixed(2)}px,0) scale(${scale.toFixed(4)})`;
    element.style.pointerEvents = opacity > .65 ? 'auto' : 'none';
  }

  function update() {
    pending = false;
    const rect = hero.getBoundingClientRect();
    const progress = reduced.matches ? clamp(-rect.top / Math.max(1, rect.height - innerHeight)) : clamp(-rect.top / Math.max(1, rect.height - innerHeight));
    const scene = Math.min(14, Math.floor(progress * 15));
    hero.style.setProperty('--story-progress', progress.toFixed(4));
    hero.dataset.scene = sceneNames[scene];
    document.body.dataset.nitrovaScene = sceneNames[scene];
    railNumber.textContent = String(scene + 1).padStart(2, '0');
    railProgress.style.transform = `scaleY(${progress})`;

    const introOpacity = 1 - range(progress, .025, .105);
    show(intro, introOpacity, -32 * range(progress, .02, .11));
    show(bottom, 1 - range(progress, .015, .07), -18 * range(progress, .015, .07));
    if (controls) controls.style.opacity = String(1 - range(progress, .03, .09));

    show(sceneCards.orbit, bell(progress, .105, .16, .23), 34 * (1 - range(progress, .105, .16)));
    show(sceneCards.wheel, bell(progress, .215, .275, .34), 34 * (1 - range(progress, .215, .275)));
    show(sceneCards.performance, bell(progress, .345, .405, .49), 38 * (1 - range(progress, .345, .405)));
    show(sceneCards.side, bell(progress, .47, .535, .61), 34 * (1 - range(progress, .47, .535)));
    show(sceneCards.headlight, bell(progress, .59, .64, .695), 28 * (1 - range(progress, .59, .64)));
    show(sceneCards.technical, bell(progress, .69, .735, .79), 28 * (1 - range(progress, .69, .735)));
    show(sceneCards.final, range(progress, .925, .975), 32 * (1 - range(progress, .925, .975)));

    const wheelMask = bell(progress, .285, .335, .385);
    hero.style.setProperty('--wheel-mask', wheelMask.toFixed(4));
    const lightWash = bell(progress, .635, .685, .73);
    hero.style.setProperty('--light-wash', lightWash.toFixed(4));

    const filmIn = range(progress, .765, .82);
    const filmFull = range(progress, .82, .875);
    const filmOut = range(progress, .895, .935);
    const filmOpacity = clamp(filmIn * (1 - filmOut));
    const filmScale = .72 + filmFull * .28;
    if (film) {
      film.style.opacity = filmOpacity.toFixed(3);
      film.style.setProperty('--film-scale', filmScale.toFixed(4));
      film.style.setProperty('--film-radius', `${Math.max(0, 32 * (1 - filmFull))}px`);
      film.style.pointerEvents = filmOpacity > .7 ? 'auto' : 'none';
    }
    if (filmVideo) {
      filmVideo.style.transform = `scale(${(1.02 + filmFull * .035).toFixed(4)}) translate3d(0,${(-10 * filmFull).toFixed(2)}px,0)`;
      if (filmOpacity > .15 && filmVideo.paused) filmVideo.play().catch(() => {});
      if (filmOpacity < .02 && !filmVideo.paused) filmVideo.pause();
    }

    const carOpacity = clamp(1 - range(progress, .79, .84) + range(progress, .9, .95));
    if (view) view.style.opacity = carOpacity.toFixed(3);
    window.dispatchEvent(new CustomEvent('nitrova:story', { detail: { progress, scene } }));
  }

  function schedule() {
    if (pending) return;
    pending = true;
    requestAnimationFrame(update);
  }
  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', schedule);
  schedule();
})();
