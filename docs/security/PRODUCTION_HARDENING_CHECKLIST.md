# Production hardening checklist

## Identity and secrets

- [ ] Run on supported Node 22; pin runtime and lockfile in CI/deployment.
- [ ] Set strong unique JWT signing secrets; rotate any previously exposed values and invalidate sessions as appropriate.
- [ ] Configure Resend sender/domain verification, `AUTH_EMAIL_BASE_URL`, and approved origins; test delivery and bounce handling in staging.
- [ ] Keep public signup disabled unless explicitly approved; verify default role has no permissions.
- [ ] Store secrets in the deployment secret manager; scan CI artifacts and logs for credentials; rotate exposed credentials.
- [ ] Confirm cookies are Secure, HttpOnly, SameSite, scoped correctly, and use HTTPS end-to-end.

## Runtime and edge

- [ ] Apply distributed throttling to login, registration, forgot/resend/reset, contact/consultation, view counter, and uploads.
- [ ] Configure trusted proxy headers and request/body timeouts; impose multipart limits at CDN and application edge.
- [ ] Verify TLS, redirects, HSTS preload decision, DNS, CAA, and certificate renewal.
- [ ] Validate response security headers and design a CSP reporting/rollout plan before enforcement.
- [ ] Confirm production `/api/test-db` returns 404 and no public diagnostics disclose database status.

## Data and uploads

- [ ] Use least-privilege MongoDB credentials, network restrictions, encrypted backups, restore drills, and alerting.
- [ ] Review indexes from a backup/staging copy; migrate deliberately with owner approval and a rollback plan.
- [ ] Verify Vercel Blob token scope, public/private access decision, lifecycle/retention, and orphan cleanup.
- [ ] Test file signatures and serving headers; consider image dimension limits, malware scanning, and content transformation.
- [ ] Ensure user/role APIs prevent privilege escalation and revoke sessions on privilege or status changes.

## Release evidence

- [ ] Node 22 CI passes typecheck, lint, tests, build, and current dependency audit.
- [ ] Route-by-route permission regression test passes, including public exceptions.
- [ ] Staging security/browser review and independent security review complete.
- [ ] Record deployed commit SHA, migration IDs, environment configuration evidence, monitoring owner, rollback path, and incident contact.
- [ ] Obtain explicit release approval after all gates in [FINAL_SECURITY_RELEASE_GATES.md](FINAL_SECURITY_RELEASE_GATES.md) pass.
