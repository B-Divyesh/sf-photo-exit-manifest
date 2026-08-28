# Review 2 handoff — Photo Exit Manifest

## Outcome

Adversarial first-read review 2 is complete for commit `ea7f415fe17cd754d73b3a3a8bed36b84de9bb5c` and the matching live deployment.

Verdict: **FAIL** with seven blocking and three minor findings. The full evidence, exact quotes, rewrites, claim results, historical-finding audit, copy audit, and remediation criteria are in `.factory/review-2.md`.

No product code was changed.

## Main findings

- The documented one-click demo lands on `/demo/?demo=1`, which fails to reload offline; the registered test only checks `/demo/`.
- Landing copy falsely says edited files hold a report, while the live demo shows an edit warning in a ready report.
- The CLI no-network promise lacks runtime network interception.
- Device-policy recording, album-label gating, tracking absence, and release/build statements are not fully represented in `.factory/claims.json`.
- Two first-page labels are unclear, “quickest” is untested marketing copy, and nine prior landing word counts are inaccurate.

## Verification performed

From a separate clean clone at `/tmp/photo-exit-review2-clean-QmTXYg/repo`:

```sh
npm ci
# Each of the 11 commands in .factory/claims.json, separately
npm test
npm run build
./target/debug/photo-exit-manifest demo --json
```

All listed claim commands, the full test suite, and the build passed. The build produced `dist/site/` and the packaged Linux executable.

Live checks covered:

- cold 390×844 and 1440×900 first screens;
- one-click demo, banner, reset, focus, storage sentinel, same-origin requests, and offline reload;
- route metadata, HTTP status, security headers, all links and hash targets;
- forward/back focus restoration;
- the factory URL verifier;
- axe on home, demo, privacy, terms, and 404 at mobile and desktop sizes.

Axe reported zero violations and the URL verifier found no console errors. Local production HTML and `sw.js` hashes matched the live responses.

## Files changed

- `.factory/review-2.md` — added the independent review.
- `.factory/handoff.md` — replaced the prior repair handoff with this review handoff, as required by the work order.

Pre-existing `graphify-out/` modifications and untracked cache files were left untouched and excluded from the review commit.

## Next step

Repair F-2-1 through F-2-10, then run a new adversarial review from a fresh browser context and clean clone. A green existing suite is not sufficient until the documented one-click offline path and every public claim are tested directly.
