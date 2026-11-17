// Code blocks

import { fireEvent, screen, waitFor } from "@testing-library/dom";
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  jest,
  test,
} from "@jest/globals";

import {
  getCodeText,
  getLanguage,
  initCodeBlocks,
  observeCodeBlocks,
  updateScrollable,
} from "./code-blocks";

const LABELS = {
  copy: "Copiar código",
  success: "Código copiado para a área de transferência",
  failure: "Não foi possível copiar o código",
};

const writeText = jest.fn();

/**
 * Renders `markup` inside an article body and enhances it.
 *
 * @param {string} markup
 * @returns {{button: HTMLButtonElement, pre: HTMLPreElement, wrapper: HTMLElement}}
 */
function renderCodeBlock(markup = "<pre><code>npm install</code></pre>") {
  document.body.innerHTML = `<div class="article-body">${markup}</div>`;
  initCodeBlocks();

  return {
    button: screen.getByRole("button", { name: LABELS.copy }),
    pre: document.querySelector("pre"),
    wrapper: document.querySelector(".code-block"),
  };
}

/**
 * jsdom has no layout, so the overflow measurements have to be stubbed.
 *
 * @param {HTMLElement} element
 * @param {Record<string, number>} sizes
 */
function stubSize(element, sizes) {
  for (const [property, value] of Object.entries(sizes)) {
    Object.defineProperty(element, property, {
      configurable: true,
      value,
    });
  }
}

beforeEach(() => {
  writeText.mockReset();
  writeText.mockResolvedValue(undefined);

  Object.defineProperty(navigator, "clipboard", {
    configurable: true,
    value: { writeText },
  });

  window.codeBlockLabelsLocalized = LABELS;
});

afterEach(() => {
  jest.useRealTimers();

  Reflect.deleteProperty(navigator, "clipboard");
  delete window.codeBlockLabelsLocalized;
  delete document.execCommand;

  document.body.innerHTML = "";
});

describe("initCodeBlocks", () => {
  test("wraps the block once and keeps the code markup", () => {
    const { button, pre, wrapper } = renderCodeBlock();

    expect(document.querySelectorAll(".code-block")).toHaveLength(1);
    expect(wrapper).toContainElement(pre);
    expect(pre.parentElement).toBe(wrapper);
    expect([...wrapper.children].map((child) => child.className)).toEqual([
      "code-block-copy",
      "code-block-status",
      "",
    ]);

    expect(button.type).toBe("button");
    expect(button.getAttribute("aria-label")).toBe(LABELS.copy);
    expect(button.title).toBe(LABELS.copy);
    expect(button.dataset.state).toBe("idle");

    const status = wrapper.querySelector(".code-block-status");
    expect(status.getAttribute("role")).toBe("status");
    expect(status.textContent).toBe("");

    // Idempotent, even when the observer re-runs it.
    expect(initCodeBlocks()).toBe(0);
    expect(document.querySelectorAll(".code-block-copy")).toHaveLength(1);
  });

  test("keeps the theme label defaults when the page does not translate them", () => {
    delete window.codeBlockLabelsLocalized;

    document.body.innerHTML = "<pre><code>ls</code></pre>";
    initCodeBlocks();

    expect(
      screen.getByRole("button", { name: "Copy code" }).getAttribute("title")
    ).toBe("Copy code");
  });

  test("reuses an existing .code-block wrapper", () => {
    document.body.innerHTML =
      '<div class="code-block"><pre><code>ls</code></pre></div>';
    initCodeBlocks();

    expect(document.querySelectorAll(".code-block")).toHaveLength(1);
    expect(document.querySelector(".code-block > pre")).not.toBeNull();
    expect(document.querySelectorAll(".code-block-copy")).toHaveLength(1);
  });

  test("skips the editor, opted out and empty blocks", () => {
    document.body.innerHTML = `
      <div class="article-body">
        <div contenteditable="true"><pre><code>editable</code></pre></div>
        <div class="ck-content"><pre><code>editor</code></pre></div>
        <div id="hc-wysiwyg"><pre><code>wysiwyg</code></pre></div>
        <pre data-no-copy><code>opt out</code></pre>
        <pre>
        </pre>
        <pre><code>keep me</code></pre>
      </div>
    `;
    initCodeBlocks();

    const buttons = document.querySelectorAll(".code-block-copy");
    expect(buttons).toHaveLength(1);
    expect(buttons[0].closest(".code-block").textContent).toContain("keep me");
  });

  test("returns the number of enhanced blocks", () => {
    document.body.innerHTML = `
      <pre><code>one</code></pre>
      <pre><code>two</code></pre>
    `;

    expect(initCodeBlocks()).toBe(2);
    expect(initCodeBlocks()).toBe(0);
  });
});

