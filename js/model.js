/**
 * Turns a region's compact crop tuples into the objects the views read.
 */

/** Draw order within a row: storage rails behind, peak blocks on top. */
export const KIND_ORDER = { t: 0, s: 1, p: 2 };

/** Availability level per week: 3 = peak, 2 = available, 1 = storage, 0 = none. */
const LEVEL = { p: 3, s: 2, t: 1 };

export function buildItems(crops) {
  return crops.map(([name, cat, windows, note], id) => {
    const wins = windows.map(([s, e, k]) => ({ s, e, k }));

    const byWeek = {};
    for (let w = 1; w <= 52; w++) {
      let lvl = 0;
      for (const x of wins) {
        if (w >= x.s && w <= x.e) lvl = Math.max(lvl, LEVEL[x.k]);
      }
      byWeek[w] = lvl;
    }

    /* "arrival" ignores storage windows unless storage is all there is */
    const fresh = wins.filter(x => x.k !== "t");
    const pool = fresh.length ? fresh : wins;
    const peaks = wins.filter(x => x.k === "p");

    return {
      id, name, cat, wins, note, byWeek,
      start: Math.min(...pool.map(x => x.s)),
      peakStart: peaks.length ? Math.min(...peaks.map(x => x.s)) : 99
    };
  });
}
