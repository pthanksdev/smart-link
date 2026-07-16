from collections import Counter
from datetime import datetime
from typing import Any

from app.models import click as click_model
from app.models import link as link_model
from app.utils.parse_user_agent import extract_referrer_domain


def _format_datetime(dt_str: str) -> str:
    if not dt_str:
        return ""
    try:
        dt = datetime.fromisoformat(dt_str.replace("Z", "+00:00"))
    except ValueError:
        dt = datetime.strptime(dt_str, "%Y-%m-%d %H:%M:%S")
    return dt.strftime("%Y-%m-%dT%H:%M:%SZ")


def _format_date(dt_str: str) -> str:
    if not dt_str:
        return ""
    try:
        dt = datetime.fromisoformat(dt_str.replace("Z", "+00:00"))
    except ValueError:
        dt = datetime.strptime(dt_str, "%Y-%m-%d %H:%M:%S")
    return dt.strftime("%Y-%m-%d")


def get_stats(alias: str) -> dict[str, Any] | None:
    link = link_model.get_link_by_alias(alias)
    if not link:
        return None

    clicks = click_model.get_clicks_for_link(link["id"])

    clicks_by_day: Counter[str] = Counter()
    referrer_counts: Counter[str] = Counter()
    ua_counts: Counter[str] = Counter()

    for click in clicks:
        day = _format_date(click["clicked_at"])
        clicks_by_day[day] += 1
        referrer_counts[extract_referrer_domain(click["referrer"])] += 1
        ua = click["user_agent"] or "unknown"
        ua_counts[ua] += 1

    top_referrers = [
        {"referrer": ref, "count": count}
        for ref, count in referrer_counts.most_common(10)
    ]
    top_user_agents = [
        {"userAgent": ua, "count": count}
        for ua, count in ua_counts.most_common(10)
    ]

    recent_clicks = [
        {
            "timestamp": _format_datetime(c["clicked_at"]),
            "userAgent": c["user_agent"] or "",
            "referrer": extract_referrer_domain(c["referrer"]),
            "ip": c["ip_address"] or "",
        }
        for c in clicks[:20]
    ]

    return {
        "alias": link["alias"],
        "originalUrl": link["original_url"],
        "createdAt": _format_datetime(link["created_at"]),
        "totalClicks": link["click_count"],
        "clicksByDay": dict(sorted(clicks_by_day.items())),
        "topReferrers": top_referrers,
        "topUserAgents": top_user_agents,
        "recentClicks": recent_clicks,
    }


def list_links(page: int = 1, limit: int = 20) -> dict[str, Any]:
    links, total = link_model.list_links(page, limit)
    formatted = [
        {
            "alias": link["alias"],
            "originalUrl": link["original_url"],
            "clickCount": link["click_count"],
            "createdAt": _format_datetime(link["created_at"]),
        }
        for link in links
    ]
    return {"page": page, "limit": limit, "total": total, "links": formatted}
