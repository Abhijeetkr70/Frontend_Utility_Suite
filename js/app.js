import router from './modules/router.js';
import theme from './modules/theme.js';
import toast from './modules/toast.js';
import { renderDashboard } from './modules/dashboard.js';
import { renderTaskManager } from './modules/tasks.js';
import { renderWeatherDashboard } from './modules/weather.js';
import { renderQuizPlatform, cleanupQuiz } from './modules/quiz.js';

function init() {
  theme.init();

  setupSidebar();
  setupMobileMenu();
  setupThemeToggle();

  router
    .on('/', () => { setActiveNav('dashboard'); renderDashboard(); })
    .on('/tasks', () => { setActiveNav('tasks'); renderTaskManager(); })
    .on('/weather', () => { setActiveNav('weather'); renderWeatherDashboard(); })
    .on('/quiz', () => { setActiveNav('quiz'); renderQuizPlatform(); })
    .onChange(() => { closeMobileMenu(); cleanupQuiz(); })
    .init();

  if (!window.location.hash) {
    router.navigate('/');
  }
}

function setupSidebar() {
  document.getElementById('sidebar')?.addEventListener('click', (e) => {
    const link = e.target.closest('[data-nav]');
    if (!link) return;
    const route = link.dataset.nav;
    const routes = {
      dashboard: '/',
      tasks: '/tasks',
      weather: '/weather',
      quiz: '/quiz'
    };
    if (routes[route]) {
      router.navigate(routes[route]);
    }
  });
}

function setActiveNav(active) {
  document.querySelectorAll('[data-nav]').forEach(el => {
    const isActive = el.dataset.nav === active;
    el.classList.toggle('nav-active', isActive);
    el.classList.toggle('nav-inactive', !isActive);
  });
}

function setupMobileMenu() {
  const btn = document.getElementById('mobile-menu-btn');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');

  btn?.addEventListener('click', () => {
    sidebar?.classList.toggle('open');
    overlay?.classList.toggle('open');
    document.body.classList.toggle('overflow-hidden');
  });

  overlay?.addEventListener('click', () => {
    sidebar?.classList.remove('open');
    overlay?.classList.remove('open');
    document.body.classList.remove('overflow-hidden');
  });
}

function closeMobileMenu() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  sidebar?.classList.remove('open');
  overlay?.classList.remove('open');
  document.body.classList.remove('overflow-hidden');
}

function setupThemeToggle() {
  const btn = document.getElementById('theme-toggle');
  btn?.addEventListener('click', () => theme.toggle());
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
