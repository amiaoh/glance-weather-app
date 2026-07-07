import { useContext } from 'react';
import { ColorModeContext, type ColorModeContextValue } from '../components/theme/colorMode.types';

export function useColorMode(): ColorModeContextValue {
  const context = useContext(ColorModeContext);
  if (!context) {
    throw new Error('useColorMode must be used within ColorModeProvider');
  }
  return context;
}
