# Review 3 handoff — Photo Exit Manifest

## Outcome

Adversarial first-read review 3 is complete with a **FAIL** and two blocking claim-gate findings. No product code was modified.

Review report: `.factory/review-3.md`

Reviewed candidate: `1d3201a241f90a9b5908768ad6ad1439f07119b4`

Live URL: https://photo-exit-manifest.sociobot.in/

## What was done

- Opened the live site cold at 390×844 and 1366×900 and recorded the unscrolled first-screen interpretation.
- Audited every landing/README sentence, headings, labels, actions, conditional copy, and image alt text for length, jargon, terminology, and action clarity.
- Exercised the one-click browser demo, reset, real-data sentinel isolation, storage behavior, same-origin network behavior, offline reload, and offline re-entry.
- Ran the CLI demo in a new temporary directory and verified its sibling sentinel remained unchanged.
- Read every prior review, polish report, verification report, and handoff; independently rechecked every earlier finding.
- Ran all 16 claim commands separately from a clean clone, then ran the full quality suite and a clean source install.
- Crawled every live link and hash target; checked real routes, HTTP 404 behavior, metadata, history focus, mobile reflow, and visual identity.
- Ran live axe checks on five routes at phone and desktop sizes and ran the factory URL verifier.
- Compared local-build and live SHA-256 hashes for home, demo, privacy, terms, 404, and the service worker; all matched.

## How to verify

From a clean checkout:

```sh
npm ci
npm test
npm run build
cargo fmt --check
cargo clippy --all-targets -- -D warnings
node scripts/a11y.mjs https://photo-exit-manifest.sociobot.in
```

Run an individual registered claim with:

```sh
npm run test:claims -- @claim:<id>
```

The review used the clean clone `/tmp/photo-exit-review3-clean-aEiRI2/repo`. All 16 registered claim commands passed separately. The full suite passed 7 Rust unit, 4 CLI integration, 4 site contract, 1 PWA, 4 browser, and 16 claim tests. The build, format check, strict Clippy check, and `cargo install --path . --locked` also passed.

## Known gaps and next steps

- `F-3-1`: register and assert the README promise that missing Google export notes produce warnings, or remove that promise.
- `F-3-2`: make `package-contract` compile/test the locked package with Rust 1.85 rather than checking only Cargo metadata.

After both fixes, rerun all claim commands separately and repeat the cold-browser review. All other reviewed behavior passed.
