// 首次联调前确认 API 的实际响应结构与域名白名单。
module.exports = {
  API_BASE: 'https://openaa.com',
  CHANNELS: [
    { key: 'jobs', label: '招聘求职', emoji: '💼' },
    { key: 'housing', label: '房屋租售', emoji: '🏠' },
    { key: 'secondhand', label: '二手交易', emoji: '🛍️' },
    { key: 'services', label: '本地服务', emoji: '🔧' }
  ],
  QUICK_LINKS: [
    {key:'jobs',label:'招聘求职',emoji:'💼',type:'channel'},
    {key:'housing',label:'房屋租售',emoji:'🏠',type:'channel'},
    {key:'secondhand',label:'二手交易',emoji:'🛍️',type:'channel'},
    {key:'services',label:'本地服务',emoji:'🔧',type:'channel'},
    {key:'news',label:'新闻资讯',emoji:'📰',type:'page'}
  ]
};
