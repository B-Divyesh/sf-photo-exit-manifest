# Adversarial first-read review 4 — FAIL

**Reviewed:** 2026-08-28 UTC

**Candidate:** `0ae68230ccd99864a884da8889a4af24eb51ba84`

**Live URL:** `https://photo-exit-manifest.sociobot.in/`
**Review mode:** fresh Chromium contexts at 390×844 and 1440×900; clean clone for all claim commands

## Verdict

**FAIL.** The first screen, browser and CLI demos, routing, accessibility, visual identity, build, and all 16 registered claim commands work. Five blocking claim-gate findings and one minor report-quality finding remain. PASS requires zero findings and no untested claim.

## Cold first read

I opened `/` cold in separate fresh browser contexts, at `scrollY = 0`, before scrolling or interacting.

| Question | 390×844 phone | 1440×900 desktop |
| --- | --- | --- |
| What does this do? | It verifies a family photo archive before leaving Google Photos or another cloud. | Same answer. |
| For whom? | Families moving photos from Google Photos to their own archive. | Same answer. |
| What should I click first? | **Try it with sample data** to see a completed audit and signed migration report. | Same answer. |

The exact first-screen copy was:

> **Verify your family photo archive before leaving the cloud**
>
> For families moving photos from Google Photos to their own archive.
>
> **Try it with sample data** — See a completed audit and signed migration report.

The three facts—**“Does not change source folders,” “No photos uploaded,”** and **“Free command-line tool”**—were above the fold at both sizes. The phone had no horizontal overflow. The first-read requirement passes.

## Findings

### BLOCKING F-4-1 — “stores nothing” contradicts the offline cache and the tagged test omits Cache Storage

**Reopens:** `R1-B2`, `R1-B3e`, and `F-2-6`.

**Exact quote/location:** README, “Try the bundled sample”: **“It uses bundled data and stores nothing in your browser.”** `.factory/claims.json`, `no-tracking`: **“The website uses no analytics, advertising, cookies, browser storage or third-party scripts.”**

**Observed:** a fresh live demo context registered `photo-exit-manifest-4d03f9e04873` in Cache Storage with 16 entries: all five HTML routes, two images, two icons, two fonts, four JavaScript files, and one stylesheet. That cache is what makes the registered offline claim work. The `@claim:no-tracking` test checks localStorage, sessionStorage, cookies, IndexedDB, OPFS, beacons, and requests, but never checks Cache Storage. The command passes while the literal “no browser storage” claim is false.

**Why this misleads:** a privacy-conscious visitor is told that nothing is stored, although the site deliberately stores an offline application shell. Static application files are not family data, but the copy does not make that distinction.

**Concrete fix:** say **“The demo stores no sample or family data. A service worker caches the app files needed for offline use.”** Narrow `no-tracking` to tracking and personal-data storage. Extend its tagged test to inspect Cache Storage and assert that it contains only the documented static allowlist and no request containing sample or user data.

### BLOCKING F-4-2 — exact-byte matching is a public core claim with no matching registered claim assertion

**Reopens:** `R1-B2`, `R1-B3a`, and `R1-B3b`.

**Exact quote/location:** landing workflow: **“Match exact file bytes.”** Demo: **“Five items match by SHA-256.”** README: **“SHA-256 is the default comparison mode.”**

**Observed:** `takeout-evidence` asserts that inventory rows contain SHA-256 values, but it never asserts that a normal comparison matches assets by those hashes. `migration-report` asserts readiness, 100%, the signer, and five output filenames, but not the match method. `planning-mode` asserts only the separate hash-free `name_size_date` method. The core exact-byte comparison promise is therefore absent from `.factory/claims.json` and can regress while all registered commands remain green.

**Why this misleads:** byte-level comparison is the main reason to trust the audit before changing a cloud library. Recording a hash is not proof that matching used it.

**Concrete fix:** add exact-byte matching to a registered claim and, in that claim’s single tagged test, assert five `sha256` matches in the generated `audit.json`. Include a same-name/same-size/different-bytes fixture and assert that it does not match.

### BLOCKING F-4-3 — the inventory sentence promises unregistered fields

**Reopens:** `R1-B2` and `R1-B3b`.

**Exact quote/location:** landing workflow: **“Read file sizes, dates, album labels, edited files, media types, and SHA-256 hashes.”**

**Observed:** `takeout-evidence` registers hashes, Google export notes, album labels, and two warnings. Its tagged test checks hashes, one capture date, one album, one sidecar, and one edit marker. It does not register or assert file sizes or media types. The emitted inventory has a `bytes` field but no `media_type` field; media support is inferred internally from filename extensions.

