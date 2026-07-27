# Prose, palette and dish suggestions

Date: 2026-07-27
Status: implemented 2026-07-27

Three workstreams against `seasoned`, in the order they should be built. They
are independent except that the dish notes must be written in the register
established by workstream 1, so prose comes first.

## Context

The site began as a single 940-line `index.html` and was split into modules
on 2026-07-27. Content, styling and behaviour are unchanged from that
original. All three workstreams below change content or presentation; none
changes the chart's underlying model.

---

## 1. Prose

### The problem

Measured across the 127 crop notes in `js/data/philadelphia.js`:

| measure | value |
| --- | --- |
| characters per note | median 95, p10 79, p90 118 |
| sentences per note | 32 are one sentence, 95 are two, none are three or more |
| contains an em-dash | 15% |
| contains an intensifier (*genuinely, entirely, wildly, extraordinary*) | 10% |
| ends on imperative advice (*Buy them…, Smell the stem…*) | 9% |

Every entry lands within a forty-character band and resolves in one or two
sentences. The individual sentences are frequently good; the uniformity is
what reads as machine-written. Each note executes the same template:
orienting fact, turn, aphorism.

### The fix

Structural before lexical. In priority order:

1. **Break the length distribution.** Target roughly: fifteen notes running
   long (three to five sentences) where there is real history to tell — shad
   on the Delaware, Kennett Square, the Brandywine tomato, the South Philly
   fig trees, cardoons on 9th Street. A dozen notes cut to under forty
   characters. The rest spread across the middle rather than clustered in it.
2. **Remove most kickers.** A closing aphorism should be the exception. Keep
   the ones carrying information; cut the ones performing wit.
3. **Thin the em-dashes** to well under 15% of notes, preferring commas,
   semicolons and full stops.
4. **Cut intensifiers** except where the emphasis is doing real work.
5. **Vary the opening.** Many notes currently open with a bare noun phrase.
   Some should open with the place, the season, the technique, or a verb.

### Scope

- All 127 crop notes.
- Masthead: eyebrow, `h1`, deck, meta rail.
- Footer: all three columns and the closing caveat.
- Legend text and the empty-state string.

Facts must survive rewriting. Week windows, place names, varieties and dates
are data, not style, and must not drift. Where a fact is doubtful it stays as
written rather than being silently corrected — this pass changes prose only.

### Out of scope

README and code comments. They are not the artefact.

---

## 2. Palette

Direction A of the two previewed: brown becomes the chrome, green stays the
ink, paper stays light and warm.

### Tokens

```
--ground   #EAE4D6      --ink    #1B2E1F
--ground-2 #DFD8C6      --ink-2  #5A4B36
--panel    #F7F3E9      --ink-3  #8A7A61
--panel-2  #F0EBDD      --rule   #CFC4AB
--panel-3  #EFE8D8      --rule-2 #E0D8C4
```

`--panel-3` is new, replacing the hardcoded `#E9EDE2` on the active row label.

### Tokenising the hardcoded colours

`css/styles.css` currently contains fourteen distinct hardcoded colour values
that bypass the variables — thirteen `rgba(19,37,28,…)` and one hex — across
seventeen occurrences. This is why a palette change presently means
hand-editing rules. Introduce two RGB triple tokens and route every one of
them through:

```
--ink-rgb    27,46,31     structural marks: nowline, legend swatches,
                          scrim, shadow, focus rings
--earth-rgb  90,75,54     surface washes: body grid, month bands, row
                          hover, active row, selection band, frost lines
```

The split is by role, not by appearance: anything that draws a line the eye
should follow is ink; anything that tints a surface is earth.

### Category colours

The eight category hues are unchanged in the preview and read as too
electric against warm paper, the teal and blue especially. Retune toward
botanical hues under the `dataviz` skill rather than by eye.

Binding constraints, because these encode data across 127 rows:

- Eight-way discriminable, including for the most common forms of colour
  vision deficiency.
- Legible at the 4px dotted storage rail and the 16px peak block.
- **Each is also used as small text.** `.chip` renders the category colour as
  10.5px text on a 8%-alpha wash of itself, and `.grp` uses it for an 11.5px
  uppercase heading. Every hue therefore needs at least 4.5:1 against
  `--panel`. The existing gold `160,124,44` is the likeliest current failure
  and must be checked.

Categories keep their existing identity — fruit reads red, water reads blue.
This is a retune, not a reassignment.

