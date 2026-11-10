/** 指标展示区分仓库推送、npm 下载和不可获得的实际执行次数。 */
import { t, msg, locale, language } from "./i18n";
import { apiEntryFor } from "./api-entry";
import { stats, usage, usageSnapshot, type Entry } from "./catalog";
import { escapeHtml as escape } from "./escape";
const number = (value: number): string =>
  Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
/**
 * Stars 用完整千分位：紧凑格式会把 255446 与 255431 都舍成 255.4K，
 * 在榜单头部制造假并列——排行是目录页的核心价值，不能经不起第一眼推敲。
 * 百万以上量级差异远大于舍入误差，才用紧凑。
 */
export const formatStars = (value: number): string =>
  value >= 1_000_000 ? number(value) : value.toLocaleString("en");
function updated(item: Entry): string {
  const metric = stats(item);
  if (!metric) return t('<span class="metric-missing">暂未接入</span>');
  const time = new Date(metric.pushedAt);
  const day = time.toLocaleDateString("en-CA", { timeZone: "Asia/Taipei" });
  const full = time.toLocaleString(locale, {
    timeZone: "Asia/Taipei",
    hour12: false,
  });
  return `<time datetime="${escape(metric.pushedAt)}" title="${escape(full)} UTC+8">${escape(day)}</time>`;
}
export function cardMetrics(item: Entry): string {
  // 🔴 API 服务没有 npm 包也没有 GitHub 仓库 ——
  //   卡片上写「近30天下载 / 仓库更新」只会得到两行「暂未接入」，
  //   对「按量调接口」的用户毫无意义。换成该形态真正要看的两项：
  //   接入端点与计费方式。
  if (item.category === "api" && item.api) {
    const api = apiEntryFor(item, language) ?? item.api;
    return msg`<dl class="tool-metrics"><div><dt>${t("接入端点")}</dt><dd>${escape(api.endpoint)}</dd></div><div><dt>${t("计费方式")}</dt><dd>${escape(api.pricing)}</dd></div></dl>`;
  }
  const data = usage(item);
  const downloads = data
    ? msg`<a href="https://api.npmjs.org/downloads/point/${escape(data.start)}:${escape(data.end)}/${encodeURIComponent(data.package)}" target="_blank" rel="noopener noreferrer" title="npm ${escape(data.package)} · ${escape(data.start)} 至 ${escape(data.end)} · ${data.downloads.toLocaleString("en")} 次下载">${number(data.downloads)}<span>npm</span></a>`
    : t('<span class="metric-missing">暂未接入</span>');
  return msg`<dl class="tool-metrics"><div><dt>近30天下载</dt><dd>${downloads}</dd></div><div><dt>仓库更新</dt><dd>${updated(item)}</dd></div></dl>`;
}
export function detailMetrics(item: Entry): string {
  const data = usage(item);
  return msg`${cardMetrics(item)}<details class="metric-source"><summary>数据来源与统计口径 · 下载量不代表调用量</summary><p class="usage-explanation">${data ? msg`来源：npm 包 <a href="https://www.npmjs.com/package/${encodeURIComponent(data.package)}" target="_blank" rel="noopener noreferrer">${escape(data.package)}</a>；统计区间 ${escape(data.start)} 至 ${escape(data.end)}。下载快照 ${escape(new Date(usageSnapshot.fetchedAt).toLocaleDateString(locale, { timeZone: "Asia/Taipei" }))}。` : t("尚未接入该工具的公开下载数据，暂无数据不表示零下载。")}<br>调用量：暂无可核实的公开数据。下载次数包含重复安装与 CI，不等于 CLI 执行次数或用户数。仓库更新指作者或维护者的最近推送，不等于版本发布。</p></details>`;
}
