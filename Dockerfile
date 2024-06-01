# Use an official Node.js image as the base image
FROM node:14

# Create and change to the app directory
WORKDIR /usr/src/app

# Copy application dependency manifests to the container image.
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Install client dependencies
RUN npm install --prefix app

# Expose the port the app runs on
EXPOSE 3000
EXPOSE 3001

# Default command to run when the container starts
CMD ["bash"]
