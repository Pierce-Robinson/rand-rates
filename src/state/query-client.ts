import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { onlineManager, QueryClient } from '@tanstack/react-query';

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

// Pause queries while offline and resume them when the connection comes back.
onlineManager.setEventListener((setOnline) =>
  NetInfo.addEventListener((state) => {
    setOnline(state.isConnected !== false);
  }),
);
