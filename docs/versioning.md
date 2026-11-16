# Versioning

Guide imports a theme package only when the `version` in its
`manifest.json` satisfies two rules:

1. it is **SemVer 2.0.0** — `MAJOR.MINOR.PATCH`, no `v` prefix, no
   pre-release (`1.2.0-rc.1`) and no build metadata (`1.2.0+build.5`);
2. it is **higher than the version already installed** in the help center.

Break either one and the import fails with:

```
Incorrect theme version number
The imported theme version number is not allowed. Contact the theme developer to
make sure the version conforms the Semantic versioning 2.0.0 standard and is
higher than the current version.
```

`build/version.mjs` (no dependencies, plain Node) is the single place that
reads and writes that version. It keeps `manifest.json`, `package.json` and
`package-lock.json` on the same value.

## Checking

```bash
npm run version:check                     # validate the current tree
node build/version.mjs verify-release 1.2.0  # the manifest must say 1.2.0
```

`check` fails when the version is not strict SemVer or when `manifest.json`
and `package.json` disagree. It warns when the tree is *behind* the newest
released tag, which is the state that produces the Guide error above.

## Bumping

```bash
npm run version:bump -- patch   # 1.2.3 -> 1.2.4
npm run version:bump -- minor   # 1.2.3 -> 1.3.0
npm run version:bump -- major   # 1.2.3 -> 2.0.0
npm run version:set -- 1.4.0    # explicit version
```

Both commands start from the **highest** of: the manifest version, the newest
SemVer git tag reachable from `HEAD`, and `THEME_CURRENT_VERSION`. `set`
refuses to write a version below any of them, because Guide would reject it.

If the help center runs a version that no tag describes, tell the script:

```bash
THEME_CURRENT_VERSION=3.1.0 npm run version:bump -- patch
```

## How releases stamp it

| Trigger | What happens |
| --- | --- |
| Push to `main` | `🚀 Semantic Release` runs semantic-release; `@semantic-release/exec` runs `node build/version.mjs set <next version>` in the `prepare` step and `@semantic-release/git` commits `manifest.json`, `package.json` and `package-lock.json` **before** the tag is created. |
| Manual dispatch of `🚀 Semantic Release` | The same script stamps the requested version, then the tagged commit is pushed. |
| `🔢 Theme Version` → *Run workflow* | Bumps the manifest on `main` without cutting a release — use it before `zcli themes:update` when you only want the current tree importable. |
| `🐳 Build Artifacts` | Runs `verify-release <tag>` before zipping, so a package whose manifest version does not match the release never reaches the release page. |

Because the release commit is tagged after stamping, `v1.2.0` always contains
a `manifest.json` that says `1.2.0`.

## Importing by hand

```bash
npm run version:bump -- patch   # manifest version > the one in Guide
npm run build
npx zcli themes:update --path .
npx zcli themes:publish --path .
```

Committing the bump with `[skip ci]` avoids starting a validation run:

```bash
git commit -am "chore(release): bump theme version to $(node build/version.mjs current) [skip ci]"
```
