# Setup

## Prerequisites

| Tool | Version | Notes |
| --- | --- | --- |
| Node.js | 22 or newer (24 LTS recommended) | `.nvmrc` pins `24.11.1`; i18next 27 needs Node ≥ 22 |
| npm | 10 or newer | npm 11 ships with Node 24 |
| Python 3 + Pillow | optional | only to regenerate the artwork (`build/artwork.py`) |

## Install

```bash
git clone git@github.com:ivancarlosti/zendeskaarhus.git
cd zendeskaarhus
npm ci            # or `npm install` to refresh the lockfile
```

`npm ci` uses `package-lock.json` and is the reproducible path used by CI.

## Build

```bash
npm run build
```

This produces three artefact groups:

1. `style.css` — compiled by `build/sass-settings.mjs`, which prepends the
   manifest variables as escaped Sass variables (see
   [customization.md](customization.md)).
2. `script.js` — IIFE bundle of `src/index.js` (dropdowns, navigation, search,
   share buttons).
3. `assets/*-bundle.js` — the React modules plus their translation chunks.
   `build/import-map.mjs` then rewrites the relative imports inside the bundles
   and writes the import map into `templates/document_head.hbs`.

The 12 bundle names are part of the theme contract
(`approval-requests`, `flash-notifications`, `new-request-form`, `request-list`,
`service-catalog`, `shared`, `ticket-fields`, `wysiwyg`, plus one translations
bundle for the four modules that ship their own). Templates and the import map
reference them by name — do not rename a chunk without updating both.

## Sass ordering: declare first, nest afterwards

`styles/` is mobile-first: the base rule holds the small-screen values and the
`@include tablet` / `@include desktop` blocks add the wider-screen ones. Every
rule must still list its **declarations before its nested blocks**:

```scss
.blocks-item {
  margin: 0 0 30px;
  padding: 20px;

  @include tablet {
    margin: 0 15px 30px;
  }

  &:hover {
    background-color: $brand_color;
  }
}
```

Dart Sass 1.77.7 changed mixed-declaration handling: a nested `@media` block is
now emitted **where it appears in the source** instead of after the surrounding
declarations. The order above therefore compiles to the intended cascade, while
the reverse order (the pre-2024 Zendesk themes write `@include tablet { … }`
first) compiles to

```css
@media (min-width: 768px) { .blocks-item { margin: 0 15px 30px } }
.blocks-item { margin: 0 0 30px }
```

where the base declaration wins at every width and the responsive rule is dead.
The same rule applies to `@include max-width-container` and to
`@include content-body`, whose declarations land in the calling rule: put the
declarations first and the include last.

`npm run validate` fails on any `@media` block that directly precedes base
declarations for the same selector (gate 7 in `build/validate.py`); the three
allowlisted pairs are the ones the upstream theme emits too and only touch
properties the breakpoint does not.

## Watch mode

```bash
npm run watch            # rollup rebuilds style.css, script.js and assets/
npm run preview          # zcli themes:preview against the working tree
```

## Deploy to Zendesk

```bash
npx zcli login
npx zcli themes:create --path .          # first upload
npx zcli themes:update --path .          # subsequent uploads
npx zcli themes:publish --path .         # make it the live theme
```

`zcli` needs the theme's `manifest.json` to be valid: `name`, `author`,
`version` and `api_version` (4) are read from it on upload.

Guide additionally refuses a package whose `version` is not strict SemVer
2.0.0 or not higher than the version already installed ("Incorrect theme
version number"). Bump it before re-uploading:

```bash
npm run version:bump -- patch     # 1.2.3 -> 1.2.4, keeps package.json in sync
npx zcli themes:update --path .
```

See [versioning.md](versioning.md) for the full rules, the `THEME_CURRENT_VERSION`
override and how the release workflows stamp the manifest.

## Theme package

`🚀 Semantic Release` (`.github/workflows/semantic-release.yml`) stamps
`manifest.json`, `package.json` and `package-lock.json` with the released
version *before* tagging, so the tag and the theme package always agree.
`🐳 Build Artifacts` (`.github/workflows/build.yml`) then zips the tree and
uploads it to the GitHub Release; it verifies the manifest version first.
Locally you can reproduce the zip with:

```bash
npm run build
zip -r aarhus.zip manifest.json templates styles settings assets translations script.js style.css thumbnail.png
```

## Verification gates

Before pushing:

```bash
npm run typecheck        # tsc --noEmit
npm test                 # Jest 30 with ts-jest
npm run version:check    # strict SemVer 2.0.0, manifest == package.json
npm run build            # must be reproducible from a clean checkout
npm run validate         # build/validate.py: locales, import map, manifest,
                         # branding, notices, version and Sass cascade order
```

The CI workflows (`.github/workflows/build.yml` and
`.github/workflows/theme-version.yml`) run the same checks and fail on a dirty
build output or on a manifest version Guide would reject.
