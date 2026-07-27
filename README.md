# seasoned

An interactive seasonality chart: fifty-two weeks of what a region's ground,
orchards and water actually give up, when it turns up, and when it's gone
until next year.

The first region is Philadelphia / the Delaware Valley foodshed.

**Live:** https://heydenberk.com/seasoned/

## Running locally

No build step, but the app uses ES modules, so it needs to be served over
HTTP rather than opened from the filesystem:

```sh
python3 -m http.server 8000
# then open http://localhost:8000
```

## Layout

```
index.html            markup only
css/styles.css        all styling
js/
  app.js              state, control wiring, startup
  calendar.js         week ↔ date arithmetic (pure)
  model.js            crop tuples → per-week availability
  chart.js            month scale, background rules, crop rows
  reader.js           sticky week reader: tallies, chips, row dimming
  dishes.js           dish scoring, and the "Cook now" row
  drawer.js           crop and dish detail panel
  tooltip.js          hover readout
  data/
    philadelphia.js   the Philadelphia region
test/                 node --test, zero dependencies
scripts/
  prose-stats.mjs     measures the crop notes for uniformity
```

### Colour

`:root` in `css/styles.css` is the only place a colour literal may appear;
everything else references a token. Two RGB triples carry the split that makes
the palette work, and the rule is by *function*, not by shape:

- `--ink-rgb` — the one mark the eye is meant to track: the now-line and its
  legend swatch
- `--earth-rgb` — everything else: recurring grid, band and divider texture,
  hover and active tints, the drawer scrim

`--ink` derives from `--ink-rgb` rather than repeating it as a hex, so the two
cannot drift apart. `--panel` / `--panel-2` / `--panel-3` are one darkening
ramp and should be retuned together.

The eight category hues are used as 10.5px chip text *and* as filled chips with
panel-coloured text on top, so each must clear 4.5:1 in both directions. That
is a narrow band, and `test/palette.test.js` enforces it along with perceptual
distinguishability under simulated protanopia and deuteranopia.

## Adding a region

A region module is the unit of localisation. Everything place-specific lives
in one file under `js/data/`; nothing else in the app knows about
Philadelphia. Copy `philadelphia.js` and fill in:

| field | what it is |
| --- | --- |
| `id`, `label` | identifiers for the region |
| `facts` | `[label, value]` pairs for the masthead meta rail |
| `frost` | `last` / `first` frost as `{month, day}` — month is 0-indexed |
| `seasons` | season names keyed to an inclusive upper-bound week |
| `categories` | display groups, each with an `rgb` triple used for all colour |
| `crops` | the data itself |
| `dishes` | what to cook, scored against the selected week |

Each crop is a tuple:

```js
["Parsnips", 2, [[40,52,"s"], [43,50,"p"], [1,13,"s"], [9,12,"p"]], "Dug after hard frost…"]
//  name      ↑    ↑ windows: [startWeek, endWeek, kind]                ↑ note
//        category index
```

Window kinds:

- `s` — available, being harvested now (thin rail)
- `p` — at its peak, worth building a meal around (thick block)
- `t` — for sale but out of the ground: cellared, cured, glasshouse (dotted rail)

Windows may overlap and a crop may have several, which is how two harvests
(a spring sowing and a sweeter fall one) are expressed. Weeks run 1–52 and
wrap at the year boundary — a winter crop is written as two windows, one
ending at 52 and one starting at 1.

### Dishes

```js
{ name: "Tomatoes and corn",
  note: "Raw kernels cut off the cob…",
  needs: ["Sweet corn", "Field tomatoes"],   // gates the dish
  nice:  ["Basil", "Hot peppers"] }          // only sharpens the ranking
```

Two decisions matter here, and both are load-bearing:

**Ranking is by scarcity, not by ingredient count.** A dish scores
`0.65 × rarity + 0.35 × peakShare`, where `rarity = 1 − cookableWeeks/52`. So
corn-and-tomatoes outranks braised kale in October, because that pairing has
five weeks a year at peak and the kale has five months. Ranking by how many
ingredients happen to be around would put a root-vegetable soup at the top
from November to April, which is the opposite of useful.

**A `needs` crop is satisfied at storage level or better,** not fresh only.
Garlic, onions and potatoes are genuinely available in February, and requiring
fresh-only would make much of the index falsely uncookable all winter. Urgency
still emerges correctly, because the crops with no storage window are exactly
the seasonal ones.

Crop names are resolved at startup and an unknown one throws, as does a dish
with an empty `needs` — both are almost always a typo, and a silent drop would
be worse than a crash. A test asserts **every week of the year offers at least
four cookable dishes**, so the panel is never thin in February; the fix for a
thin week is another dish, not a lower threshold.

Then point `app.js` at it:

```js
import { yourRegion } from "./data/your-region.js";
start(yourRegion);
```

Two things are still Philadelphia-specific outside the data file: the
masthead prose and the footer in `index.html`. A multi-region build would
need those templated too.

## Testing

```sh
npm test
```

No dependencies — `node --test` runs against the source modules directly. The
suite exists mostly to guard things that are easy to break silently:

- **The crop schedule is frozen** against `test/fixtures/crop-schedule.json`.
  Rewriting 127 notes in the same file that holds the week windows is an easy
  way to nudge a number without noticing; a failure names the crop that moved.
  Regenerate deliberately with `npm run fixture:update` when crops legitimately
  change.
- **Colour contrast**, for the three ink levels and all eight category hues,
  in both directions described above.
- **Dish coverage**, so no week of the year has fewer than four dishes.
- **Prose uniformity.** The original notes all sat within a 40-character band,
  which is what made them read as machine-written. The guard asserts the length
  distribution has no hole wider than 60 characters — a naive "N notes over 200
  characters" threshold just moves the uniformity somewhere else, which is what
  happened on the first attempt.

## Caveats on the data

Compiled from regional harvest calendars and typical market availability.
Every edge is soft — a warm March or a wet June moves things a week or two
in either direction, and growers with tunnels and cold frames routinely beat
these dates.

## Deployment

GitHub Pages serves `main` at the repository root. Pushing to `main` publishes.
