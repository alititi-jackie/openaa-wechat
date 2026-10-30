const { CHANNELS } = require('../../config');
Page({
  data: { channels: CHANNELS },
  choose(e) { wx.showModal({title:'发布功能开发中',content:'此入口将与 OpenAA 主站共用账号和发布审核系统。当前预览版本暂不提交真实信息。',showCancel:false}); }
});
