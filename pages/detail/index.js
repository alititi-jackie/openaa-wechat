Page({
  data: { item: null },
  onLoad() { this.setData({ item: wx.getStorageSync('openaa_detail') || null }); },
  onShareAppMessage() { return { title: this.data.item ? this.data.item.title : 'OpenAA', path: '/pages/home/index' }; }
});
