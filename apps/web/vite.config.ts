import {defineConfig,loadEnv} from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
export default defineConfig(({mode})=>{const env=loadEnv(mode,'../..','');return {plugins:[react(),tailwindcss()],resolve:{dedupe:['react','react-dom']},server:{port:5173,strictPort:true,proxy:{'/api':process.env.API_URL||env.API_URL||'http://127.0.0.1:3001'}}};});
