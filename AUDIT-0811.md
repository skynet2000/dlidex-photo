# 全站审计报告 · www.dlidex.work
日期：2026-08-11

## 本次修复的问题（上一轮审计发现）
| 问题 | 修复 | 验证 |
|------|------|------|
| og:url / og:image / twitter:image 硬编码旧域名 `dlidex.xyz/photo` | `index.html` 改为 `https://www.dlidex.work/`（3 处） | CDN + OSS 源站双重确认已更新 ✓ |
| `/availability.json` 请求 404 | 新建 `public/availability.json`（档期默认值，供「档期」模块运行时拉取） | `https://www.dlidex.work/availability.json` → HTTP 200，JSON 合法 ✓ |

> 注：构建因上一轮被打断，本次重新 `npm run build`（base `/`）→ 部署 OSS → 刷 CDN，已成功收尾。

## 重新全站审计结果（全部通过 ✅）
1. **重定向/证书**：`http://` → 301 → `https://`；TLS 校验通过（证书 CN=www.dlidex.work）。
2. **核心静态资源**：`/`、`/index.html`、`/favicon.svg`、`/availability.json`、`/assets/*.js`、`/assets/*.css`、腾讯验证 txt 全部 200。
3. **图片资源**：`data.ts` 真实引用的 **90 张图片**（客片/头像/占位 SVG）在 dist 与 CDN 均 100% 200，0 缺失、0 非 200。
4. **双备案号**：Footer 含 `浙ICP备2026058504号-2` + `浙公网安备33011002020295号`（客户端渲染，已在打包 JS 中确认）。
5. **SEO/分享**：`<title>`、`og:title`=`冻梨摄影｜杭州·绍兴独立摄影师`；`lang=zh-CN`、`charset=UTF-8`、`viewport`、description 齐全；og/twitter 图片指向 `https://www.dlidex.work/photos/og-cover.jpg`（200）。
6. **混合内容**：打包 JS 中 `http://` 仅 2 处，均为 SVG 命名空间 `http://www.w3.org/...`（非网络请求），无混合内容风险。
7. **旧域名残留**：打包产物中 `dlidex.xyz` 出现 **0 次**，全站已切到 www.dlidex.work。

## 部署信息
- OSS：`dlidex-work`（oss-cn-hangzhou），公共读 200，上传 102 文件，清理 1 个旧 hashed bundle。
- CDN：`www.dlidex.work`，目录刷新 RefreshTaskId=`33104954122`。
- 验证文件：`4525114ad6376e7746d39712ecece591.txt` 仍可访问（HTTP 200），供微信域名所有权核验。

## 结论
全站健康，无未解决问题。微信分享拦截属腾讯白名单流程，已通过邮件申诉 + 部署验证文件，待用户在微信侧点「验证」并等审核（1–2 工作日）。
