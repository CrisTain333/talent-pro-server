# Use a specific version of Node.js Alpine image
FROM node:18-alpine

# Set the working directory
WORKDIR /usr/app

# Copy the application files to the working directory
COPY . .

# Install musl-utils to provide /bin/sh
RUN apk --no-cache add musl-utils

# Install app dependencies
RUN npm install

# Run the build script
RUN npm run build

# Expose the port on which the application will run
EXPOSE 3000

# Specify the command to run the application
CMD ["npm", "start"]
