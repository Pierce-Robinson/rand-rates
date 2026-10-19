import { useLocalSearchParams } from 'expo-router';

import { PickCurrency } from '@/screens/pick-currency';

export default function PickCurrencyRoute() {
  const { field } = useLocalSearchParams<{ field?: string }>();
  return <PickCurrency field={field === 'to' ? 'to' : 'from'} />;
}
