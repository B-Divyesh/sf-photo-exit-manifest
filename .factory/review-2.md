# Adversarial first-read review 2 — FAIL

**Reviewed:** 2026-08-28 UTC

**Candidate:** `ea7f415fe17cd754d73b3a3a8bed36b84de9bb5c`

**Live URL:** `https://photo-exit-manifest.sociobot.in/`

**Review mode:** fresh Chromium contexts at 390×844 and 1440×900; clean clone for tests

## Verdict

**FAIL.** The first screen, one-click demo, visual identity, routing, metadata, link crawl, keyboard route focus, and baseline accessibility now work. The review still has seven blocking findings and three minor findings. The documented one-click demo URL does not reload offline, the landing page gives a false readiness rule for edited files, the privacy test does not intercept CLI networking, and several public claims remain outside `.factory/claims.json`.

PASS requires zero findings and no untested claim.

## Cold first read

I opened `/` in separate fresh browser contexts, did not scroll, and recorded the visible first screen.

| Question | 390 px | 1440 px |
| --- | --- | --- |
| What does this do? | It checks a Google Photos export against a family-owned photo archive before the family leaves the cloud. | Same answer. |
| For whom? | Families moving photos from Google Photos into their own archive. | Same answer. |
| What should I click first? | **Try it with sample data** to see a completed audit and signed migration report. | Same answer. |

The text that supplied those answers was:

> **Verify your family photo archive before leaving the cloud**
>
> For families moving photos from Google Photos to their own archive.
>
> **Try it with sample data** — See a completed audit and signed migration report.

All three facts—“Reads folders only”, “No photos uploaded”, and “Free CLI”—were above the fold at both sizes. The cold first-read requirement passes.

## Findings

### BLOCKING F-2-1 — the documented one-click demo fails the offline claim

**Reopens:** `R1-D1` and the offline part of `R1-B2`.

**Exact claim/location:** `.factory/claims.json` says **“The website and bundled sample reload offline after one online visit.”** `.factory/demo.md` names `https://photo-exit-manifest.sociobot.in/?demo=1` as the one-click entry. The demo’s offline notice says **“You’re offline. The complete sample remains available.”**

**Observed:** clicking the first-screen action lands on `/demo/?demo=1`. After the service worker controlled the page, `context.setOffline(true)` followed by reload failed with `net::ERR_FAILED`. Repeating the same check on `/demo/` passed. The service worker precaches `/demo/`, but neither navigation nor `caches.match()` normalizes the query string. The registered `@claim:offline-reload` test opens `/demo/` directly, so it passes without testing the documented demo entry.

**Why this misleads:** the exact path supplied to visitors and verifiers is the path that loses the promised offline behavior.

**Concrete fix:** redirect `/?demo=1` to `/demo/` without retaining the query, or normalize navigation requests before the cache lookup. Change `@claim:offline-reload` to begin at the documented `/?demo=1` entry, confirm the redirect, then disable networking and reload the resulting URL.

### BLOCKING F-2-2 — the landing page gives a false rule for edited files

**Reopens:** `R1-B3c`.

**Exact quote/location:** landing page, “Stops on missing decisions”: **“Missing items, album labels, edited files, or unsafe retention settings keep the report on hold.”**

**Observed:** the bundled demo lists `bike-ride-edited.jpg` with **“SHA-256 and edit warning”** while the same report is **“Ready to review”** and `100.000% explained`. In code, edited-looking files add warnings; they are not part of the `audit.ready` condition. The README correctly says they **“appear as warnings.”**

**Why this misleads:** a family cannot tell which conditions actually prevent a switch. The live sample directly contradicts the landing rule.

**Concrete fix:** use: **“Missing items, missing album labels, or unsafe retention settings keep the report on hold. Edited-looking files appear as warnings to review.”** Add a registered claim test that separately proves hold conditions and non-blocking edit warnings.

### BLOCKING F-2-3 — the CLI privacy claim is not tested with network interception

**Reopens:** `R1-B2` and `R1-B3a`.

**Exact claim/location:** `.factory/claims.json`, `read-only-local`: **“The CLI does not change source files or send archive data over the network.”** README: **“The CLI has no account, paid feature, analytics, telemetry, or network code.”**