**Why this misleads:** the sentence presents six inspectable forms of evidence as output, but two are outside the claim gate and one is not an explicit output field.

**Concrete fix:** either rewrite it to the fields the report actually records—**“Record file names, byte sizes, dates, album labels, edit warnings, and SHA-256 hashes.”**—and extend `takeout-evidence` to assert each field, or add an explicit `media_type` field and test it.

### BLOCKING F-4-4 — the browser’s “real CLI” sample and its advertised counts are not tied to CLI output

**Reopens:** `R1-B2` and `R1-B3e`.

**Exact quotes/locations:** landing: **“The sample has six items, five matches, and one explained exception.”** README: **“The workspace contains six unique source items. Five match the archive. One missing video has a named exception.”** Demo: **“The real CLI scanned the bundled example and created this signed migration report.”**

**Observed:** the current CLI output agrees: six source assets, five matches, one named exception, and zero unexplained items. However, no claim entry states those sample facts. `takeout-evidence` checks six inventory assets, but no tagged test asserts five exact matches and one exception. No test compares the hard-coded browser demo values or item table with a freshly generated CLI report. Editing the browser counts or changing the fixture can leave all 16 claim commands green.

**Why this misleads:** the browser page is presented as the real CLI’s output. Without a parity test, it can silently become an illustrative mock while retaining that sentence.

**Concrete fix:** register a `demo-content` claim. Run the bundled CLI sample, assert the 6/5/1/0 totals and named rows, then load `/demo/` and assert that its status, totals, evidence rows, signer, and report-file list match the generated output.

### BLOCKING F-4-5 — the automatic temporary-workspace path is advertised but not tested

**Reopens:** `R1-B2`.

**Exact quotes/locations:** landing: **“The sample command creates its own temporary workspace and prints the report location.”** README: **“The command creates a new temporary workspace.”** `.factory/claims.json`, `demo-isolation`: **“The bundled demo writes only inside a new temporary workspace…”**

**Observed:** both `@claim:demo-isolation` and `@claim:free-cli` pass `--output <chosen-path>`. They do not run the documented `photo-exit-manifest demo` path that chooses its own temporary directory. I ran that command independently and it currently passed, printed `/tmp/photo-exit-manifest-demo-9847-1787925953297857462/migration-report`, and produced the expected report. The advertised default can still regress without failing its registered test.

**Why this misleads:** the README’s first command relies on automatic sandbox creation. The release gate tests a different invocation.

**Concrete fix:** change `@claim:demo-isolation` to set an isolated `TMPDIR`, run `photo-exit-manifest demo --json` without `--output`, parse the printed location, assert it is a new child of that `TMPDIR`, and verify a sibling sentinel is unchanged. Test the explicit `--output` guard separately if desired.

### MINOR F-4-6 — the real sample report repeats the same edit warning

**Exact location:** generated `migration-report/audit.json`, `warnings[1]` and `warnings[2]`; the same duplicate appears as two consecutive “Review” bullets in `CUTOVER.md`.

**Exact repeated sentence:** **“Edited-looking files were found. Proprietary edit instructions may not be portable; verify rendered copies visually.”**

**Observed:** a clean `photo-exit-manifest demo --json` produced the warning twice because the edited-looking file exists in both source and destination inventories. The registered warning test uses `includes`, so it does not detect duplicates.

**Why this matters:** repeated warnings add noise to the signed migration report and can make two identical lines look like two separate unresolved risks.

**Concrete fix:** deduplicate combined warnings before writing `audit.json` and `CUTOVER.md`. Add an assertion that the warnings array contains unique strings and that the sample report prints the edit warning once.

## Copy audit

Counts collapse whitespace and count whitespace-delimited tokens. Hyphenated words and file tokens count once. Markdown links use their visible labels. Commands, code blocks, and filename-only lists are excluded from prose counts. No sentence exceeds 22 words, no banned marketing adjective appears, terminology is consistent, headings work out of context, and actions name a result. F-4-1 flags one short sentence because its absolute wording is false, not because of length.

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

README headings are **“Photo Exit Manifest”** (3), **“Try the bundled sample”** (4), **“Run an archive check”** (4), **“Review differences”** (2), **“Use it in scripts”** (4), **“Install”** (1), **“Develop and verify”** (3), and **“Deploy”** (1). Each is understandable out of context.

### Copy flags and rewrites

