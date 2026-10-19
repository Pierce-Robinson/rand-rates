import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, Pressable, RefreshControl, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Banner } from '@/components/banner';
import { CurrencyRow } from '@/components/currency-row';
import { SearchField } from '@/components/search-field';
import { StateMessage } from '@/components/state-message';
import { ThemedText } from '@/components/themed-text';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useOnline } from '@/hooks/use-online';
import { useCurrencies, useLatestRates } from '@/hooks/use-rates';
import { useTheme } from '@/hooks/use-theme';
import { useFavourites } from '@/state/favourites';
import { formatMoney, formatRateDate, randPerUnit } from '@/utils/currency';
import { filterCurrencies } from '@/utils/search';

export function Rates() {
  const theme = useTheme();
  const online = useOnline();
  const [query, setQuery] = useState('');
  const latest = useLatestRates();
  const currencies = useCurrencies();
  const { favourites, isFavourite, toggle } = useFavourites();

  const codes = useMemo(() => {
    if (!latest.data) return [];
    return filterCurrencies(Object.keys(latest.data.rates), currencies.data ?? {}, query, favourites);
  }, [latest.data, currencies.data, query, favourites]);

  const header = (
    <View>
      <ThemedText type="subtitle" style={styles.title}>
        Rates
      </ThemedText>
      <ThemedText type="small" themeColor="textSecondary" style={styles.subtitle}>
        {latest.data ? `Rand price of one unit · ${formatRateDate(latest.data.date)}` : 'Rand price of one unit'}
      </ThemedText>
      {latest.data && (!online || latest.error) ? (
        <Banner
          message={online ? 'Could not refresh. Showing saved rates.' : 'Offline. Showing saved rates.'}
          actionLabel={online ? 'Retry' : undefined}
          onAction={() => latest.refetch()}
        />
      ) : null}
      <SearchField value={query} onChangeText={setQuery} placeholder="Search currencies" />
    </View>
  );

  const empty = !latest.data ? (
    latest.error ? (
      <StateMessage title="Rates unavailable" message={latest.error.message} actionLabel="Try again" onAction={() => latest.refetch()} />
    ) : (
      <StateMessage loading={online} title={online ? 'Loading rates…' : "You're offline"} />
    )
  ) : (
    <StateMessage title={`No currencies match "${query}"`} actionLabel="Clear search" onAction={() => setQuery('')} />
  );

  return (
    <SafeAreaView edges={['top']} style={[styles.root, { backgroundColor: theme.background }]}>
      <FlatList
        data={codes}
        keyExtractor={(code) => code}
        ListHeaderComponent={header}
        ListEmptyComponent={empty}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={latest.isRefetching} onRefresh={() => {
              void latest.refetch();
            }} tintColor={theme.accent} />
        }
        renderItem={({ item: code }) => {
          const price = latest.data ? randPerUnit(code, latest.data.rates) : null;
          const favourite = isFavourite(code);
          return (
            <CurrencyRow
              code={code}
              name={currencies.data?.[code]}
              accessibilityHint="Opens the rate history"
              onPress={() => router.push(`/currency/${code}`)}
              trailing={
                <View style={styles.trailing}>
                  <ThemedText type="smallBold">{price === null ? '–' : formatMoney(price, 'ZAR', price < 1 ? 4 : 2)}</ThemedText>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={favourite ? `Remove ${code} from favourites` : `Add ${code} to favourites`}
                    hitSlop={10}
                    onPress={() => toggle(code)}>
                    <ThemedText style={{ color: favourite ? theme.accent : theme.textSecondary, fontSize: 20 }}>
                      {favourite ? '★' : '☆'}
                    </ThemedText>
                  </Pressable>
                </View>
              }
            />
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: {
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.five,
  },
  title: { marginTop: Spacing.three },
  subtitle: { marginBottom: Spacing.three },
  trailing: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three },
});
