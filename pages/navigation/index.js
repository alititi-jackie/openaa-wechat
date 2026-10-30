const { fetchNavigation } = require('../../utils/api');
Page({
  data:{ categories:[{slug:'',name:'全部'}], active:'', links:[], visible:[],loading:true,error:'' },
  onLoad(){this.loadNavigation();},
  loadNavigation(){
    const generation=this._generation=(this._generation||0)+1;
    this.setData({loading:true,error:''});
    return fetchNavigation().then(data=>{
      if(generation!==this._generation)return;
      this.setData({categories:[{slug:'',name:'全部'},...data.categories],links:data.links,loading:false});
      this.filterLinks();
    }).catch(error=>{
      if(generation===this._generation)this.setData({loading:false,error:error.message});
    });
  },
  chooseCategory(e){this.setData({active:e.currentTarget.dataset.slug||''});this.filterLinks();},
  filterLinks(){this.setData({visible:this.data.links.filter(link=>!this.data.active||link.categorySlug===this.data.active)});},
  copyLink(e){
    const item=this.data.visible[e.currentTarget.dataset.index];
    if(!item)return;
    wx.setClipboardData({data:item.url,success(){wx.showToast({title:'网址已复制',icon:'success'});},fail(){wx.showToast({title:'复制失败',icon:'none'});}});
  },
  onPullDownRefresh(){return this.loadNavigation().finally(()=>wx.stopPullDownRefresh());},
  onUnload(){this._generation=(this._generation||0)+1;},
  onShareAppMessage(){return {title:'OpenAA 华人导航',path:'/pages/navigation/index'};}
});
