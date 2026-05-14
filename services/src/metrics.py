from prometheus_client import Counter, Histogram, REGISTRY, generate_latest, CollectorRegistry
from log import get_logger
logger = get_logger("metrics")

REQUEST_COUNT = Counter('parse_requests_total', 'Total number of parse requests')
REQUEST_LATENCY = Histogram('parse_request_latency_seconds', 'Latency of parse requests in seconds')
SLM_LATENCY = Histogram('slm_api_latency_seconds', 'Latency of LLaMA API calls in seconds')
CACHE_HITS = Counter('cache_hits_total', 'Total number of cache hits')
CACHE_MISSES = Counter('cache_misses_total', 'Total number of cache misses')
CACHE_LATENCY = Histogram('cache_latency_seconds', 'Latency of cache operations in seconds')
MEMORY_USAGE = Histogram('memory_usage_bytes', 'Memory usage of the application in bytes')

logger.info("Metrics initialized - expose /metrics on FastAPI port 8000")


def increment_request(count: int = 1):
	REQUEST_COUNT.inc(count)


def observe_request_latency(seconds: float):
	REQUEST_LATENCY.observe(seconds)


def observe_slm_latency(seconds: float):
	SLM_LATENCY.observe(seconds)


def increment_cache_hit(count: int = 1):
	CACHE_HITS.inc(count)


def increment_cache_miss(count: int = 1):
	CACHE_MISSES.inc(count)


def observe_cache_latency(seconds: float):
	CACHE_LATENCY.observe(seconds)


def observe_memory_usage(bytes_used: float):
	MEMORY_USAGE.observe(bytes_used)


def get_metrics_text():
	"""Return metrics in Prometheus text format for /metrics endpoint."""
	return generate_latest(REGISTRY).decode('utf-8')


def calculate_all_metrics():
	"""Return a snapshot of all metrics defined in this module.

	The return value is a dict keyed by metric name. Each value is a dict
	mapping sample names (including label kv pairs when present) to numeric values.
	"""
	wanted = {
		'parse_requests_total',
		'parse_request_latency_seconds',
		'slm_api_latency_seconds',
		'cache_hits_total',
		'cache_misses_total',
		'cache_latency_seconds',
		'memory_usage_bytes',
	}

	snapshot = {}
	for metric in REGISTRY.collect():
		if metric.name not in wanted:
			continue
		samples = {}
		for s in getattr(metric, 'samples', []):
			# sample may be a namedtuple or tuple
			try:
				name = s.name
				labels = s.labels
				value = s.value
			except Exception:
				name = s[0]
				labels = s[1]
				value = s[2]

			if labels:
				labels_str = ",".join(f"{k}={v}" for k, v in labels.items())
				key = f"{name}|{labels_str}"
			else:
				key = name
			samples[key] = value
		snapshot[metric.name] = samples

	return snapshot