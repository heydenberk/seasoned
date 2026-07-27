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

/* The original 127 notes all executed one template: orienting fact, turn,
   closing aphorism. Identical endings are the cheapest detectable symptom of
   that template coming back. */
test("no two notes share a closing five words", () => {
  const seen = new Map();
  for (const [name, , , note] of philadelphia.crops) {
    const tail = note.toLowerCase().replace(/[^a-z0-9\s]/g, "").trim().split(/\s+/).slice(-5).join(" ");
    if (tail.split(" ").length < 5) continue;
    assert.ok(!seen.has(tail), `${name} ends like ${seen.get(tail)}: "${tail}"`);
    seen.set(tail, name);
  }
});

/* Length uniformity was the tell, more than any word choice. But counting how
   many notes clear a threshold is the wrong guard: writing to a >200 gate
   produced a corpus with nothing at all between 150 and 237 characters, which
   is its own kind of uniformity. Assert the distribution has no large hole in
   it instead. */
test("note length has no large gap in its distribution", () => {
  const lens = philadelphia.crops.map(([, , , note]) => note.length).sort((a, b) => a - b);
  let worst = { gap: 0, at: null };
  for (let i = 1; i < lens.length; i++) {
    const gap = lens[i] - lens[i - 1];
    if (gap > worst.gap) worst = { gap, at: `${lens[i - 1]} -> ${lens[i]}` };
  }
  assert.ok(worst.gap <= 60, `${worst.gap}-char hole in the length distribution at ${worst.at}`);
  assert.ok(lens[0] < 50, `shortest note is ${lens[0]} chars; nothing is genuinely clipped`);
  assert.ok(lens[lens.length - 1] > 250, `longest note is ${lens[lens.length - 1]} chars; nothing runs long`);
});
