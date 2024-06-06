# Stage 1: Build React application
FROM node:16 as build

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2: Serve the build using nginx
FROM nginx:alpine

# Create a non-root user and group
RUN addgroup -S mygroup && adduser -S myuser -G mygroup

# Copy build files to nginx html directory
COPY --from=build /usr/src/app/build /usr/share/nginx/html

# Change permissions to the non-root user
RUN chown -R myuser:mygroup /usr/share/nginx/html

# Switch to non-root user
USER myuser

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
