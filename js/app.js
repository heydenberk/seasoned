/**
 * Wiring: owns the UI state, builds the views, and binds the controls.
 *
 * To add a locale, import a different region module and pass it to start().
 */

import { philadelphia } from "./data/philadelphia.js";
import { todayWeek } from "./calendar.js";
import { buildItems } from "./model.js";
import { renderScale, renderGridLines, renderRows, visibleItems } from "./chart.js";
import { applyWeek } from "./reader.js";
import { closeDrawer, activateRow } from "./drawer.js";
import { initTooltip } from "./tooltip.js";

const $ = id => document.getElementById(id);

function start(region) {
  const cats = region.categories;
  const items = buildItems(region.crops);
  const NOW_W = todayWeek();

  const state = {
    week: NOW_W,
    q: "",
    cats: cats.map(() => true),
    sort: "cat",
    weekOnly: false,
    showStore: true,
    focusWeek: false,
    first: true
  };

  const scroller = $("scroller");
  const scale = $("scale");
  const grid = $("grid");
  const rows = $("rows");
  const tip = $("tip");

  $("m-count").textContent = items.length;
  renderScale($("scaletrack"), region, NOW_W, state.week);
  renderGridLines($("lines"), region, NOW_W, state.week);

  /* ---------------- category pills ---------------- */
  const pills = $("pills");
  cats.forEach((c, i) => {
    const b = document.createElement("button");
    b.className = "pill";
    b.style.setProperty("--rgb", c.rgb);
    b.innerHTML = "<i></i>" + c.name;
    b.setAttribute("aria-pressed", "true");
    b.addEventListener("click", () => {
      state.cats[i] = !state.cats[i];
      b.classList.toggle("is-off", !state.cats[i]);
      b.setAttribute("aria-pressed", String(state.cats[i]));
      render();
    });
    pills.appendChild(b);
  });

  /* ---------------- rendering ---------------- */
  function render() {
    renderRows(rows, visibleItems(items, cats, state), cats, state);
    if (state.first) {
      grid.classList.add("anim");
      state.first = false;
      setTimeout(() => grid.classList.remove("anim"), 2800);
    }
    applyWeek(items, region, state, NOW_W);
  }

  function setWeek(w) {
    state.week = Math.max(1, Math.min(52, w));
    $("scrub").value = state.week;
    if (state.weekOnly) render(); else applyWeek(items, region, state, NOW_W);
  }

  /* ---------------- week reader controls ---------------- */
  $("scrub").addEventListener("input", e => { state.focusWeek = true; setWeek(+e.target.value); });
  $("b-prev").addEventListener("click", () => { state.focusWeek = true; setWeek(state.week - 1); });
  $("b-next").addEventListener("click", () => { state.focusWeek = true; setWeek(state.week + 1); });
  $("b-today").addEventListener("click", () => { state.focusWeek = false; setWeek(NOW_W); });

  document.addEventListener("keydown", e => {
    if (e.target.tagName === "INPUT" || e.target.tagName === "SELECT") return;
    if (e.key === "ArrowLeft") { state.focusWeek = true; setWeek(state.week - 1); e.preventDefault(); }
    else if (e.key === "ArrowRight") { state.focusWeek = true; setWeek(state.week + 1); e.preventDefault(); }
    else if (e.key === "Escape") closeDrawer();
  });

  /* ---------------- filters ---------------- */
  const qEl = $("q");
  let qT;
  qEl.addEventListener("input", () => {
    clearTimeout(qT);
    qT = setTimeout(() => { state.q = qEl.value; render(); }, 130);
  });

  $("sort").addEventListener("change", e => { state.sort = e.target.value; render(); });

  const tWeek = $("t-week");
  tWeek.addEventListener("click", () => {
    state.weekOnly = !state.weekOnly;
    if (state.weekOnly) state.focusWeek = true;
    tWeek.classList.toggle("is-on", state.weekOnly);
    render();
  });

  const tStore = $("t-store");
  tStore.addEventListener("click", () => {
    state.showStore = !state.showStore;
    tStore.classList.toggle("is-on", state.showStore);
    tStore.textContent = state.showStore ? "Showing storage & glasshouse" : "Field harvest only";
    render();
  });

  $("t-all").addEventListener("click", () => {
    state.q = ""; qEl.value = "";
    state.cats = cats.map(() => true);
    document.querySelectorAll(".pill").forEach(p => {
      p.classList.remove("is-off");
      p.setAttribute("aria-pressed", "true");
    });
    state.sort = "cat"; $("sort").value = "cat";
    state.weekOnly = false; tWeek.classList.remove("is-on");
    state.showStore = true; tStore.classList.add("is-on");
    tStore.textContent = "Showing storage & glasshouse";
    state.focusWeek = false; state.week = NOW_W;
    $("scrub").value = NOW_W;
    render();
  });

  /* ---------------- scroll sync + gutter ---------------- */
  scroller.addEventListener("scroll", () => {
    scale.scrollLeft = scroller.scrollLeft;
    tip.classList.remove("on");
  });

  function syncGutter() {
    const gutter = scroller.offsetWidth - scroller.clientWidth;
    document.documentElement.style.setProperty("--pad-r", gutter + "px");
  }

  /* the reader pins to the top, so the chart should take exactly the rest of the screen */
  function fitChart() {
    const rh = document.querySelector(".reader").offsetHeight;
    scroller.style.maxHeight = Math.max(240, window.innerHeight - rh - 52) + "px";
  }

  window.addEventListener("resize", () => { fitChart(); syncGutter(); });

  /* ---------------- tooltip + drawer ---------------- */
  initTooltip(grid, tip, items);

  $("d-close").addEventListener("click", closeDrawer);
  $("scrim").addEventListener("click", closeDrawer);

  grid.addEventListener("click", e => {
    const row = e.target.closest ? e.target.closest(".row") : null;
    if (row) activateRow(row, items, cats, state.week);
  });

  grid.addEventListener("keydown", e => {
    if (e.key !== "Enter" && e.key !== " ") return;
    const row = e.target.closest ? e.target.closest(".row") : null;
    if (row) { e.preventDefault(); activateRow(row, items, cats, state.week); }
  });

  /* ---------------- go ---------------- */
  $("scrub").value = state.week;
  render();
  fitChart();
  syncGutter();

  /* re-measure once fonts have settled, then centre the track on the current week */
  setTimeout(() => {
    fitChart();
    syncGutter();
    const lw = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--lw")) || 210;
    const trackW = grid.offsetWidth - lw;
    scroller.scrollLeft = Math.max(0, lw + trackW * (state.week - 1) / 52 - scroller.clientWidth * 0.5);
    scale.scrollLeft = scroller.scrollLeft;
  }, 80);
}

start(philadelphia);
