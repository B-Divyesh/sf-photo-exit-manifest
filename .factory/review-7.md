# Verify a family photo archive before leaving the cloud — review 7 — FAIL

**Reviewed:** 2026-09-06 UTC

**Implementation candidate:** `daec7e8593306c841eb4aa4d1072aac02fc4da61`

**Documentation baseline:** `9dcc258b65c77da68efefa99406c6a557972365b`

**Checkout baseline:** `275a6463f0c98433743e51b7ab62595eea4d2c1f`

**Live URL:** <https://photo-exit-manifest.sociobot.in/>

**Review mode:** fresh Chromium phone and desktop contexts, plus a clean detached worktree and clean CLI install root

## Verdict

**FAIL.** One major finding remains. There are no other findings and no untested public claims.

Finding count: **1**. Untested claim count: **0**.

The one-click sample, CLI output, privacy boundary, offline behavior, routes, claims, clean build, and installed artifact all pass. The product fails the required 200% text-resize check on a phone viewport.

## Job, audience, and first action

I opened `/` in separate fresh 390×844 and 1440×900 contexts. I recorded these answers at `scrollY = 0` before scrolling or interacting:

| Question | Phone | Desktop |
| --- | --- | --- |
| What is the job? | Verify a family photo archive before leaving a cloud service. | Same answer. |
| Who is it for? | Families moving photos from Google Photos to their own archive. | Same answer. |
| What should happen first? | Select **Try it with sample data** to see a completed audit and signed migration report. | Same answer. |

The live h1 is **“Verify your family photo archive before leaving the cloud.”** The audience sentence names families, Google Photos, and their own archive. The primary action and its outcome appear above the fold at both sizes. The three facts—**Does not change source folders**, **No photos uploaded**, and **Free command-line tool**—also appear above the fold. There was no normal-size overflow, console error, page error, or third-party request.

Evidence: `/work/.evidence/review7-live/first-screen-phone.png`, `/work/.evidence/review7-live/first-screen-desktop.png`, and `/work/.evidence/review7-live/live-browser.json`.

## Finding

### Major — Text resized to 200% causes horizontal overflow on a phone

At the live home page in a fresh 390×844 context, I set the root text size to 200%, the standard boundary required by the attached accessibility contract. The document widened from 390 CSS pixels to 504 CSS pixels. The header navigation extended to x=504, placing the **Privacy** link outside the visible viewport. The oversized hero art also extended beyond the viewport. The page therefore requires horizontal movement and does not preserve the mobile layout when text is enlarged.

This is not the expected deliberate 404 and is not an axe false positive. It is an observable responsive-layout failure. The normal 390 px page has no overflow, and axe reports no rule violations, but those results do not cover text enlargement.

Evidence:

- `/work/.evidence/review7-live/live-browser.json` records `clientWidth: 390`, `scrollWidth: 504`, and the off-screen navigation bounds.
- `/work/.evidence/review7-live/text-resize-200-phone.png` shows the enlarged layout.
- The failing boundary is caused by the header not wrapping or collapsing at the enlarged size. The report does not prescribe a product-code change because this work order forbids code changes.

## Sample and data isolation

The first-screen action entered canonical `/demo/` in one click. The first demo viewport already showed:

- **Demo — sample data, nothing is saved** in a sticky banner;
- **Ready to review**;
- six source items, five exact matches, one named exception, and zero unexplained items;
- six realistic Morgan family rows;
- a report signed by **Morgan family**;
- the five documented output files.

The banner remained at the top after scrolling. **Reset demo** closed the open disclosure, restored the sample status, and focused the demo h1. **Start for real** opened `/#install`.

Before entering the demo, I seeded a `real:family` local-storage value, a `real:session` session value, a `real-family` cookie, and a `real-family` IndexedDB database. Entry, reset, offline reload, and offline query re-entry left all four unchanged. The demo added no user-data store. Cache Storage contained one versioned cache with exactly 16 documented, query-free static app files. Every observed request was same-origin.

The online demo reloaded while offline. The documented `/?demo=1` entry also canonicalized to `/demo/` while offline.

Evidence: `/work/.evidence/review7-live/demo-phone.png` and `/work/.evidence/review7-live/live-browser.json`.

## Declared claims

From clean detached worktree `/tmp/photo-exit-review7-clean.mHJURS/repo`, I ran `npm ci` and then ran every exact `test` string in `.factory/claims.json` separately. All 18 passed.

