class Router {
  constructor() {
    this.routes = new Map();
    this.currentRoute = null;
    this.prevRoute = null;
    this._onChange = null;

    window.addEventListener('hashchange', () => this.resolve());
  }

  on(pattern, handler) {
    this.routes.set(pattern, handler);
    return this;
  }

  onChange(cb) {
    this._onChange = cb;
    return this;
  }

  navigate(hash) {
    window.location.hash = hash;
  }

  resolve() {
    const hash = window.location.hash.slice(1) || '/';
    const [path, ...rest] = hash.split('?');
    const query = rest.length ? Object.fromEntries(new URLSearchParams(rest.join('?'))) : {};

    let matched = false;
    for (const [pattern, handler] of this.routes) {
      const params = this.match(pattern, path);
      if (params !== null) {
        this.prevRoute = this.currentRoute;
        this.currentRoute = { pattern, path, params, query };
        handler({ path, params, query });
        matched = true;
        if (this._onChange) this._onChange(this.currentRoute, this.prevRoute);
        break;
      }
    }

    if (!matched) {
      const fallback = this.routes.get('/') || this.routes.get('*');
      if (fallback) {
        this.currentRoute = { pattern: '/*', path, params: {}, query };
        fallback({ path, params: {}, query });
        if (this._onChange) this._onChange(this.currentRoute, this.prevRoute);
      }
    }
  }

  match(pattern, path) {
    if (pattern === '*' || pattern === path) return {};
    const patternParts = pattern.split('/');
    const pathParts = path.split('/');
    if (patternParts.length !== pathParts.length) return null;
    const params = {};
    for (let i = 0; i < patternParts.length; i++) {
      if (patternParts[i].startsWith(':')) {
        params[patternParts[i].slice(1)] = pathParts[i];
      } else if (patternParts[i] !== pathParts[i]) {
        return null;
      }
    }
    return params;
  }

  init() {
    this.resolve();
    return this;
  }
}

export default new Router();
