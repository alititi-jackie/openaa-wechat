const { fetchNews } = require('../../utils/api');
Page({
  data: { categories: [{slug:'',name:'全部'}], active:'', posts:[], loading:true, error:'' },
  onLoad() { this.loadNews(); },
  loadNews() {
    const generation = this._generation = (this._generation || 0) + 1;
    this.setData({loading:true,error:'',posts:[]});
    return fetchNews(this.data.active).then(result=>{
      if (generation!==this._generation) return;
      this.setData({categories:[{slug:'',name:'全部'},...result.categories],posts:result.posts,loading:false});
    }).catch(error=>{
      if (generation===this._generation) this.setData({loading:false,error:error.message});
    });
  },
  chooseCategory(e) {
    const slug = e.currentTarget.dataset.slug || '';
    if (slug===this.data.active) return;
    this.setData({active:slug});
    return this.loadNews();
  },
  openArticle(e) {
    const item = this.data.posts[e.currentTarget.dataset.index];
    if (item) wx.navigateTo({url:`/pages/news-detail/index?slug=${encodeURIComponent(item.slug)}`});
  },
  onPullDownRefresh() {return this.loadNews().finally(()=>wx.stopPullDownRefresh());},
  onUnload(){this._generation=(this._generation||0)+1;},
  onShareAppMessage(){return {title:'OpenAA 华人新闻资讯',path:'/pages/news/index'};}
});
