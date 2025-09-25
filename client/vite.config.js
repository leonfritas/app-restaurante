import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/", // 👈 garante que as rotas funcionem em produção
  build: {
    sourcemap: true, // Habilita os source maps
  },
});
