(function (global) {
  const config = global.CHECKLIST_HUB_CONFIG;
  const BATCH_SIZE = Math.max(
    1,
    Math.min(10, Number(config.maxConcurrentBoardFetches) || 10)
  );

  /**
   * Ephemeral in-memory only while this page/modal is open.
   * Cleared on Load checklists and when the tab closes — never sessionStorage/localStorage.
   */
  let memoryCache = null;
  const TEAM_CHECKLIST_RE = /^Checklist Hub Team:\s*(.+)$/i;
  const API_LOG_MAX = 500;

  function sleep(ms) {
    return new Promise(function (resolve) {
      setTimeout(resolve, ms);
    });
  }

  function chunk(items, size) {
    const out = [];
    for (let i = 0; i < items.length; i += size) {
      out.push(items.slice(i, i + size));
    }
    return out;
  }

  function isTeamConfigChecklist(name) {
    return TEAM_CHECKLIST_RE.test(String(name || "").trim());
  }

  function extractShortLink(text) {
    const raw = String(text || "").trim();
    if (!raw) return null;
    const fromUrl = raw.match(/\/b\/([a-zA-Z0-9]+)(?:\/|$|\?|#)/i);
    if (fromUrl) return fromUrl[1];
    if (/^[a-zA-Z0-9]{6,12}$/.test(raw)) return raw;
    return null;
  }

  function effectiveCheckItemState(checkItem, card) {
    if (checkItem && checkItem.state === "complete") return "complete";
    if (card && (card.closed || card.dueComplete)) return "complete";
    return (checkItem && checkItem.state) || "incomplete";
  }

  function logApiUsage(units, label) {
    const root = document.getElementById("api-usage-log");
    if (!root) return;
    const row = document.createElement("div");
    row.setAttribute("data-at", String(Date.now()));
    row.setAttribute("data-units", String(Math.max(1, Number(units) || 1)));
    row.setAttribute("data-label", String(label || "request"));
    root.appendChild(row);
    while (root.children.length > API_LOG_MAX) {
      root.removeChild(root.firstChild);
    }
  }

  async function trelloFetch(path, token, options) {
    const opts = options || {};
    const params = new URLSearchParams(opts.query || {});
    params.set("key", config.appKey);
    params.set("token", token);

    const method = opts.method || "GET";
    const url =
      "https://api.trello.com/1" +
      path +
      (path.indexOf("?") >= 0 ? "&" : "?") +
      params.toString();

    logApiUsage(
      opts.units != null ? opts.units : 1,
      opts.label || method + " " + path.split("?")[0]
    );

    let attempt = 0;
    while (true) {
      let response;
      try {
        response = await fetch(url, {
          method: method,
          headers: { Accept: "application/json" },
          signal: opts.signal || undefined,
        });
      } catch (networkErr) {
        if (
          networkErr &&
          (networkErr.name === "AbortError" ||
            (opts.signal && opts.signal.aborted))
        ) {
          const abortErr = new Error("Cancelled.");
          abortErr.name = "AbortError";
          abortErr.technical = "Aborted: " + method + " " + path;
          throw abortErr;
        }
        const err = new Error(
          "Could not reach Trello. Check your network connection and try again."
        );
        err.name = "TrelloNetworkError";
        err.technical =
          "Network error calling Trello API\n" +
          method +
          " " +
          path +
          "\n" +
          (networkErr && networkErr.message
            ? networkErr.message
            : String(networkErr));
        throw err;
      }

      const tokenRemaining = Number(
        response.headers.get("x-rate-limit-api-token-remaining")
      );
      const keyRemaining = Number(
        response.headers.get("x-rate-limit-api-key-remaining")
      );
      if (
        (Number.isFinite(tokenRemaining) && tokenRemaining <= 5) ||
        (Number.isFinite(keyRemaining) && keyRemaining <= 15)
      ) {
        await sleep(400);
      }

      if (response.status === 429) {
        attempt += 1;
        if (attempt > 5) {
          const err = new Error(
            "Trello is busy right now. Wait a minute, then try Update status or Load checklists again."
          );
          err.name = "TrelloRateLimitError";
          err.status = 429;
          err.technical =
            "HTTP 429 Too Many Requests after retries\n" +
            method +
            " " +
            path +
            "\nRetry-After: " +
            (response.headers.get("Retry-After") || "n/a") +
            "\nAttempts: " +
            attempt;
          throw err;
        }
        const retryAfter = Number(response.headers.get("Retry-After"));
        await sleep(
          Number.isFinite(retryAfter) ? retryAfter * 1000 : 1500 * attempt
        );
        continue;
      }

      if (!response.ok) {
        const text = await response.text();
        let bodyPreview = text;
        try {
          const parsed = JSON.parse(text);
          bodyPreview = JSON.stringify(parsed, null, 2);
        } catch (e) {
          // keep raw text
        }
        if (bodyPreview.length > 1200) {
          bodyPreview = bodyPreview.slice(0, 1200) + "…";
        }

        const friendly =
          response.status === 401 || response.status === 403
            ? "Trello refused access. Re-authorize Checklist Hub, or ask an admin to confirm the Power-Up and your board permissions."
            : response.status === 404
              ? "Trello could not find a board or card that was requested. Try Load checklists again; it may have been closed or removed."
              : response.status >= 500
                ? "Trello had a server problem. Wait a moment and try again."
                : "Something went wrong talking to Trello. Try again, or share the technical details with an admin.";

        const err = new Error(friendly);
        err.name = "TrelloApiError";
        err.status = response.status;
        err.technical =
          "HTTP " +
          response.status +
          " " +
          method +
          " " +
          path +
          "\n" +
          (bodyPreview || "(empty response body)");
        throw err;
      }

      if (response.status === 204) return null;
      return response.json();
    }
  }

  function readCache() {
    return memoryCache;
  }

  function writeCache(payload) {
    memoryCache = payload;
  }

  function clearCache() {
    memoryCache = null;
  }

  function boardNestedRoute(boardId) {
    const q = new URLSearchParams({
      fields: "id,name",
      members: "all",
      member_fields: "id,fullName,username",
      labels: "all",
      lists: "open",
      list_fields: "id,name",
      cards: "visible",
      card_fields:
        "id,name,shortUrl,url,idList,idMembers,due,dueComplete,closed,labels",
      checklists: "all",
      checkItem_fields: "name,state,due,idMember,pos",
    });
    return "/boards/" + boardId + "?" + q.toString();
  }

  function boardCardsRoute(boardId) {
    const q = new URLSearchParams({
      filter: "visible",
      fields:
        "id,name,shortUrl,url,idList,idMembers,due,dueComplete,closed,labels",
      checklists: "all",
      checklist_fields: "id,name",
      checkItem_fields: "name,state,due,idMember,pos",
    });
    return "/boards/" + boardId + "/cards?" + q.toString();
  }

  function labelDisplayName(label) {
    if (!label) return "Label";
    const name = (label.name || "").trim();
    if (name) return name;
    const color = label.color || "null";
    if (!color || color === "null") return "Label";
    return color.charAt(0).toUpperCase() + color.slice(1);
  }

  function normalizeCardLabels(card) {
    return (card && card.labels ? card.labels : []).map(function (label) {
      return {
        id: label.id,
        name: labelDisplayName(label),
        color: label.color || "null",
      };
    });
  }

  function listNameFromMaps(card, listNameById) {
    if (!card || !card.idList) return "";
    return (listNameById && listNameById[card.idList]) || "";
  }

  function boardMembersRoute(boardId) {
    return (
      "/boards/" +
      boardId +
      "/members?" +
      new URLSearchParams({ fields: "id,fullName,username" }).toString()
    );
  }

  function batchItemStatus(entry) {
    if (!entry || typeof entry !== "object") {
      return {
        ok: false,
        status: null,
        data: null,
        message: "Empty batch response",
      };
    }
    if (Object.prototype.hasOwnProperty.call(entry, "200")) {
      return { ok: true, status: 200, data: entry["200"], message: null };
    }
    const keys = Object.keys(entry);
    let statusKey = null;
    for (let i = 0; i < keys.length; i += 1) {
      if (/^\d+$/.test(keys[i])) {
        statusKey = keys[i];
        break;
      }
    }
    if (statusKey) {
      let detail = entry[statusKey];
      try {
        detail =
          typeof detail === "string" ? detail : JSON.stringify(detail);
      } catch (e) {
        detail = String(detail);
      }
      if (detail && detail.length > 180) detail = detail.slice(0, 180) + "…";
      return {
        ok: false,
        status: Number(statusKey),
        data: null,
        message: "HTTP " + statusKey + (detail ? ": " + detail : ""),
      };
    }
    return {
      ok: false,
      status: null,
      data: null,
      message: "Unexpected batch response",
    };
  }

  function unwrapBatchItem(entry) {
    const result = batchItemStatus(entry);
    return result.ok ? result.data : null;
  }

  function pushCheckItem(
    items,
    board,
    card,
    checklist,
    checkItem,
    membersById,
    listNameById
  ) {
    if (isTeamConfigChecklist(checklist && checklist.name)) return;
    const memberId = checkItem.idMember || null;
    const memberIds = (card && card.idMembers) || [];
    items.push({
      kind: "checkitem",
      id: checkItem.id,
      name: checkItem.name,
      state: effectiveCheckItemState(checkItem, card),
      due: checkItem.due || null,
      idMember: memberId,
      assigneeName: memberId
        ? (membersById[memberId] && membersById[memberId].fullName) || "Unknown"
        : "",
      checklistId: checklist.id,
      checklistName: checklist.name,
      cardId: card.id,
      cardName: card.name,
      cardUrl: card.shortUrl || card.url,
      boardId: board.id,
      boardName: board.name,
      listId: card.idList || null,
      listName: listNameFromMaps(card, listNameById),
      labels: normalizeCardLabels(card),
      pos: checkItem.pos,
      idMembers: memberIds.slice(),
      cardDueComplete: Boolean(card && card.dueComplete),
      cardClosed: Boolean(card && card.closed),
    });
  }

  function flattenBoard(board, cards, membersById, listNameById) {
    const items = [];
    (cards || []).forEach(function (card) {
      (card.checklists || []).forEach(function (checklist) {
        if (isTeamConfigChecklist(checklist.name)) return;
        (checklist.checkItems || []).forEach(function (checkItem) {
          pushCheckItem(
            items,
            board,
            card,
            checklist,
            checkItem,
            membersById,
            listNameById
          );
        });
      });
    });
    return items;
  }

  function flattenFromBoardPayload(board, payload, membersById) {
    const cardsById = {};
    (payload.cards || []).forEach(function (card) {
      cardsById[card.id] = card;
    });

    const listNameById = {};
    (payload.lists || []).forEach(function (list) {
      if (list && list.id) listNameById[list.id] = list.name || "";
    });

    const checklistSource =
      payload.checklists && payload.checklists.length
        ? payload.checklists
            .filter(function (checklist) {
              return !isTeamConfigChecklist(checklist.name);
            })
            .map(function (checklist) {
              return {
                checklist: checklist,
                card: cardsById[checklist.idCard] || {},
              };
            })
        : [];

    if (!checklistSource.length) {
      return flattenBoard(board, payload.cards || [], membersById, listNameById);
    }

    const items = [];
    checklistSource.forEach(function (entry) {
      const checklist = entry.checklist;
      const card = entry.card;
      if (!card || !card.id) return;
      (checklist.checkItems || []).forEach(function (checkItem) {
        pushCheckItem(
          items,
          board,
          card,
          checklist,
          checkItem,
          membersById,
          listNameById
        );
      });
    });
    return items;
  }

  function parseTeamsFromBoardPayload(payload) {
    const membersById = {};
    (payload.members || []).forEach(function (member) {
      if (member && member.id) membersById[member.id] = member;
    });
    const teams = [];
    (payload.checklists || []).forEach(function (checklist) {
      const match = String(checklist.name || "")
        .trim()
        .match(TEAM_CHECKLIST_RE);
      if (!match) return;
      const team = {
        id: checklist.id,
        name: match[1].trim() || "Team",
        checklistId: checklist.id,
        members: [],
        memberIds: [],
        boardShortLinks: [],
        boardIds: [],
      };
      const seenMembers = {};
      const seenLinks = {};
      (checklist.checkItems || []).forEach(function (checkItem) {
        if (checkItem.idMember) {
          if (seenMembers[checkItem.idMember]) return;
          seenMembers[checkItem.idMember] = true;
          team.memberIds.push(checkItem.idMember);
          team.members.push(
            membersById[checkItem.idMember] || {
              id: checkItem.idMember,
              fullName: "Member",
              username: "",
            }
          );
          return;
        }
        const shortLink = extractShortLink(checkItem.name);
        if (shortLink && !seenLinks[shortLink]) {
          seenLinks[shortLink] = true;
          team.boardShortLinks.push(shortLink);
        }
      });
      teams.push(team);
    });
    teams.sort(function (a, b) {
      return a.name.localeCompare(b.name);
    });
    return teams;
  }

  async function loadTeamConfig(token, boardId, options) {
    const opts = options || {};
    if (!boardId) {
      return { board: null, teams: [], members: [] };
    }
    const payload = await trelloFetch(boardNestedRoute(boardId), token, {
      signal: opts.signal || null,
      label: "team-config",
      units: 1,
    });
    return {
      board: payload
        ? { id: payload.id, name: payload.name || "" }
        : null,
      teams: parseTeamsFromBoardPayload(payload || {}),
      members: (payload && payload.members) || [],
    };
  }

  async function resolveBoardShortLinks(token, shortLinks, options) {
    const opts = options || {};
    const unique = [];
    const seen = {};
    (shortLinks || []).forEach(function (link) {
      if (!link || seen[link]) return;
      seen[link] = true;
      unique.push(link);
    });
    if (!unique.length) return [];

    const routes = unique.map(function (link) {
      return (
        "/boards/" +
        encodeURIComponent(link) +
        "?fields=id,name,shortLink"
      );
    });
    const resolved = [];
    const chunks = chunk(routes, BATCH_SIZE);
    for (let i = 0; i < chunks.length; i += 1) {
      assertNotAborted(opts.signal || null);
      const batch = await fetchBatch(chunks[i], token, {
        signal: opts.signal || null,
        label: "resolve-boards",
      });
      chunks[i].forEach(function (route, idx) {
        const status = batchItemStatus(batch[idx]);
        const requested = decodeURIComponent(
          route.split("/")[2].split("?")[0]
        );
        if (status.ok && status.data && status.data.id) {
          resolved.push({
            id: status.data.id,
            name: status.data.name || "",
            shortLink: status.data.shortLink || requested,
          });
        }
      });
    }
    return resolved;
  }

  /**
   * Cards where `me` is a member, but no checklist item on that card is
   * assigned to `me`.
   */
  function extractMemberCardsWithoutTasks(
    board,
    cards,
    items,
    meId,
    membersById,
    listNameById
  ) {
    const cardIdsWithMyTasks = {};
    items.forEach(function (item) {
      if (item.idMember === meId && item.cardId) {
        cardIdsWithMyTasks[item.cardId] = true;
      }
    });

    const out = [];
    (cards || []).forEach(function (card) {
      const memberIds = card.idMembers || [];
      if (memberIds.indexOf(meId) === -1) return;
      if (cardIdsWithMyTasks[card.id]) return;

      out.push({
        kind: "card",
        id: "card-membership:" + card.id,
        name: card.name,
        state: card.dueComplete ? "complete" : "incomplete",
        due: card.due || null,
        dueComplete: Boolean(card.dueComplete),
        idMember: meId,
        assigneeName:
          (membersById[meId] && membersById[meId].fullName) || "You",
        checklistId: null,
        checklistName: "Card membership · no checklist tasks for you",
        cardId: card.id,
        cardName: card.name,
        cardUrl: card.shortUrl || card.url,
        boardId: board.id,
        boardName: board.name,
        listId: card.idList || null,
        listName: listNameFromMaps(card, listNameById),
        labels: normalizeCardLabels(card),
        pos: 0,
        idMembers: memberIds,
      });
    });
    return out;
  }

  function payloadLooksComplete(payload) {
    // Nested board GET succeeded when the cards array is present (may be empty).
    // Boards with cards but no checklists are valid and must not trigger fallback.
    return Boolean(payload && Array.isArray(payload.cards));
  }

  async function fetchBatch(routes, token, options) {
    if (!routes.length) return [];
    const opts = options || {};
    return trelloFetch("/batch", token, {
      query: { urls: routes.join(",") },
      signal: opts.signal,
      units: routes.length,
      label: opts.label || "batch",
    });
  }

  function assertNotAborted(signal) {
    if (signal && signal.aborted) {
      const err = new Error("Cancelled.");
      err.name = "AbortError";
      throw err;
    }
  }

  async function loadBoardsBundle(token, options) {
    const opts = options || {};
    const onProgress = opts.onProgress;
    const allowlist = opts.boardIds;
    const signal = opts.signal || null;
    const boardErrors = [];

    assertNotAborted(signal);

    let me;
    let boards;
    let allBoards;
    let httpCalls = 0;
    let bootstrapUnits = 0;

    if (opts.me && opts.boards && opts.boards.length) {
      // Scoped refresh: caller already knows member + board ids (no bootstrap).
      me = opts.me;
      boards = opts.boards.slice();
      allBoards = opts.allBoards || boards.slice();
    } else {
      // One HTTP round-trip, two rate-limit units (batch counts each URL).
      const bootstrap = await fetchBatch(
        [
          "/members/me?" +
            new URLSearchParams({ fields: "id,fullName,username" }).toString(),
          "/members/me/boards?" +
            new URLSearchParams({
              filter: "open",
              fields: "id,name,shortLink,dateLastActivity",
              lists: "none",
            }).toString(),
        ],
        token,
        { signal: signal }
      );

      const meStatus = batchItemStatus(bootstrap[0]);
      const boardsStatus = batchItemStatus(bootstrap[1]);
      if (!meStatus.ok || !meStatus.data) {
        const err = new Error(
          meStatus.message || "Could not load the signed-in Trello member."
        );
        err.name = "TrelloApiError";
        throw err;
      }
      if (!boardsStatus.ok || !boardsStatus.data) {
        const err = new Error(
          boardsStatus.message || "Could not load your Trello boards."
        );
        err.name = "TrelloApiError";
        throw err;
      }

      me = meStatus.data;
      boards = boardsStatus.data || [];
      allBoards = boards.map(function (b) {
        return { id: b.id, name: b.name };
      });
      httpCalls = 1;
      bootstrapUnits = 2;

      if (Array.isArray(allowlist)) {
        const allowed = {};
        allowlist.forEach(function (id) {
          allowed[id] = true;
        });
        boards = boards.filter(function (b) {
          return allowed[b.id];
        });
      }
    }

    boards.sort(function (a, b) {
      return String(b.dateLastActivity || "").localeCompare(
        String(a.dateLastActivity || "")
      );
    });

    const membersById = {};
    membersById[me.id] = me;

    let nestedUnits = 0;
    let fallbackUnits = 0;
    let completed = 0;

    const boardById = {};
    boards.forEach(function (b) {
      boardById[b.id] = b;
    });

    const nestedChunks = chunk(
      boards.map(function (b) {
        return boardNestedRoute(b.id);
      }),
      BATCH_SIZE
    );

    const nestedPayloads = {};
    for (let i = 0; i < nestedChunks.length; i += 1) {
      assertNotAborted(signal);
      const batch = await fetchBatch(nestedChunks[i], token, { signal: signal });
      httpCalls += 1;
      nestedUnits += nestedChunks[i].length;

      nestedChunks[i].forEach(function (route, idx) {
        const boardId = route.split("?")[0].replace("/boards/", "");
        const boardName =
          (boardById[boardId] && boardById[boardId].name) || boardId;
        const status = batchItemStatus(batch[idx]);
        if (status.ok && status.data) {
          nestedPayloads[boardId] = status.data;
        } else {
          boardErrors.push({
            boardId: boardId,
            boardName: boardName,
            message: status.message || "Failed to load board",
          });
        }
        completed += 1;
        if (onProgress) {
          onProgress(
            Math.min(completed, boards.length),
            boards.length,
            boardName
          );
        }
      });
    }

    const needsFallback = boards.filter(function (board) {
      if (
        boardErrors.some(function (err) {
          return err.boardId === board.id;
        })
      ) {
        return false;
      }
      const payload = nestedPayloads[board.id];
      return !payloadLooksComplete(payload);
    });

    if (needsFallback.length) {
      const fallbackRoutes = [];
      needsFallback.forEach(function (board) {
        fallbackRoutes.push(boardCardsRoute(board.id));
        fallbackRoutes.push(boardMembersRoute(board.id));
      });
      const fallbackChunks = chunk(fallbackRoutes, BATCH_SIZE);
      const fallbackByBoard = {};

      for (let i = 0; i < fallbackChunks.length; i += 1) {
        assertNotAborted(signal);
        const batch = await fetchBatch(fallbackChunks[i], token, {
          signal: signal,
        });
        httpCalls += 1;
        fallbackUnits += fallbackChunks[i].length;

        fallbackChunks[i].forEach(function (route, idx) {
          const status = batchItemStatus(batch[idx]);
          const boardId = route.split("/")[2].split("?")[0];
          const boardName =
            (boardById[boardId] && boardById[boardId].name) || boardId;
          if (!fallbackByBoard[boardId]) {
            fallbackByBoard[boardId] = { cards: [], members: [], failed: false };
          }
          if (!status.ok) {
            fallbackByBoard[boardId].failed = true;
            if (
              !boardErrors.some(function (err) {
                return err.boardId === boardId;
              })
            ) {
              boardErrors.push({
                boardId: boardId,
                boardName: boardName,
                message: status.message || "Fallback fetch failed",
              });
            }
            return;
          }
          if (route.indexOf("/cards?") >= 0) {
            fallbackByBoard[boardId].cards = status.data || [];
          } else {
            fallbackByBoard[boardId].members = status.data || [];
          }
        });
      }

      needsFallback.forEach(function (board) {
        const fb = fallbackByBoard[board.id] || {
          cards: [],
          members: [],
          failed: false,
        };
        if (fb.failed) return;
        nestedPayloads[board.id] = {
          cards: fb.cards,
          members: fb.members,
          checklists: [],
          lists: [],
          labels: [],
        };
      });
    }

    const items = [];
    const memberCards = [];
    const labelsById = {};
    const listsById = {};
    const failedIds = {};
    boardErrors.forEach(function (err) {
      failedIds[err.boardId] = true;
    });

    boards.forEach(function (board) {
      if (failedIds[board.id] && !nestedPayloads[board.id]) return;
      const payload = nestedPayloads[board.id] || {
        cards: [],
        members: [],
        checklists: [],
        lists: [],
        labels: [],
      };
      (payload.members || []).forEach(function (member) {
        membersById[member.id] = member;
      });
      (payload.labels || []).forEach(function (label) {
        if (!label || !label.id) return;
        labelsById[label.id] = {
          id: label.id,
          name: labelDisplayName(label),
          color: label.color || "null",
        };
      });
      const listNameById = {};
      (payload.lists || []).forEach(function (list) {
        if (!list || !list.id) return;
        listNameById[list.id] = list.name || "";
        listsById[list.id] = {
          id: list.id,
          name: list.name || "List",
          boardId: board.id,
          boardName: board.name,
        };
      });
      const boardItems = flattenFromBoardPayload(
        board,
        payload,
        membersById
      );
      boardItems.forEach(function (item) {
        if (item.idMember && membersById[item.idMember]) {
          item.assigneeName = membersById[item.idMember].fullName;
        }
        (item.labels || []).forEach(function (label) {
          if (label && label.id && !labelsById[label.id]) {
            labelsById[label.id] = label;
          }
        });
        items.push(item);
      });
      extractMemberCardsWithoutTasks(
        board,
        payload.cards || [],
        boardItems,
        me.id,
        membersById,
        listNameById
      ).forEach(function (card) {
        (card.labels || []).forEach(function (label) {
          if (label && label.id && !labelsById[label.id]) {
            labelsById[label.id] = label;
          }
        });
        memberCards.push(card);
      });
    });

    return {
      fetchedAt: Date.now(),
      me: me,
      boards: allBoards,
      scannedBoardIds: boards.map(function (b) {
        return b.id;
      }),
      members: Object.keys(membersById).map(function (id) {
        return membersById[id];
      }),
      labels: Object.keys(labelsById)
        .map(function (id) {
          return labelsById[id];
        })
        .sort(function (a, b) {
          return String(a.name).localeCompare(String(b.name));
        }),
      lists: Object.keys(listsById)
        .map(function (id) {
          return listsById[id];
        })
        .sort(function (a, b) {
          const boardCmp = String(a.boardName).localeCompare(String(b.boardName));
          if (boardCmp) return boardCmp;
          return String(a.name).localeCompare(String(b.name));
        }),
      items: items,
      memberCards: memberCards,
      meta: {
        boardCount: boards.length,
        accessibleBoardCount: allBoards.length,
        httpCalls: httpCalls,
        rateLimitUnits: nestedUnits + fallbackUnits + bootstrapUnits,
        boardErrors: boardErrors,
        strategy:
          "allowlist-aware scan; /batch nested board GETs; in-memory only while open",
      },
    };
  }

  async function loadBoardCatalog(token, options) {
    const opts = options || {};
    assertNotAborted(opts.signal || null);

    const bootstrap = await fetchBatch(
      [
        "/members/me?" +
          new URLSearchParams({ fields: "id,fullName,username" }).toString(),
        "/members/me/boards?" +
          new URLSearchParams({
            filter: "open",
            fields: "id,name,shortLink,dateLastActivity",
            lists: "none",
          }).toString(),
      ],
      token,
      { signal: opts.signal || null, label: "board-catalog" }
    );

    const meStatus = batchItemStatus(bootstrap[0]);
    const boardsStatus = batchItemStatus(bootstrap[1]);
    if (!meStatus.ok || !meStatus.data) {
      const err = new Error(
        meStatus.message || "Could not load the signed-in Trello member."
      );
      err.name = "TrelloApiError";
      throw err;
    }
    if (!boardsStatus.ok || !boardsStatus.data) {
      const err = new Error(
        boardsStatus.message || "Could not load your open boards."
      );
      err.name = "TrelloApiError";
      throw err;
    }

    const me = meStatus.data;
    const boards = (boardsStatus.data || [])
      .map(function (b) {
        return {
          id: b.id,
          name: b.name || b.id,
          shortLink: b.shortLink || "",
          dateLastActivity: b.dateLastActivity || "",
        };
      })
      .sort(function (a, b) {
        return String(a.name).localeCompare(String(b.name));
      });

    return {
      me: me,
      boards: boards,
      meta: {
        httpCalls: 1,
        rateLimitUnits: 2,
        boardCount: boards.length,
        strategy: "board catalog only (no checklists)",
      },
    };
  }

  async function getChecklistData(token, options) {
    const opts = options || {};
    const cached = readCache();
    const ttl = config.cacheTtlMs || 5 * 60 * 1000;

    if (
      !opts.forceRefresh &&
      cached &&
      cached.me &&
      cached.fetchedAt &&
      Date.now() - cached.fetchedAt < ttl
    ) {
      return { data: cached, fromCache: true };
    }

    const data = await loadBoardsBundle(token, {
      onProgress: opts.onProgress,
      boardIds: opts.boardIds || null,
      signal: opts.signal || null,
    });
    writeCache(data);
    return { data: data, fromCache: false };
  }

  function cardRefreshRoute(cardId) {
    return (
      "/cards/" +
      cardId +
      "?" +
      new URLSearchParams({
        fields:
          "id,name,due,dueComplete,closed,idMembers,shortUrl,url,idList,labels",
        checklists: "all",
        checklist_fields: "id,name",
        checkItem_fields: "name,state,due,idMember,pos",
      }).toString()
    );
  }

  function mergeBoardSlice(source, slice) {
    const boardSet = {};
    (slice.scannedBoardIds || []).forEach(function (id) {
      boardSet[id] = true;
    });

    const keptItems = (source.items || []).filter(function (item) {
      return !boardSet[item.boardId];
    });
    const keptCards = (source.memberCards || []).filter(function (card) {
      return !boardSet[card.boardId];
    });

    source.items = keptItems.concat(slice.items || []);
    source.memberCards = keptCards.concat(slice.memberCards || []);

    const membersById = {};
    (source.members || []).forEach(function (m) {
      membersById[m.id] = m;
    });
    (slice.members || []).forEach(function (m) {
      membersById[m.id] = m;
    });
    source.members = Object.keys(membersById).map(function (id) {
      return membersById[id];
    });

    const labelsById = {};
    (source.labels || []).forEach(function (l) {
      labelsById[l.id] = l;
    });
    (slice.labels || []).forEach(function (l) {
      labelsById[l.id] = l;
    });
    source.labels = Object.keys(labelsById).map(function (id) {
      return labelsById[id];
    });

    const listsById = {};
    (source.lists || []).forEach(function (l) {
      listsById[l.id] = l;
    });
    (slice.lists || []).forEach(function (l) {
      listsById[l.id] = l;
    });
    source.lists = Object.keys(listsById).map(function (id) {
      return listsById[id];
    });

    source.statusSyncedAt = Date.now();
    return source;
  }

  function applyCardRefresh(source, cardId, fresh) {
    let updated = 0;
    let removed = 0;
    let added = 0;
    const meId = source.me && source.me.id;
    const membersById = {};
    (source.members || []).forEach(function (m) {
      membersById[m.id] = m;
    });

    if (!fresh || fresh.closed) {
      const beforeItems = (source.items || []).length;
      source.items = (source.items || []).filter(function (item) {
        return item.cardId !== cardId;
      });
      removed += beforeItems - source.items.length;
      const beforeCards = (source.memberCards || []).length;
      source.memberCards = (source.memberCards || []).filter(function (card) {
        return card.cardId !== cardId;
      });
      removed += beforeCards - source.memberCards.length;
      return { updated: updated, removed: removed, added: added };
    }

    const boardMeta = {
      id:
        ((source.items || []).find(function (i) {
          return i.cardId === cardId;
        }) ||
          (source.memberCards || []).find(function (c) {
            return c.cardId === cardId;
          }) ||
          {}).boardId || null,
      name:
        ((source.items || []).find(function (i) {
          return i.cardId === cardId;
        }) ||
          (source.memberCards || []).find(function (c) {
            return c.cardId === cardId;
          }) ||
          {}).boardName || "",
    };

    const listNameById = {};
    (source.lists || []).forEach(function (list) {
      listNameById[list.id] = list.name;
    });

    const nextItems = [];
    const freshMemberIds = fresh.idMembers || [];
    (fresh.checklists || []).forEach(function (checklist) {
      if (isTeamConfigChecklist(checklist.name)) return;
      (checklist.checkItems || []).forEach(function (checkItem) {
        const memberId = checkItem.idMember || null;
        nextItems.push({
          kind: "checkitem",
          id: checkItem.id,
          name: checkItem.name,
          state: effectiveCheckItemState(checkItem, fresh),
          due: checkItem.due || null,
          idMember: memberId,
          assigneeName: memberId
            ? (membersById[memberId] && membersById[memberId].fullName) ||
              "Unknown"
            : "",
          checklistId: checklist.id,
          checklistName: checklist.name,
          cardId: fresh.id,
          cardName: fresh.name,
          cardUrl: fresh.shortUrl || fresh.url,
          boardId: boardMeta.id,
          boardName: boardMeta.name,
          listId: fresh.idList || null,
          listName: listNameFromMaps(fresh, listNameById),
          labels: normalizeCardLabels(fresh),
          pos: checkItem.pos,
          idMembers: freshMemberIds.slice(),
          cardDueComplete: Boolean(fresh.dueComplete),
          cardClosed: Boolean(fresh.closed),
        });
      });
    });

    const previousOnCard = (source.items || []).filter(function (item) {
      return item.cardId === cardId;
    });
    const prevById = {};
    previousOnCard.forEach(function (item) {
      prevById[item.id] = item;
    });
    nextItems.forEach(function (item) {
      const prev = prevById[item.id];
      if (!prev) {
        // Update status only refreshes known rows — new check items need Scan.
        return;
      }
      if (
        prev.state !== item.state ||
        prev.due !== item.due ||
        prev.idMember !== item.idMember ||
        prev.name !== item.name
      ) {
        updated += 1;
      }
    });
    previousOnCard.forEach(function (item) {
      if (
        !nextItems.some(function (n) {
          return n.id === item.id;
        })
      ) {
        removed += 1;
      }
    });

    const retainedItems = nextItems.filter(function (item) {
      return Boolean(prevById[item.id]);
    });

    source.items = (source.items || [])
      .filter(function (item) {
        return item.cardId !== cardId;
      })
      .concat(retainedItems);

    const memberIds = fresh.idMembers || [];
    const existingMemberCard = (source.memberCards || []).find(function (card) {
      return card.cardId === cardId;
    });
    const hasMyCheckitem = retainedItems.some(function (item) {
      return meId && item.idMember === meId;
    });
    const keepMemberCard =
      meId && memberIds.indexOf(meId) >= 0 && !hasMyCheckitem;

    source.memberCards = (source.memberCards || []).filter(function (card) {
      return card.cardId !== cardId;
    });

    if (keepMemberCard && existingMemberCard) {
      const nextState = fresh.dueComplete ? "complete" : "incomplete";
      if (
        existingMemberCard.state !== nextState ||
        existingMemberCard.due !== (fresh.due || null) ||
        existingMemberCard.name !== fresh.name
      ) {
        updated += 1;
      }
      source.memberCards.push({
        kind: "card",
        id: "card-membership:" + fresh.id,
        name: fresh.name,
        state: nextState,
        due: fresh.due || null,
        dueComplete: Boolean(fresh.dueComplete),
        idMember: meId,
        assigneeName:
          (membersById[meId] && membersById[meId].fullName) || "You",
        checklistId: null,
        checklistName: "Card membership · no checklist tasks for you",
        cardId: fresh.id,
        cardName: fresh.name,
        cardUrl: fresh.shortUrl || fresh.url,
        boardId: boardMeta.id,
        boardName: boardMeta.name,
        listId: fresh.idList || null,
        listName: listNameFromMaps(fresh, listNameById),
        labels: normalizeCardLabels(fresh),
        pos: 0,
        idMembers: memberIds,
      });
    } else if (existingMemberCard) {
      removed += 1;
    }
    // Do not add brand-new member-card rows on Update — Scan finds those.

    (fresh.labels || []).forEach(function (label) {
      if (!label || !label.id) return;
      if (!source.labels) source.labels = [];
      if (
        !source.labels.some(function (l) {
          return l.id === label.id;
        })
      ) {
        source.labels.push({
          id: label.id,
          name: labelDisplayName(label),
          color: label.color || "null",
        });
      }
    });

    return { updated: updated, removed: removed, added: added };
  }

  /**
   * Refresh known open work with the cheapest strategy:
   * - Per unique card (nested checklists) when few cards span many boards
   * - Scoped board nested GETs when open items concentrate on fewer boards
   *
   * Status-only: never adds brand-new checklist items or member cards
   * (Scan is required for newly assigned work). Unknown rows from a board
   * fetch are pruned after merge.
   *
   * Each URL inside /batch costs one rate-limit unit (same as Scan's per-board
   * unit). Update is NOT always cheaper than Scan.
   */
  async function refreshKnownStatus(token, data, options) {
    const opts = options || {};
    const source = data || readCache();
    if (!source) {
      return getChecklistData(token, {
        forceRefresh: true,
        onProgress: opts.onProgress,
        boardIds: opts.boardIds || null,
      });
    }

    const onlyIncomplete = opts.onlyIncomplete !== false;
    const openItems = (source.items || []).filter(function (item) {
      if (item.kind === "card") return false;
      return onlyIncomplete ? item.state === "incomplete" : true;
    });
    const openMemberCards = (source.memberCards || []).filter(function (card) {
      return onlyIncomplete ? card.state === "incomplete" : true;
    });

    const cardIds = {};
    const boardIds = {};
    openItems.forEach(function (item) {
      if (item.cardId) cardIds[item.cardId] = true;
      if (item.boardId) boardIds[item.boardId] = true;
    });
    openMemberCards.forEach(function (card) {
      if (card.cardId) cardIds[card.cardId] = true;
      if (card.boardId) boardIds[card.boardId] = true;
    });

    const uniqueCards = Object.keys(cardIds);
    const uniqueBoards = Object.keys(boardIds);
    const checked = openItems.length + openMemberCards.length;

    if (!uniqueCards.length) {
      source.statusSyncedAt = Date.now();
      writeCache(source);
      return {
        data: source,
        fromCache: false,
        statusOnly: true,
        meta: {
          httpCalls: 0,
          rateLimitUnits: 0,
          checked: 0,
          updated: 0,
          removed: 0,
          added: 0,
          strategy: "nothing open to refresh",
        },
      };
    }

    // With hundreds of checklist items, prefer board-scoped refresh whenever it
    // uses fewer or equal rate units (almost always: many items share boards).
    const useBoardStrategy =
      uniqueBoards.length > 0 && uniqueBoards.length <= uniqueCards.length;

    if (useBoardStrategy) {
      const boardSummaries = uniqueBoards.map(function (id) {
        const known = (source.boards || []).find(function (b) {
          return b.id === id;
        });
        const named =
          openItems.find(function (i) {
            return i.boardId === id;
          }) ||
          openMemberCards.find(function (c) {
            return c.boardId === id;
          });
        return {
          id: id,
          name: (known && known.name) || (named && named.boardName) || id,
        };
      });
      const boardIdSet = {};
      uniqueBoards.forEach(function (id) {
        boardIdSet[id] = true;
      });
      const knownItemIds = {};
      const knownMemberCardIds = {};
      (source.items || []).forEach(function (item) {
        if (boardIdSet[item.boardId]) knownItemIds[item.id] = true;
      });
      (source.memberCards || []).forEach(function (card) {
        if (boardIdSet[card.boardId]) knownMemberCardIds[card.id] = true;
      });

      const slice = await loadBoardsBundle(token, {
        me: source.me,
        boards: boardSummaries,
        allBoards: source.boards || boardSummaries,
        onProgress: opts.onProgress,
        signal: opts.signal || null,
      });
      mergeBoardSlice(source, slice);
      // Status-only: drop brand-new rows Scan would be needed to discover.
      let droppedAdds = 0;
      source.items = (source.items || []).filter(function (item) {
        if (!boardIdSet[item.boardId]) return true;
        if (knownItemIds[item.id]) return true;
        droppedAdds += 1;
        return false;
      });
      source.memberCards = (source.memberCards || []).filter(function (card) {
        if (!boardIdSet[card.boardId]) return true;
        if (knownMemberCardIds[card.id]) return true;
        droppedAdds += 1;
        return false;
      });
      writeCache(source);
      return {
        data: source,
        fromCache: false,
        statusOnly: true,
        meta: {
          httpCalls: (slice.meta && slice.meta.httpCalls) || 0,
          rateLimitUnits:
            (slice.meta && slice.meta.rateLimitUnits) || uniqueBoards.length,
          checked: checked,
          updated: null,
          removed: null,
          added: 0,
          prunedNew: droppedAdds,
          strategy:
            "scoped board status refresh (" +
            uniqueBoards.length +
            " boards ≤ " +
            uniqueCards.length +
            " cards)",
          boardErrors: (slice.meta && slice.meta.boardErrors) || [],
        },
      };
    }

    let httpCalls = 0;
    let updated = 0;
    let removed = 0;
    let added = 0;
    const routes = uniqueCards.map(cardRefreshRoute);
    const chunks = chunk(routes, BATCH_SIZE);

    for (let i = 0; i < chunks.length; i += 1) {
      const batch = await fetchBatch(chunks[i], token, {
        signal: opts.signal || null,
      });
      httpCalls += 1;
      if (opts.onProgress) {
        opts.onProgress(
          Math.min((i + 1) * BATCH_SIZE, uniqueCards.length),
          uniqueCards.length,
          "Updating open cards"
        );
      }
      chunks[i].forEach(function (route, idx) {
        const cardId = route.split("?")[0].replace("/cards/", "");
        const status = batchItemStatus(batch[idx]);
        const stats = applyCardRefresh(
          source,
          cardId,
          status.ok ? status.data : null
        );
        updated += stats.updated;
        removed += stats.removed;
        added += stats.added;
      });
    }

    source.statusSyncedAt = Date.now();
    writeCache(source);

    return {
      data: source,
      fromCache: false,
      statusOnly: true,
      meta: {
        httpCalls: httpCalls,
        rateLimitUnits: uniqueCards.length,
        checked: checked,
        updated: updated,
        removed: removed,
        added: added,
        strategy:
          "per-card nested checklists (" +
          uniqueCards.length +
          " cards ≤ " +
          uniqueBoards.length +
          " boards)",
      },
    };
  }

  async function refreshKnownItems(token, data, options) {
    return refreshKnownStatus(token, data, options);
  }

  async function refreshKnownMemberCards(token, data, options) {
    // Member cards are included in refreshKnownStatus; keep API surface stable.
    return {
      data: data || readCache(),
      fromCache: false,
      statusOnly: true,
      meta: { httpCalls: 0, checked: 0, updated: 0, removed: 0 },
    };
  }

  global.ChecklistHubApi = {
    getChecklistData: getChecklistData,
    loadBoardCatalog: loadBoardCatalog,
    refreshKnownStatus: refreshKnownStatus,
    refreshKnownItems: refreshKnownItems,
    refreshKnownMemberCards: refreshKnownMemberCards,
    clearCache: clearCache,
    readCache: readCache,
    loadTeamConfig: loadTeamConfig,
    resolveBoardShortLinks: resolveBoardShortLinks,
    parseTeamsFromBoardPayload: parseTeamsFromBoardPayload,
    extractShortLink: extractShortLink,
    isTeamConfigChecklist: isTeamConfigChecklist,
  };
})(window);
