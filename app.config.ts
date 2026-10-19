import type { ConfigContext, ExpoConfig } from 'expo/config';

// app.json holds the static config. This file only adds the web base path, so the same build
// can run locally at "/" and on GitHub Pages under "/rand-rates" (set EXPO_BASE_URL in CI).
export default ({ config }: ConfigContext): ExpoConfig => ({
  ...(config as ExpoConfig),
  experiments: {
    ...config.experiments,
    baseUrl: process.env.EXPO_BASE_URL ?? '',
  },
});
