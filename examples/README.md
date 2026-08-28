# Bundled family archive example

This fixture models a small Google Photos export and an independent archive.
It contains six unique media records, one duplicate album copy, five archive
matches, and one named exception for a damaged video kept on another backup.

The `.jpg`, `.heic`, `.mov`, and `.mp4` files contain short, non-personal fixture
bytes rather than real family photos. Their names, folder structure, export note,
album duplicate, policy, and exception are realistic inputs to the production
scanner. `photo-exit-manifest demo` copies this directory to a new temporary
workspace before running the normal audit pipeline.
