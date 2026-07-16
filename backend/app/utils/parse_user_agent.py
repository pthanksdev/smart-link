from urllib.parse import urlparse


def extract_referrer_domain(referrer: str | None) -> str:
    if not referrer:
        return "direct"
    try:
        parsed = urlparse(referrer)
        domain = parsed.netloc or parsed.path
        return domain.lstrip("www.") if domain else "direct"
    except Exception:
        return "unknown"
