const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root,file),'utf8');
const app = JSON.parse(read('app.json'));

for(const page of app.pages){
  for(const ext of ['js','json','wxml','wxss']){
    const file=`${page}.${ext}`;
    assert.ok(fs.existsSync(path.join(root,file)),`missing ${file}`);
    if(ext==='json') JSON.parse(read(file));
  }
}
const styles = read('app.wxss');
const home = read('pages/home/index.wxml');
const list = read('pages/list/index.wxml');
const detail = read('pages/detail/index.wxml');
assert.match(styles,/\.post-thumb/);
assert.match(styles,/\.post-price/);
assert.match(home,/item\.priceDisplay/);
assert.match(home,/post\.priceDisplay/);
assert.match(list,/item\.imageUrl/);
assert.match(list,/activeLabel/);
assert.match(detail,/previewImage/);
assert.match(read('pages/list/index.wxss'),/display: block/);
assert.equal(/pages\/(publish|profile|navigation|dmv|tools)\/index/.test(read('app.json')),false);
console.log('PASS registered page assets, five-channel card fields, horizontal category styles');
