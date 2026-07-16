import time


def test_stats_not_found(client):
    response = client.get("/api/stats/nonexistent")
    assert response.status_code == 404


def test_stats_aggregation(client):
    create = client.post(
        "/api/shorten",
        json={"url": "https://example.com/stats", "customAlias": "stats-test"},
    )
    alias = create.get_json()["alias"]

    for referrer in ["https://twitter.com", "https://twitter.com", "https://google.com"]:
        client.get(
            f"/{alias}",
            headers={"User-Agent": "Mozilla/5.0 Test", "Referer": referrer},
            follow_redirects=False,
        )

    time.sleep(0.5)

    response = client.get(f"/api/stats/{alias}")
    assert response.status_code == 200
    data = response.get_json()

    assert data["alias"] == alias
    assert data["originalUrl"] == "https://example.com/stats"
    assert data["totalClicks"] >= 3
    assert "clicksByDay" in data
    assert len(data["topReferrers"]) >= 1
    assert len(data["topUserAgents"]) >= 1
    assert len(data["recentClicks"]) >= 1

    twitter = next((r for r in data["topReferrers"] if "twitter" in r["referrer"]), None)
    assert twitter is not None
    assert twitter["count"] >= 2
