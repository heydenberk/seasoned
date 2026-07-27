/**
 * The sticky week reader: dates, tallies, the chip ticker, and dimming rows
 * that are out of season for the selected week.
 *
 * This runs on every week change and after every render, which makes it the
 * right cadence for anything else that hangs off the week. Rather than import
 * those things — the reader's subject is the week, not dishes — applyWeek
 * takes a trailing `after` callback and lets app.js decide what else to paint.
 */

import { fmt, pc, pw, weekStart, weekEnd, seasonName } from "./calendar.js";

const $ = id => document.getElementById(id);

export function applyWeek(items, region, state, nowWeek, after) {
  const w = state.week;
  const cats = region.categories;

  const band = $("selband");
  if (band) {
    band.style.left = pc(w) + "%";
    band.style.width = pw(w, w) + "%";
  }
  const mark = $("selmark");
  if (mark) {
    mark.style.left = pc(w) + "%";
    mark.style.display = w === nowWeek ? "none" : "block";
  }

  $("r-num").textContent = w;
  $("r-dates").textContent = fmt(weekStart(w)) + " – " + fmt(weekEnd(w));
  $("r-season").textContent = seasonName(region.seasons, w) + (w === nowWeek ? " · this week" : "");

  let peak = 0, ins = 0, arrived = 0, leaving = 0;
  const chips = [];
  items.forEach(it => {
    const lvl = it.byWeek[w];
    if (lvl < 2) return;
    const prev = it.byWeek[w === 1 ? 52 : w - 1];
    const next = it.byWeek[w === 52 ? 1 : w + 1];
    ins++;
    if (lvl === 3) peak++;
    if (prev < 2) arrived++;
    if (next < 2) leaving++;
    chips.push({ n: it.name, c: cats[it.cat].rgb, p: lvl === 3, s: it.cat });
  });

  $("r-peak").textContent = peak;
  $("r-in").textContent = ins;
  $("r-new").textContent = arrived;
  $("r-last").textContent = leaving;

  chips.sort((a, b) => (b.p ? 1 : 0) - (a.p ? 1 : 0) || a.s - b.s || a.n.localeCompare(b.n));
  let html = chips.map(c =>
    '<span class="chip' + (c.p ? " is-peak" : "") + '" style="--rgb:' + c.c + '">' + c.n + "</span>"
  ).join("");
  if (!chips.length) {
    html = '<span class="chips-note">Cellar and cold storage only this week. Look for the dotted rails.</span>';
  }
  const ticker = $("r-chips");
  ticker.innerHTML = html;
  ticker.scrollLeft = 0;

  /* A highlighted dish outranks the week. While one is active the chart is
     answering "what does this dish want", so the two kinds of dimming must
     not compound: membership in the dish decides, and the week is ignored. */
  const lit = state.dish
    ? new Set(state.dish.needs.concat(state.dish.nice).map(i => i.id))
    : null;

  document.querySelectorAll(".row").forEach(row => {
    const id = +row.getAttribute("data-id");
    if (lit) { row.classList.toggle("dim", !lit.has(id)); return; }
    const lvl = items[id].byWeek[w];
    const on = state.showStore ? lvl > 0 : lvl >= 2;
    row.classList.toggle("dim", state.focusWeek && !on);
  });

  if (after) after();
}
