import { useContext } from 'react';
import { ThresholdsContext, type ThresholdsContextValue } from '../components/thresholds/thresholds.types';

export function useThresholds(): ThresholdsContextValue {
  const context = useContext(ThresholdsContext);
  if (!context) {
    throw new Error('useThresholds must be used within ThresholdsProvider');
  }
  return context;
}
