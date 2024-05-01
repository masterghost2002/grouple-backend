# Stage 1: Build the Express app
FROM node:20-alpine AS express-builder

# Set working directory
WORKDIR /app
COPY ./package.json ./yarn.lock ./
COPY /prisma ./prisma
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Build the React app
FROM node:20-alpine AS react-builder
WORKDIR /app
COPY ./web/package.json ./web/yarn.lock ./
RUN npm install
COPY ./web .
RUN npm run build

# Stage 3: Combine both builds
FROM node:20-alpine
WORKDIR /app

# Copy built Express app from the first stage
COPY --from=express-builder /app/dist ./
COPY --from=express-builder /app/package.json ./
COPY --from=express-builder /app/prisma ./prisma
RUN npm install --omit=dev
# Copy built React app from the second stage
COPY --from=react-builder /app/dist ./web/dist
CMD node server.js
EXPOSE 5000
