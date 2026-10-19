import { Tabs, TabList, TabSlot, TabTrigger, type TabListProps, type TabTriggerSlotProps } from 'expo-router/ui';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { MaxContentWidth, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

/** Web has no system tab bar, so draw a simple bottom bar that matches the app's style. */
export default function AppTabs() {
  return (
    <Tabs>
      <TabSlot style={{ flex: 1 }} />
      <TabList asChild>
        <TabBar>
          <TabTrigger name="index" href="/" asChild>
            <TabButton>Convert</TabButton>
          </TabTrigger>
          <TabTrigger name="rates" href="/rates" asChild>
            <TabButton>Rates</TabButton>
          </TabTrigger>
        </TabBar>
      </TabList>
    </Tabs>
  );
}

function TabBar({ children, style: _style, ...props }: TabListProps) {
  const theme = useTheme();
  return (
    <View {...props} style={[styles.bar, { backgroundColor: theme.background, borderTopColor: theme.border }]}>
      <View style={styles.inner}>{children}</View>
    </View>
  );
}

function TabButton({ children, isFocused, ref: _ref, ...props }: TabTriggerSlotProps) {
  const theme = useTheme();
  return (
    <Pressable {...props} style={StyleSheet.flatten([styles.button, isFocused && { backgroundColor: theme.accentSoft }])}>
      <ThemedText type="smallBold" style={{ color: isFocused ? theme.accent : theme.textSecondary }}>
        {children}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tabs: { flex: 1 },
  slot: { flex: 1 },
  bar: { borderTopWidth: StyleSheet.hairlineWidth, paddingVertical: Spacing.two },
  inner: {
    flexDirection: 'row',
    gap: Spacing.two,
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    paddingHorizontal: Spacing.three,
  },
  button: { flex: 1, alignItems: 'center', paddingVertical: Spacing.two, borderRadius: Radius.medium },
});
