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
import { resolveDishes, renderCookRow } from "./dishes.js";
import { closeDrawer, openDishDrawer, activateRow } from "./drawer.js";
import { initTooltip } from "./tooltip.js";

const $ = id => document.getElementById(id);

function start(region) {
  const cats = region.categories;
  const items = buildItems(region.crops);
  const dishes = resolveDishes(region.dishes, items);
  const NOW_W = todayWeek();

  const state = {
    week: NOW_W,
    q: "",
    cats: cats.map(() => true),
    sort: "cat",
    weekOnly: false,
    showStore: true,
    focusWeek: false,
    /* the resolved dish being highlighted in the chart, or null */
    dish: null,
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

  /* Everything downstream of the week that the reader itself shouldn't know
     about. An open dish drawer is repainted so its per-week ingredient
     statuses stay true while the week is being scrubbed. */
  function afterWeek() {
    renderCookRow($("r-cook"), dishes, state.week, state.dish);
    if (state.dish) openDishDrawer(state.dish, state.week);
  }

  function readWeek() {
    applyWeek(items, region, state, NOW_W, afterWeek);
  }

  function render() {
    renderRows(rows, visibleItems(items, cats, state), cats, state);
    if (state.first) {
      grid.classList.add("anim");
      state.first = false;
      setTimeout(() => grid.classList.remove("anim"), 2800);
    }
    readWeek();
  }

  function setWeek(w) {
    state.week = Math.max(1, Math.min(52, w));
    $("scrub").value = state.week;
    if (state.weekOnly) render(); else readWeek();
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
    else if (e.key === "Escape") dismiss();
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
    state.dish = null; closeDrawer();
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

  /* closeDrawer() lives in a module that can't reach state, so dropping the
     dish highlight has to happen here — which means every path that shuts the
     drawer goes through this, not through closeDrawer directly. */
  function dismiss() {
    const was = state.dish;
    state.dish = null;
    closeDrawer();
    readWeek();
    /* The chip that opened the drawer has been replaced by the re-render, so
       drawer.js can't hand focus back to it. Find its stand-in by name; if the
       dish has dropped off the row entirely there is nothing sensible to
       return to, and the reader keeps focus where closeDrawer left it. */
    if (!was) return;
    const chip = [...$("r-cook").querySelectorAll(".dchip")]
      .find(c => c.getAttribute("data-dish") === was.name);
    if (chip) chip.focus();
  }

  $("d-close").addEventListener("click", dismiss);
  $("scrim").addEventListener("click", dismiss);

  /* A crop and a dish are two different subjects for one drawer: picking a
     crop row drops any dish highlight first, so the chart and the drawer are
     never describing different things. */
  function showRow(row) {
    if (state.dish) { state.dish = null; readWeek(); }
    activateRow(row, items, cats, state.week);
  }

  grid.addEventListener("click", e => {
    const row = e.target.closest ? e.target.closest(".row") : null;
    if (row) showRow(row);
  });

  grid.addEventListener("keydown", e => {
    if (e.key !== "Enter" && e.key !== " ") return;
    const row = e.target.closest ? e.target.closest(".row") : null;
    if (row) { e.preventDefault(); showRow(row); }
  });

  /* ---------------- dish row ---------------- */

  /* Delegated: renderCookRow replaces the chips on every week change, so
     nothing can hold a reference to an individual button. Buttons give the
     keyboard Enter and Space without any handler of ours. */
  $("r-cook").addEventListener("click", e => {
    const chip = e.target.closest ? e.target.closest(".dchip") : null;
    if (!chip) return;
    const name = chip.getAttribute("data-dish");

    /* clicking the active chip again is the way back out */
    if (state.dish && state.dish.name === name) { dismiss(); return; }

    const dish = dishes.find(d => d.name === name);
    if (!dish) return;
    state.dish = dish;
    /* open first: this captures the chip as the element focus returns to,
       before readWeek() re-renders the row out from under it */
    openDishDrawer(dish, state.week);
    readWeek();
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
