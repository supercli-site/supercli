/**
 * 价格来源登记表的校验与巡检。
 *
 *   node scripts/pricing-sources.mjs            校验本地登记表并打印摘要
 *   node scripts/pricing-sources.mjs --check    联网巡检：可达性与已记录价格是否仍在页面上
 *   node scripts/pricing-sources.mjs --check --write   巡检后回写核对时间与内容指纹
 *   node scripts/pricing-sources.mjs --check --upstream  额外核对上游榜单里的厂商是否都登记了来源
 *
 * 顺序固定：先验证本地数据，再联网，最后才写盘。
 */
import { readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { validatePricingSources } from "./pricing-validation.mjs";
import { normalizeText as normalize } from "./pricing-text.mjs";

const PATH = "data/pricing-sources.json";
const registry = JSON.parse(readFileSync(PATH, "utf8"));
validatePricingSources(registry);

const args = new Set(process.argv.slice(2));
const shouldCheck = args.has("--check");
const shouldWrite = args.has("--write");
const strict = args.has("--strict");
const withUpstream = args.has("--upstream");

/** 与 functions/api/models/rankings/agent.ts 同源的上游榜单接口。 */
const UPSTREAM =
  "https://modelgo-web-api.modelgo.ai/api/v1/model-discovery/rankings";

async function fetchSource(source) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 20_000);
  try {
    const response = await fetch(source.url, {
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "user-agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
        "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
      },
    });
    const body = await response.text();
    return {
      status: response.status,
      sha256: createHash("sha256").update(body).digest("hex"),
      text: normalize(body),
    };
  } finally {
    clearTimeout(timer);
  }
}

const rows = [];
let drift = 0;
let unreachable = 0;
let changedCount = 0;

for (const vendor of registry.vendors) {
  for (const source of vendor.sources) {
    if (!shouldCheck) {
      rows.push({
        vendor: vendor.name,
        kind: source.kind,
        url: source.url,
        checkedAt: source.checkedAt,
        prices: source.prices?.length ?? 0,
      });
      continue;
    }
    let result;
    try {
      result = await fetchSource(source);
    } catch (error) {
      unreachable += 1;
      rows.push({
        vendor: vendor.name,
        kind: source.kind,
        url: source.url,
        state: "unreachable",
        detail: error.name === "AbortError" ? "超时" : error.message,
      });
      continue;
    }
    const missing = (source.prices ?? []).filter(
      (price) => !result.text.includes(normalize(price.quote)),
    );
    const changed = source.contentSha256
      ? source.contentSha256 !== result.sha256
      : false;
    if (missing.length > 0 && !source.rendered) drift += 1;
    if (changed) changedCount += 1;
    rows.push({
      vendor: vendor.name,
      kind: source.kind,
      url: source.url,
      state:
        result.status >= 400
          ? "http_error"
          : source.rendered
            ? "js_rendered"
            : missing.length > 0
              ? "price_drift"
              : changed
                ? "content_changed"
                : "ok",
      status: result.status,
      missing: source.rendered ? [] : missing.map((price) => `${price.item}=${price.value}`),
      detail:
        source.rendered
          ? "价格由前端渲染，仅校验可达性"
          : missing.length > 0
            ? "已记录价格未在页面出现，需人工复核"
            : changed
              ? "内容指纹变化"
              : "",
      _sha256: result.sha256,
    });
    if (shouldWrite) {
      source.checkedAt = new Date().toISOString();
      source.httpStatus = result.status;
      source.contentSha256 = result.sha256;
    }
  }
}

if (shouldWrite) {
  writeFileSync(PATH, `${JSON.stringify(registry, null, 2)}\n`);
}

/** 拉上游榜单，核对榜上厂商是否都登记了官方价格来源。 */
async function upstreamCoverage() {
  const creators = new Map();
  for (const page of [1, 2]) {
    const url = `${UPSTREAM}?type=AGENT&metric=AGENTIC_INDEX&page=${page}&page_size=100`;
    const response = await fetch(url, { signal: AbortSignal.timeout(20_000) });
    if (!response.ok) throw new Error(`上游返回 ${response.status}`);
    const payload = await response.json();
    for (const item of payload?.data?.items ?? []) {
      const creator = item.creator_name;
      if (!creator) continue;
      creators.set(creator, (creators.get(creator) ?? 0) + 1);
    }
  }
  const covered = new Set(
    registry.vendors.flatMap((vendor) => vendor.upstreamCreators ?? [vendor.name]),
  );
  const missing = [...creators.entries()]
    .filter(([creator]) => !covered.has(creator))
    .sort((a, b) => b[1] - a[1]);
  console.log(
    `\n上游榜单 ${creators.size} 家厂商，已登记 ${creators.size - missing.length} 家${
      missing.length ? `；未登记 ${missing.length} 家：` : "；全部已登记"
    }`,
  );
  for (const [creator, count] of missing) console.log(`  未登记：${creator}（${count} 个模型）`);
  return missing.length;
}

const width = Math.max(...rows.map((row) => row.url.length), 10);
for (const row of rows) {
  const state = row.state ? `[${row.state}]` : "";
  const extra = row.missing?.length ? ` 缺 ${row.missing.join(", ")}` : "";
  console.log(
    `${row.vendor.padEnd(18)} ${row.kind.padEnd(17)} ${state.padEnd(18)} ${row.url.padEnd(width)}${extra}`,
  );
}

console.log(
  `\n${registry.vendors.length} 家厂商 / ${registry.vendors.reduce((sum, vendor) => sum + vendor.sources.length, 0)} 个来源${
    shouldCheck
      ? `；巡检：价格漂移 ${drift}，不可达 ${unreachable}，内容变化 ${changedCount}（内容变化本身不等于价格变动，以价格漂移为准）`
      : "（未联网）"
  }`,
);

let missingVendors = 0;
if (withUpstream) {
  try {
    missingVendors = await upstreamCoverage();
  } catch (error) {
    console.log(`\n上游覆盖核对失败：${error.message}`);
    if (strict) process.exit(1);
  }
}

if (unreachable > 0 || (strict && (drift > 0 || missingVendors > 0))) process.exit(1);
