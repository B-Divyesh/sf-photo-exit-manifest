# Photo Exit Manifest

Photo Exit Manifest is a local, read-only CLI for families leaving Google Photos or another consumer cloud. It inventories an export and an independent archive, compares the evidence, records what every phone should do after cutover, and writes a signed checklist. It moves and deletes nothing.

## Usage

The complete workflow is one command:

```sh
photo-exit-manifest run \
  --source ~/Downloads/Takeout/Google\ Photos \
  --destination /Volumes/FamilyArchive/Photos \
  --policies policies.json \
  --out ./exit-manifest \
  --sign "Alex Morgan"
```

Create and edit a documented policy template first:

```sh
photo-exit-manifest init --output policies.json
```

The run writes `source-inventory.json`, `destination-inventory.json`, `audit.json`, `manifest.json`, and `CUTOVER.md`. It succeeds only when every source asset is matched or has a named exception, every source album label is observed at the destination or has a named reviewed resolution, at least 99.5% of assets are accounted for, and `--sign` names the reviewer. An unsigned or non-ready audit exits with code `2`, while invalid input or I/O failure exits with `1`.

For staged or automated workflows:

```sh
photo-exit-manifest inventory ~/Takeout --kind takeout --output source.json --json
photo-exit-manifest inventory /mnt/archive --kind folder --output destination.json --json
photo-exit-manifest compare --source source.json --destination destination.json \
  --exceptions exceptions.json --output audit.json --json
photo-exit-manifest manifest --audit audit.json --policies policies.json \
  --output CUTOVER.md --sign "Alex Morgan" --json
```

`exceptions.json` names intentional differences:

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

An album exception is only for a source label the destination cannot expose (for example, a provider-only shared album). It must name that label and state the reviewed resolution; unreviewed album gaps keep the manifest on hold.

Use `--hash sha256` (the default) for cutover evidence. `--hash none` is a faster planning pass and matches conservatively by filename, byte size, and capture time where available. The scanner recognizes common photo, RAW, and video formats and reads adjacent Google Takeout JSON defensively. Proprietary edits may not be portable; edited-looking files and sidecar gaps are called out in the report.

## Install

Build the single binary from source:

```sh
cargo install --path .
photo-exit-manifest --help
```

Rust 1.85 or newer is supported. Release archives are published by the factory; this repository does not publish itself.

## Develop and verify

```sh
cargo test
npm install
npm test
npm run build       # Rust release binary + static site in dist/site
npm run build:site  # static site only in dist/site
```

The website is a Vite-powered static documentation site. `npm run dev` serves it locally. No archive data, license token, or policy content is sent by the CLI; billing verification on the website sends only the entered license token to Sociobot.

## Deploy

Deploy `dist/site/` as the static root. The factory owns deployment, DNS, billing registration, and package publishing.

## Project status

Version `0.1.0`. See [CHANGELOG.md](CHANGELOG.md). Licensed under MIT.
