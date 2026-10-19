import { Pressable, StyleSheet } from 'react-native';

import { CurrencyBadge } from '@/components/currency-badge';
import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type CurrencyButtonProps = { code: string; name?: string; onPress: () => void };

/** Tappable currency chip that opens the currency picker. */
export function CurrencyButton({ code, name, onPress }: CurrencyButtonProps) {
  const theme = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Currency: ${name ?? code}. Tap to change.`}
      onPress={onPress}
      style={({ pressed }) => [styles.button, { backgroundColor: theme.background, opacity: pressed ? 0.7 : 1 }]}>
      <CurrencyBadge code={code} size={28} />
      <ThemedText type="smallBold">{code}</ThemedText>
      <ThemedText type="small" themeColor="textSecondary">
        ▾
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingVertical: Spacing.one,
    paddingLeft: Spacing.one,
    paddingRight: Spacing.three,
    borderRadius: Radius.pill,
  },
});