| Finding | Quote | Proposed rewrite |
| --- | --- | --- |
| F-4-1, false absolute | “It uses bundled data and stores nothing in your browser.” | “The demo stores no sample or family data. A service worker caches the app files needed for offline use.” |

There are no >22-word, jargon, banned-adjective, inconsistent-term, contextless-heading, or non-result-naming-action flags.

## Demo and sandbox

- One click on the first-screen action reached canonical `/demo/` and immediately showed the Morgan family audit: ready to review, six source items, five exact matches, one named exception, and zero unexplained items.
- The persistent banner says **“Demo — sample data, nothing is saved”** and contains **Reset demo** and **Start for real**.
- Reset closed both disclosures and focused **“Review the Morgan family archive check.”** A seeded `localStorage["real:sentinel"] = "keep"` remained unchanged.
- The page added no localStorage, sessionStorage, cookies, IndexedDB, or OPFS entries. It did add the 16-file static service-worker cache described in F-4-1.
- All 39 observed requests during the live demo flow were same-origin. No console or page errors occurred.
- After service-worker control, `/demo/` reloaded offline. The documented `/?demo=1` entry also reopened canonical `/demo/` while offline.
- A clean-clone `photo-exit-manifest demo --json` run without `--output` succeeded, chose a new `/tmp/photo-exit-manifest-demo-…/` workspace, printed its report location, and wrote the five documented files. F-4-5 concerns the missing tagged regression, not current runtime failure.

## Claim results

The candidate was cloned at `0ae68230ccd99864a884da8889a4af24eb51ba84` into `/tmp/photo-exit-review4-clean-9okhKw/repo`. After `npm ci`, every `test` string from `.factory/claims.json` was run separately.

| Claim ID | Command result | Observable coverage |
| --- | --- | --- |
| `demo-isolation` | PASS, incomplete | Explicit `--output` workspace and sibling sentinel; does not test automatic temp selection (F-4-5) |
| `migration-report` | PASS, incomplete | Ready, signed, 100%, five files; does not assert advertised sample counts or browser parity (F-4-4) |
| `named-exception-gate` | PASS | Missing-item exception removed → exit 2/hold |
| `takeout-evidence` | PASS, incomplete | Hashes, one date/note, album, edit flag and warnings; not exact matching, byte sizes, or media types (F-4-2/F-4-3) |
| `readiness-rules` | PASS | Missing-item, album-label and retention holds; edit remains a warning |
| `read-only-local` | PASS | Input digests unchanged; runtime socket guard logged no attempt |
| `device-policy-report` | PASS | Two devices and all four choices in JSON and Markdown |
| `album-exception-gate` | PASS | Album-only gap held until its named resolution |
| `no-tracking` | PASS, incomplete | Static request allowlist and data-store checks; omits the populated Cache Storage API (F-4-1) |
| `free-cli` | PASS | Complete sample with minimal environment and no credentials |
| `scriptable-cli` | PASS | Non-interactive help, JSON, success code 0, invalid-input code 1 |
| `planning-mode` | PASS | Hash-free planning, five conservative matches, held result |
| `package-contract` | PASS | All locked targets compile under Rust 1.85; MIT; one binary |
| `build-artifacts` | PASS | Static site and executable exist at documented paths |
| `offline-reload` | PASS | Documented entry canonicalizes, reloads offline, and reopens offline |
| `route-contract` | PASS | Four real routes and styled HTTP 404 |

There were no nonzero claim commands. The green commands do not close the unlisted or incompletely exercised public claims in F-4-1 through F-4-5.

The aggregate `npm test` also passed: 7 Rust unit tests, 4 CLI integration tests, 4 site/contract tests, 1 PWA test, 4 browser tests, and 16 claim tests. `npm run build` passed and produced `dist/site/` plus executable `dist/package/photo-exit-manifest-linux-x86_64`.

## Earlier findings rechecked

Review 1 assigned no IDs, so the stable IDs introduced in `.factory/polish-1.md` are used.

