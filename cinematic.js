(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const clamp = value => Math.max(0, Math.min(1, value));
  const progressOf = element => {
    const rect = element.getBoundingClientRect();
    return clamp(-rect.top / Math.max(1, rect.height - innerHeight));
  };
  const hero = document.querySelector('.hero');
  const performance = document.querySelector('.performance-story');
  const parallax = document.querySelector('.parallax-scene');
  const design = document.querySelector('.design-story');
  const drive = document.querySelector('.drive-film');
  const finalScene = document.querySelector('.final-scene');
  const header = document.querySelector('.site-header');
  const film = document.querySelector('#performance-film');
  let frame = 0;

  function update() {
    frame = 0;
    const scrollY = window.scrollY;
    header.classList.toggle('scrolled', scrollY > 36);
    const darkSections = [performance, document.querySelector('.engineering-story'), drive, document.querySelector('.camera-gallery'), finalScene];
    const dark = darkSections.some(section => { if (!section) return false; const r = section.getBoundingClientRect(); return r.top < 74 && r.bottom > 74; });
    document.body.classList.toggle('nav-dark', dark);
    if (reduced.matches) return;

    if (hero) {
      const p = progressOf(hero);
      hero.style.setProperty('--hero-progress', p.toFixed(4));
      hero.style.setProperty('--hero-car-x', `${(p * 14).toFixed(2)}vw`);
      hero.style.setProperty('--hero-car-y', `${(-p * 20).toFixed(1)}px`);
      hero.style.setProperty('--hero-car-scale', (1 + p * .17).toFixed(4));
      hero.style.setProperty('--hero-word-mask', `${(p * 16).toFixed(2)}%`);
      hero.style.setProperty('--hero-shadow', (1 + p * .22).toFixed(3));
    }
    if (performance) {
      const p = progressOf(performance);
      performance.style.setProperty('--performance-scale', (1.1 - p * .08).toFixed(4));
      performance.style.setProperty('--performance-y', `${(p * -2).toFixed(2)}%`);
      performance.style.setProperty('--performance-mask', `${Math.max(0, 100 - p * 220).toFixed(2)}%`);
      performance.style.setProperty('--stat-y', `${Math.max(0, 45 - p * 90).toFixed(1)}px`);
      performance.style.setProperty('--stat-opacity', clamp((p - .25) * 3).toFixed(3));
      if (film) {
        const rect = performance.getBoundingClientRect();
        const visible = rect.top < innerHeight && rect.bottom > 0;
        if (visible && film.paused) film.play().catch(() => {});
        if (!visible && !film.paused) film.pause();
      }
    }
    if (parallax) {
      const r = parallax.getBoundingClientRect();
      const p = clamp((innerHeight - r.top) / (innerHeight + r.height));
      parallax.style.setProperty('--para-bg', `${(p * -70).toFixed(1)}px`);
      parallax.style.setProperty('--para-car-y', `${(p * -26).toFixed(1)}px`);
      parallax.style.setProperty('--para-car-x', `${(p * 4).toFixed(2)}vw`);
      parallax.style.setProperty('--para-text-y', `${(p * -85).toFixed(1)}px`);
      parallax.style.setProperty('--para-copy', `${(p * -60).toFixed(1)}px`);
      parallax.style.setProperty('--para-fg', `${(p * 80).toFixed(1)}px`);
    }
    if (design) {
      const r = design.getBoundingClientRect();
      const p = clamp((innerHeight - r.top) / (innerHeight + r.height));
      design.style.setProperty('--design-y', `${(-10 + p * 8).toFixed(2)}%`);
    }
    if (drive) {
      const r = drive.getBoundingClientRect();
      const p = clamp((innerHeight - r.top) / (innerHeight + r.height));
      drive.style.setProperty('--drive-scale', (1.08 - p * .08).toFixed(4));
    }
    if (finalScene) {
      const r = finalScene.getBoundingClientRect();
      const p = clamp((innerHeight - r.top) / (innerHeight + r.height));
      finalScene.style.setProperty('--final-x', `${(-7 + p * 14).toFixed(2)}vw`);
    }
  }
  function schedule(){ if (!frame) frame = requestAnimationFrame(update); }
  addEventListener('scroll', schedule, {passive:true});
  addEventListener('resize', schedule);
  document.querySelectorAll('[data-tone]').forEach(button => button.addEventListener('click', () => {
    const colors = {ivory:'#e9e5dd', red:'#b8262c', graphite:'#303033', silver:'#c8c9c7'};
    const section = button.closest('.color-story');
    section.style.setProperty('--tone', colors[button.dataset.tone]);
    section.querySelectorAll('[data-tone]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  }));
  schedule();
})();
