import random
import string
import psycopg2
from multiprocessing import Pool
from playwright.sync_api import sync_playwright
from datetime import datetime
import os
import time

HOST = "http://localhost:3000"
PROCESSES = 1
SLEEP_TIME = 15

DB_USER = os.getenv('DB_USER', "mysecretpassword")
DB_PASS = os.getenv('DB_PASS', "example")
DB_NAME = os.getenv('DB_NAME', "example")
DB_HOST = os.getenv('DB_HOST', "localhost")

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
            page = browser.new_page()

            # Navigate to the /auth of your webpage
            page.goto(f'{HOST}/auth')

            # Fill in the username and password
            page.fill('#username', username)
            page.fill('#password', password)

            # Click the 'register-button'
            page.click('#login-button')

            # Wait for the navigation to complete
            page.wait_for_load_state('networkidle')

            # Check if the path is now '/home'
            assert '/home' in page.url

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

if __name__ == '__main__':
    main()