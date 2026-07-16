from flask import Flask
from flask_cors import CORS

from app.config import Config, apply_env_overrides
from app.db import close_db, init_db
from app.middleware.error_handler import register_error_handlers
from app.middleware.rate_limiter import limiter
from app.routes import link_bp, stats_bp


def create_app(config_class=Config) -> Flask:
    app = Flask(__name__)
    app.config.from_object(config_class)
    apply_env_overrides(app)

    CORS(app)
    limiter.init_app(app)
    register_error_handlers(app)

    app.register_blueprint(link_bp)
    app.register_blueprint(stats_bp)

    app.teardown_appcontext(close_db)

    with app.app_context():
        init_db()

    @app.route("/health")
    def health():
        return {"status": "ok"}, 200

    return app