---

## 3. Dish suggestions

### Data

Dishes live in the region module, being as place-specific as the crops:

```js
dishes: [
  { name: "Corn and tomato salad",
    note: "…",
    needs: ["Sweet corn", "Field tomatoes"],
    nice:  ["Basil", "Hot peppers"] }
]
```

Crops are referenced by name. Resolve names to items at startup and throw on
a miss, so a typo fails loudly instead of silently dropping a dish.

Target roughly fifty dishes spread across the year, weighted toward the
windows the chart makes interesting rather than evenly. Winter needs enough
to keep the panel populated; see the February note below.

### Gettability

A `needs` crop is satisfied at storage level or better (`byWeek[w] >= 1`),
not fresh only. Garlic, onions and potatoes are genuinely available in
February, and requiring fresh-only would make much of the index falsely
uncookable all winter. Urgency still emerges correctly, because the crops
with no storage window are exactly the seasonal ones.

`nice` crops never gate a dish; they only affect ranking.

### Scoring

For each dish:

- **cookable weeks** — the weeks where every `needs` crop is gettable.
- **rarity** = `1 - cookableWeeks / 52`. A three-week dish scores ~0.94;
  potatoes-and-onions scores 0.
- **peak share** = fraction of `needs` + `nice` at peak (`byWeek[w] === 3`)
  in the selected week.
- **score** = `0.65 * rarity + 0.35 * peakShare`.

Only dishes cookable in the selected week are eligible. Show the top four.

The weighting is the substance of the feature: it ranks by how *briefly* a
dish is possible, not by how many ingredients happen to be around. Corn and
tomatoes outranks braised kale in October because that pairing has three
weeks a year and the kale has five months.

Ties break on rarity, then dish name, so ordering is stable across renders.

### February

In the lean weeks few dishes will be urgent and scores will cluster near
zero. The panel must still render: show the top four regardless, prefixed by
a note that nothing is in a hurry this week. The site's own footer argues
February is the lean month; the panel agreeing with it is correct behaviour,
not an empty state.

A true empty state — no dish cookable at all — should not occur given a
sensibly written index, but must render a plain message rather than an empty
row if it does.

### Placement

A single row inside the sticky reader, directly under the crop-chip ticker:
a `Cook now:` label followed by four dish chips.

Not a panel below the chart. `fitChart()` sizes the scroller to fill the
remaining viewport, so anything below it sits permanently off-screen. One
extra row costs about 30px, and `fitChart()` already measures reader height,
so the chart adapts without changes.

### Interaction

Clicking a dish chip:

- opens the existing drawer on a dish render path — name, note, each
  ingredient with its status in the selected week, and how many weeks a year
  the dish is cookable;
- highlights the dish's crops in the chart by dimming every other row.

Highlighting reuses the `.dim` class already driven by the week filter. Track
the active dish in `state.dish`; clearing it (closing the drawer, clicking
the chip again, `Reset`) restores normal dimming. The existing week-focus
dimming and dish dimming must not fight — dish highlighting takes precedence
while a dish is active.

Dish chips are buttons: keyboard-focusable, activated by Enter and Space,
with `aria-pressed` reflecting the active dish.

### Modules

- `js/dishes.js` — name resolution, scoring, chip rendering. New.
- `js/data/philadelphia.js` — the `dishes` array. Extended.
- `js/drawer.js` — second render path for dishes. Extended.
- `js/app.js` — `state.dish`, wiring, reset behaviour. Extended.
- `index.html` — the `Cook now` row container. Extended.

### Prose warning

Fifty dish notes written back to back is the exact situation that produced
the metre problem in workstream 1. They are subject to the same rules: varied
length, few kickers, no template.

---

## Verification

- Crop count stays at 127 and every window tuple is byte-identical to the
  pre-rewrite data. Diff the tuples, not the notes.
- Every `needs` and `nice` name resolves to a crop.
- Contrast check on all eight category colours against `--panel` at 4.5:1.
- No hardcoded colour literals remain in `css/styles.css` outside the
  `:root` block.
- Drive the page: scrub across all 52 weeks with no console errors; confirm
  dish chips appear every week; open a dish drawer and confirm ingredient
  statuses match the chart; confirm reset clears dish highlighting.
- Spot-check week 6 and week 30 against the current live figures
  (week 6: 8 in season, 5 at peak; week 30: 48 in season, 27 at peak) to
  prove the prose and palette work changed no data.
