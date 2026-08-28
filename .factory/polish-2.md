# Perfection loop polish 2

**Reviewed candidate:** `ea7f415fe17cd754d73b3a3a8bed36b84de9bb5c`

**Review report:** `e26b0b936db832c31fa549a4e843d8e3bb974b7b` / `.factory/review-2.md`

**Repair implementation:** `ea43307`

**Deployment:** `a63a129e-48d9-4d0e-b77a-e818acaa30f3`

**Live URL:** https://photo-exit-manifest.sociobot.in/

## Review 2 finding map

| ID | Change made | Evidence |
| --- | --- | --- |
| F-2-1 | `/?demo=1` now replaces itself with canonical `/demo/` without retaining the query. The worker also normalizes navigation cache keys, so a direct offline revisit to the documented URL works. | `@claim:offline-reload` begins at `/?demo=1`, confirms `/demo/`, reloads offline, then opens `/?demo=1` again while offline. Live cold check passed both paths. Screenshot: `.factory/evidence/polish-2/live/demo-mobile.png`. |
| F-2-2 | Replaced the false edit hold rule with two accurate sentences. Added one claim covering missing-item, album-label, retention, and edit-warning behavior separately. | `@claim:readiness-rules` proves all three hold conditions and proves the edited sample remains ready with a warning. Live copy says “Edited-looking files appear as warnings to review.” |
| F-2-3 | Replaced source regex inspection with a compiled `LD_PRELOAD` runtime guard. It denies and logs IPv4/IPv6 `socket`, `connect`, and `sendto` attempts around both `demo` and a complete `run`. | `@claim:read-only-local` passed with an empty runtime network-attempt log and unchanged source/destination digests. |
| F-2-4 | Registered the device-policy promise and inspected both output formats for two devices and all four choices. | `@claim:device-policy-report` checks `manifest.json` and `CUTOVER.md` for backup, deletion, conflict, and offline choices. |
| F-2-5 | Registered album-label readiness independently from asset exceptions. | `@claim:album-exception-gate` creates an album-only gap, observes exit 2/hold, adds a named resolution, then observes exit 0/ready. |
| F-2-6 | Registered the no-tracking promise separately. Each public route is tested against an explicit static-resource allowlist and checked for cookies, local/session storage, IndexedDB, OPFS, and beacon calls. | `@claim:no-tracking`; live repeat passed five routes and 31 allowlisted requests. |
| F-2-7 | Registered build outputs and removed claims about factory release creation and ownership that this repository cannot prove. The claim runner now performs the full production build. | `@claim:build-artifacts` checks `dist/site/index.html` and executable `dist/package/photo-exit-manifest-linux-x86_64`; clean `npm run build` passed. |
| F-2-8 | Replaced “quickest” with “Run the sample to see a finished audit.” | Generated `.factory/copy-audit.md`; no comparison remains. |
| F-2-9 | Replaced “Reads folders only” with “Does not change source folders,” expanded CLI on first use, and rewrote the exception label as a grammatical result. | Phone first-screen browser test asserts all three facts fit within 390×844. Live screenshot: `.factory/evidence/polish-2/live/screenshot-mobile.png`. |
| F-2-10 | Added `npm run audit:copy`, which extracts production landing text and README prose and applies one documented whitespace-token rule. | `.factory/copy-audit.md` was regenerated: 25 landing sentences, 23 landing labels/actions, 37 README sentences, zero >22-word or banned-term flags. |

## Earlier finding audit

