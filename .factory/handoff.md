# Photo Exit Manifest v0.1.0 — verification handoff

## Release status — PASS

Independent QA passed candidate commit `8d778ec82d24fef9f5344585982164b919f245a5` on 2026-08-27 UTC. The deployed site at https://photo-exit-manifest.sociobot.in/ byte-matches the candidate production build for the primary page, service worker, app assets, fonts, hero image, and legal routes. No defects were found.

Full evidence is in `.factory/verification-2.md`.

## How verified

From a detached clean Git worktree at the candidate:

```sh
npm ci
npm test
cargo fmt --check
cargo clippy --all-targets -- -D warnings
npm run build
cargo package --allow-dirty
```

All commands passed. `npm test` includes 6 Rust unit tests, 3 CLI integration tests, typecheck/planner tests, and a Chromium test that verifies the production service worker offline reload and prior-worker update. `npm run build` produces `dist/site/` and the 1,288,472-byte Linux binary at `dist/package/photo-exit-manifest-linux-x86_64`.

The publishable Cargo package is 193.1 KiB compressed and was installed into a separate consumer root with:

```sh
cargo install --path target/package/photo-exit-manifest-0.1.0 --root /tmp/pem-consumer --locked
/tmp/pem-consumer/bin/photo-exit-manifest --help
```

The installed CLI wrote a JSON policy template and correctly rejected empty and missing input paths with exit code 1. Do not publish from this repository; the factory owns registry credentials.

Live QA passed `/opt/fleet/lib/verify-url.sh`, axe at 1366px and 390px across the three routes, keyboard/focus/reduced-motion/runtime checks, offline reload, headers/cache/CSP checks, and mobile Lighthouse (100 Performance, 100 Accessibility, 100 Best Practices, 100 SEO; LCP 1.5 s, CLS 0). There are no known release blockers.

## Known limitations / next steps

- New or malformed Google Takeout sidecar shapes are warned about rather than guessed.
- Local exports cannot prove provider-only edits, sharing permissions, face groups, comments, or Live Photo coupling; the manifest makes those review items explicit.
- Future factory work may add platform release binaries. The CLI and website never transfer or host archives.
