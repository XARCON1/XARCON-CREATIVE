const THEME_KEY = 'xarcon-theme';

function applyTheme(theme) {
  const resolvedTheme = theme === 'light' ? 'light' : 'dark';
  document.body.setAttribute('data-theme', resolvedTheme);

  const toggleText = document.querySelector('[data-theme-text]');
  if (toggleText) {
    toggleText.textContent = resolvedTheme === 'dark' ? 'Cambiar a claro' : 'Cambiar a oscuro';
  }
}

function initTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  applyTheme(saved || 'dark');

  const themeToggle = document.querySelector('[data-theme-toggle]');
  themeToggle?.addEventListener('click', () => {
    const next = document.body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem(THEME_KEY, next);
  });
}

function setActiveNav() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.sidebar-nav a').forEach((link) => {
    const href = link.getAttribute('href') || '';
    const target = href.split('/').pop();
    if (target === currentPath || (currentPath === '' && target === 'index.html')) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
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

initTheme();
setActiveNav();
loadBusinessCatalog();
