# Perfection loop polish 5

**Reviewed candidate:** `7241a3dcd490815fbf6a4ae5808d4a0e7884d5a7`  
**Review report:** `ae40ca0600a80c888f485f88ac24af648f19e4b6` / `.factory/review-5.md`  
**Repair commit:** `daec7e8593306c841eb4aa4d1072aac02fc4da61`  
**Deployment:** `086b176d-caef-4dcd-a401-2f66e9efeede`  
**Live URL:** <https://photo-exit-manifest.sociobot.in/>

Evidence shorthand: **Claims** is the 18-command fresh-clone log at `/work/.evidence/polish5-clean-claims.log`; **Live** is `/work/.evidence/polish5-live/live-recheck.json`; **Axe** is `/work/.evidence/polish5-live/axe-live.json`. Screenshot paths below are in `/work/.evidence/polish5-live/`.

## Cumulative finding map

| Finding ID | Change made | Evidence |
| --- | --- | --- |
| R1-B1 | Retained the one-click `?demo=1` entry, canonical `/demo/`, 6/5/1/0 bundled audit, persistent banner, reset, Start for real, and temp-directory CLI demo. | `@claim:demo-isolation`, `@claim:migration-report`, `@claim:demo-content`; `demo-mobile.png`; live `/demo/`. |
| R1-B2 | Retained the 18-entry, one-to-one claim registry and its command contract. | route contract test; **Claims** shows all 18 PASS. |
| R1-B3a | Retained tested read-only/local behavior, SHA-256 evidence, free CLI, report generation, and named exceptions. | `@claim:read-only-local`, `@claim:exact-byte-matching`, `@claim:free-cli`; `home-first-screen-mobile.png`; live `/`. |
| R1-B3b | Retained tested inventory fields, exact matching, device choices, and signed report output. | `@claim:takeout-evidence`, `@claim:device-policy-report`, `@claim:migration-report`; `demo-mobile.png`; live `/demo/`. |
| R1-B3c | Retained tested planning mode, JSON/exit codes, Takeout notes, album resolutions, warnings, and readiness rules. | `@claim:planning-mode`, `@claim:scriptable-cli`, `@claim:album-exception-gate`, `@claim:readiness-rules`; live `/demo/`. |
| R1-B3d | Kept unavailable pricing, checkout, and licence UI removed. | `@claim:free-cli`; live link crawl in browser route test. |
| R1-B3e | Retained claim-tested README operations and corrected the remaining cache disclosure. | `@claim:no-tracking`; **Claims**; live `/privacy/`. |
| R1-B4 | Kept the dead paid link removed and current links crawlable. | browser route/link test; live `/`, `/demo/`, `/privacy/`, `/terms/`. |
| R1-B5 | Retained the archive-styled HTTP 404 rather than a home fallback. | `@claim:route-contract`; `404-desktop.png`; live `/not-a-real-route` returned 404. |
| R1-B6 | Retained per-route titles, descriptions, canonicals, OG/Twitter metadata, social art, favicon, and touch icon. | route metadata test; **Live** route titles; live `/`, `/demo/`, `/privacy/`, `/terms/`, `/404.html`. |
| R1-M1 | Retained the shared header/footer, legal links, Param Factory credit, and version. | browser route test; `privacy-desktop.png`; live legal routes. |
| R1-M2 | Retained the job-first h1, audience, one sample action, outcome, and three facts in the first phone screen. | phone first-screen test; `home-first-screen-mobile.png`; live `/`. |
| R1-M3 | Retained controlled terms for audit, signed migration report, switch, named exception, family archive, and demo. | `npm run audit:copy`; `copy-audit.md`; live `/` and `/demo/`. |
| R1-D1 | Retained isolated browser reset behavior and CLI writes below a new temporary workspace only. | `@claim:demo-isolation`; `demo-mobile.png`; live `/demo/`. |
| R1-S1 | Repaired its scroll-restoration regression and kept real routes, focus, mobile targets, legal pages, and reduced motion. | browser navigation/focus test; `home-scroll-back.png`; **Live** records 700 restored to 700. |
| F-2-1 | Retained query canonicalization and service-worker navigation normalization. | `@claim:offline-reload`; **Live** offline reload of `?demo=1` → `/demo/`. |
| F-2-2 | Retained accurate separation of hold conditions from edit warnings. | `@claim:readiness-rules`; live `/` wording and `/demo/` ready warning. |
| F-2-3 | Retained runtime IPv4/IPv6 socket denial/logging around demo and run. | `@claim:read-only-local`; **Claims**. |
| F-2-4 | Retained two-device backup, deletion, conflict, and offline decisions in both report formats. | `@claim:device-policy-report`; `demo-mobile.png`. |
| F-2-5 | Retained the album-label hold and named-resolution transition. | `@claim:album-exception-gate`; live `/demo/`. |
| F-2-6 | Extended the cache/privacy contract: it still enforces the request and storage allowlist, and now asserts the precise README and privacy disclosure. | `@claim:no-tracking`; **Axe**; live `/privacy/`. |
| F-2-7 | Retained site and packaged executable output checks while unsupported factory-release claims remain absent. | `@claim:build-artifacts`; `npm run build`; package verification. |
| F-2-8 | Retained factual sample wording without untestable comparison language. | `npm run audit:copy`; live `/demo/`. |
| F-2-9 | Retained clear first-screen fact labels and grammatical named-exception labels. | phone first-screen test; `home-first-screen-mobile.png`. |
| F-2-10 | Regenerated the deterministic copy audit. | `npm run audit:copy`: 25 landing and 38 README sentences, zero flags. |
| F-3-1 | Retained the asserted missing-export-note warning. | `@claim:takeout-evidence`; **Claims**. |
| F-3-2 | Retained the Rust 1.85 locked-target compile assertion. | `@claim:package-contract`; **Claims**. |
| F-4-1 | Replaced the false README cache wording with “The demo does not store your family data. Its offline cache keeps the static app and bundled sample page.” Privacy now says the same thing in plain words. | `@claim:no-tracking`; `privacy-desktop.png`; **Live** verifies the 16-file cache and privacy text. |
| F-4-2 | Retained the registered default SHA-256 exact-byte assertion and same-name/same-size mismatch fixture. | `@claim:exact-byte-matching`; **Claims**. |
| F-4-3 | Retained only emitted inventory fields in copy and assertions for names, bytes, dates, albums, edits, and hashes. | `@claim:takeout-evidence`; live `/`. |
| F-4-4 | Retained browser-to-CLI sample parity for status, totals, evidence rows, signer, and report files. | `@claim:demo-content`; `demo-mobile.png`; **Live** has 6/5/1/0. |
| F-4-5 | Retained no-`--output` temporary CLI demo isolation assertion. | `@claim:demo-isolation`; **Claims**. |
| F-4-6 | Retained warning de-duplication in generated reports. | `@claim:takeout-evidence`; **Claims**. |
| F-5-1 | Save same-origin link scroll exactly once before navigation; `pagehide` cannot overwrite it after reset. The header is sticky so a person can actually follow Privacy from a long page, and restoration is instant before focusing the h1. The browser regression test now uses a physical visible-link pointer click and synchronized Back navigation. | `navigation, focus restoration, metadata and local links work as real routes`; `home-scroll-back.png`; **Live** records `savedScroll: 700`, `restoredScroll: 700` at `/` after `/privacy/`. |
| F-5-2 | Rewrote false README cache text and made the privacy page explicitly disclose that the offline cache contains the static app and bundled sample page, never family data. | `@claim:no-tracking` asserts both rendered privacy text and README wording; `privacy-desktop.png`; **Live** cache contains `/demo/` and the precise disclosure. |

## Verification and deployment evidence

- Fresh clone `/tmp/photo-exit-polish5-clean-s9HUlR/repo` at `daec7e8`: `npm ci`, all 18 registered commands independently, and `npm test` passed.
- Local: `npm run build`, `npm run audit:copy`, `cargo fmt --check`, strict Clippy, and `cargo package --allow-dirty` passed.
- Deployment `086b176d-caef-4dcd-a401-2f66e9efeede` uploaded the 247,245-byte static artifact and completed successfully.
- Live verifier: HTTP 200, 750 ms load, correct title/lang/one h1/main/alt/button names, and zero console errors (`verify.json`).
- Live route/demo/history recheck: expected titles on five routes, designed unknown-route 404, same-origin demo requests, one 16-entry static cache, offline reload, and exact Back restoration (`live-recheck.json`).
- Live axe: zero serious or critical findings across five routes at 390px and 1366px (`axe-live.json`).
- Live Lighthouse: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 1.1 s, LCP 1.5 s, TBT 0 ms, CLS 0.022 (`lighthouse.json`).

No finding from reviews 1–5 remains open.
