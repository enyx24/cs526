
import uvicorn

from fastapi import FastAPI, Header, HTTPException, status

from log import get_logger
from models import ParseRequest
from services.slm_server import parse_ocr_text
from services.auth import require_api_key




logger = get_logger("server")


logger.info("Starting the server...")
app = FastAPI()



@app.get("/")
def root():
    return {"status": "ok"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.post("/parse")
async def parse_text(request: ParseRequest, timeout: int = 30, authorization: str | None = Header(default=None)):
    require_api_key(authorization)
    result = await parse_ocr_text(
        ocr_result=request.ocr_result,
        ocr_result_regex=request.ocr_result_regex,
        categories=request.categories,
        sources=request.sources,
        timeout=timeout
    )
    return result


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)