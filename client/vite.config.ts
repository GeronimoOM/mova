import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { ManifestOptions, VitePWA, VitePWAOptions } from 'vite-plugin-pwa';

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
      src: 'images/pwa-64x64.png',
      sizes: '64x64',
      type: 'image/png',
    },
    {
      src: 'images/pwa-192x192.png',
      sizes: '192x192',
      type: 'image/png',
    },
    {
      src: 'images/pwa-512x512.png',
      sizes: '512x512',
      type: 'image/png',
    },
    {
      src: 'images/maskable-icon-512x512.png',
      sizes: '512x512',
      type: 'image/png',
      purpose: 'maskable',
    },
  ],
};

const pwaOptions: Partial<VitePWAOptions> = {
  manifest,

  registerType: 'autoUpdate',
  strategies: 'injectManifest',
  srcDir: 'src',
  filename: 'sw.ts',
  injectRegister: null,
  includeAssets: ['fonts/*.ttf', 'images/*.svg'],
  devOptions: {
    enabled: true,
    type: 'module',
    navigateFallback: 'index.html',
  },
};

export default defineConfig({
  plugins: [react(), vanillaExtractPlugin(), VitePWA(pwaOptions)],
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
