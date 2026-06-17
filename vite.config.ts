import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// `base: './'` keeps asset paths relative so the build works on GitHub Pages
// regardless of the repository name. If you prefer an absolute path, replace it
// with `base: '/<repo-name>/'`.
export default defineConfig({
  plugins: [react()],
  base: './',
});
