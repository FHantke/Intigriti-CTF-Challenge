# Bug Bank Challenge

This repository contains the code for the Intigriti CTF challenge *Bug Bank*.
To setup the challenge, follow the steps below.

## Prerequisites

Before you begin, ensure you have [Docker](https://docs.docker.com/engine/install/) and [Docker Compose](https://docs.docker.com/compose/) installed on your machine.

## Setup Instructions

1. **Configure Environment Variables**: You'll need to adjust the environment variables according to your requirements. You can find these variables in the `docker-compose.yml` file.

   For example, you may want to update the database configurations `POSTGRES_USER`, `POSTGRES_PASSWORD`, and `POSTGRES_DB`. Accordingly, you need to update `DB_USER`, `DB_PASS`, and `DB_NAME` for the backend and bot services.

   The `REACT_APP_API_HOST` variable contains the host name of the API which is the backend. However, if you set it up on your local machine and you set the host to localhost, the challenge-bot would not be able reach the API it is running in its own container. This is why the default is set to backend and you should add `127.0.0.1 backend` to your `/etc/hosts`.
   For a global setup, it should work to add the global domain as variable.

3. **Build and Run the Services**: Use Docker Compose to build and run the services. In the directory containing the `docker-compose.yml` file, run:

   \```bash
   docker-compose up --build
   \```

   This command will build the images and start all the services defined in the `docker-compose.yml` file.

4. **Access the Frontend**: Once everything is up and running, you can access the frontend application by navigating to `http://localhost:3000` in your web browser.

5. **Shutting Down**: To stop the services, you can use the following command:

   \```bash
   docker-compose down
   \```