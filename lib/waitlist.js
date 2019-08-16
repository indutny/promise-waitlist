module.exports = class WaitList {
  constructor() {
    this.map = new Map();
  }

  waitFor(id, timeout) {
    let elem;
    let timer;

    const cleanup = () => {
      if (timer) {
        clearTimeout(timer);
      }
      this.map.delete(id);
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

    this.map.set(id, elem);

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
      return;
    }

    this.map.get(id).resolve(result);
  }

  static resolve(value) {
    return { promise: Promise.resolve(value), cancel() {} };
  }
}
