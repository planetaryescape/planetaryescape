import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import cloudflare from "@astrojs/cloudflare";

export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },

  site: "https://planetaryescape.co.za",

  compressHTML: true,
  integrations: [sitemap()],
  adapter: cloudflare({
    configPath: process.env.SST_WRANGLER_PATH,
  }),
});