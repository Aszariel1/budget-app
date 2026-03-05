import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Capacitor } from '@capacitor/core';

export const hapticImpact = async (style: ImpactStyle = ImpactStyle.Light) => {
  // Only try to trigger haptics if running on a real device (Android/iOS)
  if (Capacitor.isNativePlatform()) {
    try {
      await Haptics.impact({ style });
    } catch (e) {
      console.error('Haptics not available', e);
    }
  }
};

export const hapticSuccess = async () => {
  if (Capacitor.isNativePlatform()) {
    try {
      await Haptics.notification({ type: 'SUCCESS' as any });
    } catch (e) {}
  }
};
