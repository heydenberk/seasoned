/**
 * Contrast guarantees for the three ink levels against the panel background.
 * Reads the live values out of css/styles.css so these tests fail the moment
 * anyone retunes the palette below WCAG thresholds, rather than drifting out
 * of sync with a hard-coded copy of the numbers.
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { over, ratio, resolveRgb, token } from "./contrast.mjs";
import { philadelphia } from "../js/data/philadelphia.js";

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

/* ---------------------------------------------------------------------------
 * The eight category hues.
 *
 * Each hue is used in two opposing directions, which is what makes the band of
 * legal values narrow:
 *
 *   .chip          10.5px text in rgb(var(--rgb)) on rgba(var(--rgb),.08) —
 *                  the hue must read as small text on a near-panel background;
 *   .chip.is-peak  the same chip inverted, background:rgb(var(--rgb)) with
 *                  color:var(--panel) — the hue must also be dark enough for
 *                  panel-coloured text to read on top of it.
 *
 * Both directions are asserted at the WCAG normal-text floor of 4.5:1. The
 * chip-tint direction is the tighter of the two (the 8% tint darkens the
 * background slightly), so a hue that clears it clears the panel too, but both
 * are asserted because they are separate product guarantees.
 *
 * Distinguishability uses OKLab ΔE (Euclidean, ×100) rather than Euclidean
 * distance in sRGB, which is not perceptually uniform, and the pairs are also
 * measured under protanopia and deuteranopia simulated with Machado, Oliveira &
 * Fernandes (2009) at severity 1.0 — the model the ΔE thresholds are calibrated
 * against. All 28 pairs are checked, not just the pairs that happen to be
 * adjacent in display order: the chip ticker interleaves categories in crop
 * order, so any two hues can end up side by side.
 * ------------------------------------------------------------------------- */

const CHIP_ALPHA = 0.08;   // .chip background:rgba(var(--rgb),.08)
const TEXT_MIN = 4.5;      // WCAG normal text
/* OKLab ΔE×100 floors, all-pairs. 6 is the documented floor for simulated
   dichromacy, legal only alongside secondary encoding — which this UI always
   has: every row carries its crop name, every chip *is* a crop name, and every
   pill and group heading carries the category name, so colour is never the only
   identity channel. 12 is the normal-vision floor: the usual 15 is unreachable
   for eight fixed hues that must also clear 4.5:1 twice (that caps OKLCH L at
   ≈0.53, and eight hues below it cannot all sit 15 apart without collapsing
   under simulated dichromacy instead). */
const DE_CVD_MIN = 6;
const DE_NORMAL_MIN = 12;

const categories = philadelphia.categories;

/** Parse the load-bearing `"r,g,b"` string the chart interpolates into --rgb. */
function parseRgb(value) {
  assert.match(String(value), /^\d{1,3},\d{1,3},\d{1,3}$/,
    `category rgb must stay a bare "r,g,b" string, got ${JSON.stringify(value)}`);
  const channels = value.split(",").map(n => Number(n));
  for (const c of channels) {
    assert.ok(c >= 0 && c <= 255, `category rgb channel out of range in "${value}"`);
  }
  return channels;
}

/* Linear-light sRGB, then OKLab. This is a different transfer path from the
   WCAG luminance in contrast.mjs (which weights the linear channels), so the
   conversion lives here rather than being folded into that helper. */
const toLinear = c => {
  const s = c / 255;
  return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
};
const linearRgb = ([r, g, b]) => [toLinear(r), toLinear(g), toLinear(b)];

function oklabFromLinear([r, g, b]) {
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [
    0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s
  ];
}

/** Machado, Oliveira & Fernandes (2009), severity 1.0, applied in linear RGB. */
const CVD = {
  protanopia: [[0.152286, 1.052583, -0.204868],
               [0.114503, 0.786281, 0.099216],
               [-0.003882, -0.048116, 1.051998]],
  deuteranopia: [[0.367322, 0.860646, -0.227968],
                 [0.280085, 0.672501, 0.047413],
                 [-0.011820, 0.042940, 0.968881]]
};

function oklab(rgb, deficiency) {
  const linear = linearRgb(rgb);
  if (!deficiency) return oklabFromLinear(linear);
  return oklabFromLinear(CVD[deficiency].map(row =>
    Math.min(1, Math.max(0, row[0] * linear[0] + row[1] * linear[1] + row[2] * linear[2]))));
}

/** Euclidean distance in OKLab, ×100. */
function deltaE(a, b, deficiency) {
  const [l1, a1, b1] = oklab(a, deficiency);
  const [l2, a2, b2] = oklab(b, deficiency);
  return 100 * Math.hypot(l1 - l2, a1 - a2, b1 - b2);
}

test("every category hue reads as chip text on its own 8% tint", () => {
  const failures = [];
  for (const { id, rgb } of categories) {
    const hue = parseRgb(rgb);
    const r = ratio(hue, over(hue, panel, CHIP_ALPHA));
    if (r < TEXT_MIN) failures.push(`${id} (${rgb}) is ${r.toFixed(2)}:1`);
  }
  assert.deepEqual(failures, [],
    `category hues below ${TEXT_MIN}:1 as .chip text on rgba(hue,.08) over --panel:\n  ${failures.join("\n  ")}`);
});

test("every category hue is dark enough for --panel text on a filled peak chip", () => {
  const failures = [];
  for (const { id, rgb } of categories) {
    const r = ratio(parseRgb(rgb), panel);
    if (r < TEXT_MIN) failures.push(`${id} (${rgb}) is ${r.toFixed(2)}:1`);
  }
  assert.deepEqual(failures, [],
    `category hues below ${TEXT_MIN}:1 against --panel, so .chip.is-peak text cannot read:\n  ${failures.join("\n  ")}`);
});

test("the eight category hues stay mutually distinguishable", () => {
  assert.equal(categories.length, 8, "the palette is specified for exactly eight categories");
  const failures = [];
  for (let i = 0; i < categories.length; i++) {
    for (let j = i + 1; j < categories.length; j++) {
      const a = categories[i], b = categories[j];
      const [ra, rb] = [parseRgb(a.rgb), parseRgb(b.rgb)];
      const pair = `${a.id}/${b.id}`;

      const normal = deltaE(ra, rb);
      if (normal < DE_NORMAL_MIN) {
        failures.push(`${pair}: ΔE ${normal.toFixed(1)} normal vision, want >= ${DE_NORMAL_MIN}`);
      }
      for (const deficiency of Object.keys(CVD)) {
        const d = deltaE(ra, rb, deficiency);
        if (d < DE_CVD_MIN) {
          failures.push(`${pair}: ΔE ${d.toFixed(1)} under ${deficiency}, want >= ${DE_CVD_MIN}`);
        }
      }
    }
  }
  assert.deepEqual(failures, [],
    `category hue pairs too close in OKLab:\n  ${failures.join("\n  ")}`);
});
