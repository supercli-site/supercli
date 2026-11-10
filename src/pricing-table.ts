/** 按量 API 价格表：从官方定价巡检登记表渲染，目录条目不写死价格数字。
 *
 * 🔴 为什么要单源（2026-11-11）：
 *   价格会过期，而且**各家的促销期各不相同**（Gemini 3.8 Flash 到 2026-12-31 才恢复原价）。
 *   之前目录条目里手写了一句价格说明 —— 那份数字不会随巡检更新，
 *   迟早和官方页面对不上。
 *   真源是 data/pricing-sources.json：它由 `pnpm pricing:check` 巡检
 *   （可达性 + 页面指纹 + 回写核对时间），每条价格都带官方链接与核实时间。
 *   目录条目只记 **pricingSourceId**（厂商），价格由这里渲染。
 *
 * 🔴 为什么输出是语言中立的：
 *   登记表里 unit 是枚举（CNY_PER_1M_INPUT_TOKENS…）、model 是拉丁字符，
 *   只有 item 是中文说明。所以表格用 model + 方向（由 unit 推导）+ 数值 + 单位，
 *   中英两页共用同一份 DOM，不用翻译机制兜（翻译机制不翻译数据）。
 */
import pricingSources from "../data/pricing-sources.json" with { type: "json" };

export interface PriceRow {
  readonly model: string;
  readonly direction: "input" | "output" | "cache" | "monthly" | "other";
  readonly value: number;
  readonly unit: string;
  readonly item: string;
  readonly currency: "CNY" | "USD" | null;
  readonly scale: string;
  /** 档位说明（语言中立的两份：中文与英文），来自登记表。 */
  readonly note: string | null;
  readonly noteEn: string | null;
}

interface Registry {
  vendors: {
    id: string;
    name: string;
    sources: {
      kind: string;
      url: string;
      label: string;
      labelEn?: string;
      primary?: boolean;
      checkedAt?: string;
      httpStatus?: number;
      prices?: {
        item: string;
        value: number;
        unit: string;
        quote?: string;
        model?: string;
        note?: string;
        noteEn?: string;
      }[];
    }[];
  }[];
}

const registry = pricingSources as unknown as Registry;

/** 单位 → 方向：只认已登记的枚举，未知的归 other（不猜）。 */
function directionOf(unit: string): PriceRow["direction"] {
  if (unit.includes("INPUT_TOKENS")) return "input";
  if (unit.includes("OUTPUT_TOKENS")) return "output";
  if (unit.includes("CACHE_READ_TOKENS")) return "cache";
  if (unit.includes("MONTH") || unit.includes("SEAT")) return "monthly";
  return "other";
}

/** 单位 → 币种与计价规模；用于表头说明，不参与数值换算。 */
function scaleOf(unit: string): { currency: PriceRow["currency"]; scale: string } {
  if (unit.startsWith("CNY")) return { currency: "CNY", scale: "1M tokens" };
  if (unit.startsWith("USD")) return { currency: "USD", scale: "1M tokens" };
  return { currency: null, scale: "" };
}

/**
 * 取某个厂商登记的按量价格行。
 *
 * @param vendorId 目录条目里的 pricingSourceId
 * @param kind 只取该类别的来源（api_pricing = 按量 API 价格；订阅类不混进来）
 */
export function priceRows(vendorId: string, kind = "api_pricing"): PriceRow[] {
  const vendor = registry.vendors.find((entry) => entry.id === vendorId);
  if (!vendor) return [];
  const rows: PriceRow[] = [];
  for (const source of vendor.sources) {
    if (source.kind !== kind) continue;
    for (const price of source.prices ?? []) {
      const { currency, scale } = scaleOf(price.unit);
      rows.push({
        model: price.model ?? price.item,
        direction: directionOf(price.unit),
        value: price.value,
        unit: price.unit,
        item: price.item,
        currency,
        scale,
        // 🔴 档位说明（促销期 / 时段 / 阈值）必须显示 ——
        //   同一个模型同一方向出现两个价格时，没有说明用户分不清哪个是哪个。
        note: price.note ?? null,
        noteEn: price.noteEn ?? null,
      });
    }
  }
  return rows;
}

/** 该厂商的官方定价链接与核实时间（渲染成「来源」脚注）。 */
export function pricingSource(
  vendorId: string,
  kind = "api_pricing",
): { url: string; label: string; labelEn: string | null; checkedAt: string | null } | null {
  const vendor = registry.vendors.find((entry) => entry.id === vendorId);
  if (!vendor) return null;
  const source =
    vendor.sources.find((entry) => entry.kind === kind && entry.primary) ??
    vendor.sources.find((entry) => entry.kind === kind);
  if (!source) return null;
  return {
    url: source.url,
    label: source.label,
    // 🔴 来源名是**数据**，翻译机制不翻译数据 —— 英文页用登记表自带的 labelEn。
    labelEn: source.labelEn ?? null,
    checkedAt: source.checkedAt ?? null,
  };
}
