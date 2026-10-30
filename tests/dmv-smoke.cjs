const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.join(__dirname,'..');
const app=JSON.parse(fs.readFileSync(path.join(root,'app.json'),'utf8'));
const bank=require('../data/ny-questions');
assert.equal(bank.questions.length,150);
assert.deepEqual(app.pages,['pages/home/index','pages/dmv/index','pages/study/index']);
for(const page of app.pages){for(const ext of ['js','wxml','wxss','json']){assert.ok(fs.existsSync(path.join(root,page+'.'+ext)),`${page}.${ext} missing`);}}
for(const q of bank.questions){assert.equal(q.options.length>=2,true);assert.ok(Number.isInteger(q.answerIndex)&&q.answerIndex>=0&&q.answerIndex<q.options.length);assert.ok(q.question.length>0);}
assert.ok(!app.pages.some(x=>/list|news|publish|profile|detail/.test(x)));
console.log('DMV smoke passed: '+bank.questions.length+' questions, '+app.pages.length+' pages');
