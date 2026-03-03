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

function initHeroAnimation() {
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
}

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  setActiveNav();
  initMobileMenu();
  loadBusinessCatalog();
  initHeroAnimation();
});
