const { CHANNELS, QUICK_LINKS } = require('../../config');
const { fetchChannel, detailPath } = require('../../utils/api');
const { promptWebPublish } = require('../../utils/web-publish');
Page({
  data: { channels: CHANNELS, quickLinks: QUICK_LINKS, latest: [], loading: true, error: '',
    otherSections: [], othersLoading: false },
  onLoad() { this.loadLatest(); this.loadOtherSections(); },
  onPullDownRefresh() { return Promise.all([this.loadLatest(), this.loadOtherSections()]).finally(() => wx.stopPullDownRefresh()); },
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
  loadOtherSections() {
    const generation = this._otherGeneration = (this._otherGeneration || 0) + 1;
    this.setData({ othersLoading: true });
    const channels = CHANNELS.filter(channel => channel.key !== 'jobs');
    return Promise.all(channels.map(channel => fetchChannel(channel.key, 1)
      .then(items => ({ key: channel.key, label: channel.label, items: items.slice(0, 5), error: '' }))
      .catch(error => ({ key: channel.key, label: channel.label, items: [], error: error.message }))
    )).then(sections => {
      if (generation === this._otherGeneration) this.setData({ otherSections: sections, othersLoading: false });
    });
  },
  onUnload() { this._generation = (this._generation || 0) + 1; this._otherGeneration = (this._otherGeneration || 0) + 1; },
  openChannel(e) {
    const key = e.currentTarget.dataset.key;
    wx.setStorageSync('openaa_channel', key);
    wx.switchTab({ url: '/pages/list/index' });
  },
  openShortcut(e) {
    const { key, type } = e.currentTarget.dataset;
    if (type === 'channel') return this.openChannel({ currentTarget: { dataset: {key} } });
    if (key === 'news' && type === 'page') wx.navigateTo({url:'/pages/news/index'});
  },
  promptWebPublish,
  openDetail(e) {
    const item = this.data.latest[e.currentTarget.dataset.index];
    if (!item) return;
    const url = detailPath(item);
    if (url) wx.navigateTo({ url });
  },
  openOtherDetail(e) {
    const section = this.data.otherSections.find(value => value.key === e.currentTarget.dataset.key);
    const item = section && section.items[e.currentTarget.dataset.index];
    const url = detailPath(item);
    if (url) wx.navigateTo({url});
  },
  onShareAppMessage() { return { title: 'OpenAA 美国华人生活平台', path: '/pages/home/index' }; }
});
