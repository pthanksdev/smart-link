from datetime import datetime
from typing import Any

from app.db import get_db


def create_link(alias: str, original_url: str, expires_at: str | None = None) -> dict[str, Any]:
    db = get_db()
    cursor = db.execute(
        "INSERT INTO links (alias, original_url, expires_at) VALUES (?, ?, ?)",
        (alias, original_url, expires_at),
    )
    db.commit()
    return get_link_by_id(cursor.lastrowid)


def get_link_by_id(link_id: int) -> dict[str, Any] | None:
    db = get_db()
    row = db.execute("SELECT * FROM links WHERE id = ?", (link_id,)).fetchone()
    return dict(row) if row else None


def get_link_by_alias(alias: str) -> dict[str, Any] | None:
    db = get_db()
    row = db.execute("SELECT * FROM links WHERE alias = ?", (alias,)).fetchone()
    return dict(row) if row else None


def delete_link_by_alias(alias: str) -> bool:
    db = get_db()
    cursor = db.execute("DELETE FROM links WHERE alias = ?", (alias,))
    db.commit()
    return cursor.rowcount > 0


def list_links(page: int = 1, limit: int = 20) -> tuple[list[dict[str, Any]], int]:
    db = get_db()
    offset = (page - 1) * limit
    total = db.execute("SELECT COUNT(*) FROM links").fetchone()[0]
    rows = db.execute(
        "SELECT alias, original_url, click_count, created_at FROM links "
        "ORDER BY created_at DESC LIMIT ? OFFSET ?",
        (limit, offset),
    ).fetchall()
    return [dict(r) for r in rows], total


def increment_click_count(link_id: int) -> None:
    db = get_db()
    db.execute("UPDATE links SET click_count = click_count + 1 WHERE id = ?", (link_id,))
    db.commit()


def is_expired(link: dict[str, Any]) -> bool:
    expires_at = link.get("expires_at")
    if not expires_at:
        return False
    try:
        expiry = datetime.fromisoformat(expires_at.replace("Z", "+00:00"))
    except ValueError:
        expiry = datetime.strptime(expires_at, "%Y-%m-%d %H:%M:%S")
    return expiry < datetime.utcnow()
