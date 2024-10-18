import { defineConfig } from "vite";
import react from '@vitejs/plugin-react';
import mkcert from 'vite-plugin-mkcert';

export default defineConfig({
    plugins: [react(), mkcert()],
    build: {
        lib: {
            entry: 'src/index.ts',
            formats: ['system'],
            fileName: () => 'index.js'
        },
        rollupOptions: {
            external: ['react', 'react-dom'],
        },
        minify: false
    },
    server: {
        host: true,
        port: 8070,
        hmr: true,
        watch: {}
    }
});
