# Repair handoff — Photo Exit Manifest polish 4

## Outcome

All findings in `.factory/review-1.md` through `.factory/review-4.md` are resolved. The detailed cumulative map is `.factory/polish-4.md`. The product remains a Rust single-binary CLI with its distinct luminous archive-glass static site.

Final product code commits:

- `4ba851e882da4be0843109e2dd533afb0077cec6` — claim, demo, privacy, inventory, exact-byte, and warning fixes.
- `848260536d1138c47f2cf7df0cfbe342e915aee0` — History API focus and scroll restoration fix found during final live verification.

Final deployment: `78ef9eec-5ced-412c-bf8c-bf5c4d7f393b`

Live URL: https://photo-exit-manifest.sociobot.in/

## What changed

- Replaced the false browser-storage absolute with an exact service-worker cache disclosure in the site, README, privacy page, and demo contract.
- Expanded `.factory/claims.json` to 18 claims. Added exact-byte matching and browser/CLI demo-parity claims.
- Made `@claim:no-tracking` inspect cookies, Web Storage, IndexedDB, OPFS, beacons, request origins, and the exact 16-entry Cache Storage allowlist.
- Made `@claim:demo-isolation` exercise the automatic `TMPDIR` path without `--output` and prove sibling data is untouched.
- Made `@claim:takeout-evidence` compare emitted names, real byte lengths, dates, album labels, edit state, warnings, and SHA-256 values with the fixtures.
- Bound the browser sample to a freshly generated CLI report: status, totals, evidence rows, signer, and five output filenames must agree.
- Deduplicated the edited-file warning across both inventories and added a Rust regression test.
- Fixed Back/Forward navigation so it restores scroll, focuses the page h1 without moving it, and announces the route.
- Updated the catalog description to: “Check a Google Photos export against a family archive before leaving the cloud.”
- Regenerated `.factory/copy-audit.md`: 25 landing sentences, 38 README sentences, zero long-sentence or banned-word flags.

## Verification

Clean clone: `/tmp/photo-exit-polish4-final-9ggXbf/repo` at `848260536d1138c47f2cf7df0cfbe342e915aee0`.

- `npm ci` — passed; 0 vulnerabilities.
- All 18 `.factory/claims.json` commands — passed separately.
- `npm test` — passed: 8 Rust unit, 4 CLI integration, 4 route/contract, 1 PWA, 4 browser, and 18 claim tests.
- `cargo fmt --check` — passed.
- `cargo clippy --all-targets -- -D warnings` — passed.
- `npm run build` — passed; produced `dist/site/` and `dist/package/photo-exit-manifest-linux-x86_64`.
- `npm run audit:copy` and generated-audit diff check — passed.
- `cargo package --allow-dirty` — passed verification compile; 102 files, 317.3 KiB compressed.

Post-deploy cold checks:

- `/opt/fleet/lib/verify-url.sh` — HTTP 200, 900 ms load, correct title/lang/h1/main/alt/button labels, zero console errors.
- Live axe — zero serious or critical findings across home, demo, privacy, terms, 404, two viewports, and 12 route/viewport checks.
- Link crawl — 14 unique links and fragments passed; the unknown route returned the designed HTTP 404.
- Demo — one-click `?demo=1`, 6/5/1/0 totals, persistent banner, reset focus, real-sentinel preservation, and Start for real passed.
- Privacy/offline — 39 same-origin requests, no cookies or user-data stores, exact 16-entry static cache, offline reload, and offline query-entry passed.
- History/mobile — Back restored scroll 700 and h1 focus; reduced motion used `auto`; four routes at 320px had no overflow or targets below 44px.
- Local/live SHA-256 matched for home, demo, privacy, terms, 404, and `sw.js`.
- Lighthouse mobile — Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 1.1 s, LCP 1.5 s, TBT 0 ms, CLS 0.022.

Evidence is under `.factory/evidence/polish-4/live/`, including `verify.json`, `lighthouse.json`, and home/demo/404 screenshots. The exact finding map is `.factory/polish-4.md`.

## Run and verify

```sh
npm ci
npm test
npm run build
npm run audit:copy
cargo fmt --check
cargo clippy --all-targets -- -D warnings
cargo package --allow-dirty
```

Run the real isolated sample with:

```sh
cargo run --release -- demo --json
```

## Known gaps

None. No review finding or acceptance check remains open.

The pre-existing modified files under `graphify-out/` were preserved and excluded from the repair commits.
