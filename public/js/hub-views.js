(function (global) {
  function safeHref(url) {
    if (
      global.ChecklistHubDemoMode &&
      typeof global.ChecklistHubDemoMode.safeTrelloUrl === "function"
    ) {
      return global.ChecklistHubDemoMode.safeTrelloUrl(url);
    }
    return null;
  }

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  function byDue(a, b, host) {
    var av = a.due ? new Date(a.due).getTime() : Number.POSITIVE_INFINITY;
    var bv = b.due ? new Date(b.due).getTime() : Number.POSITIVE_INFINITY;
    if (av !== bv) return av - bv;
    var order = (host && host.listOrderIndex) || {};
    var ai = order[String(a.id)];
    var bi = order[String(b.id)];
    if (ai != null && bi != null && ai !== bi) return ai - bi;
    if (ai != null && bi == null) return -1;
    if (ai == null && bi != null) return 1;
    return String(a.name || "").localeCompare(String(b.name || ""));
  }

  function dayStart(date) {
    var d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  function addDays(date, days) {
    return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
  }

  /** Gantt spans use calendar due days only (no reminder lead windows). */
  function dueDaySpan(item) {
    if (!item || !item.due) return null;
    var due = new Date(item.due);
    if (isNaN(due.getTime())) return null;
    var day = dayStart(due);
    return { start: day, end: day, hasLead: false };
  }

  function boardHue(name) {
    var text = String(name || "");
    var hash = 0;
    var i;
    for (i = 0; i < text.length; i += 1) {
      hash = (hash * 31 + text.charCodeAt(i)) % 360;
    }
    return hash;
  }

  function initials(name) {
    var parts = String(name || "")
      .trim()
      .split(/\s+/)
      .filter(Boolean);
    if (!parts.length) return "?";
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  }

  function appendNote(root, text) {
    if (!text) return;
    root.appendChild(el("p", "insight-note", text));
  }

  function appendActions(host, item, parent) {
    var actions = el("div", "insight-actions");
    var safe = safeHref(item.cardUrl);
    if (safe) {
      var link = el("a", "link-open", "Open");
      link.href = safe;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.setAttribute(
        "aria-label",
        "Open card " + (item.cardName || item.name || "") + " in Trello"
      );
      actions.appendChild(link);
    }
    if (actions.childNodes.length) parent.appendChild(actions);
  }

  function markRow(node, host, item) {
    node.classList.add("hub-row");
    node.setAttribute("data-row-id", item.id);
    if (host.selectedId && host.selectedId === item.id) {
      node.classList.add("is-selected");
    }
    node.addEventListener("click", function (event) {
      if (event.target.closest("a, button, input, select")) return;
      if (host.onSelect) host.onSelect(item.id);
    });
  }

  function appendEmpty(root, title, body) {
    var box = el("div", "insight-empty");
    box.appendChild(el("h2", null, title));
    box.appendChild(el("p", null, body));
    root.appendChild(box);
  }

  function sectionHead(label, count, tone, headingId) {
    var head = el(
      "div",
      "insight-section-head" + (tone ? " is-" + tone : "")
    );
    var title = el("h2", null, label);
    if (headingId) title.id = headingId;
    head.appendChild(title);
    if (count != null) {
      var countEl = el("span", "insight-count", String(count));
      countEl.setAttribute("aria-label", count + (count === 1 ? " item" : " items"));
      head.appendChild(countEl);
    }
    return head;
  }

  function renderAgenda(root, items, host) {
    var sections = [
      { id: "overdue", label: "Overdue", tone: "overdue" },
      { id: "today", label: "Today", tone: "today" },
      { id: "tomorrow", label: "Tomorrow", tone: "tomorrow" },
    ];
    var buckets = { overdue: [], today: [], tomorrow: [] };
    items.forEach(function (item) {
      var isReminder = host.isReminder && host.isReminder(item);
      if (isReminder && !(host.remindersOn && host.remindersOn())) {
        return;
      }
      var id = host.dueBucket(item).id;
      if (!buckets[id]) return;
      buckets[id].push(item);
    });
    var dated =
      buckets.overdue.length + buckets.today.length + buckets.tomorrow.length;
    if (!dated) {
      appendEmpty(
        root,
        "Nothing on the agenda",
        "No overdue, today, or tomorrow items match the current filters."
      );
      return;
    }

    sections.forEach(function (section) {
      var rows = buckets[section.id].slice().sort(function (a, b) {
        return byDue(a, b, host);
      });
      if (!rows.length) return;
      var block = el("section", "insight-section agenda-section is-" + section.tone);
      var headingId = "agenda-heading-" + section.id;
      block.setAttribute("aria-labelledby", headingId);
      block.appendChild(
        sectionHead(section.label, rows.length, section.tone, headingId)
      );
      var list = el("ol", "agenda-list");
      rows.forEach(function (item) {
        var isReminder = host.isReminder && host.isReminder(item);
        var li = el(
          "li",
          "agenda-item" +
            (isReminder ? " is-reminder" : "") +
            (item.kind === "card" || item.sourceKind === "card" ? " is-card" : "")
        );
        markRow(li, host, item);
        if (host.itemState(item) === "complete") li.classList.add("is-complete");

        var when = el("div", "agenda-when-wrap");
        var whenBadge = el(
          "time",
          "agenda-when " + (section.id === "overdue" ? "is-overdue" : ""),
          host.formatRelative(item.due, host.itemState(item), item)
        );
        var actualDue = item.sourceDue || item.due;
        whenBadge.title = isReminder
          ? "Item due " + host.formatDue(actualDue)
          : host.formatDue(item.due);
        whenBadge.dateTime = isReminder ? actualDue : item.due;
        when.appendChild(whenBadge);
        if (isReminder && actualDue) {
          when.appendChild(
            el("div", "agenda-when-actual", "Item due " + host.formatDue(actualDue))
          );
        }

        var body = el("div", "agenda-body");
        var isCard = host.workKind
          ? host.workKind(item) === "card"
          : item.kind === "card" || item.sourceKind === "card";
        var kindBits = [isCard ? "Card" : "Task"];
        if (isReminder) kindBits.push("Reminder");
        var kind = el(
          "div",
          "agenda-kind" +
            (isReminder ? " is-reminder" : "") +
            (isCard ? " is-card" : ""),
          kindBits.join(" · ")
        );
        body.appendChild(kind);

        var title = el("div", "agenda-title");
        if (typeof host.appendLinkedItemTitle === "function") {
          host.appendLinkedItemTitle(title, item, "agenda-title-link");
        } else {
          var agendaSafe = safeHref(item.cardUrl);
          if (agendaSafe) {
            var titleLink = el("a", "agenda-title-link", item.name);
            titleLink.href = agendaSafe;
            titleLink.target = "_blank";
            titleLink.rel = "noopener noreferrer";
            title.appendChild(titleLink);
          } else {
            title.textContent = item.name;
          }
        }
        body.appendChild(title);

        var facts = el("dl", "agenda-facts");
        function fact(label, value) {
          if (!value) return;
          var row = el("div", "agenda-fact");
          row.appendChild(el("dt", null, label));
          row.appendChild(el("dd", null, value));
          facts.appendChild(row);
        }
        if (isReminder) fact("Item due", host.formatDue(actualDue));
        fact("Card", item.cardName);
        fact("Board", item.boardName);
        fact("Checklist", item.checklistName);
        fact("Assignee", item.assigneeName);
        body.appendChild(facts);

        li.appendChild(when);
        li.appendChild(body);
        appendActions(host, item, li);
        list.appendChild(li);
      });
      block.appendChild(list);
      root.appendChild(block);
    });
  }

  function renderHorizon(root, items, host) {
    var order = ["overdue", "today", "tomorrow", "week", "later"];
    var labels = {
      overdue: "Overdue",
      today: "Today",
      tomorrow: "Tomorrow",
      week: "Next 7 days",
      later: "Later",
    };
    var byBoard = {};
    items.forEach(function (item) {
      if (host.isReminder && host.isReminder(item)) return;
      if (host.itemState(item) === "complete") return;
      var bucket = host.dueBucket(item).id;
      if (order.indexOf(bucket) === -1) return;
      var id = item.boardId || "board";
      if (!byBoard[id]) {
        byBoard[id] = {
          id: id,
          name: item.boardName || "Board",
          counts: { overdue: 0, today: 0, tomorrow: 0, week: 0, later: 0 },
          total: 0,
        };
      }
      byBoard[id].counts[bucket] += 1;
      byBoard[id].total += 1;
    });
    var boards = Object.keys(byBoard)
      .map(function (id) {
        return byBoard[id];
      })
      .sort(function (a, b) {
        return b.counts.overdue - a.counts.overdue || b.total - a.total;
      });
    if (!boards.length) {
      appendEmpty(root, "No dated open work", "Try a wider due filter or load more boards.");
      return;
    }
    var legend = el("div", "horizon-legend");
    order.forEach(function (id) {
      legend.appendChild(el("span", "horizon-key horizon-" + id, labels[id]));
    });
    root.appendChild(legend);
    var list = el("div", "horizon-list");
    boards.forEach(function (board) {
      var row = el("div", "horizon-row");
      var name = el("div", "horizon-name");
      var dot = el("span", "board-color-dot");
      dot.style.background = "hsl(" + boardHue(board.name) + " 48% 46%)";
      dot.setAttribute("aria-hidden", "true");
      name.appendChild(dot);
      var text = el("div", "horizon-name-text");
      text.appendChild(el("strong", null, board.name));
      text.appendChild(el("span", null, board.total + " open"));
      name.appendChild(text);
      var bar = el("div", "horizon-bar");
      bar.setAttribute("role", "img");
      bar.setAttribute(
        "aria-label",
        board.name +
          ", " +
          order
            .map(function (id) {
              return labels[id] + " " + board.counts[id];
            })
            .join(", ")
      );
      order.forEach(function (id) {
        if (!board.counts[id]) return;
        var seg = el("span", "horizon-seg horizon-" + id);
        seg.style.flexGrow = String(board.counts[id]);
        seg.title = labels[id] + ": " + board.counts[id];
        seg.textContent = board.counts[id] > 1 ? String(board.counts[id]) : "";
        bar.appendChild(seg);
      });
      row.appendChild(name);
      row.appendChild(bar);
      list.appendChild(row);
    });
    root.appendChild(list);
  }

  function renderWorkload(root, items, host) {
    var byPerson = {};
    items.forEach(function (item) {
      if (host.isReminder && host.isReminder(item)) return;
      if (host.itemState(item) === "complete") return;
      var id = item.idMember || "unassigned";
      if (!byPerson[id]) {
        byPerson[id] = {
          id: id,
          name: item.assigneeName || "Unassigned",
          count: 0,
          overdue: 0,
        };
      }
      byPerson[id].count += 1;
      if (host.dueBucket(item).id === "overdue") byPerson[id].overdue += 1;
    });
    var people = Object.keys(byPerson)
      .map(function (id) {
        return byPerson[id];
      })
      .sort(function (a, b) {
        return b.count - a.count || a.name.localeCompare(b.name);
      });
    if (!people.length) {
      appendEmpty(root, "No open assignments", "Try a wider filter or select a team.");
      return;
    }
    var max = people[0].count || 1;
    var list = el("div", "workload-list");
    people.forEach(function (person) {
      var row = el("div", "workload-row");
      if (person.overdue) row.classList.add("has-overdue");
      var name = el("div", "workload-name");
      var avatar = el("span", "workload-avatar", initials(person.name));
      avatar.setAttribute("aria-hidden", "true");
      name.appendChild(avatar);
      name.appendChild(el("span", "workload-name-text", person.name));
      var track = el("div", "workload-track");
      var fill = el("span", "workload-fill");
      if (person.overdue) fill.classList.add("has-overdue");
      fill.style.width =
        Math.max(6, Math.round((person.count / max) * 100)) + "%";
      track.appendChild(fill);
      var count = el("div", "workload-count");
      count.appendChild(el("strong", null, String(person.count)));
      if (person.overdue) {
        count.appendChild(
          el("span", "workload-overdue", person.overdue + " overdue")
        );
      }
      row.appendChild(name);
      row.appendChild(track);
      row.appendChild(count);
      list.appendChild(row);
    });
    root.appendChild(list);
  }

  function renderProgress(root, items, host) {
    var cards = {};
    items.forEach(function (item) {
      if (!item.cardId || (host.isReminder && host.isReminder(item))) return;
      if (item.kind === "card") return;
      if (!cards[item.cardId]) {
        cards[item.cardId] = {
          id: item.cardId,
          name: item.cardName || item.name,
          boardName: item.boardName || "",
          cardUrl: item.cardUrl || "",
          total: 0,
          complete: 0,
          overdue: 0,
          sample: item,
        };
      }
      var card = cards[item.cardId];
      card.total += 1;
      if (host.itemState(item) === "complete") card.complete += 1;
      else if (host.dueBucket(item).id === "overdue") card.overdue += 1;
    });
    var rows = Object.keys(cards)
      .map(function (id) {
        return cards[id];
      })
      .filter(function (card) {
        return card.total > 0;
      })
      .sort(function (a, b) {
        if (a.overdue !== b.overdue) return b.overdue - a.overdue;
        var aOpen = a.total - a.complete;
        var bOpen = b.total - b.complete;
        return bOpen - aOpen || a.name.localeCompare(b.name);
      });
    if (!rows.length) {
      appendEmpty(root, "No checklist progress", "No checklist items match the current filters.");
      return;
    }

    var list = el("div", "progress-list");
    rows.forEach(function (card) {
      var pct = Math.round((card.complete / card.total) * 100);
      var row = el("div", "progress-row");
      if (card.overdue) row.classList.add("has-overdue");
      markRow(row, host, card.sample);

      var title = el("div", "progress-title");
      title.appendChild(el("strong", null, card.name));
      title.appendChild(
        el(
          "span",
          "progress-board",
          card.boardName || "Board"
        )
      );

      var meterWrap = el("div", "progress-meter-wrap");
      var meter = el("div", "progress-meter");
      meter.setAttribute("role", "img");
      meter.setAttribute(
        "aria-label",
        card.complete +
          " of " +
          card.total +
          " checklist items complete" +
          (card.overdue ? ", " + card.overdue + " overdue" : "")
      );
      var fill = el("span", "progress-meter-fill");
      fill.style.width = pct + "%";
      meter.appendChild(fill);
      meterWrap.appendChild(meter);

      var count = el("div", "progress-count");
      count.appendChild(el("strong", null, pct + "%"));
      count.appendChild(
        el("span", null, card.complete + "/" + card.total)
      );
      if (card.overdue) {
        count.appendChild(
          el("span", "progress-overdue", card.overdue + " overdue")
        );
      }

      row.appendChild(title);
      row.appendChild(meterWrap);
      var progressSafe = safeHref(card.cardUrl);
      if (progressSafe) {
        var link = el("a", "link-open", "Open card");
        link.href = progressSafe;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        row.appendChild(link);
      } else {
        row.appendChild(el("span", "progress-open-spacer"));
      }
      row.appendChild(count);
      list.appendChild(row);
    });
    root.appendChild(list);
  }

  function mergeSpans(spans) {
    if (!spans || !spans.length) return null;
    var start = spans[0].start.getTime();
    var end = spans[0].end.getTime();
    spans.forEach(function (span) {
      if (span.start.getTime() < start) start = span.start.getTime();
      if (span.end.getTime() > end) end = span.end.getTime();
    });
    return {
      start: new Date(start),
      end: new Date(end),
      hasLead: false,
    };
  }

  function buildGanttTree(pool, host) {
    var boards = {};
    var boardOrder = [];
    pool.forEach(function (item) {
      var span = dueDaySpan(item);
      var boardId = item.boardId || "board";
      if (!boards[boardId]) {
        boards[boardId] = {
          id: boardId,
          name: item.boardName || "Board",
          cards: {},
          cardOrder: [],
          spans: [],
        };
        boardOrder.push(boardId);
      }
      var board = boards[boardId];
      var cardId = item.cardId || item.id || "card";
      if (!board.cards[cardId]) {
        board.cards[cardId] = {
          id: cardId,
          name: item.cardName || item.name || "Card",
          url: item.cardUrl || "",
          listName: item.listName || "",
          boardName: item.boardName || board.name,
          checklists: {},
          checklistOrder: [],
          spans: [],
          isMembership: false,
          sample: item,
        };
        board.cardOrder.push(cardId);
      }
      var card = board.cards[cardId];
      if (span) {
        board.spans.push(span);
        card.spans.push(span);
      }

      if (item.kind === "card") {
        card.isMembership = true;
        card.sample = item;
        return;
      }

      var checklistId =
        item.checklistId ||
        item.checklistName ||
        "checklist:" + cardId;
      if (!card.checklists[checklistId]) {
        card.checklists[checklistId] = {
          id: checklistId,
          name: item.checklistName || "Checklist",
          items: [],
          spans: [],
          sample: item,
        };
        card.checklistOrder.push(checklistId);
      }
      var checklist = card.checklists[checklistId];
      checklist.items.push(item);
      if (span) checklist.spans.push(span);
      if (!checklist.sample) checklist.sample = item;
    });

    return boardOrder.map(function (boardId) {
      var board = boards[boardId];
      var cards = board.cardOrder.map(function (cardId) {
        var card = board.cards[cardId];
        var checklists = card.checklistOrder
          .map(function (checklistId) {
            var checklist = card.checklists[checklistId];
            checklist.items.sort(function (a, b) {
              return byDue(a, b, host);
            });
            var checklistSpan = mergeSpans(checklist.spans);
            // Only draw rows that have at least one dated item.
            if (!checklistSpan) return null;
            var datedCount = checklist.items.filter(function (it) {
              return Boolean(it.due);
            }).length;
            var undatedCount = checklist.items.length - datedCount;
            return {
              id: checklist.id,
              name: checklist.name,
              span: checklistSpan,
              items: checklist.items,
              sample: checklist.sample,
              count: checklist.items.length,
              datedCount: datedCount,
              undatedCount: undatedCount,
              cardName: card.name,
              cardUrl: card.url,
              boardName: card.boardName || board.name,
              listName: card.listName,
            };
          })
          .filter(Boolean);
        return {
          id: card.id,
          name: card.name,
          url: card.url,
          listName: card.listName,
          isMembership: Boolean(card.isMembership),
          span: mergeSpans(card.spans),
          checklists: checklists,
          sample: card.sample,
        };
      }).filter(function (card) {
        return card.span || (card.checklists && card.checklists.length);
      });
      var cardSpans = cards
        .map(function (card) {
          return card.span;
        })
        .filter(Boolean);
      if (!cards.length) return null;
      return {
        id: board.id,
        name: board.name,
        span: mergeSpans(cardSpans),
        cards: cards,
      };
    }).filter(Boolean);
  }

  function renderGantt(root, items, host) {
    var now = host.now || new Date();
    var pool = [];
    var undated = 0;
    items.forEach(function (item) {
      if (host.isReminder && host.isReminder(item)) return;
      if (item.kind !== "card" && item.kind !== "checkitem") return;
      if (!item.due) {
        undated += 1;
      }
      pool.push(item);
    });
    var tree = buildGanttTree(pool, host);
    var hasBars = tree.some(function (board) {
      return board.span || board.cards.some(function (c) {
        return c.span || c.checklists.length;
      });
    });
    if (!hasBars) {
      appendEmpty(
        root,
        "No dated items for a timeline",
        undated
          ? undated + " undated item" + (undated === 1 ? "" : "s") + " omitted from bars."
          : "Add due dates, or widen filters."
      );
      return;
    }
    var windowStart = dayStart(addDays(now, -14));
    var windowEnd = dayStart(addDays(now, 28));
    var days = [];
    var cursor = new Date(windowStart);
    while (cursor.getTime() <= windowEnd.getTime()) {
      days.push(new Date(cursor));
      cursor = addDays(cursor, 1);
    }
    var dayMs = 24 * 60 * 60 * 1000;
    function colIndex(date) {
      return Math.round((dayStart(date).getTime() - windowStart.getTime()) / dayMs);
    }
    var todayCol = colIndex(now);

    root.appendChild(
      el(
        "p",
        "insight-note",
        "Bars are checklists (earliest→latest due). Click a checklist bar or name for every item on that list, including undated. Reminders are omitted."
      )
    );
    if (undated) {
      root.appendChild(
        el(
          "p",
          "insight-note",
          undated +
            " undated item" +
            (undated === 1 ? "" : "s") +
            (undated === 1 ? " sits" : " sit") +
            " inside checklist details (not on the timeline)."
        )
      );
    }

    var chart = el("div", "gantt");
    chart.style.setProperty("--gantt-days", String(days.length));

    var stickyHead = el("div", "gantt-sticky-head");

    var monthRow = el("div", "gantt-row gantt-months");
    monthRow.appendChild(el("div", "gantt-label gantt-corner", ""));
    var monthDays = el("div", "gantt-days");
    var monthCursor = 0;
    while (monthCursor < days.length) {
      var monthStart = days[monthCursor];
      var monthKey =
        monthStart.getFullYear() + "-" + monthStart.getMonth();
      var span = 0;
      while (
        monthCursor + span < days.length &&
        days[monthCursor + span].getFullYear() +
          "-" +
          days[monthCursor + span].getMonth() ===
          monthKey
      ) {
        span += 1;
      }
      var fullMonth = monthStart.toLocaleDateString(undefined, {
        month: "short",
        year: "numeric",
      });
      var shortMonth =
        span < 5
          ? monthStart.toLocaleDateString(undefined, { month: "short" })
          : fullMonth;
      var monthLabel = el("div", "gantt-month-label", shortMonth);
      monthLabel.title = fullMonth;
      monthLabel.style.gridColumn =
        monthCursor + 1 + " / " + (monthCursor + span + 1);
      monthDays.appendChild(monthLabel);
      monthCursor += span;
    }
    monthRow.appendChild(monthDays);
    stickyHead.appendChild(monthRow);

    var head = el("div", "gantt-row gantt-head");
    head.appendChild(
      el("div", "gantt-label gantt-corner", "Board · card · checklist")
    );
    var headDays = el("div", "gantt-days");
    days.forEach(function (day, index) {
      var cell = el(
        "div",
        "gantt-day-label" + (index === todayCol ? " is-today" : ""),
        String(day.getDate())
      );
      cell.title = day.toLocaleDateString(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
      });
      headDays.appendChild(cell);
    });
    head.appendChild(headDays);
    stickyHead.appendChild(head);
    chart.appendChild(stickyHead);

    function formatSpanTitle(label, span) {
      if (!span) return label;
      var same = span.start.getTime() === span.end.getTime();
      if (same) {
        return label + " · due " + host.formatDue(span.end.toISOString());
      }
      return (
        label +
        " · " +
        host.formatDue(span.start.toISOString()) +
        " → " +
        host.formatDue(span.end.toISOString())
      );
    }

    function paintTrack(track, span, title, href, onActivate) {
      if (!span) return;
      var startCol = colIndex(span.start);
      var endCol = colIndex(span.end);
      var overdue = span.end.getTime() < dayStart(now).getTime();
      if (startCol < 0) startCol = 0;
      if (endCol < 0) endCol = 0;
      if (startCol > days.length - 1) startCol = days.length - 1;
      if (endCol > days.length - 1) endCol = days.length - 1;
      if (endCol < startCol) endCol = startCol;
      var isPoint = span.start.getTime() === span.end.getTime();
      var barClass =
        "gantt-bar" +
        (isPoint ? " is-marker" : "") +
        (overdue ? " is-overdue" : "") +
        (onActivate ? " gantt-bar-btn" : "");
      var bar;
      if (onActivate) {
        bar = el("button", barClass);
        bar.type = "button";
        bar.setAttribute(
          "aria-label",
          (title || "Checklist") + " — view items"
        );
        bar.addEventListener("click", function (event) {
          event.preventDefault();
          event.stopPropagation();
          onActivate();
        });
      } else if (href && safeHref(href)) {
        bar = el("a", barClass);
        bar.href = safeHref(href);
        bar.target = "_blank";
        bar.rel = "noopener noreferrer";
        bar.setAttribute(
          "aria-label",
          (title || "Open Trello card") + " (opens card)"
        );
      } else {
        bar = el("span", barClass);
      }
      bar.style.gridColumn = startCol + 1 + " / " + (endCol + 2);
      bar.title = title || "";
      track.appendChild(bar);
      if (overdue && todayCol > endCol) {
        var tail = el("span", "gantt-tail");
        tail.style.gridColumn = endCol + 1 + " / " + (todayCol + 2);
        tail.title = "Overdue through today";
        track.appendChild(tail);
      }
      if (todayCol >= 0 && todayCol < days.length) {
        var today = el("span", "gantt-today");
        today.style.gridColumn = String(todayCol + 1);
        track.appendChild(today);
      }
    }

    function appendLabel(row, level, title, meta, boardName, onActivate) {
      var label = el("div", "gantt-label gantt-label-" + level);
      if (onActivate) {
        var btn = el("button", "gantt-label-btn");
        btn.type = "button";
        if (level === "board") {
          var wrap = el("div", "gantt-board-title");
          var dot = el("span", "board-color-dot");
          dot.style.background =
            "hsl(" + boardHue(boardName || title) + " 48% 46%)";
          dot.setAttribute("aria-hidden", "true");
          wrap.appendChild(dot);
          wrap.appendChild(el("strong", null, title));
          btn.appendChild(wrap);
        } else {
          btn.appendChild(el("strong", null, title));
        }
        if (meta) btn.appendChild(el("span", null, meta));
        btn.addEventListener("click", function (event) {
          event.preventDefault();
          onActivate();
        });
        label.appendChild(btn);
      } else if (level === "board") {
        var wrapBoard = el("div", "gantt-board-title");
        var dotBoard = el("span", "board-color-dot");
        dotBoard.style.background =
          "hsl(" + boardHue(boardName || title) + " 48% 46%)";
        dotBoard.setAttribute("aria-hidden", "true");
        wrapBoard.appendChild(dotBoard);
        wrapBoard.appendChild(el("strong", null, title));
        label.appendChild(wrapBoard);
        if (meta) label.appendChild(el("span", null, meta));
      } else {
        label.appendChild(el("strong", null, title));
        if (meta) label.appendChild(el("span", null, meta));
      }
      row.appendChild(label);
      return label;
    }

    function openChecklist(checklist) {
      if (host.onChecklistDetail) {
        host.onChecklistDetail(checklist);
      }
    }

    tree.forEach(function (board) {
      var boardRow = el("div", "gantt-row gantt-board");
      appendLabel(
        boardRow,
        "board",
        board.name,
        board.cards.length +
          " card" +
          (board.cards.length === 1 ? "" : "s") +
          " · board",
        board.name
      );
      var boardTrack = el("div", "gantt-days");
      paintTrack(
        boardTrack,
        board.span,
        formatSpanTitle(board.name + " (board)", board.span),
        null
      );
      boardRow.appendChild(boardTrack);
      chart.appendChild(boardRow);

      board.cards.forEach(function (card) {
        var cardRow = el("div", "gantt-row gantt-card");
        if (card.sample) markRow(cardRow, host, card.sample);
        appendLabel(
          cardRow,
          "card",
          card.name,
          [
            card.listName,
            card.isMembership ? "Member card" : null,
            card.checklists.length
              ? card.checklists.length +
                " checklist" +
                (card.checklists.length === 1 ? "" : "s")
              : null,
          ]
            .filter(Boolean)
            .join(" · ")
        );
        var cardTrack = el("div", "gantt-days");
        paintTrack(
          cardTrack,
          card.span,
          formatSpanTitle(card.name, card.span),
          card.url || null
        );
        cardRow.appendChild(cardTrack);
        chart.appendChild(cardRow);

        card.checklists.forEach(function (checklist) {
          var row = el("div", "gantt-row gantt-checklist");
          if (checklist.sample) markRow(row, host, checklist.sample);
          var metaBits =
            checklist.count +
            " item" +
            (checklist.count === 1 ? "" : "s");
          if (checklist.undatedCount) {
            metaBits +=
              " · " +
              checklist.undatedCount +
              " undated";
          }
          appendLabel(
            row,
            "checklist",
            checklist.name,
            metaBits,
            null,
            function () {
              openChecklist(checklist);
            }
          );
          var track = el("div", "gantt-days");
          paintTrack(
            track,
            checklist.span,
            formatSpanTitle(checklist.name, checklist.span) +
              " · click for items",
            null,
            function () {
              openChecklist(checklist);
            }
          );
          row.appendChild(track);
          chart.appendChild(row);
        });
      });
    });

    root.appendChild(chart);
  }

  function render(view, root, items, host) {
    root.innerHTML = "";
    root.setAttribute("data-view", view || "");
    var intros = {
      agenda: [
        "Today’s agenda",
        "Overdue, today, and tomorrow work in one focused sequence.",
      ],
      horizon: [
        "Upcoming by board",
        "Compare where overdue and upcoming work is concentrated.",
      ],
      workload: [
        "Workload",
        "Review open assignments by person; this is a review signal, not a performance score.",
      ],
      progress: [
        "Checklist progress",
        "See completion and overdue work grouped by Trello card.",
      ],
      gantt: [
        "Timeline",
        "Due-date range by board, card, and checklist. Open Trello to change dates.",
      ],
    };
    if (intros[view]) {
      var intro = el("div", "insight-intro");
      intro.appendChild(el("h2", "insight-intro-title", intros[view][0]));
      intro.appendChild(el("p", "insight-intro-body", intros[view][1]));
      root.appendChild(intro);
    }
    if (view === "agenda") renderAgenda(root, items, host);
    else if (view === "horizon") renderHorizon(root, items, host);
    else if (view === "workload") renderWorkload(root, items, host);
    else if (view === "progress") renderProgress(root, items, host);
    else if (view === "gantt") renderGantt(root, items, host);
  }

  global.ChecklistHubViews = { render: render, boardHue: boardHue };
})(window);
