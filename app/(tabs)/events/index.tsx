import { Href, Stack, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { FlatList, Pressable, RefreshControl, Text, TextInput, View } from 'react-native';

import EventListItem from '~/components/EventListItem';
import { useLocationContext } from '~/contexts/LocationProvider';
import { useRecommendedEvents } from '~/contexts/RecommendedEventsProvider';
import { useNearbyEventsWithDefaultService } from '~/hooks/useNearbyEvents';
import { LocationContextType } from '~/types/db';
import { fetchNearbyEvents } from '~/utils/fetchNearbyEvents';

const EVENT_TITLES = {
  recommended: 'Recommended Events',
  nearby: 'Nearby Events'
};

export default function Events() {
  const [refreshing, setRefreshing] = useState(false);
  const { location } = useLocationContext() as LocationContextType;
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const onSearch = () => {
    if (searchQuery.trim()) {
    router.push(`/(tabs)/events/search-results?query=${encodeURIComponent(searchQuery)}` as Href);
    }
  };
  const {
    recommendedEvents,
    fetchRecommendedEvents,
    loading: loadingRecommendedEvents,
    error: errorRecommendedEvents
  } = useRecommendedEvents();
  const { events, loading: loadingNearbyEvents } = useNearbyEventsWithDefaultService();

  // Refresh handler
  const onRefresh = useCallback(async () => {
    // console.log("events length", events.length);
    setRefreshing(true);
    if (location) {
      const { latitude, longitude } = location.coords;
      await fetchNearbyEvents(latitude, longitude);
    }
    await fetchRecommendedEvents();
    setRefreshing(false);
  }, []);

  // Render each section
  const renderRecommendedEvents = () => (
    <View style={{ flex: 1, marginBottom: 10 }}>
      <View className='flex-1 px-2.5 bg-gray-100'>
        {/* Search Bar */}
        <View className='flex-row items-center my-2.5'>
          <TextInput
            className='flex-1 h-10 border border-gray-300 rounded-lg px-2.5 bg-white mr-2.5'
            placeholder="Search events..."
            value={searchQuery}
            onChangeText={(text) => setSearchQuery(text)}
            onSubmitEditing={onSearch}
            returnKeyType="search"
          />
          <Pressable
        onPress={onSearch}
        className="ml-auto items-center rounded-md bg-amber-700 p-[7px] px-8">
        <Text className="text-lg font-bold text-white">Search</Text>
      </Pressable>
        </View>
      </View>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>{EVENT_TITLES.recommended}</Text>
      <FlatList
        data={recommendedEvents}
        horizontal
        renderItem={({ item }) => (
          // @ts-ignore
          <EventListItem event={{ ...item, location_point: null, embedding: null }} />
        )}
        keyExtractor={(item) => item.id.toString()}
        showsHorizontalScrollIndicator={false}
        contentContainerClassName='gap-1.5 p-1.5'
      />
    </View>
  );

  const renderNearbyEvents = () => (
    <View style={{ flex: 1 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginVertical: 10 }}>{EVENT_TITLES.nearby}</Text>
      <FlatList
        data={events}
        renderItem={({ item }) => (
          <EventListItem event={{ ...item, location_point: null, embedding: null }} />
        )}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={<RefreshControl refreshing={loadingNearbyEvents || refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
        className='gap-1.5 p-1.5' // Add padding to avoid clipping
      />
    </View>
  );

  return (
    <>
      <Stack.Screen options={{ title: 'Events' }} />
      <FlatList
        data={[]}
        keyExtractor={() => 'key'} // Dummy key for FlatList
        renderItem={({ item }) => null} // No rendering needed for this dummy list
        ListHeaderComponent={
          <>
            {!errorRecommendedEvents && renderRecommendedEvents()}
            {renderNearbyEvents()}
          </>
        }
        contentContainerStyle={{ flexGrow: 1, margin: 5 }} // Allow the content to grow
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />} // Global refresh control
      />
    </>
  );
}