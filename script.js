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

    mobileMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeMenu);
    });

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
    }, {
      threshold: 0.11,
      rootMargin: '0px 0px -40px 0px'
    });

    reveals.forEach((element) => observer.observe(element));
  } else {
    reveals.forEach((element) => element.classList.add('visible'));
  }

  if (form && formStatus) {
    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      const data = new FormData(form);
      const name = String(data.get('name') || '').trim();
      const email = String(data.get('email') || '').trim();
      const service = String(data.get('service') || '').trim();
      const message = String(data.get('message') || '').trim();

      const summary = [
        'Solicitud de proyecto — XARCON Creative',
        'Nombre: ' + name,
        'Correo: ' + email,
        'Servicio: ' + service,
        '',
        message
      ].join('\n');

      try {
        await navigator.clipboard.writeText(summary);
        formStatus.textContent = 'Solicitud preparada y copiada. Conecta aquí tu correo, WhatsApp o CRM cuando definamos el canal comercial.';
      } catch (error) {
        formStatus.textContent = 'Solicitud preparada. El formulario quedará conectado al canal comercial definitivo antes del lanzamiento.';
      }
    });
  }
});