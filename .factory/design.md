# Visual thesis — Luminous archive glass

## Direction

Photo Exit Manifest lives between a family memory collection and a risky switch. Its visual world is a **luminous glass data landscape**: translucent archive planes carry tiny amber memory frames across a deep ink field toward a stable cyan vault. Glass is used as an explanatory material—layers mean source, verification, and destination—not as decorative card chrome. The mood is calm, precise, and night-lit rather than futuristic or celebratory.

The site is deliberately single-mode. The midnight environment is part of the product metaphor and makes the luminous verification paths legible; every surface and control is painted explicitly.

## Tokens

- Background / archive night: `#07121A`
- Raised field: `#0D202A`
- Glass surface: `rgba(19, 48, 61, .72)`
- Primary text / frost: `#F4F8F5`
- Muted text / mist: `#B5C6C7`
- Accent / verification cyan: `#5FE3D4`
- Accent contrast: `#061A1A`
- Memory amber: `#F7B65B`
- Success: `#79E2A7`; warning: `#FFD078`; danger: `#FF8F91`
- Hairline: `rgba(164, 220, 218, .24)`; focus: `#A7FFF3`

Contrast is checked against the solid background beneath each translucent layer. Body text never sits directly over the illustration.

## Type

The product uses self-hosted **Instrument Sans** (SIL OFL, regular and semibold, subset WOFF2) for the interface and **IBM Plex Mono** (SIL OFL, medium subset WOFF2) for commands, counts, and manifest marks. Instrument Sans keeps family-facing instructions humane; Plex Mono makes evidence feel inspectable rather than mysterious. The scale is 16, 18, 22, 30, 48, and 68px with 1.5 body leading and tabular figures for evidence.

## Spacing and composition

An 8px base rhythm drives gaps of 8, 16, 24, 32, 48, 72, and 112px. Copy stays between 48–70 characters. The desktop hero is an asymmetrical 5/7 split with the generated archive landscape allowed to bleed right; at 390px the art becomes a shallow horizon below the primary action and evidence rail stacks. Touch targets are at least 44px.

Content is grouped by proximity first. Bordered panes appear only for independent objects: a source, a destination, or a policy. Verification is represented by one continuous cyan path through these layers.

## Interaction grammar

- Primary actions fill with cyan and depress by 1px; secondary actions remain clear glass.
- Evidence appears immediately; audit counts use stable tabular figures so no number can be mistaken during motion.
- Native disclosure panels open from their trigger edge without scripted animation.
- Errors use an icon and concrete recovery language in addition to color.
- Keyboard focus uses a 3px frost ring with a 3px offset.

Under `prefers-reduced-motion: reduce`, control transitions drop to 0.01ms and smooth scrolling is disabled. Nothing loops, autoplays, or flashes.

## Original asset plan and provenance

`site/public/archive-landscape.webp` is an original raster hero generated on 2026-08-27 with the factory image deployment via `/opt/fleet/lib/gen-image.sh`, then resized and encoded locally to WebP. Prompt: “A cinematic wide editorial 3D illustration for a privacy-first photo archive migration tool: a deep midnight data landscape with three translucent luminous glass planes receding toward a stable cyan archive vault, dozens of tiny warm amber photo slides moving along one clear cyan verification path, subtle etched hash marks and album tabs, calm precise atmosphere, high-end product art, lots of dark negative space on the left for copy, composition weighted to the right, physically plausible glass and soft volumetric light, no people, no logos, no words, no letters, no UI screenshot, no generic gradient, no watermark.” Generated asset is used under the product's MIT project license. No stock assets or third-party icon set are used; small interface marks are hand-authored CSS/SVG primitives.

`site/public/social-card.webp` is a 1200×630 crop of that same original archive landscape. `site/public/apple-touch-icon.png` is a local rasterization of the hand-authored diamond archive mark. The demo ledger, status lamp, report sheet, and terminal frame are hand-authored HTML/CSS extensions of the same glass-plane system; they use no external asset or icon library.
