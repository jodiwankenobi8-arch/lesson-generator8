import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules/pdfjs-dist") || id.includes("node_modules/pdf-parse")) {
            return "pdf"
          }

          if (id.includes("node_modules/tesseract.js")) {
            return "ocr"
          }

          if (id.includes("node_modules/mammoth") || id.includes("node_modules/pptx-parser")) {
            return "office"
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
