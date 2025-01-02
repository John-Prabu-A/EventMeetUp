import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { FlatList, Text, View, StyleSheet } from 'react-native';

import EventListItem from '~/components/EventListItem'; // Ensure this exists or create it as per your design.

const BookmarkScreen = () => {
  const [savedEvents, setSavedEvents] = useState([]);

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
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No saved events</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={savedEvents}
      keyExtractor={(item) => item} // Ensure event IDs are unique
      renderItem={({ item }) => <EventListItem inBookmarks={true} event={item} />}
      contentContainerStyle={styles.listContainer}
    />
  );
};

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: 'gray',
  },
  listContainer: {
    padding: 10,
  },
});

export default BookmarkScreen;
