# Portfolio experience design

## Experience structure

The public route keeps server-side portfolio retrieval and composes five editorial chapters beneath the shared public layout. The shared layout owns the only page `<main>`, navbar and footer.

1. **Statement:** “Where ambitious ideas take shape.” The hero is specific to the portfolio, gives an adaptive primary link (selected work when available, capabilities otherwise), and a secondary consultation link.
2. **Signature stage:** an original connected-systems illustration connects Technology, Marketing, AI and Data around “Useful systems.” Selecting a discipline immediately changes the business challenge and one possible engagement approach. The diagram is explicitly labeled illustrative, not project evidence.
3. **Evidence first:** approved records appear directly after the hero, feature one approved record, then use a varied project grid. Empty state instead presents four editorial problem/approach stories with bespoke SVG system sketches. A temporary data outage has distinct copy and retains useful capability content.
4. **Approach:** five expandable stages (Understand, Shape, Build, Validate, Evolve) explain collaboration without promising a fixed process, schedule or outcome.
5. **Decision support and close:** four buyer questions use native disclosures; the final section offers consultation and contact paths.

## Visual and responsive decisions

The page keeps the midnight navy/cyan ADM palette and shared navigation. It uses a split, high-contrast hero with a fine grid texture and a responsive illustrative stage. The hero scales its headline with `clamp`, shifts to a single column on smaller screens and retains all four touch-sized selectors. The zero-record stories vary their editorial number, copy, and diagram layout rather than repeating four icon cards. Approved work uses an asymmetric feature, then a responsive grid. Facets appear only when there are multiple values to choose from.

SVG and CSS illustrations avoid stock photography and avoid looking like fabricated client product screenshots. Approved CMS visuals are used only when provided by the approved-public service. Motion is limited to subtle hover/indicator behavior and respects reduced-motion preferences; essential content renders without animation. No added package dependencies.

## Copy and interaction rationale

Copy frames problem areas and possible approaches rather than claiming that ADM has delivered a specific result. Capability selector buttons expose `aria-pressed`, preserve standard keyboard activation and update an `aria-live` region. Search and filters operate on the approved records passed from the server; a result announcement is available to screen readers and a no-match state offers reset. No shareable URL filter state or pagination is included because the server provides at most 50 records and no detailed case route exists.

## Preview limitations

No visual browser/screenshot run was available in this implementation session. Responsive behavior and illustrative sample-data state are therefore not screenshot-verified; see `PORTFOLIO_VISUAL_QA.md` for a reproducible review recipe and release conditions.
