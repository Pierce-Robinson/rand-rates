import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

/** Round badge with the currency code, used in lists and pickers. */
export function CurrencyBadge({ code, size = 40 }: { code: string; size?: number }) {
  const theme = useTheme();
  return (
    <View
      style={[
        styles.badge,
        { width: size, height: size, backgroundColor: theme.accentSoft, borderRadius: Radius.pill },
      ]}>
      <ThemedText type="smallBold" style={{ color: theme.accent, fontSize: size * 0.3 }}>
        {code}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { alignItems: 'center', justifyContent: 'center' },
});
