import { defineConfig, loadEnv } from "vite"; // <--- 이 부분이 누락되면 에러가 납니다!
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  // [디버깅용] 터미널에 주소가 잘 찍히는지 확인해보세요!
  console.log("--- 현재 설정된 백엔드 주소:", env.VITE_BACKEND_URL);
  return {
    plugins: [react()],
    server: {
      host: "0.0.0.0",
      port: 5173,
      strictPort: true,
      allowedHosts: ["trip.memyself.shop", "localhost", "frontend"],
      proxy: {
        // 일반 API 요청 프록시
        "/api": {
          target: env.VITE_BACKEND_URL,
          changeOrigin: true,
        },
        // 소켓 요청 프록시 (이게 있어야 소켓 에러가 안 납니다)
        "/socket.io": {
          target: env.VITE_BACKEND_URL,
          ws: true,
          changeOrigin: true,
        },
        "/img": {
          target: env.VITE_BACKEND_URL,
          changeOrigin: true,
          //rewrite:(path)=>path.replace(/^\/img/,'uploads')
        },
      },
    },
    resolve: {
      dedupe: ["react", "react-dom"],
    },
  };
});
