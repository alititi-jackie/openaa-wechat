Page({
  data: { fahrenheit: '', celsius: '', miles: '', kilometers: '' },
  onF(e) {
    const v = e.detail.value;
    this.setData({ fahrenheit: v, celsius: v === '' || !Number.isFinite(Number(v)) ? '' : ((Number(v) - 32) * 5 / 9).toFixed(1) });
  },
  onM(e) {
    const v = e.detail.value;
    this.setData({ miles: v, kilometers: v === '' || !Number.isFinite(Number(v)) ? '' : (Number(v) * 1.609344).toFixed(2) });
  },
  onShareAppMessage() { return { title: 'OpenAA 美国生活实用工具', path: '/pages/tools/index' }; }
});
