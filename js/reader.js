/**
 * The sticky week reader: dates, tallies, the chip ticker, and dimming rows
 * that are out of season for the selected week.
 */

import { fmt, pc, pw, weekStart, weekEnd, seasonName } from "./calendar.js";

const $ = id => document.getElementById(id);

export function applyWeek(items, region, state, nowWeek) {
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
    html = '<span class="chips-note">Cellar and cold storage only this week — look for the dotted rails.</span>';
  }
  const ticker = $("r-chips");
  ticker.innerHTML = html;
  ticker.scrollLeft = 0;

  document.querySelectorAll(".row").forEach(row => {
    const lvl = items[+row.getAttribute("data-id")].byWeek[w];
    const on = state.showStore ? lvl > 0 : lvl >= 2;
    row.classList.toggle("dim", state.focusWeek && !on);
  });
}
