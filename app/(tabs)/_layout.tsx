import { Redirect, Tabs } from 'expo-router';
import { TabBarIcon } from '../../components/TabBarIcon';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { useAuth } from '~/contexts/AuthProvider';

export default function TabLayout() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: 'black',
      }}>
        <Tabs.Screen
        name="index"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="events"
        options={{
          title: 'Events',
          headerShown: false,
          tabBarIcon: ({ color }) => <MaterialIcons name="event-available" size={24} color={color} />,
        }}
      />

      <Tabs.Screen
        name="create"
        options={{
          title: 'New event',
          tabBarIcon: ({ color }) => <TabBarIcon name="plus" color={color} />,
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
        }}
      />
    </Tabs>
  );
}
