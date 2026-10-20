# dlidex-photo · 冻梨摄影站

> 线上地址：**https://www.dlidex.work**
> 技术栈：Vite + React + TypeScript + Tailwind（纯前端静态站点）
> 备案：浙ICP备2026058504号-2 · 浙公网安备33011002020295号

杭州·绍兴独立摄影师作品站：首页作品集、服务与价格、档期日历、关于、联系。

---

## ⚠️ 先看这里：分支说明

| 分支 | 用途 |
|---|---|
| **`legacy-photo`（默认分支）** | ✅ **线上真实源码**，所有改动与发布都基于它 |
| `main` / 其他 | 历史分支，非线上源，勿混淆 |

## 一、本地开发

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # 打包到 dist/
npm run preview
```

**档期后台**：`npm run dev` 后访问 http://localhost:5173/admin
- 可视化点选已约日期 → 保存 → 自动写 `public/availability.json` 并**自动发布上线**
- ⚠️ 线上档期是真实客户数据，测试保存前先备份 `public/availability.json`

> 打包报「safe-delete」拦截时用：
> ```bash
> env CODEBUDDY_SESSION_ID= CLAUDE_SESSION_ID= VITE_CACHE_DIR=node_modules/.vite-deploy npm run build
> ```

## 二、目录结构

```
src/
├─ data.ts                 ★ 作品数据、服务、关于、联系信息（改文案/增删照片改这里）
├─ components/             Hero / Portfolio / Services / Availability / About / Contact / Navbar / Footer
├─ admin/AvailabilityEditor.tsx   档期后台（打包时由 stripAdminInProd 插件剔除）
└─ lib/                    工具
public/
├─ photos/*.webp           ★ 客片（WebP，q82，长边≤1600，去 EXIF）
└─ availability.json       ★ 档期数据（线上有真实已约日期，勿用本地覆盖线上）
scripts/                   客片处理、IMA 同步、证书换新等脚本
```

**作品数据约定**：`src/data.ts` 里 `src` 用**相对路径** `photos/{id}.webp`（由 id 推导）；
分类前缀：领证 `c-` / 订婚 `d-` / 宝宝宴 `b-` / 写真 `x-` / 婚礼 `w-*`；**数量别写死，用 count 动态取**。

## 三、发布上线（严格按顺序）

```bash
# 0) 【必做】先把线上真实档期拉下来覆盖本地，避免把客户约拍日期清掉
curl -s "https://www.dlidex.work/availability.json" -o public/availability.json

# 1) 构建
env CODEBUDDY_SESSION_ID= CLAUDE_SESSION_ID= VITE_CACHE_DIR=node_modules/.vite-deploy npm run build

# 2) 上传 OSS（bucket=dlidex-work，region=oss-cn-hangzhou，根部署）
~/.workbuddy/binaries/python/envs/default/bin/python3 \
  ~/WorkBuddy/个人网页开发/dlidex-site/scripts/deploy-oss.py \
  --creds "~/Documents/阿里云密钥.txt" \
  --bucket dlidex-work --region oss-cn-hangzhou --prefix "" --dist dist --no-cleanup

# 3) 刷新 CDN（Directory 类型）
~/.workbuddy/binaries/python/envs/default/bin/python3 \
  ~/WorkBuddy/个人网页开发/dlidex-site/scripts/refresh-cdn.py \
  --creds "~/Documents/阿里云密钥.txt" --domain www.dlidex.work --type Directory --paths /

# 4)【易漏】重设首页缓存头（上传会覆盖 OSS 元数据，否则 CDN 又不缓存 HTML）
~/.workbuddy/binaries/python/envs/default/bin/python3 -c "
import oss2
txt = open('~/Documents/阿里云密钥.txt', encoding='utf-8').read()
t = txt.replace('=', ' ').replace('：', ' ').split()
ak = [x for x in t if x.startswith('LTAI')][0]
sk = [x for x in t if len(x) >= 25 and not x.startswith('LTAI')][-1]
b = oss2.Bucket(oss2.Auth(ak, sk), 'https://oss-cn-hangzhou.aliyuncs.com', 'dlidex-work')
b.update_object_meta('index.html', {'Cache-Control': 'public, max-age=60'})
print('ok')
"

# 5) 同步 GitHub
git add -A && git commit -m "说明" && git push origin legacy-photo
```

> Python 解释器：`~/.workbuddy/binaries/python/envs/default/bin/python3`（已装 oss2 + 阿里云 SDK）。

## 四、红线（千万别踩）

| 红线 | 说明 |
|---|---|
| 🔴 上传前先拉线上 `availability.json` | 线上有真实客户约拍日期，直接用本地文件覆盖会**丢数据** |
| 🔴 不许整桶删除 / 整目录覆盖 | 旧 hash 版 JS/CSS 永不删，只增量上传（`--no-cleanup`） |
| 🔴 刷新 CDN 用 `Directory` 类型 | `File` 级刷不全 |
| 🔴 CDN 加速区域是 `global`（含大陆节点） | 该域名有备案；**不可整站迁 Cloudflare 橙云**，会触发备案注销且大陆变慢 |
| 🔴 密钥不入库 | AK/SK 只放本地，禁止写进代码（`.gitignore` 已排除 `.env*`） |

## 五、客片同步（IMA 知识库 → 网站）

流程：扫描 IMA 知识库并下载去重 → 压缩为 WebP → 重建 `src/data.ts` → 部署 + 刷 CDN → 校验一致性（孤儿图/缺失/白屏）。

- 取原图走 ima-skill：`get_media_info` → COS 签名链接 → curl
- 每天「资料获取」有额度限制（code=220021）；**只读清单用 `get_knowledge_list`，不耗额度**
- 凭证在 `~/.config/ima/`（client_id 32 位 / api_key 76 位），报 401 即需重新授权
- 删片同步：`get_knowledge_list` 取现有 mid → 与 `sync_manifest.final.json` diff → 改 `data.ts` + 删本地 webp → 部署 → 删 OSS 孤儿图 → 刷 CDN

## 六、SSL 证书

- DigiCert **个人测试证书（免费版）**，**不支持续期**，只能到期前重新申请再部署
- 当前证书：**2026-11-05 到期**（计划到期当天换新）
- 换证脚本：`scripts/renew_ssl_photo.py`（`apply` / `status` / `deploy <cert_id>` 三步）
- ⚠️ 前置条件：免费额度必须在**阿里云控制台手动点「立即申领」**，API 直接领会报 `InsufficientQuota`
- 部署别用 CAS 的 `create_deployment_job`（会卡 editing 死状态），取 `Cert/Key` 后走 CDN `SetCdnDomainSSLCertificate`

## 七、Git

- 私有仓库：https://github.com/skynet2000/dlidex-photo （默认分支 `legacy-photo`）
- 摄影站没有 `push-github.sh`，手动 `git add -A && git commit && git push origin legacy-photo`
