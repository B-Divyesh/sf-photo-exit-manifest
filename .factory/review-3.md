# Adversarial first-read review 3 — FAIL

**Reviewed:** 2026-08-28 UTC

**Candidate:** `1d3201a241f90a9b5908768ad6ad1439f07119b4`

**Live URL:** `https://photo-exit-manifest.sociobot.in/`
**Review mode:** fresh Chromium contexts at 390×844 and 1366×900; separate clean clone for all commands

## Verdict

**FAIL.** The first screen, demos, live structure, accessibility, and all 16 registered claim commands pass. Two claim-gate defects remain: one README promise is absent from the registry, and the minimum-Rust-version test checks only a declaration rather than compatibility. Both leave a public claim untested and are BLOCKING under this review contract.

## Cold first read

I opened the live home page cold in separate fresh contexts, at `scrollY = 0`, before interacting or scrolling.

| Question | 390×844 phone | 1366×900 desktop |
| --- | --- | --- |
| What does this do? | It verifies a family photo archive before the family leaves Google Photos. | Same answer. |
| For whom? | Families moving photos from Google Photos to their own archive. | Same answer. |
| What should I click first? | **Try it with sample data** to see a completed audit and signed migration report. | Same answer. |

The exact first-screen copy providing those answers was:

> **Verify your family photo archive before leaving the cloud**
>
> For families moving photos from Google Photos to their own archive.
>
> **Try it with sample data** — See a completed audit and signed migration report.

The three facts—**“Does not change source folders,” “No photos uploaded,”** and **“Free command-line tool”**—were also above the fold at both sizes. The live page returned HTTP 200 and produced no console or page errors.

## Copy audit

Counts collapse whitespace and count whitespace-delimited tokens. Hyphenated words and file tokens count once. Markdown links use their visible text. Commands, code blocks, and filename-only lists are not prose sentences and were exercised separately. No sentence exceeds 22 words. No banned marketing adjective, inconsistent product term, contextless heading, or non-result-naming action was found.

### Landing-page prose

| Words | Exact text |
| ---: | --- |
| 9 | Verify your family photo archive before leaving the cloud |
| 8 | See a completed audit and signed migration report. |
| 11 | For families moving photos from Google Photos to their own archive. |
| 5 | The audit compares the evidence. |
| 8 | The signed migration report records the reviewed result. |
| 13 | Read file sizes, dates, album labels, edited files, media types, and SHA-256 hashes. |
| 4 | Match exact file bytes. |
| 8 | Name each missing item that your family accepts. |
| 14 | Record each device’s backup, deletion, conflict, and offline choices before switching from Google Photos. |
| 11 | The sample has six items, five matches, and one explained exception. |
| 13 | The sample command creates its own temporary workspace and prints the report location. |
| 16 | The scanner reads the JSON file beside a photo and keeps album labels from duplicate copies. |
| 14 | Missing items, missing album labels, or unsafe retention settings keep the report on hold. |
| 7 | Edited-looking files appear as warnings to review. |
| 4 | Commands need no prompts. |
| 9 | Add --json for machine-readable status and stable exit codes. |
| 10 | The CLI does not move, edit, restore, or delete photos. |
| 9 | It does not send archive data over the network. |
| 15 | A ready report is evidence to review, not permission to delete your old cloud library. |
| 8 | Read the privacy policy or read the terms. |
| 4 | SHA-256 compares file bytes. |
| 6 | Named exceptions explain each accepted difference. |
| 5 | 2 sides source and archive. |
| 6 | 5 files form the migration report. |
| 9 | Checks a Google Photos export against your family archive. |

The conditional and accessibility copy also passes:

| Words | Exact text |
| ---: | --- |
| 2 | You’re offline. |
| 7 | This page and the sample remain available. |
| 12 | Warm photo frames cross three verification layers into a cyan archive vault. |
| 3 | Install command copied |
| 6 | Select the command to copy it |

### Landing headings, labels, and actions

| Words | Exact text |
| ---: | --- |
| 4 | Local photo archive check |
| 3 | How it works |
| 5 | Check your archive before switching. |
| 3 | Inventory both folders |
| 3 | Explain every difference |
| 4 | Sign the migration report |
| 2 | Bundled sample |
| 5 | See the finished check first. |
| 3 | Run it locally |
| 5 | Start with one sample command. |
| 4 | Reads Google export notes |
| 4 | Stops on missing decisions |
| 3 | Works in scripts |
| 3 | Privacy and limits |
| 5 | Your family controls every change. |
| 4 | Use the bundled example |
| 7 | Run the check before touching your photos. |
| 5 | Does not change source folders |
| 3 | No photos uploaded |
| 3 | Free command-line tool |
| 5 | Try it with sample data |
| 5 | Open the full sample audit |
| 3 | Copy install command |

