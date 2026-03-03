document.addEventListener('DOMContentLoaded', function () {
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
      introContainer.classList.add('fade-out');

      setTimeout(showFinalImage, 1000);
    };

    introVideo.addEventListener('loadedmetadata', () => {
      if (Math.round(introVideo.duration) !== 10) {
        console.warn(`Duración inesperada para assets/intro.mp4: ${introVideo.duration}s`);
      }
    }, { once: true });

    introVideo.addEventListener('playing', () => {
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

  revealItems.forEach((item) => {
    item.style.opacity = '1';
    item.style.transform = 'none';
  });

  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
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

    const getSafePoint = () => {
      const size = bubbleSize();
      const padding = Math.max(16, size * 0.2);
      const maxX = Math.max(padding, window.innerWidth - size - padding);
      const maxY = Math.max(padding, window.innerHeight - size - padding);
      return {
        x: window.innerWidth > size * 2 ? (window.innerWidth - size) / 2 : padding,
        y: window.innerHeight > size * 2 ? (window.innerHeight - size) / 2 : padding
      };
    };

    const start = () => {
      const initial = getSafePoint();
      gsap.set(heroBusinessBubble, { x: initial.x, y: initial.y });
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



  const setupCreativeScrollAnimations = () => {
    const heroContent = document.querySelector('.hero-content');
    const pageSections = gsap
      .utils
      .toArray('main section')
      .filter((section) => section.id !== 'hero' && section.id !== 'servicios' && section.id !== 'nosotros');
    const serviceCards = gsap.utils.toArray('#servicios .service-panel');
    const aboutText = document.querySelector('#nosotros .about-text');
    const aboutImage = document.querySelector('#nosotros .about-media');

    if (heroContent) {
      gsap.from(
        heroContent,
        { y: 60, duration: 1.2, ease: 'power3.out' }
      );
    }

    pageSections.forEach((section) => {
      gsap.from(section, {
        y: 60,
        duration: 1,
        ease: 'power3.out',
        immediateRender: false,
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      });
    });

    if (serviceCards.length) {
      gsap.from(serviceCards, {
        y: 60,
        duration: 1,
        ease: 'power3.out',
        immediateRender: false,
        stagger: 0.2,
        scrollTrigger: {
          trigger: '#servicios',
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      });
    }

    if (aboutText) {
      gsap.from(
        aboutText,
        {
          x: -80,
          duration: 1,
          ease: 'power3.out',
          immediateRender: false,
          scrollTrigger: {
            trigger: '#nosotros',
            start: 'top 80%',
            toggleActions: 'play none none none'
          }
        }
      );
    }

    if (aboutImage) {
      gsap.from(
        aboutImage,
        {
          x: 80,
          duration: 1,
          ease: 'power3.out',
          immediateRender: false,
          scrollTrigger: {
            trigger: '#nosotros',
            start: 'top 80%',
            toggleActions: 'play none none none'
          }
        }
      );
    }
  };

  try {
    setupCreativeScrollAnimations();
  } catch (error) {
    console.error('No se pudieron inicializar las animaciones principales', error);
  }

  const negocios = gsap.utils.toArray('[data-negocio]');
  negocios.forEach((negocio, index) => {
    const content = negocio.querySelector('.negocio-content');
    const map = negocio.querySelector('.negocio-map-wrap');
    const contentFromX = index % 2 === 0 ? -80 : 80;
    const mapFromX = index % 2 === 0 ? 80 : -80;

    if (content) {
      gsap.from(
        content,
        {
          x: contentFromX,
          y: 28,
          duration: 1,
          ease: 'power3.out',
          immediateRender: false,
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
      gsap.from(
        map,
        {
          x: mapFromX,
          y: 28,
          duration: 1,
          ease: 'power3.out',
          immediateRender: false,
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
      gsap.from(
        map,
        {
          yPercent: -3,
          ease: 'none',
          immediateRender: false,
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

      gsap.from(
        media,
        {
          yPercent: -7,
          ease: 'none',
          immediateRender: false,
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

  // Animaciones GSAP principales agrupadas en setupCreativeScrollAnimations.
});
