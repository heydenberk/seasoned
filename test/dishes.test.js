/**
 * Covers `resolveDishes` binding dish crop names to items (including the
 * unknown-reference error) and `rankDishes` ordering by rarity — how few
 * weeks a dish is cookable in — with peak share as a tiebreaker, a week
 * filter for non-cookable dishes, and a stable, deterministic sort.
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { buildItems } from "../js/model.js";
import { resolveDishes, rankDishes } from "../js/dishes.js";

const items = buildItems([
  ["Yearround", 0, [[1, 52, "t"]], "n"],
  ["Summer", 0, [[26, 30, "s"], [27, 29, "p"]], "n"],
  ["Autumn", 0, [[40, 46, "s"], [41, 44, "p"]], "n"],
  ["Wide", 0, [[10, 45, "s"]], "n"]
]);

test("resolveDishes throws on an unknown crop", () => {
  assert.throws(
    () => resolveDishes([{ name: "Bad", note: "", needs: ["Nope"], nice: [] }], items),
    /Bad.*Nope/
  );
});

test("a year-round dish has rarity 0", () => {
  const [d] = resolveDishes([{ name: "Pantry", note: "", needs: ["Yearround"], nice: [] }], items);
  assert.equal(d.cookableWeeks.size, 52);
  assert.equal(d.rarity, 0);
});

test("a short-window dish has high rarity", () => {
  const [d] = resolveDishes([{ name: "Brief", note: "", needs: ["Summer"], nice: [] }], items);
  assert.equal(d.cookableWeeks.size, 5);
  assert.ok(d.rarity > 0.9, `rarity was ${d.rarity}`);
});

test("needs are satisfied by storage, not only fresh", () => {
  const [d] = resolveDishes([{ name: "Pantry", note: "", needs: ["Yearround"], nice: [] }], items);
  assert.ok(d.cookableWeeks.has(5), "week 5 is storage-only and must still count");
});

test("rarity beats a merely-available dish", () => {
  const resolved = resolveDishes([
    { name: "Wide dish", note: "", needs: ["Wide"], nice: [] },
    { name: "Brief dish", note: "", needs: ["Summer"], nice: [] }
  ], items);
  const ranked = rankDishes(resolved, 28, 4);
  assert.equal(ranked[0].name, "Brief dish");
});

test("dishes that are not cookable this week are excluded", () => {
  const resolved = resolveDishes([
    { name: "Autumn dish", note: "", needs: ["Autumn"], nice: [] }
  ], items);
  assert.equal(rankDishes(resolved, 28, 4).length, 0);
  assert.equal(rankDishes(resolved, 42, 4).length, 1);
});

test("peak share breaks ties between equally rare dishes", () => {
  const local = buildItems([
    ["A", 0, [[26, 30, "s"], [27, 29, "p"]], "n"],
    ["B", 0, [[26, 30, "s"]], "n"]
  ]);
  const resolved = resolveDishes([
    { name: "With peak", note: "", needs: ["A"], nice: [] },
    { name: "No peak", note: "", needs: ["B"], nice: [] }
  ], local);
  assert.equal(rankDishes(resolved, 28, 4)[0].name, "With peak");
});

test("ranking is stable across calls", () => {
  const resolved = resolveDishes([
    { name: "One", note: "", needs: ["Wide"], nice: [] },
    { name: "Two", note: "", needs: ["Wide"], nice: [] }
  ], items);
  const a = rankDishes(resolved, 20, 4).map(d => d.name);
  const b = rankDishes(resolved, 20, 4).map(d => d.name);
  assert.deepEqual(a, b);
  assert.deepEqual(a, ["One", "Two"], "equal scores fall back to name order");
});

test("limit is respected", () => {
  const resolved = resolveDishes(
    ["a", "b", "c", "d", "e"].map(n => ({ name: n, note: "", needs: ["Wide"], nice: [] })),
    items
  );
  assert.equal(rankDishes(resolved, 20, 4).length, 4);
});

/* An empty `needs` is almost always an author who forgot the ingredients, and
   accepting it silently would rank the dish as cookable all year. Refused for
   the same reason an unresolved crop name is refused. */
test("a dish with no required ingredients is refused", () => {
  assert.throws(
    () => resolveDishes([{ name: "Empty", note: "", needs: [], nice: [] }], items),
    /Empty.*no needs/
  );
});

test("a dish with a missing needs field is refused", () => {
  assert.throws(
    () => resolveDishes([{ name: "Absent", note: "", nice: [] }], items),
    /Absent.*no needs/
  );
});

test("nice ingredients raise peak share without gating cookability", () => {
  const local = buildItems([
    ["Base", 0, [[1, 52, "t"]], "n"],
    ["Garnish", 0, [[26, 30, "s"], [27, 29, "p"]], "n"]
  ]);
  const resolved = resolveDishes([
    { name: "With garnish", note: "", needs: ["Base"], nice: ["Garnish"] },
    { name: "Without garnish", note: "", needs: ["Base"], nice: [] }
  ], local);

  // The garnish is only "nice", so its absence outside weeks 26-30 must
  // not make the dish uncookable.
  const [withGarnish] = resolved;
  assert.ok(withGarnish.cookableWeeks.has(5), "cookable even when the garnish is out of season");
  assert.equal(withGarnish.cookableWeeks.size, 52);

  // But when the garnish is at peak, it should tip the score above the
  // otherwise-identical dish that has no nice ingredient at all.
  assert.equal(rankDishes(resolved, 28, 4)[0].name, "With garnish");
});
