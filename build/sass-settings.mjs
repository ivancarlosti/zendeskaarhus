import fs from "fs";
import path from "path";
import sass from "rollup-plugin-sass";

const MANIFEST_PATH = path.resolve("manifest.json");
const ASSETS_PATH = path.resolve("assets");

/**
 * Prefix for the Sass functions the theme forwards to Help Center admins.
 *
 * `theme-lighten()` and `theme-darken()` cannot be evaluated at build time
 * because their arguments are theme settings the admin picks in Theming
 * Center, so Sass keeps them verbatim in `style.css`. The prefix exists only
 * to stop the Sass compiler from running them; right before the CSS is written
 * they are renamed to their plain Sass equivalents so the editor shows
 * `lighten()` and `darken()`.
 */
const THEME_FUNCTION_PREFIX = "theme-";

/**
 * Collects every variable the theme exposes: the identifiers declared in
 * `manifest.json` plus one per file in `assets/`, which templates reference
 * through the asset helper.
 *
 * @returns {string[]} Variable names without the leading `$`
 */
function collectThemeVariables() {
  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf-8"));
  const variables = manifest.settings.reduce(
    (variables, setting) =>
      variables.concat(setting.variables.map((variable) => variable.identifier)),
    []
  );

  for (const file of fs.readdirSync(ASSETS_PATH)) {
    if (file === ".gitkeep") continue;

    const extname = path.extname(file);
    const basename = path.basename(file, extname).toLowerCase();

    // Make sure all assets have a filename that can be used as a variable
    if (basename.match(/[^a-z0-9-_+.]/)) {
      throw new Error(
        `The asset "${file}" has illegal characters in its name. Filenames should only have alpha-numerical characters, ., _, -, and +`
      );
    }

    variables.push(
      `assets-${basename.replace(/\+|\./g, "-")}-${extname.split(".").pop()}`
    );
  }

  return variables;
}

/**
 * Builds the Sass preamble that assigns every theme variable to an escaped
 * version of its own name, e.g.
 *
 *   $brand_color: \$brand_color;
 *
 * Sass then replaces occurrences of the variable with the escaped name, which
 * {@link unescapeVariables} turns back into `$brand_color` in the output. The
 * result is a `style.css` that can still be customised in Theming Center.
 *
 * @returns {string}
 */
function buildPreamble() {
  return collectThemeVariables()
    .map((variable) => `$${variable}: \\$${variable};`)
    .join("\n");
}

/**
 * @param {string} css
 * @returns {string}
 */
function unescapeVariables(css) {
  return css.replace(/\\\$/g, "$");
}

/**
 * @param {string} css
 * @returns {string}
 */
function convertThemeFunctions(css) {
  return css
    .replaceAll(`${THEME_FUNCTION_PREFIX}lighten`, "lighten")
    .replaceAll(`${THEME_FUNCTION_PREFIX}darken`, "darken");
}

/**
 * Rollup plugin that compiles `styles/index.scss` into `style.css`.
 *
 * @returns {import("rollup").Plugin}
 */
export default function themeSass() {
  return sass({
    output: "style.css",
    options: { data: buildPreamble() },
    processor: (css) => convertThemeFunctions(unescapeVariables(css)),
  });
}
