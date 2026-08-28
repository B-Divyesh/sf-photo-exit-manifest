# Adversarial first-read review 1 — FAIL

**Reviewed:** 2026-08-28 UTC  
**Candidate:** `0b094d265dc36c112e8c169a22834cb4336ec936`  
**Live URL:** `https://photo-exit-manifest.sociobot.in/`

## Verdict

**FAIL.** There are six BLOCKING findings. The page has a distinctive, well-rendered visual treatment and the ordinary test/build suite passes, but a first-time visitor cannot try the advertised CLI safely in one click. The required claim registry is absent, the paid link is broken, and unknown URLs impersonate the home page.

## Cold first read

Fresh Playwright contexts loaded the live home page at **390×844** and **1440×900**, at `scrollY = 0`, before any interaction.

My best inference was: “This is a local CLI intended to help a family check a photo archive before leaving a cloud service.” The audience is only implied by “your family”; Google Photos and an actual archive are not named on the mobile first screen. I could not determine what to click first: the two equally prominent controls are **“Run your first audit”** and **“Try the readiness gate”**. The first is a documentation anchor and the second is a calculator anchor, not a runnable sample audit.

This is BLOCKING under the first-screen test. The exact headline, **“Leave the cloud. Keep the proof.”**, describes neither the job nor the first action. Replace the first screen with:

> **Verify your family photo archive before leaving the cloud**  
> For families moving photos from Google Photos to their own archive.  
> **Try it with sample data** — see a completed audit and signed manifest.

Put the three short facts beside it: “Reads folders only”, “No photos uploaded”, and “Free CLI”.

## Findings, highest severity first

### BLOCKING — No one-click, isolated CLI demo

**Evidence.** There is no `/demo`, no demo banner, no Reset control, no sample input, and no `examples/` directory. A fresh live visit to `/?demo=1` returned the ordinary landing page (`h1`: “Leave the cloud.Keep the proof.”), no `Demo — sample data, nothing is saved` text, no `Reset demo`, and no storage namespace. In a temporary directory, `photo-exit-manifest demo` failed with `error: unrecognized subcommand 'demo'`.

The page calls the calculator a demo: **“This browser demo calculates only the gate. The CLI performs the real local scan.”** That confirms it is not a demonstration of the product’s real job. Its defaults (2,048 source, 2,046 matched, two exceptions) are not a complete realistic scan, and no first click displays an inventory, exceptions, or manifest.

**Why this loses/misleads a visitor.** The product is a CLI whose value is its real scan and manifest. A visitor must install Rust, create folders and policies, and supply their own archive before seeing it work. The calculator can make a “Ready” result look like product proof without exercising the product.

**Concrete fix.** Ship realistic, bundled `examples/` source/archive/policy files; add `photo-exit-manifest demo` that copies them into a fresh temporary directory, runs the same `run` flow, prints the output location, and changes nothing outside that directory. Add a self-hosted terminal recording to the landing page. The first-screen primary button must be **“Try it with sample data”**, open `/demo` (or document the command), show the completed inventory/audit/manifest immediately, and retain a persistent **“Demo — sample data, nothing is saved”** banner with **“Reset demo”** and **“Start for real”**. Add `.factory/demo.md` and a test that proves the demo writes only beneath its temporary directory.

### BLOCKING — Claims registry and claim tests are missing

**Evidence.** `.factory/claims.json` does not exist, so there were zero listed claim commands to run from the clean checkout. The required mapping between visitor-facing promises and `@claim:<id>` tests therefore cannot be verified.

**Why this loses/misleads a visitor.** The page and README ask a family to rely on privacy, accounting, CLI, licensing, and offline behaviour. Without a registry and observable tests, those promises have no release gate.

**Concrete fix.** Add `.factory/claims.json`, one clean-sandbox test per claim, and remove any claim that cannot be tested. At minimum cover: CLI does not make network requests or alter inputs; `run` produces the documented audit/manifest; named exceptions affect readiness; bundled demo isolation; offline reload after first visit; and checkout/licence behaviour. Use the required `@claim:<id>` tags and run every listed command in CI.

### BLOCKING — Every page/README promise is an unlisted claim

Because the claims manifest is absent, all of the following claim-like copy is unlisted. This is one finding per group of exact sentences; each needs an entry and observable test, or deletion/rewording.

