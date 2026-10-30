const { CHANNELS } = require('../../config');
const { fetchChannelPage, detailPath } = require('../../utils/api');
const { promptWebPublish } = require('../../utils/web-publish');
Page({
  data: {
    channels: CHANNELS, active: 'jobs', items: [], page: 1, loading: false, finished: false, error: '',
    draft: { q: '', area: '', min: '', max: '' }, applied: {},
    sortIndex: 0, sortOptions: ['最新优先', '最早发布', '价格/薪资低到高', '价格/薪资高到低'],
    filtersOpen: false
  },
  onShow() {
    const pending = wx.getStorageSync('openaa_channel');
    if (pending) wx.removeStorageSync('openaa_channel');
    const key = pending || this.data.active;
    if (key !== this.data.active || !this.data.items.length) this.select(key);
  },
  select(key) {
    if (!CHANNELS.some(x => x.key === key)) key = 'jobs';
    if (key !== this.data.active) this.setData({ draft: { q: '', area: '', min: '', max: '' }, applied: {}, sortIndex: 0,
      sortOptions: key === 'services' ? ['最新优先', '最早发布'] : ['最新优先', '最早发布', '价格/薪资低到高', '价格/薪资高到低'] });
    this._generation = (this._generation || 0) + 1;
    this.setData({ active: key, items: [], page: 1, loading: false, finished: false, error: '' });
    return this.load();
  },
  choose(e) { this.select(e.currentTarget.dataset.key); },
  toggleFilters() { this.setData({ filtersOpen: !this.data.filtersOpen }); },
  changeKeyword(e) { this.setData({ 'draft.q': e.detail.value }); },
  changeArea(e) { this.setData({ 'draft.area': e.detail.value }); },
  changeMin(e) { this.setData({ 'draft.min': e.detail.value }); },
  changeMax(e) { this.setData({ 'draft.max': e.detail.value }); },
  changeSort(e) { this.setData({ sortIndex: Number(e.detail.value) || 0 }); },
  applyFilters() {
    const sorts = ['latest', 'oldest', 'price_asc', 'price_desc'];
    this.setData({ applied: { ...this.data.draft, sort: sorts[this.data.sortIndex] } });
    return this.select(this.data.active);
  },
  resetFilters() {
    this.setData({ draft: { q: '', area: '', min: '', max: '' }, applied: {}, sortIndex: 0 });
    return this.select(this.data.active);
  },
  load() {
    if (this.data.loading || this.data.finished) return Promise.resolve();
    const generation = this._generation || 0;
    const channel = this.data.active;
    const page = this.data.page;
    this.setData({ loading: true, error: '' });
    return fetchChannelPage(channel, page, this.data.applied).then(result => {
      if (generation !== (this._generation || 0)) return;
      this.setData({ items: this.data.items.concat(result.items), page: page + 1, finished: !result.hasNext, loading: false });
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
    const url = detailPath(item);
    if (url) wx.navigateTo({ url });
  },
  promptWebPublish,
  onShareAppMessage() { return { title: 'OpenAA 生活分类', path: '/pages/list/index' }; }
});
