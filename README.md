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
  drawer.js           crop detail panel
  tooltip.js          hover readout
  data/
    philadelphia.js   the Philadelphia region
```

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

Then point `app.js` at it:

```js
import { yourRegion } from "./data/your-region.js";
start(yourRegion);
```

Two things are still Philadelphia-specific outside the data file: the
masthead prose and the footer in `index.html`. A multi-region build would
need those templated too.

## Caveats on the data

Compiled from regional harvest calendars and typical market availability.
Every edge is soft — a warm March or a wet June moves things a week or two
in either direction, and growers with tunnels and cold frames routinely beat
these dates.

## Deployment

GitHub Pages serves `main` at the repository root. Pushing to `main` publishes.
