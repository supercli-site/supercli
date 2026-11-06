/** 价格来源巡检共用的文本归一化。 */
const stripMarkup = (text) =>
  text
    .replace(/[-‏﻿]/g, "")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&yen;/g, "¥")
    .replace(/&gt;/g, ">")
    .replace(/&lt;/g, "<")
    .replace(/&quot;/g, '"')
    .replace(/&#x?[0-9a-f]+;/gi, " ");

/** 去掉所有空白：用于判断一段原文是否仍在页面上（不依赖空白差异）。 */
export function normalizeText(text) {
  return stripMarkup(text).replace(/\s+/g, "");
}

/** 保留数字边界的折叠文本：用于把摘录里的数字与登记数值做数值比较。 */
export function collapseText(text) {
  return stripMarkup(text).replace(/\s+/g, " ").trim();
}

/** 摘录里出现过的数值（千分位逗号会被去掉）。 */
export function numbersIn(text) {
  const collapsed = collapseText(text).replace(/,/g, "");
  return [...collapsed.matchAll(/-?\d+(?:\.\d+)?/g)].map((match) => Number(match[0]));
}
