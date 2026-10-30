const bank=require('../../data/ny-questions');
const labels={'traffic-signs':'交通标志','road-signs-general':'道路标志','traffic-control':'交通信号','alcohol-drugs':'酒精与药物','highway':'高速公路','law':'交通法规','parking':'停车规则','passing-lanes':'超车与车道','right-of-way':'通行优先权','safety':'安全驾驶','sharing-road':'共享道路','speed-weather':'车速与天气','turns':'转弯规则'};
const categories=[...new Set(bank.questions.map(q=>q.category))].map(key=>({key,label:labels[key]||key,count:bank.questions.filter(q=>q.category===key).length}));
Page({
 data:{count:bank.questions.length,categories,version:bank.version},
 openPractice(){wx.navigateTo({url:'/pages/study/index?mode=practice'});},
 openCategory(e){wx.navigateTo({url:'/pages/study/index?mode=practice&category='+encodeURIComponent(e.currentTarget.dataset.key)});},
 onShareAppMessage(){return {title:'纽约 DMV 中文驾考题库｜OpenAA',path:'/pages/dmv/index'};}
});
