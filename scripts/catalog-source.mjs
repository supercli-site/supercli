import { readFile } from "node:fs/promises";
import { join } from "node:path";

/**
 * 读取目录真源：主目录 data/catalog.json + 补充目录 data/catalog.extra.json。
 *
 * 两份合起来才是完整目录（见 src/catalog-source.ts）。extra 文件在拆分前
 * 不存在，所以这里对缺失容错 —— 让仍在用旧单文件布局的临时目录与脚本
 * 仍能工作。
 */
export async function readCatalogParts(root = process.cwd()) {
  const read = async (name) => {
    try {
      return JSON.parse(await readFile(join(root, "data", name), "utf8"));
    } catch (error) {
      if (error && error.code === "ENOENT") return [];
      throw error;
    }
  };
  return [...(await read("catalog.json")), ...(await read("catalog.extra.json"))];
}
