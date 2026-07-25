import { useMemo } from 'react';
import { useThresholds } from '../../hooks/useThresholds';
import type { WeatherData } from '../../types/weather';
import { analyzeCold, analyzeGear, analyzeRain, analyzeUV, analyzeWind, getNextFourHours } from './forecast.utils';
import { GearRecommendation } from './GearRecommendation';
import { GearRecommendationSkeleton } from './GearRecommendationSkeleton';

interface AlertsProps {
  data: WeatherData;
  // True while the currently displayed data is stale for a location switch
  // in flight - the gear warnings would otherwise reflect the old city.
  isLoading?: boolean;
}

export function NextFourHoursAlerts({ data, isLoading }: AlertsProps) {
  const { thresholds } = useThresholds();

  const gear = useMemo(() => {
    const nextFourHours = getNextFourHours(data.hourly);
    const uv = analyzeUV(nextFourHours);
    const rain = analyzeRain(nextFourHours, thresholds);
    const wind = analyzeWind(nextFourHours, thresholds);
    const cold = analyzeCold(nextFourHours, thresholds);

    return analyzeGear(uv, rain, wind, cold, nextFourHours);
  }, [data.hourly, thresholds]);

  if (isLoading) {
    return <GearRecommendationSkeleton />;
  }

  return <GearRecommendation gear={gear} />;
}
