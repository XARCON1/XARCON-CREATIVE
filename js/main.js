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
  // Fallback seguro: si GSAP no está disponible, el sitio funciona sin JS de animaciones.
  if (typeof window.gsap === 'undefined' || typeof window.ScrollTrigger === 'undefined') return;

  const { gsap, ScrollTrigger } = window;

  // Respeta accesibilidad: con reduced-motion evitamos secuencias y triggers largos.
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  gsap.registerPlugin(ScrollTrigger);

  // Configuración global para que todas las animaciones usen propiedades de alto rendimiento.
  gsap.defaults({
    ease: 'power2.out',
    duration: 0.8,
    overwrite: 'auto',
  });

  // Animación del header al cargar: entrada suave con desplazamiento vertical corto.
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    gsap.fromTo(navbar, { y: -24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, clearProps: 'transform' });
  }

  // Transición de enlaces del menú: efecto sutil al hacer click para reforzar feedback visual.
  document.querySelectorAll('.nav-links a').forEach((link) => {
    link.addEventListener('click', () => {
      gsap.fromTo(link, { y: 0, opacity: 1 }, { y: -2, opacity: 0.88, duration: 0.18, yoyo: true, repeat: 1 });
    });
  });

  // Hero timeline: secuencia narrativa del título principal y luego acciones CTA.
  const hero = document.querySelector('.hero');
  if (hero) {
    const heroTitle = hero.querySelector('h1');
    const heroText = hero.querySelector('p:not(.eyebrow)');
    const heroButtons = hero.querySelectorAll('.actions .btn');

    const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    if (heroTitle) {
      heroTl.fromTo(heroTitle, { y: 42, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9 });
    }

    if (heroText) {
      heroTl.fromTo(heroText, { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, '-=0.55');
    }

    if (heroButtons.length) {
      heroTl.fromTo(heroButtons, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55, stagger: 0.12 }, '-=0.35');
    }
  }

  // Secciones principales: reveal al entrar en viewport con ScrollTrigger.
  const revealTargets = document.querySelectorAll('.hero, .section');
  revealTargets.forEach((section) => {
    gsap.fromTo(
      section,
      { y: 46, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.85,
        scrollTrigger: {
          trigger: section,
          start: 'top 84%',
          toggleActions: 'play none none reverse',
        },
      }
    );
  });

  // Microinteracciones en botones: hover con scale/translate para una sensación premium.
  document.querySelectorAll('.btn, .theme-toggle').forEach((button) => {
    button.addEventListener('mouseenter', () => {
      gsap.to(button, { y: -3, scale: 1.02, duration: 0.22, ease: 'power2.out' });
    });

    button.addEventListener('mouseleave', () => {
      gsap.to(button, { y: 0, scale: 1, duration: 0.22, ease: 'power2.out' });
    });
  });
}

initTheme();
setActiveNav();
initMobileMenu();
loadBusinessCatalog().finally(() => {
  // Esperamos a que el catálogo termine para incluir tarjetas dinámicas en triggers.
  initGsapAnimations();
});
