# Review-1 handoff — Photo Exit Manifest

## Outcome

Independent adversarial first-read review completed on 2026-08-28 UTC for candidate `0b094d265dc36c112e8c169a22834cb4336ec936`.

**Result: FAIL.** The complete evidence and required fixes are in `.factory/review-1.md`.

## What was checked

- Fresh live desktop (1440px) and phone (390px) first views, before scrolling.
- Demo entry points (`?demo=1`) and CLI `demo` command in a temporary directory.
- Live offline reload after service-worker activation, request origins, console errors, links, metadata, legal routes, unknown-route response, and visual identity.
- All available normal tests/build commands in a detached clean worktree:

```sh
npm ci
npm test
npm run build
```

Those normal commands passed on the final clean run. Claim verification was not possible because `.factory/claims.json` is missing.

## Release blockers

1. No one-click isolated sample-data demo or CLI demo command.
2. No `.factory/claims.json` or claim-tagged tests; all visitor-facing claims are unlisted.
3. The live $29 checkout link returns HTTP 404.
4. Unknown live routes return the landing page with HTTP 200 rather than a designed 404.
5. Canonical/OG/Twitter/apple-touch metadata is absent.
6. The cold first screen is metaphor-led and offers two documentation/calculator actions rather than a clear sample-data first step.

## Workspace note

Pre-existing dirty files under `graphify-out/` were preserved and not included in this review commit. No product source code was modified.
