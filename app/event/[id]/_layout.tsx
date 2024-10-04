import React from 'react';
import { Stack, useRouter } from 'expo-router';
import { Button, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function EventLayout() {
  const router = useRouter();

  // Function to handle back button press
  const handleBackPress = () => {
    router.push('/events'); // Navigate to /events page
  };

  return (
    <Stack
      screenOptions={{
        headerLeft: () => (
          <TouchableOpacity onPress={handleBackPress} style={{ padding: 10 }}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
        ),
      }}>
      <Stack.Screen name="index" options={{ title: 'Event Details' }} />
      <Stack.Screen name="attendance" options={{ title: 'Event Attendance' }} />
    </Stack>
  );
}
