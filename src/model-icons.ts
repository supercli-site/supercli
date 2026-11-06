/**
 * 模型与提供方品牌图标映射，使用本地 Lobe Icons 1.102.0 SVG 子集。
 * 路由：/models；数据来源：公开 model-discovery/rankings API。
 * 图标许可、来源与缺口见 public/model-icons/README.md；单色图标需白色底片。
 */

const PROVIDERS: ReadonlyMap<string, string> = new Map([
  ["alibaba", "alibaba-color"],
  ["anthropic", "anthropic"],
  ["arcee ai", "arcee-color"],
  ["cohere", "cohere-color"],
  ["deepseek", "deepseek-color"],
  ["google", "google-color"],
  ["ibm", "ibm"],
  ["inception", "inception"],
  ["kimi", "kimi-color"],
  ["longcat", "longcat-color"],
  ["meta", "meta-color"],
  ["minimax", "minimax-color"],
  ["mistral", "mistral-color"],
  ["nvidia", "nvidia-color"],
  ["openai", "openai"],
  ["spacexai", "xai"],
  ["tencent", "tencent-color"],
  ["upstage", "upstage-color"],
  ["z ai", "zai"],
]);

type Family = readonly [creator: string, name: RegExp, slug: string];

// 仅匹配名称开头，并校验提供方，避免误认括号中提及的基础模型或同名模型。
const FAMILIES: readonly Family[] = [
  ["anthropic", /^claude(?=[\s\d-]|$)/i, "claude-color"],
  ["google", /^gemini(?=[\s\d-]|$)/i, "gemini-color"],
  ["google", /^gemma(?=[\s\d-]|$)/i, "gemma-color"],
  ["alibaba", /^qwen(?=[\s\d.-]|$)/i, "qwen-color"],
  ["deepseek", /^deepseek(?=[\s\d-]|$)/i, "deepseek-color"],
  ["openai", /^(?:gpt(?=[\s\d-]|$)|o[134](?=[\s-]|$))/i, "openai"],
  ["z ai", /^glm(?=[\s\d-]|$)/i, "zai"],
  ["spacexai", /^grok(?=[\s\d-]|$)/i, "grok"],
  ["kimi", /^kimi(?=[\s\d-]|$)/i, "kimi-color"],
  ["meta", /^muse(?=[\s-]|$)/i, "muse-color"],
  ["minimax", /^minimax(?=[\s\d-]|$)/i, "minimax-color"],
  ["xiaomi", /^mimo(?=[\s\d-]|$)/i, "xiaomimimo"],
  ["inclusionai", /^ling(?=[\s\d-]|$)/i, "ling-color"],
  ["longcat", /^longcat(?=[\s\d-]|$)/i, "longcat-color"],
  ["mistral", /^mistral(?=[\s\d-]|$)/i, "mistral-color"],
  ["nvidia", /^nemotron(?=[\s\d-]|$)/i, "nvidia-color"],
  ["ibm", /^granite(?=[\s\d-]|$)/i, "ibm"],
  ["inception", /^mercury(?=[\s\d-]|$)/i, "inception"],
  ["upstage", /^solar(?=[\s\d-]|$)/i, "upstage-color"],
  ["cohere", /^command\s+a(?=[\s+-]|$)/i, "commanda-color"],
  ["arcee ai", /^trinity(?=[\s-]|$)/i, "arcee-color"],
];

function iconUrl(slug: string): string {
  return `/model-icons/${slug}.svg`;
}

/** 返回提供方的本地图标；大小写不敏感，未知或缺失品牌返回 null。 */
export function providerIcon(creator: string | null): string | null {
  const slug = PROVIDERS.get(creator?.trim().toLowerCase() ?? "");
  return slug ? iconUrl(slug) : null;
}

/** 返回已确认模型家族的本地图标；提供方冲突或未知家族返回 null。 */
export function modelIcon(modelName: string, creator: string | null): string | null {
  const name = modelName.trim();
  const provider = creator?.trim().toLowerCase();
  const family = FAMILIES.find(
    ([owner, pattern]) => (!provider || provider === owner) && pattern.test(name),
  );
  return family ? iconUrl(family[2]) : null;
}
