import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: [
      "./src/tests/setup.ts",      // your custom setup
      "allure-vitest/setup"        // necessary for Allure
    ],
    reporters: [
      "default",                   // standard Vitest console output
      [
        "allure-vitest/reporter", 
        {
          resultsDir: "./allure-results",  // where Allure JSON results are stored
        },
      ],
    ],
  },
});
