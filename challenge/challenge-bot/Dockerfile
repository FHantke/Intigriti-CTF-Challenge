FROM mcr.microsoft.com/playwright/python:v1.39.0-jammy

WORKDIR /app

RUN apt-get clean
RUN apt-get update

# Install dependencies
RUN pip install playwright psycopg2-binary

# Copy the Python script
COPY . .

CMD ["python", "main.py"]
