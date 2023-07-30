# Dockerfile for Flask application

# Use an official Python runtime as a parent image
FROM python:3.8-slim-buster

# Set the working directory in the container to /app
WORKDIR /app

# Add the current directory contents into the container at /app
ADD . /app

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 5002

ENV FLASK_RUN_HOST 0.0.0.0
ENV FLASK_RUN_PORT 5002

# Run app.py when the container launches
CMD ["flask", "run"]