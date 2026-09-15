const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

function loadDates() {
  const src = fs.readFileSync(
    path.join(__dirname, "..", "public", "js", "date-utils.js"),
    "utf8"
  );
  const sandbox = { Date };
  sandbox.window = sandbox;
  vm.runInNewContext(src, sandbox, { filename: "date-utils.js" });
  return sandbox.ChecklistHubDates;
}

describe("nextCalendarDay", () => {
  it("treats Saturday as tomorrow after Friday", () => {
    const dates = loadDates();
    const friday = new Date(2026, 8, 18, 16, 30);
    const tomorrow = dates.nextCalendarDay(friday);
    assert.equal(tomorrow.getFullYear(), 2026);
    assert.equal(tomorrow.getMonth(), 8);
    assert.equal(tomorrow.getDate(), 19);
    assert.equal(tomorrow.getDay(), 6);
  });
});
