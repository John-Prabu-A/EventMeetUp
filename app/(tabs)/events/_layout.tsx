import { Ionicons } from '@expo/vector-icons';
import { Link, router, Stack, Tabs } from 'expo-router';
import { Text, TouchableOpacity } from 'react-native';

export default function EventsTabLayout() {
  return (
    <Stack>
      <Stack.Screen name="map" options={{ title: 'Events Map' }} />
      <Stack.Screen name="search-results" options={{ title: 'Search Result' }} />
    </Stack>
  );
}
