/** CLI 目录查询；路由：/；来源：人工收录清单与本地刷新快照。 */
import { t } from "./i18n";
import englishDescriptions from "../data/catalog.en.json";
import rawCatalog from "../data/catalog.json";
import rawUsage from "../data/usage.json";
import rawMetrics from "../data/metrics.json";
import rawCategories from "../data/categories.json";
const categories = Object.fromEntries(
  Object.entries(rawCategories).map(([key, label]) => [key, t(label)]),
);
/** 纯 API 服务的接入与计费信息；只有 category=api 的条目带这个对象。 */
export interface ApiEntry {
  readonly endpoint: string;
  readonly protocol: string;
  readonly auth: string;
  readonly pricing: string;
  readonly sdk?: string;
  readonly priceNote?: string;
}
/** 公开目录条目；非 GitHub CLI 使用官方文档，不虚构仓库。 */
export interface Entry {
  readonly id: string;
  readonly name: string;
  readonly vendor: string;
  readonly category: string;
  readonly repo: string | null;
  readonly description: string;
  readonly install: string | null;
  readonly docs: string;
  readonly icon: string;
  readonly locallyInstalled?: boolean;
  readonly maintainerType: "vendor" | "community";
  /**
   * 纯 API 服务的接入信息。
   *
   * 🔴 为什么要单列一个字段而不是塞进 description：
   *   「装进终端」和「按量调接口」是两种不同的使用形态，
   *   用户的判断依据也不同（前者看安装命令与仓库热度，后者看端点、鉴权与计费）。
   *   目录页与详情页按 category=api 走各自的呈现，不混在一张「安装方式」表里。
   */
  readonly api?: ApiEntry;
}
/** 指标只表示仓库关注度，无可比数据的条目为 null。 */
export interface Metric {
  readonly repo: string;
  readonly stars: number;
  readonly forks: number;
  readonly pushedAt: string;
  readonly archived: boolean;
  readonly language: string | null;
  readonly license: string | null;
}
export interface Usage {
  readonly package: string;
  readonly repo: string | null;
  readonly downloads: number;
  readonly start: string;
  readonly end: string;
}
export const usageSnapshot: {
  readonly fetchedAt: string;
  readonly packages: Readonly<Record<string, Usage | null>>;
} = rawUsage;
export function usage(item: Entry): Usage | null {
  return usageSnapshot.packages[item.id] ?? null;
}
const catalog: readonly Entry[] = rawCatalog.map((item) => {
  const maintainerType = item.maintainerType;
  if (maintainerType !== "vendor" && maintainerType !== "community")
    throw new Error(`Invalid maintainer type: ${item.id}`);
  return { ...item, maintainerType };
});
const metrics: {
  readonly fetchedAt: string;
  readonly repositories: Readonly<Record<string, Metric | null>>;
} = rawMetrics;
/** 读取指标，null 表示未计分。 */
export function stats(item: Entry): Metric | null {
  return metrics.repositories[item.id] ?? null;
}
/** 组合筛选与不可变排序；无指标条目始终放在数字榜单之后。 */
export function queryEntries(
  search: string,
  category: string,
  vendor: string,
  sort: string,
  maintainerType = "",
): Entry[] {
  const query = search.trim().toLocaleLowerCase();
  return catalog
    .filter(
      (item) =>
        (!maintainerType || item.maintainerType === maintainerType) &&
        (!category || item.category === category) &&
        (!vendor || item.vendor === vendor) &&
        [
          item.name,
          item.vendor,
          t(item.vendor),
          item.description,
          englishDescriptions[item.id as keyof typeof englishDescriptions],
          rawCategories[item.category as keyof typeof rawCategories],
          item.repo,
          item.install,
          categories[item.category as keyof typeof categories],
        ]
          .join(" ")
          .toLocaleLowerCase()
          .includes(query),
    )
    .toSorted((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name);
      if (sort === "downloads") {
        const left = usage(a);
        const right = usage(b);
        return left && right
          ? right.downloads - left.downloads || a.name.localeCompare(b.name)
          : Number(!!right) - Number(!!left) || a.name.localeCompare(b.name);
      }
      const left = stats(a);
      const right = stats(b);
      if (!left || !right)
        return Number(!!right) - Number(!!left) || a.name.localeCompare(b.name);
      if (sort === "updated")
        return (
          Date.parse(right.pushedAt) - Date.parse(left.pushedAt) ||
          a.name.localeCompare(b.name)
        );
      return right.stars - left.stars || a.name.localeCompare(b.name);
    });
}
export const maintainerLabels = {
  vendor: t("厂商官方"),
  community: t("社区项目"),
} as const;
export { catalog, categories, metrics };
