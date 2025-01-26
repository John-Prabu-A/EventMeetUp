import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';

export default function EventsTabLayout() {
  const colorScheme = useColorScheme();
  return (
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
      <Stack.Screen name="event" options={{ headerShown: false }} />
    </Stack>
  );
}
