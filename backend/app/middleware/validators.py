import re
from urllib.parse import urlparse

from pydantic import BaseModel, field_validator


class ShortenRequest(BaseModel):
    url: str
    customAlias: str | None = None

    @field_validator("url")
    @classmethod
    def validate_url(cls, v: str) -> str:
        parsed = urlparse(v)
        if parsed.scheme not in ("http", "https") or not parsed.netloc:
            raise ValueError("Must be a valid absolute http or https URL")
        return v

    @field_validator("customAlias")
    @classmethod
    def validate_alias(cls, v: str | None) -> str | None:
        if v is None:
            return v
        if not re.match(r"^[a-zA-Z0-9_-]{4,20}$", v):
            raise ValueError(
                "Alias must be 4-20 characters, alphanumeric, underscore, or hyphen"
            )
        return v
