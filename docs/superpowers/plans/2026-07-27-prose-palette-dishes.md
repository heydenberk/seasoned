# Prose, Palette and Dish Suggestions Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers-extended-cc:subagent-driven-development (recommended) or superpowers-extended-cc:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rewrite the site's prose to break its uniform machine-written metre, move the palette to warm paper with brown chrome over green ink, and add week-aware dish suggestions ranked by how briefly each dish is cookable.

**Architecture:** Three independent workstreams against a static ES-module site. A `node --test` harness is added first, because it is what makes the prose rewrite safe — it locks the crop schedule data so a 127-note rewrite cannot silently nudge a week number. Palette work is split into a value-preserving tokenisation refactor followed by a colour change, so any visual regression is attributable to one commit. Dish scoring is pure logic in its own module, tested without a browser.

**Tech Stack:** Vanilla ES modules, no build step. `node --test` (Node 20 built-in, zero dependencies) for unit tests. Chrome via MCP for visual and interaction verification. GitHub Pages for deploy.

**Spec:** `docs/superpowers/specs/2026-07-27-prose-palette-dishes-design.md`

---

### Task 0: Test harness and data lock

**Goal:** A zero-dependency test runner, plus a fixture that freezes the crop schedule so later prose edits cannot change facts.

**Files:**
- Create: `package.json`
- Create: `test/fixtures/crop-schedule.json`
- Create: `test/schedule.test.js`
- Create: `test/model.test.js`
- Modify: `.gitignore`

**Acceptance Criteria:**
- [ ] `npm test` runs with no network access and no `node_modules`
- [ ] A test fails if any crop name, category index, or window tuple changes
- [ ] A test fails if the crop count moves off 127
- [ ] `buildItems` behaviour is covered for peak/available/storage levels and for the two-harvest case

**Verify:** `cd ~/git/seasoned && npm test` → all tests pass, non-zero test count

**Steps:**

- [ ] **Step 1: Add package.json**

`type: module` lets `node --test` load the site's ES modules directly. There are no dependencies and no build.

```json
{
  "name": "seasoned",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "description": "Interactive seasonality chart",
  "scripts": {
    "test": "node --test test/"
  }
}
```

- [ ] **Step 2: Generate the schedule fixture**

This locks names, category indices and window tuples — everything except the notes, which are what Tasks 1–3 rewrite.

Run:

```bash
cd ~/git/seasoned && node --input-type=module -e '
import { philadelphia } from "./js/data/philadelphia.js";
import { writeFileSync } from "node:fs";
const schedule = philadelphia.crops.map(([name, cat, windows]) => ({ name, cat, windows }));
writeFileSync("test/fixtures/crop-schedule.json", JSON.stringify(schedule, null, 1) + "\n");
console.log("locked", schedule.length, "crops");
'
```

Expected: `locked 127 crops`

- [ ] **Step 3: Write the schedule lock test**

```js
// test/schedule.test.js
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { philadelphia } from "../js/data/philadelphia.js";

const expected = JSON.parse(readFileSync(new URL("./fixtures/crop-schedule.json", import.meta.url)));

test("crop count is unchanged", () => {
  assert.equal(philadelphia.crops.length, 127);
});

test("crop names, categories and windows are unchanged", () => {
  const actual = philadelphia.crops.map(([name, cat, windows]) => ({ name, cat, windows }));
  assert.deepEqual(actual, expected);
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
```

- [ ] **Step 4: Write the model test**

```js
// test/model.test.js
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
```

- [ ] **Step 5: Run the tests**

Run: `cd ~/git/seasoned && npm test`
Expected: PASS, 11 tests, 0 failures

- [ ] **Step 6: Commit**

```bash
cd ~/git/seasoned
git add package.json test/ .gitignore
git commit -m "Add a test harness and lock the crop schedule

node --test with no dependencies. The schedule fixture freezes crop names,
category indices and window tuples so the prose rewrite that follows cannot
change a fact while changing a sentence.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 1: Rewrite the frame prose

**Goal:** Masthead, footer and legend read as written by a person.

**Files:**
- Modify: `index.html:16-27` (masthead), `index.html:81-116` (legend and footer)
- Modify: `js/chart.js` (the empty-state string)
- Modify: `js/reader.js` (the storage-only chips note)

**Acceptance Criteria:**
- [ ] Deck, eyebrow and `h1` rewritten; the four meta-rail facts unchanged in value
- [ ] Footer's three columns and closing caveat rewritten
- [ ] Legend labels reviewed; the "Drag the reader, or use the ← → keys" hint rewritten
- [ ] The two strings living in JS are rewritten too: `"Nothing matches. Clear the search, or switch a kind back on."` in `chart.js`, and `"Cellar and cold storage only this week — look for the dotted rails."` in `reader.js`
- [ ] Market names, days and locations unchanged — those are facts
- [ ] No sentence in the footer prose ends on an aphorism that adds no information
- [ ] `npm test` still passes

**Verify:** `cd ~/git/seasoned && npm test && grep -c 'Headhouse\|Clark Park\|Fair Food\|Rittenhouse\|9th Street' index.html` → tests pass, count ≥ 5

**Steps:**

- [ ] **Step 1: Read the current frame copy**

Read `index.html` lines 16–27 and 81–116. Note that the footer's "Four dates that run the year" column is the most template-driven part of the page: four paragraphs, each opening with a bolded time marker and closing on a flourish.

Two more strings live in JS rather than markup and are easy to miss:

```bash
cd ~/git/seasoned && grep -n 'Nothing matches\|Cellar and cold storage' js/chart.js js/reader.js
```

- [ ] **Step 2: Rewrite, applying the metre rules**

Apply the rules from the spec: vary length hard, cut most kickers, thin em-dashes, cut intensifiers, vary sentence openings. Specifics for this section:

- The four dated paragraphs must not all be the same length. Let one run to four sentences and one be a single clause.
- "The whole list." and similar closing fragments are the exact tic being removed. At most one survives in the whole footer.
- Keep every proper noun, day, and location string byte-identical.

- [ ] **Step 3: Verify the facts survived**

Run:

```bash
cd ~/git/seasoned && grep -o '7a–7b\|Apr 12\|Nov 2\|200 days\|Headhouse Farmers Market\|Clark Park\|Fair Food Farmstand\|Rittenhouse Square\|9th Street Italian Market' index.html | sort | uniq -c
```

Expected: each string present at least once.

- [ ] **Step 4: Run tests and view the page**

Run: `cd ~/git/seasoned && npm test`
Expected: PASS

Then serve and screenshot the masthead and footer to confirm nothing broke structurally:

```bash
cd ~/git/seasoned && python3 -m http.server 8731
```

- [ ] **Step 5: Commit**

```bash
cd ~/git/seasoned
git add index.html js/chart.js js/reader.js
git commit -m "Rewrite the masthead and footer prose

