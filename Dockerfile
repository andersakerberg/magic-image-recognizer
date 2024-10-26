# Use a base image with Node.js 20
FROM node:20


# Add these lines to pass the environment variables
ARG AZURE_COMPUTER_VISION_KEY
ARG AZURE_COMPUTER_VISION_ENDPOINT

# Set the environment variables in the container
ENV AZURE_COMPUTER_VISION_KEY=$AZURE_COMPUTER_VISION_KEY
ENV AZURE_COMPUTER_VISION_ENDPOINT=$AZURE_COMPUTER_VISION_ENDPOINT

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Create the uploads directory
RUN mkdir -p uploads

# Expose the port the app runs on
EXPOSE 3001

# Start the application
CMD ["node", "app.js"]



