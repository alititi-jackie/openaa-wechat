const { CHANNELS } = require('../../config');
const { fetchChannel } = require('../../utils/api');
Page({
  data: { channels: CHANNELS, active: 'jobs', items: [], page: 1, loading: false, finished: false, error: '' },
  onShow() {
    const pending = wx.getStorageSync('openaa_channel');
    if (pending) wx.removeStorageSync('openaa_channel');
    const key = pending || this.data.active;
    if (key !== this.data.active || !this.data.items.length) this.select(key);
  },
  select(key) {
    if (!CHANNELS.some(x => x.key === key)) key = 'jobs';
    this._generation = (this._generation || 0) + 1;
    this.setData({ active: key, items: [], page: 1, loading: false, finished: false, error: '' });
    return this.load();
  },
  choose(e) { this.select(e.currentTarget.dataset.key); },
  load() {
    if (this.data.loading || this.data.finished) return Promise.resolve();
    const generation = this._generation || 0;
    const channel = this.data.active;
    const page = this.data.page;
    this.setData({ loading: true, error: '' });
    return fetchChannel(channel, page).then(rows => {
      if (generation !== (this._generation || 0)) return;
      this.setData({ items: this.data.items.concat(rows), page: page + 1, finished: rows.length < 10, loading: false });
    }).catch(err => {
      if (generation !== (this._generation || 0)) return;
      this.setData({ loading: false, error: err.message });
    });
  },
  onReachBottom() { this.load(); },
  onPullDownRefresh() {
    return this.select(this.data.active).finally(() => wx.stopPullDownRefresh());
  },
  onUnload() { this._generation = (this._generation || 0) + 1; },
  openDetail(e) {
    const item = this.data.items[e.currentTarget.dataset.index];
    if (!item) return;
    wx.setStorageSync('openaa_detail', item);
    wx.navigateTo({ url: '/pages/detail/index' });
  },
  onShareAppMessage() { return { title: 'OpenAA 生活分类', path: '/pages/list/index' }; }
});
