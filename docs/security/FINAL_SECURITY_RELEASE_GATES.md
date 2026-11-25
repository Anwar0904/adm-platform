# Final security release gates

## Decision: NO-GO

Source checks pass on the current local worktree, but live staging and owner/reviewer gates remain open. No Production data, configuration, or deployment was accessed or changed.

## Evidence recorded

- Current security code candidate: `beb9127e6be3114dbe618c43c122539259c93afb` on `security/platform-hardening-review`.
- GitHub Actions quality run #20 (`45650521859`) passed dependency audit, Production build, ESLint, and TypeScript/unit tests on the security code candidate using the supported Node 22 CI runtime. Run #19 (`45623731517`) passed for the previous SHA `da77e82c7f1be92e20839c70248f34e7a0971feb`.
- Local typecheck passed; full lint exited 0 with 76 warnings before the final small auth changes and targeted lint passed afterward; tests completed with 111 passed / 0 failed / 1 skipped plus 3/3 Preview-harness policy tests; a synthetic-config production build passed. The Redis integration test skipped because a dedicated isolated fixture was not configured. Plain local Node 22.23.5 `npm test` fails before assertions on this Windows sandbox because `tsx` calls `os.userInfo()` and gets `uv_os_get_passwd ENOMEM`; an invocation-only temporary shim allowed the same suite to pass and was removed. CI run #20 passes without this host workaround.
- The previous Vercel Ready comment and Preview alias refer to `da77e82`; GitHub currently has no Vercel status for `beb9127`. Deployment of the current code candidate and the exact serving SHA remain unverified.
- API-handler authorization, reset/verification expiry, Redis-adapter behavior, and Preview-harness policy tests now have local regression coverage. These are mocked/local tests, not live Preview checks.

## Open gates

- [ ] Direct Preview Users/Role API verification using `staging_viewer` and Super Admin, including state-preserving write denials.
- [ ] Live login/logout/revocation and stale refresh-token replay using disposable sessions.
- [ ] Reset and verification delivery, one-time use, expiry, and session-revocation checks with a controlled staging inbox.
- [ ] HTTP 429 through the deployed Preview limiter and evidence that counters are shared across Preview requests.
- [ ] HTTP 503 timeout/failure behavior. **Do not fault-inject** until a deployment owner confirms an exclusive disposable Preview deployment/Redis fixture and authorizes it.
- [ ] Owner attestation of Preview/Production MongoDB, Redis, mail, Vercel runtime/environment scopes, deployed headers, and rollback target.
- [ ] Independent security review of the exact final SHA. PR #3 is still draft; no submitted review or requested reviewer is recorded.
- [ ] Confirm the required GitHub checks pass on the final PR head after the documentation-only sign-off follow-up commit.
- [ ] Review and split unrelated portfolio/design/cleanup work if maintainers approve. Do not remove legitimate changes or rewrite history without approval.

The Production `MONGODB_DB` fallback was removed in code candidate `beb9127`: Production now fails fast unless `MONGODB_DB` is explicitly set. No Production setting was changed. The source adds host-only HSTS (`max-age=31536000`) with no subdomain/preload commitment; deployed header delivery still needs owner verification. CSP remains unenforced because Next.js 16 nonce support requires dynamic rendering and compatibility testing; do not add an untested restrictive CSP.

## Approval rule

Keep PR #3 unmerged and out of Production until every open gate has evidence, an independent reviewer records findings for the final SHA, fixes pass fresh CI, and the release owner explicitly accepts any residual risk. See [SECURITY_RELEASE_SIGNOFF.md](SECURITY_RELEASE_SIGNOFF.md) for the safe Preview procedure and [DEPLOYMENT_OWNER_ATTESTATION.md](DEPLOYMENT_OWNER_ATTESTATION.md) for the owner evidence form.
