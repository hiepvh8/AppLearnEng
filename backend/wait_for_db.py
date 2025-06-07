import time
import pymysql
import os
from sqlalchemy import create_engine
from sqlalchemy.exc import OperationalError

def wait_for_db():
    max_tries = 30
    while max_tries > 0:
        try:
            # Thử kết nối với MySQL
            engine = create_engine(os.getenv("DATABASE_URL"))
            engine.connect()
            print("Database is ready!")
            return
        except OperationalError:
            print("Waiting for database...")
            max_tries -= 1
            time.sleep(1)
    
    raise Exception("Could not connect to database")

if __name__ == "__main__":
    wait_for_db()