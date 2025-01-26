import { FontAwesome6, Ionicons } from '@expo/vector-icons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Redirect, router, Tabs, useNavigation } from 'expo-router';
import { TouchableOpacity, useColorScheme } from 'react-native';

import { TabBarIcon } from '../../../components/TabBarIcon';

import { useAuth } from '~/contexts/AuthProvider';
import { DrawerActions } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';

export default function TabLayout() {
  const { isAuthenticated } = useAuth();
  const navigation = useNavigation();
  const colorScheme = useColorScheme();

  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  const tabBarActiveTintColor = '#d97706';
  const iconColor = colorScheme === 'dark' ? 'white' : 'black';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor,
        tabBarStyle: {
          backgroundColor: colorScheme === 'dark' ? 'rgb(18, 18, 18)' : 'white',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Events',
          headerRight: () => (
            <TouchableOpacity
              onPress={() => router.push('/map')}
              className="pr-[20px]">
              <Ionicons name="globe-outline" size={24} color={iconColor} />
            </TouchableOpacity>
          ),
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
              className="pr-[20px]">
              <FontAwesome6 name="bars-staggered" size={24} padding="10" color={iconColor} />
            </TouchableOpacity>
          ),
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="event-available" size={24} color={color} />
          ),
          headerStyle: {
            backgroundColor: colorScheme === 'dark' ? '#111' : '#fff',
          },
          headerTintColor: colorScheme === 'dark' ? '#fff' : '#111',
          headerTitleStyle: {
            color: colorScheme === 'dark' ? '#fff' : '#111',
          },
          headerBackgroundContainerStyle: {
            borderBottomWidth: 1,
            borderBottomColor: colorScheme === 'dark' ? '#777' : '#fff',
          },
        }}
      />

      <Tabs.Screen
        name="create"
        options={{
          title: 'New event',
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
              className="pr-[20px]">
              <FontAwesome6 name="bars-staggered" size={24} padding="10" color={iconColor} />
            </TouchableOpacity>
          ),
          tabBarIcon: ({ color }) => <TabBarIcon name="plus" color={color} />,
          headerStyle: {
            backgroundColor: colorScheme === 'dark' ? '#111' : '#fff',
          },
          headerTintColor: colorScheme === 'dark' ? '#fff' : '#111',
          headerTitleStyle: {
            color: colorScheme === 'dark' ? '#fff' : '#111',
          },
          headerBackgroundContainerStyle: {
            borderBottomWidth: 1,
            borderBottomColor: colorScheme === 'dark' ? '#777' : '#fff',
          },
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
              className="pr-[20px]">
              <FontAwesome6 name="bars-staggered" size={24} padding="10" color={iconColor} />
            </TouchableOpacity>
          ),
          href: null,
          tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
          headerStyle: {
            backgroundColor: colorScheme === 'dark' ? '#111' : '#fff',
          },
          headerTintColor: colorScheme === 'dark' ? '#fff' : '#111',
          headerTitleStyle: {
            color: colorScheme === 'dark' ? '#fff' : '#111',
          },
          headerBackgroundContainerStyle: {
            borderBottomWidth: 1,
            borderBottomColor: colorScheme === 'dark' ? '#777' : '#fff',
          },
        }}
      />

      <Tabs.Screen
        name="map"
        options={{
          title: 'Map',
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
              className="pr-[20px]">
              <FontAwesome6 name="bars-staggered" size={24} padding="10" color={iconColor} />
            </TouchableOpacity>
          ),
          href: null,
          tabBarIcon: ({ color }) => <TabBarIcon name="map" color={color} />,
          headerStyle: {
            backgroundColor: colorScheme === 'dark' ? '#111' : '#fff',
          },
          headerTintColor: colorScheme === 'dark' ? '#fff' : '#111',
          headerTitleStyle: {
            color: colorScheme === 'dark' ? '#fff' : '#111',
          },
          headerBackgroundContainerStyle: {
            borderBottomWidth: 1,
            borderBottomColor: colorScheme === 'dark' ? '#777' : '#fff',
          },
        }}
      />

      <Tabs.Screen
        name="chatBot"
        options={{
          title: 'Chat',
          headerShown: false,
          tabBarIcon: ({ color }) => <TabBarIcon name="comments" color={color} />,
          headerStyle: {
            backgroundColor: colorScheme === 'dark' ? '#111' : '#fff',
          },
          headerTintColor: colorScheme === 'dark' ? '#fff' : '#111',
          headerTitleStyle: {
            color: colorScheme === 'dark' ? '#fff' : '#111',
          },
          headerBackgroundContainerStyle: {
            borderBottomWidth: 1,
            borderBottomColor: colorScheme === 'dark' ? '#777' : '#fff',
          },
        }}
      />

      <Tabs.Screen
        name="events"
        options={{
          href: null,
          headerShown: false,
        }}
      />

      <Tabs.Screen
        name="globalEvents"
        options={{
          title: 'Explore',
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
              className="pr-[20px]">
              <FontAwesome6 name="bars-staggered" size={24} padding="10" color={iconColor} />
            </TouchableOpacity>
          ),
          tabBarIcon: ({ color }) => <TabBarIcon name="compass" color={color} />,
          headerStyle: {
            backgroundColor: colorScheme === 'dark' ? '#111' : '#fff',
          },
          headerTintColor: colorScheme === 'dark' ? '#fff' : '#111',
          headerTitleStyle: {
            color: colorScheme === 'dark' ? '#fff' : '#111',
          },
          headerBackgroundContainerStyle: {
            borderBottomWidth: 1,
            borderBottomColor: colorScheme === 'dark' ? '#777' : '#fff',
          },
        }}
      />

      <Tabs.Screen
        name="bookmark"
        options={{
          title: 'Bookmarks',
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
              className="pr-[20px]">
              <FontAwesome6 name="bars-staggered" size={24} padding="10" color={iconColor} />
            </TouchableOpacity>
          ),
          href: null,
          tabBarIcon: ({ color }) => <TabBarIcon name="bookmark" color={color} />,
          headerStyle: {
            backgroundColor: colorScheme === 'dark' ? '#111' : '#fff',
          },
          headerTintColor: colorScheme === 'dark' ? '#fff' : '#111',
          headerTitleStyle: {
            color: colorScheme === 'dark' ? '#fff' : '#111',
          },
          headerBackgroundContainerStyle: {
            borderBottomWidth: 1,
            borderBottomColor: colorScheme === 'dark' ? '#777' : '#fff',
          },
        }}
      />
    </Tabs>
  );
}
