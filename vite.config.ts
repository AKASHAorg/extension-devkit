import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import externalGlobals from "rollup-plugin-external-globals";
import basicSsl from "@vitejs/plugin-basic-ssl";
import path from "path";
import { ViteSpaDev } from "./vite-spa-dev";

const HMR_UPDATE_TOPIC = 'hmr-update'

const chunkFromId = (id: string) => {
  return `${id.split('/')
    .slice(
      id.split('/').indexOf('src'),
      id.split('/').length + 1
    )
    .join('_')
    .replaceAll('.tsx', '')
    .replaceAll('.ts', '')}`;
}


export default defineConfig(({ mode }) => {
  const isDev = mode === 'development';
  return {
    plugins: [
      react(),
      basicSsl({
        name: "devkit-ssl",
        domains: ["localhost"],
        certDir: path.resolve(__dirname, ".devcontainer/ssl"),
      }),
      ...(!isDev ? [ViteSpaDev({
        targetFilePath: 'components/index.tsx',
        server: {
          port: 8070,
          https: true,
          host: '0.0.0.0',
          hmrTopic: HMR_UPDATE_TOPIC
        }
      })] : []),
    ],
    envPrefix: ["PUBLIC_", "NODE_"],
    define: {
      __DEV__: !isDev,
    },
    build: {
      target: "esnext",
      rollupOptions: {
        input: "src/index.tsx",
        preserveEntrySignatures: "strict",
        external: ["@akashaorg/core-sdk", "single-spa-react", "react", "react-dom", "@akashaorg/ui-core-hooks"],
        jsx: "react-jsx",
        output: {
          dir: "dist",
          format: "systemjs",
          entryFileNames: "index.js",
          chunkFileNames: "[name].js",
          systemNullSetters: true,
          manualChunks: (id) => {
            if (id.includes('src')) {
              return chunkFromId(id);
            }
          }
        },
        plugins: [
          externalGlobals({
            react: "React",
            "reactDOM": "react-dom",
            "reactDOMClient": "react-dom/client",
            "single-spa": "single-spa",
            "getSDK": "@akashaorg/core-sdk",
          }),
        ],
      },
      minify: isDev ? false : true,
      emptyOutDir: true,
    },
    logLevel: 'info' as const,
    clearScreen: true,
  };
});
