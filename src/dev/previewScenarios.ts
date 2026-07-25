import type { HourlyForecast } from '../types/weather';

// Each scenario is a full HourlyForecast[] so it flows through the same
// analyzeUV/analyzeRain/analyzeWind/analyzeGear functions real data does.
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
    id: 'waterproof-gear',
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
    label: 'Moderate wind - windbreaker',
    hourly: buildHours([
      { windSpeed: 15 },
      { windSpeed: 24 },
      { windSpeed: 32, weatherCode: 2 },
      { windSpeed: 35 },
      { windSpeed: 28 },
      { windSpeed: 20 },
    ]),
  },
  {
    id: 'jacket',
    label: 'Strong wind - jacket',
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
    id: 'cold',
    label: 'Cold, no wind - jacket',
    hourly: buildHours([
      { temperature: 18 },
      { temperature: 16 },
      { temperature: 15, weatherCode: 2 },
      { temperature: 15 },
      { temperature: 16 },
      { temperature: 17 },
    ]),
  },
  {
    id: 'cold-and-wind',
    label: 'Cold + moderate wind - merged jacket',
    hourly: buildHours([
      { temperature: 18, windSpeed: 15 },
      { temperature: 16, windSpeed: 24 },
      { temperature: 14, windSpeed: 28, weatherCode: 2 },
      { temperature: 14, windSpeed: 25 },
      { temperature: 15, windSpeed: 20 },
      { temperature: 16, windSpeed: 15 },
    ]),
  },
  {
    id: 'umbrella-and-jacket',
    label: 'Rain + strong wind - multiple items',
    hourly: buildHours([
      { precipitation: 1, precipitationProbability: 50, weatherCode: 61, windSpeed: 25 },
      { precipitation: 2, precipitationProbability: 65, weatherCode: 61, windSpeed: 42 },
      { precipitation: 3, precipitationProbability: 70, weatherCode: 63, windSpeed: 45 },
      { precipitation: 1.5, precipitationProbability: 55, weatherCode: 61, windSpeed: 30 },
      { windSpeed: 20 },
      {},
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
