import {defineConfig} from "vite"
import react from "@vitejs/plugin-react"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      ignored: ["**/public/images/official/**"], // Exclude the public directory from being watched
    },
    proxy: {
      "/image_bucket/": {
        target: "https://images.ygo.rgh.dev",
        changeOrigin: true,
        secure: true,
        rewrite: path => path.replace(/^\/image_bucket/, ""),
        headers: {
          // Set the referer to your actual domain to bypass the hotlinking restriction
          Referer: "https://ygo.rgh.dev",
        },
      },
    },
  },
  define: {
    "process.env.IMAGE_BASE_URL": "\"/image_bucket\"",
  }
})
