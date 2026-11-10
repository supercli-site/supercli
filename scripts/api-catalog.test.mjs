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
  // 🔴 接入信息必须有来源与核实口径的位置 —— 纯 API 面的价格最容易过期
  assert.ok(properties.api.properties.priceNote, "api 对象缺少 priceNote（价格口径与核实日期）");
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
