document.addEventListener('DOMContentLoaded', () => {
  const header = document.getElementById('siteHeader');
  const menuButton = document.getElementById('menuButton');
  const mobileMenu = document.getElementById('mobileMenu');
  const cursorGlow = document.getElementById('cursorGlow');
  const form = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');
  const year = document.getElementById('year');

  if (year) year.textContent = new Date().getFullYear();

  const onScroll = () => {
    if (header) header.classList.toggle('scrolled', window.scrollY > 36);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  if (menuButton && mobileMenu) {
    const closeMenu = () => {
      menuButton.classList.remove('active');
      mobileMenu.classList.remove('open');
      menuButton.setAttribute('aria-expanded', 'false');
      mobileMenu.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('menu-open');
    };

    menuButton.addEventListener('click', () => {
      const open = !mobileMenu.classList.contains('open');
      menuButton.classList.toggle('active', open);
      mobileMenu.classList.toggle('open', open);
      menuButton.setAttribute('aria-expanded', String(open));
      mobileMenu.setAttribute('aria-hidden', String(!open));
      document.body.classList.toggle('menu-open', open);
    });

    mobileMenu.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
    window.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeMenu();
    });
  }

  if (cursorGlow && window.matchMedia('(pointer: fine)').matches) {
    window.addEventListener('pointermove', (event) => {
      cursorGlow.style.left = event.clientX + 'px';
      cursorGlow.style.top = event.clientY + 'px';
    }, { passive: true });
  }

  const reveals = document.querySelectorAll('.reveal');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if ('IntersectionObserver' in window && !reduceMotion) {
    reveals.forEach((element) => element.classList.add('reveal-pending'));
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -35px 0px' });
    reveals.forEach((element) => observer.observe(element));
  } else {
    reveals.forEach((element) => element.classList.add('visible'));
  }

  const tiltItems = document.querySelectorAll('[data-tilt]');
  if (!reduceMotion && window.matchMedia('(pointer: fine)').matches) {
    tiltItems.forEach((item) => {
      item.addEventListener('pointermove', (event) => {
        const rect = item.getBoundingClientRect();
        const px = (event.clientX - rect.left) / rect.width;
        const py = (event.clientY - rect.top) / rect.height;
        const rx = (0.5 - py) * 4;
        const ry = (px - 0.5) * 5;
        item.style.transform = 'perspective(1000px) rotateX(' + rx + 'deg) rotateY(' + ry + 'deg)';
      });
      item.addEventListener('pointerleave', () => {
        item.style.transform = '';
      });
    });
  }

  document.querySelectorAll('.lab-control[data-device]').forEach((button) => {
    button.addEventListener('click', () => {
      const demo = document.getElementById('deviceDemo');
      if (!demo) return;
      document.querySelectorAll('.lab-control[data-device]').forEach((item) => item.classList.remove('active'));
      button.classList.add('active');
      demo.classList.toggle('mobile', button.dataset.device === 'mobile');
      demo.classList.toggle('desktop', button.dataset.device !== 'mobile');
    });
  });

  const identityDemo = document.getElementById('identityDemo');
  const identityTitle = document.getElementById('identityTitle');
  const identityNames = {
    a: 'Precision / Tech',
    b: 'Quiet / Luxury',
    c: 'Bright / Playful'
  };

  document.querySelectorAll('.identity-btn').forEach((button) => {
    button.addEventListener('click', () => {
      if (!identityDemo) return;
      document.querySelectorAll('.identity-btn').forEach((item) => item.classList.remove('active'));
      button.classList.add('active');
      identityDemo.classList.remove('theme-a', 'theme-b', 'theme-c');
      identityDemo.classList.add('theme-' + button.dataset.theme);
      if (identityTitle) identityTitle.textContent = identityNames[button.dataset.theme] || '';
    });
  });

  const runFlow = document.getElementById('runFlow');
  const automationStage = document.getElementById('automationStage');
  if (runFlow && automationStage) {
    runFlow.addEventListener('click', () => {
      automationStage.classList.remove('running');
      void automationStage.offsetWidth;
      automationStage.classList.add('running');
      runFlow.innerHTML = 'Flujo ejecutándose <span>●</span>';
      window.setTimeout(() => {
        runFlow.innerHTML = 'Ejecutar flujo <span>▶</span>';
      }, 2600);
    });
  }

  const budgetRange = document.getElementById('budgetRange');
  const budgetValue = document.getElementById('budgetValue');
  const leadValue = document.getElementById('leadValue');
  const visitValue = document.getElementById('visitValue');
  const projectionValue = document.getElementById('projectionValue');

  if (budgetRange) {
    const updateBudget = () => {
      const budget = Number(budgetRange.value);
      const leads = Math.round(budget * 0.084);
      const visits = budget * 3.6;
      const projection = Math.min(22.8, 5.4 + (budget / 2000) * 12.4);
      if (budgetValue) budgetValue.textContent = '$' + budget.toLocaleString('en-US');
      if (leadValue) leadValue.textContent = String(leads);
      if (visitValue) visitValue.textContent = visits >= 1000 ? (visits / 1000).toFixed(1) + 'K' : String(Math.round(visits));
      if (projectionValue) projectionValue.textContent = projection.toFixed(1) + '%';

      const bars = document.querySelectorAll('.growth-line i');
      bars.forEach((bar, index) => {
        const base = 18 + index * 9;
        const extra = (budget / 2000) * (10 + index * 2);
        bar.style.height = Math.min(96, base + extra) + '%';
      });
    };
    budgetRange.addEventListener('input', updateBudget);
    updateBudget();
  }


  // Barra de progreso y transición suave entre páginas.
  const progress = document.createElement('div');
  progress.className = 'scroll-progress';
  document.body.appendChild(progress);

  const updateProgress = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const value = max > 0 ? (window.scrollY / max) * 100 : 0;
    progress.style.width = value + '%';
  };
  updateProgress();
  window.addEventListener('scroll', updateProgress, { passive: true });

  const transitionLayer = document.createElement('div');
  transitionLayer.className = 'page-transition';
  transitionLayer.innerHTML = '<span><img src="/assets/xarcon-mark.svg" alt=""></span>';
  document.body.appendChild(transitionLayer);
  requestAnimationFrame(() => document.body.classList.add('page-ready'));

  document.querySelectorAll('a[href]').forEach((link) => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || link.target === '_blank') return;
    const url = new URL(link.href, window.location.href);
    if (url.origin !== window.location.origin) return;

    link.addEventListener('click', (event) => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      document.body.classList.add('page-leaving');
      window.setTimeout(() => { window.location.href = url.href; }, 360);
    });
  });

  // Profundidad sutil en piezas visuales al hacer scroll.
  const depthItems = document.querySelectorAll('.stage-panel, .case-thumb, .mini-live');
  if (!reduceMotion && depthItems.length) {
    const depthTick = () => {
      const center = window.innerHeight / 2;
      depthItems.forEach((item) => {
        const rect = item.getBoundingClientRect();
        const delta = (rect.top + rect.height / 2 - center) / window.innerHeight;
        item.style.setProperty('--depth-y', Math.max(-8, Math.min(8, delta * -10)).toFixed(2) + 'px');
      });
    };
    depthTick();
    window.addEventListener('scroll', depthTick, { passive: true });
  }

  if (form && formStatus) {
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const data = new FormData(form);
      const name = String(data.get('name') || '').trim();
      const email = String(data.get('email') || '').trim();
      const service = String(data.get('service') || '').trim();
      const budget = String(data.get('budget') || '').trim();
      const message = String(data.get('message') || '').trim();

      const summary = [
        'Solicitud de proyecto — XARCON Creative',
        'Nombre: ' + name,
        'Correo: ' + email,
        'Servicio: ' + service,
        budget ? 'Presupuesto: ' + budget : '',
        '',
        message
      ].filter(Boolean).join('\n');

      try {
        await navigator.clipboard.writeText(summary);
        formStatus.textContent = 'Solicitud preparada y copiada. El canal comercial definitivo se conectará antes del lanzamiento.';
      } catch (error) {
        formStatus.textContent = 'Solicitud preparada. El canal comercial definitivo se conectará antes del lanzamiento.';
      }
    });
  }
});