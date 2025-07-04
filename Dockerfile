# Stage 1: Base dependencies for production
FROM node:20-alpine AS deps-prod

WORKDIR /app

# Copy only package files to install dependencies
COPY package.json package-lock.json* ./

# Install only production dependencies
RUN npm ci --omit=dev


# Stage 2: Install full dependencies and build
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files again for dev deps
COPY package.json package-lock.json* ./

# Install all dependencies (prod + dev)
RUN npm ci

# Copy source code
COPY . .

# Transpile TypeScript to JavaScript
RUN npm run build


# Stage 3: Final image for running the app
FROM node:20-alpine AS prod

WORKDIR /app

# Copy only necessary files from build
COPY --from=build /app/package.json ./
COPY --from=deps-prod /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

# Optional: Expose port if using HTTP server
# EXPOSE 3000

# Run the app
CMD ["node", "dist/app.js"]
