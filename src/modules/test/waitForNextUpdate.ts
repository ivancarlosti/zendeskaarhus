import { act } from "@testing-library/react";

/**
 * Flushes the pending React updates triggered by asynchronous work.
 *
 * `@testing-library/react-hooks` shipped a `waitForNextUpdate()` helper that
 * `@testing-library/react` 16 does not provide. The hook specs in this theme
 * follow the "trigger an async request, then assert the settled state" pattern,
 * so a small `act`-based flush keeps them readable without rewriting every
 * assertion into a `waitFor()` callback.
 */
export async function waitForNextUpdate() {
  // Async `act` drains the microtask queue, which settles the pending
  // `fetch(...).then(...)` chains, and flushes the resulting state updates.
  // Several rounds are needed because those chains are a few promises deep.
  for (let round = 0; round < 5; round += 1) {
    await act(async () => {
      await Promise.resolve();
    });
  }
}
