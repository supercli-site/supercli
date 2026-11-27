/** 开源端侧小模型排行榜：本地快照 + 前端筛选排序，不依赖外部接口。 */
import "./style.css";
import "./styles/models.css";
import { setupLanguage, language, t } from "./i18n";
import { setupTheme } from "./theme";
import { escapeHtml as escape } from "./escape";
import { setupScrollProgress } from "./scroll-progress";
import { createIcons, GitFork, ArrowUpRight, Search } from "lucide";
import snapshot from "../data/edge-models.json" with { type: "json" };

interface EdgeModel {
  id: string;
  name: string;
  creator: string;
  task: string;
  task_en: string;
  params: string;
  format: string;
  format_en: string;
  license: string;
  deploy_mb: number;
  size_basis: string;
  downloads: number;
  languages: string[];
  source: string;
  note: string;
  note_en: string;
}
type SortKey = "size" | "downloads";

const data = snapshot as {
  snapshot_date: string;
  methodology: Record<string, string>;
  models: EdgeModel[];
};
const models = data.models;
const root = document.querySelector<HTMLElement>("#model-ranking")!;
const statusEl = document.querySelector<HTMLElement>("#ranking-status")!;
const search = document.querySelector<HTMLInputElement>("#models-search")!;
const taskFilter = document.querySelector<HTMLSelectElement>("#models-task")!;
const licenseFilter = document.querySelector<HTMLSelectElement>("#models-license")!;
const sortSelect = document.querySelector<HTMLSelectElement>("#models-sort")!;
const cnOnly = document.querySelector<HTMLInputElement>("#models-cn-only")!;

let keyword = "";
let task = "all";
let license = "all";
let sort: SortKey = "size";
let chineseOnly = false;

