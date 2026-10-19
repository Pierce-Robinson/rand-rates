import { Link } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { CurrencyBadge } from '@/components/currency-badge';
import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useFavourites } from '@/state/favourites';
import { BASE_CURRENCY, convert, formatMoney, type Rates } from '@/utils/currency';

type Props = { amount: number; from: string; to: string; rates: Rates };

/** The same amount converted into each favourite currency, for a quick comparison. */
export function FavouriteConversions({ amount, from, to, rates }: Props) {
  const theme = useTheme();
  const { favourites } = useFavourites();
  // Skip the two currencies already shown in the converter above.
  const codes = [BASE_CURRENCY, ...favourites].filter(
    (code, i, all) => code !== from && code !== to && all.indexOf(code) === i,
  );

  if (codes.length === 0) {
    return null;
  }

  return (
    <View style={styles.section}>
      <ThemedText type="smallBold" themeColor="textSecondary" style={styles.heading}>
        {formatMoney(amount, from)} in your favourites
      </ThemedText>
      <View style={[styles.list, { backgroundColor: theme.backgroundElement }]}>
        {codes.map((code, index) => {
          const value = convert(amount, from, code, rates);
          return (
            <Link key={code} href={`/currency/${code}`} asChild>
              <Pressable
                accessibilityRole="link"
                // Link's Slot needs a flat style object, not an array.
                style={StyleSheet.flatten([styles.row, index > 0 && { borderTopColor: theme.border, borderTopWidth: StyleSheet.hairlineWidth }])}>
                <CurrencyBadge code={code} size={32} />
                <ThemedText style={styles.code}>{code}</ThemedText>
                <ThemedText type="smallBold">{value === null ? '–' : formatMoney(value, code)}</ThemedText>
              </Pressable>
            </Link>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginTop: Spacing.four },
  heading: { marginBottom: Spacing.two, marginHorizontal: Spacing.one },
  list: { borderRadius: Radius.large, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three, paddingVertical: Spacing.two, paddingHorizontal: Spacing.three },
  code: { flex: 1 },
});
