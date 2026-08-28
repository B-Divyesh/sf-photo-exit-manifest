# Polish 3 handoff — Photo Exit Manifest

## Outcome

Perfection-loop round 3 is complete. Both review-3 blockers and every earlier finding are resolved and rechecked. No product, claim, accessibility, privacy, offline, mobile, routing, or deployment gap remains.

- Repair commit: `71e78d0c61a9b8abbe0ac15f0f82484977ce34b8`
- Deployment: `d786a43b-0941-4974-85b6-327cc029b9af`
- Live URL: https://photo-exit-manifest.sociobot.in/
- Full finding map: `.factory/polish-3.md`

## Changes

- `takeout-evidence` now names and tests missing Google export-note warnings. The test asserts the exact warning in the generated `audit.json`, alongside parsed note, album, hash, and edit evidence.
- `package-contract` now compiles every locked Cargo target under Rust 1.85.0 in a fresh target directory before checking MIT metadata and the single-binary contract.
- `rust-toolchain.toml` pins Rust 1.85.0 with Clippy and rustfmt, so ordinary clean-checkout commands exercise the advertised minimum compiler.
- The catalog line is now: “Verify a Google Photos export against your family archive before switching services.” It is verb-first and 84 characters including the final period.
- The round-3 copy audit was regenerated. It contains 25 landing sentences, 23 landing labels/actions, and 37 README sentences with zero length or banned-word flags.
- The luminous archive-glass identity, one-click isolated demos, first-screen wording, real routes, metadata, legal links, focus behavior, and responsive layout remain intact.

## Clean-clone evidence

Verification used `/tmp/photo-exit-polish3-clean-BM8uCS/repo`, cloned at `71e78d0` with a clean status.

- `npm ci`: passed; 0 vulnerabilities.
- Every one of the 16 commands in `.factory/claims.json`: passed separately.
- `npm test`: passed — 7 Rust unit, 4 CLI integration, 4 site/contract, 1 PWA, 4 browser, and 16 claim tests.
- `cargo fmt --check`: passed under Rust 1.85.0.
- `cargo clippy --all-targets -- -D warnings`: passed under Rust 1.85.0.
- `npm run build`: passed; produced `dist/site/` and `dist/package/photo-exit-manifest-linux-x86_64` (1,382,896 bytes).
- `cargo package`: passed its verification compile; 100 files, 307.8 KiB compressed.
- Packed-source consumer install under Rust 1.85.0: passed. Its bundled demo returned `ready_for_cutover` and 100% accounted.
- `npm run audit:copy`: reproduced `.factory/copy-audit.md` without content drift.
- Standalone axe integration: 0 violations on five routes at 390px and 1366px.
- Initial route JavaScript is about 1.99 KiB raw, shared CSS is 21,684 bytes, fonts total about 44.98 KiB, and the hero image is 71,844 bytes.

## Live evidence

The deployment factory uploaded 243,167 bytes from `dist/site/`. The custom domain was Ready and returned HTTPS 200.

- The factory URL verifier measured a 949ms load with the expected title, `lang=en`, one h1, main landmark, complete alt/button names, and zero console errors.
- Cold Playwright at 390×844 showed the exact job headline, audience, one primary sample action, outcome, and all three facts above the fold.
- One click on `/?demo=1` reached `/demo/`. The banner, Reset demo, and Start for real were present. Reset restored heading focus and preserved a seeded `real:sentinel` value.
- After service-worker control, `/demo/` reloaded offline and the documented `/?demo=1` entry reopened the demo while offline.
- Home, demo, privacy, terms, and 404 had distinct titles/canonicals/social metadata, one h1, one main, shared legal links, and console-clean direct loads.
- `/definitely-not-a-route` returned HTTP 404 with the designed archive-path page.
- Back navigation restored home and h1 focus. Four real routes had no horizontal overflow or sub-44px targets at 320px; reduced motion used `scroll-behavior: auto`.
- The all-route crawl checked 13 distinct links and hash targets; every destination returned 200.
- The demo flow made 39 same-origin requests and no third-party request.
- Live axe found 0 violations at 390×844 and 1366×900 across all five pages.
- Lighthouse mobile scored Performance 100, Accessibility 100, Best Practices 100, and SEO 100. FCP was 1.1s, LCP 1.5s, TBT 0ms, and CLS 0.022.
- Local and live SHA-256 matched for home (`3d8801ed…`), demo (`63ba886c…`), 404 (`2129ba50…`), and service worker (`604517ba…`).

Screenshots and reports are under `.factory/evidence/polish-3/live/`, including `home-first-screen-mobile.png`, `demo-mobile.png`, `404-desktop.png`, `verify.json`, and `lighthouse.json`.

## Run and verify

```sh
npm ci
npm test
npm run build
cargo fmt --check
cargo clippy --all-targets -- -D warnings
cargo package
node scripts/a11y.mjs https://photo-exit-manifest.sociobot.in
```

Run one claim with `npm run test:claims -- @claim:<id>`.

## Known gaps and next steps

None. Registry publishing remains factory-owned and was intentionally not performed. Pre-existing generated changes under `graphify-out/` were preserved and not included in the repair commits.