All headings remain intelligible out of context. The actions name their result. SHA-256 is immediately explained as comparing file bytes; JSON and exit-code terms appear only in the command-line section. The controlled terms remain: **audit** for the comparison result, **signed migration report** for the five output files, **switch from Google Photos** for the event, **named exception** for an accepted difference, **family archive** for the destination, and **demo** for the sample experience.

### README prose

| Words | Exact text |
| ---: | --- |
| 12 | Photo Exit Manifest checks a Google Photos export against a family archive. |
| 9 | It records the result in a signed migration report. |
| 8 | The CLI reads local folders without changing them. |
| 10 | It does not move, edit, restore, delete, or upload photos. |
| 8 | Run the sample to see a finished audit. |
| 7 | The command creates a new temporary workspace. |
| 14 | It copies the fixtures there, runs the normal audit, and prints the report path. |
| 7 | The workspace contains six unique source items. |
| 4 | Five match the archive. |
| 7 | One missing video has a named exception. |
| 7 | You can also open the browser demo. |
| 10 | It uses bundled data and stores nothing in your browser. |
| 9 | Create a policy file, then review its device choices. |
| 4 | Run the complete check. |
| 7 | The output folder contains these five files. |
| 13 | A report is ready only when every source item is matched or explained. |
| 9 | Every missing album label also needs a reviewed resolution. |
| 9 | An unsigned or held report exits with code 2. |
| 10 | Invalid input or an I/O failure exits with code 1. |
| 6 | exceptions.json records accepted differences by name. |
| 6 | SHA-256 is the default comparison mode. |
| 16 | The scanner also reads adjacent Google Photos export notes and keeps album labels from duplicate copies. |
| 6 | Use --hash none only for planning. |
| 11 | That mode compares filenames, byte sizes, and capture times where available. |
| 9 | Edited-looking files and missing export notes appear as warnings. |
| 9 | Review those items before changing the old cloud library. |
| 4 | Every command is non-interactive. |
| 5 | Add --json for machine-readable status. |
| 6 | Build the single binary from source. |
| 7 | The crate supports Rust 1.85 or newer. |
| 6 | The Vite site builds to dist/site/. |
| 7 | The packaged Linux binary builds to dist/package/. |
| 10 | The CLI has no account, paid feature, or network connection. |
| 8 | The website uses no analytics or third-party scripts. |
| 6 | Deploy dist/site/ as the static root. |
| 8 | Version 0.1.0 is licensed under the MIT License. |
| 2 | See CHANGELOG.md. |

README headings are **“Photo Exit Manifest”** (3), **“Try the bundled sample”** (4), **“Run an archive check”** (4), **“Review differences”** (2), **“Use it in scripts”** (4), **“Install”** (1), **“Develop and verify”** (3), and **“Deploy”** (1). Each is meaningful out of context. Technical words occur in the installation and scripting instructions where their concrete commands or effects explain them.

## Demo and sandbox

- One click on the first-screen action reached canonical `/demo/` and immediately displayed the Morgan family archive check: ready to review, 6 source items, 5 exact matches, 1 named exception, and 0 unexplained items.
- The persistent banner read **“Demo — sample data, nothing is saved”** and included **Reset demo** and **Start for real**.
- Reset closed both disclosures, changed the status to **“Sample restored. No browser or family data changed.”**, and focused the h1.
- A seeded `localStorage["real:sentinel"] = "keep"` survived demo entry, reset, offline reload, and offline re-entry unchanged. The demo added no local/session storage, cookies, IndexedDB, or OPFS data. Its service worker retained only the versioned static shell needed for the documented offline behavior.
- All 39 observed browser requests were same-origin. After the worker took control, `/demo/` reloaded offline and `/?demo=1` again resolved to `/demo/` while offline.
- The clean-clone CLI demo ran in `/tmp/photo-exit-review3-demo-YWPd8K`, returned `ready_for_cutover` and 100%, created only the demo workspace/report beside an unchanged sentinel, and wrote the documented five report files.

## Claim results

I cloned the candidate into `/tmp/photo-exit-review3-clean-aEiRI2/repo`, confirmed a clean checkout at `1d3201a`, ran `npm ci`, and ran every `test` string from `.factory/claims.json` separately.

