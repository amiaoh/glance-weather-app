import { useEffect, useState } from 'react';
import type { WeatherData } from '../types/weather';
import { PREVIEW_SCENARIOS } from './previewScenarios';

const STORAGE_KEY = 'glance-dev-preview-scenario';
const isDev = import.meta.env.DEV;

export interface DevPreview {
  scenarioId: string;
  setScenarioId: (id: string) => void;
  previewData: WeatherData | null;
}

/**
 * Dev-only escape hatch for visualising every alert/gear state without
 * waiting for real weather. No-ops entirely in production builds.
 */
export function useDevPreview(cityName: string): DevPreview {
  const [scenarioId, setScenarioId] = useState<string>(() => {
    if (!isDev) return 'off';
    return localStorage.getItem(STORAGE_KEY) ?? 'off';
  });

  useEffect(() => {
    if (isDev) localStorage.setItem(STORAGE_KEY, scenarioId);
  }, [scenarioId]);

  if (!isDev || scenarioId === 'off') {
    return { scenarioId, setScenarioId, previewData: null };
  }

  const scenario = PREVIEW_SCENARIOS.find((s) => s.id === scenarioId);
  if (!scenario) {
    return { scenarioId, setScenarioId, previewData: null };
  }

  return {
    scenarioId,
    setScenarioId,
    previewData: {
      hourly: scenario.hourly,
      lastUpdated: new Date(),
      city: cityName,
    },
  };
}