| Location | Unlisted claim-like copy |
| --- | --- |
| Hero/evidence | “Read-only · local · provider-neutral”; “0 photos uploaded by us”; “SHA-256 byte-level evidence”; “99.5%+ accounting target”; “1 file signed cutover record” |
| Workflow | “Your source and archive remain untouched.”; “Read Takeout sidecars, dates, album hints, rendered edits, media types, byte sizes, and SHA-256 hashes.”; “Match exact bytes…”; “Record uploads, deletions, conflicts, and offline behavior per device.” |
| Planner/docs | “This browser demo calculates only the gate. The CLI performs the real local scan.”; “Ready to review and sign.”; “Factory-built release binaries follow the same interface.”; “Adjacent and title-indexed JSON sidecars are recognized.”; “Duplicate album copies collapse by content hash while retaining album labels.”; “No hashes means planning-only.”; “Every command is non-interactive.” |
| Paid section | “The free CLI performs unlimited inventories, comparisons, exceptions, JSON exports, and signed manifests.”; “A $29 one-time license unlocks…”; “No subscription”; “No photo access”; “License works across your browsers”; “Refunds are handled there and revoke the license.” |
| README | “It moves and deletes nothing.”; the readiness/99.5%/exit-code conditions; hash-mode behaviour; supported formats/Takeout JSON; edit portability; Rust support; release availability; the no-data/network statement; and deployment ownership |

### BLOCKING — The paid primary link is dead

**Evidence.** The visible **“Buy Family Pack — $29”** URL, `https://api.sociobot.in/api/v1/products/photo-exit-manifest/checkout`, returned **HTTP 404** on 2026-08-28.

**Why this loses/misleads a visitor.** A visitor is offered a specific $29 purchase that cannot be started.

**Concrete fix.** Configure the live Sociobot product/checkout route, then add a link-crawl test asserting a successful redirect or checkout response. Until it exists, remove the price and purchase button rather than advertising an unavailable purchase.

### BLOCKING — Unknown deep links silently become the home page

**Evidence.** `GET /not-a-real-route` returns **HTTP 200** with title **“Photo Exit Manifest — Prove your photo migration is complete”** and the home-page h1, not a 404 page.

**Why this loses/misleads a visitor.** A mistyped bookmark or a shared broken link looks valid but shows unrelated content. It is neither a designed 404 nor an honest route response.

**Concrete fix.** Publish a product-styled 404 with a “Back to Photo Exit Manifest” link and a real 404 status. Keep navigation fallback only for defined SPA routes, and test direct load/reload/back on `/demo`, `/privacy`, `/terms`, and an unknown route.

### BLOCKING — Required metadata is incomplete on every route

**Evidence.** On `/`, `/privacy/`, and `/terms/`, fresh browser inspection found no canonical link. The home page also had no Open Graph tags, no Twitter card tags, and no Apple touch icon. The privacy and terms routes lacked all of those share/canonical tags as well.

**Why this loses/misleads a visitor.** Shared links have no product artwork or controlled description, and search engines have no declared canonical URL. This misses the site-structure release gate.

**Concrete fix.** Add per-route canonical, OG title/description/image, Twitter card/title/description/image, and an 180px apple-touch icon. Use a real 1200×630 image derived from the archive-glass art and verify the tags/URLs in an automated route test.

### Major — Header/footer skeleton is inconsistent and incomplete

**Evidence.** The home header has Workflow, Docs, Family Pack, and Source but no Privacy link. The home footer lacks “Built by Param Factory” and a version/build ID. Legal-page footers differ again and omit the source/one-line product treatment. The global header/footer contract is therefore not consistent across the three published pages.

**Concrete fix.** Use one shared header/footer on all routes: wordmark/home, Demo, product navigation, Privacy; footer with one-line purpose, Privacy, Terms, “Built by Param Factory”, and build/version ID.

### Major — First-screen language is metaphor-first and two actions compete

**Evidence.** **“Leave the cloud. Keep the proof.”**, **“Local migration assurance”**, **“The safe way out”**, and **“One path through the uncertainty.”** require the following copy to understand. “Cut over”, “readiness gate”, “accounted for”, “sidecars”, “rendered edits”, and “provider-neutral” are unexplained technical/product jargon. The buttons **“Run your first audit”** and **“Try the readiness gate”** do not say what result a visitor gets and point to different anchors.

**Concrete fix.** Use the proposed plain job headline and one single primary demo action. Replace “cutover” with “switch”, “readiness gate” with “checklist result”, and define or remove “sidecar”. Rename the secondary action **“See how the sample audit is checked”** only after a real demo exists.

