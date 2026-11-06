/** Run the same Pages handler during Vite development (no separate proxy contract). */
import type { Plugin } from "vite";
import { onRequest } from "../functions/api/models/rankings/agent.ts";
export function rankingsDevApi(): Plugin {
  return {
    name: "supercli-rankings-api",
    configureServer(server) {
      server.middlewares.use(async (request, response, next) => {
        const url = new URL(request.url ?? "/", "http://localhost");
        if (url.pathname !== "/api/models/rankings/agent") return next();
        const result = await onRequest({ request: new Request(url, { method: request.method }) });
        response.statusCode = result.status;
        result.headers.forEach((value, key) => response.setHeader(key, value));
        response.end(await result.text());
      });
    },
  };
}
