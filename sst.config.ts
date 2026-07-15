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

    const site = new sst.cloudflare.StaticSiteV2("Site", {
      domain,
      build: {
        command: "bun run build",
        output: "dist",
      },
    });

    return {
      site: site.url,
    };
  },
});
