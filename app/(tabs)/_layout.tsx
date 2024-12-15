import { Redirect, router, Tabs } from 'expo-router';
import { TabBarIcon } from '../../components/TabBarIcon';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { useAuth } from '~/contexts/AuthProvider';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

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
          title: 'Events',
          headerRight: () => (
            <TouchableOpacity
              onPress={() => router.push('/(tabs)/events/map')}
              className=" pr-[20px]">
              <Ionicons name="globe-outline" size={24} color="black" />
            </TouchableOpacity>
          ),
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="event-available" size={24} color={color} />
          ),
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

      <Tabs.Screen
        name="chatBot"
        options={{
          title: 'Chat',
          headerShown: false,
          tabBarIcon: ({ color }) => <TabBarIcon name="comments" color={color} />,
        }}
      />

      <Tabs.Screen
        name="events"
        options={{
          href: null,
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
