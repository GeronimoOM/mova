import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import { VitePWA, VitePWAOptions, ManifestOptions } from 'vite-plugin-pwa';

const manifest: Partial<ManifestOptions> = {
  name: 'Mova',
  short_name: 'Mova',
  start_url: '/',
  theme_color: '#453D75',
  background_color: '#FFFFFF',
  display: 'minimal-ui',
  display_override: ['minimal-ui', 'standalone', 'fullscreen', 'browser'],
  orientation: 'portrait',
  icons: [
    {
      src: './src/assets/manifest-icon-192.maskable.png',
      sizes: '192x192',
      type: 'image/png',
      purpose: 'any',
    },
    {
      src: './src/assets/manifest-icon-192.maskable.png',
      sizes: '192x192',
      type: 'image/png',
      purpose: 'maskable',
    },
    {
      src: './src/assets/manifest-icon-512.maskable.png',
      sizes: '512x512',
      type: 'image/png',
      purpose: 'any',
    },
    {
      src: './src/assets/manifest-icon-512.maskable.png',
      sizes: '512x512',
      type: 'image/png',
      purpose: 'maskable',
    },
  ],
};

const pwaOptions: Partial<VitePWAOptions> = {
  manifest,

  mode: 'development',
  strategies: 'injectManifest',
  srcDir: 'src',
  filename: 'sw.ts',
  registerType: 'autoUpdate',
  injectRegister: null,
  devOptions: {
    enabled: true,
    type: 'module',
    navigateFallback: 'index.html',
  },
};

export default defineConfig({
  plugins: [solidPlugin(), VitePWA(pwaOptions)],
  server: {
    host: true,
    port: 4000,
  },
  preview: {
    host: true,
    port: 4000,
  },
  build: {
    target: 'esnext',
  },
});
