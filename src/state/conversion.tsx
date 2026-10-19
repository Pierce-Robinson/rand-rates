import { createContext, use, useMemo, useState, type ReactNode } from 'react';

import { BASE_CURRENCY } from '@/utils/currency';

export type CurrencyField = 'from' | 'to';

type ConversionValue = {
  amountText: string;
  from: string;
  to: string;
  setAmountText: (text: string) => void;
  setCurrency: (field: CurrencyField, code: string) => void;
  swap: () => void;
};

const ConversionContext = createContext<ConversionValue | null>(null);

/**
 * The converter's inputs, shared between the Convert screen and the currency picker modal so
 * the picker can write its choice straight back.
 */
export function ConversionProvider({ children }: { children: ReactNode }) {
  const [amountText, setAmountText] = useState('100');
  const [from, setFrom] = useState('USD');
  const [to, setTo] = useState(BASE_CURRENCY);

  const value = useMemo<ConversionValue>(
    () => ({
      amountText,
      from,
      to,
      setAmountText,
      setCurrency: (field, code) => {
        // Picking the currency already on the other side swaps them instead of making both the same.
        if (field === 'from') {
          if (code === to) setTo(from);
          setFrom(code);
        } else {
          if (code === from) setFrom(to);
          setTo(code);
        }
      },
      swap: () => {
        setFrom(to);
        setTo(from);
      },
    }),
    [amountText, from, to],
  );

  return <ConversionContext value={value}>{children}</ConversionContext>;
}

export function useConversion(): ConversionValue {
  const value = use(ConversionContext);
  if (!value) {
    throw new Error('useConversion must be used inside ConversionProvider');
  }
  return value;
}
