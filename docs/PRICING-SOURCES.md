# 价格来源登记

`data/pricing-sources.json` 记录每个模型厂商的**官方价格来源**（API 定价页 / 订阅套餐页 / 模型价格文档）与已核对的价格条目。数据契约为 `data/pricing-sources.schema.json`，校验入口 `scripts/validation.mjs`。

## 为什么要有这张表

`/models` 页的成本列整体转发自 ModelGo 公开接口（见 [MODEL-RANKINGS.md](MODEL-RANKINGS.md)），本站不持有任何价格数据，也就**无从核对上游数字**。上游单价过时、缺失或沿用了别家的计价规则时，页面不会自己报警。

这张表就是核对依据：每条价格都绑定官方 URL、核对时间与原文摘录；上游口径与官方口径不一致时，可以逐条比对。

## 结构

| 字段 | 含义 |
| --- | --- |
| `vendors[].id` / `name` | 厂商标识与名称，`id` 全局唯一 |
| `vendors[].upstreamCreators` | 该厂商在 ModelGo 榜单里的 `creator_name`，用于对齐上游行 |
| `vendors[].note` | 该厂商的口径说明（促销价、批处理折扣、部署区域差异等） |
| `sources[].kind` | `api_pricing` 按量定价 / `subscription_plan` 订阅套餐 / `model_doc` 模型价格文档 |
| `sources[].url` | 官方地址，必须 https |
| `sources[].primary` | `true` 表示这是给读者看的官方入口（页面上的「官方价」「官方套餐」链接指向它） |
| `sources[].rendered` | `true` 表示价格由前端渲染，普通 HTTP 抓取看不到原文，巡检只校验可达性 |
| `sources[].checkedAt` / `httpStatus` | 最近一次核验时间与响应状态码 |
| `sources[].contentSha256` | 抓取内容指纹，用于发现页面改版（内容变化本身不等于价格变动） |
| `prices[].item` / `model` | 条目名与官方型号 id（`model` 用于在页面上定位该型号） |
| `prices[].value` / `unit` | 数值与单位，如 `CNY_PER_1M_INPUT_TOKENS` |
| `prices[].quote` | 页面原文摘录，比较前会去掉空白；构建期断言摘录里必须含该数值 |

`quote` 是证据，不是装饰：校验会检查摘录里确实出现该数值，巡检会检查摘录是否仍能在官方页面上找到。找不到官方来源就**不写条目**——不编造 URL，不用别家厂商的价格顶替。

## 命令

```sh
pnpm pricing                                  # 校验本地登记表并打印摘要
pnpm pricing:check                            # 联网巡检：可达性 + 已记录价格是否仍在页面上
node scripts/pricing-sources.mjs --check --write   # 巡检后回写核对时间与内容指纹
pnpm pricing:coverage                            # 额外核对上游榜单里的厂商是否都登记了来源
```

顺序固定：先校验本地数据，再联网，最后才写盘（与 `pnpm sync` 系列一致）。构建门禁 `pnpm check` 也会校验本表的结构，但**不联网**。

`pnpm pricing:coverage` 会拉 ModelGo 榜单（与 `functions/api/models/rankings/agent.ts` 同源），列出**榜上有、但没登记官方价格来源的厂商**——上游新增厂商时能第一时间发现该补哪一家。

## 新增一条厂商

1. 找到官方定价页，能实际请求到 200 才写入（用 `curl -s -o /dev/null -w "%{http_code}" -L <url>` 复验）。
2. 摘 1–3 条代表性价格，`quote` 抄页面原文；`unit` 用大写下划线，如 `CNY_PER_1M_INPUT_TOKENS`。
3. 跑 `node scripts/pricing-sources.mjs --check --write` 写入核对时间与指纹。
4. 提交前跑 `pnpm check`。

## 已登记厂商（2026-11-05，共 29 家）

