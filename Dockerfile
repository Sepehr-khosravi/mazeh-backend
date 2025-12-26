FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci

COPY . .
RUN npm run build
RUN npx prisma generate

FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app/package*.json ./
RUN npm ci --only=production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Install netcat for waiting
USER root
RUN apk add --no-cache netcat-openbsd
RUN addgroup -g 1001 -S nodejs && adduser -S nestjs -u 1001
USER nestjs

EXPOSE 3000

# Create wait script
COPY --from=builder /app/wait-for-db.sh ./wait-for-db.sh
RUN chmod +x ./wait-for-db.sh

CMD ["./wait-for-db.sh", "postgres", "5432", "npx prisma migrate deploy && node dist/main.js"]