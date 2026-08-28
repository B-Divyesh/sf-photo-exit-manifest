# Copy audit — polish 4

Generated from the production landing page and README on 28 August 2026 with `npm run audit:copy`.

Token rule: collapse whitespace, then count whitespace-delimited tokens. Hyphenated words and file tokens count once. Markdown links count as their visible labels. Code blocks and file-list items are excluded.

## Landing-page prose

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

## Landing headings, labels, and actions

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

## README prose

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

## Flags

No landing or README sentence exceeds 22 words or contains a banned marketing term.

## Terminology

| Concept | One term used |
| --- | --- |
| The comparison result | audit |
| The five output files together | signed migration report |
| The old-to-new service event | switch from Google Photos |
| A reviewed missing item | named exception |
| The independent destination | family archive |
| The sample experience | demo |

“Google export note” is the site’s plain-language term for an adjacent Google Takeout JSON file. The CLI keeps `takeout` as its command argument.
