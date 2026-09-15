/**
 * Contract tests for Update-status refresh rules (no network).
 * Run: npm test
 */
const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

function loadApi() {
  const root = path.join(__dirname, "..", "public");
  const configSrc = fs.readFileSync(path.join(root, "config.js"), "utf8");
  const apiSrc = fs.readFileSync(path.join(root, "js", "api.js"), "utf8");
  const sandbox = {
    console,
    URLSearchParams,
    fetch: async () => {
      throw new Error("network disabled in tests");
    },
    document: {
      getElementById: () => null,
    },
    setTimeout,
    clearTimeout,
  };
  sandbox.window = sandbox;
  sandbox.global = sandbox;
  vm.runInNewContext(configSrc + "\n" + apiSrc, sandbox, {
    filename: "api.js",
  });
  return sandbox.ChecklistHubApi;
}

const api = loadApi();

describe("normalizeMemberId", () => {
  it("maps nullish and sentinel strings to null", () => {
    assert.equal(api.normalizeMemberId(null), null);
    assert.equal(api.normalizeMemberId(""), null);
    assert.equal(api.normalizeMemberId("null"), null);
    assert.equal(api.normalizeMemberId("undefined"), null);
  });

  it("keeps real ids", () => {
    assert.equal(api.normalizeMemberId("abc123"), "abc123");
  });
});

describe("allowlistCacheKey", () => {
  it("sorts and joins board ids", () => {
    assert.equal(api.allowlistCacheKey(["b", "a"]), "a,b");
    assert.equal(api.allowlistCacheKey([]), "");
  });
});

describe("reminder expansion", () => {
  it("is idempotent when applied repeatedly to cached data", () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 2);
    tomorrow.setHours(12, 0, 0, 0);
    const source = {
      items: [
        {
          kind: "checkitem",
          id: "ci-reminder",
          name: "Plan launch",
          state: "incomplete",
          due: tomorrow.toISOString(),
          dueReminder: 1440,
        },
      ],
      memberCards: [],
    };

    api.withRemindersExpanded(source);
    const firstIds = source.items.map((item) => item.id);
    api.withRemindersExpanded(source);
    assert.deepEqual(source.items.map((item) => item.id), firstIds);
    assert.equal(source.items.filter((item) => item.kind === "reminder").length, 1);
  });
});

describe("incremental board merge", () => {
  it("replaces refreshed boards without discarding untouched boards", () => {
    const source = {
      items: [
        { id: "old-a", boardId: "a" },
        { id: "keep-b", boardId: "b" },
      ],
      memberCards: [],
      members: [],
      labels: [],
      lists: [],
    };
    const slice = {
      scannedBoardIds: ["a"],
      items: [{ id: "new-a", boardId: "a" }],
      memberCards: [],
      members: [],
      labels: [],
      lists: [],
    };

    api.mergeBoardSlice(source, slice);
    assert.deepEqual(
      source.items.map((item) => item.id).sort(),
      ["keep-b", "new-a"]
    );
  });
});

describe("applyCardRefresh", () => {
  function baseSource() {
    return {
      me: { id: "me1", fullName: "Me" },
      members: [{ id: "me1", fullName: "Me" }],
      items: [
        {
          kind: "checkitem",
          id: "ci1",
          cardId: "card1",
          boardId: "board1",
          boardName: "Board",
          name: "Task",
          state: "incomplete",
          idMember: "me1",
        },
      ],
      memberCards: [
        {
          kind: "card",
          id: "mc1",
          cardId: "card1",
          boardId: "board1",
          boardName: "Board",
          name: "Card",
          state: "incomplete",
        },
      ],
      lists: [],
      labels: [],
    };
  }

  it("does not delete rows when fetchFailed is set", () => {
    const source = baseSource();
    const stats = api.applyCardRefresh(source, "card1", null, {
      fetchFailed: true,
    });
    assert.equal(stats.skipped, 1);
    assert.equal(source.items.length, 1);
    assert.equal(source.memberCards.length, 1);
  });

  it("removes rows when card is closed", () => {
    const source = baseSource();
    const stats = api.applyCardRefresh(source, "card1", {
      id: "card1",
      closed: true,
    });
    assert.ok(stats.removed >= 2);
    assert.equal(source.items.length, 0);
    assert.equal(source.memberCards.length, 0);
  });

  it("removes rows on null fresh (404 path)", () => {
    const source = baseSource();
    const stats = api.applyCardRefresh(source, "card1", null);
    assert.ok(stats.removed >= 2);
    assert.equal(source.items.length, 0);
  });

  it("normalizes sentinel idMember values", () => {
    const source = baseSource();
    api.applyCardRefresh(source, "card1", {
      id: "card1",
      closed: false,
      idMembers: ["me1"],
      idList: null,
      labels: [],
      checklists: [
        {
          id: "cl1",
          name: "Tasks",
          checkItems: [
            {
              id: "ci1",
              name: "Task",
              state: "incomplete",
              idMember: "null",
              due: null,
              dueReminder: null,
              pos: 1,
            },
          ],
        },
      ],
    });
    assert.equal(source.items[0].idMember, null);
  });
});
