import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { CurrencyBadge } from '@/components/currency-badge';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type CurrencyRowProps = {
  code: string;
  name?: string;
  trailing?: ReactNode;
  onPress: () => void;
  accessibilityHint?: string;
};

/** A list row for one currency: badge, code and name, plus optional trailing content. */
export function CurrencyRow({ code, name, trailing, onPress, accessibilityHint }: CurrencyRowProps) {
  const theme = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={name ? `${code}, ${name}` : code}
      accessibilityHint={accessibilityHint}
      onPress={onPress}
      style={({ pressed }) => [styles.row, { borderBottomColor: theme.border, opacity: pressed ? 0.6 : 1 }]}>
      <CurrencyBadge code={code} />
      <View style={styles.text}>
        <ThemedText type="smallBold">{code}</ThemedText>
        {name ? (
          <ThemedText type="small" themeColor="textSecondary" numberOfLines={1}>
            {name}
          </ThemedText>
        ) : null}
      </View>
      {trailing}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    paddingVertical: Spacing.two,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  text: { flex: 1, minWidth: 0 },
});
