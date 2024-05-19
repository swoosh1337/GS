import psycopg2
from config import load_config

__connection = None

def get_sql_connection():
    global __connection

    if __connection is None:
        config = load_config()
        __connection = psycopg2.connect(**config)
        print("Opening PostgreSQL connection")

    return __connection

if __name__ == '__main__':
    connection = get_sql_connection()
    print("Connection established:", connection)
    connection.close()
