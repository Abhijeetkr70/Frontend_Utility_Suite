import store from './store.js';

const THEME_KEY = 'theme';

class ThemeManager {
  constructor() {
    this.current = store.get(THEME_KEY, 'dark');
    this._listeners = [];
  }

  init() {
    this.apply(this.current);
    return this;
  }

  toggle() {
    this.apply(this.current === 'dark' ? 'light' : 'dark');
  }

  apply(theme) {
    this.current = theme;
    document.documentElement.classList.toggle('dark', theme === 'dark');
    store.set(THEME_KEY, theme);
    this._listeners.forEach(fn => fn(theme));
    this.updateToggleUI();
  }

  updateToggleUI() {
    const btn = document.getElementById('theme-toggle');
    if (!btn) return;
    const isDark = this.current === 'dark';
    btn.innerHTML = isDark
      ? '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/></svg>'
      : '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg>';
  }

  listen(fn) {
    this._listeners.push(fn);
  }
}

export default new ThemeManager();
