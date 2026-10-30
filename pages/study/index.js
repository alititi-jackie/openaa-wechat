const bank=require('../../data/ny-questions');
const wrongKey='openaa_dmv_wrong_ids_v1';
function shuffled(items){const copy=items.slice();for(let i=copy.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));const temp=copy[i];copy[i]=copy[j];copy[j]=temp;}return copy;}
function safeWrongIds(){try{const value=wx.getStorageSync(wrongKey);return Array.isArray(value)?value:[];}catch(_){return [];}}
Page({
 data:{title:'逐题练习',items:[],total:0,index:0,current:null,selected:-1,revealed:false,completed:false,correct:0},
 onLoad(params){
  const mode=['practice','mock','signs','wrong'].includes(params.mode)?params.mode:'practice';
  let questions=bank.questions;
  if(params.category)questions=questions.filter(q=>q.category===decodeURIComponent(params.category));
  if(mode==='signs')questions=questions.filter(q=>q.category.includes('sign')||(q.tags||[]).includes('sign'));
  if(mode==='wrong'){const wrong=safeWrongIds();questions=questions.filter(q=>wrong.includes(q.id));}
  if(mode==='mock')questions=shuffled(questions).slice(0,20);
  const titles={practice:'逐题练习',mock:'模拟考试',signs:'交通标志',wrong:'错题复习'};
  this.mode=mode;
  this.setData({title:titles[mode],items:questions,total:questions.length,index:0,current:questions[0]||null,selected:-1,revealed:false,completed:false,correct:0});
  wx.setNavigationBarTitle({title:titles[mode]});
 },
 select(e){
  if(this.data.revealed||!this.data.current)return;
  const selected=Number(e.currentTarget.dataset.index);
  if(!Number.isInteger(selected)||selected<0||selected>=this.data.current.options.length)return;
  const question=this.data.current,correct=selected===question.answerIndex;
  if(!correct){const ids=safeWrongIds();if(!ids.includes(question.id)){ids.push(question.id);try{wx.setStorageSync(wrongKey,ids);}catch(_){}}}
  this.setData({selected,revealed:true,correct:this.data.correct+(correct?1:0)});
 },
 next(){
  if(!this.data.revealed)return;
  const index=this.data.index+1;
  if(index>=this.data.total){this.setData({completed:true,current:null});return;}
  this.setData({index,current:this.data.items[index],selected:-1,revealed:false});
 },
 back(){wx.navigateBack({delta:1});},
 onShareAppMessage(){return {title:'OpenAA 纽约 DMV 中文题库',path:'/pages/dmv/index'};}
});
