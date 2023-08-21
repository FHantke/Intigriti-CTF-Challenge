import random
import string
import psycopg2
from multiprocessing import Pool
from playwright.sync_api import sync_playwright, Route
from datetime import datetime
import os
import time
import logging

PROCESSES = 1
SLEEP_TIME = 15

HOST = "http://frontend:3000"
# HOST = "http://localhost:3000"

DB_USER = os.getenv('DB_USER', "mysecretpassword")
DB_PASS = os.getenv('DB_PASS', "example")
DB_NAME = os.getenv('DB_NAME', "example")
DB_HOST = os.getenv('DB_HOST', "localhost")


logging.basicConfig(encoding='utf-8', level=logging.DEBUG)

def random_string(length):
    letters = string.ascii_lowercase
    return ''.join(random.choice(letters) for _ in range(length))

def get_new_jobs():
    conn = psycopg2.connect(f"dbname={DB_NAME} user={DB_USER}  password={DB_PASS}  host={DB_HOST}")
    cur = conn.cursor()
    cur.execute("SELECT id, username, password, sender_id FROM job WHERE done_at is Null")
    new_jobs = [row for row in cur.fetchall()]
    cur.close()
    conn.close()
    return new_jobs


def run_playwright(job):
    id, username, password, sender_id = job
    with sync_playwright() as p:
        try :
            browser = p.chromium.launch(headless=True)
            context = browser.new_context()
            page = context.new_page()


            def handle_route(route: Route) -> None:
                # Fetch original response.
                response = route.fetch()
                # Add a prefix to the title.
                headers = response.headers
                # logging.debug(response.url)
                # logging.debug(headers)
                route.continue_()

            page.route("**/*", handle_route)

            # page.goto("https://webhook.site/c9de25cb-8583-4bb9-8633-8c36282d5a9e")
            # Navigate to the /auth of your webpage
            page.goto(f'{HOST}/auth')
            time.sleep(2)
            page.wait_for_load_state('networkidle')

            # Fill in the username and password
            page.fill('#username', username)
            page.fill('#password', password)
            logging.info(f"Login with {username} and {password}")

            # Click the 'login-button'
            bu = page.locator("#login-button")
            logging.info(bu)
            logging.info(bu.text_content())
            bu.click()

            # page.click('#login-button')
            time.sleep(5)
            logging.info(context.cookies())
            logging.info(page.evaluate('document.cookie'))
            page.goto(f'{HOST}/home')

            # Wait for the navigation to complete
            time.sleep(5)
            page.wait_for_load_state('networkidle')

            # Check if the path is now '/home'
            logging.info(f"After login we are at {page.url}")
            # assert '/home' in page.url, f"URL is {page.url} instead of /home"

            assert "Welcome" in page.content(), f"Page is not the welcome page\n\n{page.content()}"
            time.sleep(5.5)

            # Answer the 
            page.click("#transfer-modal")
            page.fill('#recipient', sender_id)
            page.fill('#amount', "0")
            page.fill('#description', "Stop sending messages!")
            page.click('#transfer-button')
            time.sleep(2)
            browser.close()
        except Exception as e:
            return False, e
    
    return True, job
    

def main():
    # jobs = [(username, password)] * 10
    with Pool(PROCESSES) as pool:
        while True:
            jobs = get_new_jobs()
            done_jobs = pool.map(run_playwright, jobs)

            conn = psycopg2.connect(f"dbname={DB_NAME} user={DB_USER}  password={DB_PASS}  host={DB_HOST}")
            cur = conn.cursor()
            for j in done_jobs:
                print(j)
                if j[0] == False: continue
                job_id, username, password, sender_id = j[1]
                cur.execute("UPDATE job SET done_at=%s WHERE id=%s", (datetime.now(), job_id))
            cur.close()
            conn.commit()
            conn.close()

            print("DONE")
            time.sleep(SLEEP_TIME)

def run_t():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto("http://example.com")
        print(page.content())
        browser.close()

if __name__ == '__main__':
    # Wait 30 seconds to get everything started.
    time.sleep(30)
    main()
    # run_t()
