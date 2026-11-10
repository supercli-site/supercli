/** 构建与同步共用数据契约；目录校验不读取旧指标或要求图标已存在。 */
import { readFileSync } from "node:fs";
import assert from "node:assert/strict";
import { validatePricingSources } from "./pricing-validation.mjs";
import Ajv from "ajv";
const schema = (name) =>
  JSON.parse(
    readFileSync(
      new URL(`../data/${name}.schema.json`, import.meta.url),
      "utf8",
    ),
  );
const ajv = new Ajv({ allErrors: true });
ajv.addFormat("timestamp", (value) => Number.isFinite(Date.parse(value)));
const catalogSchema = ajv.compile(schema("catalog"));
const metricsSchema = ajv.compile(schema("metrics"));
const recommendationsSchema = ajv.compile(schema("recommendations"));
const contributorsSchema = ajv.compile(schema("contributors"));
export function validatePricingSourcesRegistry(registry) {
  validatePricingSources(registry);
}

export function validateCatalog(catalog) {
  assert(catalogSchema(catalog), JSON.stringify(catalogSchema.errors));
  for (const field of ["id", "repo"]) {
    const values = catalog
      .filter((item) => item[field] !== null)
      .map((item) => item[field].toLowerCase());
    assert.equal(new Set(values).size, values.length, `重复 ${field}`);
  }
}
/** 推荐语结构由 schema 把关，语义关系（署名与出处）由社区门禁把关。 */
export function validateRecommendationSchema(picks) {
  assert(
    recommendationsSchema(picks),
    JSON.stringify(recommendationsSchema.errors),
  );
}
/** GitHub 用户快照结构由 schema 把关，覆盖与数值语义由社区门禁把关。 */
export function validateContributorSchema(snapshot) {
  assert(
    contributorsSchema(snapshot),
    JSON.stringify(contributorsSchema.errors),
  );
}
export function validateMetrics(snapshot, catalog) {
  assert(metricsSchema(snapshot), JSON.stringify(metricsSchema.errors));
  assert.deepEqual(
    Object.keys(snapshot.repositories).sort(),
    catalog.map((item) => item.id).sort(),
    "指标覆盖与目录不符",
  );
  for (const item of catalog) {
    const metric = snapshot.repositories[item.id];
    if (!item.repo) assert.equal(metric, null, `${item.id} 不应伪造指标`);
    else {
      assert(metric, `缺少 ${item.id} 指标，请运行 pnpm sync`);
      assert.equal(
        metric.repo.toLowerCase(),
        item.repo.toLowerCase(),
        `${item.id} 指标仓库来源不符，请运行 pnpm sync`,
      );
    }
  }
}

/**
 * 目录里的 API 条目必须指向价格登记表里真实存在的厂商来源。
 *
 * 🔴 为什么要有这条（2026-11-11）：
 *   API 条目的价格不是写在目录里的，而是由 pricingSourceId 指向
 *   data/pricing-sources.json 的厂商，价格表从那份巡检登记表渲染。
 *   一旦 id 写错或厂商没有 api_pricing 来源，页面会**静默**渲染成
 *   「暂无按量价格快照」—— 用户以为这里没有价格，其实是配置坏了。
 *   这种「坏了但不报错」正是最该在构建门禁里拦住的。
 */
export function validateApiPricingReferences(catalog, registry) {
  const vendors = new Map(registry.vendors.map((vendor) => [vendor.id, vendor]));
  for (const item of catalog) {
    if (item.category !== "api") continue;
    assert(item.api, `${item.id} 缺少 api 接入信息`);
    const vendorId = item.api.pricingSourceId;
    assert(vendorId, `${item.id} 缺少 pricingSourceId（价格真源指向）`);
    const vendor = vendors.get(vendorId);
    assert(vendor, `${item.id} 的 pricingSourceId=${vendorId} 不在价格来源登记表里`);
    const apiPricing = vendor.sources.filter((source) => source.kind === "api_pricing");
    assert(
      apiPricing.length > 0,
      `${item.id} 指向的厂商 ${vendorId} 没有 api_pricing 来源`,
    );
    assert(
      apiPricing.some((source) => (source.prices ?? []).length > 0),
      `${item.id} 指向的厂商 ${vendorId} 没有任何按量价格快照`,
    );
  }
}
