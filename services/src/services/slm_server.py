from dotenv import load_dotenv
import os
import requests
from log import get_logger
from constants import SYSTEM_PROMPT, USER_PROMPT
import json
logger = get_logger("slm_server")
load_dotenv()
LLAMA_API_KEY = os.getenv("LLAMA_API_KEY")
LLAMA_API_URL = os.getenv("LLAMA_API_URL")
MODEL_NAME = os.getenv("MODEL_NAME")


def call_llama_api(ocr_result: str, ocr_result_regex: str, categories: list, sources: list, timeout: int = 30) -> str:
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
        response = requests.post(url, json=payload, headers=headers, timeout=timeout)
        logger.info("Response status from LLaMA API: %s", response.status_code)
        response.raise_for_status()
        result = response.json()
        parsed_text = json.dumps(result.get("choices", [{}])[0].get("message", {}).get("content", ""))
        logger.info("LLaMA API call successful.")
        return parsed_text
    except requests.exceptions.RequestException as e:
        logger.error(f"Error calling LLaMA API: {e}")
        return ""
