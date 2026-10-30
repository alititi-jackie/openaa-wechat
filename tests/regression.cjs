const assert = require('node:assert/strict');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
function page(name) {
  let result;
  global.Page = definition => { result = definition; };
  const file = path.join(root, 'pages', name, 'index.js');
  delete require.cache[require.resolve(file)];
  require(file);
  result.data = structuredClone(result.data);
  result.setData = function (patch) { Object.assign(this.data, patch); };
  return result;
}
const pending = [];
global.wx = { request: options => pending.push(options), stopPullDownRefresh() {}, getStorageSync() {}, removeStorageSync() {} };
function success(request, title) { request.success({ statusCode: 200, data: {state:'ready',data:[{ id: title, title }], pagination:{page:1,pageSize:10,total:1,pageCount:1,hasNext:false,hasPrevious:false}} }); }
(async () => {
  let count = 0;
  const check = async (name, run) => { await run(); console.log('PASS ' + name); count++; };
  await check('channel switch starts new request while old request is pending', async () => {
    const p = page('list'); const old = p.select('jobs'); const current = p.select('housing');
    const a = pending.shift(), b = pending.shift(); assert.ok(b);
    success(b, 'housing'); await current; success(a, 'jobs'); await old;
    assert.equal(p.data.items[0].title, 'housing'); assert.equal(p.data.loading, false);
  });
  await check('obsolete failure does not clear active loading or set error', async () => {
    const p = page('list'); const old = p.select('jobs'); const current = p.select('services');
    const a = pending.shift(), b = pending.shift(); a.fail({errMsg: 'old failure'}); await old;
    assert.equal(p.data.error, ''); assert.equal(p.data.loading, true);
    success(b, 'services'); await current;
  });
  await check('same-channel refresh ignores earlier response and resets pagination', async () => {
    const p = page('list'); const old = p.load(); const refresh = p.onPullDownRefresh();
    const a = pending.shift(), b = pending.shift(); assert.ok(b);
    success(b, 'fresh'); await refresh; success(a, 'stale'); await old;
    assert.deepEqual(p.data.items.map(x => x.title), ['fresh']); assert.equal(p.data.page, 2);
  });
  await check('unloaded list ignores outstanding response', async () => {
    const p = page('list'); const task = p.load(); const req = pending.shift(); p.onUnload();
    success(req, 'late'); await task; assert.equal(p.data.items.length, 0);
  });
  await check('invalid response shapes reject instead of appearing empty', async () => {
    const { fetchChannel } = require('../utils/api');
    for (const data of [null, '<html>error</html>', {error:'failure'}, {state:'ready',data:[null],pagination:{hasNext:false}}]) {
      const task = fetchChannel('jobs'); const rejected = assert.rejects(task, /数据格式异常/);
      pending.shift().success({statusCode:200, data}); await rejected;
    }
    const task = fetchChannel('jobs'); pending.shift().success({statusCode:200,data:{state:'ready',data:[],pagination:{page:1,pageSize:10,total:0,pageCount:1,hasNext:false,hasPrevious:false}}});
    assert.deepEqual(await task, []);
  });
  await check('home refresh ignores stale error', async () => {
    const p = page('home'); const old = p.loadLatest(); const current = p.loadLatest();
    const a = pending.shift(), b = pending.shift(); success(b, 'fresh'); await current;
    a.fail({errMsg:'stale error'}); await old; assert.equal(p.data.error,''); assert.equal(p.data.latest[0].title,'fresh');
  });
  await check('one-shot channel selection does not override manual selection on return', async () => {
    let stored = 'housing'; wx.getStorageSync = () => stored; wx.removeStorageSync = () => {stored = undefined;};
    const p = page('list'); p.onShow(); success(pending.shift(),'housing'); await Promise.resolve();
    const selected = p.select('jobs'); success(pending.shift(),'jobs'); await selected;
    p.onShow(); assert.equal(p.data.active,'jobs'); assert.equal(pending.length,0);
  });
  console.log(`${count} regression checks passed; wx mocked.`);
})().catch(error => { console.error(error); process.exitCode = 1; });

