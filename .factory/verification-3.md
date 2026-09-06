# Verify a family photo archive before leaving the cloud — verification 3

**Verdict: PASS.** There are zero findings at every severity and zero untested public claims.

**Implementation reviewed:** `d4536a151c62ffe2f4fece13b1a4cb9a07f31c72`  
**Documentation commit:** `b0d1426`  
**Live URL:** <https://photo-exit-manifest.sociobot.in/>  
**Deployment:** `5458bda2-72ee-43ed-8c0b-777ee3f26dd1`  
**Verified:** 2026-09-06 UTC

## Scope and candidate

This verification used a detached clean worktree at the implementation commit. The shared checkout's pre-existing Graphify changes were not read as product evidence and were not changed. The documentation commit is report-only; the deployed product artifact matches the implementation candidate.

SHA-256 matched between the clean build and live `index.html`, `demo/index.html`, `privacy/index.html`, `terms/index.html`, `404.html`, and `sw.js`.

## Job, audience, and first action

I opened the live page before scrolling in new Chromium contexts at 390 x 844 and 1440 x 900.

| Check | Result |
| --- | --- |
| Job | Verify a family photo archive before leaving the cloud. |
| Audience | Families moving photos from Google Photos to their own archive. |
| First action | **Try it with sample data** to see a completed audit and signed migration report. |

The job headline, audience sentence, action, action outcome, and the three facts (does not change source folders, no photos uploaded, free command-line tool) were visible on the first screen at both sizes. Normal-size layout had no horizontal overflow or product console/page errors.

## Demo and data safety

The first-screen sample action opened canonical `/demo/` in one click. It showed a realistic populated Morgan family result: **Ready to review**, 6 source items, 5 exact matches, 1 named exception, 0 unexplained items, signer Morgan family, and the five documented report files.

The visible, persistent label was **“Demo — sample data, nothing is saved”**. It remained visible after scrolling and supplied Reset demo and Start for real. Reset closed disclosures, restored the sample state, and focused the page h1.

Fresh phone and desktop contexts seeded with `real:` local- and session-storage sentinels retained both values through sample entry and reset. The observed browser requests were same-origin only. Privacy accurately explains that the offline cache contains the static app and bundled sample page, never family or entered data.

The documented `/?demo=1` entry canonicalized to `/demo/`; after an online first visit and service-worker control, it reloaded offline with the demo banner and h1.

## Clean checkout and public claims

After `npm ci` (0 vulnerabilities), I ran every exact `test` command in `.factory/claims.json` independently in the detached clean worktree. All 18 passed.

| Claim | Result | Evidence exercised |
| --- | --- | --- |
| `demo-isolation` | PASS | New temporary child workspace and unchanged family sentinel. |
| `migration-report` | PASS | Ready signed report and exact five files. |
| `named-exception-gate` | PASS | Missing exception held the report until named. |
| `takeout-evidence` | PASS | Names, bytes, dates, sidecar note, album, edit warning, hashes. |
| `exact-byte-matching` | PASS | SHA-256 matches; same name/size but different bytes rejected. |
| `demo-content` | PASS | Browser sample matched fresh CLI report data. |
| `readiness-rules` | PASS | Missing item/album and unsafe retention hold; edit is a warning. |
| `read-only-local` | PASS | Input digests unchanged and runtime socket guard recorded no attempt. |
| `device-policy-report` | PASS | Two devices and four decisions in JSON and Markdown. |
| `album-exception-gate` | PASS | Album-only gap changed from hold to ready only after named resolution. |
| `no-tracking` | PASS | Resource/cache allowlist; no user stores, cookies, beacons, or third party requests. |
| `free-cli` | PASS | Bundled sample completed without account, key, licence, or paid feature. |
| `scriptable-cli` | PASS | Closed stdin, JSON output, documented success and invalid-input exits. |
| `planning-mode` | PASS | Hash-free inventory was conservative and remained held. |
| `package-contract` | PASS | MIT, one binary, and locked targets compiled with Rust 1.85.0. |
| `build-artifacts` | PASS | `dist/site/` and packaged Linux executable were created. |
| `offline-reload` | PASS | Canonical demo and query entry reopened offline. |
| `route-contract` | PASS | Four real routes plus a designed HTTP 404. |

