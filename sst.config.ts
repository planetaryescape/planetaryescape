/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "planetaryescape",
      removal: input?.stage === "prod" ? "retain" : "remove",
      protect: ["prod"].includes(input?.stage),
      home: "cloudflare",
    };
  },
  async run() {
    const domain = $app.stage === "prod"
      ? "planetaryescape.co.za"
      : `${$app.stage}.planetaryescape.co.za`;

    const site = new sst.cloudflare.Astro("Site", {
      domain,
    });

    const api = new sst.cloudflare.Worker("Webring", {
      handler: "webring/index.ts",
      url: true,
      domain: `api.${domain}`,
    });

    return {
      site: site.url,
      api: api.url,
    };
  },
});
