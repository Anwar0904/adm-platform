import json
import os
import time
import urllib.request
import xml.etree.ElementTree as ET


base_url = os.environ.get("SMOKE_BASE_URL", "http://127.0.0.1:3000").rstrip("/")
canonical_origin = os.environ["CANONICAL_ORIGIN"].rstrip("/")
namespace = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}


def fetch(path):
    start = time.monotonic()
    request = urllib.request.Request(f"{base_url}{path}", headers={"User-Agent": "adm-ci-smoke/1.0"})
    with urllib.request.urlopen(request, timeout=10) as response:
        body = response.read()
        return response.status, response.headers.get("Content-Type", ""), body, time.monotonic() - start


robots_status, robots_type, robots_body, _ = fetch("/robots.txt")
sitemap_status, sitemap_type, sitemap_body, sitemap_seconds = fetch("/sitemap.xml")

assert robots_status == 200, f"robots status: {robots_status}"
assert robots_type.lower().startswith("text/plain"), f"robots content type: {robots_type}"
robots_text = robots_body.decode("utf-8")
assert f"Sitemap: {canonical_origin}/sitemap.xml" in robots_text
assert f"Sitemap: {canonical_origin}/cms-sitemap.xml" in robots_text

assert sitemap_status == 200, f"sitemap status: {sitemap_status}"
assert sitemap_type.lower().startswith(("application/xml", "text/xml")), f"sitemap content type: {sitemap_type}"
assert sitemap_seconds < 2, f"static sitemap took {sitemap_seconds:.3f}s"
root = ET.fromstring(sitemap_body)
assert root.tag == f"{{{namespace['sm']}}}urlset", f"unexpected XML root: {root.tag}"
locations = [node.text or "" for node in root.findall("sm:url/sm:loc", namespace)]
assert f"{canonical_origin}/" in locations, "home URL missing"
for path in ("/services/technology", "/services/marketing", "/services/ai", "/services/data"):
    assert f"{canonical_origin}{path}" in locations, f"expected route missing: {path}"
for absent_path in ("/team", "/faq", "/portfolio/example", "/industries/example"):
    assert f"{canonical_origin}{absent_path}" not in locations, f"unexpected route present: {absent_path}"
assert all(location.startswith(f"{canonical_origin}/") for location in locations)

print(json.dumps({
    "robots_status": robots_status,
    "robots_content_type": robots_type,
    "sitemap_status": sitemap_status,
    "sitemap_content_type": sitemap_type,
    "sitemap_seconds": round(sitemap_seconds, 3),
    "sitemap_url_count": len(locations),
    "canonical_origin": canonical_origin,
}, sort_keys=True))
