# Verification 1 — FAIL

**Candidate:** `95ae7ad505b9726257656998bcc8bdb7fee7d895`  
**Verified:** 2026-08-27 UTC  
**Live URL:** https://photo-exit-manifest.sociobot.in/

## Decision

**FAIL — do not release this candidate as migration assurance.** Two P1 defects violate the product contract: it can declare a migration ready while known album labels are absent at the destination, and its advertised PWA offline reload does not load the application JavaScript.

## Clean-checkout evidence

Testing used a detached clean worktree at the candidate commit (`/tmp/photo-exit-manifest-qa`), not the working tree.

- `npm ci`: passed; npm audit reported 0 vulnerabilities.
- `cargo fmt --check`: passed.
- `cargo clippy --all-targets -- -D warnings`: passed.
- `npm test`: passed: 5 Rust library tests, 2 CLI integration tests, 3 site tests; no failures.
- `npm run build`: passed and produced `dist/site/` plus `dist/package/photo-exit-manifest-linux-x86_64` (1.3 MB stripped executable).
- `cargo package --allow-dirty`: passed; package verification passed; crate 168.3 KB compressed.
- Clean-consumer install: `cargo install --path target/package/photo-exit-manifest-0.1.0 --root /tmp/pem-consumer.wC1HdX --locked` passed. The installed binary exposed the documented help and wrote a JSON policy template with `init --json`.

## Product exercises

Black-box CLI fixtures used a Takeout-shaped source, an independent-folder destination, a valid sidecar, a malformed sidecar, duplicate content in two source albums, and a missing video.

- A missing asset without an exception returned JSON `hold` and exit 2.
- Adding a concrete named exception returned `ready_for_cutover`, exit 0, all five expected reports, and a signed `CUTOVER.md`.
- Existing output was refused with exit 1 unless `--force`; attempting output inside a scanned source was refused with exit 1. Hashes of source and destination media before/after were identical.
- Missing input / empty-scan invalid paths returned actionable exit-1 errors. `--json`, `--help`, and the documented non-interactive workflow worked.

### P1 — album loss is permitted in a `READY` manifest

The source fixture had the same image in `Family Album` and `Second Album`; the destination had that image but no corresponding album folders. The completed audit reported:

```json
{
  "ready": true,
  "accounted_percent": 100,
  "source_albums_missing_at_destination": ["Family Album", "Second Album"]
}
```

With the unrelated missing video named as an exception, `run --sign 'QA Family' --json` returned `ready_for_cutover` / exit 0. `CUTOVER.md` merely says the album membership “may need … manual recreation.” This contradicts the researched job (not losing albums), the requirement to compare albums where available, and the site’s own claim that absent album labels keep a manifest on hold. Album gaps must block cutover until each is represented by a named, reviewable exception or otherwise resolved.

### P1 — offline PWA reload is not functional

On the exact production build served by Vite preview, Playwright installed and activated the service worker (`navigator.serviceWorker.controller === true`). Cache Storage contained only `/`, legal pages, hero, mark, and fonts; it did **not** contain `assets/main-DDZNZNwM.js` or the CSS. After network was disabled, a reload returned cached HTML (HTTP 200) but `assets/main-DDZNZNwM.js` failed with `net::ERR_FAILED` and a browser console error. The planner/application therefore cannot function offline. The worker must precache the hashed JS/CSS shell (and await cache writes with `event.waitUntil`) and use a build-versioned cache/update test.

## Web, privacy, and deployment checks

- The live `index.html` SHA-256 exactly matched `dist/site/index.html`; it referenced the same `main-DDZNZNwM.js` and `style-DJLeNWj_.css`. Live `sw.js` also matched the candidate worker. The deployment is current, not a deployment-only failure.
- Live headers: HTTPS, HSTS, `X-Content-Type-Options: nosniff`, strict-origin referrer policy, restrictive Permissions-Policy, and CSP restricting scripts/styles/fonts/images to self and `connect-src` to self plus the documented Sociobot API. Hashed assets returned `Cache-Control: public, max-age=31536000, immutable`; worker returned `no-cache`.
- Source/build request review found no analytics, telemetry, CDN scripts, or CLI network capability. With no license supplied, Playwright observed only same-origin web requests. The sole intentional external path is the documented Sociobot billing API when a user supplies a license or opens checkout.
- `node scripts/a11y.mjs http://127.0.0.1:4173` reported 0 axe violations, including 0 serious/critical, on `/`, `/privacy/`, and `/terms/` at both 1366px and 390px.
- Desktop and 390px smoke tests had no horizontal overflow or page errors online; one `<h1>` and `<main>` were present. Keyboard Tab reached the skip link; after its transition it was visible at y=12 with a 3px focus outline. Planner normal, zero/invalid, and over-accounted values showed the expected ready and recovery messages. Reduced-motion emulation yielded `scroll-behavior: auto`.
- Production bundles meet static size budgets: initial application JS 5.74 KB, CSS 14.93 KB, self-hosted fonts 44.98 KB total, and hero WebP 71.84 KB. The offline console failure above remains a release blocker despite those results.

## Required remediation and re-test

1. Make destination album gaps a blocking, explicitly exceptable condition; include the reviewed resolution in JSON and `CUTOVER.md`.
2. Precache the versioned JS/CSS application shell with service-worker lifetime-safe writes, version the cache for each deploy, and prove a clean-context offline reload and update from the prior worker.
3. Re-run this verification on the remediation commit and replace this report only with a fresh PASS backed by the same fixtures.
