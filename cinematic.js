(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const desktop = matchMedia('(min-width: 1024px) and (pointer: fine)');
  const header = document.querySelector('.site-header');
  const loader = document.querySelector('.page-loader');
  const heroImage = document.querySelector('.hero-car');
  const darkSections = [...document.querySelectorAll('.performance-story,.engineering-story,.drive-film,.camera-gallery,.final-scene')];
  let lenis;

  const finishLoading = () => {
    if (!loader || loader.classList.contains('loaded')) return;
    const bar = loader.querySelector('b');
    const output = loader.querySelector('output');
    bar.style.transform = 'scaleX(1)';
    output.value = '100';
    setTimeout(() => loader.classList.add('loaded'), reduced.matches ? 0 : 260);
  };
  let loadProgress = 0;
  const loadTicker = setInterval(() => {
    if (!loader) return clearInterval(loadTicker);
    loadProgress = Math.min(92, loadProgress + Math.ceil((94 - loadProgress) * .13));
    loader.querySelector('b').style.transform = `scaleX(${loadProgress / 100})`;
    loader.querySelector('output').value = String(loadProgress).padStart(2, '0');
  }, 55);
  const ready = () => { clearInterval(loadTicker); finishLoading(); };
  if (heroImage?.complete) ready(); else heroImage?.addEventListener('load', ready, { once: true });
  addEventListener('load', ready, { once: true });
  setTimeout(ready, 2200);

  const updateNavigation = () => {
    header?.classList.toggle('scrolled', scrollY > 36);
    const dark = darkSections.some(section => {
      const rect = section.getBoundingClientRect();
      return rect.top < 74 && rect.bottom > 74;
    });
    document.body.classList.toggle('nav-dark', dark);
  };
  addEventListener('scroll', updateNavigation, { passive: true });
  updateNavigation();

  document.querySelectorAll('[data-tone]').forEach(button => button.addEventListener('click', () => {
    const colors = { ivory: '#e9e5dd', red: '#b8262c', graphite: '#303033', silver: '#c8c9c7' };
    const section = button.closest('.color-story');
    section.style.setProperty('--tone', colors[button.dataset.tone]);
    section.querySelectorAll('[data-tone]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  }));

  const videoObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    const video = entry.target;
    if (entry.isIntersecting && !reduced.matches) video.play().catch(() => {});
    else video.pause();
  }), { rootMargin: '20% 0px', threshold: .08 });
  document.querySelectorAll('video').forEach(video => videoObserver.observe(video));

  if (!window.gsap || !window.ScrollTrigger || reduced.matches) {
    document.documentElement.classList.add('motion-fallback');
    return;
  }

  const { gsap, ScrollTrigger } = window;
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true, limitCallbacks: true });

  if (desktop.matches && window.Lenis) {
    lenis = new Lenis({ duration: .82, smoothWheel: true, syncTouch: false, anchors: true });
    window.nitrovaLenis = lenis;
    document.documentElement.classList.add('has-lenis');
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(time => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  const mm = gsap.matchMedia();
  mm.add({ desktop: '(min-width: 1024px)', mobile: '(max-width: 1023px)' }, context => {
    const isDesktop = context.conditions.desktop;
    const scrub = isDesktop ? .55 : .18;

    gsap.set('.hero-car', { xPercent: -50, yPercent: -50, transformOrigin: '50% 70%' });
    gsap.set('.hero-word', { xPercent: -50, yPercent: -50 });
    gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom bottom', scrub } })
      .to('.hero-word', { x: isDesktop ? '-8vw' : '-4vw', y: isDesktop ? -35 : -15, scale: 1.05 }, 0)
      .to('.hero-car', { x: isDesktop ? '14vw' : '8vw', y: isDesktop ? -28 : -10, scale: isDesktop ? 1.18 : 1.09 }, 0)
      .to('.hero-halo', { scale: 1.18, opacity: .55 }, 0)
      .to('.hero-copy', { y: isDesktop ? -95 : -46, opacity: 0 }, .52)
      .to('.hero-kicker', { x: isDesktop ? 60 : 22, opacity: 0 }, .58)
      .to('.hero-bottom', { y: 24, opacity: 0 }, .34)
      .to('.hero-shadow', { x: isDesktop ? '9vw' : '5vw', scaleX: 1.18, opacity: .5 }, 0);

    gsap.set('.performance-title h2', { clipPath: 'inset(0 100% 0 0)' });
    gsap.set('.performance-stats > div', { y: 55, opacity: 0 });
    gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: '.performance-story', start: 'top top', end: 'bottom bottom', scrub } })
      .fromTo('.performance-pin video', { scale: 1.13, xPercent: -2 }, { scale: 1.01, xPercent: 1.5, duration: .55 }, 0)
      .to('.performance-title h2', { clipPath: 'inset(0 0% 0 0)', duration: .32 }, .04)
      .to('.performance-stats > div', { y: 0, opacity: 1, stagger: .055, duration: .25 }, .22)
      .to('.performance-title', { x: isDesktop ? '-7vw' : '-3vw', opacity: .15, duration: .28 }, .68)
      .to('.performance-stats', { y: -35, opacity: 0, duration: .2 }, .78)
      .to('.performance-pin video', { scale: 1.08, opacity: .45, duration: .2 }, .8);

    gsap.set('.parallax-car', { yPercent: -50 });
    gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: '.parallax-scene', start: 'top bottom', end: 'bottom top', scrub } })
      .fromTo('.parallax-bg', { yPercent: -5, scale: 1.06 }, { yPercent: 7, scale: 1 }, 0)
      .fromTo('.parallax-word', { xPercent: 6, y: 80 }, { xPercent: -8, y: -95 }, 0)
      .fromTo('.parallax-car', { xPercent: isDesktop ? -4 : -2, y: 40, scale: 1.1 }, { xPercent: isDesktop ? 5 : 2, y: -75, scale: 1.02 }, 0)
      .fromTo('.parallax-copy', { y: 100, clipPath: 'inset(0 0 100% 0)' }, { y: -70, clipPath: 'inset(0 0 0% 0)' }, .08)
      .fromTo('.parallax-foreground', { y: -40 }, { y: 105 }, 0);

    gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: '.design-story', start: 'top top', end: 'bottom bottom', scrub } })
      .fromTo('.design-intro h2', { y: 80, clipPath: 'inset(0 0 100% 0)' }, { y: 0, clipPath: 'inset(0 0 0% 0)', duration: .28 }, 0)
      .fromTo('.design-image', { clipPath: 'inset(18% 14% 18% 14%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: .52 }, .12)
      .fromTo('.design-image img', { xPercent: -8, yPercent: -4, scale: 1.16 }, { xPercent: -8, yPercent: 3, scale: 1.03, duration: .76 }, .1)
      .fromTo('.design-notes article', { x: isDesktop ? 70 : 24, opacity: 0 }, { x: 0, opacity: 1, stagger: .08, duration: .22 }, .28);

    gsap.set('.color-story > img', { xPercent: -50, yPercent: -50 });
    gsap.set('.color-word', { xPercent: -50, yPercent: -50 });
    gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: '.color-story', start: 'top bottom', end: 'bottom top', scrub } })
      .fromTo('.color-word', { scale: .86, x: isDesktop ? '-7vw' : '-3vw' }, { scale: 1.08, x: isDesktop ? '5vw' : '2vw' }, 0)
      .fromTo('.color-story > img', { x: isDesktop ? '-5vw' : '-2vw', y: 35, scale: .94 }, { x: isDesktop ? '5vw' : '2vw', y: -25, scale: 1.06 }, 0)
      .fromTo('.color-copy', { y: 65, opacity: .2 }, { y: -25, opacity: 1 }, .05);

    gsap.set('.engineering-list article', { opacity: .18 });
    gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: '.engineering-story', start: 'top top', end: 'bottom bottom', scrub } })
      .fromTo('.engineering-word', { xPercent: 8 }, { xPercent: -18, duration: 1 }, 0)
      .fromTo('.engineering-head h2', { y: 70, clipPath: 'inset(0 0 100% 0)' }, { y: 0, clipPath: 'inset(0 0 0% 0)', duration: .26 }, 0)
      .to('.engineering-list article', { opacity: 1, x: 0, stagger: .12, duration: .22 }, .18)
      .to('.engineering-head', { y: isDesktop ? -70 : -25, opacity: .28, duration: .25 }, .7);

    gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: '.drive-film', start: 'top top', end: 'bottom bottom', scrub } })
      .fromTo('.drive-film video', { scale: 1.1, xPercent: -2 }, { scale: 1, xPercent: 2 }, 0)
      .fromTo('.drive-copy', { y: 75, opacity: 0, clipPath: 'inset(0 0 100% 0)' }, { y: 0, opacity: 1, clipPath: 'inset(0 0 0% 0)', duration: .4 }, .16)
      .to('.drive-copy', { y: -70, opacity: 0, duration: .24 }, .72)
      .to('.drive-film video', { scale: 1.06, opacity: .65, duration: .24 }, .76);

    const galleryLayers = gsap.utils.toArray('[data-gallery-layer]');
    gsap.set(galleryLayers, { opacity: 0, clipPath: 'inset(100% 0 0 0)', scale: 1.08 });
    gsap.set(galleryLayers[0], { opacity: 1, clipPath: 'inset(0% 0 0 0)', scale: 1 });
    let galleryIndex = -1;
    const galleryTimeline = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: {
      trigger: '.camera-gallery', start: 'top top', end: 'bottom bottom', scrub,
      onUpdate(self) {
        const index = Math.min(3, Math.floor(self.progress * 4));
        if (index !== galleryIndex) { galleryIndex = index; window.NitrovaGallery?.select(index); }
      }
    }});
    galleryLayers.slice(1).forEach((layer, index) => {
      const at = (index + 1) / 4;
      galleryTimeline.to(layer, { opacity: 1, clipPath: 'inset(0% 0 0 0)', scale: 1, duration: .18 }, at)
        .to(galleryLayers[index], { scale: .94, opacity: .28, duration: .18 }, at);
    });
    galleryTimeline.fromTo('.camera-frame-caption', { y: 35 }, { y: -12, duration: 1 }, 0);

    gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: '.collection-section', start: 'top bottom', end: 'top 15%', scrub } })
      .fromTo('.catalog-word', { xPercent: 8, opacity: 0 }, { xPercent: -8, opacity: 1 }, 0);

    gsap.set('.final-scene img', { xPercent: -50, yPercent: -50 });
    gsap.set('.final-word', { xPercent: -50, yPercent: -50 });
    gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: '.final-scene', start: 'top bottom', end: 'bottom bottom', scrub } })
      .fromTo('.final-word', { xPercent: -43, opacity: .25 }, { xPercent: -57, opacity: 1 }, 0)
      .fromTo('.final-scene img', { x: isDesktop ? '-12vw' : '-6vw', y: 45, scale: .94 }, { x: isDesktop ? '10vw' : '5vw', y: -20, scale: 1.05 }, 0)
      .fromTo('.final-copy', { y: 80, opacity: 0 }, { y: 0, opacity: 1 }, .24);
  });

  addEventListener('nitrova:gallery-select', event => {
    const section = document.querySelector('.camera-gallery');
    if (!section) return;
    const distance = section.offsetHeight - innerHeight;
    const target = section.offsetTop + distance * (event.detail.index / 3);
    if (lenis) lenis.scrollTo(target, { duration: .8 });
    else scrollTo({ top: target, behavior: 'smooth' });
  });

  const refresh = () => ScrollTrigger.refresh();
  document.fonts?.ready.then(refresh);
  addEventListener('load', refresh, { once: true });
})();
