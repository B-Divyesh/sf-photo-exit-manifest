# Verify a family photo archive before leaving the cloud — review 8

**Verdict: PASS.** There are **0 findings** at every severity and **0 untested public claims**.

**Reviewed:** 2026-09-06 UTC  
**Implementation candidate:** `d4536a151c62ffe2f4fece13b1a4cb9a07f31c72`  
**Documentation baseline:** `0da02fb8b33f7f46369a7e1bd53ef84376bf59a4`  
**Checkout baseline:** `89ff9abfd89f0f53513093b263e840de63e75785`  
**Live URL:** <https://photo-exit-manifest.sociobot.in/>

## Job, audience, and first action

I opened the live home page in fresh Chromium phone (390×844) and desktop (1440×900) contexts before scrolling. Both showed the same answers:

| Check | Observed result |
| --- | --- |
| Job | Verify a family photo archive before leaving the cloud. |
| Audience | Families moving photos from Google Photos to their own archive. |
| First action | Select **Try it with sample data** to see a completed audit and signed migration report. |

The phone and desktop first screens contained the job-first h1, audience sentence, primary action and outcome, plus the three factual lines: **Does not change source folders**, **No photos uploaded**, and **Free command-line tool**. Normal-size layouts had `scrollWidth == clientWidth`, no page errors, and no product console errors. The page uses the documented product-specific luminous archive visual system, rather than a generic landing-page layout.

Evidence: `/work/.evidence/review8-live/first-screen-phone.png`, `/work/.evidence/review8-live/first-screen-desktop.png`, and `/work/.evidence/review8-live/behavior.json`.

## Sample, privacy, and offline use

The first visible sample action opened canonical `/demo/` in one click. Its populated result showed **Ready to review**, six source items, five exact matches, one named exception, zero unexplained items, Morgan family as signer, and the documented five report files. The sticky label **“Demo — sample data, nothing is saved”** stayed visible after scrolling.

I seeded `real:family` local storage and `real:session` session storage before sample entry. Both remained unchanged after entry and **Reset demo**. Reset returned focus to the demo h1. The sample’s requests were same-origin only. A fresh context that visited `/?demo=1`, waited for service-worker control, went offline, and reloaded reached canonical `/demo/` with its h1 and persistent sample label intact.

The static website has no backend, tenant, health, restart-persistence, or rate-limit surface. The local CLI has no database or shared product state.

Evidence: `/work/.evidence/review8-live/demo.json` and `/work/.evidence/review8-live/behavior.json`.

## Claims and clean checkout

In clean detached worktree `/tmp/photo-exit-review8.Bafu1C/repo`, I installed the documented Node prerequisites with `npm ci` (0 vulnerabilities). I ran every exact command in `.factory/claims.json` separately. All 18 returned zero; the command-by-command log is `/work/.evidence/review8-claims-individual.log`.

| Claim | Result | Observable evidence exercised |
| --- | --- | --- |
| `demo-isolation` | PASS | New temporary child workspace; family sentinel unchanged. |
| `migration-report` | PASS | Ready signed report and exact five report files. |
| `named-exception-gate` | PASS | Missing exception held the result until named. |
| `takeout-evidence` | PASS | Names, sizes, dates, album labels, edit warning, export note, and hashes. |
| `exact-byte-matching` | PASS | Identical SHA-256 bytes matched; same-name/size different bytes did not. |
| `demo-content` | PASS | Browser sample matched the fresh CLI report. |
| `readiness-rules` | PASS | Item, album, and retention holds; edit warning remains non-blocking. |
| `read-only-local` | PASS | Inputs unchanged and runtime socket guard saw no connection attempt. |
| `device-policy-report` | PASS | Two devices and all four decisions in JSON and Markdown. |
| `album-exception-gate` | PASS | Album-only gap held until a named reviewed resolution. |
| `no-tracking` | PASS | Explicit resource/cache allowlist; no cookies, user stores, beacons, or third party. |
| `free-cli` | PASS | Complete sample succeeded without account, key, licence, or paid feature. |
| `scriptable-cli` | PASS | Closed stdin, JSON output, and documented exit behavior. |
| `planning-mode` | PASS | Hash-free comparison stayed conservative and held. |
| `package-contract` | PASS | MIT, one binary, and locked compilation with Rust 1.85.0. |
| `build-artifacts` | PASS | `dist/site/` and `dist/package/photo-exit-manifest-linux-x86_64`. |
| `offline-reload` | PASS | Canonical and query demo entries reloaded offline. |
| `route-contract` | PASS | Four real routes and designed unknown-route 404. |

