import React, { useEffect, useState, useCallback } from 'react';
import { Alert, BackHandler, FlatList, Pressable, RefreshControl, Text, TextInput, View } from 'react-native';
import { Href, Stack, useRouter } from 'expo-router';

import EventListItem from '~/components/EventListItem';
import { useLocationContext } from '~/contexts/LocationProvider';
import { useRecommendedEvents } from '~/contexts/RecommendedEventsProvider';
import { useNearbyEventsWithDefaultService } from '~/hooks/useNearbyEvents';
import { LocationContextType } from '~/types/db';
import { fetchNearbyEvents } from '~/utils/fetchNearbyEvents';

const EVENT_TITLES = {
  recommended: 'Recommended Events',
  nearby: 'Nearby Events',
};

export default function Events() {
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const { location } = useLocationContext() as LocationContextType;

  const {
    recommendedEvents,
    fetchRecommendedEvents,
    loading: loadingRecommendedEvents,
    error: errorRecommendedEvents,
  } = useRecommendedEvents();

  const { events, loading: loadingNearbyEvents } = useNearbyEventsWithDefaultService();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Handle the back button press
    const backAction = () => {
      Alert.alert("Exit App", "Do you want to exit the app?", [
        {
          text: "Cancel",
          onPress: () => null,
          style: "cancel"
        },
        { text: "YES", onPress: () => BackHandler.exitApp() }
      ]);
      return true;
    };

    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);

    return () => {
      // Clean up the back handler
      backHandler.remove();
    };
  }, []);

  const onSearch = () => {
    let query = searchQuery.trim();
    if (query) {
      setSearchQuery("");
      router.push(`/(tabs)/events/search-results?query=${encodeURIComponent(query)}` as Href);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    if (location) {
      const { latitude, longitude } = location.coords;
      await fetchNearbyEvents(latitude, longitude);
    }
    await fetchRecommendedEvents();
    setRefreshing(false);
  }, [location, fetchRecommendedEvents]);

  const renderSearchBar = () => (
    <View className="flex-row items-center my-2.5">
      <TextInput
        className="flex-1 h-10 border border-gray-300 rounded-lg px-2.5 bg-white mr-2.5"
        placeholder="Search events..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        onSubmitEditing={onSearch}
        returnKeyType="search"
      />
      <Pressable
        onPress={onSearch}
        className="ml-auto items-center rounded-md bg-amber-700 p-[7px] px-8"
      >
        <Text className="text-lg font-bold text-white">Search</Text>
      </Pressable>
    </View>
  );

  const renderRecommendedEvents = () => (
    <View style={{ flex: 1, marginBottom: 10 }}>
      <View className="flex-1 px-2.5 bg-gray-100">{renderSearchBar()}</View>
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
        contentContainerClassName="gap-1.5 p-1.5"
      />
    </View>
  );

  const renderNearbyEvents = () => (
    <View style={{ flex: 1 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginVertical: 10 }}>
        {EVENT_TITLES.nearby}
      </Text>
      <FlatList
        data={events}
        renderItem={({ item }) => (
          <EventListItem event={{ ...item, location_point: null, embedding: null }} />
        )}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={<RefreshControl refreshing={loadingNearbyEvents || refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
        className="gap-1.5 p-1.5"
      />
    </View>
  );

  // Handle back button press with router.back()
  useEffect(() => {
    const backAction = () => {
      // If the stack has a previous page, go back to it
      if (router.canGoBack()) {
        router.back();  // Use router.back() to go back to the previous page
      } else {
        Alert.alert("Exit App", "Do you want to exit the app?", [
          {
            text: "Cancel",
            onPress: () => null,
            style: "cancel"
          },
          { text: "YES", onPress: () => BackHandler.exitApp() }
        ]);
      }
      return true; // Prevent default back behavior
    };

    // Add event listener for back press
    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);

    // Clean up the back handler on component unmount
    return () => {
      backHandler.remove();
    };
  }, [router]);

  return (
    <>
      <Stack.Screen options={{ title: 'Events' }} />
      <FlatList
        data={[]}
        keyExtractor={() => 'key'}
        renderItem={null}
        ListHeaderComponent={
          <>
            {!errorRecommendedEvents && renderRecommendedEvents()}
            {renderNearbyEvents()}
          </>
        }
        contentContainerStyle={{ flexGrow: 1, margin: 5 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
    </>
  );
}
