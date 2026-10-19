import type { Rates } from '@/utils/currency';

/**
 * Frankfurter: free, key-less exchange rates published by the European Central Bank.
 * Rates update once per working day, around 16:00 CET.
 * https://frankfurter.dev
 */
const API_URL = process.env.EXPO_PUBLIC_RATES_API_URL ?? 'https://api.frankfurter.dev/v1';

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function getJson<T>(path: string, signal?: AbortSignal): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, { signal });
  } catch (error) {
    if ((error as Error)?.name === 'AbortError') {
      throw error;
    }
    throw new ApiError('Could not reach the rates service. Check your connection.', 0);
  }
  if (!response.ok) {
    throw new ApiError(`The rates service returned an error (${response.status}).`, response.status);
  }
  return (await response.json()) as T;
}

export type LatestRates = { base: string; date: string; rates: Rates };

export function fetchLatest(base: string, signal?: AbortSignal): Promise<LatestRates> {
  return getJson<LatestRates>(`/latest?base=${encodeURIComponent(base)}`, signal);
}

/** Currency codes and their English names, e.g. { USD: "United States Dollar" }. */
export function fetchCurrencies(signal?: AbortSignal): Promise<Record<string, string>> {
  return getJson<Record<string, string>>('/currencies', signal);
}

export type HistoryPoint = { date: string; rate: number };

type HistoryResponse = { rates: Record<string, Record<string, number>> };

/** Daily rates for one currency against the base, oldest first. Weekends and holidays are skipped. */
export async function fetchHistory(
  base: string,
  symbol: string,
  from: string,
  to: string,
  signal?: AbortSignal,
): Promise<HistoryPoint[]> {
  const data = await getJson<HistoryResponse>(
    `/${from}..${to}?base=${encodeURIComponent(base)}&symbols=${encodeURIComponent(symbol)}`,
    signal,
  );
  return Object.entries(data.rates)
    .map(([date, rates]) => ({ date, rate: rates[symbol] }))
    .filter((point): point is HistoryPoint => typeof point.rate === 'number')
    .sort((a, b) => a.date.localeCompare(b.date));
}

/** Formats a Date as YYYY-MM-DD for the API. */
export function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}
