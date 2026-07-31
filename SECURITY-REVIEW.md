# photo 站（dlidex.xyz/photo/）安全审查报告

审查时间：2026-07-21 · 审查范围：photo-dlidex-site 前端源码 + 构建产物 + OSS/CDN 基础设施
站点形态：**纯静态站**（Vite 7 + React 19 构建，阿里云 OSS 静态托管 + CDN 加速）

---

## 一、总体结论

**SQL 注入风险：不存在（风险等级 N/A）**

原因：本站是纯静态站，**没有数据库、没有后端服务、没有登录注册、没有任何用户输入提交入口**。SQL 注入攻击的前提是"存在接收用户输入并拼接 SQL 查询的后端"，这一前提在本站完全不存在。因此 SQL 注入无从谈起。

**整体安全评级：良好（低风险）**

代码层与依赖层干净，未发现可利用的注入/XSS 漏洞；唯一值得改进的是**传输层 HTTP 安全响应头缺失**（属于加固项，非漏洞）。

---

## 二、逐项审查结果

### ✅ 代码层（全部通过）

| 检查项 | 结果 | 说明 |
|--------|------|------|
| 危险 DOM API（dangerouslySetInnerHTML / eval / innerHTML / document.write） | ✅ 通过 | 全项目 0 使用，XSS 注入面无 |
| 表单 / 用户输入 / 后端请求（form / input / fetch / axios） | ✅ 通过 | 无表单、无后端调用，无注入入口 |
| localStorage / Cookie 使用 | ✅ 通过 | 仅 `photo-active-category`（分类记忆），不含敏感信息，无窃取价值 |
| 前端硬编码密钥 / token / 密码 | ✅ 通过 | src 与 index.html 0 硬编码敏感信息 |
| 构建产物 dist 是否误含密钥 | ✅ 通过 | 无 AccessKey / 密钥泄露进包 |

### ✅ 依赖层（通过）

- `npm audit`：**0 漏洞**（含 dev 依赖全量）
- 运行时第三方依赖仅 4 个：`react` / `react-dom` / `lucide-react` / `yet-another-react-lightbox`，均为主流高信誉库，无外链脚本 CDN（自建 bundle，不依赖第三方 CDN 脚本，规避了"CDN 劫持注入"风险）

### ✅ 基础设施层（核心项通过，有加固项）

| 检查项 | 结果 | 说明 |
|--------|------|------|
| **OSS 匿名写测试**（防篡改，关键） | ✅ 通过 | 匿名 PUT 返回 **403**，外人无法篡改/上传文件覆盖您的站 |
| git 仓库密钥追踪 | ✅ 通过 | 密钥文件未被 git 追踪（密钥仅存本地 Documents，不进版本库） |
| HTTPS 强制（域名） | ✅ 通过 | `http://dlidex.xyz` → **301 跳转** `https://`，传输加密 |
| TLS 证书与协议 | ✅ 通过 | DigiCert DV 证书，**TLSv1.3**，AEAD-CHACHA20-POLY1305（顶级加密套件） |

### ⚠️ 加固项（非漏洞，建议补强）

1. **HTTP 安全响应头缺失**（当前均未设置）：
   - `Content-Security-Policy`（CSP，防 XSS 纵深防御）
   - `X-Frame-Options` / `frame-ancestors`（防点击劫持/被恶意 iframe 嵌套）
   - `X-Content-Type-Options: nosniff`（防 MIME 嗅探）
   - `Strict-Transport-Security`（HSTS，强制 HTTPS）
   - 说明：这些属于"纵深防御"。本站因无注入面，实际被利用的概率低，但加上更稳妥。需在 **阿里云 CDN 控制台 → 自定义响应头** 配置（OSS 静态托管不直接支持自定义头，走 CDN 层加）。

2. **OSS 源站 HTTP 未强制跳 HTTPS**（`oss-cn-hongkong.aliyuncs.com` 直接 http 200）：
   - 影响：低。用户实际访问走 CDN 域名 `dlidex.xyz`（已强制 HTTPS），源站域名不对外暴露。可忽略，或在 OSS 开"静态网站托管强制 HTTPS"。

3. **缓存头 `no-cache, no-store, must-revalidate, max-age=0`**：
   - 说明：这是上次为"刷新即见"设的，利于内容即时更新，但放弃了 CDN 缓存收益。非安全问题，仅提示——若后续想提速可给图片资源（带 hash 的 webp/jpg）配长缓存，HTML 保持 no-cache。

---

## 三、结论与建议

- **SQL 注入**：不可能，无需担心。
- **当前真实风险面**：极小。纯静态 + 无注入点 + 依赖干净 + OSS 防篡改通过 + HTTPS/TLS1.3 完整。
- **唯一建议动手的**：到阿里云 CDN 控制台给 `dlidex.xyz` 加 4 个自定义响应头（CSP / X-Frame-Options / X-Content-Type-Options / HSTS），属加固可选，不做也不会被"黑"。
- **保持项**：密钥文件继续只存本地、不进 git、不进构建产物（当前已做到）。
