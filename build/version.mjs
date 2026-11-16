#!/usr/bin/env node
/**
 * Zendesk theme version helper.
 *
 * Guide refuses to import a theme package when `manifest.json` carries a
 * version it does not like:
 *
 *   Incorrect theme version number
 *   The imported theme version number is not allowed. Contact the theme
 *   developer to make sure the version conforms the Semantic versioning 2.0.0
 *   standard and is higher than the current version.
 *
 * Two rules follow from that message:
 *
 *   1. The version must be SemVer 2.0.0. Guide only accepts the
 *      MAJOR.MINOR.PATCH core, so the `v` tag prefix, pre-release identifiers
 *      (`1.2.0-rc.1`) and build metadata (`1.2.0+build.5`) are rejected.
 *   2. The version must be higher than the one already imported into the help
 *      center. The newest SemVer git tag reachable from HEAD records what was
 *      released last; export THEME_CURRENT_VERSION when the help center runs a
 *      version that no tag describes.
 *
 * Commands:
 *
 *   node build/version.mjs check
 *       Validate `manifest.json` and `package.json`: strict SemVer 2.0.0 and
 *       the same version. Warns when the tree is behind the newest release.
 *
 *   node build/version.mjs verify-release <version>
 *       `check` plus "the manifest must declare exactly <version>". Used by
 *       the packaging workflow so a zip never ships a stale version.
 *
 *   node build/version.mjs bump [patch|minor|major]
 *       Write the next version on top of the highest of: manifest, newest
 *       released tag and THEME_CURRENT_VERSION. Defaults to `patch`.
 *
 *   node build/version.mjs set <version>
 *       Write an explicit version. Refuses to go below the manifest, the
 *       newest released tag or THEME_CURRENT_VERSION.
 *
 *   node build/version.mjs current
 *       Print the manifest version (handy in shell scripts).
 *
 * Flags:
 *   --warn-only    Report problems but exit 0 (scheduled rebuilds).
 *
 * The version is written to `manifest.json`, `package.json` and the root
 * fields of `package-lock.json` so the theme package, npm metadata and the
 * lockfile never drift apart.
 */

import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';

const MANIFEST = 'manifest.json';
const PACKAGE = 'package.json';
const LOCKFILE = 'package-lock.json';

// Only the MAJOR.MINOR.PATCH core: leading zeros, pre-release and build
// suffixes, and a `v` prefix are all rejected by Guide on import.
const STRICT_SEMVER = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/;

const args = process.argv.slice(2);
const flags = new Set(args.filter((arg) => arg.startsWith('--')));
const positionals = args.filter((arg) => !arg.startsWith('--'));
const command = positionals.shift() ?? 'check';
const warnOnly = flags.has('--warn-only');
const inActions = process.env.GITHUB_ACTIONS === 'true';

let failures = 0;

function annotate(kind, message) {
  if (inActions) {
    console.log(`::${kind} title=Theme version::${message}`);
  }
}

function warn(message) {
  console.log(`WARNING: ${message}`);
  annotate('warning', message);
}

function fail(message) {
  failures += 1;
  console.error(`ERROR: ${message}`);
  annotate('error', message);
}

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

