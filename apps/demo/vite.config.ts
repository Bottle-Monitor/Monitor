import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    /* http: 后面必须是 // 才是合法 URL, 不然 Vite 代理解析会出错 */
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, ''),
        /* replace('/api', '') 会替换掉任意位置的'/api', 这个只替换开头 */
      },
    },
  },
})
