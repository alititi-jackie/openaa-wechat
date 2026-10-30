# OpenAA 小程序公开详情 API 契约（2026-10-30）

主站已提交只读接口 `GET /api/posts/detail?id=<uuid>&type=job|housing|marketplace|service`，代码路径 `app/api/posts/detail/route.ts`。

- 服务端复用 `getPublicPostById(id, type)`：已发布、公开、默认城市、未过期才可读取。
- 请求缺少参数/非法 type/id 返回 HTTP 400；数据不存在或已下架返回 404；配置异常 503，查询异常 500。
- 成功返回 `{state:'ready',data:{id,type,title,body,description,meta,images,...}}`；`data` 仅允许下列显式公开字段，不包含 `sourceRecord`、`contact`、`author_id` 和未审核原始 metadata。
- 小程序冷启动时凭 URL 中的 `id`、`type` 重新请求，缓存只作首屏提示，不承担权限判断。
- `Cache-Control: no-store`，避免已下架内容在 CDN 被长时间缓存。
- 微信环境需在后台配置 `https://openaa.com` 为 request 合法域名，并实测真机。

主站提交 `7b67207f085c98c508221a832fba7f63f7bf6432`。仍须通过生产 API、微信编译及真机验证；代码提交不等于已部署可用。
