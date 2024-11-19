import '../global.css';

import { Stack } from 'expo-router';

import AuthProvider from '~/contexts/AuthProvider';
import { LocationProvider } from '~/contexts/LocationProvider';
import { RecommendedEventsProvider } from '~/contexts/RecommendedEventsProvider';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

export default function RootLayout() {
  return (
    <LocationProvider>
      <AuthProvider>
        <RecommendedEventsProvider>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
            <Stack.Screen name="event" options={{ headerShown: false }} />
          </Stack>
        </RecommendedEventsProvider>
      </AuthProvider>
    </LocationProvider>
  );
}
