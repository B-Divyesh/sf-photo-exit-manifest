# Photo Exit Manifest — repair 2 handoff

## Outcome

**PASS.** Repair 2 closes the sole finding from review 7 and preserves the previously verified CLI, demo, privacy, routing, and offline behavior.

- Implementation SHA: `d4536a151c62ffe2f4fece13b1a4cb9a07f31c72`
- Live URL: <https://photo-exit-manifest.sociobot.in/>
- Deployment: `5458bda2-72ee-43ed-8c0b-777ee3f26dd1`
- Deployed: 6 September 2026 UTC

The implementation SHA was pushed to `origin/main` before deployment. This handoff is a later documentation-only change; the deployed artifact remains the implementation SHA above.

## Repair

The phone header can now wrap onto two rows when enlarged text makes the brand and navigation wider than one row. The normal 390 px layout remains on one row. An outcome-based browser regression doubles the root text size on home, demo, privacy, terms, and 404, then verifies that the document stays within the 390 px viewport and Privacy remains on-screen.

Live verification at 200% text size recorded `clientWidth: 390` and `scrollWidth: 390` on all five routes. Demo and Privacy both remained fully visible. Review 7 had recorded a 504 px document width before the repair.

## Cold product check

Fresh 390×844 and 1440×900 Chromium contexts identified the same first-screen information before scrolling:

- Job: verify a family photo archive before leaving the cloud.
- Audience: families moving photos from Google Photos to their own archive.
- First action: **Try it with sample data** to see a completed audit and signed migration report.

The three facts and primary action remained above the fold at normal text size. Neither viewport had horizontal overflow or console errors.

The one-click sample opened canonical `/demo/` and showed Ready to review, 6 source items, 5 exact matches, 1 named exception, 0 unexplained items, Morgan family as signer, and the five documented report files. The sample label remained at the top after scrolling. Reset closed disclosures, restored the sample status, and focused the h1. Start for real linked to `/#install`.

Seeded local storage, session storage, cookie, and IndexedDB sentinels remained unchanged through entry, reset, offline reload, and offline query entry. The only added storage was the documented 16-file static app cache. All observed requests were same-origin.

## Clean verification

Verification used a detached clean worktree at the implementation SHA.

- `npm ci`: passed with 0 vulnerabilities.
- Every exact command in `.factory/claims.json`: 18/18 passed independently.
- `npm test`: passed — 8 Rust unit tests, 4 CLI integration tests, 4 site/contract tests, 1 PWA test, 5 browser tests, and 18 claim tests.
- `npm run build`: passed and produced `dist/site/` plus `dist/package/photo-exit-manifest-linux-x86_64`.
- `npm run audit:copy`: passed; 25 landing and 38 README sentences; no generated diff.
- `cargo fmt --check`: passed.
- `cargo clippy --all-targets -- -D warnings`: passed.
- `cargo package --allow-dirty`: passed package verification; 108 files, 340.0 KiB compressed.
- Local and live axe checks: 0 violations on five routes at 390 px and 1366 px.
- Factory URL verifier: HTTP 200, correct title/lang/h1/main/alt/button names, and 0 console errors.

A clean consumer installed the packaged crate with `cargo install --path ... --root <new-root> --locked`. The installed binary showed help and version, completed `demo --json`, returned exit 1 for missing input, and returned exit 1 without overwriting an existing demo directory.

## Live checks

- Local and live SHA-256 values match for home, demo, privacy, terms, 404, and `sw.js`.
- Unknown routes return the designed page with deliberate HTTP 404.
- Keyboard Tab reveals the 3 px skip-link focus ring; all visible links and buttons are at least 44×44 px.
- Reduced motion uses `scroll-behavior: auto` and 0.01 ms transitions.
- A real Privacy link click followed by Back restored home scroll from 700 to 700 and focused the h1.
- Offline reload and the documented `/?demo=1` entry both reopened the sample.
- Security headers include HSTS, `nosniff`, strict-origin referrer policy, restrictive permissions policy, and a same-origin CSP with `frame-ancestors` in the response header.
- Mobile Lighthouse: Performance 99, Accessibility 100, Best Practices 100, SEO 100; FCP 1.06 s, LCP 1.53 s, TBT 116 ms, CLS 0.022, total transfer 125.4 KiB.
- Built initial assets remain within budget: CSS 21.77 kB raw, application JavaScript about 3.4 kB raw, self-hosted fonts about 45.0 kB, and hero art 71.8 kB.

Evidence is in `/work/.evidence/photo-exit-manifest-repair-2/`. The catalog description is copied to `/work/.evidence/catalog-description.txt` and matches `.factory/catalog-description.txt`.

## Earlier findings

Review 7's 200% text-resize finding is fixed and covered on every public route. Review 6 had no findings. Every earlier blocking, major, and minor finding remains fixed: `R1-B1` through `R1-S1`, `F-2-1` through `F-2-10`, `F-3-1` through `F-3-2`, `F-4-1` through `F-4-6`, and `F-5-1` through `F-5-2`.

## Remaining work

No known product defect remains in scope. The product has no backend, shared database, paid offer, billing registration, or AI dependency. Registry publication remains a factory operation and was not performed.

The pre-existing modified Graphify files were preserved and excluded from the implementation and handoff commits.
