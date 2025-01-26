import { FontAwesome6 } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  View,
  useColorScheme,
} from 'react-native';

import EventListItem from '~/components/EventListItem';
import { useLocationContext } from '~/contexts/LocationProvider';
import { LocationContextType, RecommendedEvent } from '~/types/db';
import { fetchEventsByQuery } from '~/utils/fetchEventsByQuery'; // Create this utility function

export default function SearchResults() {
  const { query }: { query: string } = useLocalSearchParams(); // Get the search query from URL params
  const { location } = useLocationContext() as LocationContextType;
  const [events, setEvents] = useState<RecommendedEvent>([]);
  const [loading, setLoading] = useState(false);

  const [refreshing, setRefreshing] = useState(false);

  const colorScheme = useColorScheme(); // Get current theme

  const fetchSearchResults = async () => {
    setLoading(true);
    try {
      const results = await fetchEventsByQuery(query, location);
      if (results) {
        setEvents(results);
      }
    } catch (error) {
      console.error('Error fetching search results:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (query) fetchSearchResults();
  }, [query]);

  if (events.length === 0 && !loading) {
    return (
      <Text className="dark:bg-[#111]} mt-20 bg-[#eee] text-center text-lg text-[#111] dark:text-[#eee]">
        No events found.
      </Text>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: `Search Results for "${query}"`,
        }}
      />
      <View className={`flex-1 px-4 py-2 ${colorScheme === 'dark' ? 'bg-[#111]' : 'bg-[#eee]'}`}>
        {loading && (
          <View className="flex-1 items-center justify-center bg-[#eee] dark:bg-[#111]">
            <ActivityIndicator size="large" color={colorScheme === 'dark' ? 'white' : '#B45309'} />
            <Text
              className={`mt-4 text-lg ${colorScheme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              Loading search results...
            </Text>
          </View>
        )}

        {!loading && (
          <FlatList
            data={events}
            className="flex flex-1 bg-[#eee] dark:bg-[#111]"
            contentContainerClassName="bg-[#eee] dark:bg-[#111]"
            renderItem={({ item }) => (
              // @ts-ignore
              <EventListItem event={{ ...item, location_point: null, embedding: null }} />
            )}
            keyExtractor={(item) => item.id.toString()}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={fetchSearchResults} />
            }
          />
        )}
      </View>
    </>
  );
}
