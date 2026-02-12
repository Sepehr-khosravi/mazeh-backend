# ---------- Builder ----------
FROM node:20 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npx prisma generate --schema=prisma/schema.prisma
RUN npm run build


# ---------- Production ----------
FROM node:20-slim

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

# 👇 خیلی مهم — این باید قبل از generate باشه
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/dist ./dist

# 👇 حالا که schema هست، generate می‌کنیم
RUN npx prisma generate --schema=prisma/schema.prisma

EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main.js"]
