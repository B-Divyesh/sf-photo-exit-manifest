# Verification 2 — PASS

**Repair commit:** `04f0158c76607b589407c7fac3e97223f759e14c`
**Baseline report:** `e32cb52f4ea2d039c6a2e4dd9e83bfc065506157`
**Verified:** 2026-08-27 UTC
**Live URL:** https://photo-exit-manifest.sociobot.in/

## Decision

**PASS — release repair verified.** The two P1 defects in Verification 1 were reproduced with the verifier's fixture shape, corrected at their root causes, covered by exact regressions, and verified in the deployed artifact.

## P1 remediation evidence

### Album labels now block cutover until reviewed by name

`ExceptionFile` now accepts a separate `album_exceptions` list with an exact source album label and a non-empty review reason. `compare` writes both the applied resolutions and `unresolved_source_albums_missing_at_destination` to `audit.json`; unresolved labels are a hard prerequisite of `ready`. `build_manifest` independently rechecks this condition before it can write `ready_for_cutover`. `manifest.json` and `CUTOVER.md` preserve the source gaps and the reviewed resolutions.

The new CLI integration regression uses the original failure shape: one photo duplicated in `Family Album` and `Second Album`, an archive containing the bytes but neither label, and an unrelated missing video covered by a normal asset exception. A signed `run --json` returns `hold` / exit 2 and records both unresolved album labels. Adding one named review reason for each label then returns `ready_for_cutover` / exit 0; the JSON manifest has two album resolutions and `CUTOVER.md` has a “Reviewed album exceptions” section. The Rust unit suite also proves the same gate and output independently.

### Offline shell caching now follows the Vite build

`scripts/build-sw.mjs` reads the emitted HTML after Vite has assigned asset hashes, writes a cache name derived from the complete shell, and precaches the routes, local assets, and every emitted hashed JS/CSS file. Installation and runtime cache writes use `event.waitUntil`; activation removes prior Photo Exit Manifest caches and claims clients. The deployed worker is `photo-exit-manifest-4a96bc7d8a16` and lists both `/assets/main-DDZNZNwM.js` and `/assets/style-DJLeNWj_.css`.

`site/test/pwa.test.mjs` exercises the production build in Chromium: it asserts hashed JS/CSS in Cache Storage, disables network, reloads, and finds the planner form without a page error. It then registers a prior worker/cache, serves the generated worker as an update, confirms its versioned cache, and confirms the prior cache is removed.

## Clean verification matrix

- `npm ci`: passed; 0 npm audit vulnerabilities.
- `npm test`: passed — 6 Rust library tests, 3 CLI integration tests, 3 site tests, and 1 Chromium PWA/offline/update regression.
- `cargo fmt --check`: passed.
- `cargo clippy --all-targets -- -D warnings`: passed.
- `npm run build`: passed; outputs `dist/site/` and `dist/package/photo-exit-manifest-linux-x86_64` (1,288,472 bytes).
- `cargo package --allow-dirty`: passed, including crate verification; 194.2 KB compressed.
- Clean consumer install passed: `cargo install --path target/package/photo-exit-manifest-0.1.0 --root /tmp/pem-consumer.sBsq4w --locked`. The installed binary showed the documented help, and `init --json` emitted a valid device policy template.

## Web, accessibility, privacy, and live identity

- `node scripts/a11y.mjs` reported 0 axe violations, including 0 serious/critical, at 1366px and 390px for `/`, `/privacy/`, and `/terms/`, locally and live. The checker uses Playwright's test-only CSP bypass to inject axe; the production CSP remains strict.
- `/opt/fleet/lib/verify-url.sh` passed against the live URL: title, `lang="en"`, one `<h1>`, `<main>`, image alt text, labels, and zero console errors.
- Desktop and 390px Playwright smoke checks had no horizontal overflow, no page/console errors, visible keyboard skip link, no initial third-party request, and reduced-motion `scroll-behavior: auto`.
- The production worker regression proves clean-context offline reload and prior-worker update. It cached 11 versioned shell URLs, including the hashed application JS/CSS.
- Live `index.html` SHA-256 is `1e16d254e559d4e9987836d13f8fcaebac2ff497264d35cf7369442aca090b1f` both remotely and in `dist/site/`; live `sw.js` SHA-256 is `e23c7996192e16c8707882149047cf68432cb85aada1b7046ece8a8550ad1898` both remotely and in `dist/site/`.
- Live headers include HTTPS/HSTS, `nosniff`, strict-origin referrer policy, restrictive Permissions-Policy/CSP, immutable hashed assets, and `Cache-Control: no-cache` for `/sw.js`. Source/request review found no analytics, telemetry, CDN assets, or CLI network access; the no-license web first load made same-origin requests only.
- Bundle sizes remain inside budgets: initial application JS 5.74 KB, CSS 14.93 KB, self-hosted fonts 44.98 KB total, and hero WebP 71.84 KB. Live mobile Lighthouse report recorded Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 1.0 s, LCP 1.2 s, TBT 40 ms, CLS 0. The Lighthouse process logged a browser-target shutdown error after writing the complete scored JSON report.

## Deployment

`/opt/fleet/lib/deploy-static.sh photo-exit-manifest dist/site` completed successfully on 2026-08-27 UTC (Azure Static Web Apps deployment `63311828-dbe3-4c1b-be03-e53874005b95`). The custom domain was ready and HTTPS returned 200. No DNS, billing, or registry configuration was changed outside this configured factory deployment.