| 厂商 | 官方来源 | 状态 |
| --- | --- | --- |
| MiniMax | 开放平台定价概览（中/国际）+ 站点设置接口 + M Plan 订阅页 | 有价格（含订阅档位与积分包） |
| OpenAI | developers.openai.com 定价页 + ChatGPT 订阅页 | 有价格 |
| Anthropic | platform.claude.com 定价页 + claude.com 订阅页 | 有价格 |
| Google | AI Studio 定价页 | 有价格（带促销期） |
| Meta | dev.meta.ai 定价页 | 有价格（仅 Muse Wonder） |
| DeepSeek | 中英文定价概览 | 有价格（空闲/高峰两档） |
| Mistral | mistral.ai 定价页 | 有价格（仅 Mistral Large） |
| Cohere | cohere.com 定价页 | 有价格（Command A+） |
| Upstage | upstage.ai 定价页 | 有价格 |
| SpaceXAI | docs.x.ai 定价页 | 有价格（Grok 4.6 / 4.5） |
| Z AI | docs.z.ai 定价文档 | 有价格（GLM-5.3） |
| Alibaba | 百炼计费文档 + Model Studio 国际站 | 有价格（国内 ¥ / 国际 $） |
| Tencent | 混元生文计费概述 | 有价格（正文需浏览器渲染） |
| Kimi | Moonshot 国内站 + kimi.ai 国际站 | 有价格（人民币 / 美元两套表，前端渲染） |
| Xiaomi | MiMo 开放平台定价文档 | 有价格（国内 ¥ / 海外 $，前端渲染） |
| NVIDIA | Nemotron 模型页 Deploy 区 | 有价格（serverless 单价，前端渲染） |
| IBM | watsonx.ai 定价页 | 有价格（模型按量 + 套餐起价） |
| Thinking Machines | Tinker 定价页 | 有价格（Inkling Small） |
| Institute of Foundation Models | docs.ifm.ai 调用限额 | 只有免费额度（10,000,000 tokens/Key/日） |
| Multiverse Computing | CompactifAI API 目录页 | 有价格（Quasar 438B / GLM 5.3） |
| LongCat | LongCat 开放平台定价页 + 按量付费说明 | 有价格（¥ 与 $ 两套，限时折扣价） |
| OpenBMB | ModelBest 模型平台（直接返回 JSON 价目） | 有价格（单位是平台积分，无 CNY 换算） |
| Inception | 官方文档模型价格表 + 官网同表 | 有价格（Mercury 3 / 2，发布期 5 折） |
| Arcee AI | 官方文档定价页 | 有价格（代售第三方模型的转售价） |
| Celeris | 官方定价页 + 文档版同表 | 有价格（Celeris-1 / 1.1） |
| Apodex | 官方文档定价页 | 有价格（含托管工具调用价） |
| Motif Technologies | 官方订阅套餐页 | 有价格（按席位订阅，非 token 计价） |
| Nex AGI | NorthGate 平台定价页 | 仅来源（公开价目为空，需登录） |
| SK Telecom | A.X LLM 官方说明页 | 仅来源（Apache-2.0 免费商用，非计价条目） |

**未登记（核查后确认无可用官方定价页）**：InclusionAI —— `inclusionai.com/pricing`、`api.inclusionai.com/pricing` 返回 200 但是域名停放页/反爬 iframe，真实官网 `www.inclusion-ai.org` 没有 pricing 路由；第三方 `ling-1t.ai/pricing` 有报价但属个人站点，不登记为官方来源。

### 核查中发现的坑

- **NVIDIA `build.nvidia.com/pricing` 是 404 空壳**：返回 HTTP 200，但渲染结果与任意乱路径完全相同，没有价格表。真实单价只出现在各模型页的 Deploy 区（按 endpoint provider 分别列出）。NIM 托管 API 是免费原型额度（40 RPM 限速）。
- **很多页面必须用真实浏览器读价格**：MiniMax `/m-plan`、腾讯混元文档（curl 只拿到 JS 反爬壳）、小米 MiMo、NVIDIA 模型页、Kimi 中英文站。静态抓取拿到的要么是空壳，要么是脚本载荷碎片——这类来源在登记表里标 `rendered: true`，巡检只校验可达性。其余 35 个来源的摘录都能在静态 HTML 里逐条比对上。
- **同厂商存在多套币种/地域价**：Alibaba（国内 ¥ / 国际 $ / 新加坡）、Kimi（人民币 / 美元）、MiniMax（人民币 / 美元）、Xiaomi（国内 ¥ / 海外 $）——登记表把两套都登记，不合并。
- **页面自带轮换内容**：Anthropic、Google、xAI 等页面几分钟内内容指纹就会变，所以「内容变化」只作提示，**以价格漂移（摘录里的数字是否还在）为准**。

## 已知差异（2026-11-05 核对）

MiniMax 官方口径：

- `MiniMax-M3 ≤512k 输入 tokens`：永久五折后 输入 ¥2.10 / 输出 ¥8.40 / 缓存读取 ¥0.42（每百万 tokens）；`>512k` 档 4.20 / 16.80 / 0.84；`MiniMax-M3.1-Flash` 1.00 / 4.00 / 0.10。
- 官方价格表只有「缓存读取」一项，**没有缓存写入计价**。
- 官方价格表里已无 `MiniMax-M2.7`。
- M Plan 订阅档位：Go ¥49/月（4,489 积分）、Explore ¥119/月（22,460 积分）、Build ¥469/月（74,900 积分）；优先服务按标准价 1.5 倍计费。

ModelGo 上游对 MiniMax 的口径与官方不一致，待上游修正：M3 与 M2.7 的单价完全相同，且带了一个官方没有的缓存写入价（0.375 美元/百万 tokens）；已不在官方价格表中的 M2.7 仍在榜；官方已发布的 M3.1-Flash 未收录。

其余已核对的差异见各厂商 `note` 字段（例如 OpenAI/Google 的促销价与到期时间、Alibaba 的区域部署差异）。
