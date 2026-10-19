import { useQuery } from '@tanstack/react-query';

import { fetchCurrencies, fetchHistory, fetchLatest, isoDate } from '@/api/frankfurter';
import { BASE_CURRENCY } from '@/utils/currency';

const HOUR = 60 * 60 * 1000;

/** Today's rates against the rand. The ECB publishes once per working day, so an hour is fresh enough. */
export function useLatestRates() {
  return useQuery({
    queryKey: ['latest', BASE_CURRENCY],
    queryFn: ({ signal }) => fetchLatest(BASE_CURRENCY, signal),
    staleTime: HOUR,
  });
}

/** Currency names. These almost never change. */
export function useCurrencies() {
  return useQuery({
    queryKey: ['currencies'],
    queryFn: ({ signal }) => fetchCurrencies(signal),
    staleTime: 24 * HOUR,
  });
}

export const HISTORY_RANGES = { '1M': 30, '3M': 90, '1Y': 365 } as const;
export type HistoryRange = keyof typeof HISTORY_RANGES;

/** Daily history for one currency against the rand. */
export function useHistory(code: string, range: HistoryRange) {
  return useQuery({
    queryKey: ['history', BASE_CURRENCY, code, range],
    queryFn: ({ signal }) => {
      const to = new Date();
      const from = new Date(to.getTime() - HISTORY_RANGES[range] * 24 * HOUR);
      return fetchHistory(BASE_CURRENCY, code, isoDate(from), isoDate(to), signal);
    },
    staleTime: 6 * HOUR,
    enabled: code !== BASE_CURRENCY,
  });
}
