/** 模型排行转发接口与页面契约：只读公开快照、参数受限、缺值保持为空。 */
import assert from "node:assert/strict";
import test from "node:test";
import { onRequest } from "../functions/api/models/rankings/agent.ts";

const makeRequest = (url, method = "GET") => new Request(url, { method });

test("rankings proxy rejects non-GET methods", async () => {
  const response = await onRequest({ request: makeRequest("https://supercli.site/api/models/rankings/agent", "POST") });
  assert.equal(response.status, 405);
  assert.equal(response.headers.get("Allow"), "GET");
});

test("rankings proxy rejects unknown query parameters", async () => {
  const response = await onRequest({
    request: makeRequest("https://supercli.site/api/models/rankings/agent?url=https://evil.example"),
  });
  assert.equal(response.status, 400);
});

test("rankings proxy rejects out-of-range paging", async () => {
  for (const query of ["page=0", "page=101", "page_size=0", "page_size=101", "page=abc"]) {
    const response = await onRequest({
      request: makeRequest(`https://supercli.site/api/models/rankings/agent?${query}`),
    });
    assert.equal(response.status, 400, query);
  }
});

test("rankings proxy forwards only the fixed upstream contract", async () => {
  const original = globalThis.fetch;
  let seen = null;
  globalThis.fetch = async (input, init) => {
    seen = { url: String(input), init };
    return new Response(
      JSON.stringify({
        code: 0,
        msg: "ok",
        data: {
          snapshot_date: "2026-11-03",
          type: "AGENT",
          metric: "AGENTIC_INDEX",
          total: 2,
          page: 1,
          page_size: 2,
          items: [
            {
              rank: 1,
              value: 57.9,
              model_name: "Model A",
              creator_name: "Vendor",
              cost_value: 7.6297,
              cost_unit: "USD_PER_TASK",
              output_tps: 69.28,
              release_date: "2026-09-01",
              is_open_source: false,
              is_integrated: true,
            },
            {
              rank: 2,
              value: null,
              model_name: "Model B",
              creator_name: null,
              cost_value: null,
              cost_unit: null,
              output_tps: null,
              release_date: null,
              is_open_source: null,
              is_integrated: null,
            },
          ],
        },
      }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  };
  try {
    const response = await onRequest({
      request: makeRequest("https://supercli.site/api/models/rankings/agent?page=1&page_size=2"),
    });
    assert.equal(response.status, 200);
    assert.equal(response.headers.get("X-Content-Type-Options"), "nosniff");
    assert.match(response.headers.get("Cache-Control") ?? "", /max-age/);

    const url = new URL(seen.url);
    assert.equal(url.origin, "https://modelgo-web-api.modelgo.ai");
    assert.equal(url.pathname, "/api/v1/model-discovery/rankings");
    assert.equal(url.searchParams.get("type"), "AGENT");
    assert.equal(url.searchParams.get("metric"), "AGENTIC_INDEX");
    assert.equal(url.searchParams.get("page"), "1");
    assert.equal(url.searchParams.get("page_size"), "2");

    // 不转发调用方的 Origin、Cookie 或鉴权头。
    const headers = new Headers(seen.init?.headers);
    for (const forbidden of ["origin", "cookie", "authorization", "referer", "x-market"]) {
      assert.equal(headers.get(forbidden), null, forbidden);
    }

    const payload = await response.json();
    assert.equal(payload.data.total, 2);
    // 空值保持为空，不能补 0。
    assert.equal(payload.data.items[1].value, null);
    assert.equal(payload.data.items[1].cost_value, null);
    assert.equal(payload.data.items[1].release_date, null);
  } finally {
    globalThis.fetch = original;
  }
});

test("rankings proxy fails closed on malformed upstream payloads", async () => {
  const original = globalThis.fetch;
  globalThis.fetch = async () =>
    new Response(JSON.stringify({ code: 0, data: { snapshot_date: 42, total: "many" } }), {
      status: 200,
    });
  try {
    const response = await onRequest({
      request: makeRequest("https://supercli.site/api/models/rankings/agent"),
    });
    assert.equal(response.status, 502);
    assert.equal(response.headers.get("Cache-Control"), "no-store");
  } finally {
    globalThis.fetch = original;
  }
});

test("rankings proxy reports upstream outages without leaking internals", async () => {
  const original = globalThis.fetch;
  globalThis.fetch = async () => {
    throw new Error("socket hang up: internal-host-name");
  };
  try {
    const response = await onRequest({
      request: makeRequest("https://supercli.site/api/models/rankings/agent"),
    });
    assert.equal(response.status, 502);
    const payload = await response.json();
    assert.deepEqual(payload, { error: "Rankings source unavailable" });
  } finally {
    globalThis.fetch = original;
  }
});

