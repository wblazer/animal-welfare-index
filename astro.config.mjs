import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://wblazer.github.io/animal-welfare-index",
  base: "/animal-welfare-index",
  output: "static",
  build: {
    assets: "assets",
    inlineStylesheets: "never",
  },
});
