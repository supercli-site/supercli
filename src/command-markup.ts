/** 命令分词高亮：只按空白切分，保留原始字符，不改写命令本身。
 *  每个词带 --i 序号，供 CSS 做逐词点亮的错峰延迟。
 *  首页（客户端）与工具页（构建时）共用同一套实现。 */
import { escapeHtml as escape } from "./escape.ts";

/** 命令词的配色类别。 */
export type CommandTokenKind = "command" | "flag" | "value";

/** 逐词点亮的错峰档位上限。命令最长 5 个词（catalog 实测），留一档余量。 */
const TERM_STEP_LIMIT = 6;

/** 切分命令并标注每段的类别；空白原样保留。 */
export function commandTokens(command: string): readonly {
  readonly text: string;
  readonly kind: CommandTokenKind | null;
}[] {
  return command.split(/(\s+)/).map((token) => {
    if (!token.trim()) return { text: token, kind: null };
    const kind: CommandTokenKind = token.startsWith("-")
      ? "flag"
      : token.includes("/") || token.includes("://")
        ? "value"
        : "command";
    return { text: token, kind };
  });
}

/** 渲染分色后的命令；词序与原文完全一致。 */
export function commandMarkup(command: string): string {
  let index = 0;
  return commandTokens(command)
    .map(({ text, kind }) => {
      if (!kind) return escape(text);
      const step = index++;
      // 错峰序号走 class 而不是 style="--i:N"：生产 CSP 是 style-src 'self'，
      // 内联样式属性（含自定义属性）会被浏览器拦掉，导致逐词点亮延迟全为 0。
      // 档位有界（TERM_STEP_LIMIT），超界回落到 0 档而不是丢样式。
      const tier = step < TERM_STEP_LIMIT ? ` term-i-${step}` : "";
      return `<span class="term-${kind}${tier}">${escape(text)}</span>`;
    })
    .join("");
}
