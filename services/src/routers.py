
import uvicorn
import time

from fastapi import FastAPI, Header, HTTPException, status
from fastapi.responses import PlainTextResponse

from log import get_logger
from models import ParseRequest
from services.slm_server import parse_ocr_text
from services.auth import require_api_key
from metrics import get_metrics_text, increment_request, observe_request_latency
from db import create_db_schema




logger = get_logger("server")


logger.info("Starting the server...")
app = FastAPI()


@app.on_event("startup")
def startup_event():
    """Initialize database schema on server startup."""
    logger.info("Initializing database schema...")
    create_db_schema()
    logger.info("Database schema initialized.")



@app.get("/")
def root():
    return {"status": "ok"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.get("/metrics")
def metrics():
    return PlainTextResponse(get_metrics_text(), media_type="text/plain; version=0.0.4")

@app.post("/parse")
async def parse_text(request: ParseRequest, timeout: int = 30, authorization: str | None = Header(default=None)):
    import json
    start_time = time.time()
    require_api_key(authorization)
    
    # Parse categories and sources from strings back to lists
    try:
        categories = json.loads(request.categories) if isinstance(request.categories, str) else request.categories
    except (json.JSONDecodeError, TypeError):
        categories = []
    
    try:
        sources = json.loads(request.sources) if isinstance(request.sources, str) else request.sources
    except (json.JSONDecodeError, TypeError):
        sources = []
    
    result = await parse_ocr_text(
        ocr_result=request.ocr_result,
        ocr_result_regex=request.ocr_result_regex,
        categories=categories,
        sources=sources,
        timeout=timeout
    )
    
    # Record metrics
    elapsed = (time.time() - start_time) * 1000  # Convert to milliseconds
    increment_request()
    observe_request_latency(elapsed)
    
    return result


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)