/**
 * The hover tooltip. Reads the week from the pointer's x position within a
 * row's track, so it does not need per-bar hit targets.
 */

import { fmt, weekStart, weekEnd } from "./calendar.js";

const WORD = { 3: "At its peak", 2: "Available", 1: "From storage", 0: "Not in season" };

export function initTooltip(grid, tip, items) {
  grid.addEventListener("mousemove", e => {
    const row = e.target.closest ? e.target.closest(".row") : null;
    if (!row) { tip.classList.remove("on"); return; }

    const r = row.querySelector(".track").getBoundingClientRect();
    if (e.clientX < r.left) { tip.classList.remove("on"); return; }

    const w = Math.max(1, Math.min(52, Math.ceil((e.clientX - r.left) / r.width * 52)));
    const it = items[+row.getAttribute("data-id")];

    tip.innerHTML = "<b>" + it.name + "</b> · wk " + w + " · " +
      fmt(weekStart(w)) + "–" + fmt(weekEnd(w)) + "<br>" + WORD[it.byWeek[w]];
    tip.classList.add("on");

    let x = e.clientX + 15, y = e.clientY + 17;
    if (x + 260 > window.innerWidth) x = e.clientX - 260;
    if (y + 50 > window.innerHeight) y = e.clientY - 54;
    tip.style.left = x + "px";
    tip.style.top = y + "px";
  });

  grid.addEventListener("mouseleave", () => tip.classList.remove("on"));
}