**Observed:** the tagged test compares input hashes and rejects a short source-code regex (`TcpStream`, `UdpSocket`, selected HTTP libraries, and `curl`). It intercepts browser requests, but it does not intercept the CLI process’s network activity. Source scanning is not runtime network interception and would not catch every socket or spawned client path. This sandbox does not permit `unshare --net`, so I could not supply the missing runtime proof independently.

**Why this misleads:** local-only handling is the product’s highest-risk promise. The registered test does not exercise the network half of that CLI promise in the required sandbox.

**Concrete fix:** run `photo-exit-manifest demo` and a complete `run` under a test harness that records or denies socket syscalls, then assert zero connection attempts. Keep the browser request interception as a separate assertion.

### BLOCKING F-2-4 — device-policy behavior is an unlisted public claim

**Reopens:** `R1-B3b`.

**Exact quote/location:** landing workflow: **“Record each device’s backup, deletion, conflict, and offline choices before switching from Google Photos.”** README also tells the user to **“review its device choices.”**

**Observed:** no `.factory/claims.json` entry names device-policy recording, and `@claim:migration-report` checks only status, percentage, signer, and the five filenames. It does not inspect the generated report for the four device choices.

**Why this misleads:** per-device planning is a core part of the brief and a reason to use this tool, but it is outside the release claim gate.

**Concrete fix:** add a `device-policy-report` claim and tagged test that supplies two realistic devices and asserts all four choices in `manifest.json` and `CUTOVER.md`.

### BLOCKING F-2-5 — album-label readiness is an unlisted public claim

**Reopens:** `R1-B3c` and `R1-B3e`.

**Exact quote/location:** README: **“Every missing album label also needs a reviewed resolution.”** The landing page also includes album labels in its hold-condition sentence.

**Observed:** an untagged Rust unit test and CLI integration test cover album gaps, but no claim entry names this readiness rule. `named-exception-gate` is limited to a missing source item and its tagged test does not create an album-only gap.

**Why this misleads:** the public claim can regress while every registered claim command remains green.

**Concrete fix:** add an `album-exception-gate` entry. Its tagged test must show an album-only gap returning exit 2/hold, then add a named album resolution and assert ready status.

### BLOCKING F-2-6 — analytics and telemetry promises are unlisted

**Reopens:** `R1-B3e`.

**Exact quotes/location:** README: **“The CLI has no account, paid feature, analytics, telemetry, or network code.”** and **“The website uses no analytics or third-party scripts.”** The privacy route makes equivalent statements.

**Observed:** `free-cli` covers account/key/licence behavior. `read-only-local` permits every same-origin request and therefore would not detect same-origin analytics. No claim entry names analytics, telemetry, cookies, advertising, or third-party scripts.

**Why this misleads:** privacy language is presented as a guarantee, but the registry cannot fail when tracking is introduced.

**Concrete fix:** add a `no-tracking` claim and test every public route with an explicit request allowlist plus assertions for cookies, storage, `sendBeacon`, and unexpected endpoints. Keep CLI runtime network interception under `read-only-local`.

### BLOCKING F-2-7 — release and build-output promises are unlisted

**Reopens:** `R1-B3e`.

**Exact quotes/location:** README: **“The factory creates release archives; this repository does not publish itself.”**, **“The Vite site builds to `dist/site/`.”**, **“The packaged Linux binary builds to `dist/package/`.”**, and **“The factory owns deployment, DNS, and package publishing.”**

**Observed:** none has a matching claim entry. `package-contract` checks Cargo metadata only. `npm run build` did produce both documented directories in this review, but that fact is not part of the claim registry; release creation and factory ownership are not tested at all.

**Why this misleads:** the README says every public claim is listed, while these distribution statements are outside the registry.

**Concrete fix:** add a `build-artifacts` claim that runs `npm run build` and asserts the site and executable paths. Remove the release/deployment ownership sentences unless a testable published artifact or factory contract is linked.

### MINOR F-2-8 — “quickest” is an untested marketing comparison

**Exact quote/location:** README: **“The sample is the quickest way to see a finished audit.”**

