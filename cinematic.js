(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const compact = matchMedia('(max-width: 1023px)');
  const header = document.querySelector('.site-header');
  const heroImage = document.querySelector('.hero-car');
  const loader = document.querySelector('.page-loader');
  const darkSections = [...document.querySelectorAll('.performance-story,.engineering-story,.drive-film,.camera-gallery,.final-scene')];
  let lenis;

  const finishLoading = () => {
    if (!loader || loader.classList.contains('loaded')) return;
    loader.querySelector('b').style.transform = 'scaleX(1)';
    loader.querySelector('output').value = '100';
    loader.classList.add('loaded');
  };
  if (heroImage?.complete) finishLoading();
  else {
    heroImage?.addEventListener('load', finishLoading, { once: true });
    heroImage?.addEventListener('error', finishLoading, { once: true });
  }
  setTimeout(finishLoading, 1500);

  let navFrame = 0;
  const updateNavigation = () => {
    navFrame = 0;
    header?.classList.toggle('scrolled', scrollY > 36);
    document.body.classList.toggle('nav-dark', darkSections.some(section => {
      const rect = section.getBoundingClientRect();
      return rect.top < 65 && rect.bottom > 65;
    }));
  };
  addEventListener('scroll', () => {
    if (!navFrame) navFrame = requestAnimationFrame(updateNavigation);
  }, { passive: true });
  updateNavigation();

  document.querySelectorAll('[data-tone]').forEach(button => button.addEventListener('click', () => {
    const colors = { ivory: '#e9e5dd', red: '#b8262c', graphite: '#303033', silver: '#c8c9c7' };
    const section = button.closest('.color-story');
    section.style.setProperty('--tone', colors[button.dataset.tone]);
    section.dataset.activeTone = button.dataset.tone;
    section.querySelectorAll('[data-tone]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  }));

  // Only the most visible film plays. Native touch scrolling is never intercepted.
  const films = [...document.querySelectorAll('video')];
  const visibility = new Map(films.map(video => [video, 0]));
  const pausedByUser = new Set();
  const playedByUser = new Set();
  let currentFilm;
  const buttonFor = video => document.querySelector(`[data-film-toggle="${video.id}"]`);
  const updateFilmButton = video => {
    const button = buttonFor(video);
    if (!button) return;
    button.textContent = video.paused ? 'Putar film ↗' : 'Jeda film Ⅱ';
    button.setAttribute('aria-label', `${video.paused ? 'Putar' : 'Jeda'} film`);
    button.setAttribute('aria-pressed', String(!video.paused));
  };
  const updatePlayback = () => {
    const candidate = document.hidden ? null : films
      .filter(video => visibility.get(video) >= .15 && !pausedByUser.has(video) && (!reduced.matches || playedByUser.has(video)))
      .sort((a, b) => visibility.get(b) - visibility.get(a))[0];
    films.forEach(video => { if (video !== candidate && !video.paused) video.pause(); });
    if (candidate && (candidate !== currentFilm || candidate.paused)) {
      candidate.play().catch(() => updateFilmButton(candidate));
    }
    currentFilm = candidate;
  };
  const filmObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => visibility.set(entry.target, entry.isIntersecting ? entry.intersectionRatio : 0));
    updatePlayback();
  }, { threshold: [0, .15, .3, .5, .7, .9, 1] });
  films.forEach(video => {
    filmObserver.observe(video);
    video.addEventListener('play', () => updateFilmButton(video));
    video.addEventListener('pause', () => updateFilmButton(video));
    buttonFor(video)?.addEventListener('click', () => {
      if (!video.paused) {
        pausedByUser.add(video);
        playedByUser.delete(video);
        video.pause();
      } else {
        pausedByUser.delete(video);
        playedByUser.add(video);
        films.forEach(other => { if (other !== video) other.pause(); });
        currentFilm = video;
        video.play().catch(() => updateFilmButton(video));
      }
    });
  });
  document.addEventListener('visibilitychange', updatePlayback);
  reduced.addEventListener('change', updatePlayback);

  if (!window.gsap || !window.ScrollTrigger) {
    document.documentElement.classList.add('motion-fallback');
    return;
  }
  const { gsap, ScrollTrigger } = window;
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true, limitCallbacks: true });
  const mm = gsap.matchMedia();

  // Lenis only runs on fine-pointer desktop. Its ticker is removed on breakpoint changes.
  mm.add('(min-width: 1024px) and (pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
    if (!window.Lenis) return;
    lenis = new Lenis({ duration: .7, smoothWheel: true, syncTouch: false, anchors: true });
    window.nitrovaLenis = lenis;
    document.documentElement.classList.add('has-lenis');
    lenis.on('scroll', ScrollTrigger.update);
    const tick = time => lenis?.raf(time * 1000);
    gsap.ticker.add(tick);
    return () => {
      gsap.ticker.remove(tick);
      lenis?.destroy();
      lenis = undefined;
      window.nitrovaLenis = undefined;
      document.documentElement.classList.remove('has-lenis');
    };
  });

  const layers = [...document.querySelectorAll('[data-gallery-layer]')];
  const resetGallery = () => layers.forEach(layer => {
    ['opacity', 'visibility', 'transform'].forEach(property => layer.style.removeProperty(property));
  });
  mm.add({
    desktop: '(min-width: 1024px)',
    compact: '(max-width: 1023px)',
    short: '(max-width: 1023px) and (max-height: 650px)',
    reduce: '(prefers-reduced-motion: reduce)'
  }, context => {
    const { desktop: isDesktop, short: isShort, reduce } = context.conditions;
    document.documentElement.classList.toggle('motion-fallback', reduce);
    if (reduce) return () => document.documentElement.classList.remove('motion-fallback');
    const scrub = isDesktop ? .45 : .12;
    const timeline = (trigger, start = 'top bottom', end = 'bottom top') => gsap.timeline({
      defaults: { ease: 'none' }, scrollTrigger: { trigger, start, end, scrub, invalidateOnRefresh: true }
    });

    gsap.set(['.hero-car', '.hero-word', '.color-story>img', '.color-word', '.final-scene img', '.final-word'], { xPercent: -50, yPercent: -50 });
    timeline('.hero', 'top top', 'bottom bottom')
      .to('.hero-word', { x: isDesktop ? '-6vw' : '-2vw', y: -18, scale: 1.02 }, 0)
      .to('.hero-car', { x: isDesktop ? '8vw' : '1vw', y: isDesktop ? -24 : -8, scale: isDesktop ? 1.12 : 1.025 }, 0)
      .to('.hero-halo', { scale: 1.08, opacity: .65 }, 0)
      .to('.hero-copy', { y: isDesktop ? -55 : -16, opacity: 0, duration: .28 }, .68)
      .to('.hero-kicker,.hero-bottom', { opacity: 0, duration: .3 }, .62);

    timeline('.performance-story', 'top 85%', 'bottom top')
      .fromTo('.performance-pin video', { scale: 1.06 }, { scale: 1, duration: 1 }, 0)
      .fromTo('.performance-title', { y: isDesktop ? 55 : 20 }, { y: isDesktop ? -30 : -8, duration: 1 }, 0)
      .fromTo('.performance-stats>div', { y: 20, opacity: .55 }, { y: 0, opacity: 1, stagger: .08, duration: .3 }, .08);

    // No absolute left offsets or -50% centering on this normal-flow car stage.
    timeline('.parallax-scene')
      .fromTo('.parallax-bg', { yPercent: -3 }, { yPercent: 3 }, 0)
      .fromTo('.parallax-word', { xPercent: isDesktop ? 5 : 2, y: 15 }, { xPercent: isDesktop ? -5 : -2, y: -15 }, 0)
      .fromTo('.parallax-car', { x: isDesktop ? -35 : -5, y: isDesktop ? 20 : 6, scale: .94 }, { x: isDesktop ? 35 : 5, y: isDesktop ? -22 : -6, scale: isDesktop ? 1 : .98 }, 0)
      .fromTo('.parallax-copy', { y: isDesktop ? 25 : 8 }, { y: isDesktop ? -20 : -5 }, 0);

    timeline('.design-story', 'top 90%', 'bottom 15%')
      .fromTo('.design-intro h2', { y: isDesktop ? 32 : 12 }, { y: 0, duration: .4 }, 0)
      .fromTo('.design-film-stage', { y: isDesktop ? 40 : 14, scale: .97 }, { y: 0, scale: 1, duration: .7 }, 0)
      .fromTo('.design-notes article', { y: 12, opacity: .6 }, { y: 0, opacity: 1, stagger: .06, duration: .5 }, .1);

    timeline('.color-story')
      .fromTo('.color-word', { x: '-3vw', scale: .95 }, { x: '3vw', scale: 1.02 }, 0)
      .fromTo('.color-story>img', { x: isDesktop ? '-3vw' : '-1vw', y: 12, scale: .96 }, { x: isDesktop ? '3vw' : '1vw', y: -12, scale: 1 }, 0);

    timeline('.engineering-story', isDesktop ? 'top top' : 'top 85%', isDesktop ? 'bottom bottom' : 'bottom 30%')
      .fromTo('.engineering-word', { xPercent: 4 }, { xPercent: -8, duration: 1 }, 0)
      .fromTo('.engineering-head h2', { y: isDesktop ? 30 : 12 }, { y: 0, duration: .35 }, 0)
      .fromTo('.engineering-list article', { y: isDesktop ? 20 : 8, opacity: .55 }, { y: 0, opacity: 1, stagger: .12, duration: .3 }, .1);

    timeline('.drive-film', 'top bottom', 'bottom top')
      .fromTo('.drive-pin video', { scale: 1.06 }, { scale: 1 }, 0)
      .fromTo('.drive-copy', { y: isDesktop ? 50 : 16 }, { y: isDesktop ? -35 : -8 }, 0);

    let galleryTrigger;
    let galleryIndex = -1;
    if (!isShort) {
      galleryTrigger = ScrollTrigger.create({
        trigger: '.camera-gallery', start: 'top top', end: 'bottom bottom',
        onUpdate(self) {
          // A quarter chapter per image, with a short overlap. Reversible in both directions.
          const position = Math.max(0, Math.min(3, self.progress * 4 - .5));
          const first = Math.floor(position);
          const next = Math.min(3, first + 1);
          const mix = position - first;
          const index = mix >= .5 ? next : first;
          if (index !== galleryIndex) {
            galleryIndex = index;
            window.NitrovaGallery?.select(index);
          }
          layers.forEach((layer, i) => {
            const visible = i === first || (i === next && mix > 0);
            layer.style.visibility = visible ? 'visible' : 'hidden';
            layer.style.opacity = i === first ? String(1 - mix) : i === next ? String(mix) : '0';
            if (first === next && i === first) layer.style.opacity = '1';
            if (visible) layer.style.transform = `translate3d(0,${i === first ? -mix * 3 : (1 - mix) * 3}%,0)`;
          });
        }
      });
    }
    const chooseGallery = event => {
      if (!galleryTrigger) return;
      const target = galleryTrigger.start + (galleryTrigger.end - galleryTrigger.start) * ((event.detail.index + .5) / 4);
      if (lenis) lenis.scrollTo(target, { duration: .5 });
      else scrollTo({ top: target, behavior: 'smooth' });
    };
    addEventListener('nitrova:gallery-select', chooseGallery);

    timeline('.collection-section', 'top bottom', 'top 20%')
      .fromTo('.catalog-word', { xPercent: 3 }, { xPercent: -3 }, 0);
    timeline('.final-scene', 'top bottom', 'bottom bottom')
      .fromTo('.final-word', { x: '3vw' }, { x: '-3vw' }, 0)
      .fromTo('.final-scene img', { x: isDesktop ? '-6vw' : '-1vw', y: 18, scale: .96 }, { x: isDesktop ? '4vw' : '1vw', y: 0, scale: 1 }, 0)
      .fromTo('.final-copy', { y: isDesktop ? 35 : 12, opacity: .7 }, { y: 0, opacity: 1 }, 0);

    return () => {
      removeEventListener('nitrova:gallery-select', chooseGallery);
      resetGallery();
    };
  });

  const refresh = () => ScrollTrigger.refresh();
  document.fonts?.ready.then(refresh);
  addEventListener('load', refresh, { once: true });
  compact.addEventListener('change', refresh);
  // Pages restored from the back-forward cache may retain a mid-chapter scroll position.
  addEventListener('pageshow', event => { if (event.persisted) { refresh(); updatePlayback(); } });
  addEventListener('pagehide', event => { if (!event.persisted) { mm.revert(); filmObserver.disconnect(); } });
})();
