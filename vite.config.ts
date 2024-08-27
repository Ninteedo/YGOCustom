import {defineConfig, loadEnv} from "vite"
import react from "@vitejs/plugin-react"

// https://vitejs.dev/config/
/** @type {import('vite').UserConfig} */
export default defineConfig(({mode}) => {
  const env = loadEnv(mode, process.cwd(), "VITE_");

  return {
    plugins: [react()],
    server: {
      proxy: {
        "/image_bucket/": {
          target: "https://images.ygo.rgh.dev",
          changeOrigin: true,
          secure: true,
          rewrite: path => path.replace(/^\/image_bucket/, ""),
          headers: {
            Referer: "https://ygo.rgh.dev",
          },
        },
      },
    },
    define: {
      "process.env.IMAGE_BASE_URL": JSON.stringify(env.VITE_IMAGE_BASE_URL),
    }
  };
});
