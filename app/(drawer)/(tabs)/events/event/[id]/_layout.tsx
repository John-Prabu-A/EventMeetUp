import React from 'react';
import { Stack, useNavigation } from 'expo-router';
import { Pressable, useColorScheme, View } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';

export default function EventLayout() {
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
      <Stack.Screen name="attendance" options={{ title: 'Event Attendance' }} />
      <Stack.Screen
        name="index"
        options={{
          title: 'Event Details',
          headerLeft: () => <View />,
        }}
      />
    </Stack>
  );
}
