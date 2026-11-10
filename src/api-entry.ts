/** 纯 API 服务的接入与计费信息；只有 category=api 的条目带这个对象。 */
export interface ApiEntry {
  readonly endpoint: string;
  readonly protocol: string;
  readonly auth: string;
  readonly pricing: string;
  readonly sdk?: string;
  readonly priceNote?: string;
}

/**
 * 取条目的 API 接入信息，按页面语言取对应文案。
 *
 * 🔴 为什么要单独一份英文表（data/api.en.json）：
 *   翻译机制只覆盖**代码里的静态片段**，不翻译数据里的字符串。
 *   接入信息（协议 / 鉴权 / 计费）是**数据**，中文值直接印到英文页上
 *   会让英文页出现中文（实测被「英文页不得含中文」判据当场拦下）。
 *   所以跟 catalog.en.json 一样：数据自带语言版本，按 id 索引。
 *
 * 🔴 为什么单独一个模块（不放在 src/catalog.ts）：
 *   catalog.ts 依赖 i18n.ts，而 i18n.ts 在构建期会读 location。
 *   预渲染脚本（scripts/tool-markup.ts）也要用同一个函数，
 *   放一起会把浏览器依赖带进构建期。
 */
import englishApi from "../data/api.en.json" with { type: "json" };

const english: Readonly<Record<string, ApiEntry | undefined>> = englishApi;

export function apiEntryFor(
  item: { readonly id: string; readonly api?: ApiEntry },
  language: "zh" | "en",
): ApiEntry | undefined {
  if (!item.api) return undefined;
  if (language === "zh") return item.api;
  return english[item.id] ?? item.api;
}
