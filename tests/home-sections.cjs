const assert = require('node:assert/strict');
const requests = [];
global.wx = {request: options => requests.push(options)};
let home;
global.Page = definition => {home=definition;};
require('../pages/home/index.js');
home.data = structuredClone(home.data);
home.setData = function (patch) {Object.assign(this.data,patch);};

(async () => {
  const task = home.loadOtherSections();
  assert.equal(requests.length,3);
  const [housing,secondhand,services] = requests.splice(0);
  assert.deepEqual([housing.data.type,secondhand.data.type,services.data.type],['housing','marketplace','service']);
  const result = (type) => ({state:'ready',data:[{id:`${type}-1`,type,title:type}],pagination:{page:1,pageSize:10,hasNext:false}});
  housing.success({statusCode:200,data:result('housing')});
  secondhand.fail({errMsg:'network unavailable'});
  services.success({statusCode:200,data:result('service')});
  await task;
  assert.equal(home.data.otherSections.length,3);
  assert.equal(home.data.otherSections[0].items.length,1);
  assert.match(home.data.otherSections[1].error,/network unavailable/);
  assert.equal(home.data.otherSections[2].items.length,1);
  assert.equal(home.data.othersLoading,false);
  console.log('PASS home loads three additional channels independently');
})().catch(error=>{console.error(error);process.exitCode=1;});
