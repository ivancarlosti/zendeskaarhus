/**
 * Navigates the browser to the given URL.
 *
 * Kept apart from the components so the redirects performed by the React
 * modules can be stubbed in tests: jsdom exposes `window.location` as a
 * read-only, non-configurable object.
 *
 * @param url Absolute or root-relative URL to navigate to
 */
export function navigateTo(url: string): void {
  window.location.assign(url);
}
