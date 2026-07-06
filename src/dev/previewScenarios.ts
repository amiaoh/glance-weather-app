import type { HourlyForecast } from '../types/weather';

/**
 * Synthetic hourly forecasts for visually QA-ing every alert/gear state
 * without waiting for real weather to produce it. Replaces the old
 * per-component PREVIEW_MODE booleans + hand-written mock fragments
 * (which could drift out of sync with each other) with a single source of
 * truth: a full HourlyForecast[] that flows through the same
 * analyzeUV/analyzeRain/analyzeWind/analyzeGear functions real data does.
 */

function hourFrom(hoursAhead: number): Date {
  const date = new Date();
  date.setMinutes(0, 0, 0);
  date.setHours(date.getHours() + hoursAhead);
  return date;
}

function makeHour(hoursAhead: number, overrides: Partial<HourlyForecast> = {}): HourlyForecast {
  const time = hourFrom(hoursAhead);
  const hour = time.getHours();
  return {
    time,
    hour,
    temperature: 22,
    weatherCode: 1,
    windSpeed: 10,
    precipitationProbability: 0,
    precipitation: 0,
    uvIndex: 2,
    isDay: hour >= 6 && hour < 20,
    ...overrides,
  };
}

function buildHours(hourOverrides: Partial<HourlyForecast>[]): HourlyForecast[] {
  return hourOverrides.map((overrides, i) => makeHour(i, overrides));
}

export interface PreviewScenario {
  id: string;
  label: string;
  hourly: HourlyForecast[];
}

export const PREVIEW_SCENARIOS: PreviewScenario[] = [
  {
    id: 'clear',
    label: 'Clear - no alerts',
    hourly: buildHours([{}, {}, {}, {}, {}, {}]),
  },
  {
    id: 'sun',
    label: 'High UV - sun protection',
    hourly: buildHours([
      { uvIndex: 3 },
      { uvIndex: 6 },
      { uvIndex: 9, temperature: 30, weatherCode: 0 },
      { uvIndex: 8, temperature: 31, weatherCode: 0 },
      { uvIndex: 5 },
      { uvIndex: 2 },
    ]),
  },
  {
    id: 'umbrella',
    label: 'Light rain - umbrella',
    hourly: buildHours([
      {},
      { precipitation: 0.4, precipitationProbability: 40, weatherCode: 61 },
      { precipitation: 1.2, precipitationProbability: 60, weatherCode: 61 },
      { precipitation: 0.6, precipitationProbability: 50, weatherCode: 61 },
      {},
      {},
    ]),
  },
  {
    id: 'wet-weather-gear',
    label: 'Heavy rain + strong wind',
    hourly: buildHours([
      { precipitation: 2, precipitationProbability: 70, weatherCode: 63, windSpeed: 25 },
      { precipitation: 6, precipitationProbability: 85, weatherCode: 65, windSpeed: 45 },
      { precipitation: 8, precipitationProbability: 90, weatherCode: 65, windSpeed: 50 },
      { precipitation: 4, precipitationProbability: 80, weatherCode: 63, windSpeed: 42 },
      { precipitation: 1, precipitationProbability: 40, weatherCode: 61, windSpeed: 30 },
      {},
    ]),
  },
  {
    id: 'windbreaker',
    label: 'Strong wind only',
    hourly: buildHours([
      { windSpeed: 15 },
      { windSpeed: 28 },
      { windSpeed: 42, weatherCode: 2 },
      { windSpeed: 45 },
      { windSpeed: 35 },
      { windSpeed: 20 },
    ]),
  },
  {
    id: 'everything',
    label: 'Everything at once',
    hourly: buildHours([
      { uvIndex: 4, precipitation: 0.5, precipitationProbability: 30, windSpeed: 22 },
      { uvIndex: 7, precipitation: 3, precipitationProbability: 60, windSpeed: 35, weatherCode: 80, temperature: 27 },
      { uvIndex: 9, precipitation: 6, precipitationProbability: 75, windSpeed: 48, weatherCode: 82, temperature: 29 },
      { uvIndex: 6, precipitation: 2, precipitationProbability: 55, windSpeed: 30, weatherCode: 80 },
      { uvIndex: 3, windSpeed: 18 },
      { uvIndex: 1 },
    ]),
  },
];
