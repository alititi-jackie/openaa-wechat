# OpenAA 微信小程序五频道只读架构

## 基本架构
微信原生小程序（只读 UI） → OpenAA.com Next.js 公开 HTTPS API → 主站 Supabase。唯一数据源由主站管理，微信客户端没有数据库凭证，也没有账户写入权限。

## 页面与导航
- app.json 注册：home、list、news、news-detail、detail。
- TabBar：home / list。首页五个快捷入口：news、jobs、housing、secondhand、services。
- `pages/publish`、`pages/profile`、`pages/navigation`、`pages/dmv`、`pages/tools` 旧文件不注册、不展示。
- 网页发布 `utils/web-publish.js`：弹窗→复制 `https://openaa.com`；不使用 web-view，也不实现微信身份认证。

## 已核实的主站公开接口
- `GET /api/posts?type=job|housing|marketplace|service&page=N&pageSize=10&view=list`：四类公开列表；有 `{state,data,pagination}`。
- 筛选：`q,area,min,max,sort`。服务频道不支持价格区间。
- `GET /api/posts/detail?id=<uuid>&type=...`：公开详情精简 DTO，服务端按 published/public/未过期过滤，省略 sourceRecord 和 contact。
- `GET /api/mini/news`：新闻分类及最新 50 条；`category=<slug>` 过滤。
- `GET /api/mini/news?slug=<slug>`：文章正文详情；404 不显示下架内容。
- 公开链接不含用户私有资料；小程序由 `utils/api.js` 进行字段映射和错误处理。

## 安全、审核与验证
- 禁止 Service Role、AppSecret 或私密个人数据进入小程序代码。
- 对外分享只含 ID/slug；接收方冷启动重新请求，不依赖原手机缓存。
- 请求合法域名配置必须与微信后台一致，全部走 HTTPS。
- 微信个人主体不能以 web-view 实现任意网站跳转；用户复制域名自行访问。
- 仅源码/模拟 wx 测试不意味着真实 API、微信编译、真机或正式审核通过；新闻、招聘、房地产及分类信息可能超出个人主体类目。
- 历史的全功能规划仅供背景，不作为当前开发目标。
