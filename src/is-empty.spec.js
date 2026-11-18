// Empty-comment detection

import { describe, expect, test } from "@jest/globals";

import { isEmptyHtml, isEmptyPlaintext } from "./is-empty";

describe("isEmptyPlaintext", () => {
  test("treats blank input as empty", () => {
    expect(isEmptyPlaintext("")).toBe(true);
    expect(isEmptyPlaintext("   \n\t")).toBe(true);
    expect(isEmptyPlaintext(" \u00a0 ")).toBe(true);
  });

  test("treats any visible character as filled", () => {
    expect(isEmptyPlaintext("a")).toBe(false);
  });
});

describe("isEmptyHtml", () => {
  test("treats empty editor markup as empty", () => {
    expect(isEmptyHtml("")).toBe(true);
    expect(isEmptyHtml("<p><br></p>")).toBe(true);
    expect(isEmptyHtml("<p>&nbsp;</p>")).toBe(true);
    expect(isEmptyHtml("<p>&#160;&#xa0;</p>")).toBe(true);
    expect(isEmptyHtml('<p class="ck-content"> </p>')).toBe(true);
    expect(isEmptyHtml("<p><br/><br></p>")).toBe(true);
  });

  test("treats text as filled", () => {
    expect(isEmptyHtml("<p>Olá</p>")).toBe(false);
    expect(isEmptyHtml("<p>a &amp; b</p>")).toBe(false);
    expect(isEmptyHtml("texto")).toBe(false);
  });

  test("treats an image-only comment as filled", () => {
    expect(isEmptyHtml('<img src="screenshot.png" alt="">')).toBe(false);
    expect(isEmptyHtml('<p><img src="screenshot.png"/></p>')).toBe(false);
    expect(isEmptyHtml("<p><br></p><img src=x>")).toBe(false);
  });

  test("keeps the text that follows an attribute containing '>'", () => {
    expect(isEmptyHtml('<a title="1 > 0">ok</a>')).toBe(false);
  });
});
