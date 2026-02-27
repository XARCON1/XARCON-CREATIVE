document.addEventListener('DOMContentLoaded', () => {
  const header = document.getElementById('siteHeader');
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');

  const handleHeaderState = () => {
    if (!header) {
      return;
    }

    header.classList.toggle('scrolled', window.scrollY > 50);
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

  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  const sections = gsap.utils.toArray('[data-section]');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  sections.forEach((section, index) => {
    const left = section.querySelector('.content-left');
    const right = section.querySelector('.content-right');
    const video = section.querySelector('.section-video');

    gsap.set([left, right], { autoAlpha: index === 0 ? 1 : 0, y: index === 0 ? 0 : 55 });

    if (!reduceMotion) {
      gsap.fromTo(
        video,
        { scale: 1.08 },
        {
          scale: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.2
          }
        }
      );
    }

    ScrollTrigger.create({
      trigger: section,
      start: 'top 60%',
      end: 'bottom 40%',
      onEnter: () => animateSection(section, 'down'),
      onEnterBack: () => animateSection(section, 'up'),
      onLeave: () => fadeSection(section, 'down'),
      onLeaveBack: () => fadeSection(section, 'up')
    });
  });

  function animateSection(section, direction) {
    const left = section.querySelector('.content-left');
    const right = section.querySelector('.content-right');
    const fromY = direction === 'down' ? 56 : -56;

    gsap.timeline({ defaults: { duration: 0.9, ease: 'power3.out' } })
      .fromTo(left, { autoAlpha: 0, y: fromY }, { autoAlpha: 1, y: 0 }, 0)
      .fromTo(right, { autoAlpha: 0, y: fromY * 0.75 }, { autoAlpha: 1, y: 0 }, 0.1);
  }

  function fadeSection(section, direction) {
    const left = section.querySelector('.content-left');
    const right = section.querySelector('.content-right');
    const toY = direction === 'down' ? -42 : 42;

    gsap.to([left, right], {
      autoAlpha: 0,
      y: toY,
      duration: 0.65,
      ease: 'power2.out',
      overwrite: 'auto'
    });
  }
});
