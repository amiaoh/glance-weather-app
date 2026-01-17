import type { OpenMeteoResponse } from './types';

const BASE_URL = 'https://api.open-meteo.com/v1/forecast';

export interface FetchWeatherParams {
  lat: number;
  lng: number;
  timezone: string;
}

export async function fetchWeatherData({ lat, lng, timezone }: FetchWeatherParams): Promise<OpenMeteoResponse> {
  const params = new URLSearchParams({
    latitude: lat.toString(),
    longitude: lng.toString(),
    hourly: 'temperature_2m,weather_code,wind_speed_10m,precipitation_probability,precipitation',
    forecast_hours: '48',
    timezone,
  });

  const response = await fetch(`${BASE_URL}?${params}`);

  if (!response.ok) {
    throw new Error(`Weather API error: ${response.status}`);
  }

  return response.json();
}
