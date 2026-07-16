import threading

from flask import after_this_request, current_app, request

from app.models import click as click_model
from app.models import link as link_model
from app.services import analytics_service, shortener_service
from app.services.shortener_service import AliasConflictError
from app.utils.logger import setup_logger

logger = setup_logger()


def shorten(data: dict) -> tuple[dict, int]:
    url = data.get("url", "")
    custom_alias = data.get("customAlias")
    try:
        result = shortener_service.shorten_url(url, custom_alias)
        return result, 201
    except AliasConflictError as e:
        raise e
    except ValueError as e:
        raise ValueError(str(e))


def redirect_alias(alias: str):
    link = link_model.get_link_by_alias(alias)
    if not link:
        return {"error": f"Alias '{alias}' not found"}, 404

    if link_model.is_expired(link):
        return {"error": f"Alias '{alias}' has expired"}, 410

    original_url = link["original_url"]
    link_id = link["id"]

    @after_this_request
    def log_click(response):
        ip_address = request.remote_addr
        user_agent = request.headers.get("User-Agent")
        referrer = request.headers.get("Referer")
        app = current_app._get_current_object()

        def _log():
            try:
                with app.app_context():
                    click_model.create_click(
                        link_id,
                        ip_address,
                        user_agent,
                        referrer,
                    )
                    link_model.increment_click_count(link_id)
            except Exception as exc:
                logger.error("Failed to log click: %s", exc)

        threading.Thread(target=_log, daemon=True).start()
        return response

    return original_url, 302


def get_stats(alias: str) -> tuple[dict, int]:
    stats = analytics_service.get_stats(alias)
    if not stats:
        return {"error": f"Alias '{alias}' not found"}, 404
    return stats, 200


def list_links(page: int, limit: int) -> tuple[dict, int]:
    return analytics_service.list_links(page, limit), 200


def delete_link(alias: str) -> tuple[None, int]:
    if not link_model.delete_link_by_alias(alias):
        return {"error": f"Alias '{alias}' not found"}, 404
    return None, 204
