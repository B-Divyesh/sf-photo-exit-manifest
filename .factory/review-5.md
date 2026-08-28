# Adversarial first-read review 5 — FAIL

**Reviewed:** 2026-08-28 UTC  
**Candidate:** `7241a3dcd490815fbf6a4ae5808d4a0e7884d5a7`  
**Live URL:** <https://photo-exit-manifest.sociobot.in/>

## Verdict

**FAIL.** Two blocking regressions remain. The cold first read, one-click CLI/browser demo, 18 registered claim tests, visual identity, metadata, routes, and link crawl otherwise verify. PASS requires zero findings.

## Cold first read

Fresh, unscrolled Chromium contexts at 390×844 and 1366×900 showed the same complete first screen with no console errors.

- **What it does:** checks a Google Photos export against a family photo archive before leaving the cloud, then creates a signed migration report.
- **For whom:** families moving photos from Google Photos to their own archive.
- **First action:** **“Try it with sample data”**; it says the result will be “a completed audit and signed migration report.”

All three answers are present above the 390px fold. The nine-word h1, audience sentence, one primary action, outcome, and three facts are clear. This check passes.

## Findings

### BLOCKING F-5-1 — Back navigation loses the reader’s prior scroll position (regression of R1-S1)

**Evidence.** In a fresh live desktop context, I scrolled home to `scrollY: 659`, clicked the visible header **“Privacy”** link, then used the browser Back button. The live home page focused its h1 but returned at `scrollY: 0`, not 659. The history entry after Back was `{ "photoExitScrollY": 0 }`.

The cause is visible in `site/src/shared.ts`: the document click handler saves the correct position, but the subsequent `pagehide` handler calls `rememberScrollPosition()` again after navigation has reset scrolling and overwrites it with zero. The clean-clone `npm test` run also failed the route browser test at `site/test/browser.test.mjs:104` with `page.title: Execution context was destroyed, most likely because of a navigation`; the test then left the browser process open.

**Why this matters.** A visitor following Privacy or Terms loses their place in the long landing page when they return. This fails the real-route, Back-button, and focus/scroll restoration contract, and leaves the required test gate non-reliable.

**Concrete fix.** Save the leaving page’s scroll position exactly once before same-origin navigation; do not overwrite it during `pagehide` after the browser resets position. Then change the browser test to use a real link click, await the navigation and Back completion, and assert both h1 focus and the original scroll position (within a small tolerance). `npm test` must pass from a clean clone.

### BLOCKING F-5-2 — the README repeats the false “no sample data is stored” privacy statement (regression of F-4-1)

**Exact quote/location.** README, “Try the bundled sample”: **“The demo stores no sample or family data.”**

**Evidence.** A fresh live `/demo/` visit creates Cache Storage `photo-exit-manifest-c4eb41f54b94`. Its 16 entries include `https://photo-exit-manifest.sociobot.in/demo/`. That cached HTML is the page that contains the bundled Morgan-family audit records, including the six source-item names and 6/5/1/0 result. This is also necessary for the verified offline reload. `.factory/demo.md` correctly says the cached demo page contains the bundled sample; the README contradicts it.

The `no-tracking` claim test passes because it correctly allows that static cache, so it does not prove the README wording. The privacy claim must describe what is cached, rather than deny it.

**Why this matters.** The sentence asks a privacy-conscious visitor to believe a literal storage promise that the product visibly cannot keep. The bundled sample is non-personal, but it is still sample data persisted in Cache Storage.

**Concrete fix.** Replace it with: **“The demo does not store your family data. Its offline cache keeps the static app and bundled sample page.”** Keep the existing cache allowlist assertion and add a copy/contract assertion that README and privacy text make this distinction.

## Demo and sandbox verification

This part passes, except for the cache-copy contradiction above.

- A fresh 390px visit to `/?demo=1` canonicalized to `/demo/` in one click.
- The first demo screen already showed a completed realistic check: 6 source items, 5 exact matches, 1 named exception, 0 unexplained, plus evidence rows and five report files.
- The persistent banner read **“Demo — sample data, nothing is saved”** and exposed **“Reset demo”** and **“Start for real.”** Reset closed an open disclosure and restored focus to the h1.
- Fresh browser storage contained no cookies, local storage, session storage, or IndexedDB. It did contain the documented Cache Storage entry above; this is why F-5-2 is material.
- With network disabled after the online demo visit, `/demo/` reloaded and showed **“You’re offline. The complete sample remains available.”** All 9 observed first-load requests were same-origin static assets.
- In a fresh temporary directory, `target/debug/photo-exit-manifest demo --json` returned `ready_for_cutover`, 100%, and wrote the five report files only beneath a newly created `photo-exit-manifest-demo-*` child.

## Claims and clean-clone checks

