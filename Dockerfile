# ---------- Build stage ----------
FROM node:20-slim AS builder

WORKDIR /app

# نصب openssl برای Prisma generate
RUN apt-get update -y && apt-get install -y openssl \
    && groupadd app && useradd -g app app

COPY package*.json ./
RUN npm install

COPY prisma ./prisma
RUN npx prisma generate

COPY . .
RUN npm run build

# ---------- Runtime stage ----------
FROM node:20-slim

WORKDIR /app

# نصب OpenSSL runtime
RUN apt-get update -y && apt-get install -y openssl \
    && groupadd app && useradd -g app app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/dist ./dist
COPY package*.json ./

USER app
EXPOSE 3000

CMD ["node", "dist/main.js"]
