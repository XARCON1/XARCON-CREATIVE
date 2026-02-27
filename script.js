document.addEventListener('DOMContentLoaded', () => {
  const header = document.getElementById('siteHeader');
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');
  const revealItems = document.querySelectorAll('.reveal');

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

  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    revealItems.forEach((item) => {
      item.style.opacity = '1';
      item.style.transform = 'none';
    });
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  gsap.from('.site-header', {
    y: -70,
    autoAlpha: 0,
    duration: 0.9,
    ease: 'power3.out'
  });

  gsap.from('.hero-content', {
    y: 54,
    autoAlpha: 0,
    duration: 1.1,
    delay: 0.2,
    ease: 'power3.out'
  });

  const servicePanels = gsap.utils.toArray('[data-panel]');
  servicePanels.forEach((panel, index) => {
    const content = panel.querySelector('.service-content');
    const fromX = index % 2 === 0 ? -90 : 90;

    gsap.fromTo(
      content,
      { x: fromX, autoAlpha: 0 },
      {
        x: 0,
        autoAlpha: 1,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: panel,
          start: 'top 70%',
          end: 'top 35%',
          scrub: 0.7
        }
      }
    );

    if (!reduceMotion) {
      const media = panel.querySelector('img');
      gsap.fromTo(
        media,
        { scale: 1.12 },
        {
          scale: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: panel,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.1
          }
        }
      );
    }
  });

  const negocios = gsap.utils.toArray('[data-negocio]');
  negocios.forEach((negocio, index) => {
    const content = negocio.querySelector('.negocio-content');
    const map = negocio.querySelector('.negocio-map-wrap');
    const contentFromX = index % 2 === 0 ? -80 : 80;
    const mapFromX = index % 2 === 0 ? 80 : -80;

    if (content) {
      gsap.fromTo(
        content,
        { x: contentFromX, y: 28, autoAlpha: 0 },
        {
          x: 0,
          y: 0,
          autoAlpha: 1,
          duration: 1,
          ease: 'power3.out',
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
      gsap.fromTo(
        map,
        { x: mapFromX, y: 28, autoAlpha: 0 },
        {
          x: 0,
          y: 0,
          autoAlpha: 1,
          duration: 1,
          ease: 'power3.out',
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
      gsap.fromTo(
        map,
        { yPercent: -3 },
        {
          yPercent: 3,
          ease: 'none',
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

      gsap.fromTo(
        media,
        { yPercent: -7 },
        {
          yPercent: 7,
          ease: 'none',
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

  revealItems.forEach((item) => {
    const xOffset = item.classList.contains('from-left') ? -50 : item.classList.contains('from-right') ? 50 : 0;

    gsap.to(item, {
      x: 0,
      y: 0,
      autoAlpha: 1,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: item,
        start: 'top 80%'
      },
      onStart: () => {
        gsap.set(item, { x: xOffset });
      }
    });
  });
});
