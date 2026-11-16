#!/usr/bin/env python3
"""Validates the built theme against the release gates.

Run after `npm run build`:

    python3 build/validate.py     # or: npm run validate

Checks:

1. Every locale JSON parses, all locales share the same base key set, and the
   three custom settings either have all seven keys or none (Guide falls back to
   `en-us` for the rest).
2. Module locale files no longer contain the legacy `cph-theme-` namespace.
3. The import map in `templates/document_head.hbs` maps exactly the bundles in
   `assets/`.
4. `manifest.json` and `package.json` carry the same, strict SemVer 2.0.0
   version (Guide rejects anything else), the theme is named "Aarhus", and
   every `file` setting has a matching `settings/` asset (Guide refuses to
   import the theme otherwise).
5. No shipped file mentions the upstream brands.
6. The chunks that embed third-party code keep their license notice.

Exits with status 1 and prints the failures when a gate does not hold.
"""

from __future__ import annotations

import glob
import json
import os
import re
import sys

CUSTOM_KEYS = {
    "custom_group_label",
    "logout_url_label",
    "logout_url_description",
    "inject_script_label",
    "inject_script_description",
    "inject_style_label",
    "inject_style_description",
}

BRANDS = ("copenlight", "copenhagen", "cph-theme")

# Chunks that inline third-party libraries and therefore must keep the banners
# terser preserves (`format.comments: /@license|@preserve|^!/`).
THIRD_PARTY_CHUNKS = (
    "assets/shared-bundle.js",
    "assets/wysiwyg-bundle.js",
)

BINARY_SUFFIXES = (".png", ".jpg", ".jpeg", ".ico", ".gif", ".woff", ".woff2")


def check_locales(failures: list[str]) -> tuple[list[str], list[str], int]:
    theme_locales = sorted(glob.glob("translations/*.json"))
    base_keys: set[str] | None = None

    for path in theme_locales:
        keys = set(json.load(open(path, encoding="utf-8")))
        custom_keys = keys & CUSTOM_KEYS
        if custom_keys and custom_keys != CUSTOM_KEYS:
            failures.append(
                f"{path}: custom settings keys incomplete "
                f"({sorted(CUSTOM_KEYS - keys)})"
            )

        base = keys - CUSTOM_KEYS
        if base_keys is None:
            base_keys = base
        elif base != base_keys:
            failures.append(f"{path}: base translation keys differ")

    module_locales = sorted(
        glob.glob("src/modules/*/translations/locales/*.json")
    )
    for path in module_locales:
        data = json.load(open(path, encoding="utf-8"))
        legacy = [key for key in data if key.startswith("cph-theme-")]
        if legacy:
            failures.append(f"{path}: legacy key {legacy[0]}")

    return theme_locales, module_locales, len(base_keys or ())



def check_import_map(failures: list[str]) -> tuple[int, int]:
    head = open("templates/document_head.hbs", encoding="utf-8").read()
    match = re.search(
        r'<script type="importmap">(.*?)</script>', head, re.DOTALL
    )
    if not match:
        failures.append("templates/document_head.hbs: no import map found")
        return 0, 0

    imports = json.loads(match.group(1))["imports"]
    bundles = {os.path.basename(path) for path in glob.glob("assets/*-bundle.js")}
    mapped = set()
    for value in imports.values():
        asset = re.search(r"asset '([^']+)'", value)
        if not asset:
            failures.append(f"import map value without asset helper: {value}")
            continue
        mapped.add(asset.group(1))

    if bundles != mapped:
        failures.append(
            f"import map does not match assets/: {sorted(bundles ^ mapped)}"
        )

    return len(imports), len(bundles)


def check_manifest(failures: list[str]) -> dict:
    manifest = json.load(open("manifest.json", encoding="utf-8"))
    package = json.load(open("package.json", encoding="utf-8"))

    if manifest["version"] != package["version"]:
        failures.append(
            "manifest.json and package.json versions differ "
            f"({manifest['version']} != {package['version']})"
        )

    # Guide imports a theme only when the version is strict SemVer 2.0.0
    # (MAJOR.MINOR.PATCH) and higher than the installed one; anything else
    # fails with "Incorrect theme version number".
    semver = re.compile(r"^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$")
    for path, data in (("manifest.json", manifest), ("package.json", package)):
        if not semver.match(str(data.get("version", ""))):
            failures.append(
                f"{path}: {data.get('version')!r} is not a strict SemVer 2.0.0 "
                "version (MAJOR.MINOR.PATCH, no 'v' prefix, no pre-release)"
            )

    if manifest["name"] != "Aarhus":
        failures.append(f"manifest name is {manifest['name']!r}, expected 'Aarhus'")
    if manifest["api_version"] != 4:
        failures.append("manifest api_version must be 4")

    # Guide resolves a `file` setting to `settings/<identifier>.<ext>` (or to the
    # explicit `value`) and aborts the import with "We were unable to find this
    # file: settings/<identifier>" when the theme does not carry it. The lookup is
    # by identifier stem, so the extension can be anything the setting accepts.
    for group in manifest["settings"]:
        for variable in group["variables"]:
            if variable["type"] != "file":
                continue
            identifier = variable["identifier"]
            candidates = glob.glob(f"settings/{identifier}.*")
            candidates.append(f"settings/{identifier}")
            if variable.get("value"):
                candidates.append(variable["value"])
            if not any(os.path.exists(path) for path in candidates):
                failures.append(
                    f"manifest.json: {identifier} is a file setting but "
                    f"settings/{identifier}.* is missing — Guide rejects the upload"
                )

    return manifest


def check_branding(failures: list[str]) -> None:
    shipped = (
        glob.glob("templates/*")
        + glob.glob("styles/*")
        + glob.glob("settings/*")
        + glob.glob("sample/*")
        + glob.glob("translations/*")
        + glob.glob("assets/*")
        + ["manifest.json", "style.css", "script.js"]
    )

    for path in shipped:
        if path.lower().endswith(BINARY_SUFFIXES):
            continue
        text = open(path, encoding="utf-8", errors="ignore").read().lower()
        for brand in BRANDS:
            if brand in text:
                failures.append(f"{path}: mentions {brand}")


def check_third_party_notices(failures: list[str]) -> None:
    for path in THIRD_PARTY_CHUNKS:
        if not os.path.exists(path):
            failures.append(f"{path}: missing")
            continue
        text = open(path, encoding="utf-8", errors="ignore").read()
        if not re.search(r"@license|@preserve|/\*!", text):
            failures.append(f"{path}: third-party notice was stripped")


def main() -> int:
    failures: list[str] = []

    theme_locales, module_locales, base_keys = check_locales(failures)
    import_count, bundle_count = check_import_map(failures)
    manifest = check_manifest(failures)
    check_branding(failures)
    check_third_party_notices(failures)

    print(
        f"locales: {len(theme_locales)} theme ({base_keys} base keys), "
        f"{len(module_locales)} module"
    )
    print(f"bundles: {bundle_count}, import map entries: {import_count}")
    print(
        f"manifest: {manifest.get('name')} {manifest.get('version')} "
        f"(api {manifest.get('api_version')})"
    )

    if failures:
        print("FAILURES:")
        for failure in failures:
            print(f" - {failure}")
        return 1

    print("all gates passed")
    return 0


if __name__ == "__main__":
    sys.exit(main())
