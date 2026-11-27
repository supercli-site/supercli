/**
 * style-src 回归：仓内不得再出现会被生产 CSP style-src 'self' 拦掉的 style 属性。
 *
 * 背景（2026-11-27 线上实测）：首页报 20 条
 * "Applying inline style violates ... 'style-src self'"，来源全部是
 * src/command-markup.ts 写的 style="--i:N"。后果是终端命令逐词点亮的
 * animation-delay 实测全为 0s（本该 120ms/175ms/230ms），动画在生产上没生效。
 *
 * 修法是把错峰序号从 style 属性搬到 class（档位有界，命令最多 5 个词）。
 * 这条测试锁住：src/ 与构建产物里都不再有 style 属性形式的关键帧参数。
 *
 * 为什么不放宽 CSP：unsafe-inline 会拆掉整站 XSS 防线；浏览器明确提示
 * hash 对 style 属性不生效（需 unsafe-hashes），所以两条路都不走。
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const root = new URL("..", import.meta.url).pathname;

/**
 * 会被 style-src 'self' 拦掉的属性：错峰序号与动画延迟。
 *
 * 只盯 --i（终端逐词点亮的错峰序号）：这是当前唯一真正被 CSP 伤害的属性 ——
 * 线上实测它的 animation-delay 全为 0s，逐词点亮动画完全没生效。
 *
 * 氛围网格（ambient）曾是第三处 style 属性来源，但它在 commit 238357c 里
 * 连同基础 CSS 一起被删除，网格点线上实测宽高均为 0、完全不可见 —— 属于
 * 早于 CSP 的既有死代码。它却在 200 个工具页里输出了 2400 处被 CSP 拦掉的
 * style 属性，所以本单直接把这份死代码删掉，而不是给它补一套永不显示的样式。
 */
const blockedStyleAttribute = /style="[^"]*(?:--i|animation-delay)\s*:/g;

/** 源目录与脚本目录里逐个查。 */
function sourceFiles(dir) {
  const out = [];
  for (const name of readdirSync(join(root, dir), { withFileTypes: true })) {
    if (name.name.startsWith(".")) continue;
    const full = join(root, dir, name.name);
    if (name.isDirectory()) out.push(...sourceFiles(join(dir, name.name)));
    else if (/\.(ts|mjs|html)$/.test(name.name)) out.push(full);
  }
  return out;
}

test("源文件里没有 style=\"--i / animation-delay\" 这类会被 CSP 拦掉的属性", () => {
  const offenders = [];
  for (const dir of ["src", "scripts"]) {
    for (const file of sourceFiles(dir)) {
      const text = readFileSync(file, "utf8");
      // 本测试文件本身含正则字面量，不参与扫描。
      if (file.endsWith("scripts/style-src.test.mjs")) continue;
      // 只看代码行：注释里可以解释「为什么不用 style 属性」。
      const code = text
        .split("\n")
        .filter((line) => {
          const trimmed = line.trim();
          return !trimmed.startsWith("//") && !trimmed.startsWith("*") && !trimmed.startsWith("/*");
        })
        .join("\n");
      for (const match of code.matchAll(blockedStyleAttribute)) {
        offenders.push(`${file.replace(root, "")}: ${match[0].slice(0, 70)}`);
      }
    }
  }
  assert.deepEqual(offenders, []);
});

test("逐词点亮的错峰序号改由 class 承载", () => {
  const markup = readFileSync(join(root, "src/command-markup.ts"), "utf8");
  assert.match(markup, /term-i-/);
  // 只看代码，不看注释（注释里可以解释为什么不用 --i）。
  const code = markup
    .split("\n")
    .filter((line) => !line.trim().startsWith("//") && !line.trim().startsWith("*"))
    .join("\n");
  assert.doesNotMatch(code, /style="--i:/);
  // CSS 侧必须给出每一档的延迟，否则逐词点亮会退回同一时刻。
  const css = readFileSync(join(root, "src/styles/terminal.css"), "utf8");
  for (let step = 1; step <= 5; step += 1) {
    assert.match(css, new RegExp(`\\.term-i-${step}\\s*\\{[^}]*animation-delay`), `term-i-${step}`);
  }
  // 基础档不能依赖被 CSP 拦掉的 --i 变量。
  assert.doesNotMatch(css, /animation-delay:\s*calc\(var\(--i/);
});

test("追加卡片的入场错峰走 class，CSS 每一档都有延迟", () => {
  const code = readFileSync(join(root, "src/main.ts"), "utf8");
  assert.match(code, /card-enter-/);
  const css = readFileSync(join(root, "src/styles/directory.css"), "utf8");
  for (let tier = 0; tier <= 11; tier += 1) {
    assert.match(
      css,
      new RegExp(`\\.card-enter-${tier}\\s*\\{[^}]*animation-delay`),
      `card-enter-${tier}`,
    );
  }
});

test("构建产物里没有 style=\"--i / animation-delay\"（HTML 静态页与工具页）", () => {
  const offenders = [];
  for (const dir of ["dist"]) {
    const files = [];
    const walk = (current) => {
      for (const name of readdirSync(join(root, current), { withFileTypes: true })) {
        const full = join(current, name.name);
        if (name.isDirectory()) walk(full);
        else if (name.name.endsWith(".html")) files.push(full);
      }
    };
    try {
      walk(dir);
    } catch {
      return; // 未构建时跳过，产物校验由 check-static.mjs 负责。
    }
    for (const file of files) {
      const text = readFileSync(join(root, file), "utf8");
      // 本测试文件本身含正则字面量，不参与扫描。
      if (file.endsWith("scripts/style-src.test.mjs")) continue;
      // 只看代码行：注释里可以解释「为什么不用 style 属性」。
      const code = text
        .split("\n")
        .filter((line) => {
          const trimmed = line.trim();
          return !trimmed.startsWith("//") && !trimmed.startsWith("*") && !trimmed.startsWith("/*");
        })
        .join("\n");
      for (const match of code.matchAll(blockedStyleAttribute)) {
        offenders.push(`${file.replace(root, "")}: ${match[0].slice(0, 70)}`);
      }
    }
  }
  assert.deepEqual(offenders, []);
});
