import { fileURLToPath } from "node:url";
import { mergeConfig, defineConfig, configDefaults } from "vitest/config";
import viteConfig from "./vite.config";

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      deps: {
        inline: ["vuetify"],
      },
      globals: true,
      environment: "jsdom",
      exclude: [...configDefaults.exclude, "e2e/*"],
      root: fileURLToPath(new URL("./", import.meta.url)),
      setupFiles: ["./tests/setup.ts"],
    },
    resolve: {
      alias: {
        "@": "./src",
        "@com": "./src/components",
      },
    },
  })
);
