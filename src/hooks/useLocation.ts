import { useContext } from 'react';
import { LocationContext, type LocationContextValue } from '../components/location/location.types';

export function useLocation(): LocationContextValue {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within LocationProvider');
  }
  return context;
}
