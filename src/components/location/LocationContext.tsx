import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { useGeolocation } from '../../hooks/useGeolocation';
import { DEFAULT_CITY, getCityByName, type CityData } from '../../utils/cityCoordinates';
import { findNearestCity } from '../../utils/nearestCity';
import { LocationContext } from './location.types';

const LOCATION_KEY = 'glance-weather-location';

function getSavedCity(): CityData {
  try {
    const saved = localStorage.getItem(LOCATION_KEY);
    if (saved) {
      const city = getCityByName(saved);
      if (city) return city;
    }
  } catch {
    // Ignore
  }
  return DEFAULT_CITY;
}

export function LocationProvider({ children }: { children: ReactNode }) {
  const [city, setCity] = useState<CityData>(getSavedCity);
  const [source, setSource] = useState<'gps' | 'manual'>('manual');
  const { coordinates, isLoading: isLocating, error: locationError, requestLocation } = useGeolocation();

  useEffect(() => {
    if (coordinates) {
      const nearest = findNearestCity(coordinates.lat, coordinates.lng);
      setCity(nearest);
      setSource('gps');
      localStorage.setItem(LOCATION_KEY, nearest.name);
    }
  }, [coordinates]);

  const handleSetCity = useCallback((cityName: string) => {
    const foundCity = getCityByName(cityName);
    if (foundCity) {
      setCity(foundCity);
      setSource('manual');
      localStorage.setItem(LOCATION_KEY, cityName);
    }
  }, []);

  return (
    <LocationContext.Provider
      value={{
        city,
        source,
        isLocating,
        locationError,
        setCity: handleSetCity,
        detectLocation: requestLocation,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}


