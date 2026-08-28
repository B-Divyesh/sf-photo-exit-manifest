# Polish 1 handoff — Photo Exit Manifest

## Outcome

Perfection-loop round 1 is complete. Every finding in `.factory/review-1.md` is fixed and mapped in `.factory/polish-1.md`.

Repair commit `e1a7155b6aa851ee51aa2127eff032803cefb630` is pushed to `origin/main`. Final static deployment `27e83bb0-0303-4bcc-91e8-55c19f3d90c0` is live at https://photo-exit-manifest.sociobot.in/.

## Delivered

- A one-click `/?demo=1` browser demo with a persistent sandbox banner, reset, exit, complete sample audit, signed migration report, and terminal record.
- A real `photo-exit-manifest demo` command using bundled fixtures in a new temporary workspace.
- Eleven registered claims with one tagged observable test each.
- Plain first-screen wording, one primary action, consistent terminology, and a completed copy audit.
- Distinct titles and metadata for home, demo, privacy, terms, and the styled 404.
- Real static routes, HTTP 404 handling, route-change focus, consistent navigation/footer/legal links, and mobile-specific layout.
- An original art-derived 1200×630 social card and 180×180 archive-mark touch icon.
- A one-to-one planning comparison fix so one destination item cannot satisfy two source items.
- Updated README, demo guide, visual thesis, catalog description, privacy policy, and terms.

## Verification evidence

A separate clean checkout of `e1a7155` passed:

```sh
npm ci
# all 11 commands listed in .factory/claims.json, run separately
npm test
cargo fmt --check
cargo clippy --all-targets -- -D warnings
npm run build
cargo package --allow-dirty
```

Totals: 7 Rust unit tests, 4 CLI integration tests, 2 route tests, 1 production PWA test, 4 browser tests, and 11 claim tests. The package verification compiled all 87 packaged files.

Live evidence after deployment:

- Factory URL verifier: HTTP 200, correct title/lang/h1/main/alt labels, zero console errors.
- Axe: 0 violations at 390px and 1366px across all five pages.
- Cold browser: sample redirect, banner/reset/exit, empty storage, same-origin requests, mobile fit, real route titles, HTTP 404, and offline demo reload passed.
- Local/live hashes match for all HTML routes and `sw.js`.
- Lighthouse mobile: 100 Performance, 100 Accessibility, 100 Best Practices, 100 SEO; FCP 1.1s, LCP 1.5s, TBT 90ms, CLS 0.022.
- Build sizes: initial route JS 2.00 KB raw / 1.12 KB gzip; CSS 21.68 KB raw / 5.60 KB gzip; fonts 44.98 KB; hero 71.84 KB.

Screenshots and reports are under `.factory/evidence/polish-1/`, including `screenshot-desktop.png`, `screenshot-mobile.png`, `live-demo-mobile.png`, `verify.json`, and `lighthouse-live.json`.

## Run and deploy

```sh
npm ci
npm test
npm run build
/opt/fleet/lib/deploy-static.sh photo-exit-manifest dist/site
```

## Known gaps

None. The unavailable paid offer was removed instead of linking to a nonexistent checkout. Registry publication remains factory-owned and was not performed.
