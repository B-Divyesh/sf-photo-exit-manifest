# Perfection loop polish 4

**Reviewed candidate:** `0ae68230ccd99864a884da8889a4af24eb51ba84`

**Review report:** `6f4337194727b11ebfdd8658ea8fe1548813a496` / `.factory/review-4.md`

**Repair commits:** `4ba851e882da4be0843109e2dd533afb0077cec6`, `848260536d1138c47f2cf7df0cfbe342e915aee0`

**Deployment:** `78ef9eec-5ced-412c-bf8c-bf5c4d7f393b`

**Live URL:** https://photo-exit-manifest.sociobot.in/

Review 1 had no IDs. This table retains the stable IDs assigned in `.factory/polish-1.md`. Every finding from reviews 1–4 is included.

## Cumulative finding map

| ID | Change made | Evidence |
| --- | --- | --- |
| R1-B1 | Kept the realistic bundled sample, one-click `?demo=1` entry, separate stateless browser mode, automatic temporary CLI workspace, persistent banner, reset, and start-for-real path. | Tests: `@claim:demo-isolation`, `@claim:demo-content`, and the phone first-screen browser test. Screenshot: `.factory/evidence/polish-4/live/demo-mobile.png`. Live: `/?demo=1` reached `/demo/`, displayed 6/5/1/0, reset focus, and preserved `real:sentinel`. |
| R1-B2 | Expanded the one-to-one claims registry to 18 observable claims and strengthened its structural contract. | Test: `each registered claim has exactly one matching tagged test`; all 18 registered commands passed separately. Screenshot: `.factory/evidence/polish-4/live/screenshot-desktop.png`. Live: all browser-facing outcomes were repeated at the deployed URL. |
| R1-B3a | Kept runtime network denial, read-only source checks, free use, generated reports, named exceptions, and SHA-256 evidence; exact-byte matching now has its own claim. | Tests: `@claim:read-only-local`, `@claim:free-cli`, `@claim:migration-report`, `@claim:named-exception-gate`, `@claim:exact-byte-matching`. Screenshot: `.factory/evidence/polish-4/live/home-first-screen-mobile.png`. Live: the first-screen facts and matching language were present. |
| R1-B3b | Kept tested inventory fields, exact-byte matching, device choices, named differences, and signed-report output. | Tests: `@claim:takeout-evidence`, `@claim:exact-byte-matching`, `@claim:device-policy-report`, `@claim:migration-report`. Screenshot: `.factory/evidence/polish-4/live/demo-mobile.png`. Live: the sample showed six source items, five exact matches, one exception, and zero unexplained items. |
| R1-B3c | Kept tested planning, exit codes, export notes, album gates, warnings, and readiness rules; both exact warning strings remain asserted. | Tests: `@claim:scriptable-cli`, `@claim:planning-mode`, `@claim:album-exception-gate`, `@claim:readiness-rules`, `@claim:takeout-evidence`. Screenshot: `.factory/evidence/polish-4/live/demo-mobile.png`. Live: hold conditions and edit warnings remained distinct. |
| R1-B3d | Kept the unavailable paid tier, checkout, price, and licence UI removed. | Test: `@claim:free-cli`. Screenshot: `.factory/evidence/polish-4/live/screenshot-desktop.png`. Live: the 14-link crawl found no payment destination. |
| R1-B3e | Kept every README operational promise registered and testable, including the minimum toolchain and build artifacts. | Tests: `@claim:package-contract`, `@claim:build-artifacts`, plus all 18 clean-clone claim commands. Screenshot: `.factory/evidence/polish-4/live/screenshot-desktop.png`. Live: the deployed site matched the locally built route hashes. |
| R1-B4 | Kept the dead checkout removed and crawled every current link and fragment. | Test: `navigation, focus restoration, metadata and local links work as real routes`. Screenshot: `.factory/evidence/polish-4/live/home-first-screen-mobile.png`. Live: 14 unique destinations and fragments passed. |
| R1-B5 | Kept the archive-styled 404 and host 404 response override. | Test: `@claim:route-contract`. Screenshot: `.factory/evidence/polish-4/live/404-desktop.png`. Live: `/definitely-not-a-route` returned HTTP 404 with the designed page. |
| R1-B6 | Kept route-specific titles, descriptions, canonicals, Open Graph/Twitter data, social art, favicon, and touch icon. | Tests: route metadata browser test and `@claim:route-contract`. Screenshot: `.factory/evidence/polish-4/live/screenshot-desktop.png`. Live: metadata passed on home, demo, privacy, terms, and 404 at both viewports. |
| R1-M1 | Kept the shared header/footer, legal links, purpose line, factory credit, and build ID on every page. | Test: route and link browser test. Screenshot: `.factory/evidence/polish-4/live/404-desktop.png`. Live: all five routes exposed the shared skeleton and working legal links. |
| R1-M2 | Kept the nine-word job headline, short audience sentence, one primary sample action, outcome note, and three facts above the phone fold. | Test: the phone first-screen browser test. Screenshot: `.factory/evidence/polish-4/live/home-first-screen-mobile.png`. Live: the complete first screen fit at 390×844. |
| R1-M3 | Kept one vocabulary for audit, signed migration report, named exception, family archive, and demo. | Test: `npm run audit:copy`. Screenshot: `.factory/evidence/polish-4/live/home-first-screen-mobile.png`. Live: the same terms appeared on home and demo. |
| R1-D1 | Kept browser reset stateless and focused, real storage isolated, and CLI output limited to a newly created temporary directory. | Tests: `@claim:demo-isolation` and browser demo reset. Screenshot: `.factory/evidence/polish-4/live/demo-mobile.png`. Live: reset closed details, focused the h1, and left the real sentinel unchanged. |
| R1-S1 | Kept real routes, legal pages, 44px targets, responsive stacking, focus announcements, and reduced-motion support; fixed true Back scroll restoration. | Test: route/history browser test. Screenshot: `.factory/evidence/polish-4/live/screenshot-mobile.png`. Live: Back restored scroll 700 and h1 focus; four routes at 320px had no overflow or undersized targets. |
| F-2-1 | Kept canonical demo routing and normalized service-worker navigation keys. | Test: `@claim:offline-reload`. Screenshot: `.factory/evidence/polish-4/live/demo-mobile.png`. Live: `/demo/` reloaded offline and `/?demo=1` reopened offline. |
| F-2-2 | Kept factual readiness copy: edits produce review warnings, not automatic holds. | Test: `@claim:readiness-rules`. Screenshot: `.factory/evidence/polish-4/live/screenshot-desktop.png`. Live: the ready sample and hold-rule wording agreed. |
| F-2-3 | Kept compiled socket interception around full CLI demo and run flows. | Test: `@claim:read-only-local`. Screenshot: `.factory/evidence/polish-4/live/home-first-screen-mobile.png`. Live: all 39 demo-flow requests were same-origin. |
| F-2-4 | Kept two-device backup, deletion, conflict, and offline decisions asserted in JSON and Markdown. | Test: `@claim:device-policy-report`. Screenshot: `.factory/evidence/polish-4/live/demo-mobile.png`. Live: the sample report displayed the device plan. |
| F-2-5 | Kept the independent album-label hold and named-resolution transition. | Test: `@claim:album-exception-gate`. Screenshot: `.factory/evidence/polish-4/live/demo-mobile.png`. Live: missing album labels remained a stated hold condition. |
| F-2-6 | Kept tracking/storage assertions and expanded them to inspect the exact Cache Storage allowlist. | Test: `@claim:no-tracking`. Screenshot: `.factory/evidence/polish-4/live/screenshot-desktop.png`. Live: zero cookies/user storage/beacons, one versioned 16-entry static cache, and same-origin requests only. |
| F-2-7 | Kept tested site and executable outputs; unsupported release-ownership copy remains absent. | Test: `@claim:build-artifacts`. Screenshot: `.factory/evidence/polish-4/live/screenshot-desktop.png`. Live: home, demo, legal, 404, and worker hashes matched the local build. |
| F-2-8 | Kept the factual instruction “Run the sample to see a finished audit.” | Test: `npm run audit:copy`. Screenshot: `.factory/evidence/polish-4/live/demo-mobile.png`. Live: the demo opened directly on the finished audit. |
| F-2-9 | Kept the clear labels “Does not change source folders”, “Free command-line tool”, and “Resolved with a named exception”. | Test: phone first-screen browser test. Screenshot: `.factory/evidence/polish-4/live/home-first-screen-mobile.png`. Live: labels were visible and untruncated at 390px. |
| F-2-10 | Regenerated the deterministic round-four copy audit. | Test: `npm run audit:copy`; 25 landing and 38 README sentences, zero flags. Screenshot: `.factory/evidence/polish-4/live/screenshot-mobile.png`. Live: deployed copy hashes matched the audited build. |
| F-3-1 | Kept the missing-export-note warning registered and asserted, alongside the exact edited-file warning. | Test: `@claim:takeout-evidence`. Screenshot: `.factory/evidence/polish-4/live/demo-mobile.png`. Live: the demo retained both evidence concepts. |
| F-3-2 | Kept Rust 1.85 pinned and compile-tested for every locked target before contract checks. | Test: `@claim:package-contract`. Screenshot: `.factory/evidence/polish-4/live/screenshot-desktop.png`. Live: deployment hashes matched the pinned-toolchain build. |
| F-4-1 | Replaced the false “stores nothing” absolute with exact cache disclosure in the demo, README, privacy page, and demo contract. The privacy claim now asserts Cache Storage name, entries, methods, origin, and query-free URLs. | Test: `@claim:no-tracking`. Screenshot: `.factory/evidence/polish-4/live/demo-mobile.png`. Live: one `photo-exit-manifest-*` cache contained exactly 16 documented static GET URLs; no sample or family record was stored. |
| F-4-2 | Added a dedicated exact-byte claim. Its fixture proves all five matches share SHA-256 and that equal name/size with different bytes does not match. | Test: `@claim:exact-byte-matching`. Screenshot: `.factory/evidence/polish-4/live/demo-mobile.png`. Live: the demo described and displayed five exact-byte matches. |
| F-4-3 | Rewrote the inventory sentence to list only emitted, testable fields. The claim now compares names, actual byte lengths, dates, albums, edit state, warnings, and SHA-256 values to fixtures. | Test: `@claim:takeout-evidence`. Screenshot: `.factory/evidence/polish-4/live/screenshot-desktop.png`. Live: the corrected inventory wording was present. |
| F-4-4 | Registered browser sample parity and compared its status, totals, evidence rows, signer, and five filenames with a freshly generated CLI demo report. | Test: `@claim:demo-content`. Screenshot: `.factory/evidence/polish-4/live/demo-mobile.png`. Live: browser totals were 6/5/1/0 and matched the final CLI demo. |
| F-4-5 | Changed the isolation claim to invoke `demo --json` without `--output`, under an isolated `TMPDIR`; it asserts the generated workspace is a direct child and sibling data is untouched. | Test: `@claim:demo-isolation`. Screenshot: `.factory/evidence/polish-4/live/demo-mobile.png`. Live: the documented demo command and one-click browser path both worked cold. |
| F-4-6 | Deduplicated warnings when the same edited file is seen in both inventories; added a Rust regression test and exact output assertions. | Tests: `compare_deduplicates_warnings_shared_by_both_inventories` and `@claim:takeout-evidence`. Screenshot: `.factory/evidence/polish-4/live/demo-mobile.png`. Live/CLI check: `audit.json` had two unique warnings and `CUTOVER.md` contained the edit warning once. |

