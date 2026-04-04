import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig({
  plugins: [react()],
  test: {
    include: [
      "src/**/*.test.ts",
      "src/**/*.test.tsx",
      "src/**/*.spec.ts",
      "src/**/*.spec.tsx",
    ],
    exclude: [
      "**/node_modules/**",
      "**/dist/**",
      "**/_pro_handoff_*/**",
      "**/_review_stage/**",
      "**/_old/**",
    ],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules/pdfjs-dist")) {
            return "pdfjs-render"
          }

          if (id.includes("node_modules/pdf-lib")) {
            return "pdf-export"
          }

          if (id.includes("node_modules/tesseract.js")) {
            return "ocr"
          }

          if (id.includes("node_modules/mammoth")) {
            return "office-import-docx"
          }

          if (id.includes("node_modules/pptx-parser")) {
            return "office-import-pptx"
          }

          if (id.includes("node_modules/docx")) {
            return "office-export-docx"
          }

          if (id.includes("node_modules/pptxgenjs")) {
            return "office-export-pptx"
          }

          if (id.includes("node_modules/jszip")) {
            return "zip-vendor"
          }

          if (
            id.includes("node_modules/react") ||
            id.includes("node_modules/react-dom") ||
            id.includes("node_modules/react-router-dom") ||
            id.includes("node_modules/zustand")
          ) {
            return "app-vendor"
          }
        },
      },
    },
  },
})
