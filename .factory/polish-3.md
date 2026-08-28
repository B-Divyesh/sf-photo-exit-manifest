# Perfection loop polish 3

**Reviewed candidate:** `1d3201a241f90a9b5908768ad6ad1439f07119b4`

**Review report:** `ea9020efeb92eafde5395d7ddc0a6bf83989d8ba` / `.factory/review-3.md`

**Repair commit:** `71e78d0c61a9b8abbe0ac15f0f82484977ce34b8`

**Deployment:** `d786a43b-0941-4974-85b6-327cc029b9af`

**Live URL:** https://photo-exit-manifest.sociobot.in/

Review 1 had no IDs. This table uses the stable IDs assigned in `.factory/polish-1.md`. Every current and earlier finding is included.

## Cumulative finding map

| ID | Change made | Evidence |
| --- | --- | --- |
| R1-B1 | Kept the realistic browser and CLI samples, temporary CLI workspace, one-click query entry, persistent banner, reset, and start-for-real path. | Tests: `@claim:demo-isolation`, `@claim:migration-report`, and `the phone first screen states the job and opens the isolated demo in one click`. Screenshot: `.factory/evidence/polish-3/live/demo-mobile.png`. Live: `/?demo=1` canonicalized to `/demo/`; reset preserved `real:sentinel`. |
| R1-B2 | Kept the one-to-one registry and strengthened the two incomplete claim gates found in review 3. | Tests: `each registered claim has exactly one matching tagged test`; all 16 registry commands passed separately in the clean clone. Screenshot: `.factory/evidence/polish-3/live/screenshot-desktop.png`. Live: all claim-facing home/demo behavior was rechecked at the deployed URL. |
| R1-B3a | Kept read-only runtime socket denial, SHA-256 evidence, free use, report output, and named-exception coverage. | Tests: `@claim:read-only-local`, `@claim:takeout-evidence`, `@claim:free-cli`, `@claim:migration-report`, `@claim:named-exception-gate`. Screenshot: `.factory/evidence/polish-3/live/home-first-screen-mobile.png`. Live: all 39 demo-flow requests were same-origin and the three first-screen facts remained visible. |
| R1-B3b | Kept observable inventory, exact-byte matching, device choices, named differences, and five-file report assertions. | Tests: `@claim:takeout-evidence`, `@claim:device-policy-report`, `@claim:migration-report`. Screenshot: `.factory/evidence/polish-3/live/demo-mobile.png`. Live: `/demo/` showed six source items, five exact matches, one named exception, and the signed report. |
| R1-B3c | Kept tests for planning mode, exit codes, export notes, album-label gates, warnings, and readiness rules; the missing-note warning now has an exact assertion. | Tests: `@claim:scriptable-cli`, `@claim:planning-mode`, `@claim:album-exception-gate`, `@claim:readiness-rules`, `@claim:takeout-evidence`. Screenshot: `.factory/evidence/polish-3/live/demo-mobile.png`. Live: `/` still separates hold conditions from edit warnings. |
| R1-B3d | Kept the unavailable paid tier, price, licence UI, and checkout link removed. | Test: `@claim:free-cli`. Screenshot: `.factory/evidence/polish-3/live/screenshot-desktop.png`. Live: the 13-link crawl found no checkout or purchase URL. |
| R1-B3e | Registered every remaining README promise and made the minimum-Rust claim compile under the stated version. | Tests: `@claim:package-contract`, `@claim:build-artifacts`, plus all 16 clean-clone claim commands. Screenshot: `.factory/evidence/polish-3/live/screenshot-desktop.png`. Live: site operational claims matched the deployed demo and route checks. |
| R1-B4 | Kept the dead checkout removed and crawled every current anchor. | Test: `navigation, focus restoration, metadata and local links work as real routes`. Screenshot: `.factory/evidence/polish-3/live/home-first-screen-mobile.png`. Live: 13 distinct links and hash targets returned 200, including the GitHub source link. |
| R1-B5 | Kept the archive-styled 404 and host response override. | Test: `@claim:route-contract`. Screenshot: `.factory/evidence/polish-3/live/404-desktop.png`. Live: `/definitely-not-a-route` returned HTTP 404 with “This archive path leads nowhere”. |
| R1-B6 | Kept route-specific titles, descriptions, canonicals, OG/Twitter data, social art, favicon, and touch icon. | Tests: `every route has its own title, canonical and social metadata` and `@claim:route-contract`. Screenshot: `.factory/evidence/polish-3/live/screenshot-desktop.png`. Live: home, demo, privacy, terms, and 404 metadata were checked cold. |
| R1-M1 | Kept the shared header/footer, Privacy and Terms links, purpose line, factory credit, and build ID. | Test: `navigation, focus restoration, metadata and local links work as real routes`. Screenshot: `.factory/evidence/polish-3/live/404-desktop.png`. Live: all five pages contained the common footer and working legal links. |
| R1-M2 | Kept the nine-word job headline, audience sentence, one sample action with outcome, and three first-screen facts. | Test: `the phone first screen states the job and opens the isolated demo in one click`. Screenshot: `.factory/evidence/polish-3/live/home-first-screen-mobile.png`. Live: every item fit within the cold 390×844 first viewport. |
| R1-M3 | Kept the controlled terms: audit, signed migration report, switch from Google Photos, named exception, family archive, and demo. | Test: `npm run audit:copy` produced zero flags. Screenshot: `.factory/evidence/polish-3/live/home-first-screen-mobile.png`. Live: home and demo used the same terms. |
| R1-D1 | Kept stateless browser reset/focus behavior and new-directory-only CLI demo writes. | Tests: `@claim:demo-isolation` and `the phone first screen states the job and opens the isolated demo in one click`. Screenshot: `.factory/evidence/polish-3/live/demo-mobile.png`. Live: reset closed disclosures, focused the h1, and preserved the real-data sentinel. |
| R1-S1 | Kept real routes, title/focus announcements, history restoration, legal links, 44px targets, phone stacking, and reduced-motion handling. | Tests: the four browser tests and live axe. Screenshot: `.factory/evidence/polish-3/live/screenshot-mobile.png`. Live: no overflow or small target at 320px; Back restored h1 focus. |
| F-2-1 | Kept `/?demo=1` canonicalization and service-worker navigation normalization. | Test: `@claim:offline-reload`. Screenshot: `.factory/evidence/polish-3/live/demo-mobile.png`. Live: the query entry reached `/demo/`, reloaded offline, and reopened from the query while offline. |
| F-2-2 | Kept accurate copy that treats edited-looking files as review warnings, not hold conditions. | Test: `@claim:readiness-rules`. Screenshot: `.factory/evidence/polish-3/live/screenshot-desktop.png`. Live: the “Stops on missing decisions” text and ready sample agreed. |
| F-2-3 | Kept compiled runtime interception of IPv4/IPv6 socket attempts around demo and run. | Test: `@claim:read-only-local`. Screenshot: `.factory/evidence/polish-3/live/home-first-screen-mobile.png`. Live: the browser demo made 39 same-origin requests and no third-party request. |
| F-2-4 | Kept two-device assertions for backup, deletion, conflict, and offline choices in both report formats. | Test: `@claim:device-policy-report`. Screenshot: `.factory/evidence/polish-3/live/demo-mobile.png`. Live: the sample report showed the device decisions. |
| F-2-5 | Kept the independent album-only hold and named-resolution transition. | Test: `@claim:album-exception-gate`. Screenshot: `.factory/evidence/polish-3/live/demo-mobile.png`. Live: the landing rules still name missing album labels as a hold. |
| F-2-6 | Kept the explicit static-resource allowlist and cookie/storage/IndexedDB/OPFS/beacon assertions. | Test: `@claim:no-tracking`. Screenshot: `.factory/evidence/polish-3/live/screenshot-desktop.png`. Live: verifier found zero console errors; cold requests remained same-origin. |
| F-2-7 | Kept tested site and Linux executable paths while unsupported factory-ownership claims remain absent. | Test: `@claim:build-artifacts`. Screenshot: `.factory/evidence/polish-3/live/screenshot-desktop.png`. Live: local and deployed home/demo/404/service-worker hashes matched. |
| F-2-8 | Kept the factual README sentence “Run the sample to see a finished audit.” | Test: `npm run audit:copy`. Screenshot: `.factory/evidence/polish-3/live/demo-mobile.png`. Live: `/demo/` opened the finished audit. |
| F-2-9 | Kept “Does not change source folders”, “Free command-line tool”, and grammatical named-exception labels. | Test: `the phone first screen states the job and opens the isolated demo in one click`. Screenshot: `.factory/evidence/polish-3/live/home-first-screen-mobile.png`. Live: all labels were visible at 390px. |
| F-2-10 | Kept generated word counts and updated the audit heading for round 3. | Test: `npm run audit:copy`; 25 landing sentences and 37 README sentences, zero flags. Screenshot: `.factory/evidence/polish-3/live/screenshot-mobile.png`. Live: the extracted landing copy matched the deployment hash. |
| F-3-1 | Expanded `takeout-evidence` to promise both missing-note and edited-file warnings. Its fixture now asserts the exact missing-sidecar warning in `audit.json`. | Test: `@claim:takeout-evidence` passed separately and in the aggregate suite. Screenshot: `.factory/evidence/polish-3/live/demo-mobile.png`. Live: `/demo/` retained the Google export-note evidence and edit warning presentation. |
| F-3-2 | Added `rust-toolchain.toml` pinned to 1.85.0 and changed `package-contract` to compile all locked targets with `cargo +1.85.0 test --all-targets --no-run` in a fresh target directory before metadata checks. | Test: `@claim:package-contract` passed under `rustc 1.85.0`; the packed crate also installed and ran its demo under 1.85. Screenshot: `.factory/evidence/polish-3/live/screenshot-desktop.png`. Live: deployment hashes matched the site built by the pinned toolchain. |

## Verification and deployment evidence

- Clean clone: `/tmp/photo-exit-polish3-clean-BM8uCS/repo` at `71e78d0`; all 16 claim commands passed separately.
- Full clean-clone suite: 7 Rust unit tests, 4 CLI integration tests, 4 site/contract tests, 1 PWA test, 4 browser tests, and 16 aggregate claim tests.
- `cargo fmt --check`, strict Clippy, `npm run build`, `cargo package`, packed-source install/demo, and regenerated copy audit passed.
- Live verifier: HTTP 200, 949ms load, correct title/lang/h1/main/alt/button names, and zero console errors.
- Live axe: 0 violations at 390×844 and 1366×900 on home, demo, privacy, terms, and 404.
- Live Lighthouse mobile: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 1.1s, LCP 1.5s, TBT 0ms, CLS 0.022. Report: `.factory/evidence/polish-3/live/lighthouse.json`.
- Deployment `d786a43b-0941-4974-85b6-327cc029b9af` completed successfully. There are no unresolved findings.
