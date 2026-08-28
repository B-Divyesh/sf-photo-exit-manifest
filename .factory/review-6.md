# Adversarial first-read review 6 — PASS

**Reviewed:** 2026-08-28 UTC

**Candidate:** `752baf29eb9f02d020cbd3b87c596ab8137bef66`

**Live URL:** <https://photo-exit-manifest.sociobot.in/>

**Review mode:** fresh Chromium contexts at 390×844 and 1440×900; clean clone for every claim command

## Verdict

**PASS.** Zero blocking or minor findings remain, and no public product claim is untested. The cold first screen, browser and CLI demos, storage isolation, offline behavior, claims, routing, copy, accessibility, visual identity, and every earlier finding verify against the live deployment and candidate code.

## Cold first read

I opened the live home page cold in separate fresh contexts, at `scrollY = 0`, before scrolling or interacting.

| Question | 390×844 phone | 1440×900 desktop |
| --- | --- | --- |
| What does this do? | It verifies a family photo archive before the family leaves Google Photos or another cloud. | Same answer. |
| For whom? | Families moving photos from Google Photos to their own archive. | Same answer. |
| What should I click first? | **Try it with sample data** to see a completed audit and signed migration report. | Same answer. |

The exact first-screen copy supplying those answers was:

> **Verify your family photo archive before leaving the cloud**
>
> For families moving photos from Google Photos to their own archive.
>
> **Try it with sample data** — See a completed audit and signed migration report.

The three facts—**“Does not change source folders,” “No photos uploaded,”** and **“Free command-line tool”**—also appeared above the fold at both sizes. There was no overflow, console error, page error, or third-party request. The first-read requirement passes.

## Copy audit

Counts collapse whitespace and use whitespace-delimited tokens. Hyphenated words and file tokens count once. Markdown links use their visible text. Commands, code blocks, and filename-only lists are excluded from sentence counts and were exercised separately. Regenerating the audit in the clean clone produced no diff.

### Landing-page sentences

| Words | Exact text |
| ---: | --- |
| 9 | Verify your family photo archive before leaving the cloud |
| 8 | See a completed audit and signed migration report. |
| 11 | For families moving photos from Google Photos to their own archive. |
| 5 | The audit compares the evidence. |
| 8 | The signed migration report records the reviewed result. |
| 13 | Record file names, byte sizes, dates, album labels, edit warnings, and SHA-256 hashes. |
| 4 | Match exact file bytes. |
| 8 | Name each missing item that your family accepts. |
| 14 | Record each device’s backup, deletion, conflict, and offline choices before switching from Google Photos. |
| 11 | The sample has six items, five matches, and one explained exception. |
| 13 | The sample command creates its own temporary workspace and prints the report location. |
| 16 | The scanner reads the JSON file beside a photo and keeps album labels from duplicate copies. |
| 14 | Missing items, missing album labels, or unsafe retention settings keep the report on hold. |
| 7 | Edited-looking files appear as warnings to review. |
| 4 | Commands need no prompts. |
| 9 | Add `--json` for machine-readable status and stable exit codes. |
| 10 | The CLI does not move, edit, restore, or delete photos. |
| 9 | It does not send archive data over the network. |
| 15 | A ready report is evidence to review, not permission to delete your old cloud library. |
| 8 | Read the privacy policy or read the terms. |
| 4 | SHA-256 compares file bytes. |
| 6 | Named exceptions explain each accepted difference. |
| 5 | 2 sides source and archive. |
| 6 | 5 files form the migration report. |
| 9 | Checks a Google Photos export against your family archive. |

Conditional and accessibility copy:

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

Every heading works out of context. Actions name the resulting destination or result. SHA-256 is immediately explained as comparing file bytes; JSON and exit codes appear only with command-line instructions. Terminology remains consistent: **audit** is the comparison, **signed migration report** is the five-file output, **named exception** is an accepted difference, **family archive** is the destination, and **demo** is the sample experience.

