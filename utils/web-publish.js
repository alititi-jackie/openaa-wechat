const PUBLISH_SITE = 'https://openaa.com';

function promptWebPublish() {
  wx.showModal({
    title: '前往网页版发布',
    content: '小程序仅提供信息浏览。发布招聘、房屋、二手或本地服务，请复制 OpenAA.com 网址并在浏览器打开，登录后发布。',
    confirmText: '复制网址',
    cancelText: '暂不发布',
    success(result) {
      if (!result.confirm) return;
      wx.setClipboardData({
        data: PUBLISH_SITE,
        success() { wx.showToast({title:'网址已复制',icon:'success'}); },
        fail() { wx.showToast({title:'复制失败',icon:'none'}); }
      });
    }
  });
}

module.exports = { promptWebPublish, PUBLISH_SITE };
