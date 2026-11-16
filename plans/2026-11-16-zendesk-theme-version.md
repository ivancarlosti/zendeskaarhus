# Zendesk theme version stamping

## Context

Importing the theme into Zendesk Guide failed with:

```
Incorrect theme version number
The imported theme version number is not allowed. Contact the theme developer to
make sure the version conforms the Semantic versioning 2.0.0 standard and is
higher than the current version.
```

Guide only accepts a `manifest.json` version that is strict SemVer 2.0.0 and
strictly higher than the version already installed in the help center.

Investigation:

- The repository has release tags `v1.0.0`, `v1.1.0` and `v1.1.1`, but
  `manifest.json` (and `package.json`) still said `1.0.0`.
- The released asset `zendeskaarhus-1.1.1.zip` ships `"version": "1.0.0"`, so
  the import was refused no matter which release was downloaded.
- `.github/workflows/semantic-release.yml` only stamped `manifest.json` in the
  **manual** (`workflow_dispatch` with a version) path. The automatic path ran
  semantic-release without `@semantic-release/npm`/`exec`, so nothing wrote the
  version the tag announced; the sed-based manual path also accepted
  pre-release strings (`1.2.0-rc.1`) and versions lower than the last tag.
- `build.yml` zipped whatever the tag contained without checking the manifest,
  and `build/validate.py` only compared manifest and package.json to each other.

CopenLight's release action was used as the reference: it stamps the version
files and commits them before tagging.

## Goal

1. Every release commit/tag carries a `manifest.json` whose version equals the
   tag, is strict SemVer 2.0.0 and is higher than the previous release.
2. A package zip whose manifest version does not match the release can never be
   uploaded to the GitHub Release.
3. Developers can bump the manifest locally or from GitHub Actions before
   importing the theme by hand.

## Steps

1. Add `build/version.mjs` — dependency-free Node helper with `check`,
   `verify-release`, `bump`, `set` and `current`, enforcing strict
   `MAJOR.MINOR.PATCH` and a floor of "highest of manifest, newest reachable
   SemVer tag, `THEME_CURRENT_VERSION`". It writes `manifest.json`,
   `package.json` and the root fields of `package-lock.json`.
2. Expose `npm run version:check`, `version:bump`, `version:set`.
3. `semantic-release.yml`:
   - automatic path: inject `@semantic-release/exec`
     (`prepareCmd: node build/version.mjs set ${nextRelease.version}`) and
     `@semantic-release/git` (assets: the three version files) into the
     generated `.releaserc`, plus a git identity;
   - manual path: replace the `sed` stamping with the script, fetch tags first
     so a version lower than the last release is rejected.
4. `build.yml`: run `verify-release <tag>` before zipping (warn-only for
   scheduled rebuilds of pre-gate tags).
5. Add `.github/workflows/theme-version.yml`: validate on PR/push and provide a
   manual `bump` action on `main`.
6. `build/validate.py`: reject non-SemVer versions.
7. Document the rules in `docs/versioning.md`, link it from `README.md` and
   `docs/setup.md`.
8. Bump the manifest to the next patch (`1.1.2`) so the current tree can be
   imported again.

## Risks

- `@semantic-release/git` pushes the stamped commit to the default branch; a
  protected branch that forbids direct pushes would make releases fail (they
  already fail for the tag/notes pushes in that case).
- A hand-bumped manifest that is *higher* than the next computed release fails
  the release with an explicit error instead of silently shipping a mismatch;
  the fix is to cut a tag at or above the manifest version.
- `set` cannot know what the help center runs when no tag describes it; the
  `THEME_CURRENT_VERSION` escape hatch documents that limitation.
- Historical tags (`v1.0.0`–`v1.1.1`) still contain the stale manifest; the
  build gate only saves future releases, so those zips must be rebuilt by
  re-releasing, not re-uploaded.
