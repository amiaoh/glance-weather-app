import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import { DEFAULT_CITY, getCityByName, type CityData } from '../../utils/cityCoordinates';
import { findNearestCity } from '../../utils/nearestCity';
import { useGeolocation } from '../../hooks/useGeolocation';

interface LocationContextValue {
  city: CityData;
  source: 'gps' | 'manual';
  isLocating: boolean;
  locationError: string | null;
  setCity: (cityName: string) => void;
  detectLocation: () => void;
}

const LocationContext = createContext<LocationContextValue | null>(null);

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

export function useLocation() {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within LocationProvider');
  }
  return context;
}
