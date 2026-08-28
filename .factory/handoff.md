# Polish 2 handoff — Photo Exit Manifest

## Outcome

Perfection-loop round 2 is complete. All ten review-2 findings and every earlier review-1 finding are resolved. The CLI remains the artifact, and the site keeps its luminous archive-glass identity.

Implementation commit: `ea43307`

Deployment: `a63a129e-48d9-4d0e-b77a-e818acaa30f3`

Live URL: https://photo-exit-manifest.sociobot.in/

## What changed

- Canonicalized the one-click `/?demo=1` route and made query-bearing navigation work from the offline cache.
- Corrected the edited-file readiness rule and clarified the first-screen folder, exception, and command-line labels.
- Expanded `.factory/claims.json` from 11 to 16 entries with readiness, device-policy, album-label, tracking, and build claims.
- Added runtime CLI network denial/recording and explicit browser request/storage/beacon checks.
- Removed unprovable release-ownership wording and the “quickest” comparison.
- Added reproducible landing/README word counts through `npm run audit:copy`.
- Updated the verb-first catalog line to 83 characters.

The finding-by-finding record is `.factory/polish-2.md`.

## How to verify

```sh
npm ci
npm test
cargo fmt --check
cargo clippy --all-targets -- -D warnings
npm run build
cargo package --allow-dirty
```

Run an individual claim with `npm run test:claims -- @claim:<id>`. The claim runner performs a production build before executing the observable test. Regenerate the copy audit with `npm run audit:copy`.

Clean-clone evidence at `/tmp/photo-exit-polish2-clean-9nzNyk/repo` passed all 16 claim commands separately and the complete command set above. `dist/site/` and executable `dist/package/photo-exit-manifest-linux-x86_64` were produced.

## Live evidence

- Factory URL verifier: HTTP 200, no console errors, correct title/lang/h1/main/alt/button checks.
- Axe: zero violations on five routes at 390px and 1366px.
- Cold browser: `/?demo=1` → `/demo/`; banner/reset/sentinel isolation passed; reload and direct documented-entry revisit passed offline.
- Routes: home/demo/privacy/terms returned 200 with distinct titles; unknown route returned 404 with the designed page; all local links and hashes passed.
- Tracking: five routes made 31 allowlisted same-origin static requests; no cookies, local/session storage, IndexedDB, or beacon calls.
- Deployment fidelity: home, demo, privacy, terms, 404, and service-worker SHA-256 values matched local build output.
- Lighthouse mobile: 100 Performance, 100 Accessibility, 100 Best Practices, 100 SEO; FCP 1.1s, LCP 1.4s, TBT 40ms, CLS 0.022.

Screenshots and reports are under `.factory/evidence/polish-2/` in this worktree.

## Known gaps and next steps

None. The Lighthouse process logged a Chrome teardown crash after writing its complete scored report; independent browser, axe, and URL checks all passed.
