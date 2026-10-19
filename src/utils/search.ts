/**
 * Filters and orders currencies for a list: favourites first, then alphabetical by code.
 * The search matches the code or the name, case-insensitively.
 */
export function filterCurrencies(
  codes: string[],
  names: Record<string, string>,
  query: string,
  favourites: string[] = [],
): string[] {
  const q = query.trim().toLowerCase();
  return codes
    .filter((code) => !q || code.toLowerCase().includes(q) || (names[code] ?? '').toLowerCase().includes(q))
    .sort((a, b) => {
      const favA = favourites.includes(a) ? 0 : 1;
      const favB = favourites.includes(b) ? 0 : 1;
      return favA - favB || a.localeCompare(b);
    });
}
