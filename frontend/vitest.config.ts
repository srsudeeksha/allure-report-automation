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
      "./src/tests/setup.ts",      
      "allure-vitest/setup"        
    ],
    reporters: [
      "default",                   
      [
        "allure-vitest/reporter", 
        {
          resultsDir: "./allure-results",  
        },
      ],
    ],
  },
});
