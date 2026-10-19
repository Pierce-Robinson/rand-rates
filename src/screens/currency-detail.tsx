import { router, Stack } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { LineChart } from '@/components/line-chart';
import { Screen } from '@/components/screen';
import { SegmentedControl } from '@/components/segmented-control';
import { StateMessage } from '@/components/state-message';
import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { HISTORY_RANGES, useCurrencies, useHistory, useLatestRates, type HistoryRange } from '@/hooks/use-rates';
import { useTheme } from '@/hooks/use-theme';
import { useConversion } from '@/state/conversion';
import { useFavourites } from '@/state/favourites';
import { BASE_CURRENCY, formatMoney, formatPercent, formatRateDate, randPerUnit, seriesStats } from '@/utils/currency';

const RANGES = Object.keys(HISTORY_RANGES) as HistoryRange[];

/** One currency's rand price today, its history chart and quick actions. */
export function CurrencyDetail({ code }: { code: string }) {
  const theme = useTheme();
  const [range, setRange] = useState<HistoryRange>('1M');
  const latest = useLatestRates();
  const currencies = useCurrencies();
  const history = useHistory(code, range);
  const { isFavourite, toggle } = useFavourites();
  const { setCurrency } = useConversion();

  const name = currencies.data?.[code] ?? code;
  const price = latest.data ? randPerUnit(code, latest.data.rates) : null;
  // The API gives units per rand; flip to rand per unit, which is how people think about it.
  const series = (history.data ?? []).map((p) => 1 / p.rate);
  const stats = seriesStats(series);
  const favourite = isFavourite(code);
  // A year-long chart needs the year on its axis, or "17 Oct" to "16 Oct" is ambiguous.
  const axisDateFormat: Intl.DateTimeFormatOptions =
    range === '1Y'
      ? { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }
      : { day: 'numeric', month: 'short', timeZone: 'UTC' };

  const convertThis = () => {
    setCurrency('from', code);
    setCurrency('to', BASE_CURRENCY);
    router.dismissTo('/');
  };

  if (code === BASE_CURRENCY) {
    return (
      <Screen edges={[]}>
        <Stack.Screen options={{ title: 'ZAR' }} />
        <StateMessage title="South African Rand" message="All rates in this app are quoted against the rand." />
      </Screen>
    );
  }

  return (
    <Screen edges={[]}>
      <Stack.Screen
        options={{
          title: code,
          headerRight: () => (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={favourite ? `Remove ${code} from favourites` : `Add ${code} to favourites`}
              hitSlop={10}
              style={styles.headerButton}
              onPress={() => toggle(code)}>
              <ThemedText style={{ color: favourite ? theme.accent : theme.textSecondary, fontSize: 22 }}>
                {favourite ? '★' : '☆'}
              </ThemedText>
            </Pressable>
          ),
        }}
      />

      <ThemedText type="small" themeColor="textSecondary" style={styles.name}>
        {name}
      </ThemedText>
      <ThemedText type="subtitle">{price === null ? '–' : formatMoney(price, 'ZAR', price < 1 ? 4 : 2)}</ThemedText>
      {stats ? (
        <ThemedText type="smallBold" style={{ color: stats.changePercent >= 0 ? theme.positive : theme.negative }}>
          {stats.changePercent >= 0 ? '▲' : '▼'} {formatPercent(stats.changePercent)} over {range}
        </ThemedText>
      ) : null}

      <View style={styles.rangeRow}>
        <SegmentedControl options={RANGES} value={range} onChange={setRange} />
      </View>

      <View style={[styles.chartCard, { backgroundColor: theme.backgroundElement }]}>
        {history.data && series.length > 1 ? (
          <>
            <LineChart
              values={series}
              accessibilityLabel={`Rand price of ${code} over ${range}: from ${formatMoney(stats!.first, 'ZAR')} to ${formatMoney(stats!.last, 'ZAR')}`}
            />
            <View style={styles.axis}>
              <ThemedText type="small" themeColor="textSecondary">
                {formatRateDate(history.data[0].date, axisDateFormat)}
              </ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                {formatRateDate(history.data[history.data.length - 1].date, axisDateFormat)}
              </ThemedText>
            </View>
          </>
        ) : history.error ? (
          <StateMessage title="History unavailable" message={history.error.message} actionLabel="Try again" onAction={() => history.refetch()} />
        ) : history.data ? (
          <StateMessage title="Not enough data for this period" />
        ) : (
          <StateMessage
            loading
            title="Loading history…"
            // The free rates service can take a while the first time a date range is requested.
            message={history.failureCount > 0 ? 'The rates service is slow to respond. Still trying…' : undefined}
          />
        )}
      </View>

      {stats ? (
        <View style={styles.stats}>
          <Stat label="Low" value={formatMoney(stats.low, 'ZAR', stats.low < 1 ? 4 : 2)} />
          <Stat label="High" value={formatMoney(stats.high, 'ZAR', stats.high < 1 ? 4 : 2)} />
          <Stat label="Data points" value={String(series.length)} />
        </View>
      ) : null}

      <Pressable accessibilityRole="button" onPress={convertThis} style={[styles.convert, { backgroundColor: theme.accent }]}>
        <ThemedText type="smallBold" style={{ color: theme.onAccent }}>
          Convert {code} to ZAR
        </ThemedText>
      </Pressable>

      <ThemedText type="small" themeColor="textSecondary" style={styles.footnote}>
        European Central Bank reference rates, published once per working day.
      </ThemedText>
    </Screen>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  const theme = useTheme();
  return (
    <View style={[styles.stat, { backgroundColor: theme.backgroundElement }]}>
      <ThemedText type="small" themeColor="textSecondary">
        {label}
      </ThemedText>
      <ThemedText type="smallBold">{value}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  headerButton: { paddingHorizontal: Spacing.three },
  name: { marginTop: Spacing.three },
  rangeRow: { marginTop: Spacing.four, marginBottom: Spacing.three },
  chartCard: { borderRadius: Radius.large, padding: Spacing.three, minHeight: 220, justifyContent: 'center' },
  axis: { flexDirection: 'row', justifyContent: 'space-between', marginTop: Spacing.two },
  stats: { flexDirection: 'row', gap: Spacing.two, marginTop: Spacing.three },
  stat: { flex: 1, borderRadius: Radius.medium, padding: Spacing.three, gap: Spacing.half },
  convert: { marginTop: Spacing.four, borderRadius: Radius.pill, paddingVertical: Spacing.three, alignItems: 'center' },
  footnote: { marginTop: Spacing.three, textAlign: 'center' },
});
