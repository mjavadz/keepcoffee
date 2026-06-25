// Maps a Persian roast-level label to a representative bean color, so product
// cards and detail pages can show a consistent roast swatch.
const ROAST_COLORS = {
  'لایت': '#C49A6C',        // light roast — pale caramel
  'مدیوم': '#9C6B3F',       // medium roast — warm brown
  'مدیوم-دارک': '#6B4226',  // medium-dark — deep brown
  'دارک': '#3E2418',        // dark roast — near-espresso
};

export function roastColor(roast) {
  return ROAST_COLORS[roast?.trim()] || 'var(--color-secondary)';
}
