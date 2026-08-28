# Photo Exit Manifest — polish 5 handoff

## Outcome

Repair commit: `daec7e8593306c841eb4aa4d1072aac02fc4da61`.

This closes both blocking regressions in review 5. Same-origin navigation now saves the leaving scroll position once, so Back restores the original position and moves focus to the page heading. The README and privacy page now accurately distinguish family data from the static app and bundled sample page stored for offline use.

Deployment `086b176d-caef-4dcd-a401-2f66e9efeede` is live at <https://photo-exit-manifest.sociobot.in/>.

## Verification

- Fresh clone: `/tmp/photo-exit-polish5-clean-s9HUlR/repo` at `daec7e8`; `npm ci`, every one of the 18 commands in `.factory/claims.json`, and `npm test` passed. Individual claim results: `/work/.evidence/polish5-clean-claims.log`.
- Local quality gates passed: `npm test`, `npm run audit:copy`, `npm run build`, `cargo fmt --check`, `cargo clippy --all-targets -- -D warnings`, and `cargo package --allow-dirty` (105 files, 329.9 KiB compressed).
- Live basic verifier: 750 ms cold load, title/lang/one h1/main/alt/button checks and zero console errors. Evidence: `/work/.evidence/polish5-live/verify.json`.
- Live cold route/demo/history check: home, demo, privacy, terms, and 404 returned the expected titles; unknown route returned 404; `?demo=1` canonicalized to `/demo/`, showed 6/5/1/0, reloaded offline, and used the one versioned 16-file static cache. Back restored scroll `700 → 700` with the home h1 focused. Evidence: `/work/.evidence/polish5-live/live-recheck.json`.
- Live axe: zero serious or critical findings across home, demo, privacy, terms, and 404 at 390px and 1366px. Evidence: `/work/.evidence/polish5-live/axe-live.json`.
- Lighthouse mobile: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 1.1 s, LCP 1.5 s, TBT 0 ms, CLS 0.022. Evidence: `/work/.evidence/polish5-live/lighthouse.json`.

## Run and package

```sh
npm ci
npm test
npm run build
cargo package --allow-dirty
```

The static site is `dist/site/`; the ready-to-publish Linux executable is `dist/package/photo-exit-manifest-linux-x86_64`. Run the isolated CLI sample with `cargo run -- demo`.

## Known gaps

None. Four pre-existing `graphify-out/` generated-file changes were preserved and intentionally excluded from the repair commits.
