/**
 * Contrast guarantees for the three ink levels against the panel background.
 * Reads the live values out of css/styles.css so these tests fail the moment
 * anyone retunes the palette below WCAG thresholds, rather than drifting out
 * of sync with a hard-coded copy of the numbers.
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { ratio, resolveRgb, token } from "./contrast.mjs";

const css = readFileSync(new URL("../css/styles.css", import.meta.url), "utf8");
const panel = resolveRgb(css, "panel");

function assertRatio(name, min) {
  const fg = resolveRgb(css, name);
  const r = ratio(fg, panel);
  assert.ok(r >= min, `--${name} on --panel is ${r.toFixed(2)}:1, want >= ${min}`);
}

test("--ink on --panel meets 7:1", () => {
  assertRatio("ink", 7);
});

test("--ink-2 on --panel meets 4.5:1", () => {
  assertRatio("ink-2", 4.5);
});

test("--ink-3 on --panel meets 4.5:1", () => {
  assertRatio("ink-3", 4.5);
});
