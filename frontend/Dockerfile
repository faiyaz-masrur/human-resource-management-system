# Stage 1: Build React
FROM node:lts-alpine as builder
WORKDIR /frontend

# Install Python dependencies
# Copy package.json AND the lock file (package-lock.json or yarn.lock)
# to ensure consistent dependency installation and cache invalidation.
COPY package.json .
COPY package-lock.json .  

RUN npm install

# Copy project code
COPY . .

# Run the build process
RUN npm run build

# Stage 2: Serve with NGINX
FROM nginx:alpine
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*

# Copy the static assets from the builder stage
COPY --from=builder /frontend/dist .

# Copy NGINX configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
ENTRYPOINT [ "nginx", "-g", "daemon off;" ]