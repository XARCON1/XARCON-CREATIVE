document.addEventListener('DOMContentLoaded', () => {
  const header = document.getElementById('siteHeader');
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');
  const heroBusinessBubble = document.getElementById('heroBusinessBubble');
  const themeToggle = document.getElementById('themeToggle');
  const themeToggleIcon = themeToggle ? themeToggle.querySelector('.theme-toggle-icon') : null;
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

  if (typeof window.gsap === 'undefined') return;

  const { gsap } = window;
  const tl = gsap.timeline();

  tl.from(".hero-media", {
    scale: 1.2,
    duration: 2,
    ease: "power2.out"
  });

  tl.from(".hero-title", {
    y: 120,
    opacity: 0,
    duration: 1,
    ease: "power4.out"
  }, "-=1.5");

  tl.from(".hero-subtitle", {
    y: 80,
    opacity: 0,
    duration: 1,
    ease: "power4.out"
  }, "-=0.8");

  tl.from(".hero-button", {
    scale: 0.5,
    opacity: 0,
    duration: 0.8,
    ease: "back.out(1.7)"
  }, "-=0.6");
});
