# Code block copy button, language badge and keyboard scrolling

## Context

The `sample/script.js.example` customisation (inherited from CopenLight) appends a
`button.copy-btn` *inside* every `<pre>` and relies on `pre.style.position =
'relative'`. Because the `<pre>` is the scroll container, the button travels with
the horizontal and vertical scrollbars of long snippets; the script also uses
inline styles, hard-coded colours (`green`, `red`, `#007acc`), a fixed
Portuguese `aria-label`, no live-region feedback, no clipboard fallback and a
single `DOMContentLoaded` pass that would also inject a button into the CKEditor
rich text editor (`{{wysiwyg}}`), corrupting editable content.

The theme already styles `<pre>` inside `@mixin content-body`
(`styles/_mixins.scss`) and exposes `$brand_color`, `$primary-shade`,
`$low-contrast-border-color`, `$border-radius-sm` and `@mixin focus-ring`.
Theme JavaScript lives in `src/*.js` and is bundled into the committed
`script.js`, so this is the natural place for a native implementation.

## Goal

1. Every code block gets an accessible copy button that stays anchored to the
   block while the code scrolls (horizontal **and** vertical), with success and
   failure feedback announced to assistive technology.
2. New icon set (clipboard → check / cross), keyboard focus ring and a native
   tooltip, using the theme palette instead of hard-coded colours.
3. Code block visual refresh: monospace stack, brand accent border, `tab-size`,
   thin scrollbars, a language badge when the markup exposes one, a capped height
   (`--code-block-max-height`, default `32rem`) and `tabindex="0"` only when the
   block actually overflows so keyboard users can scroll it.
4. Works on dynamically inserted blocks, skips the rich text editor and any
   block marked `data-no-copy`.
5. Copied text is exactly the code (never the button or badge), with a fallback
   for browsers/contexts without the async clipboard API.

## Steps

1. `src/code-blocks.js`: `enhanceCodeBlock()` wraps each eligible `<pre>` in
   `.code-block` and inserts the button, badge and live region as **siblings** of
   the `<pre>`; `copyText()` uses `navigator.clipboard.writeText` with a
   `textarea` + `document.execCommand("copy")` fallback; `updateScrollable()`
   toggles `tabindex`; a debounced `MutationObserver` and `ResizeObserver` keep
   dynamic content and viewport changes in sync. Labels come from
   `window.codeBlockLabelsLocalized` with English defaults.
2. `src/index.js`: side-effect import.
3. `templates/document_head.hbs`: expose the three translated labels next to the
   existing `searchClearButtonLabelLocalized` script.
4. `translations/*.json` (37 locales): add `copy_code`, `copy_code_success`,
   `copy_code_failure` in alphabetical order. `build/validate.py` compares the
   base key set across every locale, so all 37 must carry them.
5. `styles/_variables.scss`: `$code-font-family`, `$success-color`,
   `$danger-color` (Garden equivalents).
6. `styles/_code-blocks.scss` (new) + import at the end of `styles/index.scss`:
   wrapper, button, badge, `<pre>` refresh, RTL flip, reduced motion, print.
   Declarations first, breakpoints afterwards, so the `check_style_order` gate
   stays green.
7. `src/code-blocks.spec.js`: jsdom coverage for wrapping, copy, feedback,
   fallback, exclusions, badge, `tabindex` and the mutation observer.
8. Docs: `docs/customization.md` (new "Code blocks" section, sample note),
   `README.md` highlight, and strip the now-native copy button from
   `sample/` (script and `<pre>`/`.copy-btn` styles), leaving a "Show all"
   toggle that illustrates the built-in cap instead.
9. Validate: `npm run build`, reproducible build (`git diff --exit-code`),
   `npm test`, `npm run typecheck`, `npm run validate`.

## Risks

- **Wrapping `<pre>` in a `<div>`** changes the element that carries the
  richtext margin. Margins move to the wrapper only inside the four
  `content-body` containers and `:last-child` keeps the previous spacing.
- **`max-height`** introduces nested scrolling on very long snippets; the value
  is a CSS custom property and print output removes the cap.
- **`tabindex`** depends on measured layout; jsdom returns zeros, so the spec
  stubs `scrollWidth`/`clientWidth`. `ResizeObserver` is absent in jsdom and
  guarded at runtime.
- **Language badge** only appears when the article HTML carries a
  `language-*` / `lang-*` class or a `data-language` attribute.
- **37 translation files** are rewritten; each locale keeps the same base key
  set and short, reviewable strings.
- **`execCommand`** is deprecated but only used as a fallback.
- **`style.css` / `script.js` are committed artefacts** and must be rebuilt in
  the same commit.

## Outcome

- `src/code-blocks.js` (441 lines) enhances each block on `DOMContentLoaded` and
  through a debounced `MutationObserver`; controls are siblings of the `<pre>`,
  copying falls back to `execCommand`, success/failure is announced through a
  `role="status"` element and resets after 2 s.
- `styles/_code-blocks.scss` adds the wrapper rhythm, the pinned 32×32 button
  (RTL flip, success/failure colours, focus ring), the language badge strip,
  `max-height: var(--code-block-max-height, 32rem)`, thin scrollbars, a
  `:focus-visible` outline and a print rule that removes the cap and hides the
  controls. Imported last in `styles/index.scss`; new tokens in
  `styles/_variables.scss`.
- Three keys added to all 37 `translations/*.json` (`81` base keys) and exposed
  through `templates/document_head.hbs`.
- `src/code-blocks.spec.js`: 18 cases, all green (`npm test`: 83 suites / 744
  tests). `npm run typecheck` and `npm run validate` (all gates) pass, and
  `style.css` / `script.js` were rebuilt.
- `sample/script.js.example` no longer ships a copy button: the theme owns it.
  The sample now adds a "Show all" toggle to blocks the cap is hiding, and
  `sample/style.css.example` dropped its `pre` / `.copy-btn` /
  `.article-body pre` overrides in favour of re-theming `.code-block`,
  `.code-block-copy` and `.code-block-language`. `docs/customization.md`,
  `docs/licensing.md`, `README.md` and this plan were updated to match.
