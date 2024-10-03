import * as Location from 'expo-location';
import { useEffect, useState } from 'react';

import { NearbyEvent } from '~/types/db';
import { supabase } from '~/utils/supabase';

export const useNearbyEvents = () => {
  const [events, setEvents] = useState<NearbyEvent>([]);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [status, requestPermission] = Location.useForegroundPermissions();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Request location permission on component mount
  useEffect(() => {
    const requestLocationPermission = async () => {
      try {
        const { granted } = await requestPermission();

        if (granted) {
          fetchLocation();
        } else {
          setError('Location permission denied');
        }
      } catch (err) {
        console.error('Permission error:', err);
        setError('Error while requesting location permission');
      }
    };

    // Check if permission has been granted; if not, request it
    if (status?.canAskAgain && !status?.granted) {
      requestLocationPermission();
    } else if (status?.granted) {
      fetchLocation();
    } else {
      setError('Location permission is required');
    }
  }, [status, requestPermission]);

  // Fetch user location
  const fetchLocation = async () => {
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      console.log('Location fetched:', location);
      setLocation(location);
    } catch (error) {
      console.error('Error getting location:', error);
      setError('Failed to fetch location');
    }
  };

  // Fetch nearby events using Supabase RPC function with user location
  const fetchNearbyEvents = async (lat: number, long: number) => {
    try {
      const { data, error } = await supabase.rpc('nearby_events', {
        lat,
        long,
      });
      if (error) {
        console.error('Error fetching events:', error);
        setError('Error fetching events from database');
      } else {
        setEvents(data || []);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      setError('Error fetching events from database');
    } finally {
      setLoading(false);
    }
  };

  // Fetch nearby events when the location is available
  useEffect(() => {
    if (location) {
      const { latitude, longitude } = location.coords;
      fetchNearbyEvents(latitude, longitude);
    }
  }, [location]);

  return { events, loading, status, location, error };
};