| Claim ID | Result | Observable evidence |
| --- | --- | --- |
| `demo-isolation` | PASS | New output workspace; sibling family-data sentinel unchanged |
| `migration-report` | PASS | Ready, signed, 100%; exact five report files |
| `named-exception-gate` | PASS | Removing the item exception produced exit 2/hold |
| `takeout-evidence` | PASS | SHA-256, export note/date, album label, and edit marker recorded |
| `readiness-rules` | PASS | Item, album, and retention holds; edit remains a warning |
| `read-only-local` | PASS | Input digests unchanged; runtime socket guard logged no attempt |
| `device-policy-report` | PASS | Two devices and all four choices in JSON and Markdown |
| `album-exception-gate` | PASS | Album-only gap held until its named resolution |
| `no-tracking` | PASS | Explicit static allowlist; no tracking stores or beacons on five routes |
| `free-cli` | PASS | Complete demo without an account, credential, or licence |
| `scriptable-cli` | PASS | Non-interactive help, JSON, exit 0, and invalid-input exit 1 |
| `planning-mode` | PASS | Hash-free planning, five conservative matches, held result |
| `package-contract` | PASS but incomplete | Metadata declares MIT, Rust 1.85, and one binary; no Rust 1.85 compile occurs (F-3-2) |
| `build-artifacts` | PASS | Built site and executable at the documented paths |
| `offline-reload` | PASS | Documented entry, canonical redirect, offline reload, offline re-entry |
| `route-contract` | PASS | Four distinct routes and an HTTP 404 unknown route |

Each claim ID appears on exactly one tagged test. Most public claims map cleanly: local/privacy promises map to `read-only-local` and `no-tracking`; sample/report facts map to `demo-isolation`, `migration-report`, and `takeout-evidence`; readiness and exception rules map to `named-exception-gate`, `readiness-rules`, and `album-exception-gate`; device behavior maps to `device-policy-report`; command/build statements map to `free-cli`, `scriptable-cli`, `planning-mode`, and `build-artifacts`; offline and route behavior map to `offline-reload` and `route-contract`. F-3-1 and F-3-2 record the two exceptions.

## Earlier findings rechecked

I reread `.factory/review-1.md`, `.factory/polish-1.md`, `.factory/review-2.md`, `.factory/polish-2.md`, the prior handoff, and both verification reports. Review 1 had no IDs, so the stable IDs assigned in polish 1 are used.

| Earlier ID | Current result | Fresh live/code confirmation |
| --- | --- | --- |
| `R1-B1` | Fixed | Browser and CLI demos remain realistic, one-click, resettable, and isolated. |
| `R1-B2` | Regressed / BLOCKING | Sixteen registered commands pass, but one public promise is unregistered and one registered test does not exercise its promise; see F-3-1 and F-3-2. |
| `R1-B3a` | Fixed | Read-only, local, hash, free-use, report, and exception claims remain registered and tested. |
| `R1-B3b` | Fixed | Inventory, exact matching, device decisions, and report output are tested against generated files. |
| `R1-B3c` | Fixed | Planning, exit-code, Takeout, album, warning, and readiness behavior remains registered and passing. |
| `R1-B3d` | Fixed | No paid tier, price, purchase copy, or checkout link remains. |
| `R1-B3e` | Regressed / BLOCKING | The README’s missing-export-note warning is outside the registry, and its Rust 1.85 promise is not exercised at that version; see F-3-1 and F-3-2. |
| `R1-B4` | Fixed | Full live crawl found no dead purchase or other link. |
| `R1-B5` | Fixed | `/definitely-not-a-route` returned HTTP 404 and the designed archive-path page. |
| `R1-B6` | Fixed | Every route retains canonical, OG/Twitter, favicon, touch icon, description, and distinct title. |
| `R1-M1` | Fixed | Header/footer link sets, purpose line, legal links, factory credit, and version are consistent. |
| `R1-M2` | Fixed | The job, audience, one primary action, outcome, and three facts remain above the fold. |
| `R1-M3` | Fixed | Audit/report/switch/exception/archive/demo terminology remains consistent. |
| `R1-D1` | Fixed | Reset and browser isolation pass; CLI writes only below a new workspace. |
| `R1-S1` | Fixed | Deep links, focus, back/forward, 404, mobile, targets, and reduced motion remain working. |
| `F-2-1` | Fixed | The documented query entry canonicalizes and works again offline. |
| `F-2-2` | Fixed | Live copy separates blocking conditions from non-blocking edit warnings. |
| `F-2-3` | Fixed | The tagged CLI test uses a runtime socket deny/log guard and records zero attempts. |
| `F-2-4` | Fixed | Device-policy claim/test inspects two devices and all four decisions. |
| `F-2-5` | Fixed | Album-only gap and named-resolution transitions are registered and tested. |
| `F-2-6` | Fixed | The no-tracking test uses an endpoint allowlist and storage/beacon checks. |
| `F-2-7` | Fixed | Build outputs are registered/tested; unprovable factory-ownership copy remains absent. |
| `F-2-8` | Fixed | “Quickest” is absent; README says “Run the sample to see a finished audit.” |
| `F-2-9` | Fixed | The folder, command-line, and named-exception labels remain clear. |
| `F-2-10` | Fixed | Regenerating the copy audit produced no diff and retained correct counts. |

