import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
  server: {
    port: 3001, // 端口号
    open: true, // 自动在浏览器中打开
    proxy: {
      // 将所有以 /api 开头的请求代理到后端
      '/api': {
        target: 'http://localhost:8088', // 后端地址
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api/, '') // 可选：重写路径
      }
    }
  },

})
