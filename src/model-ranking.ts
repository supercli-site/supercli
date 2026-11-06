/** Agent rankings: render the public snapshot via SuperCLI's same-origin proxy. */
import "./style.css";
import "./styles/models.css";
import { setupLanguage, language, t } from "./i18n";
import { setupTheme } from "./theme";
import { escapeHtml as escape } from "./escape";
import { setupScrollProgress } from "./scroll-progress";
import { createIcons, GitFork, ChevronLeft, ChevronRight, RefreshCw, ArrowUpRight } from "lucide";
import { modelIcon, providerIcon } from "./model-icons";
import pricingSources from "../data/pricing-sources.json" with { type: "json" };

interface RankingRow {
  rank: number;
  model_name: string;
  creator_name: string | null;
  value: number | null;
  cost_value: number | null;
  cost_unit: string | null;
  output_tps: number | null;
  release_date: string | null;
  is_open_source: boolean | null;
}
interface RankingsSnapshot {
  snapshot_date: string;
  total: number;
  page: number;
  page_size: number;
  items: RankingRow[];
}
/** 厂商 → 官方定价源；登记表是本站唯一的官方价格来源真源。 */
interface PricingSource {
  kind: string;
  url: string;
  label?: string;
  primary?: boolean;
  rendered?: boolean;
}
const registry = pricingSources as {
  vendors: {
    id: string;
    name: string;
    upstreamCreators?: string[];
    sources: PricingSource[];
  }[];
};
const pricingLinks = new Map<string, { kind: string; url: string }[]>();
for (const vendor of registry.vendors) {
  const creators = vendor.upstreamCreators?.length ? vendor.upstreamCreators : [vendor.name];
  const links = vendor.sources
    .filter((source) => source.primary)
    .map((source) => ({ kind: source.kind, url: source.url }));
  for (const creator of creators) pricingLinks.set(creator, links);
}
const root = document.querySelector<HTMLElement>("#model-ranking")!;
const statusEl = document.querySelector<HTMLElement>("#ranking-status")!;
const previous = document.querySelector<HTMLButtonElement>("#models-previous")!;
const next = document.querySelector<HTMLButtonElement>("#models-next")!;
const retry = document.querySelector<HTMLButtonElement>("#models-retry")!;
const pageLabel = document.querySelector<HTMLElement>("#models-page")!;
const pageSize = 50;
let page = 1;
let total = 0;
let loading = false;

