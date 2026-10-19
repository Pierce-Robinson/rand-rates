import { router } from 'expo-router';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { Banner } from '@/components/banner';
import { Screen } from '@/components/screen';
import { StateMessage } from '@/components/state-message';
import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useOnline } from '@/hooks/use-online';
import { useCurrencies, useLatestRates } from '@/hooks/use-rates';
import { useTheme } from '@/hooks/use-theme';
import { CurrencyButton } from '@/screens/convert/currency-button';
import { FavouriteConversions } from '@/screens/convert/favourite-conversions';
import { useConversion } from '@/state/conversion';
import { convert, formatMoney, formatRate, formatRateDate, parseAmount } from '@/utils/currency';

export function Convert() {
  const theme = useTheme();
  const online = useOnline();
  const { amountText, setAmountText, from, to, swap } = useConversion();
  const latest = useLatestRates();
  const currencies = useCurrencies();

  const rates = latest.data?.rates;
  const amount = parseAmount(amountText);
  const result = rates && amount !== null ? convert(amount, from, to, rates) : null;
  const unitRate = rates ? convert(1, from, to, rates) : null;

  return (
    <Screen>
      <ThemedText type="subtitle" style={styles.title}>
        Convert
      </ThemedText>

      {latest.data && (!online || latest.error) ? (
        <Banner
          message={`${online ? 'Could not refresh.' : 'Offline.'} Showing rates from ${formatRateDate(latest.data.date)}.`}
          actionLabel={online ? 'Retry' : undefined}
          onAction={() => latest.refetch()}
        />
      ) : null}

      {!latest.data ? (
        latest.error ? (
          <StateMessage
            title="Rates unavailable"
            message={latest.error.message}
            actionLabel="Try again"
            onAction={() => latest.refetch()}
          />
        ) : !online ? (
          <StateMessage title="You're offline" message="Connect once to download today's rates; after that they work offline." />
        ) : (
          <StateMessage loading title="Loading today's rates…" />
        )
      ) : (
        <>
          <View style={[styles.card, { backgroundColor: theme.backgroundElement }]}>
            <ThemedText type="small" themeColor="textSecondary">
              Amount
            </ThemedText>
            <View style={styles.amountRow}>
              <TextInput
                value={amountText}
                onChangeText={setAmountText}
                keyboardType="decimal-pad"
                inputMode="decimal"
                accessibilityLabel="Amount to convert"
                placeholder="0"
                placeholderTextColor={theme.textSecondary}
                style={[styles.amountInput, { color: theme.text }]}
              />
              <CurrencyButton code={from} name={currencies.data?.[from]} onPress={() => router.push('/pick-currency?field=from')} />
            </View>
            {amount === null && amountText.trim() !== '' ? (
              <ThemedText type="small" style={{ color: theme.negative }}>
                Enter a number, like 1500 or 1 500,50
              </ThemedText>
            ) : null}

            <View style={styles.swapRow}>
              <View style={[styles.divider, { backgroundColor: theme.border }]} />
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Swap ${from} and ${to}`}
                onPress={swap}
                style={[styles.swap, { backgroundColor: theme.accent }]}>
                <ThemedText type="smallBold" style={{ color: theme.onAccent }}>
                  ⇅
                </ThemedText>
              </Pressable>
              <View style={[styles.divider, { backgroundColor: theme.border }]} />
            </View>

            <ThemedText type="small" themeColor="textSecondary">
              Converted
            </ThemedText>
            <View style={styles.amountRow}>
              <ThemedText
                style={styles.result}
                numberOfLines={1}
                adjustsFontSizeToFit
                accessibilityLiveRegion="polite">
                {result === null ? '–' : formatMoney(result, to)}
              </ThemedText>
              <CurrencyButton code={to} name={currencies.data?.[to]} onPress={() => router.push('/pick-currency?field=to')} />
            </View>
          </View>

          {unitRate !== null ? (
            <ThemedText type="small" themeColor="textSecondary" style={styles.rateLine}>
              1 {from} = {formatRate(unitRate)} {to} · ECB reference rate, {formatRateDate(latest.data.date)}
            </ThemedText>
          ) : null}

          {amount !== null && rates ? <FavouriteConversions amount={amount} from={from} to={to} rates={rates} /> : null}
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { marginTop: Spacing.three, marginBottom: Spacing.three },
  card: { borderRadius: Radius.large, padding: Spacing.three, gap: Spacing.one },
  amountRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three },
  amountInput: { flex: 1, fontSize: 34, fontWeight: '600', paddingVertical: Spacing.two, minWidth: 0 },
  result: { flex: 1, fontSize: 34, lineHeight: 44, fontWeight: '600', paddingVertical: Spacing.two },
  swapRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two, marginVertical: Spacing.two },
  divider: { flex: 1, height: StyleSheet.hairlineWidth },
  swap: { width: 40, height: 40, borderRadius: Radius.pill, alignItems: 'center', justifyContent: 'center' },
  rateLine: { marginTop: Spacing.two, marginHorizontal: Spacing.one },
});
