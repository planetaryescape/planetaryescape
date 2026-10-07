import { Resvg } from "@resvg/resvg-js";
import satori from "satori";

const width = 1200;
const height = 630;
const font = await Bun.file(new URL("../public/fonts/BSBlack.woff", import.meta.url)).arrayBuffer();
const gridLines = [
  ...Array.from({ length: 45 }, (_, index) => `M${index * 24} 0v510`),
  ...Array.from({ length: 22 }, (_, index) => `M0 ${index * 24}h1080`),
].join(" ");
const grid = `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="510"><path d="${gridLines}" stroke="#e7e7d8" stroke-opacity="0.03" fill="none"/></svg>`;

const card = {
  type: "div",
  key: null,
  props: {
    style: {
      display: "flex",
      width,
      height,
      padding: 60,
      backgroundColor: "#1e1e1e",
      color: "#e7e7d8",
      fontFamily: "Basement",
    },
    children: {
      type: "div",
      key: null,
      props: {
        style: {
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          position: "relative",
          width: "100%",
          height: "100%",
          padding: 40,
          border: "1px solid #e7e7d833",
        },
        children: [
          {
            type: "img",
            key: "grid",
            props: {
              src: `data:image/svg+xml;base64,${Buffer.from(grid).toString("base64")}`,
              width: 1080,
              height: 510,
              style: { position: "absolute", top: 0, left: 0 },
            },
          },
          {
            type: "div",
            key: "eyebrow",
            props: {
              style: { color: "#e8a33d", fontSize: 16, letterSpacing: 3 },
              children: "BUILD. SHIP. COLLABORATE.",
            },
          },
          {
            type: "div",
            key: "heading",
            props: {
              style: { display: "flex", flexDirection: "column", gap: 20 },
              children: [
                {
                  type: "div",
                  key: "title",
                  props: {
                    style: { fontSize: 88, lineHeight: 1.05, whiteSpace: "pre" },
                    children: "PLANETARY\nESCAPE",
                  },
                },
                {
                  type: "div",
                  key: "subtitle",
                  props: {
                    style: { color: "#afac95", fontSize: 24 },
                    children: "Software Services Network",
                  },
                },
              ],
            },
          },
          {
            type: "div",
            key: "footer",
            props: {
              style: { fontSize: 18 },
              children: "planetaryescape.co.za",
            },
          },
        ],
      },
    },
  },
};

const svg = await satori(card, {
  width,
  height,
  fonts: [{ name: "Basement", data: font, weight: 700, style: "normal" }],
});
const png = new Resvg(svg, { font: { loadSystemFonts: false } }).render().asPng();
await Bun.write(new URL("../public/og-image.png", import.meta.url), png);
