import assert from "node:assert/strict";
import test from "node:test";

const developmentPreviewMeta =
  /<meta(?=[^>]*\bname=["']codex-preview["'])(?=[^>]*\bcontent=["']development["'])[^>]*>/i;

test("renders development preview metadata", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  const response = await worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );

  assert.equal(response.status, 200);
  assert.match(
    response.headers.get("content-type") ?? "",
    /^text\/html\b/i,
  );
  assert.match(await response.text(), developmentPreviewMeta);
});

test("renders the professional public routes without staging copy", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("routes", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  const routes = ["/", "/simulados", "/simulados/enem-2025", "/simulados/enem-2025/prova", "/contato", "/termos", "/privacidade"];

  for (const route of routes) {
    const response = await worker.fetch(
      new Request(`http://localhost${route}`, { headers: { accept: "text/html" } }),
      { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
      { waitUntil() {}, passThroughOnException() {} },
    );
    const html = await response.text();

    assert.equal(response.status, 200, `${route} should render`);
    assert.doesNotMatch(html, /\bMVP\b|projeto em constru[cç][aã]o|pagamento [uú]nico no MVP/i);
    assert.doesNotMatch(html, /Let[ií]cia|>LE</i);
  }
});

test("links directly to the requested ENEM day and exposes verified 2025 sources", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("ux", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  const catalogResponse = await worker.fetch(
    new Request("http://localhost/simulados", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
  const catalogHtml = await catalogResponse.text();
  assert.match(catalogHtml, /Natureza e Matem[aá]tica/);
  assert.match(catalogHtml, /enem-2025-dia-2/);

  const enemResponse = await worker.fetch(
    new Request("http://localhost/simulados/enem-2025", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
  const enemHtml = await enemResponse.text();
  assert.match(enemHtml, /download\.inep\.gov\.br\/enem\/provas_e_gabaritos\/2025_PV_impresso_D2_CD7\.pdf/);
  assert.match(enemHtml, /Cadernos originais/);
});

test("leads with simulations and links pricing consent to legal pages", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("home", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  const response = await worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
  const html = await response.text();

  assert.match(html, /Treine como na prova/);
  assert.match(html, /Fazer simulado gr[aá]tis/);
  assert.match(html, /href=["']\/termos["']/);
  assert.match(html, /href=["']\/privacidade["']/);
});
