/** Public Agent rankings proxy. No caller headers, credentials or configurable hosts. */
const UPSTREAM = "https://modelgo-web-api.modelgo.ai/api/v1/model-discovery/rankings";
const CACHE = "public, max-age=60, s-maxage=300";

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": status === 200 ? CACHE : "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

export async function onRequest({ request }: { request: Request }): Promise<Response> {
  if (request.method !== "GET") {
    return new Response(null, { status: 405, headers: { Allow: "GET", "Cache-Control": "no-store" } });
  }
  const query = new URL(request.url).searchParams;
  // Keep the public contract narrow. Do not turn this into an arbitrary URL proxy.
  for (const key of query.keys()) {
    if (key !== "page" && key !== "page_size")
      return json({ error: "Unsupported query parameter" }, 400);
  }
  const page = query.get("page") ?? "1";
  const size = query.get("page_size") ?? "50";
  if (!/^[1-9]\d*$/.test(page) || Number(page) > 100 ||
      !/^[1-9]\d*$/.test(size) || Number(size) > 100) {
    return json({ error: "page must be 1–100; page_size must be 1–100" }, 400);
  }
  const upstream = new URL(UPSTREAM);
  upstream.search = new URLSearchParams({
    type: "AGENT", metric: "AGENTIC_INDEX", page, page_size: size,
  }).toString();
  try {
    const response = await fetch(upstream, {
      headers: { Accept: "application/json" },
      // workerd 不支持 redirect: "error"；manual + !ok 把 3xx 一并判为上游不可用。
      redirect: "manual",
      signal: AbortSignal.timeout(12_000),
    });
    if (!response.ok) return json({ error: "Rankings source unavailable" }, 502);
    const payload = await response.json();
    if (payload?.code !== 0 || !Array.isArray(payload?.data?.items) ||
        !Number.isInteger(payload?.data?.total) || payload.data.total < 0 ||
        typeof payload?.data?.snapshot_date !== "string") {
      return json({ error: "Invalid rankings source response" }, 502);
    }
    // Preserve upstream ranking, units, nulls, attribution fields and snapshot date.
    // Rebuild headers: never forward Set-Cookie, CORS or upstream session headers.
    return json(payload);
  } catch {
    return json({ error: "Rankings source unavailable" }, 502);
  }
}
