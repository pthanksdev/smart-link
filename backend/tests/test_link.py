def test_create_link(client):
    response = client.post(
        "/api/shorten",
        json={"url": "https://example.com/long/path"},
    )
    assert response.status_code == 201
    data = response.get_json()
    assert "alias" in data
    assert data["shortUrl"] == f"http://localhost:5000/{data['alias']}"
    assert data["originalUrl"] == "https://example.com/long/path"


def test_custom_alias_collision(client):
    payload = {"url": "https://example.com/a", "customAlias": "my-link"}
    r1 = client.post("/api/shorten", json=payload)
    assert r1.status_code == 201

    r2 = client.post(
        "/api/shorten",
        json={"url": "https://example.com/b", "customAlias": "my-link"},
    )
    assert r2.status_code == 409
    assert "already taken" in r2.get_json()["error"]


def test_invalid_url(client):
    response = client.post("/api/shorten", json={"url": "not-a-url"})
    assert response.status_code == 400


def test_invalid_alias(client):
    response = client.post(
        "/api/shorten",
        json={"url": "https://example.com", "customAlias": "ab"},
    )
    assert response.status_code == 400


def test_redirect_and_click_logging(client):
    create = client.post(
        "/api/shorten",
        json={"url": "https://example.com/target", "customAlias": "redirect-test"},
    )
    alias = create.get_json()["alias"]

    response = client.get(
        f"/{alias}",
        headers={"User-Agent": "TestAgent/1.0", "Referer": "https://google.com"},
        follow_redirects=False,
    )
    assert response.status_code == 302
    assert response.location == "https://example.com/target"

    import time

    time.sleep(0.5)

    stats = client.get(f"/api/stats/{alias}").get_json()
    assert stats["totalClicks"] >= 1


def test_redirect_not_found(client):
    response = client.get("/nonexistent-alias")
    assert response.status_code == 404


def test_list_links_pagination(client):
    for i in range(3):
        client.post("/api/shorten", json={"url": f"https://example.com/{i}"})

    response = client.get("/api/links?page=1&limit=2")
    assert response.status_code == 200
    data = response.get_json()
    assert data["page"] == 1
    assert data["limit"] == 2
    assert data["total"] >= 3
    assert len(data["links"]) == 2


def test_delete_link(client):
    create = client.post(
        "/api/shorten",
        json={"url": "https://example.com/delete", "customAlias": "delete-me"},
    )
    alias = create.get_json()["alias"]

    delete = client.delete(f"/api/links/{alias}")
    assert delete.status_code == 204

    get = client.get(f"/{alias}")
    assert get.status_code == 404


def test_delete_not_found(client):
    response = client.delete("/api/links/does-not-exist")
    assert response.status_code == 404
