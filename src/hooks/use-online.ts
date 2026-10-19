import NetInfo from '@react-native-community/netinfo';
import { useEffect, useState } from 'react';

/** True while the device has a connection. Assumes online until NetInfo reports otherwise. */
export function useOnline(): boolean {
  const [online, setOnline] = useState(true);

  useEffect(
    () =>
      NetInfo.addEventListener((state) => {
        setOnline(state.isConnected !== false);
      }),
    [],
  );

  return online;
}
