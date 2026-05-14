import pydantic
from dataclasses import dataclass
from typing import List, Optional


class ParseRequest(pydantic.BaseModel):
    ocr_result: str
    ocr_result_regex: str
    categories: str
    sources: str
    uuid: Optional[str] = None

@dataclass(frozen=True)
class ParsedResult:
    uuid: str
    text: str
    date: str
    time: str
    amount: float
    category: str
    source: str
    confidence: float

@dataclass(frozen=True)
class ParseMetrics:
    uuid: str
    latency: float
    slm_latency: float
    tps: float
    confidence: float

@dataclass(frozen=True)
class ParsedData:
    uuid: str
    original_text: str
    parsed_text: str
    created_at: str