Breaks the uniform two-sentence rhythm in the footer's dated paragraphs and
cuts the closing flourishes. Facts, market names and dates are unchanged.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 2: Rewrite crop notes — fruit, vine, roots

**Goal:** The first 63 crop notes lose the template.

**Files:**
- Modify: `js/data/philadelphia.js` (crop rows for categories 0, 1, 2 — fruit, vine, roots)

**Acceptance Criteria:**
- [ ] All 63 notes in categories 0–2 rewritten
- [ ] Within this group: at least 6 notes over 200 characters, at least 6 under 45 characters
- [ ] Em-dashes in under 8% of the group's notes
- [ ] At most 3 notes in the group end on imperative advice
- [ ] `npm test` passes — proving no window, name or category changed

**Verify:** `cd ~/git/seasoned && npm test && node scripts/prose-stats.mjs 0 2` → tests pass; distribution within targets

**Steps:**

- [ ] **Step 1: Write the prose statistics script**

This is the measuring instrument for Tasks 2 and 3. It takes an inclusive range of category indices.

```js
// scripts/prose-stats.mjs
import { philadelphia } from "../js/data/philadelphia.js";

const from = Number(process.argv[2] ?? 0);
const to = Number(process.argv[3] ?? philadelphia.categories.length - 1);
const notes = philadelphia.crops.filter(([, cat]) => cat >= from && cat <= to).map(r => r[3]);
const n = notes.length;
const lens = notes.map(s => s.length).sort((a, b) => a - b);
const count = re => notes.filter(s => re.test(s)).length;
const pct = c => Math.round((c / n) * 100);

const long = lens.filter(l => l > 200).length;
const short = lens.filter(l => l < 45).length;
const dash = count(/—/);
const imper = count(/(^|\. )(Buy|Take|Keep|Smell|Grate|Wait|Peel|Cut|Make|Look|Sow|Treat|Double|Eat|Cook|Ask)\b[^.]*\.?$/);
const intens = count(/\b(genuinely|entirely|wildly|extraordinar|aggressively|frankly|absolutely|utterly|truly|completely|considerably|measurably|magnificent|superb|excellent)/i);

console.log(`categories ${from}-${to}: ${n} notes`);
console.log(`  length      min ${lens[0]}  p10 ${lens[Math.floor(n * 0.1)]}  median ${lens[n >> 1]}  p90 ${lens[Math.floor(n * 0.9)]}  max ${lens[n - 1]}`);
console.log(`  over 200ch  ${long}   (target >= 6 per half)`);
console.log(`  under 45ch  ${short}   (target >= 6 per half)`);
console.log(`  em-dash     ${dash} (${pct(dash)}%)  (target < 8%)`);
console.log(`  imperative  ${imper}   (target <= 3 per half)`);
console.log(`  intensifier ${intens} (${pct(intens)}%)  (target < 4%)`);
```

- [ ] **Step 2: Baseline the current numbers**

Run: `cd ~/git/seasoned && node scripts/prose-stats.mjs 0 2`
Expected: shows the current tight distribution — median near 95, nothing over 200, nothing under 45.

- [ ] **Step 3: Rewrite the notes**

Edit only the fourth element of each crop tuple in categories 0, 1 and 2. Do not touch names, category indices or window arrays.

Guidance, beyond the metre rules:

- Entries that earn length: Apples (storage varieties and why they matter), Figs (the South Philly tarpaper trees), Pawpaw (why it never reaches a supermarket), Blueberries (Hammonton), Carrots (frost converting starch), Parsnips (overwintering).
- Entries that should be very short: Nectarines, Apricots, Watermelon, Edamame, Fresh onions, Shallots.
- Do not open more than a third of the notes with a bare noun phrase.

- [ ] **Step 4: Measure**

Run: `cd ~/git/seasoned && node scripts/prose-stats.mjs 0 2`
Expected: over-200 ≥ 6, under-45 ≥ 6, em-dash < 8%, imperative ≤ 3, intensifier < 4%

If a target is missed, keep editing. The numbers are the acceptance criteria, not a suggestion.

- [ ] **Step 5: Prove no facts moved**

Run: `cd ~/git/seasoned && npm test`
Expected: PASS — in particular `crop names, categories and windows are unchanged`

- [ ] **Step 6: Commit**

