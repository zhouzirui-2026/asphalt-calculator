# Asphalt Calculator 上线设计方案

状态：**已由用户批准实施（2026-08-20）**

日期：2026-08-20

目标域名：`https://asphalt-calculator.top`

计划托管：GitHub + Vercel

## 1. 决策摘要

我的选择是：**GitHub 保存公开源码，Vercel 负责构建与托管；原生 Next.js 只作为构建器，所有产品页面静态预渲染，Vercel 通过 CDN 提供 HTML、CSS 和浏览器 JavaScript。**

访问者收到静态 HTML + JS，不依赖账户、数据库、API 或按请求执行的业务服务器。Next.js 复用现有页面、metadata、交互组件和测试，只为计算器和分析同意控件发送必要的浏览器 JS。

不建议把已经实现并测试的页面重写成手写 HTML。这样会重做表单状态、单位切换、分享链接、错误摘要、键盘操作、结构化数据和测试边界，增加上线风险，但不会显著降低当前七页站点的托管成本。

本方案已获批准。实施顺序仍坚持：先发布 `noindex` 候选并完成验证，再绑定域名、验证 HTTPS 和 GA 同意机制，最后单独开放索引。

## 2. 已确认事实

- 当前产品已有 7 个页面和两个经过测试的交互式计算器；
- 原始实现使用 Next App Router 形式的源码，但由 vinext/Vite/Cloudflare/Sites 兼容层构建；
- 产品不需要 Cloudflare Worker、Sites 数据能力、账户、数据库或 SaaS 模板；
- 目标生产域名已选为 `asphalt-calculator.top`，权威 DNS 由宝塔 DNS 托管；
- 本任务不取消、删除、转移或修改其他域名；
- ShipAny Two 不参与本次上线，避免私有授权源码进入公开仓库。

## 3. 目标与非目标

### 目标

1. 使用 GitHub 保存可公开的产品源码，并由 Vercel 自动构建和托管。
2. 七个规划路由均提供可直接抓取的静态 HTML。
3. 计算器在浏览器本地运行，不向服务器发送尺寸、厚度、密度、废料或价格输入。
4. 先发布 noindex 候选，再验证域名、HTTPS、canonical、路由、响应头和分析同意行为。
5. 仅在全部上线门槛通过后开放应索引页面。
6. 接入 GA4，但必须先获得访问者明确同意，并排除分享链接查询参数。

### 非目标

- 不增加账户、登录、付款、邮件、远程数据库、广告或昂贵 API；
- 不部署 ShipAny 或其他购买模板；
- 不提交 Google Search Console、Bing、IndexNow 或其他搜索引擎；
- 不修改其他现有项目；
- 不对未续费域名执行删除、转移或 DNS 操作。

## 4. 方案比较

### 托管路线

| 方案 | 版本与协作 | 静态 SEO 与域名 | 维护与回滚 | 平台边界 | 结论 |
| --- | --- | --- | --- | --- | --- |
| GitHub + Vercel | Git 历史清晰，可公开审查；push 后自动构建 | Next.js 原生支持，预览、HTTPS、自定义域名完整 | 每次部署可追溯到 commit，可快速回滚 | 单一公开源码仓库 + 单一托管平台 | **选择** |
| Sites | 发布步骤较短 | 能托管当前站点，但依赖 Sites/Cloudflare 兼容构建 | 与 GitHub 自动发布链路和 Vercel 运维习惯不一致 | 需要保留 Sites 专属配置与兼容层 | 不选择 |
| 自管服务器 | 控制最高 | 需要自行处理 HTTPS、缓存和更新 | 运维、安全和故障恢复成本最高 | 引入本项目不需要的服务器 | 不选择 |

### 构建架构

| 方案 | 首屏与静态 SEO | 维护成本 | 迁移与测试风险 | Vercel 适配 | 结论 |
| --- | --- | --- | --- | --- | --- |
| 手写 HTML + JS | 最小运行时；静态 SEO 直接 | 页面少时低，交互复杂后需要自建生成器 | **高**：需重写两个计算器、分享、无障碍和审计 | 简单静态目录 | 不选择当前重写 |
| Next.js 仅作静态构建器 | 页面预渲染；内容首屏是 HTML；交互区有受控 JS | 复用现有组件、metadata 和测试；依赖需定期维护 | **低**：从现有 App Router 源码直接迁移 | 原生支持，预览/回滚完善 | **选择** |
| 保留 vinext/Vite 兼容层 | 能静态输出，但含 beta 兼容层 | 同时维护 Vite、Cloudflare 和 Next 语义 | 中等 | 不是 Vercel 原生路径 | 不选择 |
| 使用 ShipAny Two | 能实现，但包含不需要的 SaaS 能力 | 最高，且需持续许可证边界审计 | 高 | 可行但过度 | 不选择 |

