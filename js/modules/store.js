const PREFIX = 'fe_';

class Store {
  get(key, fallback = null) {
    try {
      const raw = localStorage.getItem(PREFIX + key);
      return raw !== null ? JSON.parse(raw) : fallback;
    } catch {
      console.warn(`Store.get(${key}) failed`);
      return fallback;
    }
  }

  set(key, value) {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value));
      return true;
    } catch {
      console.warn(`Store.set(${key}) failed`);
      return false;
    }
  }

  remove(key) {
    try {
      localStorage.removeItem(PREFIX + key);
      return true;
    } catch {
      return false;
    }
  }
}

export default new Store();
