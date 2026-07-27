/**
 * Dish suggestions.
 *
 * Dishes are ranked by how *briefly* they are possible, not by how many
 * ingredients happen to be around. A dish built from stored roots is
 * cookable all year and must never crowd out a pairing that only comes
 * together for a few weeks — that scarcity is the entire point of
 * surfacing a dish suggestion at all. A `needs` crop is treated as
 * satisfied at storage level or better, since garlic, onions and potatoes
 * are genuinely gettable in February; requiring fresh-only would make
 * most of the dish index falsely uncookable all winter, and the crops
 * that truly are seasonal (no storage window) still drive the urgency.
 */

/** A crop counts as gettable from storage, not only fresh. */
const GETTABLE = 1;
const PEAK = 3;

const RARITY_WEIGHT = 0.65;
const PEAK_WEIGHT = 0.35;

/**
 * Bind each dish's `needs`/`nice` crop names to the built items for a
 * region, and precompute the set of weeks the dish is cookable at all
 * (every `needs` crop at storage level or better). Throws on a name that
 * doesn't resolve to an item, so a typo in the dish data fails loudly
 * instead of silently dropping an ingredient from the calculation.
 */
export function resolveDishes(dishes, items) {
  const byName = new Map(items.map(i => [i.name, i]));

  return dishes.map(d => {
    const look = name => {
      const item = byName.get(name);
      if (!item) throw new Error(`Dish "${d.name}" references unknown crop "${name}"`);
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

/** Fraction of a dish's crops (needs and nice-to-have) at peak in `week`. */
function peakShare(dish, week) {
  const all = dish.needs.concat(dish.nice);
  if (!all.length) return 0;
  return all.filter(it => it.byWeek[week] === PEAK).length / all.length;
}

/** How urgent a dish is this week: mostly rarity, with peak share as a nudge. */
export function scoreDish(dish, week) {
  return RARITY_WEIGHT * dish.rarity + PEAK_WEIGHT * peakShare(dish, week);
}

/**
 * The best `limit` dishes cookable in `week`, most urgent first. Dishes
 * that aren't cookable at all this week (a `needs` crop below storage
 * level) are dropped rather than ranked last, since suggesting them would
 * be wrong, not just low-priority. Ties fall back to rarity, then to name,
 * so the order never depends on input array position or sort stability.
 */
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
