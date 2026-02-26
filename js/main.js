const THEME_KEY = 'xarcon-theme';

function getPreferredTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === 'dark' || saved === 'light') return saved;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme) {
  const resolvedTheme = theme === 'light' ? 'light' : 'dark';
  document.body.setAttribute('data-theme', resolvedTheme);
  document.body.classList.toggle('light-mode', resolvedTheme === 'light');

  const toggleText = document.querySelector('[data-theme-text]');
  if (toggleText) {
    toggleText.textContent = resolvedTheme === 'dark' ? 'Cambiar a claro' : 'Cambiar a oscuro';
  }

  const toggleButton = document.querySelector('[data-theme-toggle]');
  if (toggleButton) {
    toggleButton.setAttribute('aria-pressed', String(resolvedTheme === 'dark'));
  }
}

function initTheme() {
  applyTheme(getPreferredTheme());

  const themeToggle = document.querySelector('[data-theme-toggle]');
  themeToggle?.addEventListener('click', () => {
    const next = document.body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem(THEME_KEY, next);
  });
}

function setActiveNav() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach((link) => {
    const href = link.getAttribute('href') || '';
    const target = href.split('/').pop();
    if (target === currentPath || (currentPath === '' && target === 'index.html')) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });
}

function initMobileMenu() {
  const menu = document.getElementById('mobile-menu');
  const navLinks = document.querySelector('.nav-links');
  if (!menu || !navLinks) return;

  menu.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('active');
    menu.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      menu.setAttribute('aria-expanded', 'false');
    });
  });
}

async function loadBusinessCatalog() {
  const container = document.querySelector('[data-business-grid]');
  if (!container) return;

  try {
    const response = await fetch('./data/negocios.json');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const businesses = await response.json();

    container.innerHTML = businesses
      .map(
        (business) => `
        <article class="business-card">
          <img class="business-media" src="${business.imagen}" alt="${business.nombre}" loading="lazy" />
          <div class="business-content">
            <span class="badge">${business.categoria}</span>
            <h3>${business.nombre}</h3>
            <p>${business.descripcion}</p>
            <div class="card-actions">
              <a class="btn btn-secondary" href="${business.url}" target="_blank" rel="noopener noreferrer">Ver más</a>
              <a class="btn btn-primary" href="${business.contacto}" target="_blank" rel="noopener noreferrer">Contactar</a>
            </div>
          </div>
        </article>
      `
      )
      .join('');
  } catch (error) {
    container.innerHTML = '<p>No se pudo cargar el catálogo empresarial en este momento.</p>';
    console.error('Error cargando negocios:', error);
  }
}

function initGsapAnimations() {
  // Fallback defensivo: si GSAP o ScrollTrigger no cargan desde CDN, dejamos el sitio funcional sin romper UX.
  if (typeof window.gsap === 'undefined' || typeof window.ScrollTrigger === 'undefined') return;

  const { gsap, ScrollTrigger } = window;

  // Accesibilidad + performance: reducimos movimiento si el usuario lo prefiere.
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  gsap.registerPlugin(ScrollTrigger);

  // Todos los tweens usan easing y overwrite consistentes para animaciones fluidas y sin saltos.
  gsap.defaults({
    ease: 'power2.out',
    duration: 0.8,
    overwrite: 'auto',
  });

  // Solo declaramos will-change en elementos animados para optimizar composición en móviles sin abusar de memoria.
  const animatedTargets = document.querySelectorAll('.navbar, .hero h1, .hero .actions .btn, .section, .btn, .theme-toggle');
  animatedTargets.forEach((el) => {
    el.style.willChange = 'transform, opacity';
  });

  // Header: entrada inicial suave + cambio sutil al hacer scroll para reforzar transición entre secciones.
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    gsap.fromTo(navbar, { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 });

    ScrollTrigger.create({
      start: 8,
      onUpdate: ({ direction, progress }) => {
        // Solo transform/opacity para mantener 60fps en navegadores móviles.
        gsap.to(navbar, {
          y: progress > 0.02 && direction === 1 ? -4 : 0,
          opacity: progress > 0.02 ? 0.96 : 1,
          duration: 0.25,
        });
      },
    });
  }

  // Menú: animación del enlace activo al cargar y micro-feedback al pulsar un link.
  const activeLink = document.querySelector('.nav-links a.active');
  if (activeLink) {
    gsap.fromTo(activeLink, { y: -8, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, delay: 0.15 });
  }

  document.querySelectorAll('.nav-links a').forEach((link) => {
    link.addEventListener('click', () => {
      gsap.fromTo(link, { y: 0, opacity: 1 }, { y: -2, opacity: 0.85, duration: 0.16, yoyo: true, repeat: 1 });
    });
  });

  // Hero Timeline (Inicio): secuencia profesional con título principal y luego CTA para dirigir la atención.
  const heroTitle = document.querySelector('.hero h1');
  const heroButtons = document.querySelectorAll('.hero .actions .btn');

  if (heroTitle) {
    const heroTimeline = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // Paso 1: aparece el título con fade + slide-up (solo transform y opacity).
    heroTimeline.from(heroTitle, {
      y: 46,
      opacity: 0,
      duration: 0.9,
    });

    // Paso 2: aparecen los botones del hero con leve escalado para micro-énfasis visual.
    if (heroButtons.length) {
      heroTimeline.from(
        heroButtons,
        {
          y: 20,
          opacity: 0,
          scale: 0.98,
          duration: 0.6,
          stagger: 0.12,
        },
        '-=0.35'
      );
    }
  }

  // Reveal de secciones principales (Inicio, Sobre Nosotros, Servicios, Proceso, Contacto):
  // cada bloque entra al viewport con fade + slide-up para mantener jerarquía visual consistente.
  gsap.utils.toArray('.section').forEach((section) => {
    gsap.from(section, {
      y: 44,
      opacity: 0,
      duration: 0.82,
      scrollTrigger: {
        trigger: section,
        start: 'top 82%',
        toggleActions: 'play none none reverse',
      },
    });
  });

  // Microinteracciones en botones: hover suave para feedback táctil/visual premium.
  document.querySelectorAll('.btn, .theme-toggle').forEach((button) => {
    button.addEventListener('mouseenter', () => {
      gsap.to(button, { y: -3, scale: 1.03, duration: 0.2 });
    });

    button.addEventListener('mouseleave', () => {
      gsap.to(button, { y: 0, scale: 1, duration: 0.2 });
    });
  });
}

initTheme();
setActiveNav();
initMobileMenu();
loadBusinessCatalog().finally(() => {
  // Esperamos al catálogo dinámico para que las nuevas tarjetas compartan timeline y triggers correctamente.
  initGsapAnimations();
});
