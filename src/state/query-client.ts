import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { onlineManager, QueryClient } from '@tanstack/react-query';
import { Platform } from 'react-native';

const DAY = 24 * 60 * 60 * 1000;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      // Keep data around long enough to be restored from disk on the next launch.
      gcTime: 7 * DAY,
    },
  },
});

/** Saves the query cache to device storage, so the last rates are available offline. */
export const queryPersister = createAsyncStoragePersister({
  storage: AsyncStorage,
  key: 'rand-rates-cache',
});

export const PERSIST_MAX_AGE = 7 * DAY;

// On iOS and Android, pause queries while offline and resume when the connection returns.
// Browsers already report online/offline events, which TanStack Query uses by default; using
// NetInfo there would hold every request until its reachability check finished.
if (Platform.OS !== 'web') {
  onlineManager.setEventListener((setOnline) =>
    NetInfo.addEventListener((state) => {
      setOnline(state.isConnected !== false);
    }),
  );
}
