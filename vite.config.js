import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
export default defineConfig({plugins:[tailwindcss()],server:{port:5173,strictPort:true,proxy:{'/api':'http://localhost:3001'}},build:{chunkSizeWarningLimit:900}});
