# Photo Exit Manifest v0.1.0 — handoff

## What shipped

- A typed Rust single-binary CLI with `init`, `inventory`, `compare`, `manifest`, and end-to-end `run` commands.
- Read-only recursive inventory for ordinary folders and changing Google Takeout layouts, including common photo, RAW, and video formats; adjacent/title-indexed sidecars; capture times; album hints; edit warnings; byte counts; and SHA-256 hashes.
- Hash-based duplicate collapse that retains Takeout album aliases, strict hash comparison, conservative planning-only filename/size/date fallback, named exceptions, extra-destination reporting, and the 99.5% accounting metric.
- Explicit per-device upload, deletion, conflict, and offline policies. A manifest remains on hold without SHA-256 evidence, complete accounting, safe required policy fields, a 30-day rollback window, and a reviewer signature.
- Machine-readable inventories/audit/manifest plus a human-readable `CUTOVER.md`, with clear exit codes (`0` ready/success, `1` invalid input or I/O, `2` valid result on hold).
- A responsive static documentation site following the luminous archive-glass thesis, with an original 71 KB WebP hero, a live readiness gate, full CLI examples, offline shell caching, privacy and terms pages, and no runtime third-party scripts or fonts.
- A genuinely useful unlimited free CLI plus a $29 one-time Family Pack browser policy builder. Checkout and daily-cached verification follow the Sociobot API contract; returned and pasted licenses are supported, cached verdicts unlock optimistically, and offline verification never blocks the free experience.
- MIT license, changelog, third-party font notices, package metadata, static caching/security configuration, and release packaging script.

## Run and verify

```sh
npm install
npm test
npm run build
```

`npm run build` produces:

- deployable static site: `dist/site/index.html`
- Linux x86_64 binary: `dist/package/photo-exit-manifest-linux-x86_64`

Additional checks run successfully:

```sh
cargo clippy --all-targets -- -D warnings
cargo package --allow-dirty
node scripts/a11y.mjs http://127.0.0.1:4173
/opt/fleet/lib/verify-url.sh http://127.0.0.1:4173 .factory/evidence
```

The verified crate was 167 KB compressed; the stripped Linux binary was 1.3 MB. Unit/integration coverage includes Takeout sidecars and album duplicates, strict hash disagreement, named exceptions, unsigned/unsafe holds, the documented full run, and the actionable empty-folder error. Site tests cover the readiness threshold and policy schema.

## Lighthouse-class results

Measured against the production Vite build with mobile emulation on 2026-08-27:

- Performance: **99**
- Accessibility: **100**
- Best practices: **100**
- SEO: **100**
- FCP: **1.4 s**
- LCP: **1.8 s**
- TBT: **0 ms**
- CLS: **0**

Axe reported zero violations at 1366px and 390px on `/`, `/privacy/`, and `/terms/`. The worker URL verifier found one `<h1>`, `lang`, `<main>`, complete image alt text, labeled buttons, and no console errors on all three routes. Initial application JS is 5.74 KB, CSS is 14.93 KB, fonts total 44.98 KB, and the hero is 71.84 KB (all uncompressed, excluding sourcemaps), inside every stated budget.

## Known gaps and next steps

- Takeout is intentionally parsed defensively, but Google can introduce new sidecar shapes. Unknown valid JSON is ignored and unreadable sidecars are named as warnings rather than guessed.
- Album evidence is folder/sidecar-derived. Provider-only shared-album permissions, live-photo coupling, edit stacks, face groups, comments, and partner-sharing state cannot be proven from ordinary exports; the manifest says so.
- The factory still needs to register the paid product/return URL, switch staging if desired, publish release archives for other platforms, and deploy `dist/site/`. No billing, DNS, registry, or infrastructure changes were made here.
- A real pilot archive should validate additional camera/video extensions and representative historical Takeout exports before claiming broad format coverage.

## Asset provenance

The hero was generated with `/opt/fleet/lib/gen-image.sh` using the `factory-image` deployment, inspected, then resized and encoded to WebP. The exact prompt and visual reasoning are in `.factory/design.md`. Instrument Sans and IBM Plex Mono are self-hosted under their included SIL OFL licenses; there are no stock assets.
