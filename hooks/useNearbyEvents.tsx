import { useEffect, useState, useCallback } from 'react';
import { useLocationContext } from '~/contexts/LocationProvider';
import { LocationContextType, NearbyEvent } from '~/types/db';
import { fetchNearbyEvents } from '~/utils/fetchNearbyEvents';

// Define the interface for the data-fetching dependency
interface UseNearbyEventsProps {
  fetchEvents: (lat: number, long: number) => Promise<NearbyEvent | null>;
}

// Main Hook
export const useNearbyEvents = ({ fetchEvents }: UseNearbyEventsProps) => {
  const [events, setEvents] = useState<NearbyEvent>([]); // Assuming NearbyEvent is an array type
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { location } = useLocationContext() as LocationContextType;

  const fetchEventsData = useCallback(async () => {
    setLoading(true);

    if (!location) {
      setError('Location data is unavailable.');
      return;
    }

    setError(null); // Reset error before fetching

    try {
      const { latitude, longitude } = location.coords;
      const fetchedEvents = await fetchEvents(latitude, longitude);

      if (fetchedEvents) {
        setEvents(fetchedEvents);
      } else {
        setError('No events found near your location.');
      }
    } catch (err) {
      setError('Failed to fetch nearby events. Please try again later.');
      // console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  }, [location, fetchEvents]);

  useEffect(() => {
    fetchEventsData();
  }, [fetchEventsData]);

  return { events, loading, error };
};

// Pre-configured Hook with Default Fetch Function
export const useNearbyEventsWithDefaultService = () =>
  useNearbyEvents({ fetchEvents: fetchNearbyEvents });