function fmtSize(mb: number): string {
  if (mb >= 1024) return `${(mb / 1024).toFixed(2)} GB`;
  return `${mb.toFixed(mb < 10 ? 1 : 0)} MB`;
}
function fmtDownloads(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}K`;
  return String(value);
}
function taskLabel(model: EdgeModel): string {
  return language === "en" ? model.task_en : model.task;
}
function formatLabel(model: EdgeModel): string {
  return language === "en" ? model.format_en : model.format;
}
function noteText(model: EdgeModel): string {
  return language === "en" ? model.note_en : model.note;
}
function licenseBadge(licenseName: string): string {
  const commercial = /^(mit|apache-2\.0)$/i.test(licenseName);
  const cls = commercial ? "model-badge" : "model-badge model-badge-warn";
  return `<span class="${cls}">${escape(licenseName)}</span>`;
}
function rowMarkup(model: EdgeModel, rank: number): string {
  const languages = model.languages.length
    ? model.languages.map((code) => escape(code.toUpperCase())).join(" · ")
    : "—";
  return `<tr>
    <td class="model-rank">${escape(String(rank).padStart(2, "0"))}</td>
    <th scope="row" class="model-name">
      <div class="model-identity">
        <span class="model-logo model-logo-fallback" aria-hidden="true">${escape(model.name.slice(0, 1))}</span>
        <div>
          <span class="model-title"><a href="${escape(model.source)}" target="_blank" rel="noopener noreferrer">${escape(model.name)}<i data-lucide="arrow-up-right" aria-hidden="true"></i></a></span>
          <span class="model-vendor">${escape(model.creator)} · ${escape(model.params)}</span>
        </div>
      </div>
    </th>
    <td class="model-task">${escape(taskLabel(model))}</td>
    <td class="model-format">${escape(formatLabel(model))}</td>
    <td class="model-size"><strong>${fmtSize(model.deploy_mb)}</strong><span class="model-size-basis">${escape(model.size_basis)}</span></td>
    <td class="model-downloads">${fmtDownloads(model.downloads)}</td>
    <td class="model-lang">${languages}</td>
    <td class="model-license">${licenseBadge(model.license)}</td>
  </tr>
  <tr class="model-note-row"><td colspan="8">${escape(noteText(model))}</td></tr>`;
}
function render(): void {
  const filtered = models.filter((model) => {
    if (chineseOnly && !model.languages.includes("zh") && !model.languages.includes("yue")) return false;
    if (task !== "all" && taskLabel(model) !== task) return false;
    if (license !== "all" && model.license !== license) return false;
    if (!keyword) return true;
    const haystack = `${model.name} ${model.creator} ${model.format} ${noteText(model)}`.toLowerCase();
    return haystack.includes(keyword);
  });
  filtered.sort((a, b) =>
    sort === "size" ? a.deploy_mb - b.deploy_mb : b.downloads - a.downloads,
  );
  if (!filtered.length) {
    root.innerHTML = `<p>${t("没有符合条件的小模型，试试放宽筛选。")}</p>`;
    statusEl.dataset.kind = "empty";
    statusEl.textContent = t("没有符合条件的小模型，试试放宽筛选。");
    return;
  }
  const leader = filtered[0];
  document.querySelector("#models-leader-content")!.innerHTML =
    `<div class="models-leader-heading"><span class="model-logo model-logo-fallback" aria-hidden="true">${escape(leader.name.slice(0, 1))}</span><div><h2>${escape(leader.name)}</h2><p>${escape(leader.creator)}</p></div></div>
    <div class="models-leader-score"><strong>${fmtSize(leader.deploy_mb)}</strong><span>${sort === "size" ? t("最小可部署体积") : t("最高下载量")}</span></div>
    <div class="models-leader-footer"><span>${t("任务")} <strong>${escape(taskLabel(leader))}</strong></span><span>${t("许可")} <strong>${escape(leader.license)}</strong></span></div>`;
  root.innerHTML = `<div class="model-table-scroll"><table class="model-table">
    <caption class="sr-only">${t("开源端侧小模型排行")} · ${escape(data.snapshot_date)}</caption>
    <thead><tr>
      <th scope="col">#</th><th scope="col">${t("模型")}</th>
      <th scope="col">${t("任务")}</th><th scope="col">${t("格式")}</th>
      <th scope="col">${t("可部署体积")}</th><th scope="col">${t("下载量")}</th>
      <th scope="col">${t("语言")}</th><th scope="col">${t("许可")}</th>
    </tr></thead>
    <tbody>${filtered.map((model, index) => rowMarkup(model, index + 1)).join("")}</tbody>
  </table></div>`;
  statusEl.dataset.kind = "ready";
  statusEl.textContent = language === "en"
    ? `${filtered.length} of ${models.length} models · Snapshot: ${data.snapshot_date}`
    : `共 ${models.length} 个模型 · 当前显示 ${filtered.length} 个 · 数据快照：${data.snapshot_date}`;
  createIcons({ icons: { ArrowUpRight } });
}
function fillOptions(): void {
  const tasks = [...new Set(models.map((model) => taskLabel(model)))].sort();
  const licenses = [...new Set(models.map((model) => model.license))].sort();
  for (const value of tasks) {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;
    taskFilter.append(option);
  }
  for (const value of licenses) {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;
    licenseFilter.append(option);
  }
}
search.addEventListener("input", () => {
  keyword = search.value.trim().toLowerCase();
  render();
});
taskFilter.addEventListener("change", () => {
  task = taskFilter.value;
  render();
});
licenseFilter.addEventListener("change", () => {
  license = licenseFilter.value;
  render();
});
sortSelect.addEventListener("change", () => {
  sort = sortSelect.value === "downloads" ? "downloads" : "size";
  render();
});
cnOnly.addEventListener("change", () => {
  chineseOnly = cnOnly.checked;
  render();
});
document.querySelector("#models-total")!.textContent = String(models.length);
document.querySelector("#models-date")!.textContent = data.snapshot_date;
const methodology = document.querySelector<HTMLElement>("#models-methodology");
if (methodology) {
  const key = language === "en" ? "scope" : "scope";
  methodology.textContent = data.methodology[key];
}
const sizeBasisEl = document.querySelector<HTMLElement>("#models-size-basis");
if (sizeBasisEl) sizeBasisEl.textContent = data.methodology.size_basis;
const licenseEl = document.querySelector<HTMLElement>("#models-license-note");
if (licenseEl) licenseEl.textContent = data.methodology.license_note;
fillOptions();
render();
setupTheme();
setupLanguage();
setupScrollProgress();
createIcons({ icons: { GitFork, ArrowUpRight, Search } });
