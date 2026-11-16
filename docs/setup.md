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
npm run validate         # build/validate.py, includes the version gate
```

The CI workflows (`.github/workflows/build.yml` and
`.github/workflows/theme-version.yml`) run the same checks and fail on a dirty
build output or on a manifest version Guide would reject.
