import re
import secrets
import sqlite3

from flask import current_app

from app.models import link as link_model

ALIAS_PATTERN = re.compile(r"^[a-zA-Z0-9_-]{4,20}$")


def validate_alias(alias: str) -> bool:
    return bool(ALIAS_PATTERN.match(alias))


def validate_url(url: str) -> bool:
    if not url or not isinstance(url, str):
        return False
    pattern = re.compile(
        r"^https?://"
        r"(?:(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+[A-Z]{2,6}\.?|"
        r"localhost|"
        r"\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})"
        r"(?::\d+)?"
        r"(?:/?|[/?]\S+)$",
        re.IGNORECASE,
    )
    return bool(pattern.match(url))


def generate_alias() -> str:
    return secrets.token_urlsafe(6)[:6]


def shorten_url(url: str, custom_alias: str | None = None) -> dict:
    if not validate_url(url):
        raise ValueError("Invalid URL format. Must be a valid http or https URL.")

    alias = custom_alias or generate_alias()
    if custom_alias and not validate_alias(custom_alias):
        raise ValueError(
            "Invalid alias format. Must be 4-20 characters, alphanumeric, underscore, or hyphen."
        )

    try:
        link = link_model.create_link(alias, url)
    except sqlite3.IntegrityError:
        if custom_alias:
            raise AliasConflictError(f"Alias '{custom_alias}' is already taken.")
        alias = generate_alias()
        try:
            link = link_model.create_link(alias, url)
        except sqlite3.IntegrityError:
            raise AliasConflictError("Failed to generate a unique alias. Please try again.")

    return {
        "alias": link["alias"],
        "shortUrl": f"{current_app.config['BASE_URL']}/{link['alias']}",
        "originalUrl": link["original_url"],
    }


class AliasConflictError(Exception):
    pass
