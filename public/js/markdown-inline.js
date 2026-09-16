/**
 * Small safe inline markdown subset for Trello-style checklist titles.
 * Supports: **bold**, *italic* / _italic_, ~~strike~~, `code`, [text](https://…)
 * Builds DOM nodes only — never assigns untrusted HTML strings.
 */
(function (global) {
  function appendText(parent, text) {
    if (!text) return;
    parent.appendChild(document.createTextNode(text));
  }

  function safeHttpUrl(raw) {
    if (raw == null || raw === "") return null;
    try {
      var parsed = new URL(String(raw).trim());
      if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
        return null;
      }
      return parsed.href;
    } catch (e) {
      return null;
    }
  }

  /**
   * Earliest inline markdown token in `str`, or null.
   * { index, length, type, text, href? }
   */
  function nextToken(str) {
    var best = null;

    function take(index, length, type, text, href) {
      if (index < 0) return;
      if (best && index >= best.index) return;
      best = {
        index: index,
        length: length,
        type: type,
        text: text,
        href: href || null,
      };
    }

    var code = /`([^`]+)`/.exec(str);
    if (code) take(code.index, code[0].length, "code", code[1]);

    var link = /\[([^\]]+)\]\((https?:[^)\s]+)\)/.exec(str);
    if (link) take(link.index, link[0].length, "link", link[1], link[2]);

    var strongStar = /\*\*([^*]+)\*\*/.exec(str);
    if (strongStar) {
      take(strongStar.index, strongStar[0].length, "strong", strongStar[1]);
    }
    var strongUnder = /__([^_]+)__/.exec(str);
    if (strongUnder) {
      take(strongUnder.index, strongUnder[0].length, "strong", strongUnder[1]);
    }

    var del = /~~([^~]+)~~/.exec(str);
    if (del) take(del.index, del[0].length, "del", del[1]);

    var emStar = /(^|[^\*])\*([^*]+)\*(?!\*)/.exec(str);
    if (emStar) {
      var starLead = emStar[1] || "";
      take(
        emStar.index + starLead.length,
        emStar[0].length - starLead.length,
        "em",
        emStar[2]
      );
    }
    var emUnder = /(^|[^_])_([^_]+)_(?!_)/.exec(str);
    if (emUnder) {
      var underLead = emUnder[1] || "";
      take(
        emUnder.index + underLead.length,
        emUnder[0].length - underLead.length,
        "em",
        emUnder[2]
      );
    }

    return best;
  }

  function appendInlineMarkdown(parent, text, options) {
    var opts = options || {};
    var allowLinks = opts.allowLinks !== false;
    var remaining = String(text == null ? "" : text);
    if (!remaining) return;

    while (remaining) {
      var token = nextToken(remaining);
      if (!token) {
        appendText(parent, remaining);
        break;
      }
      appendText(parent, remaining.slice(0, token.index));
      var inner = token.text || "";
      if (token.type === "code") {
        var code = document.createElement("code");
        code.className = "md-code";
        appendText(code, inner);
        parent.appendChild(code);
      } else if (token.type === "link") {
        var href = safeHttpUrl(token.href);
        if (allowLinks && href) {
          var link = document.createElement("a");
          link.className = "md-link";
          link.href = href;
          link.target = "_blank";
          link.rel = "noopener noreferrer";
          appendInlineMarkdown(link, inner, { allowLinks: false });
          parent.appendChild(link);
        } else {
          appendInlineMarkdown(parent, inner, opts);
        }
      } else if (token.type === "strong") {
        var strong = document.createElement("strong");
        appendInlineMarkdown(strong, inner, opts);
        parent.appendChild(strong);
      } else if (token.type === "em") {
        var em = document.createElement("em");
        appendInlineMarkdown(em, inner, opts);
        parent.appendChild(em);
      } else if (token.type === "del") {
        var del = document.createElement("del");
        appendInlineMarkdown(del, inner, opts);
        parent.appendChild(del);
      } else {
        appendText(
          parent,
          remaining.slice(token.index, token.index + token.length)
        );
      }
      remaining = remaining.slice(token.index + token.length);
    }
  }

  /** Strip markers for single-line previews (calendar cells, title attrs). */
  function stripInlineMarkdown(text) {
    var value = String(text == null ? "" : text);
    var guard = 0;
    while (guard < 8) {
      guard += 1;
      var next = value
        .replace(/`([^`]+)`/g, "$1")
        .replace(/\[([^\]]+)\]\((https?:[^)\s]+)\)/g, "$1")
        .replace(/\*\*([^*]+)\*\*/g, "$1")
        .replace(/__([^_]+)__/g, "$1")
        .replace(/~~([^~]+)~~/g, "$1")
        .replace(/(^|[^\*])\*([^*]+)\*(?!\*)/g, "$1$2")
        .replace(/(^|[^_])_([^_]+)_(?!_)/g, "$1$2");
      if (next === value) break;
      value = next;
    }
    return value;
  }

  global.ChecklistHubMarkdown = {
    appendInline: appendInlineMarkdown,
    strip: stripInlineMarkdown,
  };
})(typeof window !== "undefined" ? window : globalThis);