function writeJson(path, value) {
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`);
}

function loadFiles() {
  return {
    manifest: readJson(MANIFEST),
    pkg: existsSync(PACKAGE) ? readJson(PACKAGE) : null,
    lock: existsSync(LOCKFILE) ? readJson(LOCKFILE) : null,
  };
}

/** Validates a version and normalises an optional `v` prefix away. */
function normalise(version, label) {
  if (typeof version !== 'string') {
    fail(`${label}: no version found`);
    return null;
  }

  const candidate = version.trim().replace(/^v/, '');
  if (!STRICT_SEMVER.test(candidate)) {
    fail(
      `${label}: ${JSON.stringify(version)} is not a strict SemVer 2.0.0 ` +
        'version — Guide only accepts MAJOR.MINOR.PATCH (no "v" prefix, ' +
        'no pre-release/build suffix)',
    );
    return null;
  }

  return candidate;
}

function parts(version) {
  return version.split('.').map(Number);
}

function compare(a, b) {
  const [aMajor, aMinor, aPatch] = parts(a);
  const [bMajor, bMinor, bPatch] = parts(b);
  if (aMajor !== bMajor) return aMajor - bMajor;
  if (aMinor !== bMinor) return aMinor - bMinor;
  return aPatch - bPatch;
}

function highest(...versions) {
  return versions
    .filter((version) => version && STRICT_SEMVER.test(version))
    .reduce((max, version) => (!max || compare(version, max) > 0 ? version : max), null);
}

/** Highest SemVer version among the tags reachable from HEAD, `v` stripped. */
function latestReleased() {
  try {
    const output = execFileSync('git', ['tag', '--merged', 'HEAD'], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    });

    return highest(
      ...output
        .split('\n')
        .map((tag) => tag.trim().replace(/^v/, ''))
        .filter(Boolean),
    );
  } catch {
    // Not a git checkout, or a shallow clone without tags: nothing to compare.
    return null;
  }
}

/** Version currently imported into the help center, when it is not a tag. */
function installedVersion() {
  const raw = process.env.THEME_CURRENT_VERSION;
  if (!raw || !raw.trim()) {
    return null;
  }

  return normalise(raw, 'THEME_CURRENT_VERSION');
}

/**
 * Lower bounds a new version must not fall below. Equality is allowed: it is a
 * no-op when the tree is already stamped, and it lets a manual release repair a
 * tag whose manifest was never updated.
 */
function floors() {
  const { manifest } = loadFiles();

  return [
    { label: MANIFEST, version: normalise(manifest.version, MANIFEST) },
    { label: 'newest released tag', version: latestReleased() },
    { label: 'help center (THEME_CURRENT_VERSION)', version: installedVersion() },
  ].filter((floor) => floor.version);
}

function writeVersion(version) {
  const { manifest, pkg, lock } = loadFiles();
  const changed = [];

  function stamp(file, data, setter) {
    if (!data) return;

    const before = JSON.stringify(data);
    setter(data);
    if (JSON.stringify(data) === before) return;

    writeJson(file, data);
    changed.push(file);
  }

  stamp(MANIFEST, manifest, (data) => {
    data.version = version;
  });

  stamp(PACKAGE, pkg, (data) => {
    data.version = version;
  });

  stamp(LOCKFILE, lock, (data) => {
    data.version = version;
    if (data.packages && data.packages['']) {
      data.packages[''].version = version;
    }
  });

  if (changed.length === 0) {
    console.log(`version ${version} was already stamped — nothing to write`);
  } else {
    console.log(`stamped version ${version} into ${changed.join(', ')}`);
  }

  return version;
}

function checkFiles(releasedVersion = null) {
  const { manifest, pkg, lock } = loadFiles();

  const manifestVersion = normalise(manifest.version, MANIFEST);
  const packageVersion = pkg ? normalise(pkg.version, PACKAGE) : null;

  if (manifestVersion && packageVersion && manifestVersion !== packageVersion) {
    fail(
      `${MANIFEST} (${manifestVersion}) and ${PACKAGE} (${packageVersion}) ` +
        'carry different versions — release tooling stamps both',
    );
  }

  const lockVersion = lock && typeof lock.version === 'string'
    ? normalise(lock.version, LOCKFILE)
    : null;
  if (manifestVersion && lockVersion && manifestVersion !== lockVersion) {
    warn(
      `${LOCKFILE} is at ${lockVersion} while ${MANIFEST} is at ` +
        `${manifestVersion} — run \`npm install --package-lock-only\` ` +
        'or `npm run version:bump` to re-sync it',
    );
  }

  if (manifestVersion && releasedVersion && manifestVersion !== releasedVersion) {
    fail(
      `${MANIFEST} declares ${manifestVersion} but this run packages ` +
        `${releasedVersion} — Guide rejects a theme whose version is not ` +
        'higher than the version it already has; release a new version ' +
        'instead of repackaging this tag',
    );
  }

  const released = latestReleased();
  if (manifestVersion && released) {
    const delta = compare(manifestVersion, released);
    if (delta < 0) {
      warn(
        `${MANIFEST} (${manifestVersion}) is behind the newest released tag ` +
          `v${released} — semantic-release stamps it on the next release; run ` +
          '`npm run version:bump` before importing the theme by hand',
      );
    } else if (delta === 0 && releasedVersion) {
      // Expected: the tag being packaged and the manifest agree. Worth stating
      // because Guide rejects a package whose version the help center already
      // runs, which is the trap re-releasing a tag falls into.
      console.log(
        `${MANIFEST} ${manifestVersion} matches v${released} — Guide accepts ` +
          'this package only if the help center does not run it yet',
      );
    }
  }

  if (manifestVersion && !releasedVersion) {
    console.log(
      `${MANIFEST} ${manifestVersion}` +
        (released ? ` (newest released tag v${released})` : ' (no released tag yet)'),
    );
  }

  return manifestVersion;
}

