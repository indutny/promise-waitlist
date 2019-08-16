/* eslint-env node, mocha */
const assert = require('assert');
const WaitList = require('../');

describe('WaitList', () => {
  it('should wait for resolution of an id', async () => {
    const w = new WaitList();

    setTimeout(() => w.resolve('event', 42), 10);

    assert.strictEqual(await w.waitFor('event').promise, 42);
  });

  it('should cancel the entry', async () => {
    const w = new WaitList();

    const entry = w.waitFor('event');
    setTimeout(() => entry.cancel(), 10);

    await assert.rejects(entry.promise, {
      name: 'Error',
      message: 'Cancelled',
    });
  });

  it('should timeout', async () => {
    const w = new WaitList();

    const entry = w.waitFor('event', 10);

    await assert.rejects(entry.promise, {
      name: 'Error',
      message: 'Timed out',
    });
  });

  it('should provide static entries', async () => {
    const entry = WaitList.resolve(42);

    assert.strictEqual(await entry.promise, 42);
  });
});
