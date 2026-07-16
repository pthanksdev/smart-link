from typing import Any

from app.db import get_db


def create_click(
    link_id: int,
    ip_address: str | None,
    user_agent: str | None,
    referrer: str | None,
) -> None:
    db = get_db()
    db.execute(
        "INSERT INTO clicks (link_id, ip_address, user_agent, referrer) VALUES (?, ?, ?, ?)",
        (link_id, ip_address, user_agent, referrer),
    )
    db.commit()


def get_clicks_for_link(link_id: int) -> list[dict[str, Any]]:
    db = get_db()
    rows = db.execute(
        "SELECT clicked_at, ip_address, user_agent, referrer FROM clicks "
        "WHERE link_id = ? ORDER BY clicked_at DESC",
        (link_id,),
    ).fetchall()
    return [dict(r) for r in rows]
