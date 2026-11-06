/** 价格来源登记表：结构由 schema 把关，来源唯一性、核对时间与摘录证据由本模块把关。 */
import { readFileSync } from "node:fs";
import assert from "node:assert/strict";
import Ajv from "ajv";
import { numbersIn } from "./pricing-text.mjs";

const schema = JSON.parse(
  readFileSync(
    new URL("../data/pricing-sources.schema.json", import.meta.url),
    "utf8",
  ),
);
const ajv = new Ajv({ allErrors: true });
ajv.addFormat("timestamp", (value) => Number.isFinite(Date.parse(value)));
const pricingSchema = ajv.compile(schema);

/** 数值在摘录里可能写成 10 / 10.0 / 10.00 / 4,489，按数值本身比较。 */
function quoteHasValue(quote, value) {
  return numbersIn(quote).some((number) => Math.abs(number - value) < 1e-9);
}

export function validatePricingSources(registry) {
  if (!pricingSchema(registry)) {
    const first = pricingSchema.errors[0];
    throw new Error(
      `价格来源登记表不合规：${first.instancePath || "/"} ${first.message}`,
    );
  }
  const ids = registry.vendors.map((vendor) => vendor.id);
  assert.equal(new Set(ids).size, ids.length, "厂商 id 重复");
  const urls = registry.vendors.flatMap((vendor) =>
    vendor.sources.map((source) => source.url),
  );
  assert.equal(new Set(urls).size, urls.length, "价格来源 URL 重复");
  const now = Date.now();
  for (const vendor of registry.vendors) {
    for (const source of vendor.sources) {
      assert(
        Date.parse(source.checkedAt) <= now + 86_400_000,
        `${vendor.id} 核对时间超前：${source.checkedAt}`,
      );
      for (const price of source.prices ?? []) {
        assert(
          quoteHasValue(price.quote, price.value),
          `${vendor.id} ${price.item} 的原文摘录里没有 ${price.value}，摘录与数值对不上`,
        );
      }
    }
  }
}
