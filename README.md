# Photo Exit Manifest

Photo Exit Manifest checks a Google Photos export against a family archive. It records the result in a signed migration report.

The CLI reads local folders without changing them. It does not move, edit, restore, delete, or upload photos.

## Try the bundled sample

Run the sample to see a finished audit:

```sh
cargo run -- demo
```

The command creates a new temporary workspace. It copies the fixtures there, runs the normal audit, and prints the report path.

The workspace contains six unique source items. Five match the archive. One missing video has a named exception.

You can also [open the browser demo](https://photo-exit-manifest.sociobot.in/?demo=1). The demo stores no sample or family data. A service worker caches the app files needed for offline use.

## Run an archive check

Create a policy file, then review its device choices:

```sh
photo-exit-manifest init --output policies.json
```

Run the complete check:

```sh
photo-exit-manifest run \
  --source ~/Downloads/Takeout/Google\ Photos \
  --destination /Volumes/FamilyArchive/Photos \
  --policies policies.json \
  --out ./migration-report \
  --sign "Alex Morgan"
```

The output folder contains these five files:

- `source-inventory.json`
- `destination-inventory.json`
- `audit.json`
- `manifest.json`
- `CUTOVER.md`

A report is ready only when every source item is matched or explained. Every missing album label also needs a reviewed resolution.

An unsigned or held report exits with code `2`. Invalid input or an I/O failure exits with code `1`.

## Review differences

`exceptions.json` records accepted differences by name:

```json
{
  "exceptions": [
    {"source_path": "2012/IMG_0042.JPG", "reason": "Unreadable before export; paper original retained"}
  ],
  "album_exceptions": [
    {"album": "Family Album", "reason": "Recreated in the archive catalog; reviewer checked membership"}
  ]
}
```

SHA-256 is the default comparison mode. The scanner also reads adjacent Google Photos export notes and keeps album labels from duplicate copies.

Use `--hash none` only for planning. That mode compares filenames, byte sizes, and capture times where available.

Edited-looking files and missing export notes appear as warnings. Review those items before changing the old cloud library.

## Use it in scripts

Every command is non-interactive. Add `--json` for machine-readable status:

```sh
photo-exit-manifest inventory ~/Takeout --kind takeout --output source.json --json
photo-exit-manifest inventory /mnt/archive --kind folder --output destination.json --json
photo-exit-manifest compare --source source.json --destination destination.json \
  --exceptions exceptions.json --output audit.json --json
photo-exit-manifest manifest --audit audit.json --policies policies.json \
  --output CUTOVER.md --sign "Alex Morgan" --json
```

## Install

Build the single binary from source:

```sh
cargo install --path .
photo-exit-manifest --help
```

The crate supports Rust 1.85 or newer.

## Develop and verify

```sh
npm ci
npm test
npm run build
cargo fmt --check
cargo clippy --all-targets -- -D warnings
cargo package --allow-dirty
```

The Vite site builds to `dist/site/`. The packaged Linux binary builds to `dist/package/`.

The CLI has no account, paid feature, or network connection. The website uses no analytics or third-party scripts.

## Deploy

Deploy `dist/site/` as the static root.

Version `0.1.0` is licensed under the [MIT License](LICENSE). See [CHANGELOG.md](CHANGELOG.md).
