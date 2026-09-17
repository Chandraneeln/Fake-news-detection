# Multi-stage build for optimized production
FROM node:20-alpine as base

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY bun.lockb ./

# Development stage
FROM base as development
RUN npm install
COPY . .
EXPOSE 8080
CMD ["npm", "run", "dev"]

# Build stage
FROM base as build
RUN npm ci --only=production
RUN npm install --only=dev
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine as production

# Copy build files to Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copy Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Add security headers and optimizations
RUN echo 'server_tokens off;' >> /etc/nginx/conf.d/security.conf

# Create non-root user for better security
RUN addgroup -g 1001 -S nginx && \
    adduser -S nginx -u 1001 -G nginx

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]