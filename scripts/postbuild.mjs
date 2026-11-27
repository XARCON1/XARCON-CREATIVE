import { readFile, writeFile, mkdir } from "node:fs/promises";
const pages = JSON.parse(
  await readFile(new URL("../src/content/seo.json", import.meta.url), "utf8"),
);
const base = await readFile("dist/index.html", "utf8");
const escape = (s) =>
  s
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
for (const page of Object.values(pages)) {
  if (page.path === "/") continue;
  const html = base
    .replace(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/, (full, json) => {
      const schema = JSON.parse(json);
      schema["@graph"] = schema["@graph"].filter((node) => node["@type"] !== "WebSite");
      return `<script type="application/ld+json">${JSON.stringify(schema)}</script>`;
    })
    .replace(/<title>.*?<\/title>/, `<title>${escape(page.title)}</title>`)
    .replace(
      /(<meta\s+name="description"\s+content=")[^"]*/,
      `$1${escape(page.description)}`,
    )
    .replace(
      /(<meta\s+property="og:title"\s+content=")[^"]*/,
      `$1${escape(page.title)}`,
    )
    .replace(
      /(<meta\s+property="og:description"\s+content=")[^"]*/,
      `$1${escape(page.description)}`,
    )
    .replace(
      /(<meta\s+property="og:url"\s+content=")[^"]*/,
      `$1https://www.xarcontech.com${page.path}`,
    )
    .replace(
      /(<link\s+rel="canonical"\s+href=")[^"]*/,
      `$1https://www.xarcontech.com${page.path}`,
    );
  await mkdir("dist" + page.path, { recursive: true });
  await writeFile("dist" + page.path + "/index.html", html);
}
await writeFile(
  "dist/sitemap.xml",
  `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${Object.values(
    pages,
  )
    .map(
      (p) =>
        `<url><loc>https://www.xarcontech.com${p.path}</loc></url>`,
    )
    .join("")}</urlset>`,
);
await writeFile(
  "dist/robots.txt",
  "User-agent: *\nAllow: /\nDisallow: /__review.html\nDisallow: /__hero/\nDisallow: /__stage/\nSitemap: https://www.xarcontech.com/sitemap.xml\n",
);
console.log(
  "Metadata específica, canonical y sitemap generados para las páginas públicas.",
);
