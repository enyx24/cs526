from dotenv import load_dotenv
import os
import httpx
import hashlib
from log import get_logger
from constants import SYSTEM_PROMPT, USER_PROMPT
import json
from redis.asyncio import Redis
from redis.exceptions import RedisError
from models import ParsedData
from datetime import datetime
from db import insert_parsed_data
logger = get_logger("slm_server")
load_dotenv()
LLAMA_API_KEY = os.getenv("LLAMA_API_KEY")
LLAMA_API_URL = os.getenv("LLAMA_API_URL")
MODEL_NAME = os.getenv("MODEL_NAME")
REDIS_URL = os.getenv("REDIS_URL", "redis://redis:6379/0")
CACHE_TTL_SECONDS = int(os.getenv("CACHE_TTL_SECONDS", "3600"))

_redis_client: Redis | None = None


def get_redis_client() -> Redis | None:
    global _redis_client
    if _redis_client is not None:
        return _redis_client

    try:
        _redis_client = Redis.from_url(REDIS_URL, decode_responses=True)
        logger.info("Created Redis client (async).")
        return _redis_client
    except RedisError as e:
        logger.warning("Redis unavailable, cache disabled: %s", e)
        return None

REDIS_CLIENT = get_redis_client()

def build_cache_key(ocr_result: str, ocr_result_regex: str, categories: list, sources: list) -> str:
    key_data = {
        "ocr_result": ocr_result,
        "ocr_result_regex": ocr_result_regex,
        "categories": categories,
        "sources": sources,
    }
    normalized = json.dumps(key_data, ensure_ascii=False, sort_keys=True)
    digest = hashlib.sha256(normalized.encode("utf-8")).hexdigest()
    return f"parse_result:{digest}"


async def call_llama_api(ocr_result: str, ocr_result_regex: str, categories: list, sources: list, timeout: int = 30) -> str:
    """
    Call the LLaMA API to parse the given text.

    Args:
        ocr_result (str): The result from OCR.
        ocr_result_regex (str): The result from regex pre-processing of the OCR result.
        categories (list): The list of available categories.
        sources (list): The list of available sources.
        timeout (int): The request timeout in seconds.

    Returns:
        str: The parsed result from the LLaMA API.
    """
    logger.info("Calling LLaMA API...")
    url = LLAMA_API_URL
    headers = {
        "Authorization": f"Bearer {LLAMA_API_KEY}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": MODEL_NAME,
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": USER_PROMPT.format(
                                            ocr_result=ocr_result,
                                            ocr_result_regex=ocr_result_regex,
                                            categories=json.dumps(categories), 
                                            sources=json.dumps(sources)
                                        )}
        ]
    }
    
    try:
        # TODO - Add latency measurement for the API call
        # start_time = logger.info("Sending request to LLaMA API...")
        async with httpx.AsyncClient() as client:
            response = await client.post(url, json=payload, headers=headers, timeout=timeout)
        logger.info("Response status from LLaMA API: %s", response.status_code)
        response.raise_for_status()
        result = response.json()
        parsed_text = json.dumps(result.get("choices", [{}])[0].get("message", {}).get("content", ""))
        logger.info("LLaMA API call successful.")
        return parsed_text
    except httpx.HTTPError as e:
        logger.error(f"Error calling LLaMA API: {e}")
        return ""

async def check_cache(ocr_result: str, ocr_result_regex: str, categories: list, sources: list) -> str | None:
    client = REDIS_CLIENT
    if client is None:
        return None

    cache_key = build_cache_key(ocr_result, ocr_result_regex, categories, sources)
    try:
        cached = await client.get(cache_key)
        if cached:
            logger.info("Cache hit: %s", cache_key)
            return cached
    except RedisError as e:
        logger.warning("Redis read failed: %s", e)
    return None


async def write_cache(ocr_result: str, ocr_result_regex: str, categories: list, sources: list, result: str) -> None:
    client = REDIS_CLIENT
    if client is None:
        return

    cache_key = build_cache_key(ocr_result, ocr_result_regex, categories, sources)
    try:
        await client.setex(cache_key, CACHE_TTL_SECONDS, result)
        logger.info("Cache set: %s (ttl=%ss)", cache_key, CACHE_TTL_SECONDS)
    except RedisError as e:
        logger.warning("Redis write failed: %s", e)

async def parse_ocr_text(ocr_result: str, ocr_result_regex: str, categories: list, sources: list, timeout: int = 30) -> str:
    cached = await check_cache(ocr_result, ocr_result_regex, categories, sources)
    if cached is not None:
        return cached

    result = await call_llama_api(
        ocr_result=ocr_result,
        ocr_result_regex=ocr_result_regex,
        categories=categories,
        sources=sources,
        timeout=timeout,
    )
    if result:
        await write_cache()
        await insert_parsed_data(ParsedData(
            uuid=build_cache_key(ocr_result, ocr_result_regex, categories, sources),
            original_text=ocr_result,
            parsed_text=result,
            created_at=datetime.utcnow().isoformat()
        ))
    return result