**Why this misleads:** “quickest” compares paths without a defined or tested measure. It is also absent from the claim registry.

**Concrete fix:** **“Run the sample to see a finished audit.”**

### MINOR F-2-9 — two short first-page labels are unclear

**Exact quote/location:** hero fact **“Reads folders only”** and evidence strip **“Named explains each exception.”**

**Why this loses a first-time visitor:** “Reads folders only” can imply that the CLI never writes output, even though it writes a report. “Named explains each exception” is not grammatical and the label “Named” has no meaning out of context.

**Concrete fix:** use **“Does not change source folders”** and **“Named exceptions — explain each accepted difference.”** Spell out **“Free command-line tool”** on first use instead of relying on the acronym “CLI.”

### MINOR F-2-10 — the required copy-audit evidence has incorrect counts

**Exact location:** `.factory/copy-audit.md`.

**Observed:** nine of its 28 landing sentence counts are wrong. Examples: the audience sentence is 11 words, not 10; the inventory sentence is 13, not 11; and the temporary-workspace sentence is 13, not 11. None crosses 22 words after correction, but the required proof is not reliable.

**Concrete fix:** generate counts from the final visible text with one documented token rule. Include the README audit required by the work order.

## Copy audit

Counts use whitespace-delimited words after removing Markdown markup; hyphenated tokens count as one. Code blocks and file-list items are not sentences. No visible landing or README sentence exceeds 22 words. Landing prose averages 8.5 words; README prose averages 8.3 words.

### Landing-page sentences

| Words | Exact sentence or rendered statement |
| ---: | --- |
| 9 | Verify your family photo archive before leaving the cloud. |
| 11 | For families moving photos from Google Photos to their own archive. |
| 8 | See a completed audit and signed migration report. |
| 4 | SHA-256 compares file bytes. |
| 4 | Named explains each exception. |
| 5 | Two sides: source and archive. |
| 6 | Five files form the migration report. |
| 5 | Check your archive before switching. |
| 5 | The audit compares the evidence. |
| 8 | The signed migration report records the reviewed result. |
| 13 | Read file sizes, dates, album labels, edited files, media types, and SHA-256 hashes. |
| 4 | Match exact file bytes. |
| 8 | Name each missing item that your family accepts. |
| 14 | Record each device’s backup, deletion, conflict, and offline choices before switching from Google Photos. |
| 5 | See the finished check first. |
| 11 | The sample has six items, five matches, and one explained exception. |
| 5 | Start with one sample command. |
| 13 | The sample command creates its own temporary workspace and prints the report location. |
| 16 | The scanner reads the JSON file beside a photo and keeps album labels from duplicate copies. |
| 15 | Missing items, album labels, edited files, or unsafe retention settings keep the report on hold. |
| 4 | Commands need no prompts. |
| 9 | Add `--json` for machine-readable status and stable exit codes. |
| 5 | Your family controls every change. |
| 10 | The CLI does not move, edit, restore, or delete photos. |
| 9 | It does not send archive data over the network. |
| 15 | A ready report is evidence to review, not permission to delete your old cloud library. |
| 7 | Run the check before touching your photos. |
| 9 | Checks a Google Photos export against your family archive. |

### Landing headings, labels, and actions

The headings “Inventory both folders”, “Explain every difference”, “Sign the migration report”, “See the finished check first”, “Start with one sample command”, “Reads Google export notes”, “Stops on missing decisions”, “Works in scripts”, “Your family controls every change”, and “Run the check before touching your photos” make sense out of context. The result-naming actions are “Try it with sample data”, “Open the full sample audit”, “Copy install command”, “Read the privacy policy”, and “read the terms”. F-2-9 records the unclear evidence/fact labels. Technical terms such as SHA-256, JSON, and exit codes appear with a plain result or in installation material; “CLI” is unexplained on its first-screen use.

### README sentences

