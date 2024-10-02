import { defineConfig } from "vite";
import builtinModules from "builtin-modules";
// https://vitejs.dev/config
export default defineConfig({
    assetsInclude: ["./assets/*.jpg"],
    resolve: {
        // Some libs that can run in both Web and Node.js, such as `axios`, we need to tell Vite to build them in Node.js.
        browserField: false,
        conditions: ["node"],
        mainFields: ["module", "jsnext:main", "jsnext"],
    },
    build: {
        rollupOptions: {
            external: [...builtinModules, "better-sqlite3"],
            output: {
                sourcemap: true
            }
        },
        emptyOutDir: false
    },
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
