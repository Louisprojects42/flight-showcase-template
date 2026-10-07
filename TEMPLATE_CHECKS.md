# Template validation

- TypeScript, ESLint and the static production build passed.
- Four browser tests passed in Chromium through Microsoft Edge.
- Desktop scroll, mobile navigation, theme preference, reduced motion and JavaScript-free content were checked.
- Desktop (1440 × 900), mobile (390 × 844), tablet (768 × 1024), docs and pricing screenshots are in `preview/`.
- The built static export was checked for the live aircraft, navigation, placeholder pages and asset delivery.
- Removed interactive tool, account and API routes return 404.
- The public-content check found no private identifiers, credentials or backend routes. The GLB contains only standard geometry chunks; source metadata and baked fields are absent.
- There is no inherited Git history, environment file or remote configuration.

The aircraft redistribution permission remains unconfirmed; see `ASSET_NOTICES.md`. Physical mobile devices, Safari and Firefox were not tested.
