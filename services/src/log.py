import logging
import os
from logging import getLogger

def get_logger(name: str = "services") -> logging.Logger:
    """
    Get a logger instance with the specified name and file handler.

    Args:
        name (str): The name of the logger. Default is "services".

    Returns:
        logging.Logger: A logger instance configured to write to a file.
    """
    logger = getLogger(name)
    
    # Only configure if handlers don't exist (avoid duplicate handlers)
    if not logger.handlers:
        # Create logs directory if it doesn't exist
        log_dir = "logs"
        if not os.path.exists(log_dir):
            os.makedirs(log_dir)
        
        # Configure file handler
        log_file = os.path.join(log_dir, f"{name}.log")
        file_handler = logging.FileHandler(log_file)
        file_handler.setLevel(logging.DEBUG)
        
        # Configure console handler
        console_handler = logging.StreamHandler()
        console_handler.setLevel(logging.INFO)
        
        # Create formatter
        formatter = logging.Formatter(
            '%(asctime)s - %(name)s - %(levelname)s - %(message)s',
            datefmt='%Y-%m-%d %H:%M:%S'
        )
        file_handler.setFormatter(formatter)
        console_handler.setFormatter(formatter)
        
        # Add handlers to logger
        logger.addHandler(file_handler)
        logger.addHandler(console_handler)
        logger.setLevel(logging.DEBUG)
    
    return logger