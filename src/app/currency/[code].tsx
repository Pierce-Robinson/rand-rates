import { useLocalSearchParams } from 'expo-router';

import { CurrencyDetail } from '@/screens/currency-detail';

export default function CurrencyRoute() {
  const { code } = useLocalSearchParams<{ code: string }>();
  return <CurrencyDetail code={String(code ?? '').toUpperCase()} />;
}
