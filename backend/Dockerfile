FROM node:18.17.1-alpine

# Set working directory
WORKDIR /app

# Install dependencies first
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY src ./src

# Expose backend port
EXPOSE 8000

# Environment
ENV NODE_ENV=production

# Start the app
CMD ["npm", "start"]