| Words | Exact sentence or sentence-like instruction |
| ---: | --- |
| 12 | Photo Exit Manifest checks a Google Photos export against a family archive. |
| 9 | It records the result in a signed migration report. |
| 8 | The CLI reads local folders without changing them. |
| 10 | It does not move, edit, restore, delete, or upload photos. |
| 11 | The sample is the quickest way to see a finished audit. |
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
| 9 | An unsigned or held report exits with code `2`. |
| 10 | Invalid input or an I/O failure exits with code `1`. |
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
| 11 | The factory creates release archives; this repository does not publish itself. |
| 10 | `npm test` runs Rust, browser, offline, routing, and claim tests. |
| 10 | Every public claim and its command is listed in `.factory/claims.json`. |
| 6 | The Vite site builds to `dist/site/`. |
| 7 | The packaged Linux binary builds to `dist/package/`. |
| 12 | The CLI has no account, paid feature, analytics, telemetry, or network code. |
| 8 | The website uses no analytics or third-party scripts. |
| 6 | Deploy `dist/site/` as the static root. |
| 8 | The factory owns deployment, DNS, and package publishing. |
| 8 | Version `0.1.0` is licensed under the MIT License. |
| 2 | See `CHANGELOG.md`. |

README headings and their counts are: “Photo Exit Manifest” (3), “Try the bundled sample” (4), “Run an archive check” (4), “Review differences” (2), “Use it in scripts” (4), “Install” (1), “Develop and verify” (3), and “Deploy” (1). Each works out of context. The browser-demo link names its result. F-2-8 records the only marketing comparison; F-2-4 through F-2-7 record unlisted claims. No banned plain-words term appears.

## Demo and sandbox

- One click from the landing page opened `/demo/?demo=1` with the persistent **“Demo — sample data, nothing is saved”** banner.
- The first demo screen already showed a Morgan family audit, “Ready to review”, 6 source items, 5 exact matches, 1 named exception, and 0 unexplained items.
- Opening a disclosure and pressing **Reset demo** closed it, changed the status to **“Sample restored. No browser or family data changed.”**, and focused the h1.
- A seeded `localStorage["real:sentinel"]` value was unchanged before entry, in the demo, and after reset. The demo added no local/session storage or cookies. Every observed browser request was same-origin.
- The clean-clone CLI command `./target/debug/photo-exit-manifest demo --json` succeeded and wrote to a new `/tmp/photo-exit-manifest-demo-…/migration-report` workspace. `@claim:demo-isolation` also preserved a sibling sentinel archive.
- Canonical `/demo/` reloaded offline. The required one-click `/demo/?demo=1` result did not; see F-2-1.

## Claim results

I cloned commit `ea7f415` into `/tmp/photo-exit-review2-clean-QmTXYg/repo`, ran `npm ci`, and then ran every command from `.factory/claims.json` separately.

| Claim ID | Result | Evidence checked by its tagged test |
| --- | --- | --- |
| `demo-isolation` | PASS | New workspace; sibling sentinel unchanged |
| `migration-report` | PASS | Ready status, signer, 100%, exact five files |
| `named-exception-gate` | PASS | Missing-item exception removed → exit 2/hold |
| `takeout-evidence` | PASS | Hashes, export date/note, album label, edit marker |
| `read-only-local` | PASS but incomplete | Input hashes and browser origin; no CLI runtime network interception (F-2-3) |
| `free-cli` | PASS | Minimal environment, no credentials |
| `scriptable-cli` | PASS | Help, JSON output, exit 0 and invalid-input exit 1 |
| `planning-mode` | PASS | No hashes, five conservative matches, held result |
| `package-contract` | PASS | MIT, Rust 1.85, one binary target |
| `offline-reload` | PASS but incomplete | Tests canonical `/demo/`, not documented one-click route (F-2-1) |
| `route-contract` | PASS | Four real routes and styled HTTP 404 |

Each ID appears on exactly one test. The separate full `npm test` run also passed: 7 Rust unit tests, 4 CLI integration tests, 2 route tests, 1 PWA test, 4 browser tests, and 11 claim tests. `npm run build` passed and produced `dist/site/` and `dist/package/photo-exit-manifest-linux-x86_64`.

The green commands do not override the observed false/incomplete claims in F-2-1 through F-2-7.

## Earlier findings, independently rechecked

The stable IDs below come from `.factory/polish-1.md`, because `.factory/review-1.md` did not assign IDs.

