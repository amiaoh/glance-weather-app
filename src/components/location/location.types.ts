import { createContext } from 'react';
import { CityData } from '../../utils/cityCoordinates';

interface LocationContextValue {
  city: CityData;
  source: 'gps' | 'manual';
  isLocating: boolean;
  locationError: string | null;
  setCity: (cityName: string) => void;
  detectLocation: () => void;
}

const LocationContext = createContext<LocationContextValue | null>(null);

export { LocationContext, LocationContextValue };
