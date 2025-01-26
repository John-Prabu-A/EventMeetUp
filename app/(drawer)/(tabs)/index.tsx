import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  BackHandler,
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  TextInput,
  View,
  useColorScheme,
} from 'react-native';

import EventListItem from '~/components/EventListItem';
import EventListItemLoading from '~/components/EventListItemLoading';
import { useLocationContext } from '~/contexts/LocationProvider';
import { useRecommendedEvents } from '~/contexts/RecommendedEventsProvider';
import { useNearbyEventsWithDefaultService } from '~/hooks/useNearbyEvents';
import { LocationContextType } from '~/types/db';
import ConfirmationModal from '~/utils/ConfirmationModel';
import { fetchNearbyEvents } from '~/utils/fetchNearbyEvents';

const EVENT_TITLES = {
  recommended: 'Recommended Events',
  nearby: 'Nearby Events',
};

export default function Events() {
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);

  const router = useRouter();
  const { location } = useLocationContext() as LocationContextType;
  const colorScheme = useColorScheme();

  const isDarkTheme = useMemo(() => colorScheme === 'dark', [colorScheme]);
  const themeStyles = useMemo(
    () => ({
      backgroundColor: isDarkTheme ? '#111' : '#eee',
      textColor: isDarkTheme ? '#fff' : '#000',
      borderColor: isDarkTheme ? '#333' : '#ccc',
      buttonBackground: '#F59E0B',
    }),
    [isDarkTheme]
  );

  const {
    recommendedEvents,
    fetchRecommendedEvents,
    loading: loadingRecommendedEvents,
    error: errorRecommendedEvents,
  } = useRecommendedEvents();

  const {
    events,
    loading: loadingNearbyEvents,
    error: errorNearbyEvents,
  } = useNearbyEventsWithDefaultService();

  useEffect(() => {
    const onBackPress = () => {
      if (!router.canGoBack()) {
        setModalVisible(true);
        return true;
      }
      return false;
    };

    BackHandler.addEventListener('hardwareBackPress', onBackPress);

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    };
  }, [router]);

  const onSearch = useCallback(() => {
    const query = searchQuery.trim();
    if (query) {
      setSearchQuery('');
      router.push(`/events/search-results?query=${encodeURIComponent(query)}`);
    }
  }, [searchQuery, router]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchRecommendedEvents();
    if (location) {
      const { latitude, longitude } = location.coords;
      await fetchNearbyEvents(latitude, longitude);
    }
    setRefreshing(false);
  }, [location, fetchRecommendedEvents]);

  const renderSearchBar = () => (
    <View
      style={{ backgroundColor: themeStyles.backgroundColor }}
      className="m-3 flex-row items-center">
      <TextInput
        className="h-12 flex-1 rounded border px-3"
        style={{
          backgroundColor: themeStyles.backgroundColor,
          borderColor: themeStyles.borderColor,
          color: themeStyles.textColor,
        }}
        placeholder="Search events..."
        placeholderTextColor="#999"
        value={searchQuery}
        autoCapitalize="none"
        selectionColor="#f59e0b"
        onChangeText={setSearchQuery}
        onSubmitEditing={onSearch}
        returnKeyType="search"
      />
      <Pressable
        onPress={onSearch}
        className="ml-2 rounded px-5 py-[10px]"
        style={{ backgroundColor: themeStyles.buttonBackground }}>
        <Text className="text-base font-bold text-white">Search</Text>
      </Pressable>
    </View>
  );

  const renderEventsList = (
    title: string,
    data: any,
    loading: boolean,
    error: string | null,
    horizontal = false
  ) =>
    !error && (
      <View style={{ backgroundColor: themeStyles.backgroundColor }} className="flex-1">
        <Text className="m-2 text-2xl font-bold" style={{ color: themeStyles.textColor }}>
          {title}
        </Text>
        {loading || !data ? (
          <FlatList
            data={[1, 2, 3]}
            horizontal={horizontal}
            renderItem={() => <EventListItemLoading />}
            keyExtractor={(item) => item.toString()}
            showsHorizontalScrollIndicator={false}
          />
        ) : (
          <FlatList
            data={data}
            horizontal={horizontal}
            renderItem={({ item }) => (
              <EventListItem event={{ ...item, location_point: null, embedding: null }} />
            )}
            keyExtractor={(item) => item.id.toString()}
            showsHorizontalScrollIndicator={false}
          />
        )}
      </View>
    );

  return (
    <>
      <Stack.Screen options={{ title: 'Events' }} />
      <FlatList
        data={[]}
        keyExtractor={() => 'key'}
        renderItem={null}
        className="flex flex-1"
        style={{ backgroundColor: themeStyles.backgroundColor }}
        ListHeaderComponent={
          <>
            {renderSearchBar()}
            {renderEventsList(
              EVENT_TITLES.recommended,
              recommendedEvents,
              loadingRecommendedEvents,
              errorRecommendedEvents,
              true
            )}
            {renderEventsList(EVENT_TITLES.nearby, events, loadingNearbyEvents, errorNearbyEvents)}
            <ConfirmationModal
              visible={isModalVisible}
              onCancel={() => setModalVisible(false)}
              onConfirm={() => {
                setModalVisible(false);
                BackHandler.exitApp();
              }}
              question="Are you sure you want to Exit?"
            />
          </>
        }
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
    </>
  );
}
