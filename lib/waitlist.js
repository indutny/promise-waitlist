module.exports = class WaitList {
  constructor() {
    this.map = new Map();
  }

  waitFor(id, timeout) {
    let elem;
    let timer;

    let set;
    if (this.map.has(id)) {
      set = this.map.get(id);
    } else {
      set = new Set();
      this.map.set(id, set);
    }

    const cleanup = () => {
      if (timer) {
        clearTimeout(timer);
      }
      set.delete(elem);
      if (set.size === 0) {
        this.map.delete(id, set);
      }
    };

    const promise = new Promise((resolve, reject) => {
      elem = {
        resolve: (result) => {
          cleanup();
          resolve(result);
        },
        reject: (error) => {
          cleanup();
          reject(error);
        }
      };
    });

    const cancel = (err) => {
      if (!this.map.has(id)) {
        // Already resolved can\'t cancel
        return;
      }

      elem.reject(err || new Error('Cancelled'));
    };

    set.add(elem);

    if (timeout) {
      timer = setTimeout(() => {
        cancel(new Error('Timed out'));
      }, timeout);
    }

    return {
      promise,
      cancel,
    };
  }

  resolve(id, result) {
    if (!this.map.has(id)) {
      return false;
    }

    const set = this.map.get(id);
    this.map.delete(id);

    for (const elem of set) {
      elem.resolve(result);
    }
    return true;
  }

  static resolve(value) {
    return { promise: Promise.resolve(value), cancel() {} };
  }
}