| Claim | Result | Observed evidence |
| --- | --- | --- |
| `demo-isolation` | PASS | Automatic child workspace; sibling data unchanged; exact report files. |
| `migration-report` | PASS | Ready status, signer, 100%, and five-file report. |
| `named-exception-gate` | PASS | Removing the item exception produced exit 2 and hold. |
| `takeout-evidence` | PASS | Names, bytes, dates, hashes, export note, albums, edit flag, and unique warnings. |
| `exact-byte-matching` | PASS | Five SHA-256 matches; same-name and same-size different bytes rejected. |
| `demo-content` | PASS | Browser status, 6/5/1/0 totals, rows, signer, and files matched fresh CLI output. |
| `readiness-rules` | PASS | Missing item, missing album, and unsafe retention held; edit remained a warning. |
| `read-only-local` | PASS | Input digests unchanged; compiled IPv4/IPv6 socket guard saw no attempt. |
| `device-policy-report` | PASS | Two devices and all four choices appeared in JSON and Markdown. |
| `album-exception-gate` | PASS | Album-only gap held until its named reviewed resolution. |
| `no-tracking` | PASS | Route/resource/cache allowlist; no cookies, user stores, beacons, or third-party requests. |
| `free-cli` | PASS | Complete sample ran without account, key, licence, or paid feature. |
| `scriptable-cli` | PASS | Closed-input paths, JSON output, exit 0, and invalid-input exit 1. |
| `planning-mode` | PASS | Hash-free evidence made five conservative matches and stayed on hold. |
| `package-contract` | PASS | All locked targets compiled under Rust 1.85; MIT metadata; one binary. |
| `build-artifacts` | PASS | Static site and packaged Linux executable appeared in documented paths. |
| `offline-reload` | PASS | Demo and query entry reopened offline in a fresh context. |
| `route-contract` | PASS | Four real routes and the designed HTTP 404 behaved as declared. |

Each claim ID maps to exactly one tagged test. I re-read the landing page, legal pages, README, demo documentation, package metadata, and CLI help. Their factual statements map to these claims. No missing, false, incomplete, or untested public claim was found.

## CLI and clean consumer checks

The documented prerequisite installation and all aggregate commands ran from the clean worktree:

- `npm test`: PASS — 8 Rust unit tests, 4 CLI integration tests, 4 route/contract tests, 1 PWA test, 4 browser tests, and 18 claim tests.
- `npm run build`: PASS — produced `dist/site/` and `dist/package/photo-exit-manifest-linux-x86_64`.
- `npm run audit:copy`: PASS — 25 landing and 38 README sentences; no generated diff.
- `cargo fmt --check`: PASS.
- `cargo clippy --all-targets -- -D warnings`: PASS.
- `cargo package --allow-dirty`: PASS — package verified after compiling its contents.

I installed the artifact with `cargo install --path . --root <new install root> --locked`. From a minimal environment, the installed `photo-exit-manifest 0.1.0` binary displayed useful help and completed `demo --json` with `ready_for_cutover`. It created only a new directory below the isolated `TMPDIR` and wrote the five report files. A missing input returned exit 1 with a concrete error. A demo directed at an existing output path returned exit 1 and did not overwrite it.

Normal, invalid, boundary, and recovery behavior is therefore exercised for the installed CLI. There is no backend, tenant, server-side product state, health endpoint, restart-persistence promise, or live rate-limit surface for this static site and local CLI.

## Live routes, accessibility, privacy, and performance

- `/`, `/demo/`, `/privacy/`, `/terms/`, and `/404.html` returned 200 with distinct titles, one h1, and shared header/main/footer structure.
- `/review-7-no-such-route` deliberately returned HTTP 404 with the designed **“This archive path leads nowhere”** page and a working way home. This expected 404 is a pass.
- Direct routes, internal links, the GitHub source link, social image, and touch icon resolved successfully.
- Route changes focused the new h1. A real pointer navigation to Privacy followed by Back restored home scroll from 700 to 700 and focused the home h1.
- Keyboard Tab focused the skip link. Its live focus ring is 3 px frost. All normally visible links, buttons, and disclosures measured at least 44×44 px.
- Reduced motion changed smooth scrolling to `auto` and transitions to 0.01 ms.
- Playwright axe found zero violations on all five designed pages at 390 px and 1366 px. The factory URL verifier found zero console errors, one h1, `lang=en`, a main landmark, complete image alt text, and named buttons.
- The only accessibility failure is the separate 200% text-resize finding above.
- Response headers include HSTS, `nosniff`, strict-origin referrer policy, permissions policy, and a same-origin CSP with `frame-ancestors` in the response header.
- `robots.txt` points to a sitemap listing all four public routes.
- The site made same-origin requests only. No analytics, advertising, cookies, user storage, beacons, external fonts, or third-party scripts appeared during clean flows.
- Mobile Lighthouse: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 1.1 s, LCP 1.5 s, TBT 0 ms, CLS 0.022; total transfer 125 KiB.
- Built assets remain within budget: home JavaScript is about 3.4 KB raw, CSS 21.7 KB, fonts 45.0 KB, and hero art 71.8 KB.

Evidence: `/work/.evidence/review7-live/verify.json`, `/work/.evidence/review7-live/lighthouse.json`, and `/work/.evidence/review7-live/live-browser.json`.

## Earlier finding disposition

I read reviews 1–6, verifications, polish reports, and the prior handoff. Every earlier finding, including minor findings, remains fixed. The new text-resize issue was not listed in those rounds.

