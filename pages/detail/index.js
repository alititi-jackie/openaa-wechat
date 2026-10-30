const { fetchPostDetail, detailPath } = require('../../utils/api');
Page({
  data: { item: null, loading: true, error: '' },
  onLoad(options) {
    this._id = options.id || '';
    this._type = options.type || '';
    this.loadDetail();
  },
  loadDetail() {
    const generation = this._generation = (this._generation || 0) + 1;
    this.setData({ loading: true, error: '', item: null });
    return fetchPostDetail(this._id, this._type).then(item => {
      if (generation === this._generation) this.setData({ item, loading: false });
    }).catch(error => {
      if (generation === this._generation) this.setData({ error: error.message, loading: false });
    });
  },
  onPullDownRefresh() { return this.loadDetail().finally(() => wx.stopPullDownRefresh()); },
  onUnload() { this._generation = (this._generation || 0) + 1; },
  previewImage(e) {
    const item = this.data.item;
    if (!item) return;
    wx.previewImage({ current: e.currentTarget.dataset.url, urls: item.images.map(image => image.url) });
  },
  onShareAppMessage() {
    const item = this.data.item;
    const path = detailPath(item || { id: this._id, type: this._type });
    return { title: item ? item.title : 'OpenAA 美国华人生活平台', path: path || '/pages/home/index' };
  }
});
