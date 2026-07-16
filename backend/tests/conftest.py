import os
import tempfile

import pytest

from app import create_app


@pytest.fixture
def app():
    db_fd, db_path = tempfile.mkstemp(suffix=".sqlite")
    os.close(db_fd)

    os.environ["DB_PATH"] = db_path
    os.environ["BASE_URL"] = "http://localhost:5000"

    application = create_app()
    application.config["TESTING"] = True

    yield application

    os.unlink(db_path)


@pytest.fixture
def client(app):
    return app.test_client()