### README sentences

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
| 8 | The demo does not store your family data. |
| 11 | Its offline cache keeps the static app and bundled sample page. |
| 9 | Create a policy file, then review its device choices. |
| 4 | Run the complete check. |
| 7 | The output folder contains these five files. |
| 13 | A report is ready only when every source item is matched or explained. |
| 9 | Every missing album label also needs a reviewed resolution. |
| 9 | An unsigned or held report exits with code 2. |
| 10 | Invalid input or an I/O failure exits with code 1. |
| 6 | `exceptions.json` records accepted differences by name. |
| 6 | SHA-256 is the default comparison mode. |
| 16 | The scanner also reads adjacent Google Photos export notes and keeps album labels from duplicate copies. |
| 6 | Use `--hash none` only for planning. |
| 11 | That mode compares filenames, byte sizes, and capture times where available. |
| 9 | Edited-looking files and missing export notes appear as warnings. |
| 9 | Review those items before changing the old cloud library. |
| 4 | Every command is non-interactive. |
| 5 | Add `--json` for machine-readable status. |
| 6 | Build the single binary from source. |
| 7 | The crate supports Rust 1.85 or newer. |
| 6 | The Vite site builds to `dist/site/`. |
| 7 | The packaged Linux binary builds to `dist/package/`. |
| 10 | The CLI has no account, paid feature, or network connection. |
| 8 | The website uses no analytics or third-party scripts. |
| 6 | Deploy `dist/site/` as the static root. |
| 8 | Version `0.1.0` is licensed under the MIT License. |
| 2 | See `CHANGELOG.md`. |

README headings are **“Photo Exit Manifest”** (3), **“Try the bundled sample”** (4), **“Run an archive check”** (4), **“Review differences”** (2), **“Use it in scripts”** (4), **“Install”** (1), **“Develop and verify”** (3), and **“Deploy”** (1). Each makes sense out of context.

No sentence exceeds 22 words. No banned marketing adjective, unexplained first-screen jargon, inconsistent term, contextless heading, or non-result-naming product action remains. There are no copy findings and therefore no proposed rewrites.

## Demo and sandbox

- One click on the first-screen action reached canonical `/demo/`. The first demo viewport already showed a Morgan family audit, **Ready to review**, six source items, five exact matches, one named exception, zero unexplained items, and a signed report.
- The persistent banner read **“Demo — sample data, nothing is saved”** and included **Reset demo** and **Start for real**.
- Reset closed both disclosures, changed the status to **“Sample restored. No browser or family data changed.”**, and focused the demo h1.
- Seeded `real:` local/session values, a cookie, and a `real-family` IndexedDB database survived entry, reset, offline reload, and re-entry unchanged. The demo added no user-data store. Its only added storage was the documented `photo-exit-manifest-1aa84f9991aa` cache containing exactly 16 static, query-free app-shell URLs.
- Every observed request was same-origin. After the worker controlled the page, `/demo/` reloaded offline and the documented `/?demo=1` entry again canonicalized to `/demo/` while offline.
- The CLI `demo --json` ran inside an isolated temporary directory, returned `ready_for_cutover`, printed its generated report path, created the five documented files, and left a sibling family-data sentinel unchanged.
- The exact landing install command also succeeded in a new install root; the installed `0.1.0` binary completed `demo --json` without an account or credential.

The browser demo is static, so its isolated namespace contains no mutable sample or family records. Cache Storage contains only the disclosed app shell and bundled non-personal sample page.

## Claims

I cloned the candidate into `/tmp/photo-exit-review6-clean.fvQYx3/repo`, checked out the exact candidate commit, ran `npm ci`, and ran every `test` string from `.factory/claims.json` separately.

| Claim ID | Result | Observable evidence |
| --- | --- | --- |
| `demo-isolation` | PASS | Automatic child workspace; sibling sentinel unchanged; five report files |
| `migration-report` | PASS | Ready status, signer, 100%, exact five-file report |
| `named-exception-gate` | PASS | Removing the named item exception produced exit 2 and hold |
| `takeout-evidence` | PASS | Names, actual bytes, dates, hashes, note, album, edit flag, unique warnings |
| `exact-byte-matching` | PASS | Five SHA-256 matches; equal-name/equal-size different bytes rejected |
| `demo-content` | PASS | Browser status, 6/5/1/0 totals, rows, signer, and files matched fresh CLI output |
| `readiness-rules` | PASS | Item, album, and retention holds; edited file remained a warning |
| `read-only-local` | PASS | Source/destination digests unchanged; runtime IPv4/IPv6 socket guard logged no attempt |
| `device-policy-report` | PASS | Two devices and all four choices appeared in JSON and Markdown |
| `album-exception-gate` | PASS | Album-only gap held until a named reviewed resolution |
| `no-tracking` | PASS | Five-route resource/cache allowlist; no cookies, user stores, beacons, or third-party requests |
| `free-cli` | PASS | Complete sample without account, key, licence, or paid feature |
| `scriptable-cli` | PASS | Closed-input command paths, valid JSON, exit 0, and invalid-input exit 1 |
| `planning-mode` | PASS | Hash-free evidence, five conservative matches, held planning result |
| `package-contract` | PASS | All locked targets compiled with Rust 1.85; MIT metadata; one binary |
| `build-artifacts` | PASS | `dist/site/index.html` and executable Linux package at documented paths |
| `offline-reload` | PASS | Query entry canonicalized; demo reloaded and reopened offline |
| `route-contract` | PASS | Four distinct real routes and designed HTTP 404 |

