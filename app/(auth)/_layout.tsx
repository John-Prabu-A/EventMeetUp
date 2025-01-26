import { Redirect, Stack } from 'expo-router';
import { useColorScheme } from 'react-native';

import { useAuth } from '~/contexts/AuthProvider';

export default function AuthLayout() {
  const { isAuthenticated } = useAuth();
  const colorScheme = useColorScheme();

  if (isAuthenticated) {
    return <Redirect href="/" />;
  }

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colorScheme === 'dark' ? 'rgb(18, 18, 18)' : '#fff',
        },
        headerTintColor: colorScheme === 'dark' ? '#fff' : 'rgb(18, 18, 18)',
        headerTitleStyle: {
          color: colorScheme === 'dark' ? '#fff' : '#000',
        },
      }}
    />
  );
}
