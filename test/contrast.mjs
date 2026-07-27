/**
 * WCAG relative-luminance and contrast maths, plus a reader for the values in
 * the :root block, so palette assertions run against the real stylesheet
 * rather than a copy of the numbers.
 */

export function hexToRgb(hex) {
  const h = hex.replace("#", "");
  return [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16));
}

const toLinear = c => {
  const s = c / 255;
  return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
};

export const luminance = ([r, g, b]) =>
  0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);

export function ratio(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/** Composite `fg` at `alpha` over `bg`. */
export const over = (fg, bg, alpha) => fg.map((c, i) => c * alpha + bg[i] * (1 - alpha));

/**
 * Pull a custom property's value out of the :root block. Strips /* … *\/
 * comments first — the stylesheet's leading block comment references token
 * names like `--ink-rgb:` and `--earth-rgb:` in prose, and without stripping,
 * the naive regex below matches that prose instead of the real declaration.
 */
export function token(css, name) {
  const stripped = css.replace(/\/\*[\s\S]*?\*\//g, "");
  const m = stripped.match(new RegExp(`--${name}\\s*:\\s*([^;]+);`));
  if (!m) throw new Error(`token --${name} not found`);
  return m[1].trim();
}

/**
 * Resolve a colour token to an [r,g,b] triple. `--ink` is declared as
 * `rgb(var(--ink-rgb))` rather than a literal hex, so `token(css, "ink")`
 * returns that string, not a colour — this reads the `--ink-rgb` triple
 * instead when asked to resolve `"ink"`.
 */
export function resolveRgb(css, name) {
  if (name === "ink") {
    return token(css, "ink-rgb").split(",").map(n => parseInt(n.trim(), 10));
  }
  return hexToRgb(token(css, name));
}
