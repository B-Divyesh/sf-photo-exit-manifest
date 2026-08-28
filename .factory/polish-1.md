# Perfection loop polish 1

**Reviewed candidate:** `0b094d265dc36c112e8c169a22834cb4336ec936`

**Review report:** `6675d396a1be5e452e4a975558137f2e5ee90d16` / `.factory/review-1.md`

**Repair commit:** `e1a7155b6aa851ee51aa2127eff032803cefb630`

**Live URL:** https://photo-exit-manifest.sociobot.in/

The report did not assign machine IDs, so this document assigns stable IDs in report order.

## Finding map

| ID | Review finding | Change made | Evidence |
| --- | --- | --- | --- |
| R1-B1 | No one-click, isolated CLI demo | Added realistic `examples/`, `photo-exit-manifest demo`, a temporary-workspace guard, `/?demo=1` → `/demo/?demo=1`, a complete audit view, self-hosted terminal record, persistent demo banner, Reset demo, and Start for real. Browser demo stores nothing. | `@claim:demo-isolation`; `@claim:migration-report`; `the phone first screen states the job and opens the isolated demo in one click`; `.factory/evidence/polish-1/live-demo-mobile.png`; live `/?demo=1`. |
| R1-B2 | Claims registry and claim tests missing | Added `.factory/claims.json` with 11 claims and exactly one tagged observable test per claim. Added a runner that builds from a clean state before filtering a tag. | Every manifest command passed separately in clean clone `e1a7155`; full `npm test` passed 11/11 claim tests. |
| R1-B3a | Hero/evidence promises unlisted | Replaced jargon and unsupported figures with concrete facts. Registered and tested local/read-only behavior, SHA-256 evidence, free use, report files, and exception behavior. | `@claim:read-only-local`, `@claim:takeout-evidence`, `@claim:free-cli`, `@claim:migration-report`, `@claim:named-exception-gate`. |
| R1-B3b | Workflow promises unlisted | Rewrote workflow around inventory, exact bytes, named differences, device decisions, and a signed migration report. Tests inspect real generated output and both input trees. | `@claim:takeout-evidence`, `@claim:named-exception-gate`, `@claim:migration-report`, `@claim:read-only-local`. |
| R1-B3c | Planner/docs promises unlisted | Removed the browser-only readiness calculator and replaced it with the real bundled audit. Added tests for JSON/exit codes, Takeout notes, album labels, warnings, and hash-free planning. Fixed planning mode so one destination cannot satisfy two sources. | `@claim:scriptable-cli`; `@claim:planning-mode`; `planning_comparison_never_reuses_one_destination_for_two_sources`; `@claim:takeout-evidence`. |
| R1-B3d | Paid-section promises unlisted | Removed the unavailable Family Pack, checkout, price, licence UI, and all purchase claims. The free CLI remains the whole product. | `@claim:free-cli`; live home contains no checkout link or paid copy. |
| R1-B3e | README promises unlisted | Rewrote README in short, consistent sentences. Each operational promise maps to a claim. Removed release-availability and billing claims. | `.factory/claims.json`; `.factory/copy-audit.md`; all 11 clean-clone claim commands. |
| R1-B4 | Paid primary link returned 404 | Removed the price and purchase link because no configured checkout exists. No billing or paid feature remains advertised. | `navigation, focus restoration, metadata and local links work as real routes`; live link crawl; `@claim:free-cli`. |
| R1-B5 | Unknown links silently showed home | Added a styled archive-path 404 and host `responseOverrides`. Removed the catch-all home fallback. | `@claim:route-contract`; `static host rewrites missing paths to the designed 404 without a home fallback`; live `/not-a-real-route` returned HTTP 404 and title `Page not found — Photo Exit Manifest`; `.factory/evidence/polish-1/404-desktop.png`. |
| R1-B6 | Route metadata incomplete | Added route-specific titles, descriptions, canonicals, Open Graph, Twitter cards, a 1200×630 art-derived image, and a 180×180 touch icon on all routes. | `every route has its own title, canonical and social metadata`; browser metadata test; live image requests returned 200. |
| R1-M1 | Header/footer inconsistent | All pages now use the same wordmark, Demo/How it works/Install/Privacy header, purpose line, Privacy/Terms/Source footer, Param Factory credit, and version. | Browser route/link crawl; mobile and desktop screenshots; live routes all 200. |
| R1-M2 | First screen was metaphor-first with competing actions | Replaced it with the requested job headline, audience sentence, one primary sample action with outcome text, and three short facts. | Phone first-screen browser test; `.factory/copy-audit.md`; `.factory/evidence/polish-1/home-mobile.png`; live home. |
| R1-M3 | Terminology changed without explanation | Standardized on **audit**, **signed migration report**, **switch from Google Photos**, **named exception**, and **family archive**. Defined “Google export note” in plain words. | Terminology table in `.factory/copy-audit.md`; site/README search; copy audit has no banned wording or sentence over 22 words. |
| R1-D1 | Demo sandbox checks failed | Browser state is stateless; reset closes disclosures and restores heading focus. CLI demo refuses an existing path and writes beneath a new sandbox only. | `@claim:demo-isolation`; demo reset browser test; `@claim:read-only-local`; `.factory/demo.md`. |
| R1-S1 | Routing/focus/legal/mobile acceptance gaps | Added real built routes for demo/privacy/terms/404, route focus announcement, consistent legal links, 44px targets, visible focus, phone-specific stacking, and reduced-motion handling. | Browser tests for routes/focus/mobile/targets/reduced motion; axe 0 violations at 390px and 1366px on five routes; `.factory/evidence/polish-1/screenshot-mobile.png`. |

## Verification

From a separate clean checkout of `e1a7155`:

- `npm ci` — passed, 0 vulnerabilities.
- Every `test` command in `.factory/claims.json` — 11/11 passed individually.
- `npm test` — passed: 7 Rust unit, 4 CLI integration, 2 route, 1 PWA, 4 browser, and 11 claim tests.
- `cargo fmt --check` — passed.
- `cargo clippy --all-targets -- -D warnings` — passed.
- `npm run build` — passed; produced `dist/site/` and the packaged Linux binary.
- `cargo package --allow-dirty` — passed its verification compile; 87 files, 273.3 KiB compressed.

After final deployment `27e83bb0-0303-4bcc-91e8-55c19f3d90c0`:

- `/opt/fleet/lib/verify-url.sh` passed the live home page with zero console errors.
- Live axe: 0 violations at 390px and 1366px on `/`, `/demo/`, `/privacy/`, `/terms/`, and `/404.html`.
- Cold Playwright: demo redirect/banner/reset links/storage/network/mobile, route titles, 404, known-route console, and offline reload passed.
- Local/live SHA-256 matched for home, demo, privacy, terms, 404, and `sw.js`.
- Lighthouse mobile: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 1.1s, LCP 1.5s, TBT 90ms, CLS 0.022. The report is `.factory/evidence/polish-1/lighthouse-live.json`.

No review finding remains open.
