Page({
  data:{features:[
    {mode:'practice',title:'逐题练习',desc:'按题学习，查看解析',icon:'📖'},
    {mode:'mock',title:'模拟考试',desc:'随机20题测验',icon:'📝'},
    {mode:'signs',title:'交通标志',desc:'重点认识道路标志',icon:'🚦'},
    {mode:'wrong',title:'错题复习',desc:'集中复习错题',icon:'🔁'}
  ]},
  openFeature(e){const mode=e.currentTarget.dataset.mode;if(['practice','mock','signs','wrong'].includes(mode))wx.navigateTo({url:'/pages/study/index?mode='+mode});},
  openBank(){wx.switchTab({url:'/pages/dmv/index'});},
  onShareAppMessage(){return {title:'OpenAA 美国驾考｜纽约 DMV 中文练习',path:'/pages/home/index'};}
});
