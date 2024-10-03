import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { NearbyEvent } from '~/types/db';
// import { useNearbyEvents } from '~/hooks/useNearbyEvents';
import { supabase } from '~/utils/supabase';

export default function EventsMapView() {
  const [events, setEvents] = useState<NearbyEvent>([]);
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // const { data, error } = await supabase
        //   .from('events')
        //   .select('*');
          
          const { data, error } = await supabase.rpc('nearby_events', {
            lat: 80.134024,
            long: 12.9426658,
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

    fetchEvents();
  }, []);
  console.warn("Events In Map : ", events);

  // Define initial region for the map
  const initialRegion = {
    latitude: 12.94266584, // Default latitude
    longitude: 80.13402, // Default longitude
    latitudeDelta: 0.0922, // Zoom level
    longitudeDelta: 0.0421,
  };

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1 }}
        initialRegion={initialRegion}
        showsUserLocation // Show user's location on the map
      >
        {events.map((event) => (
          event.long && event.lat && (
            <Marker
              key={event.id}
              coordinate={{
                latitude: event.lat, // Assuming `lat` is a property of event
                longitude: event.long, // Assuming `long` is a property of event
              }}
              title={event.title} // Event title
              description={event.description} // Event description
              onPress={() => {
                // Navigate to event details when marker is pressed
                router.push(`/event/${event.id}`);
              }}
            />
          )
        ))}
      </MapView>
      <Text style={{ padding: 10 }}>Map</Text>
    </View>
  );
}
















// // import Mapbox, {
// //   Camera,
// //   LocationPuck,
// //   MapView,
// //   ShapeSource,
// //   SymbolLayer,
// //   Images,
// //   CircleLayer,
// // } from '@rnmapbox/maps';
// // import { featureCollection, point } from '@turf/helpers';
// // import { router } from 'expo-router';
// import { Text, View } from 'react-native';

// // import { useNearbyEvents } from '~/hooks/useNearbyEvents';

// // Mapbox.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_TOKEN);

// export default function EventsMapView() {
//   // const events = useNearbyEvents();
//   // console.log(events);
//   // console.log(events);
//   // const points = events
//   //   .filter((event) => event.long && event.lat)
//   //   .map((event) => point([event.long, event.lat], { event }));

//   return (
//     <View className="flex-1 bg-red-300">
//       {/* 
//       <MapView style={{ height: '100%' }}>
//         <Camera followZoomLevel={14} followUserLocation />
//         <LocationPuck puckBearingEnabled puckBearing="heading" pulsing={{ isEnabled: true }} />

//         <ShapeSource
//           id="events"
//           shape={featureCollection(points)}
//   onPress={(event) => router.push(`/event/${event.features[0].properties.event.id}`)}>*/}
//           {/* Render points */}
//           {/*<CircleLayer
//             id="events"
//             style={{
//               circlePitchAlignment: 'map',
//               circleColor: '#42E100',
//               circleRadius: 10,
//               circleOpacity: 1,
//               circleStrokeWidth: 2,
//               circleStrokeColor: 'white',
//             }}
//           />
//           {/* <SymbolLayer
//             id="events-icons"
//             style={{
//               iconImage: 'pin',
//               iconSize: 0.5,
//               iconAllowOverlap: true,
//               iconAnchor: 'bottom',
//             }}
//           /> */}
//           {/* <Images images={{ pin }} /> */}
//         {/* </ShapeSource>
//       </MapView>  */}

//       <Text>Map</Text>
//     </View>
//   );
// }


