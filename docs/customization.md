# Customisation

Everything the admin can change without touching the source lives in
`manifest.json`; everything a developer changes lives in `styles/`, `templates/`
or `src/`.

## Palette and typography

| Setting | Default | Notes |
| --- | --- | --- |
| `brand_color` | `#17494D` | CopenLight teal; also feeds `--hc-primary-color` for the rich text editor |
| `brand_text_color` | `#FFFFFF` | text on brand-coloured buttons (10.0:1 on `brand_color`), and the text of the table header row |
| `text_color` | `#222222` | body copy (15.2:1 on the default background) |
| `heading_color` | `#004080` | headings, `h1`–`h6` (9.8:1) |
| `link_color` | `#007ACC` | links, and the fill of rich text table headers (4.3:1 — see below) |
| `hover_link_color` | `#005A99` | hover, active and focus state of links (6.9:1) |
| `visited_link_color` | `#9358B0` | visited links (4.7:1) |
| `background_color` | `#FAFAFA` | page colour; `$primary-shade`, `$secondary-shade` and `$surface-color` (the cards) derive from it |
| `heading_font` | system stack | headings |
| `text_font` | `'Segoe UI', Tahoma, Geneva, Verdana, sans-serif` | body copy; both lists offer the same options, so headings can be switched to Segoe UI as well |

No web fonts are requested, so there is no third-party call.

`link_color` `#007ACC` on `#FAFAFA` is 4.3:1, just under the 4.5:1 WCAG AA
threshold for body text. `#0069B4` (5.1:1) is the drop-in replacement if you
need AA on body links; body copy, headings and the hover colour already exceed
it.

These are the shipped defaults. `build/artwork.py` generates the logo, the hero
images and the thumbnail from the teal `brand_color` plus fixed accent tones
that belong to the artwork, so the illustrations are only regenerated when the
brand itself changes.

Changing a colour in the manifest changes both `style.css` (through the Sass
preamble) and the React modules (through `createTheme`, which feeds Garden).

## Layout

`$max-width-container` is 1300px and is shared by `.container`, `.header` and
`.footer-inner`, so every page lines up with the article page.

The article page is built from two cards. `.article` is the readable column,
`.article-sidebar` the section listing; both sit on `$surface-color`
(`lighten($background_color, 5%)`, white for the default background). From
1024px up the cards are side by side
with a 40px gap: the sidebar is fixed at 260px and the article flexes between
300px and the remaining ~1000px, which keeps the line length sane without a
third breakpoint. Below 1024px the sidebar stacks above the article, and article
body copy uses a 1.7 line-height. The article card uses `$border-radius-lg`
(12px) and the sidebar `$border-radius-md` (10px).

## Rich text

Every rich text container (`.article-body`, `.post-body`, `.comment-body`,
`.service-catalog-description`) includes the `content-body` mixin from
`styles/_mixins.scss`, which owns the typography of what admins publish:

- **tables** — `table-layout: fixed`, 1px `$low-contrast-border-color` cells with
  10px padding, and a header row filled with `$link_color` and written in
  `$brand_text_color`;
- **images** — `$border-radius-sm` (5px) and a soft shadow;
- **`figure.image`** — a 5px frame around the image instead of the radius and
  shadow, with the caption on `$secondary-shade`, italic and centred;
