// LocationContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { LocationContextType } from '~/types/db';

const LocationContext = createContext<LocationContextType | null>(null);

export const LocationProvider = ({ children }: { children: React.ReactNode }) => {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchLocation();
  }, []);

  const fetchLocation = async () => {
    setLoading(true);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let locationData = await Location.getCurrentPositionAsync({});
      setLocation(locationData);
    } catch (error) {
      setErrorMsg('Error fetching location');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LocationContext.Provider value={{ location, errorMsg, loading }}>
      {children}
    </LocationContext.Provider>
  );
};

// Custom hook to use location context
export const useLocationContext = () => useContext(LocationContext);
