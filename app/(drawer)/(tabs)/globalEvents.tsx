import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import Toast from 'react-native-toast-message';
type Event = {
  id: string;
  name: string;
  images?: { url: string }[];
  dates?: { start?: { localDate?: string } };
  _embedded?: { venues?: { name?: string }[] };
};

const TicketmasterEvents: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const apiKey = process.env.EXPO_PUBLIC_EVENTS_API_KEY || '';
  const latlong = '38.7945952,-106.5348379';
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const fetchEvents = async (pageNum: number) => {
    if (!hasMore) return;

    setLoading(true);
    const url = `https://app.ticketmaster.com/discovery/v2/events?apikey=${apiKey}&latlong=${latlong}&locale=*&page=${pageNum}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch events: ${response.statusText}`);
      }

      const data = await response.json();
      const fetchedEvents = data._embedded?.events || [];

      // Remove duplicates by event name
      const uniqueEvents = [
        ...new Map([...events, ...fetchedEvents].map((event) => [event.name, event])).values(),
      ];

      setHasMore(fetchedEvents.length > 0);
      setEvents(pageNum === 0 ? uniqueEvents : uniqueEvents);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: err instanceof Error ? err.message : 'An unexpected error occurred.',
        visibilityTime: 2000,
        autoHide: true,
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchEvents(page);
  }, [page]);

  const handleRefresh = () => {
    setRefreshing(true);
    setPage(0);
    setEvents([]);
  };

  const loadMoreEvents = () => {
    if (!loading && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const renderEventItem = ({ item }: { item: Event }) => {
    const imageUrl = item.images?.[2]?.url;
    const eventDate = item.dates?.start?.localDate || 'Date not available';
    const location = item._embedded?.venues?.[0]?.name || 'Location unavailable';

    return (
      <TouchableOpacity
        className="mb-4 flex-row overflow-hidden rounded-lg bg-white shadow-md dark:bg-[#222]"
        activeOpacity={0.8}>
        {imageUrl && <Image source={{ uri: imageUrl }} className="h-32 w-32" />}
        <View className="flex-1 justify-center p-4">
          <Text className="text-lg font-bold text-gray-900 dark:text-gray-100" numberOfLines={1}>
            {item.name || 'Event Name Unavailable'}
          </Text>
          <Text className="mt-1 text-gray-700 dark:text-gray-300">{eventDate}</Text>
          <Text className="mt-1 text-gray-500 dark:text-gray-400">{location}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View className={`flex-1 p-4 ${colorScheme === 'dark' ? 'bg-[#111]' : 'bg-[#eee]'}`}>
      {loading && page === 0 ? (
        <View className="flex-1 items-center justify-center dark:bg-[#111]">
          <ActivityIndicator size="large" color="#F59E0B" />
          <Text className="mt-4 text-lg text-gray-700 dark:text-gray-300">Loading events...</Text>
        </View>
      ) : error ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-lg text-red-600 dark:text-red-400">Error: {error}</Text>
          <TouchableOpacity
            onPress={handleRefresh}
            className="mt-4 rounded-md bg-amber-600 px-4 py-2">
            <Text className="text-lg text-white">Retry</Text>
          </TouchableOpacity>
        </View>
      ) : events.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-lg text-gray-600 dark:text-gray-300">No events found.</Text>
          <TouchableOpacity
            onPress={handleRefresh}
            className="mt-4 rounded-md bg-amber-600 px-4 py-2">
            <Text className="text-lg text-white">Reload</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={events}
          renderItem={renderEventItem}
          keyExtractor={(item) => item.id}
          onEndReached={loadMoreEvents}
          onEndReachedThreshold={0.5}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          ListFooterComponent={
            loading && hasMore ? (
              <View className="flex-row items-center justify-center py-4">
                <ActivityIndicator size="large" color="#F59E0B" />
                <Text className="ml-2 text-gray-700 dark:text-gray-300">
                  Loading more events...
                </Text>
              </View>
            ) : null
          }
        />
      )}
    </View>
  );
};

export default TicketmasterEvents;