I cloned `7241a3d` to `/tmp/photo-exit-manifest-review5-clean-HMtmTI/repo`, ran `npm ci`, built the site, and exercised every tagged claim test from the registry in that clone. All 18 passed:

`demo-isolation`, `migration-report`, `named-exception-gate`, `takeout-evidence`, `exact-byte-matching`, `demo-content`, `readiness-rules`, `read-only-local`, `device-policy-report`, `album-exception-gate`, `no-tracking`, `free-cli`, `scriptable-cli`, `planning-mode`, `package-contract`, `build-artifacts`, `offline-reload`, and `route-contract`.

There is no failing registered claim test. However, the full clean-clone `npm test` quality gate failed in the route-history browser test as recorded in F-5-1, so the repository does not meet the required all-tests-pass gate.

Cross-checking the live landing page and README against `.factory/claims.json` found the operational claims covered by the listed registry. F-5-2 is not an unlisted claim: it is a false rendering of the registered privacy/cache behavior, which the test itself disproves.

## Structure, accessibility, and link checks

The structure check passes apart from Back restoration in F-5-1.

- Home, demo, privacy, terms, and designed unknown-route 404 loaded directly; the unknown route returned HTTP 404.
- Routes had distinct titles, one h1, main landmarks, descriptions, canonical URLs, Open Graph/Twitter data, SVG favicon, and apple touch icon. Their title pattern is appropriate for home and the named legal/demo routes.
- At 390px and 1366px, all five routes had no horizontal overflow or console/page errors. Local browser accessibility tests cover serious/critical axe findings; live CSP correctly blocks arbitrary inline audit injection.
- Same-origin crawl targets (`/`, `/demo/`, `/privacy/`, `/terms/`, and `/?demo=1`) returned 200. The header/footer were consistent and included Privacy, Terms, Param Factory credit, and v0.1.0.
- The deep-ink, cyan-verification-path, amber-memory-frame identity matches `.factory/design.md` and is distinct from a generic SaaS template.

## Missed leverage / AI check

No missed feature is recorded. The brief calls for a local, evidence-first comparison and signed report; bundled import fixtures, JSON output, and a safe CLI demo are present. An AI step would need to receive family/archive data and is not necessary to perform the stated job, so adding one would weaken the local-first promise. No provider key or decorative AI feature is present.

## Copy audit

Counts use the repository’s documented whitespace-token rule. Commands, file-list items, and headings/actions are not sentences; headings/actions were separately reviewed and no additional wording finding was found. No sentence exceeds 22 words or contains a banned marketing adjective. The one copy finding is F-5-2 because it is false, not because it is long.

### Landing-page sentences

| Words | Exact sentence |
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

### README sentences

| Words | Exact sentence |
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
| 8 | The demo stores no sample or family data. **F-5-2** |
| 11 | A service worker caches the app files needed for offline use. |
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
| 8 | Version 0.1.0 is licensed under the MIT License. |
| 2 | See `CHANGELOG.md`. |

## Earlier-findings verification

Every earlier review, polish record, and the prior handoff was read. Fresh live/code confirmation is summarized below; **regressed** means it remains blocking in this round.

| Earlier IDs | Status in this round | Fresh confirmation |
| --- | --- | --- |
| R1-B1, R1-D1 | fixed | One-click `/demo/`, banner, reset/focus, bundled sample, and temporary CLI workspace work. |
| R1-B2, R1-B3a–d | fixed | 18-entry registry is one-to-one with tagged tests; all tagged tests pass in the clean clone. |
| R1-B4 | fixed | No paid UI remains; current same-origin links resolve. |
| R1-B5, R1-B6 | fixed | Unknown route is designed HTTP 404; metadata is present per route. |
| R1-M1, R1-M2, R1-M3 | fixed | Shared shell, cold first screen, and controlled audit/report terminology verify live. |
| R1-S1 | **regressed — F-5-1** | Back restores h1 focus but not the prior scroll position. |
| F-2-1 through F-2-7 | fixed | Offline query entry, readiness rules, runtime network guard, device/album gates, privacy allowlist, and build outputs passed their claim tests. |
| F-2-8 through F-2-10 | fixed | No “quickest” copy, clear first-screen labels, and regenerated 25/38 copy counts verify. |
| F-3-1, F-3-2 | fixed | Missing-note warning and Rust 1.85 package contract passed their claim tests. |
| F-4-1 | **regressed — F-5-2** | README again denies cached sample data while the offline cache includes `/demo/`. |
| F-4-2 through F-4-6 | fixed | Exact-byte, inventory fields, CLI/browser parity, automatic temp output, and warning de-duplication passed their tests. |

## What would make this perfect

Preserve the original scroll value during real navigation and make the browser history test deterministic. Then replace the README’s false cache sentence with the precise disclosure above and enforce that wording in a test. After a clean-clone `npm test` passes, repeat the live Back and offline-cache checks.