```bash
cd ~/git/seasoned
git add js/data/philadelphia.js scripts/prose-stats.mjs
git commit -m "Rewrite the fruit, vine and root crop notes

Breaks the uniform two-sentence metre: some entries now run long where there
is history to tell, others are a single clause. Most closing aphorisms are
cut. Schedule data is untouched and the lock test proves it.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 3: Rewrite crop notes — greens, brassicas, herbs, fungi, water

**Goal:** The remaining 64 crop notes lose the template.

**Files:**
- Modify: `js/data/philadelphia.js` (crop rows for categories 3–7)

**Acceptance Criteria:**
- [ ] All 64 notes in categories 3–7 rewritten
- [ ] Within this group: at least 6 notes over 200 characters, at least 6 under 45 characters
- [ ] Em-dashes in under 8% of the group's notes
- [ ] At most 3 notes in the group end on imperative advice
- [ ] Across the whole file: no two notes share an identical closing five words
- [ ] `npm test` passes

**Verify:** `cd ~/git/seasoned && npm test && node scripts/prose-stats.mjs 3 7 && node scripts/prose-stats.mjs 0 7`

**Steps:**

- [ ] **Step 1: Baseline**

Run: `cd ~/git/seasoned && node scripts/prose-stats.mjs 3 7`

- [ ] **Step 2: Rewrite the notes**

Same rules. Guidance for this half:

- Entries that earn length: Shad (the Delaware run and colonial Philadelphia), Cultivated mushrooms (Kennett Square), Broccoli rabe (the sandwich), Cardoons (9th Street), Delaware Bay oysters (the R-months rule and farmed stock), Ramps (over-harvesting).
- Entries that should be very short: Sorrel, Bok choy, Kohlrabi, Napa cabbage, Tarragon, Hard clams.
- The "From the Water" notes currently all follow one shape — species, place, then a judgement. Break that specifically.

- [ ] **Step 3: Add the repeated-ending check to the test suite**

```js
// append to test/schedule.test.js
test("no two notes share a closing five words", () => {
  const seen = new Map();
  for (const [name, , , note] of philadelphia.crops) {
    const tail = note.toLowerCase().replace(/[^a-z0-9\s]/g, "").trim().split(/\s+/).slice(-5).join(" ");
    if (tail.split(" ").length < 5) continue;
    assert.ok(!seen.has(tail), `${name} ends like ${seen.get(tail)}: "${tail}"`);
    seen.set(tail, name);
  }
});
```

- [ ] **Step 4: Measure both halves and the whole**

Run:

```bash
cd ~/git/seasoned && node scripts/prose-stats.mjs 3 7 && node scripts/prose-stats.mjs 0 7
```

Expected: this half within targets, and the whole-file line showing a genuinely wide spread — min under 45, max over 200.

- [ ] **Step 5: Run tests**

Run: `cd ~/git/seasoned && npm test`
Expected: PASS, including the new closing-five-words test

- [ ] **Step 6: Commit**

```bash
cd ~/git/seasoned
git add js/data/philadelphia.js test/schedule.test.js
git commit -m "Rewrite the greens, brassica, herb, fungi and seafood notes

Completes the prose pass. Adds a test asserting no two notes end on the same
five words, which is the cheapest available guard against the template
reasserting itself.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 4: Tokenise the hardcoded colours

**Goal:** Every colour in `css/styles.css` comes from a variable. No visual change whatsoever.

**Files:**
- Modify: `css/styles.css` (`:root` block at lines 1–16, then lines 26, 27, 131, 148, 150, 151, 152, 165, 167, 173, 201, 215, 234, 235, 236)

**Acceptance Criteria:**
- [ ] No colour literal outside the `:root` block
- [ ] `--ink-rgb` and `--earth-rgb` added; `--panel-3` added
- [ ] Rendered page is visually identical to before the change
- [ ] Marks the eye follows use `--ink-rgb`; surface tints use `--earth-rgb`

**Verify:** `cd ~/git/seasoned && awk '/^}/{r=1} r' css/styles.css | grep -c '#[0-9A-Fa-f]\{6\}\|rgba([0-9]'` → `0`

**Steps:**

- [ ] **Step 1: Add the new tokens to `:root`**

Values are the *current* ones, deliberately. This task must not change appearance.

```css
  --panel-3:#E9EDE2;
  --ink-rgb:19,37,28;
  --earth-rgb:19,37,28;
```

`--earth-rgb` is identical to `--ink-rgb` for now. Task 5 splits them. Introducing the distinction here, with equal values, is what lets Task 5 be a pure value change.

- [ ] **Step 2: Replace the surface tints with `--earth-rgb`**

These tint a surface rather than drawing a line the eye follows:

```css
/* line 26-27, in body background-image */
    linear-gradient(rgba(var(--earth-rgb),.025) 1px, transparent 1px),
    linear-gradient(90deg, rgba(var(--earth-rgb),.025) 1px, transparent 1px);

/* line 131 */
.mon-alt{background:rgba(var(--earth-rgb),.035)}

/* line 148 */
.mband{position:absolute;top:0;bottom:0;background:rgba(var(--earth-rgb),.028)}

/* line 150 */
.fline{position:absolute;top:0;bottom:0;width:0;border-left:1px dashed rgba(var(--earth-rgb),.2)}

/* line 152 */
.selband{position:absolute;top:0;bottom:0;background:rgba(var(--earth-rgb),.07);

/* line 165 */
.row:hover{background:rgba(var(--earth-rgb),.045)}

/* line 167 */
.row.is-active{background:rgba(var(--earth-rgb),.08)}

/* line 215 */
.d-strip .dm{position:absolute;top:0;bottom:0;border-left:1px solid rgba(var(--earth-rgb),.14)}
```

- [ ] **Step 3: Replace the structural marks with `--ink-rgb`**

```css
/* line 15, in --shadow */
  --shadow:0 1px 0 rgba(var(--ink-rgb),.05), 0 16px 40px -24px rgba(var(--ink-rgb),.5);

/* line 151 */
.nowline{position:absolute;top:0;bottom:0;width:0;border-left:1.5px solid rgba(var(--ink-rgb),.45)}

/* line 201 */
.scrim{position:fixed;inset:0;background:rgba(var(--ink-rgb),.34);z-index:60;opacity:0;

/* line 234 */
.lg.s i{height:7px;background:rgba(var(--ink-rgb),.36)}

/* line 235 */
.lg.t i{height:4px;background:repeating-linear-gradient(90deg,rgba(var(--ink-rgb),.5) 0 3px,transparent 3px 7px)}

/* line 236 */
.lg.n i{height:16px;width:0;left:16px;border-left:1.5px solid rgba(var(--ink-rgb),.45)}
```

Note: `--shadow` is declared inside `:root` and references `--ink-rgb`. Declaration *order does not matter* — custom properties resolve at used-value time against the whole cascaded declaration set, not top-to-bottom like Sass variables, so a forward reference within the same rule resolves correctly. Only a true reference cycle fails. Order `:root` for readability, not for resolution.

(An earlier draft of this plan asserted the opposite. It was wrong, and was corrected after a reviewer tested it in Chromium.)

- [ ] **Step 4: Replace the stray hex**

```css
/* line 173 */
.row.is-active .lab{background:var(--panel-3)}
```

- [ ] **Step 5: Verify no literals remain outside :root**

Run:

```bash
cd ~/git/seasoned && awk '/^}/{r=1} r' css/styles.css | grep -n '#[0-9A-Fa-f]\{6\}\|rgba([0-9]'
```

Expected: no output.

- [ ] **Step 6: Verify the page is visually unchanged**

Serve on port 8731, load in Chrome, screenshot, and compare against the screenshot taken before this task. Any visible difference is a bug in this task — the values are identical, so the rendering must be too.

