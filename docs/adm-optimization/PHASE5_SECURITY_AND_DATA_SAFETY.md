# Phase 5 security and data safety

## Seed command

`src/database/seed.ts` now exits with an error before connecting to MongoDB. The former implementation deleted all `Role` records and recreated them with empty permission arrays. This conflicts with the current `Role` permission schema and could remove active authorization data. The script was not run; no production or staging database was contacted. Its test asserts the hard stop and absence of connection or destructive role operations.

The existing `src/lib/seed/roles.seed.ts` performs upserts that overwrite role permissions; it is not an approved replacement. Do not enable either seeding path until the owner approves an idempotent role fixture with an explicit environment boundary.

## Authentication and CI

Production runtime validation remains strict. The synthetic JWT values and unreachable database address are scoped to the quality workflow build job and must not be used as runtime configuration or as a promotable artifact. No values from `.env.local` were read or copied.

## Forms and data access

No form submissions, outbound email, migrations, seed runs, or database writes were made. Contact and consultation delivery, abuse controls, idempotency, retention, and routing have not been verified against staging. Existing API and validator behavior was not intentionally changed.

The CMS sitemap now uses bounded pagination for blog/service data, batches page fetches, limits careers reads to 50,001 records to detect overflow, and returns non-cacheable 503 with `Retry-After` on data failure or an incomplete/over-limit set. Healthy-DB publication completeness and actual query timing remain staging checks.

## Rollback

Revert `src/database/seed.ts` and its test together only if the seed path remains operationally disabled by other means; the prior script is destructive and must never be run. Revert sitemap route/service/repository changes together if deployment reveals query incompatibility, while retaining the static sitemap path.