## Verification and deployment evidence

- Clean clone: `/tmp/photo-exit-polish4-final-9ggXbf/repo` at `848260536d1138c47f2cf7df0cfbe342e915aee0`.
- Every one of the 18 claim commands in `.factory/claims.json` passed separately.
- Aggregate `npm test` passed: 8 Rust unit, 4 CLI integration, 4 route/contract, 1 PWA, 4 browser, and 18 claim tests.
- `cargo fmt --check`, `cargo clippy --all-targets -- -D warnings`, `npm run build`, `npm run audit:copy`, generated-audit diff check, and `cargo package --allow-dirty` passed.
- Package verification compiled successfully; the package contained 102 files and was 317.3 KiB compressed.
- Final deployment `78ef9eec-5ced-412c-bf8c-bf5c4d7f393b` completed successfully.
- Factory live verifier: HTTP 200, correct title/lang/h1/main/alt/button labels, 900 ms load, zero console errors. Report: `.factory/evidence/polish-4/live/verify.json`.
- Live route/axe check: 12 route/viewport combinations, correct titles and 404 status, 14 valid links/fragments, and zero serious or critical axe findings.
- Live sandbox/offline check: 39 same-origin requests, no real-data mutation, exact 16-entry static cache, offline reload, and offline query-entry all passed.
- Live history/mobile check: Back restored scroll 700 and h1 focus; reduced motion resolved to `auto`; four routes at 320px had no overflow or targets below 44px.
- Local/live SHA-256 matched for home, demo, privacy, terms, 404, and `sw.js`.
- Lighthouse mobile: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 1.1 s, LCP 1.5 s, TBT 0 ms, CLS 0.022. Report: `.factory/evidence/polish-4/live/lighthouse.json`.

No review finding remains open.
