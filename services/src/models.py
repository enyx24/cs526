import pydantic
from dataclasses import dataclass


@dataclass(frozen=True)
class ParseRequest:
    ocr_result: str
    ocr_result_regex: str
    categories: list
    sources: list
    uuid: str | None = None

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
