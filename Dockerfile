# Stage 1: Base production dependencies
FROM node:20-alpine AS deps-prod
WORKDIR /app

# Copy only the package files
COPY package.json package-lock.json* ./

# Install only production dependencies
RUN npm ci --omit=dev


# Stage 2: Full dependencies and build
FROM node:20-alpine AS build
WORKDIR /app

# Copy all files and install all dependencies
COPY package.json package-lock.json* ./
RUN npm ci

# Copy source code
COPY . .

# Build the TypeScript project
RUN npm run build


# Stage 3: Final runtime image
FROM node:20-alpine AS prod
WORKDIR /app

# Copy production dependencies
COPY --from=deps-prod /app/node_modules ./node_modules

# Copy only necessary files
COPY --from=build /app/package.json ./
COPY --from=build /app/dist ./dist

# Specify module type for Node.js (ESM support)
ENV NODE_ENV=production

# Run the app using ESM entry point
CMD ["node", "dist/app.js"]