- [ ] **Step 7: Commit**

```bash
cd ~/git/seasoned
git add css/styles.css
git commit -m "Route every colour through a token

Fourteen hardcoded values across seventeen occurrences moved onto variables,
split by role: --ink-rgb for marks the eye follows, --earth-rgb for surface
tints. Both hold the old value, so this changes nothing visually and the
palette change that follows is a pure value edit.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 5: Apply the warm palette

**Goal:** Direction A — brown chrome, green ink, warm light paper.

**Files:**
- Modify: `css/styles.css` (`:root` block only)

**Acceptance Criteria:**
- [ ] Only the `:root` block changes
- [ ] `--earth-rgb` and `--ink-rgb` now differ
- [ ] Body text (`--ink` on `--panel`) meets 7:1; secondary text (`--ink-2`) meets 4.5:1; muted labels (`--ink-3`) meet 4.5:1
- [ ] Bars remain clearly visible against the new panel

**Verify:** `cd ~/git/seasoned && npm test` → the new neutral contrast test passes

**Steps:**

- [ ] **Step 1: Write the contrast helper**

```js
// test/contrast.mjs
export function hexToRgb(hex) {
  const h = hex.replace("#", "");
  return [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16));
}

const toLinear = c => {
  const s = c / 255;
  return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
};

export const luminance = ([r, g, b]) =>
  0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);

