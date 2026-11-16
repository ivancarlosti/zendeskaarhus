# Aarhus

A modern, accessible [Zendesk Guide](https://support.zendesk.com/hc/en-us/articles/4408821259930)
Help Center theme: a harbour palette, refreshed artwork and an upgraded
front-end stack (React 18, styled-components 6, Garden 9.16, i18next 27,
rollup 4, Jest 30), derived from Zendesk's Apache-2.0 licensed Help Center
theme.

<!-- buttons -->

## Highlights

- **Help Center templates** for articles, sections, categories, community,
  requests, approvals, service catalog and search.
- **React modules** for the new request form, request list, approval requests,
  service catalog and rich text editing.
- **37 locales** for the theme strings and **104 locales** for each module, all
  namespaced `aarhus-theme-*`.
- **Theming Center friendly** — `style.css` keeps the `$brand_color`-style
  variables and `lighten()` / `darken()` calls admins can edit in place.
- **Accessibility** — skip links, labelled landmarks, keyboard support for the
  dropdowns and visible focus styles.

## Quick start

```bash
npm install          # install dependencies
npm run build        # compile style.css, script.js and assets/*-bundle.js
npm test             # run the Jest suite
npm run typecheck    # tsc --noEmit
```

Package the theme in Zendesk:

```bash
npx zcli themes:create --path .   # upload as a new theme
npx zcli themes:preview --path .  # local preview server
```

See [docs/setup.md](docs/setup.md) for the full walkthrough.

## Repository layout

| Path | Contents |
| --- | --- |
| `templates/` | Curlybars templates rendered by Zendesk Guide |
| `styles/` | SCSS sources compiled into `style.css` |
| `src/` | Theme JavaScript (`script.js`) and React modules |
| `assets/` | Built module bundles, referenced through the import map |
| `settings/` | Default logo, favicon and background artwork |
| `translations/` | Theme locale files (`en-us.json`, …) |
| `build/` | Build helpers: Sass preamble, import map, artwork generator |
| `docs/` | Setup, customisation, testing and licensing documentation |
| `plans/` | Implementation plans for larger changes |

## Documentation

- [Setup](docs/setup.md) — install, build, preview and deploy.
- [Customisation](docs/customization.md) — palette, artwork, injected files.
- [Testing](docs/testing.md) — the Jest/TypeScript setup and conventions.
- [Licensing](docs/licensing.md) — provenance, Apache-2.0 and MIT scope.

## License

Aarhus is derived from Zendesk's Apache-2.0 licensed Help Center theme. See
[LICENSE](LICENSE) (Apache-2.0), [NOTICE](NOTICE) for the modification record
and [LICENSES/MIT.txt](LICENSES/MIT.txt) for the parts written from scratch.

<!-- footer -->

<p align="center">Aarhus — a Zendesk Help Center theme.</p>
