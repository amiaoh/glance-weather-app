import { createContext } from 'react';
import type { WarningThresholds } from '../../types/weather';

interface ThresholdsContextValue {
  thresholds: WarningThresholds;
  setThreshold: (key: keyof WarningThresholds, value: number) => void;
  resetThresholds: () => void;
}

const ThresholdsContext = createContext<ThresholdsContextValue | null>(null);

export { ThresholdsContext, type ThresholdsContextValue };
