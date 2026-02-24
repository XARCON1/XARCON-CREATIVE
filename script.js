const themeSwitch = document.querySelector('#theme-switch');
const themeText = document.querySelector('.theme-text');
const THEME_KEY = 'xarcon-theme';

function applyTheme(theme) {
  const current = theme === 'light' ? 'light' : 'dark';
  document.body.setAttribute('data-theme', current);
  if (themeText) themeText.textContent = current === 'dark' ? 'Modo claro' : 'Modo oscuro';
}

applyTheme(localStorage.getItem(THEME_KEY) || 'dark');

themeSwitch?.addEventListener('click', () => {
  const next = document.body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  localStorage.setItem(THEME_KEY, next);
});

const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
menuToggle?.addEventListener('click', () => nav?.classList.toggle('open'));
document.querySelectorAll('.nav a').forEach((link) => {
  link.addEventListener('click', () => nav?.classList.remove('open'));
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  },
  { threshold: 0.2 }
);

document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

function animateCounter(node) {
  const target = parseFloat(node.dataset.target || '0');
  const decimals = parseInt(node.dataset.decimals || '0', 10);
  const suffix = node.dataset.suffix || '';
  const prefix = node.dataset.prefix || '';
  const duration = 1300;
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const value = target * progress;
    node.textContent = `${prefix}${value.toFixed(decimals)}${suffix}`;
    if (progress < 1) requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

const counterObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      animateCounter(entry.target);
      observer.unobserve(entry.target);
    });
  },
  { threshold: 0.5 }
);

document.querySelectorAll('.counter').forEach((counter) => counterObserver.observe(counter));

const slides = document.querySelectorAll('.testimonial-card');
let currentSlide = 0;

function showSlide(index) {
  slides.forEach((slide, i) => slide.classList.toggle('is-active', i === index));
  currentSlide = index;
}

function nextSlide(step = 1) {
  const next = (currentSlide + step + slides.length) % slides.length;
  showSlide(next);
}

document.querySelectorAll('[data-slide]').forEach((button) => {
  button.addEventListener('click', () => {
    nextSlide(button.dataset.slide === 'next' ? 1 : -1);
  });
});

if (slides.length > 0) {
  showSlide(0);
  setInterval(() => nextSlide(1), 6000);
}

const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();
