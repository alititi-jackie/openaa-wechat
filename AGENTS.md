# OpenAA 微信小程序：AI 开发代理总规则

## 最新且最高优先级的用户决定（2026-10-30）

**本项目现在是中国大陆个人主体小程序的“五频道只读预览版”。此决定覆盖 2026-10-30 早些时候的“主站全功能复制版”规划。**

只保留五个内容频道：新闻资讯、招聘、房屋、二手、本地服务。访客仅能浏览、搜索/筛选、打开详情和分享；小程序内**不要开发或展示**微信登录、账号关联、收藏、个人中心、发布、编辑、DMV、导航、工具中心、支付或交易。

需要发布信息时显示“前往网页版发布”的引导，用户点按钮后复制 `https://openaa.com`，自己到浏览器登录和发布。**个人主体不应使用 web-view 内嵌网页版；不能把复制链接误称为自动跳转。**

本阶段目标仍然是开发预览，不保证微信审核上线。用户已知新闻、房屋、招聘、分类信息等可能不属于个人主体开放类目；正式审核前需要核验微信后台类目、主体资质与小程序备案，不得暗示只读一定能过审。

## 项目
- 小程序仓库：https://github.com/alititi-jackie/openaa-wechat
- 主站：https://openaa.com
- 主站源码：https://github.com/alititi-jackie/openaa-app
- 微信原生小程序 JS/WXML/WXSS/JSON；小程序仅使用主站公开 HTTPS API 与唯一数据源。

## 开发代理开工流程
1. 阅读本文件、docs/product-requirements.md、docs/architecture.md、docs/status.md、docs/workflow.md。
2. 检查 GitHub main、未合并 PR 和当前页面注册，避免恢复旧版写入页面。
3. 核对主站真实 API、公开数据过滤和具体字段，逐功能开发并跑测试。
4. 更新 docs/status.md，提交 GitHub，报告已验证和未验证内容。
5. 优先手机适配、错误恢复、浏览体验、微信分享。

## 安全与交付约束
- 不建第二套业务库；不得把 AppSecret、Supabase Service Role、数据库密码或令牌写到客户端。
- 不允许小程序直接写入主站数据或绕过审核；详情链接支持冷启动、下架不泄漏。
- 不以模拟 wx 回归测试冒充微信真实编译、生产 API 联调、真机或审核通过。
- 不修改生产数据库、认证或权限，不自动提交微信正式审核/发布。
- 旧 `pages/publish`、`pages/profile`、`pages/navigation`、`pages/dmv` 与 `pages/tools` 仍可能作为历史文件保留，但**不得在 app.json 中注册、入口中显示或恢复执行**。
- 旧 docs/full-parity-plan.md 和 docs/launch-plan.md 属于历史方案，不能覆盖当前决定。
