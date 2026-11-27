/**
 * 目录真源的唯一聚合入口。
 *
 * 为什么要拆成两份：data/catalog.json 是纯手写数据文件，100 条目时 1340 行，
 * 超过 agent-eyes pre-commit 的 fileLength block 阈值（800 行）——只要它被
 * staged 就必然被拦，导致任何一条收录更新都提交不了（见 CS 单
 * t_202611250327044911f0）。
 *
 * 拆法与约束：
 *  · data/catalog.json 承载前半条目录，data/catalog.extra.json 承载后半条，
 *    两份都在阈值以下，无需改动任何门禁阈值或钩子；
 *  · 消费方一律从这里取 catalog，不要直接 import 单个数据文件，否则会漏掉
 *    extra 那半条；
 *  · 拼接顺序即目录顺序，改动时请保持两份的先后关系。
 */
import base from "../data/catalog.json" with { type: "json" };
import extra from "../data/catalog.extra.json" with { type: "json" };

/**
 * 条目类型取两份数据文件的联合：两份文件里同名字段的字面量形态不同
 * （例如 install 有 null 与字符串两种写法，api 只存在于补充目录），
 * 只取其中一份的类型会把另一份的合法条目判为不兼容。
 */
export type CatalogEntry = (typeof base)[number] | (typeof extra)[number];

/** 完整目录条目：主目录 + 补充目录，顺序与原始单文件一致。 */
export const catalog: readonly CatalogEntry[] = [...base, ...extra];

export default catalog;
