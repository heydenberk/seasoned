/**
 * Dish suggestions, and the compact "Cook now" row that surfaces them.
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
    /* A dish with no requirements would be cookable in all 52 weeks and rank
       as maximally common — which is indistinguishable from an author who
       forgot to fill in the ingredients. Refuse it for the same reason an
       unresolved name is refused. */
    if (!d.needs || !d.needs.length) {
      throw new Error(`Dish "${d.name}" lists no needs`);
    }

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

/* ---------------------------------------------------------------------------
 * The "Cook now" row.
 * ------------------------------------------------------------------------- */

/**
 * How high the top score has to be before the row claims urgency. Measured
 * against the Philadelphia index, the top score by week runs: week 17 = 0.94,
 * week 30 = 0.89, week 41 = 0.91, week 48 = 0.76, week 6 = 0.66. So 0.75
 * splits the year roughly where a cook would: ramps through the cranberries
 * are worth interrupting someone for, a February of stored roots and oysters
 * is not. A threshold much below this would shout in every week of the year,
 * which is the one thing this label exists to avoid.
 */
const URGENT = 0.75;

const WEEKS = 52;

const ESC = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" };
const esc = s => String(s).replace(/[&<>"]/g, c => ESC[c]);

/** "7 wks", dropped entirely for a dish that is cookable the whole year. */
function weeksLabel(dish) {
  const n = dish.cookableWeeks.size;
  if (n === WEEKS) return "";
  return "<em>" + n + " wk" + (n === 1 ? "" : "s") + "</em>";
}

/**
 * Paint the dish row: a label, then up to `limit` dish chips for `week`.
 * `activeDish` is the resolved dish object currently highlighted in the
 * chart, or null — matched by name, since a re-render hands back equal but
 * not identical chips.
 *
 * Chips are real buttons, so focus, Enter and Space come for free; app.js
 * binds a single delegated click handler on `el` and reads data-dish, which
 * survives this function replacing the row on every week change.
 */
export function renderCookRow(el, resolved, week, activeDish, limit = 4) {
  const top = rankDishes(resolved, week, limit);
  const urgent = top.length > 0 && scoreDish(top[0], week) >= URGENT;

  let html = '<span class="cook-lab">' + (urgent ? "Cook now" : "Nothing urgent") + "</span>";

  if (!top.length) {
    html += '<span class="chips-note">Nothing in the dish index comes together this week.</span>';
  }

  html += top.map(d => {
    const on = activeDish != null && d.name === activeDish.name;
    return '<button type="button" class="dchip" data-dish="' + esc(d.name) +
      '" aria-pressed="' + on + '">' + esc(d.name) + weeksLabel(d) + "</button>";
  }).join("");

  el.innerHTML = html;
  el.scrollLeft = 0;
}
