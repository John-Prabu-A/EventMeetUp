import { useEffect, useState } from 'react';
import { useLocationContext } from '~/contexts/LocationProvider';
import { LocationContextType, NearbyEvent } from '~/types/db';

import { fetchNearbyEvents } from '~/utils/fetchNearbyEvents';



// Define an interface to inject the data-fetching dependency.
interface UseNearbyEventsProps {
  fetchEvents: (lat: number, long: number) => Promise<NearbyEvent | null>;
}

export const useNearbyEvents = ({ fetchEvents }: UseNearbyEventsProps) => {
  const [events, setEvents] = useState<NearbyEvent>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { location } = useLocationContext() as LocationContextType;

  useEffect(() => {
    // if(events.length !== 0) return;
    const getEvents = async () => {
      if (location) {
        const { latitude, longitude } = location.coords || { latitude: 12.9426658, longitude: 80.134024 };
        setLoading(true);
        const fetchedEvents = await fetchEvents(latitude, longitude);
        setEvents(fetchedEvents || []);
        setLoading(false);
      }
    };

    getEvents();
  }, [fetchEvents]);

  return { events, loading };
};

// Default export that provides a pre-configured instance of the hook
export const useNearbyEventsWithDefaultService = () => useNearbyEvents({ fetchEvents: fetchNearbyEvents });
