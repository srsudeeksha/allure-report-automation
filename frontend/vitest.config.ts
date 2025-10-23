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
      "./src/tests/setup.ts",  // Use relative path
      "allure-vitest/setup"    // Allure Vitest setup
    ],
    reporters: [
      "default",               // safer than verbose
      [
        "allure-vitest/reporter",
        {
          resultsDir: "allure-results", // Output folder for allure results
        },
      ],
    ],
  },
});