All other earlier findings remain fixed. `R1-B2` and `R1-B3e` reopen through the two blocking claim gaps below.

## Structure, accessibility, and visual identity

- `/`, `/demo/`, `/privacy/`, `/terms/`, and `/404.html` each returned 200. An unknown route returned 404 with **“This archive path leads nowhere.”**
- Every route has `lang="en"`, one h1, one main landmark, a route-specific title of 26–44 characters, a description of 53–111 characters, canonical URL, OG/Twitter metadata, the 1200×630 social image, SVG favicon, and Apple touch icon.
- `robots.txt` points to a sitemap listing all four real routes. Live responses include the intended CSP, HSTS, `nosniff`, referrer policy, and permissions policy.
- The complete live crawl covered 13 distinct links, including all hash targets and the GitHub source link. Every destination returned 200; all hash targets existed.
- Same-origin navigation focused the destination h1. Back and forward restored the correct route and h1 focus; the home scroll position was restored. The polite route-status region remains present.
- Live axe checks found 0 violations at 390×844 and 1366×900 on all five pages. The URL verifier reported one h1, `lang=en`, a main landmark, complete image alt text/button names, and zero console errors. At 320px, all four real routes had no horizontal overflow and no sub-44px link or button.
- The full clean-clone suite passed: 7 Rust unit tests, 4 CLI integration tests, 4 site contract tests, 1 PWA test, 4 browser tests, and 16 claim tests. `npm run build`, `cargo fmt --check`, and strict Clippy passed. The built entry JavaScript totals about 2.55 KB raw, below the first-load budget.
- SHA-256 hashes for live and locally built home, demo, privacy, terms, 404, and service-worker files matched exactly.
- The asymmetric midnight archive landscape, amber photo frames, cyan verification path, self-hosted Instrument Sans/IBM Plex Mono pairing, and glass evidence surfaces follow `.factory/design.md` and are recognizably product-specific rather than a generic SaaS template.

## Missed leverage

No finding. The brief calls for local Takeout/folder inventory, comparison, device policies, and JSON/Markdown report export; all are present. Two-way sync is an explicit non-goal. An AI step would not improve the deterministic local evidence job, and no decorative AI or provider key is present.

## Findings

### BLOCKING F-3-1 — the missing-export-note warning is an unlisted claim

**Reopens:** `R1-B2` and `R1-B3e`.

**Exact quote/location:** README, “Review differences”: **“Edited-looking files and missing export notes appear as warnings.”**

**Observed:** `takeout-evidence` says the scanner records Google export notes and edited-file warnings; it does not claim a warning when an export note is absent. Its tagged test asserts one found sidecar and an `edited_version` flag. `readiness-rules` asserts the edited-file warning only. No registered test asserts the missing-note warning. A manual demo run did produce **“Some Takeout assets have no readable JSON sidecar; capture dates or provider edits may be unavailable.”**, so the implementation currently behaves as described, but the public promise can regress while all 16 claim commands remain green.

**Why this misleads:** a family may rely on the warning to identify incomplete Google Takeout metadata before changing the old library. The required claim gate does not protect that behavior.

**Concrete fix:** either remove “and missing export notes” from the README, or extend `takeout-evidence` to say that absent export notes produce a warning and assert the exact warning in `source-inventory.json` or `audit.json` using a fixture with a missing sidecar.

### BLOCKING F-3-2 — Rust 1.85 compatibility is declared, not tested

**Reopens:** `R1-B2` and `R1-B3e`.

**Exact quote/location:** README, “Install”: **“The crate supports Rust 1.85 or newer.”** `.factory/claims.json`, `package-contract`: **“The package is an MIT-licensed single CLI with Rust 1.85 as its minimum version.”**

**Observed:** `@claim:package-contract` reads Cargo metadata and asserts `rust_version === "1.85"`. All builds in this review used `rustc 1.98.0`. The claim test never compiles or tests the locked package with Rust 1.85, so newer language/library features or a dependency MSRV increase would not fail this gate.

**Why this misleads:** a user on the advertised minimum toolchain can satisfy the documented prerequisite and still discover that the package does not build.

**Concrete fix:** make the registered command run `cargo +1.85.0 build --locked` (or a pinned Rust 1.85 container) before the metadata assertions. Keep the README claim only while that job passes.

## What would make this perfect

Register and assert the missing-export-note warning, and compile the locked package on Rust 1.85 in the package-contract test. Then rerun every claim command and the full cold-browser review; nothing else needs adjustment.
