# Stage 1: Build React application
FROM node:16 AS build

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2: Serve the build using a simple Node server
FROM node:16-alpine

WORKDIR /usr/src/app

COPY --from=build /usr/src/app/build ./build

# Install serve to serve the build files
RUN npm install -g serve

EXPOSE 80

CMD ["serve", "-s", "build", "-l", "80"]
