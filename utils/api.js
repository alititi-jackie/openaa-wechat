const { API_BASE } = require('../config');
const POST_TYPES = { jobs: 'job', housing: 'housing', secondhand: 'marketplace', services: 'service' };

function normalizeRows(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body) || !Array.isArray(body.data)) throw new Error('服务器数据格式异常，请稍后重试');
  if (body.state !== 'ready') throw new Error(body.error || '内容暂时不可用');
  if (!body.pagination || typeof body.pagination.hasNext !== 'boolean') throw new Error('服务器分页数据异常，请稍后重试');
  if (body.data.some(item => !item || typeof item !== 'object' || Array.isArray(item) || !item.id)) throw new Error('服务器数据格式异常，请稍后重试');
  return body;
}

function fetchChannelPage(key, page = 1) {
  if (!POST_TYPES[key]) return Promise.reject(new Error('不支持的栏目'));
  if (!Number.isInteger(page) || page < 1) return Promise.reject(new Error('页码无效'));
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${API_BASE}/api/posts`,
      data: { type: POST_TYPES[key], page, pageSize: 10 },
      timeout: 10000,
      success(response) {
        if (response.statusCode < 200 || response.statusCode >= 300) {
          reject(new Error((response.data && response.data.error) || `服务器返回 ${response.statusCode}`));
          return;
        }
        try {
          const body = normalizeRows(response.data);
          resolve({
            items: body.data.map(item => ({
              id: String(item.id), type: item.type || POST_TYPES[key],
              title: String(item.title || '未命名信息'),
              subtitle: String(item.meta || item.location || item.area || item.description || '').slice(0, 90),
              description: String(item.description || ''),
              priceDisplay: String(item.priceDisplay || ''),
              imageUrl: item.imageUrl || ''
            })),
            hasNext: body.pagination.hasNext
          });
        } catch (error) { reject(error); }
      },
      fail(error) { reject(new Error(error.errMsg || '网络请求失败')); }
    });
  });
}

function fetchChannel(key, page = 1) {
  return fetchChannelPage(key, page).then(result => result.items);
}

const PUBLIC_TYPES = ['job', 'housing', 'marketplace', 'service'];
function detailPath(item) {
  if (!item || !item.id || !PUBLIC_TYPES.includes(item.type)) return '';
  return `/pages/detail/index?id=${encodeURIComponent(item.id)}&type=${encodeURIComponent(item.type)}`;
}

function fetchPostDetail(id, type) {
  if (typeof id !== 'string' || !/^[0-9a-f-]{36}$/i.test(id) || !PUBLIC_TYPES.includes(type)) {
    return Promise.reject(new Error('帖子链接无效'));
  }
  return new Promise((resolve, reject) => wx.request({
    url: `${API_BASE}/api/posts/detail`,
    data: { id, type },
    timeout: 10000,
    success(response) {
      if (response.statusCode === 404) return reject(new Error('此信息已下架或不存在'));
      if (response.statusCode < 200 || response.statusCode >= 300) return reject(new Error('详情暂时无法加载，请稍后再试'));
      const body = response.data;
      if (!body || body.state !== 'ready' || !body.data || body.data.id !== id || body.data.type !== type) {
        return reject(new Error('详情数据格式异常'));
      }
      const post = body.data;
      resolve({
        id, type, title: String(post.title || '未命名信息'),
        subtitle: String(post.meta || post.location || post.area || ''),
        description: String(post.body || post.description || ''),
        priceDisplay: String(post.priceDisplay || ''),
        images: Array.isArray(post.images) ? post.images.filter(x => x && typeof x.url === 'string' && x.url.startsWith('https://')).map(x => ({url:x.url,caption:x.caption||''})) : [],
        fields: Array.isArray(post.detailMetaFields) ? post.detailMetaFields.filter(x => x && x.label && x.value).map(x => ({label:String(x.label),value:String(x.value)})) : []
      });
    },
    fail(error) { reject(new Error(error.errMsg || '网络请求失败')); }
  }));
}

module.exports = { fetchChannel, fetchChannelPage, fetchPostDetail, detailPath, POST_TYPES };
