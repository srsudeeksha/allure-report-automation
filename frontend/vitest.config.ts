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
      "C:\\Users\\Sudeeksha\\Desktop\\DEMO\\frontend\\src\\tests\\setup.ts",
      "allure-vitest/setup" 
    ],
    reporters: [
      "verbose",
      [
        "allure-vitest/reporter",
        {
          resultsDir: "allure-results", // Output folder for allure results
        },
      ],
    ],
  },
});