| ID | Cumulative status and fresh evidence |
| --- | --- |
| R1-B1 | One-click `/?demo=1`, persistent banner, reset, start-for-real link, realistic browser audit, bundled CLI fixtures, and isolated `demo` command remain present. `@claim:demo-isolation`; live demo screenshot. |
| R1-B2 | `.factory/claims.json` now has 16 claims. `each registered claim has exactly one matching tagged test` proves a one-to-one registry/test mapping; every command passed separately in the clean clone. |
| R1-B3a | Local/read-only, SHA-256, free use, report files, and exception claims remain registered and passing. `@claim:read-only-local`, `@claim:takeout-evidence`, `@claim:free-cli`, `@claim:migration-report`, `@claim:named-exception-gate`. |
| R1-B3b | Inventory, exact-byte matching, named differences, device choices, and report output are registered and inspect real outputs. `@claim:takeout-evidence`, `@claim:device-policy-report`, `@claim:migration-report`. |
| R1-B3c | Planning mode, exit codes, Takeout notes, album labels, warnings, and readiness rules are registered. `@claim:planning-mode`, `@claim:scriptable-cli`, `@claim:album-exception-gate`, `@claim:readiness-rules`. |
| R1-B3d | The unavailable paid tier remains absent. `@claim:free-cli` passes, and the live link crawl contains no checkout URL. |
| R1-B3e | README release/ownership promises were removed. Remaining operational promises map to the 16-claim registry. Generated copy audit has zero flags. |
| R1-B4 | No paid link or price is advertised. Live internal-link crawl passed every route and hash target. |
| R1-B5 | The designed archive-path page still returns HTTP 404 at `/not-a-real-route`. `@claim:route-contract`; screenshot: `.factory/evidence/polish-2/live/404-desktop.png`. |
| R1-B6 | Distinct titles, descriptions, canonical URLs, Open Graph/Twitter data, social art, favicon, and touch icon remain on all routes. Metadata test and live route loop passed. |
| R1-M1 | Shared wordmark/header/footer, Demo/Privacy navigation, legal links, source, factory credit, and version remain on every route. Live all-route link crawl passed. |
| R1-M2 | The job-first h1, audience sentence, one primary sample action, outcome text, and three facts remain above the fold at 390×844. Browser first-screen test and live screenshot passed. |
| R1-M3 | Audit, signed migration report, switch, named exception, and family archive remain the controlled vocabulary. See `.factory/copy-audit.md`. |
| R1-D1 | Browser reset remains stateless and focus-safe; CLI demo refuses existing paths and stays below its new sandbox. `@claim:demo-isolation`; live reset preserved `real:sentinel`. |
| R1-S1 | Real routes, titles, focus restoration, 404 status, legal links, 44px targets, phone stacking, and reduced motion remain tested. Browser suite and live axe report zero violations. |

## Verification evidence

The separate checkout `/tmp/photo-exit-polish2-clean-9nzNyk/repo` at `ea43307` passed:

- `npm ci` with zero vulnerabilities.
- All 16 commands in `.factory/claims.json`, separately.
- `npm test`: 7 Rust unit, 4 CLI integration, 4 site/contract, 1 PWA, 4 browser, and 16 claim tests.
- `cargo fmt --check` and `cargo clippy --all-targets -- -D warnings`.
- `npm run build`; output was 2.52 KB raw JavaScript, 21.68 KB CSS, 44.98 KB fonts, and a 71.84 KB hero image.
- `cargo package --allow-dirty`; 95 files, 299.7 KiB compressed, including a successful verification compile.

After deployment:

- `/opt/fleet/lib/verify-url.sh` returned HTTP 200, one h1, `lang=en`, a main landmark, complete alt/button names, and zero console errors.
- Axe found 0 violations at 390px and 1366px on home, demo, privacy, terms, and 404.
- Cold Playwright passed first-screen facts, canonical demo redirect, banner/reset isolation, offline reload and offline documented-entry revisit, route titles/canonicals, HTTP 404, history focus, and link crawl.
- Local/live SHA-256 matched for home, demo, privacy, terms, 404, and `sw.js`.
- Lighthouse mobile recorded Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 1.1s, LCP 1.4s, TBT 40ms, CLS 0.022. Its report completed before Chrome emitted a teardown target-crash message.

Every review-1 and review-2 finding is resolved.
