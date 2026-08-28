# Review handoff — Photo Exit Manifest review 5

## Outcome

Review only: no product code was changed. `.factory/review-5.md` records a **FAIL** with two blocking regressions:

1. Back navigation returns home at the top rather than the prior scroll position; the clean-clone browser suite also fails on this route-history path.
2. README says the demo stores no sample data, but the required offline cache includes the static `/demo/` page containing the bundled sample.

## Verification performed

- Fresh live browser contexts at 390×844 and 1366×900: clear first screen, no console errors, no overflow.
- Live demo: one-click `?demo=1` → `/demo/`, completed 6/5/1/0 audit, banner/reset/focus, offline reload, same-origin requests, and documented Cache Storage inspected.
- Live routes/metadata/link checks: home, demo, privacy, terms, designed 404, shared shell, and same-origin crawl.
- Clean clone: `/tmp/photo-exit-manifest-review5-clean-HMtmTI/repo` at `7241a3d`; `npm ci`, generated copy audit, all 18 tagged claim tests, and CLI demo in an isolated temporary directory.
- Clean-clone `npm test` did **not** pass: `site/test/browser.test.mjs` route-history test failed with an execution-context-destroyed navigation error. Direct live reproduction shows the underlying lost-scroll behavior.

## How to verify after repair

```sh
npm ci
npm test
npm run audit:copy
```

Then, in a fresh browser: scroll home, open Privacy, use Back, and confirm the original scroll position and h1 focus both return. Visit `/demo/`, inspect Cache Storage, and ensure README accurately states that only static app/sample content—not family data—is cached.

## Known gaps

The two blocking findings in `.factory/review-5.md` remain unresolved. Pre-existing `graphify-out/` changes were preserved and excluded from this review commit.
