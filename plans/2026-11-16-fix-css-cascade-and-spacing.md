# Fix CSS cascade order and article typography

## Context

The theme's SCSS is written mobile-first (CopenLight style): a rule lists its
`@include tablet/desktop/mobile { … }` blocks first and its base declarations
afterwards. Dart Sass ≥ 1.77.7 ("mixed declarations") emits a nested `@media`
block in source order instead of hoisting the surrounding declarations above it,
so the compiled `style.css` contains:

```css
@media (min-width: 768px) { .blocks-item { margin: 0 15px 30px } }
.blocks-item { … margin: 0 0 30px; }   /* wins at every width */
```

The old Dart Sass (1.58.3, the version CopenLight's `style.css` was built with)
hoisted those declarations, which is why the upstream stylesheet looks correct.

Measured on the compiled stylesheets:

| | top-level blocks | `@media` blocks | media-before-base inversions |
| --- | --- | --- | --- |
| this repo, `style.css` | 947 | 125 | 79 |
| `copenlight/style.css` | 948 | 140 | 10 (pre-existing `.pagination-*`) |

78 distinct selectors lose their responsive rules today: `.blocks-item`
(home cards touch, 3 per row), `.article-container` (mobile stack on desktop),
`.article-sidebar`, `.article-header`, `.page-header*(-description)`,
`.promoted-articles-item`, `.section-tree`, `.table tr/td`,
`.collapsible-nav-*`, `.requests-table-*`, `.search-results-column`, `.button`
(`width: 100%` beats `width: auto`), and `.container` / `.error-page` /
`.header` / `.footer-inner` through the `max-width-container` mixin.

Source worklist: 68 rule blocks / 200 declaration lines across 22 files
(60 media-driven, 8 plain nested-selector splits).

Second, independent bug: `styles/_reset.scss` zeroes `h1–h6, p, figure,
blockquote, dl, dd`, and `@mixin content-body` — the only place admin-authored
markup is styled (`.article-body`, post body, comment body, service-catalog
body) — sets no paragraph/heading margins. Text, images and quotes run
together.

## Goal

1. Emit correct CSS on any Dart Sass version, from source (no version pin, no
   post-processing step).
2. No media-before-base inversion beyond CopenLight's 10 pre-existing ones.
3. Typographic rhythm inside `.article-body`: paragraphs, headings, figures,
   quotes, code blocks, tables.
4. A build gate that fails if the ordering regresses.

## Steps

1. Baseline: copy `style.css` to `/tmp/style-before.css`, record `HEAD`.
2. `styles/_mixins.scss`: `max-width-container` emits its declarations before
   its `@media` block; `content-body` declares `display: flow-root` before
   `@include standalone-link`. Hoist the declarations of `.header` and
   `.footer-inner` above their `@include max-width-container` (no overlapping
   properties).
3. Reorder the 60 media-driven rule blocks and the 8 nested-selector splits:
   declarations first (original relative order), blank line, then nested
   blocks (`&:hover`, child selectors, breakpoint includes).
4. Add rhythm rules to `@mixin content-body`; leave `_reset.scss` alone so
   search results, forms and community keep their tuned spacing.
5. Rebuild, then assert:
   - declaration multiset per `(media, selector)` identical to the pre-change
     build (proves the move is lossless);
   - inversion count drops 87 → 3 and the remainder equals the documented
     upstream cases;
   - `npm run build` / `npm run validate` / `npm test` pass, clean rebuild
     produces no `git diff`.
6. `build/validate.py`: new `check_style_order` gate + `KNOWN_INVERSIONS`
   allowlist, wired into `main()` and the module docstring.
7. Docs: `docs/setup.md` (build), `docs/testing.md` (new gate), plus
   before/after screenshots in `docs/screenshots/`.
8. Visual check of the article and home fixtures at 375 / 768 / 1280 px.
9. Split into three commits: mixins, reorder, spacing + guard + docs.

## Risks

- **Mechanical reorder goes wrong.** The move is scripted (stable, no
  retyping), reviewed per file in `git diff`, and gated by the declaration
  multiset diff plus the inversion counter and visual fixtures.
- **Declaration order changes for the four callers of "both"-producing mixins**
  (`.container`, `.error-page`, `.header`, `.footer-inner`). Property overlap
  verified as empty, so computed values do not change.
- **78 selectors change layout at desktop widths.** That layout is the mobile
  design leaking into desktop today; each is checked at 768 / 1280 px.
- **`style.css` is a committed artefact.** CI runs `git diff --exit-code`
  after the build, so the regenerated file ships in the same commit.
- **`settings/inject_style.css` can still override the cascade.** It is the
  documented polish layer and is loaded last; no media rules are added there.
- **Regression re-introduced by a future edit** fails `npm run validate`.

## Outcome

Compiled the pre-change sources and the fixed sources with the same Dart Sass so
the comparison isolates the source change:

| Check | Before | After |
| --- | --- | --- |
| `@media` block directly before base declarations | 87 | 3 (the upstream set) |
| declarations per `(media, selector)` | 2258 | 2258 (0 lost, 0 added) |
| affected rule blocks in `styles/` | 68 in 25 partials | 0 |

`npm run validate` fails with 87 findings on the old stylesheet and passes on the
new one; `npm test` is 82 suites / 726 tests. Layout at 1280px:

| page | before | after |
| --- | --- | --- |
| home | [before](../docs/screenshots/2026-11-16-home-before.png) | [after](../docs/screenshots/2026-11-16-home-after.png) |
| article | [before](../docs/screenshots/2026-11-16-article-before.png) | [after](../docs/screenshots/2026-11-16-article-after.png) |

Follow-ups found while measuring, all pre-existing and untouched here:

- `.article-container` is a flex container whose `.article-body` child has no
  `min-width: 0`, so a long unbreakable token in a `pre` block pushes the page
  to 485px at a 375px viewport (identical before and after this change).
