const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const app=JSON.parse(fs.readFileSync(path.join(root,'app.json'),'utf8'));
const {QUICK_LINKS}=require('../config');
const {promptWebPublish,PUBLISH_SITE}=require('../utils/web-publish');

assert.deepEqual(app.tabBar.list.map(item=>item.text),['首页','分类']);
assert.deepEqual(QUICK_LINKS.map(item=>item.key),['jobs','housing','secondhand','services','news']);
assert.ok(app.pages.includes('pages/news-detail/index'));
for(const blocked of ['pages/publish/index','pages/profile/index','pages/navigation/index','pages/dmv/index']){
  assert.equal(app.pages.includes(blocked),false);
}
let modal,clipboard,toast;
global.wx={showModal:options=>modal=options,setClipboardData:options=>{clipboard=options.data;options.success();},showToast:options=>toast=options.title};
promptWebPublish();
assert.match(modal.content,/浏览|查看/);
assert.match(modal.content,/浏览|发布/);
assert.equal(clipboard,undefined);
modal.success({confirm:false});
assert.equal(clipboard,undefined);
modal.success({confirm:true});
assert.equal(clipboard,PUBLISH_SITE);
assert.equal(toast,'网址已复制');
console.log('PASS five read-only channels, removed write/account tabs, copy-only publish CTA');
