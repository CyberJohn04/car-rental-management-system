# Backend Dockerfile
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy .env file
COPY .env ./

# Copy the server code
COPY server/ ./

# Expose port 5000
EXPOSE 5000

# Start the server
CMD ["node", "index.js"]