Each ID maps to exactly one tagged test. The aggregate clean-clone `npm test` also passed: 8 Rust unit tests, 4 CLI integration tests, 4 route/contract tests, 1 PWA test, 4 browser tests, and 18 claim tests.

The landing and README claim groups map without gaps: local/read-only statements to `read-only-local`; inventory fields and warnings to `takeout-evidence`; SHA-256 behavior to `exact-byte-matching`; sample facts to `demo-content`; report/signature/files to `migration-report`; item, album, and retention rules to `named-exception-gate`, `album-exception-gate`, and `readiness-rules`; device decisions to `device-policy-report`; temporary output to `demo-isolation`; command/exit/planning statements to `scriptable-cli` and `planning-mode`; free use to `free-cli`; Rust/licence/package statements to `package-contract`; output paths to `build-artifacts`; privacy/cache statements to `no-tracking`; and route/offline statements to `route-contract` and `offline-reload`. No unlisted claim-like product sentence remains.

## Earlier-finding verification

I read every prior review, polish record, verification report, and handoff. Review 1 did not assign IDs, so this table uses the stable IDs introduced by polish 1. Every row below was rechecked against both the live site and current code/tests.

| Earlier ID | Round 6 result | Fresh confirmation |
| --- | --- | --- |
| `R1-B1` | Fixed | One-click browser demo and temporary CLI demo remain realistic, resettable, and isolated. |
| `R1-B2` | Fixed | Registry has 18 one-to-one tagged tests; all 18 commands passed separately. |
| `R1-B3a` | Fixed | Read-only/network, exact-byte, free-use, report, and exception claims passed. |
| `R1-B3b` | Fixed | Inventory fields, matching, device choices, and five-file report were inspected in generated output. |
| `R1-B3c` | Fixed | Planning, JSON/exit codes, export notes, album gates, warnings, and readiness rules passed. |
| `R1-B3d` | Fixed | No price, paid tier, licence UI, payment provider, or checkout link is present. |
| `R1-B3e` | Fixed | README operational statements map to the 18-claim registry and passing tests. |
| `R1-B4` | Fixed | Paid link remains absent; complete live crawl returned success for every current destination. |
| `R1-B5` | Fixed | Unknown route returned HTTP 404 with the designed archive-path page and home action. |
| `R1-B6` | Fixed | Per-route titles, descriptions, canonicals, OG/Twitter metadata, favicon, and touch icon are live. |
| `R1-M1` | Fixed | Shared header/footer, purpose, legal links, source link, factory credit, and version appear on all pages. |
| `R1-M2` | Fixed | Job, audience, one sample action, outcome text, and three facts fit both cold first screens. |
| `R1-M3` | Fixed | Audit/report/switch/exception/archive/demo vocabulary remains controlled. |
| `R1-D1` | Fixed | Browser sentinels were untouched; reset restored state/focus; CLI wrote only below a new temp workspace. |
| `R1-S1` | Fixed | Deep links, focus announcement, real-pointer Back restoration, legal routes, 44px targets, and mobile layout passed. |
| `F-2-1` | Fixed | `/?demo=1` canonicalized and reopened/reloaded offline. |
| `F-2-2` | Fixed | Live copy separates blocking conditions from non-blocking edit warnings. |
| `F-2-3` | Fixed | Runtime socket guard covered both demo and complete run and recorded zero attempts. |
| `F-2-4` | Fixed | Two-device output contains backup, deletion, conflict, and offline choices in both formats. |
| `F-2-5` | Fixed | Album-only gap transitions from hold to ready only after its named resolution. |
| `F-2-6` | Fixed | Explicit route/resource/cache allowlist and store/beacon checks passed live and locally. |
| `F-2-7` | Fixed | Site and executable output paths were produced and asserted; unsupported ownership copy remains absent. |
| `F-2-8` | Fixed | “Quickest” remains absent; sample instruction is factual. |
| `F-2-9` | Fixed | Folder, command-line, and named-exception labels remain clear and grammatical. |
| `F-2-10` | Fixed | Generated 25/38 copy audit is accurate and regenerates without a diff. |
| `F-3-1` | Fixed | Missing-export-note warning is registered and asserted exactly. |
| `F-3-2` | Fixed | Locked package compiled all targets with actual Rust 1.85.0. |
| `F-4-1` | Fixed | README/privacy distinguish family data from the disclosed 16-file static cache; allowlist assertion passed. |
| `F-4-2` | Fixed | Dedicated claim proves SHA-256 matching and rejects same-name/same-size byte differences. |
| `F-4-3` | Fixed | Live inventory sentence lists only emitted fields; test compares each advertised field with disk/fixtures. |
| `F-4-4` | Fixed | Browser sample status, totals, rows, signer, and files match fresh CLI output. |
| `F-4-5` | Fixed | Isolation test uses default no-`--output` path under isolated `TMPDIR` and preserves a sibling sentinel. |
| `F-4-6` | Fixed | Generated warning set is unique; edit warning appears once in JSON and Markdown. |
| `F-5-1` | Fixed | A physical click on the visible sticky Privacy link restored home scroll 700→700 and focused the home h1 on Back. |
| `F-5-2` | Fixed | README says the demo stores no family data and explicitly discloses the cached static app and sample page. |

