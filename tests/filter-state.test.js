const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

function root(checked, total) {
  const selected = (checked || []).map((value) => ({ value }));
  return {
    querySelectorAll(selector) {
      if (selector.includes(":checked")) return selected;
      return new Array(total == null ? selected.length : total).fill({});
    },
  };
}

function loadFilterState() {
  const src = fs.readFileSync(
    path.join(__dirname, "..", "public", "js", "filter-state.js"),
    "utf8"
  );
  const sandbox = {};
  sandbox.window = sandbox;
  vm.runInNewContext(src, sandbox, { filename: "filter-state.js" });
  return sandbox.ChecklistHubFilterState;
}

describe("filter-state snapshot", () => {
  it("captures DOM selections once into plain values", () => {
    const helper = loadFilterState();
    const result = helper.capture({
      people: ["me"],
      boardRoot: root(["b1"], 3),
      labelRoot: root(["urgent"]),
      listRoot: root([]),
      dueInput: { value: "today" },
      searchInput: { value: " Launch " },
      hideCompleted: true,
      view: "list",
    });

    assert.deepEqual(Array.from(result.people), ["me"]);
    assert.deepEqual(Array.from(result.boards), ["b1"]);
    assert.equal(result.boardOptionCount, 3);
    assert.equal(result.due, "today");
    assert.equal(result.search, "launch");
    assert.equal(result.hideCompleted, true);
  });
});
