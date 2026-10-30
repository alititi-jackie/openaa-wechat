const assert=require('node:assert/strict');
const {fetchNews,fetchNewsDetail,fetchNavigation}=require('../utils/api');
const pending=[];
global.wx={request:options=>pending.push(options),stopPullDownRefresh(){},setClipboardData(){},showToast(){}};
function page(name){let result;global.Page=definition=>{result=definition;};const file=require.resolve(`../pages/${name}/index.js`);delete require.cache[file];require(file);result.data=structuredClone(result.data);result.setData=function(patch){Object.assign(this.data,patch);};return result;}
const list={state:'ready',data:{categories:[{slug:'local',name:'本地新闻'}],posts:[{slug:'new-york',title:'纽约新闻',excerpt:'摘要'}]}};
const navigation={state:'ready',data:{categories:[{slug:'gov',name:'政府'}],links:[{id:'n1',title:'政府网站',url:'https://example.org',categorySlug:'gov'}]}};
(async()=>{
  let p=fetchNews('local');let request=pending.shift();assert.equal(request.url,'https://openaa.com/api/mini/news');assert.equal(request.data.category,'local');request.success({statusCode:200,data:list});assert.equal((await p).posts[0].slug,'new-york');
  p=fetchNewsDetail('new-york');request=pending.shift();request.success({statusCode:200,data:{state:'ready',data:{slug:'new-york',title:'纽约新闻',body:'正文'}}});assert.equal((await p).body,'正文');
  p=fetchNavigation();request=pending.shift();request.success({statusCode:200,data:navigation});assert.equal((await p).links[0].title,'政府网站');
  await assert.rejects(fetchNewsDetail('../bad'),/无效/);
  const news=page('news');const old=news.loadNews();news.setData({active:'local'});const current=news.loadNews();const first=pending.shift(),second=pending.shift();second.success({statusCode:200,data:list});await current;first.fail({errMsg:'old failed'});await old;assert.equal(news.data.error,'');assert.equal(news.data.posts[0].title,'纽约新闻');
  const detail=page('news-detail');detail.onLoad({slug:'new-york'});assert.equal(detail.onShareAppMessage().path,'/pages/news-detail/index?slug=new-york');pending.shift().success({statusCode:200,data:{state:'ready',data:{slug:'new-york',title:'新标题',body:'正文'}}});await new Promise(resolve=>setImmediate(resolve));assert.equal(detail.onShareAppMessage().title,'新标题');
  const nav=page('navigation');const task=nav.loadNavigation();pending.shift().success({statusCode:200,data:navigation});await task;assert.equal(nav.data.visible.length,1);nav.setData({active:'missing'});nav.filterLinks();assert.equal(nav.data.visible.length,0);
  console.log('PASS news/navigation API adapters, stale requests, cold share and category filtering');
})().catch(error=>{console.error(error);process.exitCode=1;});
