import { StyleSheet, TextInput } from 'react-native';

import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type SearchFieldProps = { value: string; onChangeText: (text: string) => void; placeholder: string };

export function SearchField({ value, onChangeText, placeholder }: SearchFieldProps) {
  const theme = useTheme();
  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={theme.textSecondary}
      autoCorrect={false}
      autoCapitalize="none"
      clearButtonMode="while-editing"
      accessibilityLabel={placeholder}
      style={[styles.input, { backgroundColor: theme.backgroundElement, color: theme.text }]}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    fontSize: 16,
    paddingVertical: Spacing.two + 2,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.medium,
    marginBottom: Spacing.two,
  },
});
