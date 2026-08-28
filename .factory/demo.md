# Demo sandbox

## Browser

- One-click entry: `https://photo-exit-manifest.sociobot.in/?demo=1`
- Canonical route: `https://photo-exit-manifest.sociobot.in/demo/`
- Sample: six Morgan family media records, five exact archive matches, and one named exception.
- Reset: **Reset demo** closes every disclosure and returns focus to the sample heading.
- Exit: **Start for real** opens the local install instructions.

The browser demo is static and writes no cookies, local storage, session storage, IndexedDB, or OPFS data. Its demo namespace is therefore an empty, isolated browser context rather than a shared persistence key. It cannot read local folders.

## CLI

Run:

```sh
photo-exit-manifest demo
```

The binary creates `photo-exit-manifest-demo-<pid>-<nonce>` below the operating system temporary directory. It copies `examples/` into that new workspace and runs the same code path as `photo-exit-manifest run`.

Pass `--output <new-path>` to choose a new sandbox directory. The command refuses an existing path. It writes only below that directory and prints the generated `migration-report` path.

The fixture media contains short non-personal bytes, not real photographs. Run `photo-exit-manifest demo` again for a clean reset.
