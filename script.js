document.addEventListener('DOMContentLoaded', () => {
  const header = document.getElementById('siteHeader');
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');
  const heroBusinessBubble = document.getElementById('heroBusinessBubble');
  const themeToggle = document.getElementById('themeToggle');
  const themeToggleIcon = themeToggle ? themeToggle.querySelector('.theme-toggle-icon') : null;
  const introOverlay = document.getElementById('introOverlay');
  const introVideo = document.getElementById('introVideo');
  const introFinal = document.getElementById('introFinal');
  const themeStorageKey = 'xarcon-theme';

  const applyTheme = (mode) => {
    const isLightMode = mode === 'light';
    document.body.classList.toggle('light-mode', isLightMode);

    if (!themeToggle || !themeToggleIcon) return;

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

  if (heroBusinessBubble) {
    heroBusinessBubble.addEventListener('click', () => {
      window.location.href = 'negocios.html';
    });
  }

  if (introOverlay && introVideo && introFinal) {
    document.body.classList.add('intro-active');
    introVideo.loop = false;

    const finishIntro = () => {
      introOverlay.remove();
      document.body.classList.remove('intro-active');
    };

    introVideo.play().catch(() => {
      // Autoplay can fail in some browsers, but timing sequence still runs.
    });

    setTimeout(() => {
      if (typeof window.gsap !== 'undefined') {
        window.gsap.to(introVideo, { opacity: 0, duration: 1.2, ease: 'power2.out' });
        window.gsap.to(introFinal, { opacity: 1, duration: 1.2, ease: 'power2.out' });
        window.gsap.to(introOverlay, { opacity: 0, delay: 1.3, duration: 0.9, onComplete: finishIntro });
      } else {
        introVideo.style.opacity = '0';
        introFinal.style.opacity = '1';
        setTimeout(finishIntro, 2100);
      }
    }, 10000);
  }

  if (typeof window.gsap === 'undefined') return;

  const { gsap } = window;
  const hasScrollTrigger = typeof window.ScrollTrigger !== 'undefined';

  if (hasScrollTrigger) {
    gsap.registerPlugin(window.ScrollTrigger);
  }

  gsap.from('.hero-line', {
    y: 120,
    opacity: 0,
    duration: 1.2,
    stagger: 0.3,
    ease: 'power4.out'
  });

  if (hasScrollTrigger) {
    gsap.from('.servicio-card', {
      scrollTrigger: {
        trigger: '.services-wrap',
        start: 'top 85%'
      },
      y: 60,
      opacity: 0,
      stagger: 0.2,
      duration: 1.1,
      ease: 'power3.out'
    });

    gsap.utils.toArray('.negocio-item').forEach((item) => {
      gsap.from(item, {
        scrollTrigger: {
          trigger: item,
          start: 'top 80%'
        },
        y: 80,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
      });
    });
  }

  const randomRange = (min, max) => Math.random() * (max - min) + min;

  function animateSphere() {
    if (!heroBusinessBubble) return;

    gsap.to(heroBusinessBubble, {
      x: randomRange(-100, 100),
      y: randomRange(-80, 80),
      duration: 4,
      ease: 'sine.inOut',
      onComplete: animateSphere
    });
  }

  animateSphere();
});
