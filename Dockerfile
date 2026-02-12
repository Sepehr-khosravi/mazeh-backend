# ---------- Builder ----------
FROM node:20 AS builder

WORKDIR /app

COPY package*.json ./
COPY tsconfig*.json ./

RUN npm install

COPY . .

RUN npm run build


# ---------- Production ----------
FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install --omit=dev

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main.js"]
