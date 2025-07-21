FROM node:20-slim

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Create a directory for uploads
RUN mkdir -p uploads && chmod 777 uploads

# Let Render provide the PORT dynamically
# Don't hardcode PORT here
ENV NODE_ENV=production

# Expose the port (Render expects this to match runtime PORT)
EXPOSE 10000

# Start the app with dynamic port support
CMD ["node", "server.js"]
