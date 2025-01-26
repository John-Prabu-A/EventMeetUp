// LocationContext.tsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as Location from 'expo-location';
import { LocationContextType } from '~/types/db';

// Create Location Context
const LocationContext = createContext<LocationContextType | null>(null);

export const LocationProvider = ({ children }: { children: React.ReactNode }) => {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch location logic
  const fetchLocation = useCallback(async () => {
    setLoading(true);
    setErrorMsg(null); // Clear any previous error message

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      const locationData = await Location.getCurrentPositionAsync({});
      setLocation(locationData);
    } catch (error) {
      setErrorMsg('Error fetching location. Please try again.');
      console.error('Location error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Automatically fetch location on component mount
  useEffect(() => {
    fetchLocation();
  }, [fetchLocation]);

  return (
    <LocationContext.Provider value={{ location, errorMsg, loading }}>
      {children}
    </LocationContext.Provider>
  );
};

// Custom hook to use LocationContext
export const useLocationContext = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocationContext must be used within a LocationProvider');
  }
  return context;
};
