import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { viteSingleFile } from 'vite-plugin-singlefile';
import path from 'path';

export default defineConfig({
  plugins: [react(), tailwindcss(), viteSingleFile()],
  resolve: {
    alias: {
      '@autoparts/models':     path.resolve(__dirname, '../../packages/models/src/index.ts'),
      '@autoparts/shared':     path.resolve(__dirname, '../../packages/shared/src/index.ts'),
      '@autoparts/validators': path.resolve(__dirname, '../../packages/validators/src/index.ts'),
    },
  },
});
