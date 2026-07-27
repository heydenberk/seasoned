/**
 * The detail drawer, for a crop or for a dish.
 */

import { MABB, fmt, pc, pw, weekStart, weekEnd, rangeText } from "./calendar.js";
import { KIND_ORDER } from "./model.js";
import { MONTHS } from "./chart.js";

const KIND_LABEL = { p: "At its peak", s: "Available", t: "From storage" };
const WEEK_LABEL = { 3: "At its peak", 2: "In season", 1: "Storage or glasshouse only", 0: "Not in season" };

let lastFocus = null;

const drawer = () => document.getElementById("drawer");
const scrim = () => document.getElementById("scrim");

function clearActiveRows() {
  document.querySelectorAll(".row.is-active").forEach(r => r.classList.remove("is-active"));
}

export function openDrawer(item, cats, week) {
  const c = cats[item.cat];

  const strip = item.wins.slice()
    .sort((a, b) => KIND_ORDER[a.k] - KIND_ORDER[b.k])
    .map(x => '<div class="bar k-' + x.k + '" style="left:' + pc(x.s) + "%;width:" + pw(x.s, x.e) + '%"></div>')
    .join("");

  let months = "";
  for (let i = 1; i < 12; i++) months += '<div class="dm" style="left:' + MONTHS.start[i] + '%"></div>';
  months += '<div class="dnow" style="left:' + pc(week) + '%"></div>';

  const wins = item.wins.slice()
    .sort((a, b) => a.s - b.s || KIND_ORDER[b.k] - KIND_ORDER[a.k])
    .map(x =>
      '<div class="d-win"><b>' + KIND_LABEL[x.k] + "</b><span>" + rangeText(x.s, x.e) +
      "<em>week " + x.s + (x.e !== x.s ? "–" + x.e : "") + "</em></span></div>"
    ).join("");

  const now = '<div class="d-win"><b>Week ' + week + "</b><span>" + WEEK_LABEL[item.byWeek[week]] +
    "<em>" + fmt(weekStart(week)) + " – " + fmt(weekEnd(week)) + "</em></span></div>";

  document.getElementById("d-body").innerHTML =
    '<span class="d-cat" style="--rgb:' + c.rgb + '"><i></i>' + c.name + "</span>" +
    "<h3>" + item.name + "</h3>" +
    '<p class="d-note">' + item.note + "</p>" +
    '<div class="d-strip" style="--rgb:' + c.rgb + '">' + months + strip + "</div>" +
    '<div class="d-months">' +
      MABB.map((m, i) => '<span style="width:' + (MONTHS.end[i] - MONTHS.start[i]) + '%">' + m[0] + "</span>").join("") +
    "</div>" +
    '<div style="margin-top:20px">' + now + wins + "</div>";

  drawer().setAttribute("aria-modal", "true");
  drawer().setAttribute("aria-label", "Crop details");
  drawer().classList.add("on");
  scrim().classList.add("on");
  drawer().focus();
}

/**
 * The same drawer, showing a resolved dish instead of a crop: what it is, how
 * rare the window is, and where each ingredient stands in `week`. Called again
 * on every week change while a dish is up, so the statuses never go stale —
 * hence the `fresh` guard, which keeps a refresh from stealing focus back from
 * whatever the reader is being driven with, or from overwriting the element
 * that focus should return to on close.
 */
export function openDishDrawer(dish, week) {
  const el = drawer();
  const fresh = !el.classList.contains("on");
  if (fresh) lastFocus = document.activeElement;

  const n = dish.cookableWeeks.size;
  const cookable = n === 52 ? "Cookable all year" : "Cookable " + n + " weeks a year";
  const ingredient = (it, role) =>
    '<div class="d-win"><b>' + role + "</b><span>" + it.name +
    "<em>" + WEEK_LABEL[it.byWeek[week]] + "</em></span></div>";

  document.getElementById("d-body").innerHTML =
    '<span class="d-cat">Dish</span>' +
    "<h3>" + dish.name + "</h3>" +
    '<p class="d-note">' + dish.note + "</p>" +
    '<div style="margin-top:20px">' +
      '<div class="d-win"><b>Window</b><span>' + cookable +
        "<em>week " + week + " of 52</em></span></div>" +
      dish.needs.map(it => ingredient(it, "Required")).join("") +
      dish.nice.map(it => ingredient(it, "Optional")).join("") +
    "</div>";

  clearActiveRows();
  /* A dish gets the panel but no scrim, unlike a crop. Half of what a dish
     chip does happens out in the chart — its crops stay lit while the rest
     dim — and a scrim over the chart would veil the answer. Leaving the page
     live also keeps the dish row reachable, so the same chip can switch the
     highlight back off and a neighbouring chip can take it over. */
  el.setAttribute("aria-modal", "false");
  el.setAttribute("aria-label", "Dish details");
  el.classList.add("on");
  scrim().classList.remove("on");
  if (fresh) el.focus();
}

export function closeDrawer() {
  drawer().classList.remove("on");
  scrim().classList.remove("on");
  clearActiveRows();
  if (lastFocus && lastFocus.focus) lastFocus.focus();
}

/** Mark a row active, remember it for focus restoration, and open its detail. */
export function activateRow(row, items, cats, week) {
  clearActiveRows();
  row.classList.add("is-active");
  lastFocus = row;
  openDrawer(items[+row.getAttribute("data-id")], cats, week);
}
