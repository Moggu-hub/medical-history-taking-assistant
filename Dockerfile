FROM node:20-alpine

WORKDIR /app

# Copy application files (zero external npm dependencies needed)
COPY . .

# Ensure persistent data directory exists
RUN mkdir -p /app/data

ENV PORT=3001
ENV HOST=0.0.0.0

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:3001/api/health || exit 1

CMD ["node", "server.js"]
