const { fetchNewsDetail } = require('../../utils/api');
Page({
  data:{ article:null,loading:true,error:'' },
  onLoad(options){this._slug=options.slug||'';this.loadArticle();},
  loadArticle(){
    const generation=this._generation=(this._generation||0)+1;
    this.setData({loading:true,error:'',article:null});
    return fetchNewsDetail(this._slug).then(article=>{
      if(generation===this._generation)this.setData({article,loading:false});
    }).catch(error=>{
      if(generation===this._generation)this.setData({error:error.message,loading:false});
    });
  },
  onPullDownRefresh(){return this.loadArticle().finally(()=>wx.stopPullDownRefresh());},
  onUnload(){this._generation=(this._generation||0)+1;},
  onShareAppMessage(){return {title:this.data.article?this.data.article.title:'OpenAA 华人新闻',path:`/pages/news-detail/index?slug=${encodeURIComponent(this._slug||'')}`};}
});