### 推荐方案的强制约束

- 构建日志中所有产品路由必须显示为静态预渲染；
- 不创建 `app/api`、Route Handler、Server Action、ISR 数据源或运行时数据库；
- Vercel 预览中不得出现产品业务 Function 依赖；
- 计算公式只存在于 `lib/calculations.ts`，UI 不复制公式；
- 只有计算器、分享/打印和分析同意控件需要客户端 JavaScript；
- 如果 Vercel 产物审计发现必须按请求运行的 Function，停止上线并重新评估纯静态导出。

## 5. 请求与数据流

```text
GitHub main
    │ push
    ▼
Vercel Build（Next.js）
    │
    ├── 静态 HTML：7 个产品页面 + 404
    ├── CSS / 图标 / OG 图片
    └── 浏览器 JS：计算器、分享/打印、分析同意
            │
            ▼
Vercel CDN ───────────────► 访问者浏览器
                                  │
                                  ├── 计算输入仅在本地计算
                                  └── 同意后才请求 GA4

BT.cn DNS ── apex 域名 ──► Vercel
www 子域名 ── 308 ───────► https://asphalt-calculator.top
```

## 6. 域名与 HTTPS 设计

- 主站唯一 canonical：`https://asphalt-calculator.top`；
- `www.asphalt-calculator.top` 仅作为 308 跳转入口，不作为独立 canonical；
- 在域名注册状态变为正常前，不写入 DNS；
- Vercel 提供域名验证记录后，才在 BT.cn 写入精确记录；
- 验证 apex、www 跳转、HTTPS 证书、HTTP→HTTPS、所有 7 个路由和未知路由 404；
- 不触碰其他域名的 DNS、续费设置或注册状态。

## 7. Google Analytics 设计

### 加载规则

1. Vercel 环境变量 `NEXT_PUBLIC_GA_MEASUREMENT_ID` 保存 GA4 Web Stream ID；该 ID 是公开配置，不是密钥。
2. ID 缺失或格式无效时，不显示分析同意框，也不加载 Google 脚本。
3. 第一次访问默认不加载 GA；访问者可选择：
   - `Allow analytics`；
   - `Continue without analytics`。
4. 选择保存在浏览器 localStorage；页脚提供 `Analytics choices` 入口。
5. 从允许改为拒绝时刷新页面，确保后续页面生命周期不再发送分析请求。

### 数据最小化

- 仅发送页面浏览所需的页面路径、标题、来源、浏览器/设备类信息和 GA4 默认测量信息；
- 上报前强制移除 URL 查询串和 hash；
- 不发送长度、宽度、面积、厚度、密度、废料、材料价格或成本输入；
- 不定义计算结果、自定义价格或分享参数事件；
- 禁用广告个性化信号和 Google Signals；
- 隐私页明确说明 Vercel 请求日志、GA4、同意方式、撤回方式和 Google 隐私政策。

### 验收证据

- 未同意：网络面板无 `googletagmanager.com` 和 `google-analytics.com` 请求；
- 同意后：GA 脚本加载，page_view 的 `page_location` 不含 `?` 后参数；
- 拒绝：完整计算器仍可使用；
- 撤回：页面刷新，之后无 GA 请求；
- 分享链接测试证明尺寸和价格不会进入 GA 请求。

## 8. SEO 与索引门槛

### 阶段 A：生产候选（保持 noindex）

- 公开页面 metadata 为 `noindex, nofollow`；
- `robots.txt` 使用 `Disallow: /`；
- canonical、OG、Twitter 和 sitemap 已使用正式域名；
- Vercel 候选可访问，但不主动提交搜索引擎。

### 阶段 B：域名验证

- apex 与 www 行为正确；
- HTTPS 和安全响应头正确；
- 7 个规划路由均返回 200，未知路由返回品牌化 404；
- 桌面、移动、键盘、分享、打印、单位切换、错误状态和 GA 同意行为通过；
- 公开构建无密钥、私有模板、vendor-private 路径或分析导出。

