import { describe, expect, test } from "bun:test";

const site = "https://planetaryescape.co.za";
const pages = [
  { path: "", title: "Planetary Escape | Software Services Network" },
  { path: "opensauce", title: "Open Source Projects | Planetary Escape" },
  { path: "discord", title: "Developer Discord Community | Planetary Escape" },
  { path: "webring", title: "Developer Webring | Planetary Escape" },
];

describe("built SEO metadata", () => {
  for (const page of pages) {
    test(`${page.path || "home"} has unique, consistent search and social metadata`, async () => {
      const file = new URL(`../dist/client/${page.path ? `${page.path}/` : ""}index.html`, import.meta.url);
      const html = await Bun.file(file).text();
      const metadata = new Map<string, string[]>();
      let title = "";
      let headings = 0;

      const response = new HTMLRewriter()
        .on("title", { text: (chunk) => { title += chunk.text; } })
        .on("h1", { element: () => { headings += 1; } })
        .on("meta", {
          element(element) {
            const key = element.getAttribute("name") ?? element.getAttribute("property");
            if (key) {
              const values = metadata.get(key) ?? [];
              values.push(element.getAttribute("content") ?? "");
              metadata.set(key, values);
            }
          },
        })
        .on('link[rel="canonical"]', {
          element(element) {
            const values = metadata.get("canonical") ?? [];
            values.push(element.getAttribute("href") ?? "");
            metadata.set("canonical", values);
          },
        })
        .transform(new Response(html));
      await response.text();

      const canonical = `${site}/${page.path ? `${page.path}/` : ""}`;
      expect(title).toBe(page.title);
      expect(headings).toBe(1);
      expect(metadata.get("canonical")).toEqual([canonical]);
      expect(metadata.get("og:url")).toEqual([canonical]);
      expect(metadata.get("og:title")).toEqual([page.title]);
      expect(metadata.get("twitter:title")).toEqual([page.title]);
      const descriptions = metadata.get("description") ?? [];
      expect(descriptions).toHaveLength(1);
      expect(descriptions?.[0]?.length).toBeGreaterThan(50);
      expect(metadata.get("og:description")).toEqual(descriptions);
      expect(metadata.get("twitter:description")).toEqual(descriptions);
      expect(metadata.get("og:site_name")).toEqual(["Planetary Escape"]);
      expect(metadata.get("og:type")).toEqual(["website"]);
      expect(metadata.get("og:image")).toEqual([`${site}/og-image.png`]);
      expect(metadata.get("og:image:type")).toEqual(["image/png"]);
      expect(metadata.get("og:image:width")).toEqual(["1200"]);
      expect(metadata.get("og:image:height")).toEqual(["630"]);
      expect(metadata.get("og:image:alt")).toEqual(["Planetary Escape: Software Services Network"]);
      expect(metadata.get("twitter:image")).toEqual([`${site}/og-image.png`]);
      expect(metadata.get("twitter:image:alt")).toEqual(["Planetary Escape: Software Services Network"]);
      expect(metadata.get("twitter:card")).toEqual(["summary_large_image"]);
      expect(metadata.get("viewport")).toEqual(["width=device-width, initial-scale=1"]);
      expect(html).not.toContain("Add ypour keywords here");
      expect(html).not.toContain("Michael Andreuzza");
      expect(html.match(/<meta charset=/g)).toHaveLength(1);
    });
  }

  test("robots.txt advertises a sitemap containing all canonical pages", async () => {
    const robots = await Bun.file(new URL("../dist/client/robots.txt", import.meta.url)).text();
    const sitemapIndex = await Bun.file(new URL("../dist/client/sitemap-index.xml", import.meta.url)).text();
    const sitemap = await Bun.file(new URL("../dist/client/sitemap-0.xml", import.meta.url)).text();
    expect(robots).toBe(`User-agent: *\nAllow: /\n\nSitemap: ${site}/sitemap-index.xml\n`);
    expect(sitemapIndex).toContain(`${site}/sitemap-0.xml`);
    for (const page of pages) {
      expect(sitemap).toContain(`<loc>${site}/${page.path ? `${page.path}/` : ""}</loc>`);
    }
  });

  test("the published social image is a 1200 by 630 PNG", async () => {
    const image = await Bun.file(new URL("../dist/client/og-image.png", import.meta.url)).arrayBuffer();
    expect(Array.from(new Uint8Array(image, 0, 8))).toEqual([137, 80, 78, 71, 13, 10, 26, 10]);
    const header = new DataView(image);
    expect(header.getUint32(16)).toBe(1200);
    expect(header.getUint32(20)).toBe(630);
  });
});
