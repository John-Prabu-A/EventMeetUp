import { Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, RefreshControl } from 'react-native';

import EventListItem from '~/components/EventListItem';
import { NearbyEvent } from '~/types/db';
import { supabase } from '~/utils/supabase';

export default function Events() {
  const [events, setEvents] = useState<NearbyEvent>([]); // Use array type for events
  const [refreshing, setRefreshing] = useState<boolean>(false); // State to handle refreshing

  // Fetch events from Supabase
  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase.rpc('nearby_events', {
        lat: 12.9426658,
        long: 80.134024,
      });
      if (error) {
        console.error('Error fetching events:', error);
      } else {
        setEvents(data);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  // Initial fetch when component mounts
  useEffect(() => {
    fetchEvents();
  }, []);

  // Handler to refresh the events list
  const onRefresh = async () => {
    setRefreshing(true); // Show the refresh indicator
    await fetchEvents(); // Refetch the events
    setRefreshing(false); // Hide the refresh indicator after fetching
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Events' }} />

      <FlatList
        data={events}
        renderItem={({ item }) => <EventListItem event={{ ...item, location_point: null }} />}
        keyExtractor={(item) => item.id.toString()}
        className="bg-white"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} /> // Add RefreshControl
        }
      />
    </>
  );
}