I re-read the landing page, demo, privacy, terms, README, CLI help, and demo documentation against the registry. Public operational statements map to these passing claims. No missing, false, incomplete, or untested public claim was found.

## Package and command checks

These commands passed in the clean worktree:

- `npm test` — 8 Rust unit tests, 4 CLI integration tests, 4 site tests, 1 PWA test, 5 browser tests, and 18 claim tests.
- `npm run build` — exercised by the declared build-artifacts command and produced the documented site and executable.
- `npm run audit:copy`
- `cargo fmt --check`
- `cargo clippy --all-targets -- -D warnings`
- `cargo package --allow-dirty`

I installed the packaged source into a new consumer root with `cargo install --path target/package/photo-exit-manifest-0.1.0 --root <new-root> --locked`. The installed binary gave useful help, completed `demo --json` with `ready_for_cutover` and 100.0% accounted, returned exit 1 with a concrete message for a nonexistent input, and returned exit 1 rather than overwriting an existing demo directory. This covers normal, invalid, boundary, and recovery paths for the installed artifact.

## Live routes, access, and links

- `/`, `/demo/`, `/privacy/`, and `/terms/` returned 200 with distinct titles, one h1, and one main landmark.
- An unknown route returned the designed **“This archive path leads nowhere”** page with HTTP 404. This deliberate 404 is expected and is a pass.
- Axe found zero WCAG 2 A/AA violations on all five pages at both 390 px and 1440 px.
- At 200% root text on a 390 px viewport, all five pages had `clientWidth: 390`, `scrollWidth: 390`, and an on-screen Privacy link.
- Keyboard Tab first reached the skip link with a 3 px focus outline. Reduced motion set scrolling to `auto` and transitions to `0.01ms`.
- Same-origin public links returned 200; the product’s GitHub source link returned 200. `robots.txt`, sitemap, HTTPS, CSP, `nosniff`, referrer policy, and permissions policy are live. The CSP places `frame-ancestors` in the response header.
- Live requests during the home-to-demo/offline flow were only to `https://photo-exit-manifest.sociobot.in`; no analytics, advertising, third-party font/script, or product console error appeared.

Evidence: `/work/.evidence/review8-live/routes-a11y.json`, `/work/.evidence/review8-live/behavior.json`, `/work/.evidence/review8-live/links.json`, and `/work/.evidence/review8-live/headers.txt`.

## Earlier findings

I inspected every earlier review, verification, and polish record, including minor findings. All remain resolved:

| Earlier findings | Current disposition and proof |
| --- | --- |
| `R1-B1`, `R1-B2`, `R1-B3a`–`R1-B3e`, `R1-B4`–`R1-B6` | Fixed: one-click isolated samples, 18 one-to-one passing claims, read-only exact evidence, no paid/dead link, designed 404, and complete route metadata passed. |
| `R1-M1`–`R1-M3`, `R1-D1`, `R1-S1` | Fixed: shared shell, plain first screen, controlled terms, reset/isolation, real routes, keyboard, responsive layout, and reduced motion passed. |
| `F-2-1`–`F-2-10` | Fixed: query offline reload, correct hold/warning language, network guard, device and album gates, tracking/cache checks, build outputs, clear copy, and copy audit passed. |
| `F-3-1`–`F-3-2` | Fixed: missing export-note warning is claimed/tested; locked package compilation uses Rust 1.85.0. |
| `F-4-1`–`F-4-6` | Fixed: accurate cache disclosure, exact byte checks, emitted evidence fields, browser/CLI parity, safe temporary output, and warning de-duplication passed. |
| `F-5-1`–`F-5-2` | Fixed: browser history restoration and static-cache disclosure remain verified by the browser/claim suites. |
| Review 6 | No finding remains; no regression observed. |
| Review 7 200% phone text resize | Fixed: all five live routes stayed at 390 px width with Privacy visible. |

## Candidate and deployment match

`d4536a1` is the last product implementation commit. `0da02fb` changes only reports and handoff; `89ff9ab` changes only pre-existing Graphify output. There are no product, claim, package, README, design, or demo changes after the candidate.

SHA-256 values from the clean candidate build exactly match live `/`, `/demo/`, `/privacy/`, `/terms/`, `/404.html`, and `/sw.js`; see `/work/.evidence/review8-live/hashes.txt`. Later report-only and Graphify commits therefore do not require a new product deployment.

## Result

**PASS — 0 findings, 0 untested claims.**
