import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, Text, View, useColorScheme } from 'react-native';

import EventListItem from '~/components/EventListItem';
import { Event } from '~/types/db';

const BookmarkScreen = () => {
  const [savedEvents, setSavedEvents] = useState<Event[]>([]);
  const colorScheme = useColorScheme(); // Detect the current theme

  useFocusEffect(
    React.useCallback(() => {
      fetchSavedEvents();
    }, [])
  );

  const fetchSavedEvents = async () => {
    try {
      const storedEvents = await AsyncStorage.getItem('bookmarkedEvents');
      const events = storedEvents ? JSON.parse(storedEvents) : [];
      setSavedEvents(events);
    } catch (error) {
      console.error('Error fetching bookmarked events:', error);
    }
  };

  if (!savedEvents.length) {
    return (
      <View
        className={`flex-1 items-center justify-center p-4 ${
          colorScheme === 'dark' ? 'bg-[#111]' : 'bg-[#eee]'
        }`}>
        <Text className={`text-lg ${colorScheme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
          No saved events
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={savedEvents}
      keyExtractor={(item) => item.id.toString()}
      // @ts-ignore
      renderItem={({ item }) => <View className='mt-3' ><EventListItem inBookmarks={true} event={item} /></View>}
      contentContainerClassName={`p-4 pt-0 flex flex-1 ${colorScheme === 'dark' ? 'bg-[#111]' : 'bg-[#eee]'}`}
    />
  );
};

export default BookmarkScreen;
