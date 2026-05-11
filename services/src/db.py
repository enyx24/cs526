from sqlite3 import Connection, connect
from log import get_logger
logger = get_logger("db")

def get_db_connection() -> Connection:
    """
    Establish a connection to the SQLite database.

    Returns:
        Connection: A connection object to the SQLite database.
    """
    logger.info("Establishing database connection.")
    return connect("services.db")

def close_db_connection(conn: Connection) -> None:
    """
    Close the given database connection.

    Args:
        conn (Connection): The database connection to close.
    """
    logger.info("Closing database connection.")
    if conn:
        conn.close()

conn = get_db_connection()

def create_db_schema() -> None:
    """
    Create the necessary tables in the database if they do not exist.
    """
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS parsed_data (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            original_text TEXT NOT NULL,
            parsed_text TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    if cursor.rowcount == 0:
        logger.info("Table 'parsed_data' created successfully.")
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS parsed_results_cache(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            parsed_data_id INTEGER NOT NULL,
            sender TEXT NOT NULL,
            hash TEXT NOT NULL,
        )
    """)
    if cursor.rowcount == 0:
        logger.info("Table 'parsed_results_cache' created successfully.")
    conn.commit()

# TODO - Add functions for inserting parsed data, retrieving cached results, and storing metrics
def insert_parsed_data(original_text: str, parsed_text: str, created_at: str) -> int:
    pass