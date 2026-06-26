class Modal {
  constructor() {
    this.overlay = null;
    this.isOpen = false;
    this._onClose = null;
    this.build();
  }

  build() {
    this.overlay = document.createElement('div');
    this.overlay.id = 'modal-overlay';
    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) this.close();
    });
    document.body.appendChild(this.overlay);
  }

  open(html, options = {}) {
    const { title = '', onClose, width = 'max-w-lg' } = options;

    this.overlay.innerHTML = `
      <div class="modal-panel bg-white dark:bg-slate-800 rounded-2xl shadow-2xl ${width} w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300">
        <div class="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-700">
          <h3 class="text-lg font-bold text-slate-900 dark:text-white">${title}</h3>
          <button class="close-modal p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        <div class="p-5">${html}</div>
      </div>
    `;

    const panel = this.overlay.querySelector('.modal-panel');
    this.overlay.querySelector('.close-modal').addEventListener('click', () => this.close());

    this._escapeHandler = (e) => { if (e.key === 'Escape') this.close(); };
    document.addEventListener('keydown', this._escapeHandler);

    requestAnimationFrame(() => {
      this.overlay.classList.add('active');
      panel.classList.add('active');
    });

    this.isOpen = true;
    this._onClose = onClose;
  }

  close() {
    if (!this.isOpen) return;
    const panel = this.overlay.querySelector('.modal-panel');
    this.overlay.classList.remove('active');
    if (panel) panel.classList.remove('active');
    setTimeout(() => {
      this.overlay.innerHTML = '';
      this.isOpen = false;
      if (this._onClose) this._onClose();
    }, 300);
    document.removeEventListener('keydown', this._escapeHandler);
  }

  setContent(html) {
    const body = this.overlay.querySelector('.p-5');
    if (body) body.innerHTML = html;
  }
}

export default new Modal();
