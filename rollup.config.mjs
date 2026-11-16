import { defineConfig } from "rollup";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import dynamicImportVars from "@rollup/plugin-dynamic-import-vars";
import typescript from "@rollup/plugin-typescript";
import replace from "@rollup/plugin-replace";
import terser from "@rollup/plugin-terser";
import svgr from "@svgr/rollup";
import themeSass from "./build/sass-settings.mjs";
import { generateImportMap } from "./build/import-map.mjs";

const bundleFileNames = "[name]-bundle.js";
const isProduction = process.env.NODE_ENV === "production";
const TRANSLATION_FILE_REGEX =
  /src\/modules\/(.+?)\/translations\/locales\/.+?\.json$/;

/**
 * Banners delimited by `/*! ... *\/` and the `@license` / `@preserve` pragmas
 * must survive minification, because the bundles ship third-party code whose
 * licences have to stay intact in the published theme.
 */
const LICENSE_COMMENT_PATTERN = /@license|@preserve|^!/;

export default defineConfig([
  // Bundles the theme's own JavaScript (dropdowns, navigation, search, ...)
  // into the single `script.js` file the templates load.
  {
    input: "src/index.js",
    output: {
      file: "script.js",
      format: "iife",
    },
    plugins: [themeSass()],
    watch: {
      clearScreen: false,
    },
  },
  // Bundles the React modules in `src/modules` into `assets/`. Shared
  // dependencies land in the `shared` chunk and each module keeps its own
  // chunk, because `templates/document_head.hbs` loads them by name through
  // the import map.
  {
    context: "this",
    input: {
      "new-request-form": "src/modules/new-request-form/index.tsx",
      "request-list": "src/modules/request-list/index.tsx",
      "flash-notifications": "src/modules/flash-notifications/index.ts",
      "service-catalog": "src/modules/service-catalog/index.tsx",
      "approval-requests": "src/modules/approval-requests/index.tsx",
    },
    output: {
      dir: "assets",
      format: "es",
      manualChunks: (id) => {
        if (
          id.includes("node_modules/@zendesk/help-center-wysiwyg") ||
          id.includes("node_modules/@ckeditor5")
        ) {
          return "wysiwyg";
        }

        if (id.includes("node_modules") || id.includes("src/modules/shared")) {
          return "shared";
        }

        if (id.includes("src/modules/ticket-fields")) {
          return "ticket-fields";
        }

        // Bundle all files from `src/modules/MODULE_NAME/translations/locales/*.json`
        // into `MODULE_NAME-translations.js`
        const translationFileMatch = id.match(TRANSLATION_FILE_REGEX);
        if (translationFileMatch) {
          return `${translationFileMatch[1]}-translations`;
        }
      },
      entryFileNames: bundleFileNames,
      chunkFileNames: bundleFileNames,
    },
    plugins: [
      nodeResolve({
        extensions: [".js"],
      }),
      commonjs(),
      typescript(),
      replace({
        preventAssignment: true,
        "process.env.NODE_ENV": '"production"',
      }),
      svgr({
        svgo: true,
        svgoConfig: {
          plugins: [
            {
              name: "preset-default",
              params: {
                overrides: {
                  removeTitle: false,
                  convertPathData: false,
                  removeViewBox: false,
                },
              },
            },
          ],
        },
      }),
      json(),
      dynamicImportVars(),
      isProduction && terser({ format: { comments: LICENSE_COMMENT_PATTERN } }),
      generateImportMap(),
    ],
    watch: {
      clearScreen: false,
    },
  },
]);
