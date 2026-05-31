# ─── Stage 1: Build ───────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

RUN apk add --no-cache openssl

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci && npx prisma generate

COPY tsconfig*.json nest-cli.json ./
COPY src ./src

RUN npm run build

# ─── Stage 2: Production ──────────────────────────────────────────────────────
FROM node:20-alpine AS production

WORKDIR /app

# wget is used by HEALTHCHECK; Prisma needs OpenSSL at runtime.
RUN apk add --no-cache openssl wget

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci --omit=dev && \
    npx prisma generate && \
    npm cache clean --force

COPY --from=builder /app/dist ./dist

# Run as a non-root user.
RUN addgroup -S app && adduser -S app -G app && chown -R app:app /app
USER app

ENV PORT=3000
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget --quiet --spider http://localhost:${PORT}/api/health || exit 1

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main"]
