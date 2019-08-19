/* eslint-env node, mocha */
const assert = require('assert');
const WaitList = require('../');

describe('WaitList', () => {
  it('should wait for single resolution of an id', async () => {
    const w = new WaitList();

    setTimeout(() => w.resolve('event', 42), 10);

    assert.strictEqual(await w.waitFor('event').promise, 42);

    // Should cleanup
    assert.strictEqual(w.map.size, 0);
  });

  it('should wait for multiple resolutions of an id', async () => {
    const w = new WaitList();

    setTimeout(() => w.resolve('event', 42), 10);

    assert.deepStrictEqual(await Promise.all([
      w.waitFor('event').promise,
      w.waitFor('event').promise,
    ]), [ 42, 42 ]);

    // Should cleanup
    assert.strictEqual(w.map.size, 0);
  });

  it('should cancel the entry', async () => {
    const w = new WaitList();

    const entry = w.waitFor('event');
    setTimeout(() => entry.cancel(), 10);

    await assert.rejects(entry.promise, {
      name: 'Error',
      message: 'Cancelled',
    });

    // Should cleanup
    assert.strictEqual(w.map.size, 0);
  });

  it('should timeout', async () => {
    const w = new WaitList();

    const entry = w.waitFor('event', 10);

    await assert.rejects(entry.promise, {
      name: 'Error',
      message: 'Timed out',
    });

    // Should cleanup
    assert.strictEqual(w.map.size, 0);
  });

  it('should provide static entries', async () => {
    const entry = WaitList.resolve(42);

    assert.strictEqual(await entry.promise, 42);
  });

  it('should return boolean from resolve()', async () => {
    const w = new WaitList();
    assert.ok(!w.resolve('event'));

    w.waitFor('event');
    assert.ok(w.resolve('event'));
  });
});
