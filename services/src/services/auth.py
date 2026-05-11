import os
from dotenv import load_dotenv
from fastapi import HTTPException, status
from log import get_logger
logger = get_logger("auth")


load_dotenv()
SERVER_API_KEY = os.getenv("SERVER_API_KEY")
def require_api_key(authorization: str | None) -> None:
    if not SERVER_API_KEY:
        logger.error("SERVER_API_KEY is not configured")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Server API key is not configured",
        )

    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing or invalid Authorization header",
        )

    token = authorization.removeprefix("Bearer ").strip()
    if token != SERVER_API_KEY:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid API key",
        )