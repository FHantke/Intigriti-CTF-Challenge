FROM python:3.10.7

WORKDIR /app

RUN apt-get clean
RUN apt-get update

ENV PYTHONDONTWRITEBYTECODE=1
ENV PLAYWRIGHT_BROWSERS_PATH=/app/ms-playwright
# Turns off buffering for easier container logging
ENV PYTHONUNBUFFERED=1

# Install dependencies
RUN pip install playwright psycopg2-binary

# install manually all the missing libraries
RUN apt-get install -y gconf-service libasound2 libatk1.0-0 libcairo2 libcups2 libfontconfig1 libgdk-pixbuf2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libxss1 fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils
RUN PLAYWRIGHT_BROWSERS_PATH=/app/ms-playwright python -m playwright install --with-deps chromium


# Copy the Python script
COPY . .

CMD ["python", "main.py"]
