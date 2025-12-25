import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.contentpitchpro.app',
  appName: 'Content Pitch Pro',
  webDir: 'dist',
  plugins: {
    CapacitorUpdater: {
      autoUpdate: true,
      statsUrl: 'https://api.capgo.app/stats',
      enabled: true
    }
  }
};

export default config;
