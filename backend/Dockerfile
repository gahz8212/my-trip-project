FROM node:20-alpine

# Prisma 엔진 실행용 라이브러리 설치
RUN apk add --no-cache openssl libc6-compat

WORKDIR /app

# 의존성 설치
COPY package*.json ./
RUN npm install
RUN npm install @prisma/client

# Prisma 설정 복사 및 생성
COPY prisma ./prisma/
RUN npx prisma generate

# 전체 소스 코드 복사
COPY . .

# 환경 변수 및 포트
ENV NODE_ENV=production
EXPOSE 5000

# 실행 명령 (index.js가 진입점이라고 가정)
#운영환경
# CMD ["sh", "-c", "npx prisma migrate deploy && node index.js"] 
#개발환경
CMD ["sh", "-c", "npx prisma db push && node index.js"]
