/**
 * The chart: month scale, background rules, and the crop rows.
 */

import { MABB, pc, pw, markPct, monthEdges } from "./calendar.js";
import { KIND_ORDER } from "./model.js";

export const MONTHS = monthEdges();

/** Month bands, week ticks, frost marks and the "now" / selection marks. */
export function renderScale(el, region, nowWeek, selWeek) {
  let h = "";
  for (let i = 0; i < 12; i++) {
    h += '<div class="mon' + (i % 2 ? " mon-alt" : "") + '" style="left:' + MONTHS.start[i] +
         "%;width:" + (MONTHS.end[i] - MONTHS.start[i]) + '%">' + MABB[i] + "</div>";
  }
  for (let w = 1; w <= 52; w += 4) {
    h += '<div class="tick" style="left:' + pc(w) + '%">' + w + "</div>";
  }
  h += '<div class="headmark frost" style="left:' + markPct(region.frost.last) + '%"><b>Last frost</b></div>';
  h += '<div class="headmark frost right" style="left:' + markPct(region.frost.first) + '%"><b>First frost</b></div>';
  h += '<div class="headmark' + (nowWeek > 42 ? " right" : "") + '" style="left:' + pc(nowWeek) + '%"><b>Now</b></div>';
  h += '<div class="headmark sel" id="selmark" style="left:' + pc(selWeek) + '%"></div>';
  el.innerHTML = h;
}

/** Alternating month shading and vertical rules behind the rows. */
export function renderGridLines(el, region, nowWeek, selWeek) {
  let h = "";
  for (let b = 1; b < 12; b += 2) {
    h += '<div class="mband" style="left:' + MONTHS.start[b] +
         "%;width:" + (MONTHS.end[b] - MONTHS.start[b]) + '%"></div>';
  }
  for (let i = 1; i < 12; i++) h += '<div class="mline" style="left:' + MONTHS.start[i] + '%"></div>';
  h += '<div class="fline" style="left:' + markPct(region.frost.last) + '%"></div>';
  h += '<div class="fline" style="left:' + markPct(region.frost.first) + '%"></div>';
  h += '<div class="nowline" style="left:' + pc(nowWeek) + '%"></div>';
  h += '<div class="selband" id="selband" style="left:' + pc(selWeek) +
       "%;width:" + pw(selWeek, selWeek) + '%"></div>';
  el.innerHTML = h;
}

export function barsHTML(item, delay, showStore) {
  const ws = item.wins.slice().sort((a, b) => KIND_ORDER[a.k] - KIND_ORDER[b.k]);
  let h = "";
  for (const x of ws) {
    if (x.k === "t" && !showStore) continue;
    h += '<div class="bar k-' + x.k + '" style="left:' + pc(x.s) + "%;width:" + pw(x.s, x.e) +
         "%;--d:" + (delay + x.s * 3) + 'ms"></div>';
  }
  return h;
}

function rowHTML(item, delay, cats, showStore) {
  return '<div class="row" data-id="' + item.id + '" tabindex="0" role="button" aria-label="' +
    item.name + '" style="--rgb:' + cats[item.cat].rgb + '"><div class="lab">' + item.name + "</div>" +
    '<div class="track">' + barsHTML(item, delay, showStore) + "</div></div>";
}

/** Which items survive the category, search and week filters. */
export function visibleItems(items, cats, state) {
  const q = state.q.trim().toLowerCase();
  return items.filter(it => {
    if (!state.cats[it.cat]) return false;
    if (q && (it.name + " " + it.note + " " + cats[it.cat].name).toLowerCase().indexOf(q) < 0) return false;
    if (state.weekOnly) {
      const lvl = it.byWeek[state.week];
      if (lvl === 0) return false;
      if (lvl === 1 && !state.showStore) return false;
    }
    return true;
  });
}

export function renderRows(el, list, cats, state) {
  let out = "", d = 0;

  if (!list.length) {
    out = '<div class="empty">Nothing matches that. Clear the search, or switch a kind back on.</div>';
  } else if (state.sort === "cat") {
    cats.forEach((c, ci) => {
      const g = list.filter(x => x.cat === ci);
      if (!g.length) return;
      g.sort((a, b) => a.start - b.start || a.name.localeCompare(b.name));
      out += '<div class="grp" style="--rgb:' + c.rgb + '"><i></i>' + c.name + " <em>" + g.length + "</em></div>";
      g.forEach(it => { out += rowHTML(it, d, cats, state.showStore); d += 9; });
    });
  } else {
    const s = list.slice();
    if (state.sort === "start") s.sort((a, b) => a.start - b.start || a.name.localeCompare(b.name));
    if (state.sort === "peak")  s.sort((a, b) => a.peakStart - b.peakStart || a.start - b.start);
    if (state.sort === "az")    s.sort((a, b) => a.name.localeCompare(b.name));
    s.forEach(it => { out += rowHTML(it, d, cats, state.showStore); d += 6; });
  }

  el.innerHTML = out;
}
