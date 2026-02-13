FROM node:22-alpine

WORKDIR /app

# 빌드 속도 향상을 위해 종속성 파일만 먼저 복사
COPY package*.json ./

RUN npm install

# 전체 소스 복사
COPY . .

# Vite의 기본 포트는 5173입니다.
EXPOSE 5173

# Vite를 도커 외부(Nginx)에서 접근할 수 있게 실행
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]