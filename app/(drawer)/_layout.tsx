import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { Href, Redirect, router, usePathname } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import { JSX, RefAttributes, useEffect, useState } from 'react';
import { Image, Text, View, ActivityIndicator, ScrollView, useColorScheme } from 'react-native';
import { ScrollViewProps } from 'react-native/Libraries/Components/ScrollView/ScrollView';
import { GestureHandlerRootView, Pressable } from 'react-native-gesture-handler';

import { useAuth } from '~/contexts/AuthProvider';
import { supabase } from '~/utils/supabase';
export default function Layout() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  return (
    <GestureHandlerRootView className="flex-1">
      <Drawer
        drawerContent={(props) => <CustomDrawerContent children={undefined} {...props} />}
        screenOptions={{ headerShown: false }}>
        <Drawer.Screen name="/index" options={{ title: 'Events' }} />
        <Drawer.Screen name="/create" options={{ title: 'New Event' }} />
        <Drawer.Screen name="/profile" options={{ title: 'Profile' }} />
        <Drawer.Screen name="/chatBot" options={{ title: 'Chat' }} />
        <Drawer.Screen name="/globalEvents" options={{ title: 'Explore' }} />
        <Drawer.Screen name="/bookmark" options={{ title: 'Bookmarks' }} />
      </Drawer>
    </GestureHandlerRootView>
  );
}

const CustomDrawerContent = (
  props: JSX.IntrinsicAttributes &
    ScrollViewProps & { children: React.ReactNode } & RefAttributes<ScrollView>
) => {
  const pathname = usePathname();
  const { profileUrl, ProfileData } = useAuth();
  const [pic, setPic] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const defaultProfileImage = require('~/assets/defaultProfilePic.png');
  const colorScheme = useColorScheme();

  const { logout } = useAuth();

  useEffect(() => {
    if (profileUrl) {
      downloadImage(profileUrl);
    } else {
      setPic('');
    }
  }, [profileUrl]);

  async function downloadImage(path: string) {
    try {
      setLoading(true);
      const { data, error } = await supabase.storage.from('avatars').download(path);

      if (error) throw error;

      const fr = new FileReader();
      fr.readAsDataURL(data);
      fr.onload = () => setPic(String(fr.result));
    } catch {
      setPic('');
    } finally {
      setLoading(false);
    }
  }

  type DrawerItemType = {
    label: string;
    icon:
      | 'event-available'
      | 'edit-calendar'
      | 'location-pin'
      | 'edit'
      | 'chat'
      | 'explore'
      | 'bookmark';
    path: string;
  };

  const drawerItems: DrawerItemType[] = [
    { label: 'Events', icon: 'event-available', path: '/' },
    { label: 'New Event', icon: 'edit-calendar', path: '/create' },
    { label: 'Map View', icon: 'location-pin', path: '/map' },
    { label: 'Edit Profile', icon: 'edit', path: '/profile' },
    { label: 'Chat', icon: 'chat', path: '/chatBot' },
    { label: 'Explore', icon: 'explore', path: '/globalEvents' },
    { label: 'Bookmarks', icon: 'bookmark', path: '/bookmark' },
  ];

  const drawerBackgroundColor = colorScheme === 'dark' ? 'rgb(18, 18, 18)' : 'rgb(255, 255, 255)';
  const textColor = colorScheme === 'dark' ? '#cccccc' : '#000000';

  return (
    <>
      <DrawerContentScrollView {...props} style={{ backgroundColor: drawerBackgroundColor }}>
        <View className="flex-row border-b border-gray-300 p-4 dark:bg-[#111]">
          <Pressable onPress={() => router.push('/profile')}>
            {loading ? (
              <ActivityIndicator size="large" color="rgb(180, 83, 9)" />
            ) : pic ? (
              <Image
                source={{ uri: pic }}
                className="h-20 w-20 rounded-full border-2 border-orange-600"
              />
            ) : (
              <Image
                source={defaultProfileImage}
                className="h-20 w-20 rounded-full border-2 border-orange-600"
              />
            )}
          </Pressable>
          <View className="ml-4 justify-center">
            <Pressable onPress={() => router.push('/profile')}>
              <Text className="text-lg font-bold" style={{ color: textColor }}>
                {ProfileData.fullName || 'Guest User'}
              </Text>
              <Text className="text-sm text-gray-500">{ProfileData.username || ''}</Text>
            </Pressable>
          </View>
        </View>
        {drawerItems.map((item) => (
          <DrawerItem
            key={item.path}
            icon={({ size, color }) => (
              <MaterialIcons
                name={item.icon}
                size={size}
                color={
                  pathname === item.path
                    ? 'rgb(180, 83, 9)'
                    : colorScheme === 'dark'
                      ? '#cccccc'
                      : color
                }
                className="pr-5"
              />
            )}
            label={item.label}
            labelStyle={{
              marginLeft: -20,
              fontSize: 16,
              color:
                pathname === item.path
                  ? 'rgb(180, 83, 9)'
                  : colorScheme === 'dark'
                    ? '#cccccc'
                    : '#000000',
              fontWeight: pathname === item.path ? 'bold' : undefined,
            }}
            onPress={() => router.push(item.path as Href)}
          />
        ))}
      </DrawerContentScrollView>
      <View className="border-t border-gray-300 p-4 dark:bg-gray-900">
        <Text
          className="text-center text-lg font-bold text-amber-600"
          onPress={async () => logout()}>
          Logout
        </Text>
      </View>
    </>
  );
};
