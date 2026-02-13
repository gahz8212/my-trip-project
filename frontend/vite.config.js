import { defineConfig } from 'vite'; // <--- 이 부분이 누락되면 에러가 납니다!
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    allowedHosts: ["trip.memyself.shop", "localhost", "frontend"], 
    proxy: {
      // 일반 API 요청 프록시
      '/api': {
        target: 'http://backend:5000',
        changeOrigin: true,
      },
      // 소켓 요청 프록시 (이게 있어야 소켓 에러가 안 납니다)
      '/socket.io': {
        target: 'http://backend:5000',
        ws: true,
        changeOrigin: true,
      },
     '/img':{
	target:'http://backend:5000',
	changeOrigin:true,
	//rewrite:(path)=>path.replace(/^\/img/,'uploads')
      }
    },
  },
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
});
