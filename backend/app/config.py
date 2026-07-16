import os
from pathlib import Path

_DEFAULT_DB = str(Path(__file__).parent.parent / "data" / "database.sqlite")


class Config:
    PORT = 5000
    BASE_URL = "http://localhost:5000"
    DB_PATH = _DEFAULT_DB
    RATE_LIMIT = "20 per minute"


def apply_env_overrides(app) -> None:
    """Re-read environment variables when the app factory runs."""
    app.config["PORT"] = int(os.getenv("PORT", str(app.config["PORT"])))
    app.config["BASE_URL"] = os.getenv("BASE_URL", app.config["BASE_URL"]).rstrip("/")
    app.config["DB_PATH"] = os.getenv("DB_PATH", app.config["DB_PATH"])
    app.config["RATE_LIMIT"] = os.getenv("RATE_LIMIT", app.config["RATE_LIMIT"])