### 阶段 C：开放索引

- 仅 `/`、两个计算器、`/methodology`、`/about` 改为 `index, follow`；
- `/privacy` 与 `/terms` 保持 noindex；
- `robots.txt` 改为 Allow，并重新生成和审计 sitemap；
- 重新推送 GitHub、由 Vercel 自动部署并做一次线上回归；
- 本任务不提交 Search Console、Bing、IndexNow 或 sitemap 表单。

## 9. 安全与公开仓库边界

- GitHub 仓库建议名称：`zhouzirui-2026/asphalt-calculator`；
- 计划为公开仓库，但只包含当前独立产品代码；
- 不包含 `.env`、Vercel 本地元数据、GA 导出、个人资料、购买模板或 vendor-private 内容；
- CSP 仅放行本站和 GA 所需的脚本/连接域名；
- 配置 `frame-ancestors 'none'`、nosniff、Referrer-Policy、Permissions-Policy、HSTS 和 www 归一化；
- 构建审计扫描客户端与服务器构建边界，即使产品页面最终静态输出；
- GitHub 推送前逐文件暂存并检查 staged diff，不使用全目录盲目暂存。

## 10. 测试与完成标准

### 本地

```powershell
npm ci
npm run sync:site:check
npm run lint
npm run typecheck
npm test
npm run build
npm run audit:site
npm audit
git diff --check
```

必须覆盖：

- 公式、单位换算、废料、成本、非法输入、极值和分享参数；
- GA Measurement ID 校验和 query/hash 清除；
- Title、Description、单一 H1、canonical、robots、sitemap；
- FAQ 可见文本与 JSON-LD 逐字一致；
- 内链、孤儿页、route allowlist、404、www 跳转和安全头；
- public allowlist、构建产物秘密扫描和私有源码边界；
- 同意前无 GA、同意后无查询参数泄漏。

### Vercel 候选与正式站

- 构建日志确认全部产品路由静态；
- 桌面与 390px 移动端关键流程；
- 键盘顺序、焦点、错误摘要、ARIA 单位、打印和分享恢复；
- HTTPS、apex、www 308、robots、sitemap、OG 图片与 404；
- 浏览器控制台无错误；
- GA 同意/拒绝/撤回三条路径；
- 至少一次独立发布复核，P0/P1 为 0。

## 11. 发布顺序与回滚

1. 审核并批准本设计；
2. 完成并提交本地 launch 分支；
3. 创建 GitHub 仓库并推送；
4. 创建 Vercel 项目，设置 GA ID，发布 noindex 候选；
5. 域名注册正常后配置 Vercel 域名和 BT.cn DNS；
6. 完成线上验证；
7. 修改索引开关、重新测试、推送并部署；
8. 保存 Git commit、Vercel deployment URL 和 DNS 记录作为回滚凭据。

回滚时：

- Vercel 恢复上一生产 deployment；
- Git 回退到上一已知良好提交；
- 若域名异常，先恢复 noindex 或将主域名临时指向上一健康部署；
- 不通过删除仓库、清空 DNS 或重置工作树进行回滚。

## 12. 当前暂停点

在收到“先出设计文档”指令前，已在 `agent/launch-asphalt-top` 分支做过一组**未提交的迁移实验**，包括正式域名配置、原生 Next 构建、GA 同意组件、隐私说明、安全头、404 和新版站点审计。当前状态：

- 未推送 GitHub；
- 未创建或连接 Vercel 项目；
- 未修改 DNS；
- 未创建 GA4 属性或 Web Stream；
- 未开放索引；
- 未部署线上站点。

这些未提交实验不视为已批准设计。审核后可以保留、调整或完整撤回。

## 13. 请审核的决策项

请确认以下五项后再继续：

1. **架构**：是否批准“GitHub + Vercel、Next.js 仅作静态构建器”的选择？
2. **GitHub**：是否批准创建公开仓库 `zhouzirui-2026/asphalt-calculator`？
3. **域名**：是否批准 apex 为主站、www 做 308 跳转？
4. **GA4**：是否批准上述“先同意、去查询串、无自定义计算事件”的数据最小化方案？
5. **索引**：是否批准在线验证全部通过后自动解除公开页面 noindex，但仍不提交搜索引擎？