### Major — Terminology changes without explanation

**Evidence.** The same output is called a **“signed checklist”** (README), **“signed cutover record”** (landing), **“signed manifest”** (landing/README), **“audit”**, **“proof”**, and a **“cutover plan.”** The actual user action is also variously “leave”, “cuts over”, “cutover”, “switch”, and “migration.”

**Why this loses a visitor.** A family cannot tell whether these are separate files or the same report, or when it is safe to act.

**Concrete fix.** Choose one output name everywhere, e.g. **“signed migration report”**; define it once. Use **“switch from Google Photos”** consistently for the event.

## Demo and sandbox checks

- A fresh context at `/?demo=1` showed no isolated state, banner, reset, start-for-real action, or realistic sample record.
- No demo storage namespace existed because no demo exists. Consequently, separation of demo and real storage could not be verified.
- The live PWA did reload offline after a first online visit: `#planner-form` rendered and the offline notice appeared. The initial network requests observed were same-origin assets only. This is not acceptance evidence for the unregistered offline/privacy claims; it merely records the exercised behaviour.
- The CLI has no `demo` command and no shipped sample data, so the required temporary-directory CLI sandbox could not be exercised.

## Structure, accessibility, and link checks

Passes observed: `lang="en"`, exactly one h1 on each published route, a main landmark, meta descriptions, SVG favicon, visible mobile layout without a console/page error, Privacy/Terms pages, and a distinct luminous archive visual identity rather than a generic SaaS template. The 390px hero image and typography are product-specific and readable.

Live internal links to `/`, `/privacy/`, and `/terms/` returned 200. The GitHub source link returned 200. The checkout link returned 404 (blocking finding above). The unknown route failure and metadata omissions are recorded above.

## Copy audit

Word counts treat hyphenated terms and command/file tokens as one word. Code blocks are commands rather than sentences and are excluded. Headings, labels, and buttons are listed separately because the plain-words review also applies to them.

### Landing-page sentences

| Words | Exact sentence |
| ---: | --- |
| 3 | Leave the cloud. |
| 3 | Keep the proof. |
| 19 | Inventory every photo, name every difference, and decide what each phone will do next—before your family cuts over. |
| 5 | One path through the uncertainty. |
| 3 | The tool observes. |
| 2 | You decide. |
| 6 | Your source and archive remain untouched. |
| 15 | Read Takeout sidecars, dates, album hints, rendered edits, media types, byte sizes, and SHA-256 hashes. |
| 15 | Match exact bytes, surface missing items, and require a plain-language reason for every accepted exception. |
| 9 | Record uploads, deletions, conflicts, and offline behavior per device. |
| 7 | Sign only when the evidence is ready. |
| 5 | See what “accounted for” means. |
| 7 | This browser demo calculates only the gate. |
| 7 | The CLI performs the real local scan. |
| 5 | Ready to review and sign. |
| 8 | Keep the old cloud during the retention window. |
| 6 | From folders to a signed manifest. |
| 4 | Install from source today. |
| 7 | Factory-built release binaries follow the same interface. |
| 7 | Adjacent and title-indexed JSON sidecars are recognized. |
| 11 | Duplicate album copies collapse by content hash while retaining album labels. |
| 4 | No hashes means planning-only. |
| 16 | Missing files, absent album labels, edited copies, and unsafe retention policies keep the manifest on hold. |
| 4 | Every command is non-interactive. |
| 15 | Add `--json` for scripts; exit code 2 means evidence exists but cutover is not ready. |
| 5 | Make the device decisions together. |
| 12 | The free CLI performs unlimited inventories, comparisons, exceptions, JSON exports, and signed manifests. |
| 15 | A $29 one-time license unlocks this browser-based multi-device policy builder and reusable policy files. |
| 6 | Sociobot / Dodo is merchant of record. |
| 8 | Refunds are handled there and revoke the license. |
| 6 | The free CLI remains fully available. |
| 11 | Unlock the Family Pack to build this file in your browser. |
| 2 | Proof first. |
| 2 | Cutover second. |
| 6 | Local migration assurance for family archives. |

No individual landing sentence exceeds 22 words. The flags are jargon, unlisted claims, contextless headings, and ambiguous actions rather than length.

### README sentences

