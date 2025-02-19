import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import externalGlobals from 'rollup-plugin-external-globals';
import createExternal from 'vite-plugin-external';
import basicSsl from '@vitejs/plugin-basic-ssl';
import path from 'path';
import { chunkFromId, ViteSpaDev } from './vite-spa-dev';
import tailwindcss from '@tailwindcss/vite';

const HMR_UPDATE_TOPIC = 'hmr-update'

export default defineConfig(({ mode }) => {
  const isProd = mode !== 'development';
  return {
    plugins: [
      react(),
      tailwindcss(),
      basicSsl({
        name: 'devkit-ssl',
        domains: ['localhost'],
        certDir: path.resolve(__dirname, '.devcontainer/ssl'),
      }),
      createExternal({
        externalGlobals,
        externals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          '@akashaorg/core-sdk': '@akashaorg/core-sdk'
        }
      }),
      ...(isProd ? [] : [ViteSpaDev({
        targetFilePath: 'components/index.tsx',
        server: {
          port: 8070,
          https: true,
          host: '0.0.0.0',
          hmrTopic: HMR_UPDATE_TOPIC
        }
      })]),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    envPrefix: ['PUBLIC_', 'NODE_'],
    define: {
      __DEV__: !isProd,
    },
    build: {
      target: 'esnext',
      modulePreload: false,
      rollupOptions: {
        input: 'src/index.tsx',
        preserveEntrySignatures: 'exports-only',
        external: ['@akashaorg/core-sdk', '@akashaorg/ui-core-hooks', 'react', 'react-dom'],
        jsx: 'react-jsx',
        output: {
          dir: 'dist',
          format: 'systemjs',
          entryFileNames: 'index.js',
          chunkFileNames: '[name].js',
          systemNullSetters: true,
          manualChunks: (id) => {
            if (id.includes('src')) {
              return chunkFromId(id);
            }
          },
          globals: {
            'react': 'React',
            'react-dom': 'ReactDOM'
          }
        },
      },
      minify: isProd ? true : false,
      emptyOutDir: true,
    },
    logLevel: 'info' as const,
    clearScreen: true,
  };
});
