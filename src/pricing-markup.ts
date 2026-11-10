/** 按量价格表的 HTML 标记：详情页与交互弹窗共用同一份实现。
 *
 * 🔴 单源约束（2026-11-11）：
 *   价格数字只来自 data/pricing-sources.json（官方定价巡检登记表），
 *   目录条目里不写死价格 —— 详见 src/pricing-table.ts 的说明。
 *
 *   表头与方向词是**代码里的静态片段**，走 translate()；
 *   模型名与单位是**数据**，语言中立，两语共用同一份 DOM。
 *
 * 🔴 按来源分组渲染（2026-11-11 实测）：
 *   同一个厂商常有多个定价页（DeepSeek 有人民币站与美元站），
 *   合进一张表会出现「¥4.5 和 $0.15 并排」，用户无从比较 ——
 *   所以每个来源各出一张表，标题带来源名与官方链接。
 */
import { priceGroups, type PriceRow } from "./pricing-table";
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

/** 一张价格表（同一来源，币种一致）。 */
function tableMarkup(
  rows: PriceRow[],
  language: Language,
): string {
  const hasNote = rows.some((row) => (language === "en" ? row.noteEn : row.note));
  const head = `<tr><th scope="col">${escape(translate("模型", language))}</th><th scope="col">${escape(translate("单价", language))}</th><th scope="col">${escape(translate("单位", language))}</th>${hasNote ? `<th scope="col">${escape(translate("说明", language))}</th>` : ""}</tr>`;
  const body = rows
    .map((row) => {
      const note = language === "en" ? (row.noteEn ?? null) : row.note;
      return `<tr><td>${escape(row.model)}<span class="pricing-direction">${escape(directionLabel(row, language))}</span></td><td>${escape(formatValue(row.value))}</td><td>${escape(unitLabel(row))}</td>${note ? `<td>${escape(note)}</td>` : ""}</tr>`;
    })
    .join("");
  return `<table class="data pricing-table"><thead>${head}</thead><tbody>${body}</tbody></table>`;
}

/**
 * 生成按量价格表（一个来源一张表）。
 *
 * @param vendorId 目录条目里的 pricingSourceId
 * @param language 页面语言（只影响表头、方向词与来源名）
 */
export function pricingTableMarkup(vendorId: string, language: Language): string {
  const groups = priceGroups(vendorId);
  if (!groups.length)
    return `<p class="tool-install-note">${escape(translate("暂无按量价格快照", language))}</p>`;
  return groups
    .map((group) => {
      // 🔴 来源名是数据（label 是中文）→ 英文页用登记表自带的 labelEn；
      //   两者都缺失时退回静态片段，绝不把中文印到英文页。
      const label =
        language === "en"
          ? (group.source.labelEn ?? translate("官方定价页", language))
          : group.source.label;
      const checked = group.source.checkedAt
        ? ` · ${escape(translate("核实日期", language))} ${escape(group.source.checkedAt.slice(0, 10))}`
        : "";
      const caption = `<p class="pricing-source"><a href="${escape(group.source.url)}" target="_blank" rel="noopener noreferrer">${escape(label)} ↗</a>${checked}</p>`;
      return `${caption}${tableMarkup(group.rows, language)}`;
    })
    .join("");
}