function number(value: number | null | undefined, digits = 1): string {
  return typeof value === "number" && Number.isFinite(value) ? value.toFixed(digits) : "—";
}
function costMarkup(row: RankingRow): string {
  if (row.cost_value == null) return "—";
  if (row.cost_unit === "USD_PER_TASK")
    return row.cost_value > 0 && row.cost_value < 0.005 ? "&lt;$0.01" : `$${number(row.cost_value, 2)}`;
  return `${number(row.cost_value, 2)} ${escape(row.cost_unit ?? "")}`;
}
function logoMarkup(row: RankingRow): string {
  const icon = modelIcon(row.model_name, row.creator_name);
  return icon
    ? `<span class="model-logo"><img src="${icon}" alt="" width="28" height="28" loading="lazy"></span>`
    : `<span class="model-logo model-logo-fallback" aria-hidden="true">${escape((row.model_name || "?").slice(0, 1))}</span>`;
}
function vendorMarkup(row: RankingRow): string {
  const icon = providerIcon(row.creator_name);
  const links = row.creator_name ? (pricingLinks.get(row.creator_name) ?? []) : [];
  const official = links
    .map(
      (link) =>
        `<a class="model-official-price" href="${escape(link.url)}" target="_blank" rel="noopener noreferrer">${escape(t(link.kind === "subscription_plan" ? "官方套餐" : "官方价"))}</a>`,
    )
    .join("");
  return `<span class="model-vendor">${icon ? `<span class="model-provider-icon"><img src="${icon}" alt="" width="14" height="14" loading="lazy"></span>` : ""}${escape(row.creator_name ?? t("未知厂商"))}${official}</span>`;
}
function rowMarkup(row: RankingRow): string {
  const score = typeof row.value === "number" && Number.isFinite(row.value) ? Math.min(100, Math.max(0, row.value)) : null;
  return `<tr>
    <td class="model-rank">${escape(String(row.rank).padStart(2, "0"))}</td>
    <th scope="row" class="model-name"><div class="model-identity">${logoMarkup(row)}<div><span class="model-title">${escape(row.model_name ?? "")}</span>${vendorMarkup(row)}</div></div></th>
    <td class="model-score"><strong>${number(row.value)}</strong>${score == null ? "" : `<span class="model-score-track" aria-hidden="true"><span style="width:${score}%"></span></span>`}</td>
    <td class="model-cost">${costMarkup(row)}</td>
    <td class="model-tps">${number(row.output_tps)}</td>
    <td class="model-release">${escape(row.release_date ?? "—")}</td>
    <td>${row.is_open_source ? `<span class="model-badge">${t("开放权重")}</span>` : ""}</td>
  </tr>`;
}
function renderLeader(row: RankingRow): void {
  document.querySelector("#models-leader-content")!.innerHTML =
    `<div class="models-leader-heading">${logoMarkup(row)}<div><h2>${escape(row.model_name)}</h2><p>${escape(row.creator_name ?? t("未知厂商"))}</p></div></div>
    <div class="models-leader-score"><strong>${number(row.value)}</strong><span>Agentic Index</span></div>
    <div class="models-leader-footer"><span>${t("单任务成本")} <strong>${costMarkup(row)}</strong></span><span>${t("当期排名")} <strong>#${escape(String(row.rank))}</strong></span></div>`;
}
function tableMarkup(snapshot: RankingsSnapshot): string {
  return `<div class="model-table-scroll"><table class="model-table">
    <caption class="sr-only">${t("Agent 模型排行")} · ${escape(snapshot.snapshot_date)}</caption>
    <thead><tr><th scope="col">#</th><th scope="col">${t("模型")}</th>
    <th scope="col">${t("Agentic 指数")}</th><th scope="col">${t("单任务成本")}</th>
    <th scope="col">${t("输出 TPS")}</th><th scope="col">${t("发布")}</th>
    <th scope="col">${t("标签")}</th></tr></thead>
    <tbody>${snapshot.items.map(rowMarkup).join("")}</tbody></table></div>`;
}
function controls(): void {
  previous.disabled = loading || page <= 1;
  next.disabled = loading || page * pageSize >= total;
  retry.disabled = loading;
}
async function loadRankings(targetPage = page): Promise<void> {
  if (loading) return;
  loading = true;
  controls();
  statusEl.dataset.kind = "loading";
  statusEl.textContent = t("正在加载模型排行…");
  root.setAttribute("aria-busy", "true");
  try {
    const response = await fetch(`/api/models/rankings/agent?page=${targetPage}&page_size=${pageSize}`, {
      headers: { Accept: "application/json" }, signal: AbortSignal.timeout(18_000),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const payload = await response.json();
    const data: RankingsSnapshot = payload?.data;
    if (payload?.code !== 0 || !Array.isArray(data?.items) ||
        !Number.isInteger(data.total) || typeof data.snapshot_date !== "string")
      throw new Error("Invalid snapshot");
    page = targetPage;
    total = data.total;
    document.querySelector("#models-total")!.textContent = String(data.total);
    document.querySelector("#models-date")!.textContent = data.snapshot_date;
    if (targetPage === 1 && data.items[0]) renderLeader(data.items[0]);
    root.innerHTML = data.items.length ? tableMarkup(data) : `<p>${t("暂无排行数据")}</p>`;
    pageLabel.textContent = `${page} / ${Math.max(1, Math.ceil(total / pageSize))}`;
    statusEl.dataset.kind = "ready";
    statusEl.textContent = language === "en"
      ? `${total} models · Snapshot: ${data.snapshot_date} · Agentic Index`
      : `共 ${total} 个模型 · 数据快照：${data.snapshot_date} · Agentic Index`;
  } catch {
    const placeholder = document.querySelector(".models-leader-loading");
    if (placeholder) placeholder.textContent = t("模型排行暂时不可用，请稍后重试。");
    statusEl.dataset.kind = "error";
    statusEl.textContent = t("模型排行暂时不可用，请稍后重试。");
  } finally {
    loading = false;
    controls();
    root.setAttribute("aria-busy", "false");
  }
}
previous.addEventListener("click", () => void loadRankings(page - 1));
next.addEventListener("click", () => void loadRankings(page + 1));
retry.addEventListener("click", () => void loadRankings());
setupTheme();
setupLanguage();
setupScrollProgress();
createIcons({ icons: { GitFork, ChevronLeft, ChevronRight, RefreshCw, ArrowUpRight } });
void loadRankings();
