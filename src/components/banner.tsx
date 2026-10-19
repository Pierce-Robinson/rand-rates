import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type BannerProps = {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
};

/** Non-blocking notice, e.g. "Offline: showing rates from 16 Oct". Content stays usable beneath it. */
export function Banner({ message, actionLabel, onAction }: BannerProps) {
  const theme = useTheme();
  return (
    <View
      accessibilityRole="alert"
      style={[styles.banner, { backgroundColor: theme.warningSoft, borderColor: theme.border }]}>
      <ThemedText type="small" style={[styles.message, { color: theme.warning }]}>
        {message}
      </ThemedText>
      {actionLabel && onAction ? (
        <Pressable accessibilityRole="button" onPress={onAction} hitSlop={8}>
          <ThemedText type="smallBold" style={{ color: theme.warning }}>
            {actionLabel}
          </ThemedText>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.medium,
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: Spacing.three,
  },
  message: { flex: 1 },
});
