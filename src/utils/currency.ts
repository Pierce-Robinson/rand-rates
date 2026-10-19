/** Rates as returned by the API: units of each currency per 1 unit of the base (ZAR). */
export type Rates = Record<string, number>;

export const BASE_CURRENCY = 'ZAR';

/**
 * Converts between any two currencies using rates quoted against one base.
 * With a ZAR base, 100 USD -> EUR is 100 / rates.USD * rates.EUR.
 */
export function convert(amount: number, from: string, to: string, rates: Rates): number | null {
  const fromRate = rateFor(from, rates);
  const toRate = rateFor(to, rates);
  if (fromRate === null || toRate === null || !Number.isFinite(amount)) {
    return null;
  }
  return (amount / fromRate) * toRate;
}

/** How many rand one unit of a currency costs, e.g. 1 USD = R16.43. */
export function randPerUnit(code: string, rates: Rates): number | null {
  const rate = rateFor(code, rates);
  return rate === null ? null : 1 / rate;
}

function rateFor(code: string, rates: Rates): number | null {
  if (code === BASE_CURRENCY) {
    return 1;
  }
  const rate = rates[code];
  return typeof rate === 'number' && rate > 0 ? rate : null;
}

/**
 * Parses what people type into an amount field. Accepts "1500", "1 500,50" and "1,500.50".
 * Returns null for anything that isn't a non-negative number.
 */
export function parseAmount(text: string): number | null {
  const compact = text.replace(/[\s ]/g, '');
  if (compact === '') {
    return null;
  }
  let normalised = compact;
  const lastComma = compact.lastIndexOf(',');
  const lastDot = compact.lastIndexOf('.');
  if (lastComma > lastDot) {
    // Comma is the decimal separator (South African style): drop dots, comma -> dot.
    normalised = compact.replace(/\./g, '').replace(',', '.');
  } else {
    // Dot is the decimal separator: commas are thousands separators.
    normalised = compact.replace(/,/g, '');
  }
  if (!/^\d*\.?\d*$/.test(normalised) || normalised === '.') {
    return null;
  }
  const value = Number(normalised);
  return Number.isFinite(value) ? value : null;
}

/** Formats money in the user's South African style, e.g. "R 1 642,50" or "US$ 61,00". */
export function formatMoney(value: number, currency: string, maximumFractionDigits = 2): string {
  try {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency,
      maximumFractionDigits,
      minimumFractionDigits: Math.min(2, maximumFractionDigits),
    }).format(value);
  } catch {
    return `${value.toFixed(maximumFractionDigits)} ${currency}`;
  }
}

/** Formats a rate with enough precision to be useful for both 16.43 and 0.0012. */
export function formatRate(value: number): string {
  const digits = value >= 100 ? 2 : value >= 1 ? 4 : 6;
  return new Intl.NumberFormat('en-ZA', { maximumFractionDigits: digits, minimumFractionDigits: 2 }).format(value);
}

/** Formats a percentage change the South African way, e.g. 0.99 -> "0,99%" (sign shown separately). */
export function formatPercent(percent: number): string {
  return `${new Intl.NumberFormat('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Math.abs(percent))}%`;
}

/** Formats an API date (YYYY-MM-DD) for display, e.g. "Fri, 16 Oct 2026". */
export function formatRateDate(isoDate: string, options?: Intl.DateTimeFormatOptions): string {
  const date = new Date(`${isoDate}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) {
    return isoDate;
  }
  return new Intl.DateTimeFormat(
    'en-ZA',
    options ?? { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' },
  ).format(date);
}

export type SeriesStats ={ first: number; last: number; low: number; high: number; changePercent: number };

/** Summary numbers for a rate history chart. */
export function seriesStats(values: number[]): SeriesStats | null {
  if (values.length === 0) {
    return null;
  }
  const first = values[0];
  const last = values[values.length - 1];
  return {
    first,
    last,
    low: Math.min(...values),
    high: Math.max(...values),
    changePercent: first === 0 ? 0 : ((last - first) / first) * 100,
  };
}
