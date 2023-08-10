# Use an official Alpine runtime as a parent image
FROM alpine:latest

# Set the working directory in the container to /app
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

# Run tail command to keep container running
CMD ["tail", "-f", "/dev/null"]