FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install dependencies first
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY src ./src

# Expose backend port
EXPOSE 5000

# Environment
ENV NODE_ENV=production

# Start the app
CMD ["npm", "start"]
