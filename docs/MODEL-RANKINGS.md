# 端侧小模型排行

页面：`/models`、`/en/models`。首页导航与首屏都有入口，窄屏表格可横向滚动。

## 数据真源

`data/edge-models.json` 是排行榜唯一数据真源，`data/edge-models.schema.json` 是结构契约，校验入口是 `scripts/validation.mjs` 的 `validateEdgeModels`，在 `pnpm build` / `node scripts/validate.mjs` 中执行。

收录口径：开源、可端侧部署、参数量不超过 1.7B 的小模型；不含闭源大模型与云端 API 模型。每条记录绑定 Hugging Face 仓库来源、快照日期、可部署体积口径与许可标签。

## 指标口径

- **可部署体积**：取仓库内最小可运行权重的实际字节数，来自 Hugging Face tree API 实测。GGUF 取最小 4/5bit 主文件，MLC 取全部 `params_shard` 之和，Core ML 取最小完整模型目录，CTranslate2 取 `model.bin`。多文件模型按核心权重计，不含 tokenizer/配置文件。
- **下载量**：Hugging Face 仓库累计下载量，快照日期见页面 `snapshot_date`。下载量反映关注度，不代表安装量或质量。
- **许可**：按仓库 tags 的 `license` 字段原样记录，未标注即显示「未标注」；MIT/Apache-2.0 显示为可直接商用，其他许可显示为需自行核对。
- **排序**：默认按可部署体积升序（小者优先），可切换按下载量降序。不自行评分。

缺值一律显示 `—`，不写 0。

## 本地验证

```sh
node scripts/validate.mjs   # 数据契约 + 语义校验
pnpm build                  # 类型、数据、测试与静态产物门禁
pnpm dev                    # 本地预览 http://127.0.0.1:5179/models
```

页面为纯静态：浏览器只读取随构建输出的本地 JSON，不请求任何外部排行接口，也没有 Cloudflare Function 转发。`public/_routes.json` 不再 include 任何 API 路径。

## 数据更新

更新榜单时修改 `data/edge-models.json`，并同步更新 `snapshot_date` 与每条记录的 `downloads`（从 Hugging Face 仓库 API 实测）。新增模型必须带真实 `source` 链接与体积口径说明，缺来源或缺口径会被门禁拦下。
