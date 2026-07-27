/**
 * Week and date arithmetic.
 *
 * The track is exactly 52 weeks = 364 days wide. Everything maps into that
 * space, so week percentages and calendar-day percentages use different
 * helpers and must not be mixed.
 */

export const MABB = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const DAY = 86400000;
const SPAN = 364;

export const YEAR = new Date().getFullYear();

const JAN1 = new Date(YEAR, 0, 1);

/** Day of year (1-based) for the first of month `m`. */
export function doyOf(m) {
  return Math.round((new Date(YEAR, m, 1) - JAN1) / DAY) + 1;
}

/** Position of a calendar day, as a percentage of the 364-day track. */
export function dayPct(doy) {
  return Math.max(0, Math.min(100, (doy - 1) / SPAN * 100));
}

/** Left edge of week `w`, as a percentage of the track. */
export function pc(w) {
  return (w - 1) / 52 * 100;
}

/** Width of the inclusive week range a..b, as a percentage of the track. */
export function pw(a, b) {
  return (b - a + 1) / 52 * 100;
}

export function weekStart(w) {
  return new Date(YEAR, 0, 1 + (w - 1) * 7);
}

export function weekEnd(w) {
  return w === 52 ? new Date(YEAR, 11, 31) : new Date(YEAR, 0, 1 + (w - 1) * 7 + 6);
}

export function fmt(d) {
  return MABB[d.getMonth()] + " " + d.getDate();
}

export function rangeText(a, b) {
  return fmt(weekStart(a)) + " – " + fmt(weekEnd(b));
}

export function todayWeek() {
  const n = new Date();
  const doy = Math.floor(
    (new Date(n.getFullYear(), n.getMonth(), n.getDate()) - new Date(n.getFullYear(), 0, 1)) / DAY
  ) + 1;
  return Math.max(1, Math.min(52, Math.ceil(doy / 7)));
}

/** Left/right edges of each month, as percentages of the track. */
export function monthEdges() {
  const start = [], end = [];
  for (let mi = 0; mi < 12; mi++) {
    start[mi] = dayPct(doyOf(mi));
    end[mi] = mi < 11 ? dayPct(doyOf(mi + 1)) : 100;
  }
  return { start, end };
}

/** Position of a {month, day} marker, as a percentage of the track. */
export function markPct(mark) {
  return dayPct(doyOf(mark.month) + mark.day - 1);
}

/** Season label for week `w`, from a region's `seasons` table. */
export function seasonName(seasons, w) {
  for (const s of seasons) {
    if (w <= s.until) return s.name;
  }
  return seasons[seasons.length - 1].name;
}
