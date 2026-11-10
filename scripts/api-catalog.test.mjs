/** 纯 API 服务品类回归：数据契约、双语接入信息、呈现分流与不伪造。
 *
 * 起因（owner 2026-11-10）：「gemini-api 是另一个东西，纯 API 面…UI 方面是不是没做，
 * 这是个功能，但和技术无关」—— 目录此前全是「装进终端的 CLI」，
 * 「按量调接口」这种使用形态在 UI 上无处安放。
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { catalog } from "../src/catalog.ts";
import { apiEntryFor } from "../src/api-entry.ts";
import { priceRows, pricingSource } from "../src/pricing-table.ts";
import { pricingTableMarkup } from "../src/pricing-markup.ts";
import { toolMarkup, faqs } from "./tool-markup.ts";
import { detailMarkup } from "../src/html.ts";
import rawCategories from "../data/categories.json" with { type: "json" };
import rawSchema from "../data/catalog.schema.json" with { type: "json" };
import englishApi from "../data/api.en.json" with { type: "json" };

const apiEntries = catalog.filter((item) => item.category === "api");

test("目录里存在「API 服务」品类，且有实际条目", () => {
  assert.ok("api" in rawCategories, "categories.json 缺少 api 分类");
  assert.ok(apiEntries.length > 0, "没有任何 category=api 的条目");
});

test("schema 允许 api 品类与 api 接入信息对象", () => {
  const properties = rawSchema.items.properties;
  assert.ok(properties.category.enum.includes("api"), "schema 的 category 枚举缺少 api");
  assert.ok(properties.api, "schema 缺少 api 字段");
  for (const key of ["endpoint", "protocol", "auth", "pricing"])
    assert.ok(properties.api.properties[key], `api 对象缺少 ${key}`);
  // 🔴 价格必须指向巡检登记表（唯一真源），不能在目录条目里写死数字
  assert.ok(properties.api.properties.pricingSourceId, "api 对象缺少 pricingSourceId（价格真源指向）");
  assert.ok(!properties.api.properties.priceNote, "api 对象不该再有 priceNote（价格数字不得写死在目录里）");
});

test("每个 API 条目都带接入信息，且端点是 https", () => {
  for (const item of apiEntries) {
    assert.ok(item.api, `${item.id} 缺少 api 接入信息`);
    assert.match(item.api.endpoint, /^https:\/\//, `${item.id} 端点不是 https`);
    assert.ok(item.api.protocol.length > 0, `${item.id} 缺协议`);
    assert.ok(item.api.auth.length > 0, `${item.id} 缺鉴权方式`);
    assert.ok(item.api.pricing.length > 0, `${item.id} 缺计费方式`);
  }
});

test("API 条目不伪造 GitHub 指标与下载量（无仓库就是 null）", () => {
  for (const item of apiEntries) {
    assert.equal(item.repo, null, `${item.id} 不该有仓库`);
    assert.equal(item.install, null, `${item.id} 不该有安装命令`);
  }
});

test("目录条目里不写死价格数字（价格只来自巡检登记表）", () => {
  // 🔴 单源铁律：价格会过期，且各家促销期不同（Gemini 到 2026-12-31 才恢复原价）。
  //   手写在目录里的数字不会随 `pnpm pricing:check` 更新，迟早和官方页面对不上。
  for (const item of apiEntries) {
    const text = JSON.stringify(item.api);
    assert.ok(
      !/\$\s?\d/.test(text),
      `${item.id} 的目录条目里出现了价格数字：${text}`,
    );
    assert.ok(item.api.pricingSourceId, `${item.id} 没有指向价格真源`);
  }
});

test("价格表能从巡检登记表渲染出该厂商的按量价格", () => {
  for (const item of apiEntries) {
    const rows = priceRows(item.api.pricingSourceId);
    assert.ok(rows.length > 0, `${item.id} 在登记表里查不到按量价格`);
    for (const row of rows) {
      assert.ok(Number.isFinite(row.value), `${item.id} 的价格不是有限数值`);
      assert.ok(row.model.length > 0, `${item.id} 的价格缺模型名`);
      assert.ok(row.unit.length > 0, `${item.id} 的价格缺单位`);
    }
    const source = pricingSource(item.api.pricingSourceId);
    assert.ok(source?.url?.startsWith("https://"), `${item.id} 的价格来源不是 https 链接`);
  }
});

test("英文页的接入信息是英文的（数据自带语言版本，不靠静态片段翻译）", () => {
  for (const item of apiEntries) {
    const english = apiEntryFor(item, "en");
    assert.ok(english, `${item.id} 缺英文接入信息`);
    for (const value of [english.protocol, english.auth, english.pricing])
      assert.ok(
        !/[一-鿿]/.test(value),
        `${item.id} 的英文接入信息里混进了中文：${value}`,
      );
  }
});

test("API 条目的详情页走「接入方式」，不出现「安装方式」", () => {
  for (const item of apiEntries) {
    const page = toolMarkup(item, "zh");
    assert.ok(page.includes("接入方式"), `${item.id} 详情页没有接入方式区块`);
    assert.ok(!page.includes("安装方式"), `${item.id} 详情页仍出现安装方式`);
    // 交互弹窗同样分流
    const modal = detailMarkup(item, null);
    assert.ok(modal.includes("接入方式"), `${item.id} 交互详情没有接入方式区块`);
    assert.ok(!modal.includes("安装命令"), `${item.id} 交互详情仍出现安装命令`);
  }
});

test("API 条目的 FAQ 第一问是「怎么接入」而不是「怎么安装」", () => {
  for (const item of apiEntries) {
    const entries = faqs(item, "zh");
    assert.ok(entries[0].question.includes("怎么接入"), `${item.id} 首问不是怎么接入`);
    assert.ok(!entries[0].question.includes("怎么安装"), `${item.id} 首问仍是怎么安装`);
  }
});

test("CLI 条目不受影响：仍然有安装方式", () => {
  const cli = catalog.find((item) => item.category !== "api" && item.install);
  assert.ok(cli, "找不到带安装命令的 CLI 条目");
  const page = toolMarkup(cli, "zh");
  assert.ok(page.includes("安装方式"), "CLI 条目的安装方式区块不见了");
  assert.ok(!page.includes("接入方式"), "CLI 条目不该出现接入方式区块");
});

test("同一模型同一方向出现多个价格时，每档都必须带说明（否则用户分不清）", () => {
  // 🔴 实测踩坑：Gemini 3.8 Flash 输入有 0.75（促销）与 1.5（原价）两档，
  //   没有说明时表里就是两行「输入 0.75 / 输入 1.5」，用户无从判断哪个是哪个。
  const groups = new Map();
  for (const item of apiEntries) {
    for (const row of priceRows(item.api.pricingSourceId)) {
      const key = `${item.id}|${row.model}|${row.unit}`;
      const list = groups.get(key) ?? [];
      list.push(row);
      groups.set(key, list);
    }
  }
  for (const [key, list] of groups) {
    if (list.length < 2) continue;
    for (const row of list) {
      assert.ok(row.note, `${key} 有多档价格，但这一档没有说明：${row.value}`);
      assert.ok(row.noteEn, `${key} 有多档价格，但这一档缺英文说明：${row.value}`);
    }
  }
});

test("英文页的价格表不得含中文（来源名是数据，要用登记表自带的英文名）", () => {
  // 🔴 2026-11-11 实测踩坑：价格表的来源名来自登记表的 label（中文），
  //   而翻译机制只覆盖代码里的静态片段、不翻译数据 ——
  //   英文页于是出现「AI Studio 定价页」。修法是登记表自带 labelEn。
  for (const item of apiEntries) {
    const table = pricingTableMarkup(item.api.pricingSourceId, "en");
    const body = table.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
    assert.ok(
      !/[一-鿿]/.test(body),
      `${item.id} 的英文价格表混进了中文：${body.slice(0, 200)}`,
    );
  }
});

test("价格表的来源链接是官方 https 链接，且带核实日期", () => {
  for (const item of apiEntries) {
    const source = pricingSource(item.api.pricingSourceId);
    assert.ok(source, `${item.id} 缺价格来源`);
    assert.ok(source.url.startsWith("https://"), `${item.id} 价格来源不是 https`);
    assert.ok(source.checkedAt, `${item.id} 价格来源缺核实日期`);
    // 英文页要能拿到英文来源名
    assert.ok(source.labelEn, `${item.id} 价格来源缺英文名 labelEn`);
  }
});

test("英文页正文不得含中文（沿用既有判据，覆盖 API 新增内容）", () => {
  const template = readFileSync(new URL("../guides.html", import.meta.url), "utf8");
  assert.ok(template.length > 0);
  for (const item of apiEntries) {
    const page = toolMarkup(item, "en");
    const body = page.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
    assert.ok(
      !/[一-鿿]/.test(body),
      `${item.id} 的英文页混进了中文`,
    );
  }
});

test("英文接入信息表按 id 覆盖，且不与中文版共用同一段值", () => {
  for (const item of apiEntries) {
    assert.ok(englishApi[item.id], `api.en.json 缺少 ${item.id}`);
    assert.notEqual(
      englishApi[item.id].pricing,
      item.api.pricing,
      `${item.id} 的英文计费说明与中文相同`,
    );
  }
});
