import { defineConfig } from "vite";

// https://vitejs.dev/config
export default defineConfig({
    server: {
        proxy: {
            "/api": {
                // target: "http://localhost:8081",
                target: 'http://43.163.233.68:8081',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, ""),
            },
        },
    },
});
