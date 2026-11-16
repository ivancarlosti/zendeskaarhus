/**
 * Test shim for `react-merge-refs`.
 *
 * `react-merge-refs` 2.x is published as ESM only, which Jest's CommonJS
 * runtime cannot require. The implementation below mirrors the upstream one:
 * https://github.com/gregberge/react-merge-refs
 */
function mergeRefs(refs) {
  return (instance) => {
    for (const ref of refs) {
      if (typeof ref === "function") {
        ref(instance);
      } else if (ref) {
        ref.current = instance;
      }
    }
  };
}

module.exports = {
  __esModule: true,
  mergeRefs,
  default: mergeRefs,
};
