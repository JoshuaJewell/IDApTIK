import { defineConfig } from "vite";

const host = process.env.TAURI_DEV_HOST;

// https://vitejs.dev/config/

export default defineConfig(async () => {
  const port = 1420;
  const hmrPort = 1421;

  return {
    // Prevent Vite from obscuring Rust errors
    clearScreen: false,
    // Tauri expects a fixed port, fail if that port is not available
    server: {
      port: port,
      strictPort: true,
      host: host || false,
      hmr: host
        ? {
            protocol: "ws",
            host: host,
            port: hmrPort,
          }
        : undefined,
      watch: {
        // Ignore watching `src-tauri`
        ignored: ["**/src-tauri/**"],
      },
    },
  };
});