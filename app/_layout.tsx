import '../global.css';

import { Stack } from 'expo-router';
import AuthProvider from '~/contexts/AuthProvider';
import { LocationProvider } from '~/contexts/LocationProvider';
import { RecommendedEventsProvider } from '~/contexts/RecommendedEventsProvider';
import Toast, {
  BaseToast,
  BaseToastProps,
  ErrorToast,
  InfoToast,
} from 'react-native-toast-message';
import { useColorScheme, Platform } from 'react-native';
import * as NavigationBar from 'expo-navigation-bar';
import { useEffect } from 'react';
import ToastConfig from '~/utils/ToastConfig';


export const unstable_settings = {
  initialRouteName: '/',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    // Apply Android navigation bar theme
    if (Platform.OS === 'android') {
      NavigationBar.setBackgroundColorAsync(colorScheme === 'dark' ? 'rgb(18, 18, 18)' : '#ffffff');
      NavigationBar.setButtonStyleAsync(colorScheme === 'dark' ? 'light' : 'dark');
    }
  }, [colorScheme]);

  return (
    <>
      <LocationProvider>
        <AuthProvider>
          <RecommendedEventsProvider>
            <Stack
              screenOptions={{
                headerStyle: {
                  backgroundColor: colorScheme === 'dark' ? '#111' : '#eee',
                },
                headerTintColor: colorScheme === 'dark' ? '#eee' : '#111',
                headerTitleStyle: {
                  color: colorScheme === 'dark' ? '#eee' : '#111',
                },
              }}>
              <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
              <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            </Stack>
          </RecommendedEventsProvider>
        </AuthProvider>
      </LocationProvider>
      <Toast config={ToastConfig()} />;
    </>
  );
}