| Earlier ID | Current disposition | Review 7 evidence |
| --- | --- | --- |
| `R1-B1` | Fixed | One-click browser sample and installed CLI demo remain realistic and isolated. |
| `R1-B2` | Fixed | Registry has 18 one-to-one tagged tests; every command passed separately. |
| `R1-B3a` | Fixed | Read-only/network, exact-byte, free-use, report, and exception claims passed. |
| `R1-B3b` | Fixed | Inventory fields, matching, device choices, and five-file report were inspected. |
| `R1-B3c` | Fixed | Planning, JSON/exit codes, export notes, album gates, warnings, and readiness passed. |
| `R1-B3d` | Fixed | No paid tier, price, licence UI, payment provider, or checkout link is present. |
| `R1-B3e` | Fixed | README operational statements map to passing registered claims. |
| `R1-B4` | Fixed | Dead checkout remains absent; current live links passed. |
| `R1-B5` | Fixed | Unknown route returns the designed page with HTTP 404. |
| `R1-B6` | Fixed | Route titles, descriptions, canonicals, social metadata, favicon, and touch icon are live. |
| `R1-M1` | Fixed | Shared header/footer, legal links, purpose, factory credit, and version remain. |
| `R1-M2` | Fixed | Job, audience, one primary sample action, outcome, and three facts fit both first screens. |
| `R1-M3` | Fixed | Audit/report/switch/exception/archive/demo terms remain consistent. |
| `R1-D1` | Fixed | Browser sentinels survived; reset restored focus; CLI wrote only in its new workspace. |
| `R1-S1` | Fixed | Real routes, normal-size mobile layout, focus, history, legal pages, targets, and reduced motion passed. |
| `F-2-1` | Fixed | `/?demo=1` canonicalized and reopened offline. |
| `F-2-2` | Fixed | Copy and output separate hold conditions from edit warnings. |
| `F-2-3` | Fixed | Runtime socket guard covered demo and full run with zero attempts. |
| `F-2-4` | Fixed | Both report formats contain two devices and all four policy choices. |
| `F-2-5` | Fixed | Album-only gap changed from hold to ready only after a named resolution. |
| `F-2-6` | Fixed | Resource/cache allowlist and storage/beacon checks passed locally and live. |
| `F-2-7` | Fixed | Site and executable output paths were produced; unsupported ownership copy stays absent. |
| `F-2-8` | Fixed | Sample instruction remains factual and the sample output matches the CLI. |
| `F-2-9` | Fixed | Folder, command-line, and named-exception labels remain clear. |
| `F-2-10` | Fixed | The copy audit regenerated with 25/38 sentences and no diff. |
| `F-3-1` | Fixed | Missing-export-note warning is registered and asserted exactly. |
| `F-3-2` | Fixed | All locked package targets compiled under Rust 1.85.0. |
| `F-4-1` | Fixed | README/privacy distinguish family data from the disclosed static cache. |
| `F-4-2` | Fixed | SHA-256 test rejects same-name and same-size byte differences. |
| `F-4-3` | Fixed | Advertised inventory fields match emitted fields and fixture data. |
| `F-4-4` | Fixed | Browser sample status, totals, rows, signer, and files match fresh CLI output. |
| `F-4-5` | Fixed | Default demo path is a new child below isolated `TMPDIR`; sibling data is preserved. |
| `F-4-6` | Fixed | Warning set is unique in JSON and Markdown output. |
| `F-5-1` | Fixed | Real pointer navigation restored scroll 700→700 and focused the h1. |
| `F-5-2` | Fixed | Privacy and README disclose the static app/sample cache accurately. |

Review 6 had no findings. Its zero-finding result is superseded only by the newly exercised 200% text-resize boundary.

## Candidate and live version

`git diff daec7e8..275a646` shows only `.factory` reports/handoff and Graphify output. There are no product, README, claim, design, demo, or copy-audit changes after implementation commit `daec7e8593306c841eb4aa4d1072aac02fc4da61`. Documentation baseline `9dcc258b65c77da68efefa99406c6a557972365b` added review 6; checkout commit `275a6463f0c98433743e51b7ab62595eea4d2c1f` is Graphify-only.

SHA-256 values match between the clean build and live `/`, `/demo/`, `/privacy/`, `/terms/`, `/404.html`, and `/sw.js`. The live `Last-Modified` value is 2026-08-28 16:17:33 UTC, matching the last implementation deployment. No fresh product image is required for the later report-only and Graphify commits.

## Scope and missed feature check

The deterministic local CLI covers inventory, exact comparison, named exceptions, device policies, and signed JSON/Markdown output. Transfer, hosting, facial recognition, and two-way sync remain explicit non-goals. An AI step would weaken the local evidence model and is not an obvious missing part of this job. No backend, database, billing path, or AI gateway is present or needed.

## Result

**FAIL — 1 major finding, 0 untested claims.** Fix and test the 200% text-resize layout before declaring PASS.