describe("language badge", () => {
  test("reads the language from a language-* class", () => {
    const { pre, wrapper } = renderCodeBlock(
      '<pre><code class="language-js">const a = 1;</code></pre>'
    );

    const badge = screen.getByText("JS");
    expect(badge.className).toBe("code-block-language");
    expect(badge.getAttribute("aria-hidden")).toBe("true");
    expect(wrapper.dataset.language).toBe("JS");
    expect(pre.className).toBe("");
  });

  test("reads data-language and normalises the token", () => {
    renderCodeBlock('<pre data-language="Bash"><code>ls -la</code></pre>');

    expect(screen.getByText("BASH")).toBeInTheDocument();
  });

  test("does not add a badge when the markup has no language", () => {
    const { wrapper } = renderCodeBlock();

    expect(document.querySelector(".code-block-language")).toBeNull();
    expect(wrapper.dataset.language).toBeUndefined();
  });

  test("getLanguage supports pre, code, lang-* and unknown tokens", () => {
    const pre = document.createElement("pre");
    pre.innerHTML = '<code class="lang-typescript">const a = 1</code>';

    expect(getLanguage(pre)).toBe("TS");

    pre.innerHTML = '<code class="language-brainfuck">+</code>';
    expect(getLanguage(pre)).toBe("BRAINFUCK");
  });
});

describe("copying", () => {
  test("copies the code without the trailing newline", async () => {
    const { button } = renderCodeBlock(
      '<pre><code class="language-js">const a = 1;\nconsole.log(a);\n</code></pre>'
    );

    fireEvent.click(button);

    await waitFor(() => expect(button.dataset.state).toBe("success"));

    expect(writeText).toHaveBeenCalledTimes(1);
    expect(writeText).toHaveBeenCalledWith("const a = 1;\nconsole.log(a);");

    const status = document.querySelector(".code-block-status");
    expect(status.textContent).toBe(LABELS.success);
  });

  test("resets the button and the live region after two seconds", async () => {
    jest.useFakeTimers();

    const { button } = renderCodeBlock();
    fireEvent.click(button);

    await Promise.resolve();
    await Promise.resolve();

    expect(button.dataset.state).toBe("success");
    expect(document.querySelector(".code-block-status").textContent).toBe(
      LABELS.success
    );

    jest.advanceTimersByTime(2000);

    expect(button.dataset.state).toBe("idle");
    expect(document.querySelector(".code-block-status").textContent).toBe("");
  });

  test("falls back to execCommand when the clipboard API is unavailable", async () => {
    Reflect.deleteProperty(navigator, "clipboard");
    document.execCommand = jest.fn(() => true);

    const { button } = renderCodeBlock();
    fireEvent.click(button);

    await waitFor(() => expect(button.dataset.state).toBe("success"));

    expect(document.execCommand).toHaveBeenCalledWith("copy");
    expect(document.querySelector("textarea")).toBeNull();
  });

  test("reports a failure when both copy paths fail", async () => {
    writeText.mockRejectedValue(new Error("denied"));

    const { button } = renderCodeBlock();
    fireEvent.click(button);

    await waitFor(() => expect(button.dataset.state).toBe("failure"));

    expect(document.querySelector(".code-block-status").textContent).toBe(
      LABELS.failure
    );
  });
});

describe("getCodeText", () => {
  test("prefers the <code> child and trims trailing newlines", () => {
    const pre = document.createElement("pre");
    pre.innerHTML = "<code>npm test\n\n</code>";

    expect(getCodeText(pre)).toBe("npm test");
  });

  test("falls back to the <pre> text", () => {
    const pre = document.createElement("pre");
    pre.textContent = "plain";

    expect(getCodeText(pre)).toBe("plain");
  });
});

describe("updateScrollable", () => {
  test("adds tabindex only while the block overflows", () => {
    const { pre, wrapper } = renderCodeBlock();
    stubSize(pre, {
      scrollWidth: 600,
      clientWidth: 300,
      scrollHeight: 200,
      clientHeight: 200,
    });

    expect(updateScrollable(pre)).toBe(true);
    expect(pre.getAttribute("tabindex")).toBe("0");
    expect(wrapper.dataset.scrollable).toBe("true");

    stubSize(pre, { scrollWidth: 300 });
    expect(updateScrollable(pre)).toBe(false);
    expect(pre.hasAttribute("tabindex")).toBe(false);
    expect(wrapper.dataset.scrollable).toBe("false");
  });

  test("ignores a block that is not wrapped", () => {
    const pre = document.createElement("pre");

    expect(updateScrollable(pre)).toBe(false);
  });
});

describe("observeCodeBlocks", () => {
  test("enhances blocks inserted after page load", async () => {
    const observer = observeCodeBlocks();

    const pre = document.createElement("pre");
    pre.innerHTML = "<code>late</code>";
    document.body.appendChild(pre);

    await new Promise((resolve) => setTimeout(resolve, 200));
    observer?.disconnect();

    expect(pre.closest(".code-block")).not.toBeNull();
    expect(pre.previousElementSibling.className).toBe("code-block-status");
    expect(document.querySelectorAll(".code-block-copy")).toHaveLength(1);
  });
});
