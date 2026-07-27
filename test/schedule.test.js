/**
 * Locks the crop schedule (names, category indices, window tuples) against
 * `test/fixtures/crop-schedule.json` so a prose-only edit to notes elsewhere
 * cannot silently change a fact. To add or resize a crop on purpose, edit
 * `js/data/philadelphia.js` first, then run `npm run fixture:update` to
 * re-lock the fixture, and commit the regenerated file alongside the change.
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { philadelphia } from "../js/data/philadelphia.js";

const expected = JSON.parse(readFileSync(new URL("./fixtures/crop-schedule.json", import.meta.url)));

test("crop count is unchanged", () => {
  // Cheap fail-fast check: a length mismatch here is faster to read than the
  // per-crop diff below, and catches an added/removed crop before we bother
  // walking the whole list looking for a coincidental content match.
  assert.equal(philadelphia.crops.length, 127);
});

test("crop names, categories and windows are unchanged", () => {
  const actual = philadelphia.crops.map(([name, cat, windows]) => ({ name, cat, windows }));
  expected.forEach((exp, i) => {
    assert.deepEqual(actual[i], exp, `crop #${i} (${exp.name}) changed`);
  });
});

test("every crop has a non-empty note", () => {
  for (const [name, , , note] of philadelphia.crops) {
    assert.equal(typeof note, "string", `${name} note must be a string`);
    assert.ok(note.trim().length > 0, `${name} note must not be empty`);
  }
});

test("every category index resolves", () => {
  for (const [name, cat] of philadelphia.crops) {
    assert.ok(philadelphia.categories[cat], `${name} has unknown category ${cat}`);
  }
});

test("every window is a valid week range", () => {
  for (const [name, , windows] of philadelphia.crops) {
    for (const [s, e, k] of windows) {
      assert.ok(s >= 1 && s <= 52, `${name}: bad start ${s}`);
      assert.ok(e >= 1 && e <= 52, `${name}: bad end ${e}`);
      assert.ok(s <= e, `${name}: reversed window ${s}-${e}`);
      assert.ok(["s", "p", "t"].includes(k), `${name}: bad kind ${k}`);
    }
  }
});
