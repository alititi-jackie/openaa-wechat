const { CHANNELS, QUICK_LINKS } = require('../../config');
const { fetchChannel } = require('../../utils/api');
Page({
  data: { channels: CHANNELS, quickLinks: QUICK_LINKS, latest: [], loading: true, error: '' },
  onLoad() { this.loadLatest(); },
  onPullDownRefresh() { this.loadLatest().finally(() => wx.stopPullDownRefresh()); },
  loadLatest() {
    const generation = this._generation = (this._generation || 0) + 1;
    this.setData({ loading: true, error: '' });
    return fetchChannel('jobs', 1).then(rows => {
      if (generation !== this._generation) return;
      this.setData({ latest: rows.slice(0, 5), loading: false });
    }).catch(err => {
      if (generation === this._generation) this.setData({ error: err.message, loading: false });
    });
  },
  onUnload() { this._generation = (this._generation || 0) + 1; },
  openChannel(e) {
    const key = e.currentTarget.dataset.key;
    wx.setStorageSync('openaa_channel', key);
    wx.switchTab({ url: '/pages/list/index' });
  },
  openShortcut(e) {
    const { key, type } = e.currentTarget.dataset;
    if (type === 'channel') return this.openChannel({ currentTarget: { dataset: {key} } });
    if (type === 'tab') return wx.switchTab({url:'/pages/publish/index'});
    if (['news','navigation','dmv'].includes(key)) wx.navigateTo({url:`/pages/${key}/index`});
  },
  openDetail(e) {
    const item = this.data.latest[e.currentTarget.dataset.index];
    if (!item) return;
    wx.setStorageSync('openaa_detail', item);
    wx.navigateTo({ url: '/pages/detail/index' });
  },
  onShareAppMessage() { return { title: 'OpenAA 美国华人生活平台', path: '/pages/home/index' }; }
});