| Earlier ID | Result in round 4 | Fresh live/code confirmation |
| --- | --- | --- |
| `R1-B1` | Fixed | Browser and CLI demos remain one-click, realistic, resettable, and isolated in current behavior. |
| `R1-B2` | Regressed / BLOCKING | All commands pass, but five public claim clauses are false, absent, or incompletely tested; F-4-1 through F-4-5. |
| `R1-B3a` | Regressed / BLOCKING | Local/privacy/hash recording remain tested, but exact-byte matching is not; F-4-2. |
| `R1-B3b` | Regressed / BLOCKING | Device choices and report output pass; exact matching and inventory size/type assertions remain outside the gate; F-4-2/F-4-3. |
| `R1-B3c` | Fixed | Planning, exit-code, Takeout note, album, warning, and readiness behavior remain registered and pass. |
| `R1-B3d` | Fixed | No paid tier, price, licence UI, or checkout link is present. |
| `R1-B3e` | Regressed / BLOCKING | README sample and browser-storage assertions are not fully represented or tested; F-4-1/F-4-4/F-4-5. |
| `R1-B4` | Fixed | The purchase link remains absent; all current links and hash targets pass. |
| `R1-B5` | Fixed | `/definitely-not-a-route` returns HTTP 404 and the designed archive-path page. |
| `R1-B6` | Fixed | All routes retain title, description, canonical, OG/Twitter data, favicon, and touch icon. |
| `R1-M1` | Fixed | Header/footer purpose, legal links, source, factory credit, and version are consistent. |
| `R1-M2` | Fixed | Job, audience, one first action, result, and three facts fit the first viewport. |
| `R1-M3` | Fixed | Audit, report, switch, exception, archive, and demo terminology remains consistent. |
| `R1-D1` | Fixed | Live reset/storage behavior and the CLI’s actual new-directory behavior pass. |
| `R1-S1` | Fixed | Deep links, h1 focus, scroll restoration, 404, targets, reduced motion, and mobile layout pass. |
| `F-2-1` | Fixed | The documented query entry canonicalizes and works offline. |
| `F-2-2` | Fixed | Landing copy separates hold conditions from edit warnings. |
| `F-2-3` | Fixed | Runtime socket interception covers demo and a complete run. |
| `F-2-4` | Fixed | Two-device output includes all four decisions. |
| `F-2-5` | Fixed | Album-only gaps hold until named resolution. |
| `F-2-6` | Regressed / BLOCKING | Tracking checks pass, but its “no browser storage” wording/test omits the required offline cache; F-4-1. |
| `F-2-7` | Fixed | Site and packaged executable paths are registered and tested. |
| `F-2-8` | Fixed | “Quickest” remains absent. |
| `F-2-9` | Fixed | First-screen facts and labels are plain and grammatical. |
| `F-2-10` | Fixed | `npm run audit:copy` regenerated 25 landing and 37 README sentences with no drift. |
| `F-3-1` | Fixed | The exact missing-export-note warning remains in the claim and tagged assertion. |
| `F-3-2` | Fixed | The package-contract test compiles every locked target with Rust 1.85.0. |

## Structure, accessibility, links, and identity

- `/`, `/demo/`, `/privacy/`, `/terms/`, and `/404.html` returned 200. An unknown path returned 404 with **“This archive path leads nowhere.”**
- Every route has `lang="en"`, one h1, one main, a route-specific title under 60 characters, a description under 155 characters, canonical, OG/Twitter image data, SVG favicon, and Apple touch icon.
- The crawl covered 13 unique destinations and hash targets across all five pages. Every URL returned 200 and every fragment target existed; the GitHub source link returned 200.
- Same-origin navigation focused the destination h1. Back restored the home h1 and the prior 700px scroll position. The live region is polite.
- At 390px all routes had zero horizontal overflow and no visible link or button below 44px. Reduced motion produced `scroll-behavior: auto`.
- Live axe returned 0 violations at 390px and 1366px on all five pages. The factory URL verifier returned one h1, `lang=en`, a main landmark, complete image/button names, and zero console errors.
- Local and live SHA-256 matched for home, demo, privacy, terms, 404, and `sw.js`.
- Initial built JavaScript is about 2.55 KB raw, CSS is 21.68 KB, self-hosted fonts total about 44.98 KB, and the hero is 71.84 KB.
- The asymmetric midnight archive landscape, amber frames, cyan evidence path, glass planes, and local font pairing follow `.factory/design.md`. The site is recognizably product-specific rather than a generic SaaS template.

## Missed leverage

No finding. The brief calls for local Takeout/folder inventory, deterministic comparison, device policies, and JSON/Markdown export; these are present. Two-way sync is an explicit non-goal. An AI step would weaken the deterministic local evidence job, and no decorative AI or embedded provider key is present.

## What would make this perfect

Make the storage wording distinguish cached app files from saved user/sample data and test the cache allowlist. Register and test exact SHA-256 matching plus every advertised inventory field. Generate or verify the browser sample from real CLI output, including its 6/5/1/0 counts. Exercise the default no-`--output` demo path in the isolation claim. Deduplicate report warnings. Then rerun every claim command and this entire cold/live review.
