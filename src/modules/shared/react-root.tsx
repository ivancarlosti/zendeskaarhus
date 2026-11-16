import type { ReactElement } from "react";
import { createRoot } from "react-dom/client";
import type { Root } from "react-dom/client";

/**
 * Roots already created for a given container.
 *
 * React 18 refuses to create a second root on a container that already has
 * one, and some theme entry points render twice into the same element (a
 * loading state followed by the page itself). Keeping the roots in a WeakMap
 * lets those entry points re-render the existing root instead of remounting.
 */
const roots = new WeakMap<Element, Root>();

/**
 * Mounts a React tree into a container using the React 18 root API.
 *
 * @param container Element the tree should be rendered into
 * @param element   React element to render
 * @returns The root that owns the container
 */
export function mountReactApp(
  container: Element,
  element: ReactElement
): Root {
  const existingRoot = roots.get(container);

  if (existingRoot) {
    existingRoot.render(element);
    return existingRoot;
  }

  const root = createRoot(container);
  roots.set(container, root);
  root.render(element);

  return root;
}

/**
 * Unmounts the root previously created for a container, if any.
 *
 * @param container Element passed to {@link mountReactApp}
 * @returns `true` when a root was unmounted
 */
export function unmountReactApp(container: Element): boolean {
  const root = roots.get(container);

  if (!root) {
    return false;
  }

  root.unmount();
  roots.delete(container);

  return true;
}
