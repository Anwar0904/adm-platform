# Portfolio visual QA

## Implemented review targets

- Strong split hero with a portfolio-specific H1, adaptive primary action, and custom connected-capabilities visual.
- Keyboard/touch selectors update a capability-specific challenge and possible approach.
- Empty approved list shows four original problem/approach stories and states that these are not completed client engagements.
- Approved list leads with an asymmetric featured record and a responsive grid; filters search actual approved fields and expose category/industry only when useful.
- Outage state uses a different notice from a genuinely empty approved list.
- Native disclosure controls, focus-visible styling, result announcement, alt text and reduced-motion-friendly transitions are present.

## Screenshot status

**Not visually verified in a browser.** This environment did not provide a functioning browser screenshot/Playwright session during implementation. No desktop/tablet/mobile captures are claimed. In particular, the approved-record visual branch needs fixture-based review; no fixture was inserted into the real CMS or deployed.

## Reproducible review recipe

1. Run the site with an isolated local/staging database or a test-only injected fixture. Do not point preview testing at production and do not create records in a production database.
2. For an empty state, use an isolated DB with no approved public portfolio records. For an outage state, make the portfolio query fail in the isolated preview.
3. For the approved branch, pass a clearly synthetic local-only fixture with five representative records through the service boundary; remove fixture injection before any release.
4. Capture hero viewport and full page at 1440×900, 768×1024 and 390×844 for empty and approved states, plus a selected capability state and operating-system reduced-motion mode.
5. Review horizontal overflow, line breaks, tap target spacing, actual approved image crop/alt text, facet/no-result behavior, keyboard focus and contrast at each viewport.

Visual sign-off remains an open release gate until those captures are reviewed.
