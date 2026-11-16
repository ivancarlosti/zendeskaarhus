# Customisation

Everything the admin can change without touching the source lives in
`manifest.json`; everything a developer changes lives in `styles/`, `templates/`
or `src/`.

## Palette and typography

| Setting | Default | Notes |
| --- | --- | --- |
| `brand_color` | `#17494D` | CopenLight teal; also feeds `--hc-primary-color` for the rich text editor |
| `brand_text_color` | `#FFFFFF` | text on brand-coloured buttons (10.0:1 on `brand_color`) |
| `text_color` | `#2F3941` | body copy (11.8:1 on white) |
| `link_color` | `#1F73B7` | 5.0:1 on the default background |
| `hover_link_color` | `#0F3554` | hover/active links (12.7:1) |
| `visited_link_color` | `#9358B0` | visited links (4.9:1) |
| `background_color` | `#FFFFFF` | `$primary-shade` / `$secondary-shade` derive from it |
| `heading_font`, `text_font` | system stack | no web fonts are requested, so there is no third-party call |

These are the CopenLight defaults. `build/artwork.py` mirrors the same values, so
changing a colour means regenerating the artwork as well.

Changing a colour in the manifest changes both `style.css` (through the Sass
preamble) and the React modules (through `createTheme`, which feeds Garden).

## How `style.css` stays editable

`build/sass-settings.mjs` prepends a preamble that assigns every manifest
variable to an escaped copy of itself:

```scss
$brand_color: \$brand_color;
```

Sass therefore emits `$brand_color` literally instead of a hex value, and the
build unescapes it afterwards. That is why Theming Center users can still edit
`color: $brand_color;` in `style.css`.

The two helper functions use the same trick for computed colours:

```scss
$hover-button-color: theme-darken($brand_color, 20%);
```

`theme-darken` / `theme-lighten` are not evaluated at build time; the build
renames them to `darken()` / `lighten()` so the editable CSS shows the Sass
function the admin expects.

## Artwork

`settings/` holds the images the manifest exposes. Filenames and pixel sizes are
part of the contract — `style.css` references them through `$homepage_background_image`,
`$community_image` and `$service_catalog_hero_image`, so replacing a file must
keep both the name and the dimensions:

| File | Size |
| --- | --- |
| `logo.png` | 470 × 470 |
| `favicon.png` | 128 × 128 |
| `homepage_background_image.jpg` | 2000 × 419 |
| `community_background_image.jpg` | 2000 × 417 |
| `community_image.jpg` | 1162 × 302 |
| `service_catalog_hero_image.jpg` | 3162 × 640 |
| `thumbnail.png` (repository root) | 768 × 630 |

Regenerate the defaults with Pillow:

```bash
python3 -m pip install Pillow
python3 build/artwork.py
```

## Custom settings

`manifest.json` keeps three custom settings under the **Custom** group:

- **Logout URL** (`logout_url`) — when set, `templates/header.hbs` points the
  sign-out links at this URL. Use `{{ACTUALPAGE}}` inside the value; the inline
  script in `header.hbs` replaces it with the URL of the current page, which is
  what single-sign-out endpoints usually need. When the setting is empty the
  stock Zendesk sign-out behaviour is used.
- **Inject script.js** (`inject_script`) and **Inject style.css**
  (`inject_style`) — optional files loaded on every page by
  `templates/document_head.hbs`. Both are `file` settings, so Guide requires the
  theme to carry `settings/inject_script.js` and `settings/inject_style.css`;
  they ship as empty stubs and nothing is loaded until an admin uploads a file.
  Removing them makes the theme fail to import with *"We were unable to find
  this file: settings/inject_script"*.

## Sample customisations

`sample/` ships the two files CopenLight uses as ready-made examples. They are
part of the theme (so they travel with the release zip) and you can upload them
**as-is** to the `inject_script` and `inject_style` settings:

| File | What it does |
| --- | --- |
| `sample/style.css.example` | Hides social blocks and article votes, widens the article container to 1300px with a 260px sidebar, styles tables and code blocks, and sets the Segoe UI stack. |
| `sample/script.js.example` | Adds a "copy" button with a clipboard icon to every `<pre>` block on the page. |

Rename the file to `style.css` / `script.js` before uploading — Theming Center
validates the extension — and keep the `!important` declarations: they have to
win over `style.css`, which loads first.

`sample/` only holds examples: the files Guide looks for are the stubs in
`settings/`, and both must stay in the theme.

## Translations

Theme strings live in `translations/<locale>.json` and are read with
`{{t 'key'}}`. All 37 locales ship the full theme key set.

The three custom settings add seven keys (`custom_group_label`,
`logout_url_label`, `logout_url_description`, `inject_script_label`,
`inject_script_description`, `inject_style_label`, `inject_style_description`).
They are translated in `en-us`, `en-gb`, `es`, `es-419`, `pt` and `pt-br`; for
the other locales Guide falls back to the theme's default locale (`en-us`). To
add a translation, copy the short strings from `translations/en-us.json` and
keep the `{{ACTUALPAGE}}` placeholder untouched.

Module strings live in `src/modules/<module>/translations/locales/*.json` and use
the `aarhus-theme-*` key namespace. The English source for each module is
`src/modules/<module>/translations/en-us.yml`; the JSON files are what the
runtime bundles ship. A module locale may be missing keys — i18next falls back
to the module's base locale, which the entry points pass in.


## Templates

Templates are Curlybars (Handlebars with Zendesk helpers). Conventions worth
knowing:

- `{{t 'key'}}` reads from `translations/<locale>.json`; the theme keys are
  unprefixed, while the module keys use the `aarhus-theme-*` namespace.
- `{{asset 'file'}}` resolves a file in `assets/` to its deployed URL — that is
  how the import map stays valid after upload.
- `templates/document_head.hbs` must always contain a
  `<script type="importmap">` element; the build rewrites its contents. Never
  remove it, or `build/import-map.mjs` aborts the build.

## Modules

`src/modules` holds the React code. Each module exposes an `index.tsx` entry
point that the matching template imports as an ES module:

```ts
import { renderRequestList } from "request-list";
```

Entry points mount with `mountReactApp` (`src/modules/shared/react-root.tsx`),
which wraps `createRoot` and reuses an existing root when a container is
rendered twice (the service catalog renders a loading state first).

Styling rules:

- styled-components 6 no longer filters props, so any custom prop that reaches a
  DOM element must be transient: `$isCollapsed`, not `isCollapsed`.
- Theme values come from `useTheme()` (Garden); do not hard-code colours.

Translations: every module ships `translations/locales/*.json` with the
`aarhus-theme-` prefix. `translations/en-us.yml` in each module is the source of
truth for the strings; the JSON files are the runtime bundles.

## Accessibility

When changing markup, keep:

- the skip link in `templates/header.hbs` (`#main-content`),
- `aria-expanded` / `aria-controls` on the dropdowns (`src/Dropdown.js`),
- visible focus styles — do not remove `:focus` outlines without a replacement,
- form labels linked through Garden's `Field` components.
