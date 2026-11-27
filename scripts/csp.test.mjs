/**
 * CSP 回归：站内不得再出现会被 script-src 'self' 拦掉的可执行内联脚本。
 *
 * 背景（2026-11-27 线上事故）：五个页面的 <head> 里各有一段内联脚本负责在首绘前
 * 从 localStorage 落定明暗主题，而生产 CSP 是 script-src 'self' —— 浏览器直接拦掉，
 * 控制台报 "Executing inline script violates ... 'script-src self'"，首屏浅色闪一下。
 * 修法是把该逻辑外置为同源静态文件 public/theme-init.js，CSP 保持 'self' 不放宽。
 *
 * 这条测试锁住三件事：
 *  1. 仓内模板不得有可执行内联脚本（ld+json 结构化数据不算，它是数据不是脚本）；
 *  2. 生产 CSP 不得出现 unsafe-inline / unsafe-eval 这类把整站防线拆掉的写法；
 *  3. 外置脚本必须真实存在于 public/ 且被页面引用 —— 否则主题预载会静默失效。
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const root = new URL("..", import.meta.url).pathname;

/** 页面模板：五个入口页。构建产物 dist/ 由 check-static.mjs 单独验收。 */
const templates = [
  "index.html",
  "standards.html",
  "guides.html",
  "models.html",
  "brand.html",
];

/** 可执行内联脚本：排除 type="application/ld+json"（结构化数据）。 */
const executableInlineScript = /<script(?![^>]*\bsrc=)(?![^>]*type="application\/ld\+json")[^>]*>[\s\S]*?<\/script>/g;

test("页面模板没有可执行内联脚本（CSP script-src 'self' 会拦掉）", () => {
  const offenders = [];
  for (const file of templates) {
    const html = readFileSync(join(root, file), "utf8");
    for (const match of html.matchAll(executableInlineScript)) {
      offenders.push(`${file}: ${match[0].slice(0, 80).replace(/\s+/g, " ")}`);
    }
  }
  assert.deepEqual(offenders, []);
});

test("public/ 下也没有可执行内联脚本", () => {
  const offenders = [];
  for (const file of readdirSync(join(root, "public"))) {
    if (!file.endsWith(".html")) continue;
    const html = readFileSync(join(root, "public", file), "utf8");
    for (const match of html.matchAll(executableInlineScript)) {
      offenders.push(`public/${file}: ${match[0].slice(0, 80).replace(/\s+/g, " ")}`);
    }
  }
  assert.deepEqual(offenders, []);
});

test("生产 CSP 不放宽 script-src（不引入 unsafe-inline / unsafe-eval）", () => {
  const headers = readFileSync(join(root, "public/_headers"), "utf8");
  const csp = headers
    .split("\n")
    .find((line) => line.includes("Content-Security-Policy:"));
  assert.ok(csp, "public/_headers 必须声明 Content-Security-Policy");
  assert.match(csp, /script-src 'self'/);
  assert.doesNotMatch(csp, /script-src[^;]*unsafe-inline/);
  assert.doesNotMatch(csp, /script-src[^;]*unsafe-eval/);
});

test("主题预载脚本真实存在且被所有页面引用", () => {
  const script = readFileSync(join(root, "public/theme-init.js"), "utf8");
  assert.match(script, /supercli-theme/);
  assert.match(script, /dataset\.theme/);
  for (const file of templates) {
    const html = readFileSync(join(root, file), "utf8");
    assert.match(html, /<script src="\/theme-init\.js"><\/script>/, file);
  }
});
