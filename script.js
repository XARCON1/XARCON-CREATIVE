document.addEventListener('DOMContentLoaded', () => {
  const header = document.getElementById('siteHeader');
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');
  const revealItems = document.querySelectorAll('.reveal');
  const introContainer = document.getElementById('intro-container');
  const introVideo = document.getElementById('intro-video');
  const introFinalImage = document.getElementById('intro-final-image');
  const heroBusinessBubble = document.getElementById('heroBusinessBubble');
  const themeToggle = document.getElementById('themeToggle');
  const themeToggleIcon = themeToggle ? themeToggle.querySelector('.theme-toggle-icon') : null;
  const themeStorageKey = 'xarcon-theme';

  const applyTheme = (mode) => {
    const isLightMode = mode === 'light';
    document.body.classList.toggle('light-mode', isLightMode);

    if (!themeToggle || !themeToggleIcon) {
      return;
    }

    themeToggleIcon.textContent = isLightMode ? '☀️' : '🌙';
    themeToggle.setAttribute('aria-label', isLightMode ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro');
    themeToggle.setAttribute('aria-pressed', String(isLightMode));
  };

  const savedTheme = window.localStorage.getItem(themeStorageKey);
  applyTheme(savedTheme === 'light' ? 'light' : 'dark');

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isLightMode = document.body.classList.toggle('light-mode');
      const nextTheme = isLightMode ? 'light' : 'dark';
      applyTheme(nextTheme);
      window.localStorage.setItem(themeStorageKey, nextTheme);
    });
  }

  const handleHeaderState = () => {
    if (header) {
      header.classList.toggle('scrolled', window.scrollY > 50);
    }
  };

  handleHeaderState();
  window.addEventListener('scroll', handleHeaderState, { passive: true });

  if (header && navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      const isOpen = header.classList.toggle('nav-open');
      navToggle.classList.toggle('active', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    mainNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        header.classList.remove('nav-open');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  const setupHeroIntro = () => {
    if (!introContainer || !introVideo || !introFinalImage) {
      return;
    }

    document.body.classList.add('intro-active');
    let hasFinished = false;
    let introTimerId;

    const showFinalImage = () => {
      console.log('showing final image');
      introContainer.classList.add('is-hidden');
      introFinalImage.classList.add('fade-in');
      document.body.classList.remove('intro-active');
    };

    const finishIntro = () => {
      if (hasFinished) {
        return;
      }

      hasFinished = true;
      window.sessionStorage.setItem('xarcon-intro-seen', 'true');
      console.log('video ended');
      introContainer.classList.add('fade-out');

      setTimeout(showFinalImage, 1000);
    };

    introVideo.addEventListener('loadedmetadata', () => {
      if (Math.round(introVideo.duration) !== 10) {
        console.warn(`Duración inesperada para assets/intro.mp4: ${introVideo.duration}s`);
      }
    }, { once: true });

    introVideo.addEventListener('playing', () => {
      console.log('video started');
      if (introTimerId) {
        return;
      }

      introTimerId = setTimeout(finishIntro, 10000);
    }, { once: true });

    introVideo.addEventListener('ended', finishIntro, { once: true });

    introVideo.play().catch(() => {
      // autoplay policies may block playback in some browsers; ended listener remains as fallback.
    });
  };

  setupHeroIntro();

  if (heroBusinessBubble) {
    heroBusinessBubble.addEventListener('click', () => {
      window.location.href = 'negocios.html';
    });
  }

  if (typeof IntersectionObserver !== 'undefined') {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.25 }
    );

    revealItems.forEach((item) => observer.observe(item));
  }

  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    revealItems.forEach((item) => {
      item.style.opacity = '1';
      item.style.transform = 'none';
    });
    if (heroBusinessBubble) {
      heroBusinessBubble.style.opacity = '1';
    }
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const heroSection = document.getElementById('hero');
  const servicesSection = document.getElementById('servicios');

  const setupFloatingBusinessBubble = () => {
    if (!heroBusinessBubble) {
      return;
    }

    const isVisibleInRange = () => {
      const heroTop = heroSection ? heroSection.offsetTop : 0;
      const servicesBottom = servicesSection ? servicesSection.offsetTop + servicesSection.offsetHeight : 0;
      const currentScroll = window.scrollY + window.innerHeight * 0.1;
      return currentScroll >= heroTop && currentScroll <= servicesBottom;
    };

    const toggleBubbleVisibility = () => {
      heroBusinessBubble.style.opacity = isVisibleInRange() ? '0.92' : '0';
      heroBusinessBubble.style.visibility = isVisibleInRange() ? 'visible' : 'hidden';
    };

    const bubbleSize = () => heroBusinessBubble.getBoundingClientRect().width || 110;

    const getRandomPoint = () => {
      const size = bubbleSize();
      const padding = Math.max(16, size * 0.2);
      const maxX = Math.max(padding, window.innerWidth - size - padding);
      const maxY = Math.max(padding, window.innerHeight - size - padding);
      return {
        x: gsap.utils.random(padding, maxX),
        y: gsap.utils.random(padding, maxY)
      };
    };

    const animateToNextPoint = () => {
      const next = getRandomPoint();
      gsap.to(heroBusinessBubble, {
        x: next.x,
        y: next.y,
        duration: gsap.utils.random(3.2, 6.4),
        ease: 'sine.inOut',
        onComplete: animateToNextPoint
      });
    };

    const start = () => {
      const initial = getRandomPoint();
      gsap.set(heroBusinessBubble, { x: initial.x, y: initial.y });
      if (!reduceMotion) {
        animateToNextPoint();
      }
    };

    toggleBubbleVisibility();
    window.addEventListener('scroll', toggleBubbleVisibility, { passive: true });
    window.addEventListener('resize', toggleBubbleVisibility);
    window.addEventListener('resize', () => {
      const size = bubbleSize();
      const currentX = gsap.getProperty(heroBusinessBubble, 'x');
      const currentY = gsap.getProperty(heroBusinessBubble, 'y');
      const boundedX = Math.min(Math.max(16, Number(currentX)), Math.max(16, window.innerWidth - size - 16));
      const boundedY = Math.min(Math.max(16, Number(currentY)), Math.max(16, window.innerHeight - size - 16));
      gsap.set(heroBusinessBubble, { x: boundedX, y: boundedY });
    });

    start();
  };

  setupFloatingBusinessBubble();


  gsap.from('.site-header', {
    y: -70,
    autoAlpha: 0,
    duration: 0.9,
    ease: 'power3.out'
  });



  const servicePanels = gsap.utils.toArray('[data-panel]');
  servicePanels.forEach((panel, index) => {
    const content = panel.querySelector('.service-content');
    const fromX = index % 2 === 0 ? -90 : 90;

    gsap.fromTo(
      content,
      { x: fromX, autoAlpha: 0 },
      {
        x: 0,
        autoAlpha: 1,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: panel,
          start: 'top 70%',
          end: 'top 35%',
          scrub: 0.7
        }
      }
    );

    if (!reduceMotion) {
      const media = panel.querySelector('img');
      gsap.fromTo(
        media,
        { scale: 1.12 },
        {
          scale: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: panel,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.1
          }
        }
      );
    }
  });

  const negocios = gsap.utils.toArray('[data-negocio]');
  negocios.forEach((negocio, index) => {
    const content = negocio.querySelector('.negocio-content');
    const map = negocio.querySelector('.negocio-map-wrap');
    const contentFromX = index % 2 === 0 ? -80 : 80;
    const mapFromX = index % 2 === 0 ? 80 : -80;

    if (content) {
      gsap.fromTo(
        content,
        { x: contentFromX, y: 28, autoAlpha: 0 },
        {
          x: 0,
          y: 0,
          autoAlpha: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: negocio,
            start: 'top 75%',
            end: 'top 40%',
            scrub: 0.7
          }
        }
      );
    }

    if (map) {
      gsap.fromTo(
        map,
        { x: mapFromX, y: 28, autoAlpha: 0 },
        {
          x: 0,
          y: 0,
          autoAlpha: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: negocio,
            start: 'top 72%',
            end: 'top 36%',
            scrub: 0.7
          }
        }
      );
    }

    if (!reduceMotion && map) {
      gsap.fromTo(
        map,
        { yPercent: -3 },
        {
          yPercent: 3,
          ease: 'none',
          scrollTrigger: {
            trigger: negocio,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1
          }
        }
      );
    }
  });

  if (!reduceMotion) {
    gsap.utils.toArray('[data-parallax]').forEach((item) => {
      const media = item.querySelector('img, video');
      if (!media) {
        return;
      }

      gsap.fromTo(
        media,
        { yPercent: -7 },
        {
          yPercent: 7,
          ease: 'none',
          scrollTrigger: {
            trigger: item,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.2
          }
        }
      );
    });
  }

  revealItems.forEach((item) => {
    const xOffset = item.classList.contains('from-left') ? -50 : item.classList.contains('from-right') ? 50 : 0;

    gsap.to(item, {
      x: 0,
      y: 0,
      autoAlpha: 1,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: item,
        start: 'top 80%'
      },
      onStart: () => {
        gsap.set(item, { x: xOffset });
      }
    });
  });
});
