from flask import Blueprint, jsonify, redirect, request

from app.controllers import link_controller
from app.middleware.rate_limiter import limiter
from app.middleware.validators import ShortenRequest

link_bp = Blueprint("links", __name__)


@link_bp.route("/api/shorten", methods=["POST"])
@limiter.limit("20 per minute")
def shorten():
    data = ShortenRequest(**request.get_json(silent=True) or {})
    result, status = link_controller.shorten(data.model_dump())
    return jsonify(result), status


@link_bp.route("/<alias>", methods=["GET"])
def redirect_alias(alias: str):
    if alias.startswith("api"):
        return jsonify({"error": "Resource not found"}), 404
    result, status = link_controller.redirect_alias(alias)
    if status == 302:
        return redirect(result, code=302)
    return jsonify(result), status


@link_bp.route("/api/links", methods=["GET"])
def list_links():
    page = request.args.get("page", 1, type=int)
    limit = request.args.get("limit", 20, type=int)
    limit = min(max(limit, 1), 100)
    page = max(page, 1)
    result, status = link_controller.list_links(page, limit)
    return jsonify(result), status


@link_bp.route("/api/links/<alias>", methods=["DELETE"])
def delete_link(alias: str):
    result, status = link_controller.delete_link(alias)
    if status == 204:
        return "", 204
    return jsonify(result), status
