import sqlite3
from pathlib import Path

from flask import current_app, g


def _db_path() -> str:
    return current_app.config["DB_PATH"]


def get_db() -> sqlite3.Connection:
    if "db" not in g:
        db_path = _db_path()
        Path(db_path).parent.mkdir(parents=True, exist_ok=True)
        conn = sqlite3.connect(db_path)
        conn.row_factory = sqlite3.Row
        conn.execute("PRAGMA foreign_keys = ON")
        g.db = conn
    return g.db


def close_db(_e=None) -> None:
    db = g.pop("db", None)
    if db is not None:
        db.close()


def init_db() -> None:
    schema_path = Path(__file__).parent / "schema.sql"
    with open(schema_path, encoding="utf-8") as f:
        schema = f.read()
    db_path = _db_path()
    Path(db_path).parent.mkdir(parents=True, exist_ok=True)
    db = sqlite3.connect(db_path)
    db.executescript(schema)
    db.commit()
    db.close()
