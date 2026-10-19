import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { useColorScheme } from 'react-native';

import { ConversionProvider } from '@/state/conversion';
import { FavouritesProvider } from '@/state/favourites';
import { PERSIST_MAX_AGE, queryClient, queryPersister } from '@/state/query-client';

export default function RootLayout() {
  const scheme = useColorScheme();

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister: queryPersister, maxAge: PERSIST_MAX_AGE }}>
      <FavouritesProvider>
        <ConversionProvider>
          <ThemeProvider value={scheme === 'dark' ? DarkTheme : DefaultTheme}>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false, title: 'Back' }} />
              <Stack.Screen name="currency/[code]" options={{ title: '' }} />
              <Stack.Screen name="pick-currency" options={{ presentation: 'modal', title: 'Choose a currency' }} />
            </Stack>
          </ThemeProvider>
        </ConversionProvider>
      </FavouritesProvider>
    </PersistQueryClientProvider>
  );
}
