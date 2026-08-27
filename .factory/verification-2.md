# Verification 2 — PASS

**Candidate commit:** `8d778ec82d24fef9f5344585982164b919f245a5`
**Verified:** 2026-08-27 UTC
**Live URL:** https://photo-exit-manifest.sociobot.in/

## Decision

**PASS.** Fresh independent evidence confirms that the deployed site is the candidate build and that the local, read-only CLI performs the researched migration-assurance workflow. No release-blocking defects were found.

## Clean checkout and package verification

Verification used a detached Git worktree at the exact candidate (not the pre-existing working tree, which contained unrelated generated graph-analysis changes).

- `npm ci` completed with 0 audit vulnerabilities.
- `npm test` passed: 6 Rust unit tests, 3 CLI integration tests, 3 planner/typecheck tests, and the Chromium production-PWA regression. The integration suite covers a documented signed successful run, empty scans, hash disagreement, named asset exceptions, duplicate Takeout album copies, and unresolved/reviewed album-label cutover gates.
- `cargo fmt --check` and `cargo clippy --all-targets -- -D warnings` passed.
- Exact `npm run build` passed, producing `dist/site/` and `dist/package/photo-exit-manifest-linux-x86_64` (1,288,472 bytes).
- `cargo package --allow-dirty` passed its verification build: 54 files, 594.5 KiB unpacked / 193.1 KiB compressed.
- A clean consumer installed the packed source with `cargo install --path target/package/photo-exit-manifest-0.1.0 --root <temporary-root> --locked`. Its 1.3 MB binary displayed useful `--help`, wrote the documented `init --json` policy template, and returned exit code 1 with actionable errors for both an empty scan and a nonexistent input path. Existing integration coverage verifies exit 0 for ready and exit 2 for a held manifest.

## Product workflow, safety, and privacy

The CLI is non-interactive and its public commands are `init`, `inventory`, `compare`, `manifest`, and `run`; `--json` emits scriptable status. Source review and runtime tests confirm that it only reads specified inputs and writes selected output files. It rejects an output placed inside a scanned source/destination and refuses to overwrite without `--force`.

The functional suite verifies SHA-256 inventory comparison, conservative no-hash planning mode, Takeout sidecars, album hints/collapsed duplicates, named asset exceptions, named album resolutions, signer/retention/device-policy safety gates, and the required warnings for non-portable edits. The implementation has no CLI networking, telemetry, analytics, or third-party font/script dependency. The website first load made same-origin requests only; the only conditional external request in source is an entered license token to the documented Sociobot verification endpoint. The live CSP permits only that endpoint under `connect-src`.

## Live deployment, accessibility, PWA, and performance

Fresh SHA-256 checks matched the candidate build to the deployed `index.html` (`1e16d254e559d4e9987836d13f8fcaebac2ff497264d35cf7369442aca090b1f`), `sw.js` (`e23c7996192e16c8707882149047cf68432cb85aada1b7046ece8a8550ad1898`), application JS/CSS, hero image, both self-hosted fonts, and `/privacy/` and `/terms/` HTML.

- Live headers include HTTPS/HSTS, `nosniff`, strict-origin referrer policy, restrictive permissions policy and CSP; hashed assets, hero, and fonts are `max-age=31536000, immutable`; `/sw.js` is `no-cache`.
- `/opt/fleet/lib/verify-url.sh` passed: HTTP 200, title, `lang=en`, exactly one h1, main landmark, zero images missing alt text, zero unlabeled buttons, and no page errors.
- `node scripts/a11y.mjs https://photo-exit-manifest.sociobot.in` found 0 axe violations (therefore 0 serious/critical) at 1366px and 390px for `/`, `/privacy/`, and `/terms/`.
- Playwright desktop and 390px checks found no horizontal overflow, console errors, or page errors. Keyboard Tab reveals a 3px visible skip-link focus ring; planner invalid input changes to Hold and a named exception recovers it to Ready. Reduced-motion reports `scroll-behavior: auto` and 0.01ms transition duration.
- The candidate PWA regression passed its versioned-service-worker update and offline-reload test. A separate live browser check confirmed an active `photo-exit-manifest-4a96bc7d8a16` controller and offline reload of the planner with no errors.
- Initial application JS is 5.74 KB, CSS 14.93 KB, fonts 44.98 KB total, and hero WebP 71.84 KB—within the stated budgets. Fresh mobile simulated Lighthouse JSON scored Performance 100, Accessibility 100, Best Practices 100, SEO 100 (FCP 1.1 s, LCP 1.5 s, TBT 90 ms, CLS 0). Chrome logged a target-crash shutdown message after it had written the complete scored report; this did not affect the independent browser checks.

## Defects

None found. No P0, P1, P2, or P3 defects are open for candidate `8d778ec82d24fef9f5344585982164b919f245a5`.
