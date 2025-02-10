
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.0b14e66254024e47864eff52a0228b4f',
  appName: 'zone-watchers',
  webDir: 'dist',
  server: {
    url: "https://0b14e662-5402-4e47-864e-ff52a0228b4f.lovableproject.com?forceHideBadge=true",
    cleartext: true,
  },
  ios: {
    contentInset: 'automatic'
  },
  android: {
    backgroundColor: "#ffffff"
  }
};

export default config;
