/** 按量价格表的 HTML 标记：详情页与交互弹窗共用同一份实现。
 *
 * 🔴 单源约束（2026-11-11）：
 *   价格数字只来自 data/pricing-sources.json（官方定价巡检登记表），
 *   目录条目里不写死价格 —— 详见 src/pricing-table.ts 的说明。
 *
 *   表头与方向词是**代码里的静态片段**，走 translate()；
 *   模型名与单位是**数据**，语言中立，两语共用同一份 DOM。
 */
import { priceRows, pricingSource, type PriceRow } from "./pricing-table";
import { translate, type Language } from "./translations";
import { escapeHtml as escape } from "./escape";

/** 方向 → 中英文案（静态片段，可翻译）。 */
function directionLabel(row: PriceRow, language: Language): string {
  switch (row.direction) {
    case "input":
      return translate("输入", language);
    case "output":
      return translate("输出", language);
    case "cache":
      return translate("缓存读取", language);
    case "monthly":
      return translate("按量价格", language);
    default:
      return translate("单价", language);
  }
}

/** 单位 → 可读说明：币种 + 计价规模（数据，语言中立）。 */
function unitLabel(row: PriceRow): string {
  if (row.currency && row.scale) return `${row.currency} ${row.scale}`;
  if (row.currency) return row.currency;
  return row.unit;
}

/** 数值格式：小数去尾零，避免 0.10 这种尾巴。 */
function formatValue(value: number): string {
  return Number.isInteger(value) ? String(value) : String(Number(value.toFixed(4)));
}

/**
 * 生成按量价格表。
 *
 * @param vendorId 目录条目里的 pricingSourceId
 * @param language 页面语言（只影响表头与方向词）
 */
export function pricingTableMarkup(vendorId: string, language: Language): string {
  const rows = priceRows(vendorId);
  if (!rows.length)
    return `<p class="tool-install-note">${escape(translate("暂无按量价格快照", language))}</p>`;
  const source = pricingSource(vendorId);
  const hasNote = rows.some((row) => (language === "en" ? row.noteEn : row.note));
  const head = `<tr><th scope="col">${escape(translate("模型", language))}</th><th scope="col">${escape(translate("单价", language))}</th><th scope="col">${escape(translate("单位", language))}</th>${hasNote ? `<th scope="col">${escape(translate("说明", language))}</th>` : ""}</tr>`;
  const body = rows
    .map((row) => {
      const note = language === "en" ? (row.noteEn ?? null) : row.note;
      return `<tr><td>${escape(row.model)}<span class="pricing-direction">${escape(directionLabel(row, language))}</span></td><td>${escape(formatValue(row.value))}</td><td>${escape(unitLabel(row))}</td>${note ? `<td>${escape(note)}</td>` : ""}</tr>`;
    })
    .join("");
  // 🔴 来源名是数据（label 是中文）→ 英文页用登记表自带的 labelEn；
  //   两者都缺失时退回静态片段，绝不把中文印到英文页。
  const sourceLabel = source
    ? language === "en"
      ? (source.labelEn ?? translate("官方定价页", language))
      : source.label
    : "";
  const footnote = source
    ? `<p class="tool-install-note">${escape(translate("本表价格来自官方定价页的巡检快照", language))} · <a href="${escape(source.url)}" target="_blank" rel="noopener noreferrer">${escape(sourceLabel)} ↗</a>${source.checkedAt ? ` · ${escape(translate("核实日期", language))} ${escape(source.checkedAt.slice(0, 10))}` : ""}</p>`
    : "";
  return `<table class="data pricing-table"><thead>${head}</thead><tbody>${body}</tbody></table>${footnote}`;
}
