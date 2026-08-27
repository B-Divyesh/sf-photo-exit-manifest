# Photo Exit Manifest v0.1.0 — repair handoff

## Release status — PASS

Repair commit `04f0158f88f3b2c3f352c01ec955e8c42660d0ec` fixes both P1 findings from the independent verification of `95ae7ad505b9726257656998bcc8bdb7fee7d895`. It was pushed to `main` and deployed as the same static documentation site at https://photo-exit-manifest.sociobot.in/ (Azure deployment `63311828-dbe3-4c1b-be03-e53874005b95`).

## What changed

- Missing source album labels are now a hard cutover gate. They must either be present at the destination or have exact, named `album_exceptions` with a review reason. The audit JSON, signed-manifest JSON, and `CUTOVER.md` all record the gaps and applied resolutions.
- The complete Vite application shell is now generated into the service worker after the build determines hashed filenames. Its cache name is build-versioned, install/runtime writes are lifetime-safe, and activation clears prior Photo Exit Manifest caches.
- Added regression coverage for the verifier's duplicate-album/missing-video case and browser coverage for offline reload plus service-worker upgrade.
- Updated the README and changelog to document album exceptions. The accessibility script now uses a test-only CSP bypass for axe injection, preserving the live strict CSP.

## Run and verify

```sh
npm ci
npm test
cargo fmt --check
cargo clippy --all-targets -- -D warnings
npm run build
cargo package --allow-dirty
```

`npm run build` produces `dist/site/` and `dist/package/photo-exit-manifest-linux-x86_64`. The ready-to-publish crate is verified with `cargo package --allow-dirty`; do not publish it from this repository. A clean consumer check passed with:

```sh
cargo install --path target/package/photo-exit-manifest-0.1.0 --root /tmp/pem-consumer --locked
/tmp/pem-consumer/bin/photo-exit-manifest --help
```

For web checks, serve `dist/site/` with Vite preview, run `node scripts/a11y.mjs <url>`, and run `/opt/fleet/lib/verify-url.sh <url> .factory/evidence`. The committed PWA regression runs as part of `npm test` and checks the actual production build offline and across a prior-worker update.

## Evidence

All commands above passed after a clean `npm ci`: 6 Rust unit tests, 3 CLI integration tests, 3 site tests, and 1 Chromium PWA regression. The built Linux binary is 1,288,472 bytes; crate package verification passed at 194.2 KB compressed. Live and local axe both found 0 violations at desktop and 390px across all three routes; URL verification found no console errors.

The deployed `index.html` and `sw.js` byte-match `dist/site/` (SHA-256 `1e16d254e559d4e9987836d13f8fcaebac2ff497264d35cf7369442aca090b1f` and `e23c7996192e16c8707882149047cf68432cb85aada1b7046ece8a8550ad1898`, respectively). The live worker precaches 11 shell URLs, including the 5.74 KB application JS and 14.93 KB CSS. Lighthouse’s persisted live mobile report scored 100 Performance, 100 Accessibility, 100 Best Practices, and 100 SEO (FCP 1.0 s, LCP 1.2 s, TBT 40 ms, CLS 0).

## Known gaps / next steps

- Google may introduce new Takeout sidecar shapes; unknown JSON remains a named warning rather than a guess.
- Album evidence remains folder/sidecar-derived. Provider-only shared permissions, face groups, comments, partner sharing, edit stacks, and Live Photo coupling cannot be proven by a local export; a named album resolution documents rather than hides that limitation.
- The factory owns package publishing and future platform binaries. No registry publication was attempted.
- Lighthouse wrote a complete scored report but its Chrome process logged a target crash while shutting down; browser, axe, URL, and PWA checks themselves passed.
