# Review 4 handoff — Photo Exit Manifest

## Outcome

Adversarial first-read review 4 is complete. The verdict is **FAIL** with five blocking findings and one minor finding. No product code was changed. The complete evidence, earlier-finding audit, copy audit, and concrete fixes are in `.factory/review-4.md`.

## Verification performed

- Cold live Chromium at 390×844 and 1440×900.
- One-click demo entry, realistic first state, banner, Reset demo, Start for real, storage isolation, same-origin requests, and offline reload/re-entry.
- Default `photo-exit-manifest demo --json` from the clean clone.
- Every one of the 16 `.factory/claims.json` commands, separately.
- Aggregate `npm test` and `npm run build`.
- Live metadata/route/404 checks, 13-destination link and fragment crawl, focus/history/scroll restoration, mobile target and overflow checks, and reduced motion.
- Live axe on five routes at 390px and 1366px: 0 violations.
- Factory URL verifier: HTTP 200, one h1, `lang=en`, main, complete labels, and zero console errors.
- `npm run audit:copy`: 25 landing sentences and 37 README sentences; no generated drift.
- Local/live SHA-256 equality for home, demo, privacy, terms, 404, and service worker.

Clean-clone path used during this disposable review: `/tmp/photo-exit-review4-clean-9okhKw/repo` at `0ae68230ccd99864a884da8889a4af24eb51ba84`.

## Known gaps

- “Stores nothing in your browser” conflicts with the required 16-entry service-worker cache; the privacy claim test does not inspect Cache Storage.
- Exact SHA-256 matching is public but not asserted by a registered claim test.
- File-size/media-type inventory wording is not fully represented or tested; no explicit media-type field is emitted.
- Browser demo numbers and “real CLI” presentation are not checked against generated CLI output.
- Demo isolation tests always provide `--output`, so the advertised automatic temporary-workspace path is outside the claim gate.
- The sample report repeats the same edited-file warning twice.

## Next step

Address F-4-1 through F-4-6 in `.factory/review-4.md`, then rerun every registered claim command and the full live checklist. Pre-existing modified files under `graphify-out/` were preserved and must remain outside the review commit.
