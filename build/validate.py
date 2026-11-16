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
7. `style.css` declares before it nests: a rule may not place a `@media` block
   before declarations for the same selector, because Dart Sass >= 1.77.7 no
   longer hoists those declarations (the allowlisted upstream cases aside).

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

# Dart Sass >= 1.77.7 emits a nested `@media` block where it appears in the
# source instead of hoisting the declarations that follow it, so a rule written
# as `@include tablet { … }` plus base declarations compiles to
#
#     @media (min-width: 768px) { .x { margin: 0 15px } }
#     .x { margin: 0 0 30px }
#
# and the responsive value never applies. Rules must therefore declare first and
# nest afterwards (see docs/setup.md). The three pairs kept here compile the same
# way in the upstream theme and are harmless: the declarations after the media
# block touch properties the breakpoint does not (`color`/`display` vs
# `text-decoration`/`padding`, `order`/`position` vs `padding`, `font-size` vs
# `width`).
KNOWN_INVERSIONS = frozenset({
    ".collapsible-nav-list li a",
    ".collapsible-nav-list li[aria-selected=true]",
    ".recent-activity-item-link",
})


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


def css_blocks(css: str) -> list[tuple[str, str]]:
    """Split a stylesheet into (header, body) pairs, at any nesting depth."""
    blocks: list[tuple[str, str]] = []
    depth = 0
    start = 0
    header = ""
    body_start = 0

    for index, char in enumerate(css):
        if char == "{":
            if depth == 0:
                header = css[start:index].strip()
                body_start = index + 1
            depth += 1
        elif char == "}":
            depth -= 1
            if depth == 0:
                blocks.append((header, css[body_start:index]))
                start = index + 1

    return blocks


def check_style_order(failures: list[str]) -> int:
    """Gate 7: a rule may not be emitted as `@media` block + base declarations.

    Dart Sass >= 1.77.7 keeps declarations in source order, so a rule written
    mobile-first (`@include tablet { … }` first, base declarations after)
    compiles to a media block immediately followed by the base rule for the same
    selector. The base declaration then wins at every width and the responsive
    rule is dead.
    """
    css = re.sub(r"/\*.*?\*/", "", open("style.css", encoding="utf-8").read(), flags=re.DOTALL)
    blocks = css_blocks(css)
    inversions: set[str] = set()

    for index in range(1, len(blocks)):
        header, _body = blocks[index]
        previous_header, previous_body = blocks[index - 1]
        if header.startswith("@") or not previous_header.startswith("@media"):
            continue

        responsive = {
            " ".join(selector.split())
            for nested_header, _ in css_blocks(previous_body)
            for selector in nested_header.split(",")
            if selector.strip()
        }
        base = {" ".join(selector.split()) for selector in header.split(",") if selector.strip()}
        shared = responsive & base
        if shared:
            inversions.add(min(shared))

    for selector in sorted(inversions - KNOWN_INVERSIONS):
        failures.append(
            f"style.css: the @media block of {selector!r} directly precedes its "
            "base declarations — declare first, nest afterwards"
        )
    for selector in sorted(KNOWN_INVERSIONS - inversions):
        failures.append(
            f"style.css: {selector!r} is in KNOWN_INVERSIONS but is no longer "
            "inverted — remove it from the allowlist"
        )

    return len(inversions)


def main() -> int:
    failures: list[str] = []

    theme_locales, module_locales, base_keys = check_locales(failures)
    import_count, bundle_count = check_import_map(failures)
    manifest = check_manifest(failures)
    check_branding(failures)
    check_third_party_notices(failures)
    inversion_count = check_style_order(failures)

    print(
        f"locales: {len(theme_locales)} theme ({base_keys} base keys), "
        f"{len(module_locales)} module"
    )
    print(f"bundles: {bundle_count}, import map entries: {import_count}")
    print(
        f"manifest: {manifest.get('name')} {manifest.get('version')} "
        f"(api {manifest.get('api_version')})"
    )
    print(f"style: {inversion_count} media-block inversions, all allowlisted")

    if failures:
        print("FAILURES:")
        for failure in failures:
            print(f" - {failure}")
        return 1

    print("all gates passed")
    return 0


if __name__ == "__main__":
    sys.exit(main())
