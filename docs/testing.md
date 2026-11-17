# Testing

## Stack

| Package | Version | Why |
| --- | --- | --- |
| `jest` | 30.x | test runner |
| `jest-environment-jsdom` | 30.x | DOM environment (jsdom 27) |
| `ts-jest` | 29.x | TypeScript transform, no Babel |
| `typescript` | **5.9.3 (pinned)** | ts-jest 29 peers `typescript >=4.3 <7`; TypeScript 7 breaks it |
| `@testing-library/react` | 16.x | `render`, `renderHook`, `act`, `waitFor` |
| `@testing-library/jest-dom` | 7.x | DOM matchers |
| `jest-styled-components` | 7.4.x | `toHaveStyleRule` for styled-components 6 |
| `@types/jest` | 30.x | global `describe` / `it` / `expect` types |

## Commands

```bash
npm test                  # TZ=UTC jest, all suites
npm run test:watch        # interactive
npx jest src/modules/request-list   # single directory
npx jest -t "renders the list"      # single test name
```

CI runs `npm test` with `TZ=UTC` so date formatting is stable.

## Configuration

`jest.config.mjs`:

- `testEnvironment: "jsdom"`, `coverageProvider: "v8"`.
- `transform` runs ts-jest over `.ts`, `.tsx`, `.js` and `.jsx` with an inline
  tsconfig (`module: commonjs`, `allowJs: true`, `isolatedModules: true`).
  `isolatedModules` means tests are transpiled without type checking — run
  `npm run typecheck` for types.
- `setupFilesAfterEnv` loads `jest-styled-components`, `jest-dom` and
  `jest.setup.ts`.
- `moduleNameMapper` maps `*.svg` to `__mocks__/svg.mock.js` and
  `react-merge-refs` to `__mocks__/react-merge-refs.js`.

### Why `react-merge-refs` is mapped

`react-merge-refs` 2.x is published as ESM only (`type: "module"`). Jest's
CommonJS runtime cannot require it, and jsdom + ts-jest cannot transform an
`.mjs` dependency into CJS. `__mocks__/react-merge-refs.js` reimplements the
15-line upstream utility. The real package is still used by rollup for the
production bundles.

### `jest.setup.ts`

- stubs `window.matchMedia` (jsdom implements neither `matchMedia` nor media
  queries), reporting a desktop viewport;
- pins `document.dir` to `ltr`, which `createTheme` reads to decide RTL;
- imports `jest-styled-components` so TypeScript sees `toHaveStyleRule`.

## Conventions

- Co-locate `*.test.ts(x)` / `*.spec.ts(x)` with the code.
- Render through `src/modules/test/render.tsx` when the component needs Garden's
  `ThemeProvider`, `ToastProvider` or the modal container.
- `src/modules/test/waitForNextUpdate.ts` replaces the helper that
  `@testing-library/react-hooks` used to provide: it flushes the microtask queue
  inside `act()` so hook specs can keep asserting settled state.
- Prefer `await waitFor(() => expect(...))` for anything that depends on a
  network response; React 18 batches updates, so a synchronous assertion right
  after an event may run before the re-render.
- Hover/focus styling cannot be computed by jsdom. Assert the generated rule:

  ```ts
  expect(element).toHaveStyleRule("border-color", theme.colors.primaryHue, {
    modifier: ":hover",
  });
  ```

- jsdom has no layout: `scrollWidth` / `clientWidth` are `0`, so specs that
  depend on overflow (`src/code-blocks.spec.js`) stub the measurements with
  `Object.defineProperty`.

- `window.location` is read-only in jsdom 27. Navigation goes through
  `navigateTo()` (`src/modules/shared/navigation.ts`), which tests mock per
  module: `jest.mock("../../shared/navigation", () => ({ navigateTo: jest.fn() }))`.

## Known warnings

- `sass` prints `@import` deprecation warnings while compiling `style.css`
  (48 files still use the legacy import system). They are non-fatal; migrating
  to `@use` / `@forward` is tracked separately because it changes the Sass
  cascade for every partial at once.
- Dart Sass ≥ 1.77.7 no longer hoists declarations above a nested `@media`
  block, which is why `styles/` puts declarations before breakpoint includes;
  `npm run validate` enforces it (`docs/setup.md`, gate 7). Dart Sass also
  emits a `mixed-decls` deprecation warning for the reverse order.
- React logs `act(...)` warnings if a test mounts an entry point outside
  `act()`; wrap those calls in `await act(async () => { ... })` so the root is
  committed before assertions run.

## Adding a test for a new module

1. Put the test next to the component.
2. Use `render` from `src/modules/test/render` for anything using Garden.
3. Mock `fetch` at the module boundary (`globalThis.fetch = jest.fn()`), not the
   hook, so the request shaping stays covered.
4. Assert user-visible output (`screen.getByRole`, `getByLabelText`) rather than
   class names or internal state.
