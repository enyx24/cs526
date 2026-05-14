from sqlite3 import Connection, connect
from log import get_logger
from models import ParsedData
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
    # cursor.execute("""
    #     CREATE TABLE IF NOT EXISTS parsed_results_cache(
    #         id INTEGER PRIMARY KEY AUTOINCREMENT,
    #         parsed_data_id INTEGER NOT NULL,
    #         sender TEXT NOT NULL,
    #         hash TEXT NOT NULL,
    #     )
    # """)
    # if cursor.rowcount == 0:
    #     logger.info("Table 'parsed_results_cache' created successfully.")
    conn.commit()


async def insert_parsed_data(parsed_data: ParsedData) -> int:
    """
    Insert parsed data into the database.

    Args:
        parsed_data (ParsedData): The parsed data to insert.

    Returns:
        int: The ID of the inserted record.
    """
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO parsed_data (original_text, parsed_text, created_at)
        VALUES (?, ?, ?)
    """, (parsed_data.original_text, parsed_data.parsed_text, parsed_data.created_at))
    conn.commit()
    logger.info("Inserted parsed data into database with ID: %d", cursor.lastrowid)
    return cursor.lastrowid