- **code** — inline `<code>` and `<pre>` on `$primary-shade`; real snippets are
  upgraded to `.code-block` by `src/code-blocks.js` — see
  [Code blocks](#code-blocks).

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

## Article page elements

The **Article page elements** group in `manifest.json` turns whole blocks of
`templates/article_page.hbs` on and off. Every setting is a checkbox and
defaults to `true`, so upgrading keeps the current rendering.

| Setting | Template block | Default |
| --- | --- | --- |
| `show_articles_in_section` | sidebar listing the other articles in the section | on |
| `show_article_author` | author image and name | on |
| `show_article_comments` | comment count and comment list | on |
| `show_article_votes` | "was this article helpful?" vote buttons | on |
| `show_article_more_questions` | `request_callout` — "Have more questions? Submit a request" | on |
| `show_follow_article` | follow button | on |
| `show_recently_viewed_articles` | recently viewed articles | on |
| `show_related_articles` | related articles | on |
| `show_article_sharing` | social sharing | on |

Each template block is guarded by `{{#if settings.<identifier>}}`, so turning
the setting off removes the markup instead of hiding it with CSS: no empty
borders or leftover spacing remain. `show_article_votes` and
`show_article_more_questions` replace the `.article-votes { display: none; }`
workaround that custom stylesheets needed before.

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

`sample/` ships the two files as ready-made examples. They are part of the theme
(so they travel with the release zip) and you can upload them **as-is** to the
`inject_script` and `inject_style` settings:

| File | What it does |
| --- | --- |
| `sample/style.css.example` | Shows what an injected stylesheet is still for: a content convention (`ul li strong`), print layout, a phone-only code cap and a custom `.callout` class. Palette, layout, tables, figures and code blocks now come from the theme itself — see [Palette and typography](#palette-and-typography), [Layout](#layout) and [Rich text](#rich-text). |
| `sample/script.js.example` | Adds a "Show all" toggle below code blocks the height cap is hiding. Copying, the language badge and the scrollable, focusable `<pre>` are built in — see [Code blocks](#code-blocks); this sample only extends them and never adds a second copy button. |

Rename the file to `style.css` / `script.js` before uploading — Theming Center
validates the extension. An injected file is loaded after the theme's own
`style.css`, so a selector that is more specific wins; reach for `!important`
only where you have to beat an existing declaration (the print block in the
sample does, its custom property and custom class do not).

`sample/` only holds examples: the files Guide looks for are the stubs in
`settings/`, and both must stay in the theme.

## Code blocks

`src/code-blocks.js` enhances every `<pre>` an article, post, comment or
service-catalog description renders:

- the block is wrapped in `.code-block` and the copy button and the
  `role="status"` live region are inserted as **siblings** of the `<pre>`, so the
  controls stay pinned while the code scrolls;
- a language badge is added when the markup exposes one (`language-js` or
  `lang-js` on the `<pre>`/`<code>`, or `data-language="Bash"`); the `<pre>` then
  reserves a small strip so the badge never covers the first line;
- long blocks are capped by `--code-block-max-height` (`24rem` by default) and
  scroll vertically, and the `<pre>` receives `tabindex="0"` only while it
  actually overflows, so keyboard users can scroll it;
- copying uses `navigator.clipboard.writeText` and falls back to
  `document.execCommand("copy")`; the result is announced through the live
  region and the icon resets after two seconds;
- the rich text editor (`#hc-wysiwyg`, `.ck-content`) and any block marked
  `data-no-copy` are skipped.

Tune the cap from `inject_style.css` (upload through *Custom settings → Inject
style*):

```css
:root {
  --code-block-max-height: 48rem;
}
```

Add `data-no-copy` to a `<pre>` to leave that snippet without a button. The
labels come from `copy_code`, `copy_code_success` and `copy_code_failure` in
`translations/<locale>.json`; `templates/document_head.hbs` exposes them as
`window.codeBlockLabelsLocalized`.

`sample/script.js.example` shows how to extend a block without re-implementing
the button: it appends a "Show all" toggle to `.code-block` and sets
`--code-block-max-height: none` while the block is expanded.

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

Everything else is a base key, and the base key set has to be identical in all
37 files — `build/validate.py` fails the build otherwise. Adding a setting means
adding its `label` and `description` keys everywhere at once, which is how
`heading_color_label` and `heading_color_description` were introduced.

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
- the code block copy button — translated `aria-label`, feedback through the
  `role="status"` element and `tabindex="0"` on overflowing blocks,
- form labels linked through Garden's `Field` components.

## Reverting to the defaults

There is no "reset" button in the Customize panel, and the theme cannot add one:
that panel is Guide's own UI, built from the variables declared in
`manifest.json` (colour, list, checkbox, text, textarea and file types — none of
them an action), while the theme's templates only render the public Help Center.
The values live in Guide, not in the theme, so there is no theme-side hook to
reset them.

What does work:

- **Set the values back by hand.** The tables above list every default, and a
  colour picker accepts the hex value directly.
- **Roll the theme back.** Guide keeps the published versions of a theme;
  restoring an earlier version brings back its files and its settings together.
- **Clear an inject file.** *Custom settings → Inject style* / *Inject script*
  can be emptied — an empty file setting is not loaded at all, so the CSS and
  the JavaScript disappear without leaving a stub behind.
- **Drop one override.** `--code-block-max-height` falls back to `24rem` as soon
  as the rule that sets it is removed.

