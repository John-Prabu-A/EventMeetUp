import { router } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { ActivityIndicator, Text, useColorScheme, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useLocationContext } from '~/contexts/LocationProvider';
import { useNearbyEventsWithDefaultService } from '~/hooks/useNearbyEvents';
import { LocationContextType } from '~/types/db';

export default function EventsMapView() {
  const { events, loading: loadingEvents } = useNearbyEventsWithDefaultService();
  const { location, loading: loadingLocation } = useLocationContext() as LocationContextType;

  const [loading, setLoading] = useState(true);
  const colorScheme = useColorScheme();

  useEffect(() => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  }, []);

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

  const darkThemeMapStyle = [
    { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
    { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
    { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
    {
      featureType: 'administrative.locality',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#d59563' }],
    },
    {
      featureType: 'poi',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#d59563' }],
    },
    {
      featureType: 'road',
      elementType: 'geometry',
      stylers: [{ color: '#38414e' }],
    },
    {
      featureType: 'road',
      elementType: 'geometry.stroke',
      stylers: [{ color: '#212a37' }],
    },
    {
      featureType: 'road',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#9ca5b3' }],
    },
    {
      featureType: 'water',
      elementType: 'geometry',
      stylers: [{ color: '#17263c' }],
    },
    {
      featureType: 'water',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#515c6d' }],
    },
  ];

  if (loading || loadingLocation || loadingEvents) {
    return (
      <>
        <View className='flex-row justify-center items-center bg-[#eee] dark:bg-[#111]'>
          <ActivityIndicator size="large" color="#B45309" />
          <Text>Loading map and events...</Text>
        </View>
      </>
    );
  }

  const handleMarkerPress = (eventId: number) => {
    router.push(`/events/event/${eventId}`);
  };

  return (
    <>
      <View
        style={{
          flex: 1,
          position: 'relative',
          backgroundColor: colorScheme === 'dark' ? '#111' : '#eee',
        }}>
        {!loading && (
          <MapView
            style={{ flex: 1, backgroundColor: colorScheme === 'dark' ? '#111' : '#eee' }}
            initialRegion={initialRegion}
            showsUserLocation
            customMapStyle={colorScheme === 'dark' ? darkThemeMapStyle : []}>
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
                    onCalloutPress={() => handleMarkerPress(event.id)}
                  />
                )
            )}
          </MapView>
        )}
      </View>
    </>
  );
}
