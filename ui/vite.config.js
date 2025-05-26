import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/Dot-Symphony/', // Set base for GitHub Pages repo deployment
  plugins: [react()],
});