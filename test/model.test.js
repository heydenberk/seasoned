import { test } from "node:test";
import assert from "node:assert/strict";
import { buildItems } from "../js/model.js";

test("peak outranks available outranks storage in the same week", () => {
  const [item] = buildItems([["Test", 0, [[1, 10, "t"], [3, 8, "s"], [5, 6, "p"]], "note"]]);
  assert.equal(item.byWeek[2], 1, "storage only");
  assert.equal(item.byWeek[4], 2, "available beats storage");
  assert.equal(item.byWeek[5], 3, "peak beats available");
  assert.equal(item.byWeek[11], 0, "outside every window");
});

test("start ignores storage windows when fresh windows exist", () => {
  const [item] = buildItems([["Test", 0, [[40, 52, "t"], [20, 25, "s"]], "note"]]);
  assert.equal(item.start, 20);
});

test("start falls back to storage when that is all there is", () => {
  const [item] = buildItems([["Storage onions", 2, [[34, 52, "t"], [1, 14, "t"]], "note"]]);
  assert.equal(item.start, 1);
});

test("peakStart is 99 when a crop never peaks", () => {
  const [item] = buildItems([["Test", 0, [[1, 5, "s"]], "note"]]);
  assert.equal(item.peakStart, 99);
});

test("two harvests both register", () => {
  const [item] = buildItems([["Radishes", 2, [[14, 24, "s"], [35, 46, "s"]], "note"]]);
  assert.equal(item.byWeek[20], 2);
  assert.equal(item.byWeek[30], 0, "gap between harvests");
  assert.equal(item.byWeek[40], 2);
});

test("ids are assigned in source order", () => {
  const items = buildItems([["A", 0, [[1, 2, "s"]], "n"], ["B", 0, [[1, 2, "s"]], "n"]]);
  assert.deepEqual(items.map(i => i.id), [0, 1]);
});
