# Builder Stage
FROM node:24 AS builder
WORKDIR /app

# Copy package.json + package-lock.json
COPY package*.json ./
COPY tsconfig.json ./

RUN npm install

# Copy the rest of the project (including tsconfig.json and src/)
COPY . .

# Generate Prisma client
RUN npx prisma generate --schema=prisma/schema.prisma

# Build NestJS
RUN npm run build

# Production Stage
FROM node:24-slim AS production
WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

# Copy built code + Prisma client + env
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/tsconfig.json ./tsconfig.json
COPY --from=builder /app/.env .env

EXPOSE 3000
CMD ["node", "dist/src/main.js"]