| Earlier ID | Current result | Evidence |
| --- | --- | --- |
| `R1-B1` demo missing | Fixed | Browser and CLI demos are realistic, one-click, resettable, and isolated. |
| `R1-B2` claim registry missing | Half-fixed / BLOCKING | Eleven entries and tests exist, but the offline and CLI-network tests miss their required path/behavior; F-2-1 and F-2-3. |
| `R1-B3a` hero/evidence claims unlisted | Half-fixed / BLOCKING | Main hash/local/free claims are listed; CLI network proof remains incomplete; F-2-3. |
| `R1-B3b` workflow claims unlisted | Half-fixed / BLOCKING | Device-policy behavior remains unlisted; F-2-4. |
| `R1-B3c` planner/docs claims unlisted | Not fixed / BLOCKING | The edited-file hold sentence remains false and album gating is unlisted; F-2-2 and F-2-5. |
| `R1-B3d` paid claims unlisted | Fixed | Paid copy and checkout are absent; the CLI is the complete product. |
| `R1-B3e` README claims unlisted | Half-fixed / BLOCKING | Analytics, release/build, and album claims remain outside the registry; F-2-5 through F-2-8. |
| `R1-B4` dead checkout | Fixed | Checkout was removed; the live link crawl had no dead link. |
| `R1-B5` unknown path showed home | Fixed | `/not-a-real-route` returned HTTP 404 with the designed archive-path page. |
| `R1-B6` route metadata incomplete | Fixed | Titles, descriptions, canonicals, OG/Twitter images, favicon, and touch icon are live on every route. |
| `R1-M1` inconsistent header/footer | Fixed | Shared navigation, legal links, factory credit, and version are present. |
| `R1-M2` metaphor-first hero | Fixed | The first-read test passes at both viewports. |
| `R1-M3` inconsistent terminology | Fixed | “Audit”, “signed migration report”, “named exception”, and “family archive” have distinct uses. |
| `R1-D1` demo sandbox gaps | Half-fixed / BLOCKING | Isolation/reset pass; the documented demo entry does not survive offline reload; F-2-1. |
| `R1-S1` routing/focus/mobile gaps | Fixed | Deep links, forward/back h1 focus, 44 px controls, reduced motion, and mobile layout pass. |

## Structure, links, accessibility, and visual identity

- `/`, `/demo/`, `/privacy/`, and `/terms/` returned 200; the unknown route returned 404. Each had one h1, a main landmark, a distinct correctly patterned title under 60 characters, a description under 155 characters, canonical, OG/Twitter metadata, SVG favicon, and Apple touch icon.
- `robots.txt`, `sitemap.xml`, the 1200×630 social image, icons, and every internal/external anchor returned the expected successful status. Hash targets existed. No dead links were found.
- Demo navigation focused its h1; browser Back restored `/` and focused its h1. The route status uses a polite live region.
- Live responses included the configured CSP, `X-Content-Type-Options`, `Referrer-Policy`, and `Permissions-Policy`. The URL verifier reported no console errors.
- Axe reported zero violations on home, demo, privacy, terms, and 404 at 390×844 and 1366×900. The repository’s keyboard, reduced-motion, target-size, overflow, and console tests passed.
- The luminous archive-glass art, cyan/amber path, self-hosted type, and evidence-led panes are product-specific. The page does not look like a generic centered SaaS hero with interchangeable cards.

## Missed leverage

No additional feature finding. The brief already implies import from local Takeout/folders and export to JSON/Markdown, and the product does both. Two-way sync is an explicit non-goal. An AI step would weaken the deterministic, local evidence model and is not an obvious user expectation here. No runtime provider key or decorative AI feature exists.

## What would make this perfect

Make the documented one-click demo URL survive offline reload. Correct the edited-file readiness copy. Add runtime CLI network interception and register the device-policy, album-gate, no-tracking, and build-artifact claims. Remove unsupported release/process claims and “quickest”. Replace the two unclear first-page labels, then regenerate the copy audit from visible text. Re-run this entire review from a fresh browser and clean clone; perfection means all findings are gone, not merely documented.