No earlier finding is unfixed, half-fixed, or regressed.

## Structure, accessibility, links, and identity

- `/`, `/demo/`, `/privacy/`, `/terms/`, and `/404.html` returned 200. `/review-6-no-such-route` returned 404 with **“This archive path leads nowhere”** and a working home link.
- Each route has `lang="en"`, exactly one h1, one main landmark, ordered headings, a distinct title under 60 characters, a description under 155 characters, canonical, OG/Twitter metadata, SVG favicon, and 180×180 touch icon. The social image is 1200×630.
- `robots.txt` points to a sitemap containing all four real routes. The crawl covered all internal, fragment, and GitHub destinations; every destination returned 200 and each destination fragment exists.
- Internal route changes focused the new h1 and updated the polite live region. Real-pointer Back restored the prior 700px home position and h1 focus; Forward focused the privacy h1.
- At 390px and 1366px, all five pages had zero horizontal overflow, no visible target below 44px, no console/page error, and no missing image alt text or button name.
- The factory URL verifier passed. Axe reported zero total violations—and therefore zero serious/critical violations—on all five pages at both 390px and 1366px.
- Keyboard Tab exposed a 3px high-contrast skip-link ring. Reduced motion produced `scroll-behavior: auto` and 0.01ms control transitions.
- Responses include HSTS, `nosniff`, strict-origin referrer policy, permissions policy, and a CSP matching actual same-origin resources. Initial page JavaScript is 2,871 bytes raw, well below the static-product budget.
- SHA-256 hashes of live and clean-build home, demo, privacy, terms, 404, and service worker files match exactly.
- The asymmetric midnight archive landscape, amber photo frames, cyan verification path, glass evidence planes, and self-hosted Instrument Sans/IBM Plex Mono pairing implement `.factory/design.md`. The result is recognizably specific to photo-archive verification rather than a generic SaaS template.

## Missed leverage and AI check

No finding. The brief requires local Takeout/folder inventory, deterministic comparison, explicit device policies, and machine-readable/Markdown report export; the CLI supplies each. Transfer, hosting, facial recognition, and two-way sync are explicit non-goals. An AI step would not improve the deterministic evidence job and would weaken the local-only privacy model. There is no decorative AI feature, provider key, Azure endpoint, or runtime model call.

## Findings

None.

## What would make this perfect

Nothing identified in this round. The product has zero open findings and no untested public product claim.
