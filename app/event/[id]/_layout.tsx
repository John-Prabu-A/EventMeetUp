import React from 'react';
import { Stack, useRouter } from 'expo-router';
import { View } from 'react-native';

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
          <View style={{ padding: 10 }}>
            {/* <Ionicons name="arrow-back" size={24} color="black" /> */}
          </View>
        ),
      }}>
      <Stack.Screen name="index" options={{ title: 'Event Details' }} />
      <Stack.Screen name="attendance" options={{ title: 'Event Attendance' }} />
    </Stack>
  );
}
