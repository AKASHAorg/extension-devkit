import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import externalGlobals from "rollup-plugin-external-globals";
import basicSsl from "@vitejs/plugin-basic-ssl";
import path from "path";
import { spawn } from "child_process";

const chunkFromId = (id: string) => {
  return `${id.split('/').slice(id.split('/').indexOf('src'), id.split('/').length + 1).join('_').replaceAll('.tsx', '').replaceAll('.ts', '')}`;
}

function watchRebuildPlugin() {
  return {
    name: "watch-rebuild",
    configureServer(server) {
      let building = false;
      let timeout;

      server.watcher.on("change", async (file) => {
        if (building) return;
        if (file.includes("src")) {
          // Clear existing timeout to debounce multiple changes
          if (timeout) clearTimeout(timeout);

          timeout = setTimeout(() => {
            building = true;
            console.log("File changed, rebuilding:", file);

            const build = spawn("vite", ["build"], {
              stdio: "inherit",
              shell: true,
            });

            build.on("close", (code) => {
              console.log("Build finished with code:", code);
              building = false;

              server.ws.send({
                type: "custom",
                event: 'spa-hmr',
                data: {
                  chunkId: chunkFromId(file)
                },
              });
            });
          }, 100); // Small debounce to catch multiple rapid changes
        }
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  return {
    plugins: [
      react(),
      watchRebuildPlugin(),
      basicSsl({
        name: "devkit-ssl",
        domains: ["localhost"],
        certDir: path.resolve(__dirname, ".devcontainer/ssl"),
      }),
    ],
    envPrefix: ["PUBLIC_", "NODE_"],
    define: {
      __DEV__: process.env?.NODE_ENV === "production" ? undefined : "true",
      __DEFINES__: {
        __VUE_OPTIONS_API__: true,
        __VUE_PROD_DEVTOOLS__: false,
        __VITE_IS_MODERN__: true,
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false,
      },
      __HMR_CONFIG_NAME__: JSON.stringify("vite.config.ts"),
      __HMR_PROTOCOL__: JSON.stringify("wss"),
      __SERVER_HOST__: JSON.stringify("localhost"),
      __HMR_HOSTNAME__: JSON.stringify("localhost"),
      __HMR_DIRECT_TARGET__: JSON.stringify("/@vite/client"),
      __HMR_PORT__: 8070,
      __BASE__: JSON.stringify("/"),
      __HMR_BASE__: JSON.stringify("/"),
      __HMR_TIMEOUT__: 30000,
      __HMR_ENABLE_OVERLAY__: true,
    },
    build: {
      // watch: {},
      target: "esnext",
      rollupOptions: {
        input: "src/index.tsx",
        preserveEntrySignatures: "strict",
        external: ["@akashaorg/core-sdk", "single-spa-react"],
        jsx: "react-jsx",
        output: {
          dir: "dist",
          format: "systemjs",
          entryFileNames: "index.js",
          chunkFileNames: "[name].js",
          assetFileNames: "[name].[extname]",
          systemNullSetters: true,
          manualChunks: (id, meta) => {
            if (id.includes('src')) {
              // console.log(id, meta.getModuleInfo(id), '<<< chunk');
              return chunkFromId(id);
            }
          }
        },
        plugins: [
          externalGlobals({
            react: "React",
            "react-dom": "ReactDOM",
          }),
        ],
      },
      minify: process.env?.NODE_ENV === "production" ? true : false,
      emptyOutDir: true,
    },
    optimizeDeps: {
      esbuildOptions: {
        define: {
          global: "globalThis",
        },
      },
    },
    server: {
      host: true,
      port: 8070,
      strictPort: true,
      https: true,

      hmr: {
        clientPort: 8070,
        host: "0.0.0.0",
        protocol: "wss",
      },

      watch: {
        // required for Docker
        usePolling: true,
        interval: 100,
      },
    },

    logLevel: "info",
    clearScreen: false,
  };
});