I cross-checked the landing page, demo, privacy, terms, README, CLI help, and demo documentation against the registry. No public claim was missing, false, incomplete, or untested.

## Product and package checks

These commands passed from the clean worktree:

- `npm test` — 8 Rust unit tests, 4 CLI integration tests, 4 route/contract tests, 1 PWA test, 5 browser tests, and 18 claim tests.
- `npm run build` — produced `dist/site/` and `dist/package/photo-exit-manifest-linux-x86_64`.
- `npm run audit:copy` — wrote the deterministic audit with 25 landing and 38 README sentences.
- `cargo fmt --check`
- `cargo clippy --all-targets -- -D warnings`
- `cargo package --allow-dirty` — 108 files, 340.0 KiB compressed, verification build passed.

A clean consumer installed the packed source using `cargo install --path target/package/photo-exit-manifest-0.1.0 --root <new-root> --locked`. The installed 0.1.0 binary provided helpful help and version output, completed `demo --json` with `ready_for_cutover` and 100% accounted, returned exit 1 for a specified nonexistent input, and returned exit 1 without overwriting an existing demo directory. This covers normal, invalid, and recovery paths for the local CLI.

## Routes, accessibility, privacy, and offline behavior

Live `/`, `/demo/`, `/privacy/`, `/terms/`, and the designed 404 page each had one h1, one main landmark, a route-specific title, no overflow, and zero Axe violations at both 390 px and 1366 px. At 200% root text size on a 390 px phone viewport, all five pages had `clientWidth: 390`, `scrollWidth: 390`, and an on-screen Privacy link.

Keyboard Tab reached the skip link with a 3 px focus ring. Reduced motion changed scrolling to `auto` and transition duration to 0.01 ms. The local browser suite also passed route focus, Back scroll restoration, metadata, and internal-link checks.

Unknown routes deliberately return the designed **“This archive path leads nowhere”** page with HTTP 404. The browser's resource error for that expected non-2xx response is not a product console defect. `robots.txt`, `sitemap.xml`, security headers, and the same-origin CSP were present; the sitemap lists all four public routes. Legal pages loaded with their own titles and content.

## Earlier findings

All earlier review and verification findings were inspected. Their current dispositions are:

| Finding set | Current disposition | Current evidence |
| --- | --- | --- |
| `R1-B1` to `R1-B6` | Fixed | One-click isolated demos, claim registry, no paid/dead link, designed 404, and complete route metadata all passed. |
| `R1-M1` to `R1-M3`, `R1-D1`, `R1-S1` | Fixed | Shared site skeleton, plain first read, consistent terms, reset/storage isolation, real routes, focus, mobile layout, and reduced motion passed. |
| `F-2-1` to `F-2-10` | Fixed | Query offline reload, accurate readiness language, network guard, policy/album/privacy/build claims, clear labels, and copy audit passed. |
| `F-3-1` to `F-3-2` | Fixed | Export-note warning is registered; Rust 1.85 compatibility compiled. |
| `F-4-1` to `F-4-6` | Fixed | Cache disclosure, exact bytes, emitted inventory fields, browser/CLI parity, temp demo output, and warning de-duplication passed. |
| `F-5-1` to `F-5-2` | Fixed | Real navigation restoration and accurate cache disclosure remain verified. |
| Review 6 | No findings | No regression observed. |
| Review 7 200% text resize | Fixed | All five routes reflowed at 390 px with no overflow and Privacy visible. |

## Result

**PASS — 0 findings, 0 untested claims.**
