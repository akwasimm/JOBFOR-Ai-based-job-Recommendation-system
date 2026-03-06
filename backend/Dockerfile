FROM node:20-alpine AS base

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev

# Generate Prisma client
COPY prisma ./prisma
RUN npx prisma generate

# Build application
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# Production image
FROM node:20-alpine AS production

WORKDIR /app

COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/dist ./dist
COPY --from=base /app/prisma ./prisma
COPY --from=base /app/package.json ./

# Create uploads directory
RUN mkdir -p uploads

ENV NODE_ENV=production
EXPOSE 3001

CMD ["node", "dist/index.js"]
