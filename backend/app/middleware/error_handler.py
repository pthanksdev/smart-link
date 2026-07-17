from flask import Flask, jsonify
from pydantic import ValidationError
from werkzeug.exceptions import HTTPException

from app.services.shortener_service import AliasConflictError
from app.utils.logger import setup_logger

logger = setup_logger()


def register_error_handlers(app: Flask) -> None:
    @app.errorhandler(ValidationError)
    def handle_validation_error(e: ValidationError):
        messages = "; ".join(
            f"{'.'.join(str(loc) for loc in err['loc'])}: {err['msg'].replace('Value error, ', '')}"
            for err in e.errors()
        )
        return jsonify({"error": messages}), 400

    @app.errorhandler(AliasConflictError)
    def handle_alias_conflict(e: AliasConflictError):
        return jsonify({"error": str(e)}), 409

    @app.errorhandler(ValueError)
    def handle_value_error(e: ValueError):
        return jsonify({"error": str(e)}), 400

    @app.errorhandler(404)
    def handle_not_found(e):
        return jsonify({"error": "Resource not found"}), 404

    @app.errorhandler(HTTPException)
    def handle_http_exception(e: HTTPException):
        return jsonify({"error": e.description or "An error occurred"}), e.code

    @app.errorhandler(Exception)
    def handle_generic_exception(e: Exception):
        logger.exception("Unhandled exception: %s", e)
        return jsonify({"error": "Internal server error"}), 500
