# Agent 模型排行

页面：`/models`、`/en/models`。首页导航与首屏都有入口，窄屏表格可横向滚动。

## 本站公开接口

```http
GET /api/models/rankings/agent?page=1&page_size=50
```

- `page`、`page_size` 都是 1–100 的整数，默认分别为 1、50。拒绝其他查询字段及非 GET 方法。
- 固定转发 `https://modelgo-web-api.modelgo.ai/api/v1/model-discovery/rankings`，`type=AGENT&metric=AGENTIC_INDEX`。
- 保留上游 JSON envelope、排序、指标、空值及 `data.snapshot_date`；不自行评分、不编造缺值。
- 浏览器只请求本站接口；转发不携带调用方的 Origin、Cookie、Authorization 或其他请求头，也不透传上游 Set-Cookie。
- 上游失败、超时或响应格式错误时返回 502 + `no-store`；成功响应提供 `max-age=60, s-maxage=300` 缓存指令。
- 上游每日快照不等于实时评测。页面显示实际快照日期，不把请求日期当成数据日期。
- 计费单位遵从上游：`USD_PER_TASK` 展示美元/任务，其他单位保留原样；缺少数据展示 `—`。

## 部署与本地验证

Cloudflare Pages 根目录的 `functions/api/models/rankings/agent.ts` 是唯一转发实现。`pnpm dev` 通过 Vite 插件调用同一个处理器，不另外维护一套代理规则。`public/_routes.json` 将 Function 调用限制在这个 API，其他页面保持静态。

```sh
pnpm test:rankings
pnpm build
pnpm exec wrangler pages functions build --outdir /tmp/supercli-functions-build
```

数据来源及原始榜单：<https://modelgo.ai/models/rankings/agent>。

## 官方价格来源

页面的成本列整体来自上游快照，本站不自行计价。为了让读者能自行核对上游数字：

- 厂商名旁的「官方价」「官方套餐」链接，指向 `data/pricing-sources.json` 登记的官方定价页（仅登记已实测可达的来源）。
- 登记表的结构契约为 `data/pricing-sources.schema.json`，校验入口 `scripts/validation.mjs`，巡检命令 `pnpm pricing:check`。
- 口径说明：单任务成本按厂商**按量 API 计价**统计，订阅制套餐（如 MiniMax M Plan）另计。详见 [PRICING-SOURCES.md](PRICING-SOURCES.md)。
