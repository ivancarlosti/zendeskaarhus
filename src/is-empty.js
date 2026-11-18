// Empty-comment detection
//
// The wysiwyg editor submits HTML, while the plain textarea submits text. Only
// "does this render anything" matters for the Mark as solved label, so the
// markup is inspected as text instead of being parsed: DOMParser would
// reinterpret the editor's DOM text as HTML, which is the pattern
// js/xss-through-dom flags, and no DOM tree is needed to answer the question.

// `<img `, `<img>` and `<img/>` all count as media, even without attributes.
const IMAGE_TAG = /<img[\s/>]/i;
const MARKUP_TAG = /<[^>]*>/g;
// `&nbsp;` and its numeric spellings are the entities CKEditor uses for a
// visually empty paragraph.
const WHITESPACE_ENTITY = /&(?:nbsp|#160|#x0*a0);/gi;

/**
 * @param {string} text
 * @returns {boolean} whether `text` has no visible characters
 */
export function isEmptyPlaintext(text) {
  return text.trim() === "";
}

/**
 * @param {string} html
 * @returns {boolean} whether `html` renders no text and no image
 */
export function isEmptyHtml(html) {
  if (IMAGE_TAG.test(html)) return false;

  return isEmptyPlaintext(
    html.replace(MARKUP_TAG, " ").replace(WHITESPACE_ENTITY, " ")
  );
}
