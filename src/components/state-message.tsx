import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type StateMessageProps = {
  title: string;
  message?: string;
  loading?: boolean;
  actionLabel?: string;
  onAction?: () => void;
};

/** Centred loading, error or empty state with an optional next step. */
export function StateMessage({ title, message, loading, actionLabel, onAction }: StateMessageProps) {
  const theme = useTheme();
  return (
    <View style={styles.container}>
      {loading ? <ActivityIndicator color={theme.accent} /> : null}
      <ThemedText type="smallBold" style={styles.center}>
        {title}
      </ThemedText>
      {message ? (
        <ThemedText type="small" themeColor="textSecondary" style={styles.center}>
          {message}
        </ThemedText>
      ) : null}
      {actionLabel && onAction ? (
        <Pressable
          accessibilityRole="button"
          onPress={onAction}
          style={[styles.button, { backgroundColor: theme.accent }]}>
          <ThemedText type="smallBold" style={{ color: theme.onAccent }}>
            {actionLabel}
          </ThemedText>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center', gap: Spacing.two, paddingVertical: Spacing.six },
  center: { textAlign: 'center' },
  button: { marginTop: Spacing.two, paddingVertical: Spacing.two, paddingHorizontal: Spacing.four, borderRadius: Radius.pill },
});
