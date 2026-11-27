import assert from "node:assert/strict";
import test from "node:test";

import nextConfig from "../../next.config";

test("security headers include host-only HSTS without changing CSP behavior", async () => {
    const rules = await nextConfig.headers?.();
    assert.ok(rules);

    const headers = rules.flatMap((rule) => rule.headers);
    const hsts = headers.find((header) => header.key.toLowerCase() === "strict-transport-security");
    assert.equal(hsts?.value, "max-age=31536000");
    assert.doesNotMatch(hsts?.value ?? "", /includeSubDomains|preload/i);
    assert.equal(
        headers.some((header) => header.key.toLowerCase() === "content-security-policy"),
        false,
        "CSP requires nonce-aware rollout and stays unenforced until that work is tested.",
    );
});
