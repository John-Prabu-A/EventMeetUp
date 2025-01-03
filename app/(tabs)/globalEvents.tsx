import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import VoiceAssistant from '~/components/VoiceAssistant';

interface Event {
  _embedded: any;
  dates: any;
  id: string;
  name: {
    text: string;
  };
  start: {
    local: string;
  };
  location: {
    address: {
      localized_address_display: string;
    };
  };
}

const TicketmasterEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0); // Track the current page

  // Function to fetch events from Ticketmaster API
  const fetchEvents = async (pageNum: number, city?: string) => {
    const url = `https://app.ticketmaster.com/discovery/v2/events?apikey=wYAwHWJ3OEAuJGI174MKokuusUGRh1MB&latlong=38.7945952,-106.5348379&locale=*&page=${1}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      const data = await response.json();
      const fetchedEvents = data._embedded ? data._embedded.events : [];
      setEvents(fetchedEvents);

      console.log('events: ', data);
    } catch (error: any) {
      setError(error.message); // Set errror message in state
    } finally {
      setLoading(false); // Stop loading
    }
  };
  useEffect(() => {
    fetchEvents(page); // Call the fetch function on component mount
  }, [page]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
        <Text>Loading Events...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Upcoming Events in Globe</Text>

      <FlatList
        data={events}
        keyExtractor={(item: Event) => item.id}
        renderItem={({ item }) => (
          <View style={{ marginVertical: 10, borderBottomWidth: 1, paddingBottom: 10 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{String(item.name)}</Text>
            <Text>{item.dates.start.localDate}</Text>
            <Text>{item._embedded.venues[0]?.name}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default TicketmasterEvents;
