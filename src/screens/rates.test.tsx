import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen } from '@testing-library/react-native';
import type { ReactNode } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { Rates } from '@/screens/rates';
import { FavouritesProvider } from '@/state/favourites';

const responses: Record<string, unknown> = {
  '/latest': { base: 'ZAR', date: '2026-10-16', rates: { USD: 0.05, EUR: 0.04, JPY: 8 } },
  '/currencies': { USD: 'United States Dollar', EUR: 'Euro', JPY: 'Japanese Yen' },
};

beforeEach(() => {
  globalThis.fetch = jest.fn((url: string) => {
    const match = Object.keys(responses).find((path) => url.includes(path));
    return Promise.resolve({ ok: true, json: () => Promise.resolve(match ? responses[match] : {}) });
  }) as unknown as typeof fetch;
});

async function renderScreen(ui: ReactNode) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return await render(
    <SafeAreaProvider initialMetrics={{ frame: { x: 0, y: 0, width: 390, height: 844 }, insets: { top: 0, left: 0, right: 0, bottom: 0 } }}>
      <QueryClientProvider client={client}>
        <FavouritesProvider>{ui}</FavouritesProvider>
      </QueryClientProvider>
    </SafeAreaProvider>,
  );
}

describe('Rates screen', () => {
  it('shows the rand price of each currency', async () => {
    await renderScreen(<Rates />);

    expect(await screen.findByText('United States Dollar')).toBeOnTheScreen();
    // 1 / 0.05 = R20.00, formatted the South African way.
    expect(screen.getByText(/R\s?20,00/)).toBeOnTheScreen();
  });

  it('filters by name and offers a way out when nothing matches', async () => {
    await renderScreen(<Rates />);
    await screen.findByText('Euro');

    await fireEvent.changeText(screen.getByLabelText('Search currencies'), 'yen');
    expect(screen.getByText('Japanese Yen')).toBeOnTheScreen();
    expect(screen.queryByText('Euro')).toBeNull();

    await fireEvent.changeText(screen.getByLabelText('Search currencies'), 'zzz');
    expect(screen.getByText('No currencies match "zzz"')).toBeOnTheScreen();
    await fireEvent.press(screen.getByText('Clear search'));
    expect(screen.getByText('Euro')).toBeOnTheScreen();
  });

  it('adds a currency to favourites', async () => {
    await renderScreen(<Rates />);
    await screen.findByText('Japanese Yen');

    await fireEvent.press(screen.getByLabelText('Add JPY to favourites'));

    expect(screen.getByLabelText('Remove JPY from favourites')).toBeOnTheScreen();
  });
});
