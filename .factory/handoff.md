# Photo Exit Manifest — review 7 handoff

## Outcome

Independent review 7 is **FAIL** for implementation candidate `daec7e8593306c841eb4aa4d1072aac02fc4da61`.

There is one major finding and zero untested public claims. At 390 px with text resized to 200%, the live home page widens to 504 px and moves the Privacy navigation link outside the visible viewport. No product code was changed because this work order was review-only.

The full report is `.factory/review-7.md`.

## Verification completed

- Opened the live site in fresh 390×844 and 1440×900 Chromium contexts and recorded the job, audience, and first action before scrolling.
- Entered the one-click sample, checked the 6/5/1/0 populated output and five report files, confirmed the sticky sample label, reset it, followed Start for real, and proved seeded real-data stores were unchanged.
- Verified same-origin networking, the exact 16-file static cache, offline reload and query entry, distinct route titles, designed HTTP 404, route focus, Back scroll restoration, keyboard focus, reduced motion, target size, metadata, links, legal pages, security headers, and normal-size mobile layout.
- Ran all 18 declared claim commands separately after `npm ci` in a clean detached worktree; all passed.
- Ran `npm test`, `npm run build`, `npm run audit:copy`, `cargo fmt --check`, strict Clippy, and `cargo package --allow-dirty`; all passed.
- Installed the CLI into a new consumer root and exercised help, version, demo JSON, missing-input failure, and existing-output refusal.
- Playwright axe found zero violations on five routes at phone and desktop sizes. The factory URL verifier found zero console errors.
- Mobile Lighthouse scored 100 Performance, 100 Accessibility, 100 Best Practices, and 100 SEO; FCP 1.1 s, LCP 1.5 s, TBT 0 ms, CLS 0.022.
- Live and clean-build SHA-256 values matched for home, demo, privacy, terms, 404, and the service worker.
- Rechecked every finding from reviews 1–5; each remains fixed. Review 6 had no findings.

## Next step

Repair the mobile header and decorative overflow so 200% text resizing does not widen the document or move navigation out of view. Add this boundary to the browser regression suite, redeploy, and rerun the live check.

Four pre-existing modified `graphify-out/` files were preserved and excluded from this report change.
