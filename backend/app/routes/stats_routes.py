from flask import Blueprint, jsonify

from app.controllers import stats_controller

stats_bp = Blueprint("stats", __name__)


@stats_bp.route("/api/stats/<alias>", methods=["GET"])
def get_stats(alias: str):
    result, status = stats_controller.get_stats(alias)
    return jsonify(result), status