function verifyRelease(version) {
  if (!version) {
    fail(
      'verify-release needs the version being packaged, e.g. ' +
        '`verify-release 1.2.0`',
    );
    return;
  }

  const expected = normalise(version, 'release version');
  if (!expected) {
    return;
  }

  checkFiles(expected);
}

function bump(level) {
  const increment = level ?? 'patch';
  if (!['patch', 'minor', 'major'].includes(increment)) {
    fail(
      'bump level must be patch, minor or major — received ' +
        JSON.stringify(increment),
    );
    return;
  }

  const { manifest } = loadFiles();
  const current = normalise(manifest.version, MANIFEST);
  if (!current) {
    return;
  }

  const base = highest(current, latestReleased(), installedVersion()) ?? current;
  let [major, minor, patch] = parts(base);

  if (increment === 'major') {
    major += 1;
    minor = 0;
    patch = 0;
  } else if (increment === 'minor') {
    minor += 1;
    patch = 0;
  } else {
    patch += 1;
  }

  const next = `${major}.${minor}.${patch}`;
  if (base !== current) {
    console.log(`bumping from ${current} (highest known version: ${base})`);
  }

  writeVersion(next);
  console.log(`next version: ${next}`);
}

function setVersion(version) {
  if (!version) {
    fail('set needs a version, e.g. `node build/version.mjs set 1.2.0`');
    return;
  }

  const target = normalise(version, 'requested version');
  if (!target) {
    return;
  }

  for (const floor of floors()) {
    const delta = compare(target, floor.version);
    if (delta < 0) {
      fail(
        `${target} is lower than ${floor.label} (${floor.version}) — Guide ` +
          'only accepts a version higher than the current one',
      );
    } else if (delta === 0 && floor.label !== MANIFEST) {
      warn(
        `${target} matches ${floor.label}; Guide rejects the import if that ` +
          'version is already installed',
      );
    }
  }

  if (failures > 0) {
    return;
  }

  writeVersion(target);
}

function currentVersion() {
  const { manifest } = loadFiles();
  const version = normalise(manifest.version, MANIFEST);
  if (version) {
    console.log(version);
  }
}

switch (command) {
  case 'check':
    checkFiles();
    break;
  case 'verify-release':
    verifyRelease(positionals[0]);
    break;
  case 'bump':
    bump(positionals[0]);
    break;
  case 'set':
    setVersion(positionals[0]);
    break;
  case 'current':
    currentVersion();
    break;
  default:
    fail(
      `unknown command ${JSON.stringify(command)} — use check, ` +
        'verify-release, bump, set or current',
    );
}

if (failures > 0) {
  if (warnOnly) {
    console.log(`--warn-only: ignoring ${failures} failure(s)`);
  } else {
    process.exitCode = 1;
  }
}

