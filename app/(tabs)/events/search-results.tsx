import { Stack, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, RefreshControl, Text, View, StyleSheet } from 'react-native';

import EventListItem from '~/components/EventListItem';
import { useLocationContext } from '~/contexts/LocationProvider';
import { LocationContextType, RecommendedEvent } from '~/types/db';
import { fetchEventsByQuery } from '~/utils/fetchEventsByQuery'; // Create this utility function

export default function SearchResults() {
  const { query }: { query: string} = useLocalSearchParams(); // Get the search query from URL params
  const { location } = useLocationContext() as LocationContextType;
  const [events, setEvents] = useState<RecommendedEvent>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

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

  if(events.length === 0 && !loading) { 
    return <Text style={styles.emptyText}>No events found.</Text>
  }

  return (
    <>
      <Stack.Screen options={{ title: `Search Results for "${query}"` }} />
      <View style={styles.container}>
        <FlatList
          data={events}
          renderItem={({ item }) => (
            // @ts-ignore
            <EventListItem event={{ ...item, location_point: null, embedding: null }} />
          )}
          keyExtractor={(item) => item.id.toString()}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchSearchResults} />}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f8f9fa',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 18,
    color: '#666',
  },
});
