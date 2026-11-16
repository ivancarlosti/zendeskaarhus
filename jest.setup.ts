// Registers the `jest-styled-components` matchers (`toHaveStyleRule`). The
// module is already loaded through `setupFilesAfterEnv`; importing it here as
// well makes TypeScript pick up its global matcher declarations.
import "jest-styled-components";
import { jest } from "@jest/globals";

/**
 * jsdom does not implement `matchMedia`, which the Garden components use for
 * their responsive behaviour. The stub always reports a desktop viewport.
 */
const createMediaQueryList = (query: string) =>
  ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }) as unknown as MediaQueryList;

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn(createMediaQueryList),
});

// `document.dir` is read by the theme factory to decide between LTR and RTL.
Object.defineProperty(document, "dir", {
  writable: true,
  value: "ltr",
});
