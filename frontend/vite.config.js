/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.js'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{js,jsx}'], // specify files to include
      exclude: ['src/generated/**/*.ts'], // specify files to exclude
      reporter: ['text', 'json', 'html', 'lcov'],
      reportsDirectory: './coverage'
    },
  },
});
