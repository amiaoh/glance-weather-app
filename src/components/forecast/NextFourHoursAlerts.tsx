import { useMemo } from 'react';
import type { WeatherData } from '../../types/weather';
import { analyzeGear, analyzeRain, analyzeUV, analyzeWind, getNextFourHours } from './forecast.utils';
import { GearRecommendation } from './GearRecommendation';

interface AlertsProps {
  data: WeatherData;
}

export function NextFourHoursAlerts({ data }: AlertsProps) {
  const gear = useMemo(() => {
    const nextFourHours = getNextFourHours(data.hourly);
    const uv = analyzeUV(nextFourHours);
    const rain = analyzeRain(nextFourHours);
    const wind = analyzeWind(nextFourHours);

    return analyzeGear(uv, rain, wind, nextFourHours);
  }, [data.hourly]);

  return <GearRecommendation gear={gear} />;
}
