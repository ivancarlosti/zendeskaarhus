(function () {
  'use strict';

  // Key map
  const ENTER = 13;
  const ESCAPE = 27;

  function toggleNavigation(toggle, menu) {
    const isExpanded = menu.getAttribute("aria-expanded") === "true";
    menu.setAttribute("aria-expanded", !isExpanded);
    toggle.setAttribute("aria-expanded", !isExpanded);
  }

  function closeNavigation(toggle, menu) {
    menu.setAttribute("aria-expanded", false);
    toggle.setAttribute("aria-expanded", false);
    toggle.focus();
  }

  // Collapsible elements track their expanded state on the toggle button only;
  // aria-expanded is not valid on the wrapping div/nav, so a class is used for styling
  function toggleCollapsible(toggle, element) {
    const isExpanded = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", !isExpanded);
    element.classList.toggle("expanded", !isExpanded);
  }

  function closeCollapsible(toggle, element) {
    toggle.setAttribute("aria-expanded", false);
    element.classList.remove("expanded");
    toggle.focus();
  }

  // Navigation

  window.addEventListener("DOMContentLoaded", () => {
    const menuButton = document.querySelector(".header .menu-button-mobile");
    const menuList = document.querySelector("#user-nav-mobile");

    menuButton.addEventListener("click", (event) => {
      event.stopPropagation();
      toggleNavigation(menuButton, menuList);
    });

    menuList.addEventListener("keyup", (event) => {
      if (event.keyCode === ESCAPE) {
        event.stopPropagation();
        closeNavigation(menuButton, menuList);
      }
    });

    // Toggles expanded aria to collapsible elements
    const collapsible = document.querySelectorAll(
      ".collapsible-nav, .collapsible-sidebar"
    );

    collapsible.forEach((element) => {
      const toggle = element.querySelector(
        ".collapsible-nav-toggle, .collapsible-sidebar-toggle"
      );

      element.addEventListener("click", () => {
        toggleCollapsible(toggle, element);
      });

      element.addEventListener("keyup", (event) => {
        console.log("escape");
        if (event.keyCode === ESCAPE) {
          closeCollapsible(toggle, element);
        }
      });
    });

    // If multibrand search has more than 5 help centers or categories collapse the list
    const multibrandFilterLists = document.querySelectorAll(
      ".multibrand-filter-list"
    );
    multibrandFilterLists.forEach((filter) => {
      if (filter.children.length > 6) {
        // Display the show more button
        const trigger = filter.querySelector(".see-all-filters");
        trigger.setAttribute("aria-hidden", false);

        // Add event handler for click
        trigger.addEventListener("click", (event) => {
          event.stopPropagation();
          trigger.parentNode.removeChild(trigger);
          filter.classList.remove("multibrand-filter-list--collapsed");
        });
      }
    });
  });

  const isPrintableChar = (str) => {
    return str.length === 1 && str.match(/^\S$/);
  };

  function Dropdown(toggle, menu) {
    this.toggle = toggle;
    this.menu = menu;

    this.menuPlacement = {
      top: menu.classList.contains("dropdown-menu-top"),
      end: menu.classList.contains("dropdown-menu-end"),
    };

    this.toggle.addEventListener("click", this.clickHandler.bind(this));
    this.toggle.addEventListener("keydown", this.toggleKeyHandler.bind(this));
    this.menu.addEventListener("keydown", this.menuKeyHandler.bind(this));
    document.body.addEventListener("click", this.outsideClickHandler.bind(this));

    const toggleId = this.toggle.getAttribute("id") || crypto.randomUUID();
    const menuId = this.menu.getAttribute("id") || crypto.randomUUID();

    this.toggle.setAttribute("id", toggleId);
    this.menu.setAttribute("id", menuId);

    this.toggle.setAttribute("aria-controls", menuId);
    this.menu.setAttribute("aria-labelledby", toggleId);

    if (!this.toggle.hasAttribute("aria-haspopup")) {
      this.toggle.setAttribute("aria-haspopup", "true");
    }

    if (!this.toggle.hasAttribute("aria-expanded")) {
      this.toggle.setAttribute("aria-expanded", "false");
    }

    this.toggleIcon = this.toggle.querySelector(".dropdown-chevron-icon");
    if (this.toggleIcon) {
      this.toggleIcon.setAttribute("aria-hidden", "true");
    }

    this.menu.setAttribute("tabindex", -1);
    this.menuItems.forEach((menuItem) => {
      menuItem.tabIndex = -1;
    });

    this.focusedIndex = -1;
  }

  Dropdown.prototype = {
    get isExpanded() {
      return this.toggle.getAttribute("aria-expanded") === "true";
    },

    get menuItems() {
      return Array.prototype.slice.call(
        this.menu.querySelectorAll("[role='menuitem'], [role='menuitemradio']")
      );
    },

    dismiss: function () {
      if (!this.isExpanded) return;

      this.toggle.setAttribute("aria-expanded", "false");
      this.menu.classList.remove("dropdown-menu-end", "dropdown-menu-top");
      this.focusedIndex = -1;
    },

    open: function () {
      if (this.isExpanded) return;

      this.toggle.setAttribute("aria-expanded", "true");
      this.handleOverflow();
    },

    handleOverflow: function () {
      var rect = this.menu.getBoundingClientRect();

      var overflow = {
        right: rect.left < 0 || rect.left + rect.width > window.innerWidth,
        bottom: rect.top < 0 || rect.top + rect.height > window.innerHeight,
      };

      if (overflow.right || this.menuPlacement.end) {
        this.menu.classList.add("dropdown-menu-end");
      }

      if (overflow.bottom || this.menuPlacement.top) {
        this.menu.classList.add("dropdown-menu-top");
      }

      if (this.menu.getBoundingClientRect().top < 0) {
        this.menu.classList.remove("dropdown-menu-top");
      }
    },

    focusByIndex: function (index) {
      if (!this.menuItems.length) return;

      this.menuItems.forEach((item, itemIndex) => {
        if (itemIndex === index) {
          item.tabIndex = 0;
          item.focus();
        } else {
          item.tabIndex = -1;
        }
      });

      this.focusedIndex = index;
    },

    focusFirstMenuItem: function () {
      this.focusByIndex(0);
    },

    focusLastMenuItem: function () {
      this.focusByIndex(this.menuItems.length - 1);
    },

    focusNextMenuItem: function (currentItem) {
      if (!this.menuItems.length) return;

      const currentIndex = this.menuItems.indexOf(currentItem);
      const nextIndex = (currentIndex + 1) % this.menuItems.length;

      this.focusByIndex(nextIndex);
    },

    focusPreviousMenuItem: function (currentItem) {
      if (!this.menuItems.length) return;

      const currentIndex = this.menuItems.indexOf(currentItem);
      const previousIndex =
        currentIndex <= 0 ? this.menuItems.length - 1 : currentIndex - 1;

      this.focusByIndex(previousIndex);
    },

    focusByChar: function (currentItem, char) {
      char = char.toLowerCase();

      const itemChars = this.menuItems.map((menuItem) =>
        menuItem.textContent.trim()[0].toLowerCase()
      );

      const startIndex =
        (this.menuItems.indexOf(currentItem) + 1) % this.menuItems.length;

      // look up starting from current index
      let index = itemChars.indexOf(char, startIndex);

      // if not found, start from start
      if (index === -1) {
        index = itemChars.indexOf(char, 0);
      }

      if (index > -1) {
        this.focusByIndex(index);
      }
    },

    outsideClickHandler: function (e) {
      if (
        this.isExpanded &&
        !this.toggle.contains(e.target) &&
        !e.composedPath().includes(this.menu)
      ) {
        this.dismiss();
        this.toggle.focus();
      }
    },

    clickHandler: function (event) {
      event.stopPropagation();
      event.preventDefault();

      if (this.isExpanded) {
        this.dismiss();
        this.toggle.focus();
      } else {
        this.open();
        this.focusFirstMenuItem();
      }
    },

    toggleKeyHandler: function (e) {
      const key = e.key;

      switch (key) {
        case "Enter":
        case " ":
        case "ArrowDown":
        case "Down": {
          e.stopPropagation();
          e.preventDefault();

          this.open();
          this.focusFirstMenuItem();
          break;
        }
        case "ArrowUp":
        case "Up": {
          e.stopPropagation();
          e.preventDefault();

          this.open();
          this.focusLastMenuItem();
          break;
        }
        case "Esc":
        case "Escape": {
          e.stopPropagation();
          e.preventDefault();

          this.dismiss();
          this.toggle.focus();
          break;
        }
      }
    },

    menuKeyHandler: function (e) {
      const key = e.key;
      const currentElement = this.menuItems[this.focusedIndex];

      if (e.ctrlKey || e.altKey || e.metaKey) {
        return;
      }

      switch (key) {
        case "Esc":
        case "Escape": {
          e.stopPropagation();
          e.preventDefault();

          this.dismiss();
          this.toggle.focus();
          break;
        }
        case "ArrowDown":
        case "Down": {
          e.stopPropagation();
          e.preventDefault();

          this.focusNextMenuItem(currentElement);
          break;
        }
        case "ArrowUp":
        case "Up": {
          e.stopPropagation();
          e.preventDefault();
          this.focusPreviousMenuItem(currentElement);
          break;
        }
        case "Home":
        case "PageUp": {
          e.stopPropagation();
          e.preventDefault();
          this.focusFirstMenuItem();
          break;
        }
        case "End":
        case "PageDown": {
          e.stopPropagation();
          e.preventDefault();
          this.focusLastMenuItem();
          break;
        }
        case "Tab": {
          if (e.shiftKey) {
            e.stopPropagation();
            e.preventDefault();
            this.dismiss();
            this.toggle.focus();
          } else {
            this.dismiss();
          }
          break;
        }
        default: {
          if (isPrintableChar(key)) {
            e.stopPropagation();
            e.preventDefault();
            this.focusByChar(currentElement, key);
          }
        }
      }
    },
  };

  // Drodowns

  window.addEventListener("DOMContentLoaded", () => {
    const dropdowns = [];
    const dropdownToggles = document.querySelectorAll(".dropdown-toggle");

    dropdownToggles.forEach((toggle) => {
      const menu = toggle.nextElementSibling;
      if (menu && menu.classList.contains("dropdown-menu")) {
        dropdowns.push(new Dropdown(toggle, menu));
      }
    });
  });

  // Share

  window.addEventListener("DOMContentLoaded", () => {
    const links = document.querySelectorAll(".share a");
    links.forEach((anchor) => {
      anchor.addEventListener("click", (event) => {
        event.preventDefault();
        window.open(anchor.href, "", "height = 500, width = 500");
      });
    });
  });

  // Vanilla JS debounce function, by Josh W. Comeau:
  // https://www.joshwcomeau.com/snippets/javascript/debounce/
  function debounce(callback, wait) {
    let timeoutId = null;
    return (...args) => {
      window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
        callback.apply(null, args);
      }, wait);
    };
  }

  // Define variables for search field
  let searchFormFilledClassName = "search-has-value";
  let searchFormSelector = "form[role='search']";

  // Clear the search input, and then return focus to it
  function clearSearchInput(event) {
    event.target
      .closest(searchFormSelector)
      .classList.remove(searchFormFilledClassName);

    let input;
    if (event.target.tagName === "INPUT") {
      input = event.target;
    } else if (event.target.tagName === "BUTTON") {
      input = event.target.previousElementSibling;
    } else {
      input = event.target.closest("button").previousElementSibling;
    }
    input.value = "";
    input.focus();
  }

  // Have the search input and clear button respond
  // when someone presses the escape key, per:
  // https://twitter.com/adambsilver/status/1152452833234554880
  function clearSearchInputOnKeypress(event) {
    const searchInputDeleteKeys = ["Delete", "Escape"];
    if (searchInputDeleteKeys.includes(event.key)) {
      clearSearchInput(event);
    }
  }

  // Create an HTML button that all users -- especially keyboard users --
  // can interact with, to clear the search input.
  // To learn more about this, see:
  // https://adrianroselli.com/2019/07/ignore-typesearch.html#Delete
  // https://www.scottohara.me/blog/2022/02/19/custom-clear-buttons.html
  function buildClearSearchButton(inputId) {
    const button = document.createElement("button");
    button.setAttribute("type", "button");
    button.setAttribute("aria-controls", inputId);
    button.classList.add("clear-button");
    const buttonLabel = window.searchClearButtonLabelLocalized;
    const icon = `<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' focusable='false' role='img' viewBox='0 0 12 12' aria-label='${buttonLabel}'><path stroke='currentColor' stroke-linecap='round' stroke-width='2' d='M3 9l6-6m0 6L3 3'/></svg>`;
    button.innerHTML = icon;
    button.addEventListener("click", clearSearchInput);
    button.addEventListener("keyup", clearSearchInputOnKeypress);
    return button;
  }

  // Append the clear button to the search form
  function appendClearSearchButton(input, form) {
    const searchClearButton = buildClearSearchButton(input.id);
    form.append(searchClearButton);
    if (input.value.length > 0) {
      form.classList.add(searchFormFilledClassName);
    }
  }

  // Add a class to the search form when the input has a value;
  // Remove that class from the search form when the input doesn't have a value.
  // Do this on a delay, rather than on every keystroke.
  const toggleClearSearchButtonAvailability = debounce((event) => {
    const form = event.target.closest(searchFormSelector);
    form.classList.toggle(
      searchFormFilledClassName,
      event.target.value.length > 0
    );
  }, 200);

  // Search

  window.addEventListener("DOMContentLoaded", () => {
    // Set up clear functionality for the search field
    const searchForms = [...document.querySelectorAll(searchFormSelector)];
    const searchInputs = searchForms.map((form) =>
      form.querySelector("input[type='search']")
    );
    searchInputs.forEach((input) => {
      appendClearSearchButton(input, input.closest(searchFormSelector));
      input.addEventListener("keyup", clearSearchInputOnKeypress);
      input.addEventListener("keyup", toggleClearSearchButtonAvailability);
    });
  });

  const key = "returnFocusTo";

  function saveFocus() {
    const activeElementId = document.activeElement.getAttribute("id");
    sessionStorage.setItem(key, "#" + activeElementId);
  }

  function returnFocus() {
    const returnFocusTo = sessionStorage.getItem(key);
    if (returnFocusTo) {
      sessionStorage.removeItem("returnFocusTo");
      const returnFocusToEl = document.querySelector(returnFocusTo);
      returnFocusToEl && returnFocusToEl.focus && returnFocusToEl.focus();
    }
  }

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
  function isEmptyPlaintext(text) {
    return text.trim() === "";
  }

  /**
   * @param {string} html
   * @returns {boolean} whether `html` renders no text and no image
   */
  function isEmptyHtml(html) {
    if (IMAGE_TAG.test(html)) return false;

    return isEmptyPlaintext(
      html.replace(MARKUP_TAG, " ").replace(WHITESPACE_ENTITY, " ")
    );
  }

  // Forms

  window.addEventListener("DOMContentLoaded", () => {
    // In some cases we should preserve focus after page reload
    returnFocus();

    // show form controls when the textarea receives focus or back button is used and value exists
    const commentContainerTextarea = document.querySelector(
      ".comment-container textarea"
    );
    const commentContainerFormControls = document.querySelector(
      ".comment-form-controls, .comment-ccs"
    );

    if (commentContainerTextarea) {
      commentContainerTextarea.addEventListener(
        "focus",
        function focusCommentContainerTextarea() {
          commentContainerFormControls.style.display = "block";
          commentContainerTextarea.removeEventListener(
            "focus",
            focusCommentContainerTextarea
          );
        }
      );

      if (commentContainerTextarea.value !== "") {
        commentContainerFormControls.style.display = "block";
      }
    }

    // Expand Request comment form when Add to conversation is clicked
    const showRequestCommentContainerTrigger = document.querySelector(
      ".request-container .comment-container .comment-show-container"
    );
    const requestCommentFields = document.querySelectorAll(
      ".request-container .comment-container .comment-fields"
    );
    const requestCommentSubmit = document.querySelector(
      ".request-container .comment-container .request-submit-comment"
    );

    if (showRequestCommentContainerTrigger) {
      showRequestCommentContainerTrigger.addEventListener("click", () => {
        showRequestCommentContainerTrigger.style.display = "none";
        Array.prototype.forEach.call(requestCommentFields, (element) => {
          element.style.display = "block";
        });
        requestCommentSubmit.style.display = "inline-block";

        if (commentContainerTextarea) {
          commentContainerTextarea.focus();
        }
      });
    }

    // Mark as solved button
    const requestMarkAsSolvedButton = document.querySelector(
      ".request-container .mark-as-solved:not([data-disabled])"
    );
    const requestMarkAsSolvedCheckbox = document.querySelector(
      ".request-container .comment-container input[type=checkbox]"
    );
    const requestCommentSubmitButton = document.querySelector(
      ".request-container .comment-container input[type=submit]"
    );

    if (requestMarkAsSolvedButton) {
      requestMarkAsSolvedButton.addEventListener("click", () => {
        requestMarkAsSolvedCheckbox.setAttribute("checked", true);
        requestCommentSubmitButton.disabled = true;
        requestMarkAsSolvedButton.setAttribute("data-disabled", true);
        requestMarkAsSolvedButton.form.submit();
      });
    }

    // Change Mark as solved text according to whether comment is filled
    const requestCommentTextarea = document.querySelector(
      ".request-container .comment-container textarea"
    );

    const usesWysiwyg =
      requestCommentTextarea &&
      requestCommentTextarea.dataset.helper === "wysiwyg";

    const isEmpty = usesWysiwyg ? isEmptyHtml : isEmptyPlaintext;

    if (requestCommentTextarea) {
      requestCommentTextarea.addEventListener("input", () => {
        if (isEmpty(requestCommentTextarea.value)) {
          if (requestMarkAsSolvedButton) {
            requestMarkAsSolvedButton.innerText =
              requestMarkAsSolvedButton.getAttribute("data-solve-translation");
          }
        } else {
          if (requestMarkAsSolvedButton) {
            requestMarkAsSolvedButton.innerText =
              requestMarkAsSolvedButton.getAttribute(
                "data-solve-and-submit-translation"
              );
          }
        }
      });
    }

    const selects = document.querySelectorAll(
      "#request-status-select, #request-organization-select"
    );

    selects.forEach((element) => {
      element.addEventListener("change", (event) => {
        event.stopPropagation();
        saveFocus();
        element.form.submit();
      });
    });

    // Submit requests filter form on search in the request list page
    const quickSearch = document.querySelector("#quick-search");
    if (quickSearch) {
      quickSearch.addEventListener("keyup", (event) => {
        if (event.keyCode === ENTER) {
          event.stopPropagation();
          saveFocus();
          quickSearch.form.submit();
        }
      });
    }

    // Submit organization form in the request page
    const requestOrganisationSelect = document.querySelector(
      "#request-organization select"
    );

    if (requestOrganisationSelect) {
      requestOrganisationSelect.addEventListener("change", () => {
        requestOrganisationSelect.form.submit();
      });

      requestOrganisationSelect.addEventListener("click", (e) => {
        // Prevents Ticket details collapsible-sidebar to close on mobile
        e.stopPropagation();
      });
    }

    // If there are any error notifications below an input field, focus that field
    const notificationElm = document.querySelector(".notification-error");
    if (
      notificationElm &&
      notificationElm.previousElementSibling &&
      typeof notificationElm.previousElementSibling.focus === "function"
    ) {
      notificationElm.previousElementSibling.focus();
    }
  });

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

})();
