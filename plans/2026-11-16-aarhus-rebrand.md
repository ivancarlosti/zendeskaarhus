# Aarhus — Zendesk theme rebrand & modernisation

## Context

`zendeskaarhus` must ship an "Aarhus" branded Zendesk Help Center theme. The
starting point is `ivancarlosti/copenlight` (itself a derivative of Zendesk's
Apache-2.0 licensed `copenhagen_theme`). The upstream theme still carries
Copenhagen/CopenLight branding, an aging React 17 / styled-components 5
toolchain and a large amount of unreleased build machinery.

Goal: a self-contained, importable Zendesk theme file set named **Aarhus**, with
no Copenhagen/CopenLight branding, a pruned repository and a modernised module
toolchain (React 18, Garden 9.16, styled-components 6, i18next 27), while
respecting the Apache-2.0 obligations of the derived code.

## Goal (acceptance criteria)

1. `manifest.json` names the theme `Aarhus`, version `1.0.0`, and keeps the
   logout/inject settings under a renamed `aarhus_group`.
2. No occurrence of `copenlight`, `copenhagen` or `cph-theme` anywhere except
   `NOTICE` and `docs/licensing.md`.
3. All translation keys carry the `aarhus-theme-` prefix.
4. `npm ci && npm run build && npm test` pass from a clean checkout.
5. `npm run typecheck` (`tsc --noEmit`) is clean.
6. The package ZIP contains only importable theme files (no docs/plans/src
   tooling required at runtime) and imports cleanly into Zendesk Guide.
7. Licensing: derived code Apache-2.0 + `NOTICE`; new code MIT in
   `LICENSES/MIT.txt`.
8. `.github/**` untouched.

## Steps

### Phase 0 — Repository scaffold
- Add `plans/`, `docs/`, `.dockerignore` (must list `docs`, `plans`, `docker`,
  `.github`), `.gitignore` (must not ignore those four paths).
- Delete upstream-only files: `AGENTS.md`, `CLAUDE.md`, `CHANGELOG.md`,
  `bin/`, `sample/`, `translations.yml`, `.husky/`, `.a11yrc.json.example`,
  `.releaserc`, Yarn 4 tooling (`.yarn/`, `.yarnrc.yml`, `yarn.lock`).
- Switch the package manager to npm (`package-lock.json`).

### Phase 1 — Identity pass
- Rename brand strings (`CopenLight` -> `Aarhus`, `copenhagen_theme` ->
  `aarhus_theme`, `cph-theme-*` -> `aarhus-theme-*`).
- Rewrite `manifest.json` (name, version, author, `aarhus_group` settings).
- Rewrite `README.md`, `NOTICE`, `LICENSE`, `LICENSES/*`.

### Phase 2 — Theme surface
- `templates/`: `document_head`, `header`, `footer`, `home_page`,
  `error_page`, `new_request_page`, `requests_page`, `service_list_page`,
  `service_page`, `approval_request_list_page`.
- `styles/`: own `_reset.scss` instead of archived `normalize.css`; Aarhus
  palette in `_variables.scss`; token-forwarding contract (`$ident: $ident`)
  preserved for Theming Center editing.
- `src/*.js`: vanilla JS (dropdowns, navigation, search, share, focus, keys)
  rewritten and rebound to the new DOM contracts.
- `settings/` artwork regenerated at the exact existing pixel sizes
  (file names are referenced from `style.css` and must not change).

### Phase 3 — Dependency rewrite
- `package.json`: pruned to what the build/tests need, upgraded per the matrix
  in `docs/testing.md` (React 18.3.1, Garden 9.16.1, styled-components 6.6.0,
  i18next 27.1.3, react-i18next 18.0.2, react-dropzone 20.2.0,
  `@zendesk/help-center-wysiwyg` 2.0.0, rollup 4.68.4, jest 30.5.2,
  ts-jest 29.4.15, TypeScript 5.9.3 pinned because ts-jest 29 peers
  `typescript >=4.3 <7`).
- Remove `rollup-jest` (peer rollup <= 3) and use a plain ts-jest config.
- Remove `@types/styled-components` (styled-components 6 ships its own types).
- Remove `@testing-library/react-hooks` (RTL 16 provides `renderHook`).

### Phase 4 — Module migrations
- React 18: `ReactDOM.render` -> `createRoot` in the 7 render entry points;
  single root for the double render in `service-catalog`.
- styled-components 6: transient (`$`) props for anything forwarded to the DOM
  (v6 no longer filters props), no `withComponent`/`$as`, own types.
- i18next 27 / react-i18next 18: option and typing updates.
- wysiwyg 2.0.0: required `locale` option; theme hook via
  `--hc-primary-color`.
- Tests: jest 30 + RTL 16 migration of the hook specs.

### Phase 5 — Rebuild & validate
- `npm run build` regenerates `style.css`, `script.js`, `assets/*-bundle.js`.
- `npm run typecheck`, `npm test`.
- Brand/leak grep gates; importmap <-> assets consistency; manifest/package
  version match; ZIP content check.
- Post-push security checks (dependabot alerts, code scanning, workflow runs).

### Phase 6 — Documentation
- `docs/setup.md`, `docs/customization.md`, `docs/testing.md`,
  `docs/licensing.md`, `docs/api.md` (theme module contracts).

## Risks

| Risk | Impact | Mitigation |
|---|---|---|
| styled-components 6 prop filtering removal leaks invalid DOM attributes | Medium | audit every custom prop, convert to `$`-transient, watch React warnings in test output |
| React 18 types drop implicit `children` | Medium | fix affected components explicitly |
| jest 30 / ts-jest 29 / RTL 16 churn across ~80 specs | Medium-High | migrate spec by spec, run the full suite continuously |
| TypeScript 7 breaks ts-jest | High | pin TypeScript 5.9.3, documented in `docs/testing.md` |
| rollup 4 chunk graph change breaks importmap | Medium | keep all 12 chunk names identical; `build/import-map.mjs` validates after write |
| wysiwyg 2.0.0 behaviour change in the new-request form | Medium | manual smoke test of the request form + textarea specs |
| Apache-2.0 obligations missed | High | `NOTICE` + `docs/licensing.md` map every derived path |
