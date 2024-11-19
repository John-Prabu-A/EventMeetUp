import { router, Stack } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useLocationContext } from '~/contexts/LocationProvider';
import { useNearbyEventsWithDefaultService } from '~/hooks/useNearbyEvents';
import { LocationContextType } from '~/types/db';

export default function EventsMapView() {
  const { events, loading: loadingEvents } = useNearbyEventsWithDefaultService();
  const { location, loading: loadingLocation } = useLocationContext() as LocationContextType;

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set loading to false once both location and events are loaded
    if (!loadingLocation && !loadingEvents) {
      setLoading(false);
    }
  }, [loadingLocation, loadingEvents]);

  const initialRegion = {
    latitude: location?.coords.latitude || 12.9426658,
    longitude: location?.coords.longitude || 80.13402,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  if (loading) {
    return (
      <>
        <Stack.Screen options={{ title: 'Events Map' }} />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text>Loading map and events...</Text>
        </View>
      </>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen options={{ title: 'Events Map' }} />
      <MapView style={{ flex: 1 }} initialRegion={initialRegion} showsUserLocation>
        {events.map(
          (event) =>
            event.long &&
            event.lat && (
              <Marker
                key={event.id}
                coordinate={{
                  latitude: event.lat,
                  longitude: event.long,
                }}
                title={event.title}
                description={event.description}
                onPress={() => {
                  router.push(`/event/${event.id}`);
                }}
              />
            )
        )}
      </MapView>
      <Text style={{ padding: 10 }}>Map</Text>
    </View>
  );
}
