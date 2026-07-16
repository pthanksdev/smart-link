from app.services import analytics_service


def get_stats(alias: str) -> tuple[dict, int]:
    stats = analytics_service.get_stats(alias)
    if not stats:
        return {"error": f"Alias '{alias}' not found"}, 404
    return stats, 200
