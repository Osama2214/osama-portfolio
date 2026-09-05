# Multi-stage / Optimized Node.js Dockerfile
FROM node:22-alpine AS runner

# Create working directory
WORKDIR /app

# Set production environment
ENV NODE_ENV=production
ENV PORT=3000

# Install dependencies first for better caching
COPY package.json package-lock.json* ./
RUN npm install --omit=dev --no-audit --no-fund

# Copy application source files
COPY . .

# Set appropriate ownership and switch to non-root user
RUN chown -R node:node /app
USER node

# Expose default application port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/robots.txt || exit 1

# Start the server
CMD ["node", "server.js"]
