// Navegación tipo SPA: una sola vista visible a la vez, sin recargar página.
const navLinks = document.querySelectorAll('[data-view-target]');
const views = document.querySelectorAll('[data-view]');
const sidebarNav = document.querySelector('.sidebar-nav');
const sidebarToggle = document.querySelector('.sidebar-toggle');

const validViews = new Set(Array.from(views, (view) => view.id));

function activateView(viewId, updateHash = true) {
  const targetId = validViews.has(viewId) ? viewId : 'inicio';

  views.forEach((view) => {
    const isCurrent = view.id === targetId;
    view.classList.toggle('is-active', isCurrent);

    if (isCurrent) {
      const scrollableArea = view.querySelector('.view-scroll');
      if (scrollableArea) scrollableArea.scrollTop = 0;
    }
  });

  navLinks.forEach((link) => {
    const isCurrent = link.dataset.viewTarget === targetId;
    link.classList.toggle('is-active', isCurrent);
    link.setAttribute('aria-current', isCurrent ? 'page' : 'false');
  });

  if (updateHash && window.location.hash !== `#${targetId}`) {
    history.replaceState(null, '', `#${targetId}`);
  }

  revealVisibleElements();
}

navLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    activateView(link.dataset.viewTarget);
    sidebarNav?.classList.remove('open');
  });
});

window.addEventListener('hashchange', () => {
  const hashTarget = window.location.hash.replace('#', '');
  activateView(hashTarget, false);
});

if (sidebarToggle && sidebarNav) {
  sidebarToggle.addEventListener('click', () => {
    sidebarNav.classList.toggle('open');
  });
}

// Observador para micro animaciones al mostrar contenido en cada vista.
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  },
  { threshold: 0.15 }
);

function revealVisibleElements() {
  document
    .querySelectorAll('.app-view.is-active .reveal-on-scroll:not(.is-visible)')
    .forEach((element) => revealObserver.observe(element));
}

// Modo claro / oscuro persistente con localStorage.
const themeSwitch = document.querySelector('#theme-switch');
const themeSwitchText = document.querySelector('.theme-switch-text');
const THEME_KEY = 'xarcon-theme';

function applyTheme(theme) {
  const selectedTheme = theme === 'light' ? 'light' : 'dark';
  document.body.setAttribute('data-theme', selectedTheme);

  if (themeSwitchText) {
    themeSwitchText.textContent = selectedTheme === 'dark' ? 'Modo claro' : 'Modo oscuro';
  }
}

const storedTheme = localStorage.getItem(THEME_KEY);
applyTheme(storedTheme || 'dark');

if (themeSwitch) {
  themeSwitch.addEventListener('click', () => {
    const currentTheme = document.body.getAttribute('data-theme') || 'dark';
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme);
    localStorage.setItem(THEME_KEY, nextTheme);
  });
}

// Año dinámico del footer principal.
const yearNode = document.querySelector('#current-year');
if (yearNode) {
  yearNode.textContent = new Date().getFullYear();
}

// Estado inicial: solo Inicio visible por defecto.
const initialView = window.location.hash.replace('#', '') || 'inicio';
activateView(initialView, false);
