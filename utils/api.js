const { API_BASE } = require('../config');
const ALLOWED = ['jobs', 'housing', 'secondhand', 'services'];

function normalizeRows(body) {
  if (Array.isArray(body)) return body;
  if (!body || typeof body !== 'object') throw new Error('服务器数据格式异常，请稍后重试');
  for (const key of ['data', 'items', 'results', 'posts', 'list']) {
    if (Array.isArray(body[key])) return body[key];
    if (body[key] && Array.isArray(body[key].items)) return body[key].items;
  }
  throw new Error('服务器数据格式异常，请稍后重试');
}

function fetchChannel(key, page = 1) {
  if (!ALLOWED.includes(key)) return Promise.reject(new Error('不支持的栏目'));
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${API_BASE}/api/${key}`,
      data: { page, pageSize: 10 },
      timeout: 10000,
      success(response) {
        if (response.statusCode < 200 || response.statusCode >= 300) {
          reject(new Error(`服务器返回 ${response.statusCode}`));
          return;
        }
        try {
          const rows = normalizeRows(response.data);
          if (rows.some(item => !item || typeof item !== 'object' || Array.isArray(item))) {
            throw new Error('服务器数据格式异常，请稍后重试');
          }
          resolve(rows.map((item, index) => ({
            id: String(item.id || item.slug || `${page}-${index}`),
            title: String(item.title || item.job_title || item.name || '未命名信息'),
            subtitle: String(item.location || item.city || item.area || item.description || '').slice(0, 90),
            raw: item
          })));
        } catch (error) { reject(error); }
      },
      fail(error) { reject(new Error(error.errMsg || '网络请求失败')); }
    });
  });
}

module.exports = { fetchChannel };
