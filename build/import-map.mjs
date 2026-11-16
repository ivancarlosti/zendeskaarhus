import fs from "fs";
import path from "path";

/**
 * When assets are deployed to Theming Center, their file name is changed and
 * this breaks the rollup bundles, where bundled files reference each other
 * with relative paths (e.g. `a.js` has an `import something from "./b.js"`).
 *
 * This plugin solves the issue by creating an import map for the browser:
 *
 * - relative imports are replaced with bare imports (`./b.js` -> `b`)
 * - an import map mapping each bare import to `{{asset '<file>'}}` is written
 *   into `templates/document_head.hbs`, where Curlybars expands the asset
 *   helper to the deployed file name
 *
 * `templates/document_head.hbs` must therefore always contain an import map
 * element; the first build can start from an empty one:
 *
 * ```html
 * <script type="importmap"></script>
 * ```
 *
 * @returns {import("rollup").Plugin}
 */
export function generateImportMap() {
  return {
    name: "rollup-plugin-generate-import-map",
    writeBundle({ dir }, bundle) {
      const outputAssets = Object.values(bundle);
      const importMap = { imports: {} };

      for (const { name, fileName } of outputAssets) {
        replaceImports(fileName, outputAssets, dir);
        importMap.imports[name] = `{{asset '${fileName}'}}`;
      }

      injectImportMap(importMap);
    },
  };
}

/**
 * Replaces relative imports with bare imports.
 *
 * @param {string} fileName Name of the current output asset
 * @param {import("rollup").OutputChunk[]} outputAssets Assets produced by the build
 * @param {string} outputPath Output directory
 */
function replaceImports(fileName, outputAssets, outputPath) {
  const filePath = path.resolve(outputPath, fileName);
  let content = fs.readFileSync(filePath, "utf-8");

  for (const { name, fileName } of outputAssets) {
    // Takes into account both single and double quotes
    const regex = new RegExp(`(['"])./${fileName}\\1`, "g");
    content = content.replaceAll(regex, `$1${name}$1`);
  }

  fs.writeFileSync(filePath, content, "utf-8");
}

/**
 * Writes the import map into `templates/document_head.hbs`, replacing the
 * existing one.
 *
 * @param {{ imports: Record<string, string> }} importMap
 */
function injectImportMap(importMap) {
  const headTemplatePath = path.resolve("templates", "document_head.hbs");
  const content = fs.readFileSync(headTemplatePath, "utf-8");
  const importMapStart = content.indexOf(`<script type="importmap">`);
  const importMapEnd = content.indexOf(`</script>`, importMapStart);

  if (importMapStart === -1 || importMapEnd === -1) {
    throw new Error(
      "Cannot inject the import map into templates/document_head.hbs. Please provide an empty import map such as <script type=\"importmap\"></script>"
    );
  }

  const existingImportMap = content.substring(
    importMapStart,
    importMapEnd + `</script>`.length
  );

  const newImportMap = `<script type="importmap">\n${JSON.stringify(
    importMap,
    null,
    2
  )}\n</script>`;

  fs.writeFileSync(
    headTemplatePath,
    content.replace(existingImportMap, newImportMap),
    "utf-8"
  );
}
