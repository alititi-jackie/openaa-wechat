const assert = require('node:assert/strict');
const { fetchChannelPage, fetchChannel, POST_TYPES } = require('../utils/api');

const requests = [];
global.wx = { request: options => requests.push(options) };
const response = (items, hasNext = false) => ({ state: 'ready', data: items, pagination: { page: 1, pageSize: 10, total: items.length, pageCount: 1, hasNext, hasPrevious: false } });

(async () => {
  for (const [key, type] of Object.entries(POST_TYPES)) {
    const task = fetchChannelPage(key, 2);
    const request = requests.shift();
    assert.equal(request.url, 'https://openaa.com/api/posts');
    assert.deepEqual(request.data, { type, page: 2, pageSize: 10, view:'list', sort:'latest' });
    request.success({ statusCode: 200, data: response([{ id: 'abc', type, title: '标题', meta: '纽约', description: '正文' }], true) });
    const result = await task;
    assert.equal(result.items[0].subtitle, '纽约');
    assert.equal(result.hasNext, true);
    assert.equal('raw' in result.items[0], false);
  }
  const empty = fetchChannel('jobs');
  requests.shift().success({ statusCode: 200, data: response([]) });
  assert.deepEqual(await empty, []);
  for (const malformed of [null, [], { data: [] }, { state: 'ready', data: [null], pagination: { hasNext: false } }]) {
    const task = fetchChannel('jobs');
    const rejected = assert.rejects(task, /数据格式异常|分页数据异常|暂时不可用/);
    requests.shift().success({ statusCode: 200, data: malformed });
    await rejected;
  }
  assert.equal(requests.length, 0);
  const filtered = fetchChannelPage('housing', 1, {q:'房屋',area:'Brooklyn',min:'500',max:'1000',sort:'price_asc'});
  const req = requests.shift();
  assert.deepEqual(req.data, {type:'housing',page:1,pageSize:10,view:'list',q:'房屋',area:'Brooklyn',min:500,max:1000,sort:'price_asc'});
  req.success({statusCode:200,data:response([])});
  await filtered;
  console.log('PASS API contract: 4 channels, pagination, clean DTO, empty and malformed payloads');
})().catch(error => { console.error(error); process.exitCode = 1; });
