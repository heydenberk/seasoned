/**
 * Measures the crop notes for the tics that made them read as machine-written.
 *
 * The original 127 notes all landed in a ~40-character band and resolved in
 * one or two sentences. That uniformity was the tell, more than any word
 * choice, so length spread is the first thing reported.
 *
 * Usage: node scripts/prose-stats.mjs [fromCategory] [toCategory]
 */

import { philadelphia } from "../js/data/philadelphia.js";

const from = Number(process.argv[2] ?? 0);
const to = Number(process.argv[3] ?? philadelphia.categories.length - 1);

const notes = philadelphia.crops
  .filter(([, cat]) => cat >= from && cat <= to)
  .map(r => r[3]);

const n = notes.length;
const lens = notes.map(s => s.length).sort((a, b) => a - b);
const count = re => notes.filter(s => re.test(s)).length;
const pct = c => Math.round((c / n) * 100);

const long = lens.filter(l => l > 200).length;
const short = lens.filter(l => l < 45).length;
const dash = count(/—/);
const imper = count(/(^|\. )(Buy|Take|Keep|Smell|Grate|Wait|Peel|Cut|Make|Look|Sow|Treat|Double|Eat|Cook|Ask)\b[^.]*\.?$/);
const intens = count(/\b(genuinely|entirely|wildly|extraordinar|aggressively|frankly|absolutely|utterly|truly|completely|considerably|measurably|magnificent|superb|excellent)/i);

/* Sentence counts, to check the old rigid one-or-two pattern is broken. */
const sentences = notes.map(s => (s.match(/[.!?](?:\s|$)/g) || []).length);
const spread = {};
for (const s of sentences) spread[s] = (spread[s] || 0) + 1;

console.log(`categories ${from}-${to}: ${n} notes`);
console.log(`  length      min ${lens[0]}  p10 ${lens[Math.floor(n * 0.1)]}  median ${lens[n >> 1]}  p90 ${lens[Math.floor(n * 0.9)]}  max ${lens[n - 1]}`);
console.log(`  over 200ch  ${long}   (target >= 6 per half)`);
console.log(`  under 45ch  ${short}   (target >= 6 per half)`);
console.log(`  em-dash     ${dash} (${pct(dash)}%)  (target < 8%)`);
console.log(`  imperative  ${imper}   (target <= 3 per half)`);
console.log(`  intensifier ${intens} (${pct(intens)}%)  (target < 4%)`);
console.log(`  sentences   ${Object.entries(spread).map(([k, v]) => `${k}:${v}`).join("  ")}`);
