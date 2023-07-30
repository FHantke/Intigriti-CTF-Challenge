FROM mcr.microsoft.com/playwright:focal
FROM python:3.8-slim-buster

WORKDIR /app

# Install dependencies
RUN pip install playwright psycopg2-binary
RUN playwright install

# Copy the Python script
COPY . .

CMD ["python", "main.py"]