export function ratio(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/** Composite `fg` at `alpha` over `bg`. */
export const over = (fg, bg, alpha) => fg.map((c, i) => c * alpha + bg[i] * (1 - alpha));

/** Pull a custom property's value out of the :root block. */
export function token(css, name) {
  const m = css.match(new RegExp(`--${name}\\s*:\\s*([^;]+);`));
  if (!m) throw new Error(`token --${name} not found`);
  return m[1].trim();
}
```

- [ ] **Step 2: Write the neutral contrast test**

```js
// test/palette.test.js
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { hexToRgb, ratio, token } from "./contrast.mjs";

const css = readFileSync(new URL("../css/styles.css", import.meta.url), "utf8");
const panel = hexToRgb(token(css, "panel"));

test("primary ink is comfortably readable on the panel", () => {
  const r = ratio(hexToRgb(token(css, "ink")), panel);
  assert.ok(r >= 7, `--ink on --panel is ${r.toFixed(2)}:1, want >= 7`);
});

test("secondary ink meets AA", () => {
  const r = ratio(hexToRgb(token(css, "ink-2")), panel);
  assert.ok(r >= 4.5, `--ink-2 on --panel is ${r.toFixed(2)}:1, want >= 4.5`);
});

test("muted labels meet AA", () => {
  const r = ratio(hexToRgb(token(css, "ink-3")), panel);
  assert.ok(r >= 4.5, `--ink-3 on --panel is ${r.toFixed(2)}:1, want >= 4.5`);
});
```

- [ ] **Step 3: Run the test against the current palette**

Run: `cd ~/git/seasoned && npm test`
Expected: `--ink-3` likely FAILS at the current `#6E7F74` on `#F5F7F0`. Record the number. If it passes, the bar was already met and the new palette must not regress it.

- [ ] **Step 4: Apply the new values**

Replace the colour declarations in `:root`. Everything else in the block — `--lw`, `--track-min`, `--row-h`, `--pad-r`, `--shadow` — stays.

```css
  --ground:#EAE4D6;
  --ground-2:#DFD8C6;
  --panel:#F7F3E9;
  --panel-2:#F0EBDD;
  --panel-3:#EFE8D8;
  --ink:#1B2E1F;
  --ink-2:#5A4B36;
  --ink-3:#7A6B52;
  --rule:#CFC4AB;
  --rule-2:#E0D8C4;
  --ink-rgb:27,46,31;
  --earth-rgb:90,75,54;
```

`--ink-3` is darkened from the previewed `#8A7A61` to `#7A6B52` to clear 4.5:1. It is used for the meta rail, tick labels and tally captions — all small text, so this matters.

- [ ] **Step 5: Run the contrast test**

Run: `cd ~/git/seasoned && npm test`
Expected: PASS, all three neutral contrast tests

- [ ] **Step 6: Look at it**

Serve on 8731 and screenshot. Confirm: the headline's green/brown split reads well, month bands are visible but not muddy, the "now" line still reads as the strongest vertical mark, and the storage rails are still distinguishable from the background at 4px.

- [ ] **Step 7: Commit**

```bash
cd ~/git/seasoned
git add css/styles.css test/
git commit -m "Move to warm paper with brown chrome

Direction A: green stays the ink, brown takes the chrome, paper warms. Adds
contrast tests for the three ink levels; --ink-3 is darker than the mockup
so small labels clear 4.5:1.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 6: Retune the category colours

**Goal:** Eight botanical hues that sit on warm paper, stay eight-way distinguishable, and are legible as 10.5px text.

**Files:**
- Modify: `js/data/philadelphia.js` (the `categories` array)
- Modify: `test/palette.test.js`

**Acceptance Criteria:**
- [ ] Each hue clears 4.5:1 against the chip background, which is the hue itself at 8% alpha over `--panel`
- [ ] Categories keep their identity: fruit reads red, water reads blue, leaf reads green
- [ ] Eight-way distinguishable, checked under deuteranopia and protanopia simulation
- [ ] Visible at both the 4px storage rail and the 16px peak block

**Verify:** `cd ~/git/seasoned && npm test` → category contrast test passes for all eight

**Steps:**

- [ ] **Step 1: Load the dataviz skill**

These are categorical data colours across 127 rows. Invoke the `dataviz` skill before choosing values — do not pick them by eye.

- [ ] **Step 2: Add the category contrast test**

The two new imports belong at the *top* of `test/palette.test.js` alongside the existing ones, not at the bottom with the new tests. ESM hoists imports so bottom placement would run, but it reads as a mistake.

```js
// add to the imports at the top of test/palette.test.js
import { philadelphia } from "../js/data/philadelphia.js";
import { hexToRgb, ratio, token, over } from "./contrast.mjs";
```

```js
// append the tests to test/palette.test.js
test("every category colour is legible as chip text", () => {
  const failures = [];
  for (const c of philadelphia.categories) {
    const rgb = c.rgb.split(",").map(Number);
    // .chip renders colour:rgb(--rgb) on background:rgba(--rgb,.08) over --panel
    const bg = over(rgb, panel, 0.08);
    const r = ratio(rgb, bg);
    if (r < 4.5) failures.push(`${c.id} ${r.toFixed(2)}:1`);
  }
  assert.deepEqual(failures, [], `categories below 4.5:1 — ${failures.join(", ")}`);
});

test("category colours are mutually distinguishable", () => {
  const cats = philadelphia.categories;
  const tooClose = [];
  for (let i = 0; i < cats.length; i++) {
    for (let j = i + 1; j < cats.length; j++) {
      const a = cats[i].rgb.split(",").map(Number);
      const b = cats[j].rgb.split(",").map(Number);
      const dist = Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
      if (dist < 60) tooClose.push(`${cats[i].id}/${cats[j].id} ${dist.toFixed(0)}`);
    }
  }
  assert.deepEqual(tooClose, [], `too similar — ${tooClose.join(", ")}`);
});
```

- [ ] **Step 3: Run it against the current hues**

Run: `cd ~/git/seasoned && npm test`
Expected: the gold `160,124,44` is the most likely failure. Record which hues fail and by how much.

- [ ] **Step 4: Retune**

Darken and warm the hues as needed to clear the bar while keeping each category's identity. Keep the `"r,g,b"` string format — `chart.js`, `reader.js` and `drawer.js` all interpolate it into `--rgb`.

- [ ] **Step 5: Verify numerically and visually**

Run: `cd ~/git/seasoned && npm test`
Expected: PASS

Then screenshot the page and specifically check the chip ticker, where the colours are used as small text, and the storage rails at 4px.

- [ ] **Step 6: Commit**

```bash
cd ~/git/seasoned
git add js/data/philadelphia.js test/palette.test.js
git commit -m "Retune the category colours for the warm ground

The eight hues are used as 10.5px chip text, not just as fills, so each now
clears 4.5:1 against its own 8% wash over the panel. Tests assert both the
contrast floor and mutual distinguishability.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 7: Dish scoring module

**Goal:** Pure, tested logic for resolving, scoring and ranking dishes. No UI.

**Files:**
- Create: `js/dishes.js`
- Create: `test/dishes.test.js`

**Acceptance Criteria:**
- [ ] `resolveDishes` throws a named error on an unknown crop reference
- [ ] A dish whose needs are all year-round scores rarity 0
- [ ] Ranking prefers the rarer dish when peak share is equal
- [ ] Non-cookable dishes are excluded from ranking
- [ ] Ordering is stable — same week, same input, same output

**Verify:** `cd ~/git/seasoned && npm test` → dishes tests pass

**Steps:**

- [ ] **Step 1: Write the failing tests**

```js
// test/dishes.test.js
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
```

- [ ] **Step 2: Run to confirm they fail**

Run: `cd ~/git/seasoned && npm test`
Expected: FAIL — `Cannot find module '../js/dishes.js'`

- [ ] **Step 3: Implement the module**

```js
/**
 * Dish suggestions.
 *
 * Dishes are ranked by how *briefly* they are possible, not by how many
 * ingredients happen to be around. A dish of stored roots is cookable all
 * year and should never crowd out a pairing that has three weeks.
 */

/** A crop counts as gettable from storage, not only fresh. */
const GETTABLE = 1;
const PEAK = 3;

const RARITY_WEIGHT = 0.65;
const PEAK_WEIGHT = 0.35;

/**
 * Bind dish crop names to items and precompute the weeks each dish is
 * possible. Throws on an unresolved name so a typo fails loudly.
 */
export function resolveDishes(dishes, items) {
  const byName = new Map(items.map(i => [i.name, i]));

  return dishes.map(d => {
    const look = n => {
      const item = byName.get(n);
      if (!item) throw new Error(`Dish "${d.name}" references unknown crop "${n}"`);
      return item;
    };
    const needs = d.needs.map(look);
    const nice = (d.nice || []).map(look);

    const cookableWeeks = new Set();
    for (let w = 1; w <= 52; w++) {
      if (needs.every(it => it.byWeek[w] >= GETTABLE)) cookableWeeks.add(w);
    }

    return {
      name: d.name,
      note: d.note,
      needs,
      nice,
      cookableWeeks,
      rarity: 1 - cookableWeeks.size / 52
    };
  });
}

/** Fraction of a dish's crops that are at peak in the given week. */
function peakShare(dish, week) {
  const all = dish.needs.concat(dish.nice);
  if (!all.length) return 0;
  return all.filter(it => it.byWeek[week] === PEAK).length / all.length;
}

export function scoreDish(dish, week) {
  return RARITY_WEIGHT * dish.rarity + PEAK_WEIGHT * peakShare(dish, week);
}

/** The best `limit` dishes cookable in `week`, most urgent first. */
export function rankDishes(resolved, week, limit = 4) {
  return resolved
    .filter(d => d.cookableWeeks.has(week))
    .map(d => ({ dish: d, score: scoreDish(d, week) }))
    .sort((a, b) =>
      b.score - a.score ||
      b.dish.rarity - a.dish.rarity ||
      a.dish.name.localeCompare(b.dish.name))
    .slice(0, limit)
    .map(x => x.dish);
}
```

- [ ] **Step 4: Run tests**

Run: `cd ~/git/seasoned && npm test`
Expected: PASS, all 9 dish tests

- [ ] **Step 5: Commit**

```bash
cd ~/git/seasoned
git add js/dishes.js test/dishes.test.js
git commit -m "Add dish scoring

Ranks by how briefly a dish is possible rather than by ingredient count, so
a three-week pairing outranks a dish of stored roots. Needs are satisfied
from storage, which keeps the winter index honest.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 8: Write the dish index

**Goal:** Around fifty Philadelphia dishes in the region module, with enough winter coverage that no week is thin.

**Files:**
- Modify: `js/data/philadelphia.js` (add `dishes` array)
- Modify: `test/dishes.test.js`

**Acceptance Criteria:**
- [ ] Roughly 50 dishes, every crop reference resolving
- [ ] **Every week 1–52 yields at least 4 cookable dishes** — this is what stops February being thin without flattening the rarity ranking
- [ ] At least 12 dishes have a rarity above 0.75, so the urgent end is well populated
- [ ] Dish notes obey the same metre rules as the crop notes: varied length, few kickers
- [ ] No two dish notes end on the same five words

**Verify:** `cd ~/git/seasoned && npm test` → coverage test passes for all 52 weeks

**Steps:**

- [ ] **Step 1: Write the coverage tests first**

```js
// append to test/dishes.test.js
import { philadelphia } from "../js/data/philadelphia.js";

const realItems = buildItems(philadelphia.crops);
const realDishes = () => resolveDishes(philadelphia.dishes, realItems);

test("every dish crop reference resolves", () => {
  assert.doesNotThrow(realDishes);
});

test("every week of the year offers at least four dishes", () => {
  const resolved = realDishes();
  const thin = [];
  for (let w = 1; w <= 52; w++) {
    const n = rankDishes(resolved, w, 99).length;
    if (n < 4) thin.push(`week ${w}: ${n}`);
  }
  assert.deepEqual(thin, [], `weeks with fewer than 4 dishes — ${thin.join(", ")}`);
});

test("the urgent end of the index is populated", () => {
  const urgent = realDishes().filter(d => d.rarity > 0.75);
  assert.ok(urgent.length >= 12, `only ${urgent.length} dishes with rarity > 0.75, want >= 12`);
});

test("no two dish notes end on the same five words", () => {
  const seen = new Map();
  for (const d of philadelphia.dishes) {
    const tail = d.note.toLowerCase().replace(/[^a-z0-9\s]/g, "").trim().split(/\s+/).slice(-5).join(" ");
    if (tail.split(" ").length < 5) continue;
    assert.ok(!seen.has(tail), `${d.name} ends like ${seen.get(tail)}`);
    seen.set(tail, d.name);
  }
});
```

- [ ] **Step 2: Run to confirm they fail**

Run: `cd ~/git/seasoned && npm test`
Expected: FAIL — `philadelphia.dishes` is undefined

- [ ] **Step 3: Add the dishes array**

Insert after the `crops` array closes, inside the exported object. Two written out in full, to fix the register — note that the second is a third the length of the first, deliberately:

```js
  /* Dishes are scored by how briefly they are possible. `needs` gates the
     dish and is satisfied from storage; `nice` only sharpens the ranking. */
  dishes: [
    { name: "Corn and tomato salad",
      note: "Raw kernels cut off the cob, tomatoes at room temperature, salt, and enough time on the counter for the juice to come out. The overlap is about three weeks. Everything else about the recipe is negotiable.",
      needs: ["Sweet corn", "Field tomatoes"],
      nice: ["Basil", "Hot peppers"] },

    { name: "Escarole and beans",
      note: "The city's dish. Cannellini, a lot of garlic, and the bitterness left in.",
      needs: ["Escarole & endive"],
      nice: ["Garlic"] }
  ]
```

Composition guidance:

- Anchor the urgent end on the pairings the chart already argues for: corn with tomatoes, fava with garlic scapes, shad roe in April, ramps and morels, soft-shells after the May moon, the fortnight when peaches and blackberries overlap.
- Winter coverage comes from roots, alliums, brassicas, Kennett Square mushrooms and oysters — the exact list the footer names as February's whole larder. These will score low on rarity, which is correct; they exist so the panel is never empty.
- Crop names must match the `crops` array exactly, including ampersands: `"Escarole & endive"`, `"Currants & gooseberries"`, `"Zucchini & summer squash"`.

- [ ] **Step 4: Iterate against the coverage test**

Run: `cd ~/git/seasoned && npm test`

If a week is thin, the fix is to add a dish cookable in that week, not to lower the threshold. Repeat until all 52 weeks pass.

- [ ] **Step 5: Check the prose**

Run:

```bash
cd ~/git/seasoned && node --input-type=module -e '
import { philadelphia } from "./js/data/philadelphia.js";
const lens = philadelphia.dishes.map(d => d.note.length).sort((a,b) => a-b);
console.log("dishes", lens.length, "| min", lens[0], "median", lens[lens.length>>1], "max", lens[lens.length-1]);
console.log("em-dash", philadelphia.dishes.filter(d => d.note.includes("—")).length);
'
```

Expected: a genuinely wide min-to-max spread, not a 40-character band. Em-dash count in single digits.

- [ ] **Step 6: Commit**

```bash
cd ~/git/seasoned
git add js/data/philadelphia.js test/dishes.test.js
git commit -m "Write the Philadelphia dish index

About fifty dishes, with a test asserting every week of the year offers at
least four. Winter entries score low on rarity by design — they exist so the
panel stays populated in the lean weeks without flattening the ranking.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 9: The "Cook now" row

**Goal:** Four dish chips inside the sticky reader, updating with the selected week.

**Files:**
- Modify: `index.html:63` (add the row after the chip ticker)
- Modify: `css/styles.css` (add `.cook` styles near `.ticker`, around line 120)
- Modify: `js/dishes.js` (add `renderCookRow`)
- Modify: `js/app.js` (resolve dishes at startup, render on week change)
- Modify: `js/reader.js` (call the dish render from `applyWeek`)

**Acceptance Criteria:**
- [ ] A `Cook now:` row renders under the crop ticker with up to four dish chips
- [ ] Chips update when the week changes
- [ ] In weeks where the top score is near zero, the row is prefixed with a note that nothing is in a hurry
- [ ] Chips are buttons: focusable, activated by Enter and Space
- [ ] The chart still fits the viewport — `fitChart()` accounts for the taller reader automatically

**Verify:** Load in Chrome, scrub weeks 1→52, confirm chips render every week with no console errors

**Steps:**

- [ ] **Step 1: Add the container to index.html**

After line 63 (`<div class="ticker" id="r-chips"></div>`):

```html
      <div class="cook" id="r-cook"></div>
```

- [ ] **Step 2: Add the styles**

Insert after the `.chips-note` rule (around line 127):

```css
.cook{display:flex;flex-wrap:nowrap;gap:5px;margin-top:7px;overflow-x:auto;
  padding-bottom:3px;scrollbar-width:thin;align-items:center}
.cook-lab{font-family:"IBM Plex Mono",monospace;font-size:9px;letter-spacing:.14em;
  text-transform:uppercase;color:var(--ink-3);flex:none;padding-right:3px}
.dish{font-family:"Newsreader",Georgia,serif;font-size:13px;padding:3px 10px;
  border-radius:2px;white-space:nowrap;flex:none;cursor:pointer;
  border:1.2px solid var(--rule);background:var(--panel-2);color:var(--ink);
  transition:background .14s,border-color .14s}
.dish:hover{border-color:var(--ink);background:var(--panel)}
.dish:focus-visible{outline:2px solid var(--ink);outline-offset:2px}
.dish[aria-pressed=true]{background:var(--ink);color:var(--panel);border-color:var(--ink)}
.dish em{font-family:"IBM Plex Mono",monospace;font-style:normal;font-size:9px;
  letter-spacing:.09em;color:var(--ink-3);padding-left:6px}
.dish[aria-pressed=true] em{color:var(--panel-2)}
```

- [ ] **Step 3: Add the renderer to js/dishes.js**

```js
/** Weeks-per-year label, e.g. "3 wks". Year-round dishes say nothing. */
function windowLabel(dish) {
  const n = dish.cookableWeeks.size;
  return n >= 52 ? "" : `<em>${n} wk${n === 1 ? "" : "s"}</em>`;
}

/**
 * Render the "Cook now" row. `activeDish` is the currently selected resolved
 * dish object, or null. Returns the dishes rendered.
 */
export function renderCookRow(el, resolved, week, activeDish) {
  const top = rankDishes(resolved, week, 4);

  if (!top.length) {
    el.innerHTML = '<span class="cook-lab">Nothing much to cook this week</span>';
    return top;
  }

  const urgent = scoreDish(top[0], week) > 0.35;
  const label = urgent ? "Cook now" : "Nothing urgent — but";

  el.innerHTML = '<span class="cook-lab">' + label + "</span>" +
    top.map(d =>
      '<button class="dish" type="button" data-dish="' + d.name.replace(/"/g, "&quot;") + '"' +
      ' aria-pressed="' + (activeDish != null && d.name === activeDish.name) + '">' +
      d.name + windowLabel(d) + "</button>"
    ).join("");

  return top;
}
```

- [ ] **Step 4: Resolve dishes at startup in app.js**

In `start()`, after `const items = buildItems(region.crops);`:

```js
  const dishes = resolveDishes(region.dishes, items);
```

Add to the imports:

```js
import { resolveDishes, renderCookRow } from "./dishes.js";
```

Add `dish: null` to the `state` object.

- [ ] **Step 5: Render the row from applyWeek**

`applyWeek` in `reader.js` already runs on every week change and after every render, which is exactly the cadence the row needs. Add a parameter rather than importing dishes into `reader.js` — the reader should not need to know what a dish is.

Change the signature:

```js
export function applyWeek(items, region, state, nowWeek, onWeekApplied) {
```

and at the end of the function:

```js
  if (onWeekApplied) onWeekApplied();
```

In `app.js`, define the callback and pass it at both `applyWeek` call sites:

```js
  function drawCookRow() {
    renderCookRow($("r-cook"), dishes, state.week, state.dish);
  }
```

- [ ] **Step 6: Verify in the browser**

Serve on 8731. Scrub from week 1 to week 52. Confirm:
- chips appear in every week
- the label switches to "Nothing urgent — but" in the lean weeks
- the chart still fills the viewport and is not cut off

Check the console for errors.

- [ ] **Step 7: Commit**

```bash
cd ~/git/seasoned
git add index.html css/styles.css js/dishes.js js/app.js js/reader.js
git commit -m "Add the Cook now row to the week reader

Four dish chips under the crop ticker, updating with the selected week. The
reader takes a callback rather than importing dishes, so it still does not
need to know what a dish is.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 10: Dish drawer and chart highlighting

**Goal:** Clicking a dish opens it in the drawer and highlights its crops in the chart.

**Files:**
- Modify: `js/drawer.js` (add `openDishDrawer`)
- Modify: `js/app.js` (click wiring, `state.dish`, reset)
- Modify: `js/reader.js` (dish highlighting takes precedence over week dimming)

**Acceptance Criteria:**
- [ ] Clicking a dish chip opens the drawer with name, note, ingredient statuses, and weeks-per-year
- [ ] The dish's crops stay lit while every other row dims
- [ ] Clicking the active chip again clears the selection
- [ ] Closing the drawer clears the selection
- [ ] `Reset` clears the selection
- [ ] Escape closes the drawer and clears the selection
- [ ] Week dimming and dish dimming do not fight — dish wins while active

**Verify:** Load in Chrome; click a dish; confirm exactly its ingredient rows stay lit; press Escape; confirm normal dimming returns

**Steps:**

- [ ] **Step 1: Add the dish render path to drawer.js**

```js
const STATUS = { 3: "At its peak", 2: "In season", 1: "From storage", 0: "Not in season" };

export function openDishDrawer(dish, week) {
  const line = (item, kind) =>
    '<div class="d-win"><b>' + (kind === "need" ? "Needs" : "Better with") +
    "</b><span>" + item.name + "<em>" + STATUS[item.byWeek[week]] + "</em></span></div>";

  const weeks = dish.cookableWeeks.size;
  const window = weeks >= 52
    ? "Cookable all year"
    : "Cookable " + weeks + " week" + (weeks === 1 ? "" : "s") + " a year";

  document.getElementById("d-body").innerHTML =
    '<span class="d-cat"><i style="background:var(--ink)"></i>Dish</span>' +
    "<h3>" + dish.name + "</h3>" +
    '<p class="d-note">' + dish.note + "</p>" +
    '<div class="d-win"><b>This week</b><span>' + window + "</span></div>" +
    dish.needs.map(i => line(i, "need")).join("") +
    dish.nice.map(i => line(i, "nice")).join("");

  drawer().classList.add("on");
  scrim().classList.add("on");
  drawer().focus();
}
```

- [ ] **Step 2: Make dish highlighting override week dimming**

In `reader.js`, replace the row-dimming loop at the end of `applyWeek`:

```js
  const lit = state.dish ? new Set(state.dish.needs.concat(state.dish.nice).map(i => i.id)) : null;

  document.querySelectorAll(".row").forEach(row => {
    const id = +row.getAttribute("data-id");
    if (lit) {
      row.classList.toggle("dim", !lit.has(id));
      return;
    }
    const lvl = items[id].byWeek[w];
    const on = state.showStore ? lvl > 0 : lvl >= 2;
    row.classList.toggle("dim", state.focusWeek && !on);
  });
```

`state.dish` holds the resolved dish object, not a name, so the ingredient ids are directly available.

- [ ] **Step 3: Wire the clicks in app.js**

Extend the drawer import — `openDishDrawer` is new:

```js
import { closeDrawer, activateRow, openDishDrawer } from "./drawer.js";
```

```js
  function selectDish(dish) {
    state.dish = state.dish && state.dish.name === dish.name ? null : dish;
    if (state.dish) openDishDrawer(state.dish, state.week);
    else closeDrawer();
    applyWeek(items, region, state, NOW_W, drawCookRow);
  }

  $("r-cook").addEventListener("click", e => {
    const btn = e.target.closest("button.dish");
    if (!btn) return;
    const dish = dishes.find(d => d.name === btn.getAttribute("data-dish"));
    if (dish) selectDish(dish);
  });
```

Buttons handle Enter and Space natively, so no extra keydown handler is needed.

- [ ] **Step 4: Clear the dish on every exit path**

`closeDrawer` in `drawer.js` cannot reach `state`, so clear from the caller. In `app.js`, wrap it:

```js
  function dismissDrawer() {
    state.dish = null;
    closeDrawer();
    applyWeek(items, region, state, NOW_W, drawCookRow);
  }
```

Replace the three existing `closeDrawer` call sites — the close button, the scrim click, and the Escape key — with `dismissDrawer`. Add `state.dish = null;` to the `t-all` reset handler.

- [ ] **Step 5: Verify the interaction in the browser**

Serve on 8731 and check each acceptance criterion by hand:
- click a dish → drawer opens, only its ingredient rows stay lit
- click the same chip again → clears, normal dimming returns
- Escape → clears
- Reset → clears
- switch weeks with a dish active → the row re-renders, highlighting persists or clears cleanly

Read the console for errors.

- [ ] **Step 6: Commit**

```bash
cd ~/git/seasoned
git add js/drawer.js js/app.js js/reader.js
git commit -m "Open dishes in the drawer and light up their crops

Reuses the existing drawer and the .dim class the week filter already
drives. Dish highlighting takes precedence over week dimming while a dish is
active, and every exit path clears it.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 11: Documentation, full verification and deploy

**Goal:** README reflects the new shape; everything is verified end to end; the site is live.

**Files:**
- Modify: `README.md`
- Modify: `docs/superpowers/specs/2026-07-27-prose-palette-dishes-design.md` (mark implemented)

**Acceptance Criteria:**
- [ ] README documents the `dishes` field in the region shape, the scoring rule, and how to run tests
- [ ] `npm test` fully passes
- [ ] No console errors across a full 1→52 scrub in the browser
- [ ] Week 6 and week 30 tallies match pre-change values (week 6: 8 in season, 5 at peak; week 30: 48 in season, 27 at peak)
- [ ] Deployed and reachable

**Verify:** `cd ~/git/seasoned && npm test` then `curl -sL -o /dev/null -w "%{http_code}" https://heydenberk.com/seasoned/` → `200`

**Steps:**

- [ ] **Step 1: Update the README**

Add `dishes` to the region-shape table, document that `needs` is satisfied from storage and that ranking is by rarity not ingredient count, and add a Testing section:

```markdown
## Testing

```sh
npm test
```

No dependencies — `node --test` against the source modules directly. The suite
locks the crop schedule (so prose edits cannot move a week), checks colour
contrast for the neutrals and all eight category hues, and asserts every week
of the year offers at least four dishes.
```

- [ ] **Step 2: Run the full suite**

Run: `cd ~/git/seasoned && npm test`
Expected: PASS, zero failures

- [ ] **Step 3: Verify the data did not drift**

Run:

```bash
cd ~/git/seasoned && node --input-type=module -e '
import { philadelphia } from "./js/data/philadelphia.js";
import { buildItems } from "./js/model.js";
const items = buildItems(philadelphia.crops);
for (const w of [6, 30]) {
  let ins = 0, peak = 0;
  for (const it of items) { const l = it.byWeek[w]; if (l >= 2) { ins++; if (l === 3) peak++; } }
  console.log(`week ${w}: ${ins} in season, ${peak} at peak`);
}
'
```

Expected exactly:
```
week 6: 8 in season, 5 at peak
week 30: 48 in season, 27 at peak
```

Any deviation means the prose pass changed data. Find it before deploying.

- [ ] **Step 4: Full browser pass**

Serve on 8731. Scrub 1→52. At several weeks, open a crop drawer and a dish drawer. Toggle every pill, both filter buttons, all four sort orders, and Reset. Read the console with `onlyErrors: true`.

Expected: no errors, no empty states, chart fits the viewport at every week.

- [ ] **Step 5: Mark the spec implemented**

Change the spec's `Status: approved` to `Status: implemented 2026-07-27`.

- [ ] **Step 6: Commit and deploy**

```bash
cd ~/git/seasoned
git add README.md docs/
git commit -m "Document dishes and testing, mark the spec implemented

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
git push origin main
```

- [ ] **Step 7: Confirm the deploy**

```bash
cd ~/git/seasoned
for i in $(seq 1 10); do
  s=$(gh api repos/heydenberk/seasoned/pages/builds/latest --jq '.status')
  echo "$i: $s"; [ "$s" = "built" ] && break; sleep 12
done
curl -sL -o /dev/null -w "%{http_code}\n" https://heydenberk.com/seasoned/
```

Expected: `built`, then `200`. Load the live URL in Chrome and confirm the new palette and the Cook now row are present.

---

## Notes for the implementer

**The tests are the contract for the prose work.** Tasks 2 and 3 rewrite 127 notes inside a file that also holds the schedule. `test/schedule.test.js` is what makes that safe — run it after every batch of edits, not just at the end.

**Task 4 must not change appearance.** If the screenshot differs, the tokenisation is wrong. Do not "fix" it by adjusting values; find the substitution error.

**Do not lower a threshold to make a test pass.** If week 9 offers only three dishes, write a fourth dish cookable in week 9. If a category colour misses 4.5:1, darken the colour. The thresholds encode the design decisions.
