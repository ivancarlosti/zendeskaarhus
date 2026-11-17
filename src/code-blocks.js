// Code blocks
//
// Wraps every code block in `.code-block` and adds a copy button, a language
// badge and a live region. The controls are siblings of the <pre>, never
// children: a <pre> is its own scroll container, so anything inside it would
// travel with the horizontal and vertical scrollbars instead of staying put.
//
// Blocks are skipped when they are editable (the CKEditor instance and the
// `{{wysiwyg}}` field), empty, or explicitly opted out with `data-no-copy`.

const WRAPPER_CLASS = "code-block";
const BUTTON_CLASS = "code-block-copy";
const BADGE_CLASS = "code-block-language";
const STATUS_CLASS = "code-block-status";

const EXCLUDED_SELECTOR = [
  "[contenteditable]:not([contenteditable='false'])",
  ".ck-editor",
  ".ck-content",
  "#hc-wysiwyg",
  "[data-no-copy]",
].join(",");

// Matches `language-js`, `lang-js` and the `language-` prefixed classes Prism
// and highlight.js leave behind.
const LANGUAGE_CLASS_PATTERN = /\b(?:language|lang)-([a-z0-9+#-]+)/i;

const DEFAULT_LABELS = {
  copy: "Copy code",
  success: "Code copied to clipboard",
  failure: "Couldn't copy the code",
};

const FEEDBACK_DURATION = 2000;
const OBSERVER_DEBOUNCE = 100;

const ICONS = {
  copy: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" focusable="false" aria-hidden="true"><rect x="5.25" y="5.25" width="8.25" height="8.5" rx="1.5" fill="none" stroke="currentColor" stroke-linejoin="round"/><path d="M10.75 5.25v-1.5a1.5 1.5 0 0 0-1.5-1.5h-5.5a1.5 1.5 0 0 0-1.5 1.5v5.5a1.5 1.5 0 0 0 1.5 1.5h1.5" fill="none" stroke="currentColor" stroke-linecap="round"/></svg>',
  success:
    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" focusable="false" aria-hidden="true"><path d="M2.75 8.5 6.25 12l7-7.5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  failure:
    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" focusable="false" aria-hidden="true"><circle cx="8" cy="8" r="5.75" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="m6.25 6.25 3.5 3.5m0-3.5-3.5 3.5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
};

// Short labels for the language badge; anything else falls back to the upper
// cased token, truncated by CSS.
const LANGUAGE_ALIASES = {
  bash: "BASH",
  c: "C",
  cpp: "C++",
  cs: "C#",
  csharp: "C#",
  css: "CSS",
  go: "GO",
  html: "HTML",
  java: "JAVA",
  javascript: "JS",
  js: "JS",
  json: "JSON",
  kotlin: "KOTLIN",
  markdown: "MD",
  md: "MD",
  php: "PHP",
  plaintext: "TEXT",
  py: "PY",
  python: "PY",
  rb: "RB",
  ruby: "RB",
  rust: "RS",
  scss: "SCSS",
  sh: "SH",
  shell: "SH",
  sql: "SQL",
  swift: "SWIFT",
  text: "TEXT",
  ts: "TS",
  typescript: "TS",
  xml: "XML",
  yaml: "YAML",
  yml: "YAML",
  zsh: "SH",
};

const sizeObservers =
  typeof ResizeObserver === "function" ? new WeakMap() : null;

let resizeTimer = null;

/**
 * Labels come from `templates/document_head.hbs`; English is the fallback for
 * themes that do not set them.
 *
 * @returns {{copy: string, success: string, failure: string}}
 */
function getLabels() {
  const localized = window.codeBlockLabelsLocalized || {};

  return {
    copy: localized.copy || DEFAULT_LABELS.copy,
    success: localized.success || DEFAULT_LABELS.success,
    failure: localized.failure || DEFAULT_LABELS.failure,
  };
}

/**
 * Reads the code, dropping the trailing newline the markup usually carries.
 *
 * @param {HTMLPreElement} pre
 * @returns {string}
 */
function getCodeText(pre) {
  const code = pre.querySelector("code");
  const text = (code || pre).textContent || "";

  return text.replace(/\n+$/, "");
}

/**
 * @param {string} value
 * @returns {string}
 */
function normalizeLanguage(value) {
  const token = String(value)
    .trim()
    .replace(/^language-/, "")
    .toLowerCase();

  if (!token) return "";

  return LANGUAGE_ALIASES[token] || token.toUpperCase().slice(0, 10);
}

/**
 * Detects the language from `data-language` or a `language-*`/`lang-*` class on
 * the <pre> or its <code>.
 *
 * @param {HTMLPreElement} pre
 * @returns {string}
 */
function getLanguage(pre) {
  const dataLanguage = pre.getAttribute("data-language");
  if (dataLanguage) return normalizeLanguage(dataLanguage);

  for (const node of [pre, pre.querySelector("code")]) {
    if (!node) continue;

    const match = node.className.match(LANGUAGE_CLASS_PATTERN);
    if (match) return normalizeLanguage(match[1]);
  }

  return "";
}

/**
 * Copies through the async clipboard API and falls back to the deprecated
 * `execCommand` path when the API is unavailable or the permission is denied.
 *
 * @param {string} text
 * @returns {Promise<boolean>}
 */
async function copyText(text) {
  if (
    navigator.clipboard &&
    typeof navigator.clipboard.writeText === "function"
  ) {
    try {
      await navigator.clipboard.writeText(text);

      return true;
    } catch (error) {
      // Insecure context or denied permission: try the selection based copy.
    }
  }

  return copyTextWithSelection(text);
}

/**
 * @param {string} text
 * @returns {boolean}
 */
function copyTextWithSelection(text) {
  if (typeof document.execCommand !== "function" || !document.body) {
    return false;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.setAttribute("aria-hidden", "true");
  textarea.style.position = "fixed";
  textarea.style.top = "-1000px";
  textarea.style.opacity = "0";

  document.body.appendChild(textarea);

  const selection = document.getSelection();
  const previousRange =
    selection && selection.rangeCount > 0 ? selection.getRangeAt(0) : null;

  textarea.select();

  let copied = false;
  try {
    copied = document.execCommand("copy");
  } catch (error) {
    copied = false;
  }

  textarea.remove();

  if (selection && previousRange) {
    selection.removeAllRanges();
    selection.addRange(previousRange);
  }

  return copied;
}

/**
 * @param {HTMLButtonElement} button
 * @param {"idle" | "success" | "failure"} state
 */
function renderState(button, state) {
  button.dataset.state = state;
  button.innerHTML = ICONS[state] || ICONS.copy;
}

/**
 * @param {HTMLPreElement} pre
 * @param {{copy: string, success: string, failure: string}} labels
 * @returns {HTMLButtonElement}
 */
function createButton(pre, labels) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = BUTTON_CLASS;
  button.dataset.state = "idle";
  button.setAttribute("aria-label", labels.copy);
  button.title = labels.copy;
  button.innerHTML = ICONS.copy;

  let resetTimer = null;

  button.addEventListener("click", async () => {
    const copied = await copyText(getCodeText(pre));
    const status = button.parentElement
      ? button.parentElement.querySelector(`.${STATUS_CLASS}`)
      : null;

    window.clearTimeout(resetTimer);
    renderState(button, copied ? "success" : "failure");

    if (status) status.textContent = copied ? labels.success : labels.failure;

    resetTimer = window.setTimeout(() => {
      renderState(button, "idle");
      if (status) status.textContent = "";
    }, FEEDBACK_DURATION);
  });

  return button;
}

/**
 * @param {string} language
 * @returns {HTMLSpanElement}
 */
function createBadge(language) {
  const badge = document.createElement("span");
  badge.className = BADGE_CLASS;
  badge.textContent = language;
  // Decorative: the code itself is what gets read out.
  badge.setAttribute("aria-hidden", "true");

  return badge;
}

/**
 * Keeps `tabindex` in sync with the block's overflow: a scroll container has to
 * be reachable with the keyboard so it can be scrolled. Returns whether the
 * block scrolls.
 *
 * @param {HTMLPreElement} pre
 * @returns {boolean}
 */
function updateScrollable(pre) {
  const wrapper = pre.parentElement;
  if (!wrapper || !wrapper.classList.contains(WRAPPER_CLASS)) return false;

  const scrolls =
    pre.scrollWidth > pre.clientWidth + 1 ||
    pre.scrollHeight > pre.clientHeight + 1;

  if (scrolls) {
    pre.setAttribute("tabindex", "0");
  } else {
    pre.removeAttribute("tabindex");
  }

  wrapper.dataset.scrollable = scrolls ? "true" : "false";

  return scrolls;
}

/**
 * @param {HTMLPreElement} pre
 */
function observeSize(pre) {
  if (!sizeObservers || sizeObservers.has(pre)) return;
  if (typeof ResizeObserver !== "function") return;

  const observer = new ResizeObserver(() => updateScrollable(pre));
  sizeObservers.set(pre, observer);
  observer.observe(pre);
}

/**
 * @param {HTMLPreElement} pre
 * @returns {boolean} whether the block was enhanced
 */
function enhanceCodeBlock(pre) {
  if (!(pre instanceof Element) || pre.tagName !== "PRE") return false;
  if (pre.closest(EXCLUDED_SELECTOR)) return false;
  if (!pre.parentNode) return false;

  const existingWrapper =
    pre.parentElement && pre.parentElement.classList.contains(WRAPPER_CLASS)
      ? pre.parentElement
      : null;

  if (existingWrapper && existingWrapper.querySelector(`.${BUTTON_CLASS}`)) {
    return false;
  }

  const text = getCodeText(pre);
  if (!text.trim()) return false;

  const labels = getLabels();
  const button = createButton(pre, labels);
  const status = document.createElement("span");
  status.className = STATUS_CLASS;
  status.setAttribute("role", "status");

  const language = getLanguage(pre);
  const badge = language ? createBadge(language) : null;

  let wrapper = existingWrapper;
  if (!wrapper) {
    wrapper = document.createElement("div");
    wrapper.className = WRAPPER_CLASS;
    pre.parentNode.insertBefore(wrapper, pre);
    wrapper.appendChild(pre);
  }

  // Drives the strip that keeps the badge clear of the first line of code.
  if (language) wrapper.dataset.language = language;

  wrapper.insertBefore(button, pre);
  if (badge) wrapper.insertBefore(badge, pre);
  wrapper.insertBefore(status, pre);

  updateScrollable(pre);
  observeSize(pre);

  return true;
}

/**
 * Enhances every code block below `root`. Idempotent: running it again leaves
 * already enhanced blocks untouched.
 *
 * @param {ParentNode} root
 * @returns {number} number of enhanced blocks
 */
function initCodeBlocks(root = document) {
  if (!root || typeof root.querySelectorAll !== "function") return 0;

  let count = 0;

  const candidates = [...root.querySelectorAll("pre")];
  if (root instanceof Element && root.tagName === "PRE") {
    candidates.unshift(root);
  }

  candidates.forEach((pre) => {
    if (enhanceCodeBlock(pre)) count += 1;
  });

  return count;
}

/**
 * Re-initialises once a batch of inserted nodes settles, so blocks rendered
 * after page load (AJAX, community moderation, ...) get a button too.
 *
 * @returns {MutationObserver | null}
 */
function observeCodeBlocks() {
  if (typeof MutationObserver !== "function" || !document.body) return null;

  let timer = null;

  const observer = new MutationObserver((mutations) => {
    const inserted = mutations.some(
      (mutation) => mutation.addedNodes.length > 0
    );
    if (!inserted) return;

    window.clearTimeout(timer);
    timer = window.setTimeout(() => {
      initCodeBlocks(document);
    }, OBSERVER_DEBOUNCE);
  });

  observer.observe(document.body, { childList: true, subtree: true });

  return observer;
}

/**
 * Re-measures every block after the viewport changed, because a narrower
 * container can turn a fitting block into a scrollable one (and vice versa).
 */
function handleResize() {
  window.clearTimeout(resizeTimer);
  resizeTimer = window.setTimeout(() => {
    document
      .querySelectorAll(`.${WRAPPER_CLASS} > pre`)
      .forEach((pre) => updateScrollable(pre));
  }, OBSERVER_DEBOUNCE);
}

function startCodeBlocks() {
  initCodeBlocks(document);
  observeCodeBlocks();
  window.addEventListener("resize", handleResize, { passive: true });
}

window.addEventListener("DOMContentLoaded", startCodeBlocks, { once: true });

export {
  copyText,
  enhanceCodeBlock,
  getCodeText,
  getLanguage,
  initCodeBlocks,
  observeCodeBlocks,
  updateScrollable,
};
