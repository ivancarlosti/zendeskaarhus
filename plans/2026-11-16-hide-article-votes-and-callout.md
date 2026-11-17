# Hide article votes and the "more questions" callout

## Context

`templates/article_page.hbs` always renders two footer blocks:

- `.article-votes` — the **Was this article helpful?** up/down vote buttons;
- `.article-more-questions` — the `{{request_callout}}` ("Have more questions?
  Submit a request").

Help centres that do not collect article votes or that route support through a
different channel had to hide them from **Custom → Inject style.css** with
`.article-votes { display: none; }`, which `sample/style.css.example` still
does. That workaround leaves the markup in the DOM, adds an extra stylesheet to
maintain and is invisible to admins browsing Theming Center. Every other block
on the article page already has a native `show_*` checkbox in the **Article page
elements** group of `manifest.json`.

## Goal

1. Expose both blocks as native theme settings, defaulting to the current
   behaviour (`true`).
2. Remove the markup when the setting is off, so no border or spacing is left
   behind.
3. Keep `manifest.json`, the 37 locale files, the template, the docs and the
   build gates consistent.

## Steps

1. `manifest.json`: add `show_article_votes` and `show_article_more_questions`
   to `article_page_group_label`, both `checkbox` with `value: true`, placed
   after `show_article_comments` so the admin list follows the page order.
2. `templates/article_page.hbs`: wrap `.article-votes` (and its `{{#with
   article}}`) in `{{#if settings.show_article_votes}}` and
   `.article-more-questions` in `{{#if settings.show_article_more_questions}}`.
3. `translations/*.json`: add `article_votes_label` /
   `article_votes_description` and `article_more_questions_label` /
   `article_more_questions_description` to all 37 locales, keeping the keys
   alphabetically sorted and `ensure_ascii=false`. `build/validate.py` fails when
   the base key set differs between locales, so a partial addition would break
   the gate.
4. `docs/customization.md`: document the **Article page elements** group,
   including the two new checkboxes and the guard pattern.
5. Rebuild, then run `npm run build`, `npm run validate`, `npm test` and
   `npm run version:check`; a clean rebuild must produce no `git diff` beyond
   the intended files.

## Risks

- **Settings unknown to Guide.** A manifest identifier is only read through
  `settings.<identifier>`; a typo silently renders nothing in the template but
  leaves an admin checkbox that does nothing. Both names are added to the
  manifest and the matching `{{#if}}` in the same change and reviewed together.
- **Locale drift.** Adding keys to `en-us.json` only would fail
  `check_locales`. All 37 files are updated in one pass and the key sets are
  compared before committing.
- **Hidden blocks shift the footer rhythm.** `.article-votes` carries its own
  `border-top` and `.article-return-to-top` keeps its own, so removing either
  block leaves consistent separators; verified on the article fixture at 375 /
  768 / 1280 px.
- **`sample/style.css.example` still hides `.article-votes`.** It is a sample
  customisation for existing help centres, not the theme default; it stays as
  is and remains documented.
