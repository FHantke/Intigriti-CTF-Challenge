# Dockerfile for React application

# Use an official node runtime as a parent image
FROM node:14

# Set the working directory in the container to /app
WORKDIR /app

# Add the current directory contents into the container at /app
COPY . .

# Install any needed packages specified in package.json
RUN npm install

# Make port 3000 available to the world outside this container
EXPOSE 3000

ARG REACT_APP_API_HOST
# Build the app
RUN npm run build

# Use serve to serve the build
RUN npm install -g serve

# Run the app when the container launches
CMD ["serve", "-s", "build"]
