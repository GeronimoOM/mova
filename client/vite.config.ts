import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';

export default defineConfig({
  plugins: [solidPlugin()],
  server: {
    host: true,
    port: 4000,
  },
  preview: {
    host: true,
    port: 4001,
  },
  build: {
    target: 'esnext',
  },
});
