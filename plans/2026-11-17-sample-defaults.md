# Promote the sample stylesheet into theme defaults

## Context

`sample/style.css.example` started as a pile of `!important` overrides for the
stock Copenhagen layout: it widened the shell to 1300px, turned the article into
a white card next to a 260px sidebar card, added responsive stacking, styled
rich text tables and figures, set the Segoe UI stack, a `#FAFAFA` page
background, `#004080` headings and `#007ACC` links, and then re-themed a handful
of built-in components.

Most of that is not a "sample customisation" — it is what this Help Center
should look like out of the box. Keeping it in an injected stylesheet means
every admin has to upload a file to get the design, the values are frozen
`!important` hex codes that ignore Theming Center, and the theme's own defaults
(`#FFFFFF`, `#2F3941`, `#1F73B7`) never match what the site renders.

## Goal

1. Adopt the sample's design decisions as theme defaults, expressed through
   settings and tokens instead of `!important` overrides:
   - `background_color` `#FAFAFA`, `text_color` `#222222`,
     `link_color` `#007ACC`, `hover_link_color` `#005A99`;
   - new `heading_color` setting (`#004080`) so headings keep a separate accent;
   - `text_font` defaults to the Segoe UI stack (added to both font lists);
   - 1300px shell, card article (flex 300 → 700px+) with a 260px sidebar card,
     1024px stacking breakpoint, 1.7 article line-height;
   - rich text tables and figures/captions styled by the theme, image radius;
   - 24rem default code-block cap, tighter sub-nav/footer spacing.
2. Leave `sample/style.css.example` as an illustration of the rules that are
   still genuinely site-specific (content conventions, print, custom classes).
3. Document the behaviour change for admins who already inject the old sample.

## Steps

1. `manifest.json` — new palette defaults, `heading_color`, Segoe UI option.
2. `translations/*.json` — `heading_color_label` / `heading_color_description`
   in all 37 locales (base key set must stay identical).
3. `styles/_variables.scss` — `$max-width-container: 1300px`, `$surface-color`,
   `$border-radius-lg`.
4. `styles/_base.scss` — headings use `$heading_color`, links get
   `$hover_link_color` on hover/active/focus.
5. `styles/_mixins.scss` — richtext tables, figure frames, captions, image
   radius/shadow inside `content-body`.
6. `styles/_article.scss` — card layout, sidebar card, responsive stacking.
7. `styles/_sub-nav.scss`, `_footer.scss`, `_header.scss`, `_code-blocks.scss`,
   `_search_results.scss`, `_dropdowns.scss` — spacing and token clean-up.
8. `sample/style.css.example` — rewrite as a short, commented illustration.
9. `docs/customization.md` — palette table, layout and rich text sections,
   sample description, translations note, "reverting to the defaults".
10. `plans/` entry (this file), then `npm run build && npm run validate &&
    npm test`, and `npx sass` on the sample.

## Risks

- **Behaviour change for existing admins** who upload the old sample as-is: the
  Segoe UI stack, `#FAFAFA` background, `#004080` headings and the link colours
  now come from Theming Center, so they must not be re-applied in CSS (they
  would win over settings). Called out in the docs and the commit body.
- `link_color` `#007ACC` on `#FAFAFA` is 4.3:1, below the 4.5:1 AA threshold for
  body text; `#0069B4` (5.1:1) is the drop-in if AA is required.
- New manifest variable → needs every locale key (validate gate 1) and may
  change the Garden theme in the React modules only if a module reads it (none
  do).
- Layout changes affect every page that uses `.container` (1300px) and the
  article template; verified at 1024px, 1150px and 1300px+.
- No per-theme "reset" button exists in the Customize panel: settings are
  Guide's UI, not theme markup, and the manifest has no action/button type.
  Documented alternatives: theme versions/restore, re-import, or resetting the
  values listed in `docs/customization.md`.
