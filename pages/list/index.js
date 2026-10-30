const { CHANNELS } = require('../../config');
const { fetchChannel } = require('../../utils/api');
Page({
  data: { channels: CHANNELS, active: 'jobs', items: [], page: 1, loading: false, finished: false, error: '' },
  onShow() {
    const key = wx.getStorageSync('openaa_channel') || this.data.active;
    if (key !== this.data.active || !this.data.items.length) this.select(key);
  },
  select(key) {
    if (!CHANNELS.some(x => x.key === key)) key = 'jobs';
    this.setData({ active: key, items: [], page: 1, finished: false, error: '' });
    this.load();
  },
  choose(e) { this.select(e.currentTarget.dataset.key); },
  load() {
    if (this.data.loading || this.data.finished) return Promise.resolve();
    const channel = this.data.active;
    const page = this.data.page;
    this.setData({ loading: true, error: '' });
    return fetchChannel(channel, page).then(rows => {
      if (channel !== this.data.active) return;
      this.setData({ items: this.data.items.concat(rows), page: page + 1, finished: rows.length < 10, loading: false });
    }).catch(err => this.setData({ loading: false, error: err.message }));
  },
  onReachBottom() { this.load(); },
  onPullDownRefresh() {
    this.setData({ items: [], page: 1, finished: false });
    this.load().finally(() => wx.stopPullDownRefresh());
  },
  openDetail(e) {
    wx.setStorageSync('openaa_detail', this.data.items[e.currentTarget.dataset.index]);
    wx.navigateTo({ url: '/pages/detail/index' });
  },
  onShareAppMessage() { return { title: 'OpenAA 生活分类', path: '/pages/list/index' }; }
});
