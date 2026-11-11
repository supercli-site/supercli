/** 构建与本地遥测配置；路由：/，数据来自仓库快照。 */
import { localizedPages } from "./scripts/localized-plugin.ts";
import { rankingsDevApi } from "./scripts/rankings-dev-plugin.ts";
import { defineConfig } from "vite";
import { agentEyes } from "vite-plugin-agent-eyes";
// Keep the global credential scanner active when local hooksPath is enabled.
const chainGlobalPreCommit = 'g=$(git config --global --get core.hooksPath); [ -z "$g" ] || [ ! -x "$g/pre-commit" ] || "$g/pre-commit"';
export default defineConfig({
  plugins: [...agentEyes({
    git: { precommit: [chainGlobalPreCommit] },
    guard: { level: "block", checks: { designTokens: { tokenFiles: ["src/styles/tokens.css", "src/styles/tokens-dark.css"] } } },
    agentDocs: false,
    visual: false,
  }), rankingsDevApi(), localizedPages()],
  build: {
    rollupOptions: {
      input: {
        main: "index.html",
        brand: "brand.html",
        standards: "standards.html",
        guides: "guides.html",
        models: "models.html",
      },
    },
  },
  server: { port: 5179, strictPort: true },
});
