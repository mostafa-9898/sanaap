import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  // Proxy: /backend/... -> stage API (so the browser never hits CORS problems)
  const proxy = {
    "/backend": {
      target: env.UPSTREAM_API_URL || "https://stage-api.sanaap.co",
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/backend/, ""),
    },
  };

  return {
    plugins: [react(), tailwindcss()],
    server: { proxy },
    preview: { proxy },
  };
});
