# Phase 6 SEO, UX, accessibility, and reliability

## SEO and route behavior

- `/portfolio` retains the existing canonical and Open Graph URL based on `SITE_URL`; metadata contains no project/client proof. The route is dynamically rendered so CMS approval changes are visible per request. Cards have no internal detail links. The public slug endpoint returns 404 unless publication and item approval both pass.
- Public portfolio reads select approved fields and set `Cache-Control: no-store` so consent revocation is not delayed by application caching. The public portfolio sitemap currently adds no dynamic project URLs; no detail URLs were introduced. Static `/sitemap.xml`, `/robots.txt`, and CMS sitemap source were not otherwise modified.
- `SITE_URL` defaults to the apex URL in source, but actual production environment configuration and apex/www redirect are unverified. Robots behavior, Search Console, live content type/status, and CMS sitemap health/outage responses require staging/production access.

## Visitor journeys and accessibility work

- Empty `/portfolio` provides four capability pathways, process guidance, and working `/consultation` CTAs without hypothetical project cards. A CMS outage preserves that content and gives a temporary availability message.
- Approved-record filters operate over displayed eligible entries and include search, capability, category, industry, technology, and reset/empty states. The old nonfunctional `Load More Projects` control is absent. No query-string indexing variants were added.
- Portfolio cards include image alt text or a neutral graphic. Outbound URLs accept only HTTP(S). Filter labels are explicit, controls are keyboard-focusable with visible focus styles, and no custom animation is used in the new selected-work UI.
- Contact and consultation forms remain mounted. Contact methods containing unverified email/phone/location details are omitted. Form validation, notifications, storage, abuse controls, consent/retention, and PII-safe analytics were not verified against staging.
- About-page third-party sample video playback is removed. Existing animation-heavy components outside the touched route need a full reduced-motion and keyboard review.

## Measurements

After the production build, a local `next start` HTTP smoke via `curl.exe` returned: `/` 200 `text/html`; `/robots.txt` 200 `text/plain`; `/sitemap.xml` 200 `application/xml`; `/about`, `/contact`, and `/industries` 200 `text/html`. `/portfolio` was not requested locally because its dynamic server render would use the configured database connection; no production/staging CMS data was queried.

No desktop/tablet/mobile screenshots, browser cross-check, screen-reader review, Lighthouse lab run, or field Core Web Vitals were collected. WCAG 2.2 AA and LCP/INP/CLS targets are not certified. Production/live checks are blocked by network and staging credentials, not inferred from crawler text.
