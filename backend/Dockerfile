FROM node:16-alpine AS builder
WORKDIR /app
COPY package*.json .
RUN npm ci --no-audit --no-fund
COPY . .
RUN npm run build

FROM node:16-alpine AS production
WORKDIR /app
COPY package*.json .
RUN npm ci --no-audit --no-fund --omit=dev && npm i --no-audit --no-fund pm2 -g
COPY --from=builder /app/dist ./dist
COPY ecosystem.config.js .
CMD ["pm2-runtime", "start", "ecosystem.config.js"]