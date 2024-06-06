# Stage 1: Build React application
FROM node:16 AS build

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2: Serve the build using nginx
FROM nginx:alpine

# Create a non-root user and group
RUN addgroup -S ayoubg && adduser -S ayoub -G ayoubg

# Copy build files to nginx html directory
COPY --from=build /usr/src/app/build /usr/share/nginx/html

# Change permissions to the non-root user
RUN chown -R ayoub:ayoubg /usr/share/nginx/html

# Switch to non-root user
USER ayoub

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
