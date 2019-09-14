/* eslint-env node, mocha */
const assert = require('assert');
const WaitList = require('../');

describe('WaitList', () => {
  let w;
  beforeEach(() => {
    w = new WaitList();
  });

  afterEach(() => {
    w.close();
    w = null;
  });

  it('should wait for single resolution of an id', async () => {
    setTimeout(() => w.resolve('event', 42), 10);

    assert.strictEqual(await w.waitFor('event'), 42);

    // Should cleanup
    assert.strictEqual(w.map.size, 0);
  });

  it('should wait for multiple resolutions of an id', async () => {
    setTimeout(() => w.resolve('event', 42), 10);

    assert.deepStrictEqual(await Promise.all([
      w.waitFor('event'),
      w.waitFor('event'),
    ]), [ 42, 42 ]);

    // Should cleanup
    assert.strictEqual(w.map.size, 0);
  });

  it('should cancel the entry', async () => {
    const entry = w.waitFor('event');
    setTimeout(() => entry.cancel(), 10);

    await assert.rejects(entry, {
      name: 'Error',
      message: 'Cancelled: event',
    });

    // Should cleanup
    assert.strictEqual(w.map.size, 0);
  });

  it('should timeout', async () => {
    const entry = w.waitFor('event', 10);

    await assert.rejects(entry, {
      name: 'Error',
      message: 'Timed out: event',
    });

    // Should cleanup
    assert.strictEqual(w.map.size, 0);
  });

  it('should provide static entries', async () => {
    const entry = WaitList.resolve(42);

    assert.strictEqual(await entry, 42);
  });

  it('should return boolean from resolve()', async () => {
    assert.ok(!w.resolve('event'));

    w.waitFor('event');
    assert.ok(w.resolve('event'));
  });

  it('should fire rejections on WaitList#close', async () => {
    const entry = w.waitFor('event');

    await Promise.all([
      assert.rejects(entry, {
        name: 'Error',
        message: 'Closed in test',
      }),
      w.close(new Error('Closed in test')),
    ]);

    assert.throws(() => {
      w.waitFor('something');
    }, {
      name: 'Error',
      message: 'WaitList already closed',
    });
  });
});
