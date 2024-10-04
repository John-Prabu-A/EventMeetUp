import React from 'react';
import { Stack } from 'expo-router';

export default function EventLayout() {
  return (
    <Stack>
      <Stack.Screen name="[id]" options={{ title: 'Event', headerShown: false }} />
    </Stack>
  );
}
