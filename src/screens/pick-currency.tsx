import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

import { CurrencyRow } from '@/components/currency-row';
import { SearchField } from '@/components/search-field';
import { StateMessage } from '@/components/state-message';
import { ThemedText } from '@/components/themed-text';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useCurrencies, useLatestRates } from '@/hooks/use-rates';
import { useTheme } from '@/hooks/use-theme';
import { useConversion, type CurrencyField } from '@/state/conversion';
import { useFavourites } from '@/state/favourites';
import { BASE_CURRENCY } from '@/utils/currency';
import { filterCurrencies } from '@/utils/search';

/** Modal list for choosing the "from" or "to" currency on the Convert screen. */
export function PickCurrency({ field }: { field: CurrencyField }) {
  const theme = useTheme();
  const [query, setQuery] = useState('');
  const latest = useLatestRates();
  const currencies = useCurrencies();
  const { favourites } = useFavourites();
  const conversion = useConversion();
  const selected = conversion[field];

  const codes = useMemo(() => {
    if (!latest.data) return [];
    return filterCurrencies([BASE_CURRENCY, ...Object.keys(latest.data.rates)], currencies.data ?? {}, query, [
      BASE_CURRENCY,
      ...favourites,
    ]);
  }, [latest.data, currencies.data, query, favourites]);

  const choose = (code: string) => {
    conversion.setCurrency(field, code);
    router.back();
  };

  return (
    <View style={[styles.root, { backgroundColor: theme.background }]}>
      <FlatList
        data={codes}
        keyExtractor={(code) => code}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.content}
        ListHeaderComponent={<SearchField value={query} onChangeText={setQuery} placeholder="Search by code or name" />}
        ListEmptyComponent={
          latest.data ? (
            <StateMessage title={`No currencies match "${query}"`} actionLabel="Clear search" onAction={() => setQuery('')} />
          ) : (
            <StateMessage loading title="Loading currencies…" />
          )
        }
        renderItem={({ item: code }) => (
          <CurrencyRow
            code={code}
            name={currencies.data?.[code] ?? (code === BASE_CURRENCY ? 'South African Rand' : undefined)}
            onPress={() => choose(code)}
            trailing={code === selected ? <ThemedText style={{ color: theme.accent }}>✓</ThemedText> : null}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: {
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.three,
    paddingBottom: Spacing.five,
  },
});