| Words | Exact sentence |
| ---: | --- |
| 17 | Photo Exit Manifest is a local, read-only CLI for families leaving Google Photos or another consumer cloud. |
| **24** | It inventories an export and an independent archive, compares the evidence, records what every phone should do after cutover, and writes a signed checklist. |
| 5 | It moves and deletes nothing. |
| 6 | The complete workflow is one command. |
| 8 | Create and edit a documented policy template first. |
| 8 | The run writes `source-inventory.json`, `destination-inventory.json`, `audit.json`, `manifest.json`, and `CUTOVER.md`. |
| **41** | It succeeds only when every source asset is matched or has a named exception, every source album label is observed at the destination or has a named reviewed resolution, at least 99.5% of assets are accounted for, and `--sign` names the reviewer. |
| 19 | An unsigned or non-ready audit exits with code `2`, while invalid input or I/O failure exits with `1`. |
| 5 | For staged or automated workflows. |
| 4 | `exceptions.json` names intentional differences. |
| 19 | An album exception is only for a source label the destination cannot expose (for example, a provider-only shared album). |
| 18 | It must name that label and state the reviewed resolution; unreviewed album gaps keep the manifest on hold. |
| 8 | Use `--hash sha256` (the default) for cutover evidence. |
| 19 | `--hash none` is a faster planning pass and matches conservatively by filename, byte size, and capture time where available. |
| 16 | The scanner recognizes common photo, RAW, and video formats and reads adjacent Google Takeout JSON defensively. |
| 17 | Proprietary edits may not be portable; edited-looking files and sidecar gaps are called out in the report. |
| 6 | Build the single binary from source. |
| 6 | Rust 1.85 or newer is supported. |
| 13 | Release archives are published by the factory; this repository does not publish itself. |
| 8 | The website is a Vite-powered static documentation site. |
| 6 | `npm run dev` serves it locally. |
| **26** | No archive data, license token, or policy content is sent by the CLI; billing verification on the website sends only the entered license token to Sociobot. |
| 7 | Deploy `dist/site/` as the static root. |
| 10 | The factory owns deployment, DNS, billing registration, and package publishing. |
| 2 | Version 0.1.0. |
| 2 | See CHANGELOG.md. |
| 3 | Licensed under MIT. |

### Copy findings and rewrites

| Flag | Quote | Proposed rewrite |
| --- | --- | --- |
| Headline has no job | “Leave the cloud. Keep the proof.” | “Verify your family photo archive before leaving the cloud.” |
| Jargon / vague audience | “Local migration assurance” | “Checks a Google Photos export against your new photo archive.” |
| Jargon | “before your family cuts over” | “before your family switches.” |
| Contextless heading | “The safe way out” / “One path through the uncertainty.” | “Check your archive before switching.” |
| Jargon | “Takeout sidecars”, “rendered edits”, “readiness gate”, “accounted for”, “cutover” | Define once in plain language or use “Google export notes”, “edited files”, “check result”, “explained”, and “switch”. |
| Ambiguous buttons | “Run your first audit”; “Try the readiness gate” | “Try it with sample data — see a completed audit”; secondary “See how the check works”. |
| Button does not name result | “Copy command” | “Copy install command”. |
| Contextless heading | “Defensive Takeout reader” | “Reads Google Photos export notes”. |
| Marketing/technical heading | “Automation-ready” | “Use it in a script”. |
| Inconsistent output words | “signed checklist” / “signed cutover record” / “signed manifest” | Use “signed migration report” everywhere. |
| README >22 words | 24-word inventory sentence | “It compares your Google export with your new archive. It records device choices and writes a signed migration report.” |
| README >22 words | 41-word readiness sentence | “A report is ready only when every photo is matched or has a named exception. Every album label needs a reviewed resolution. A signer reviews the result.” |
| README >22 words | 26-word website/privacy sentence | “The CLI sends no archive data. The website sends a licence token only when you ask it to verify a purchase.” |

## Verification record

From a detached clean worktree at the candidate commit:

```sh
npm ci
npm test
npm run build
```

All passed on the final run: 6 Rust unit tests, 3 CLI integration tests, 3 site tests, 1 PWA test; the build produced `dist/site/` and `dist/package/photo-exit-manifest-linux-x86_64`. An earlier repeat encountered a transient occupied test port (`4178`) after an interrupted process; the clean rerun passed once the port was free. No `.factory/claims.json` command could be run because that file is absent.

The verdict remains **FAIL** until all blocking findings are fixed and re-reviewed.
