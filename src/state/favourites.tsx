import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, use, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';

const STORAGE_KEY = 'favourites';
export const DEFAULT_FAVOURITES = ['USD', 'EUR', 'GBP'];

type FavouritesValue = {
  favourites: string[];
  isFavourite: (code: string) => boolean;
  toggle: (code: string) => void;
};

const FavouritesContext = createContext<FavouritesValue | null>(null);

/** Favourite currencies, saved on the device so they survive restarts. */
export function FavouritesProvider({ children }: { children: ReactNode }) {
  const [favourites, setFavourites] = useState<string[]>(DEFAULT_FAVOURITES);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((saved) => {
        if (saved) {
          const parsed: unknown = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.every((c) => typeof c === 'string')) {
            setFavourites(parsed);
          }
        }
      })
      .catch(() => {
        // Storage unavailable (e.g. private browsing): keep the defaults.
      });
  }, []);

  const toggle = useCallback((code: string) => {
    setFavourites((current) => {
      const next = current.includes(code) ? current.filter((c) => c !== code) : [...current, code];
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ favourites, isFavourite: (code: string) => favourites.includes(code), toggle }),
    [favourites, toggle],
  );

  return <FavouritesContext value={value}>{children}</FavouritesContext>;
}

export function useFavourites(): FavouritesValue {
  const value = use(FavouritesContext);
  if (!value) {
    throw new Error('useFavourites must be used inside FavouritesProvider');
  }
  return value;
}
