import { useState, useEffect, useCallback } from 'react';
import { fetchWeatherData } from '../api/openMeteo';
import { fetchUVData } from '../api/uvService';
import type { HourlyForecast, WeatherData } from '../types/weather';
import { isNightHour } from '../utils/weatherCodeMapper';

interface UseWeatherDataParams {
  lat: number;
  lng: number;
  timezone: string;
  arpansaCity: string;
  cityName: string;
}

interface UseWeatherDataResult {
  data: WeatherData | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
}

const CACHE_KEY = 'glance-weather-cache';
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

function getCachedData(cityName: string): WeatherData | null {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;

    const parsed = JSON.parse(cached);
    if (parsed.city !== cityName) return null;

    const cacheAge = Date.now() - new Date(parsed.lastUpdated).getTime();
    if (cacheAge > CACHE_DURATION) return null;

    return {
      ...parsed,
      lastUpdated: new Date(parsed.lastUpdated),
      hourly: parsed.hourly.map((h: HourlyForecast & { time: string }) => ({
        ...h,
        time: new Date(h.time),
      })),
    };
  } catch {
    return null;
  }
}

function setCachedData(data: WeatherData): void {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch {
    // Ignore storage errors
  }
}

export function useWeatherData({
  lat,
  lng,
  timezone,
  arpansaCity,
  cityName,
}: UseWeatherDataParams): UseWeatherDataResult {
  const [data, setData] = useState<WeatherData | null>(() => getCachedData(cityName));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Use local date, not UTC (toISOString returns UTC which can be wrong date in AU)
      const now = new Date();
      const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

      // Fetch weather and UV data in parallel
      const [weatherResponse, uvResponse] = await Promise.all([
        fetchWeatherData({ lat, lng, timezone }),
        fetchUVData(arpansaCity, today).catch(() => null),
      ]);

      // Build UV lookup map
      const uvMap = new Map<number, number>();
      if (uvResponse?.data) {
        for (const entry of uvResponse.data) {
          // Parse time robustly - handles ISO format, space-separated, etc.
          const entryDate = new Date(entry.time);
          if (!isNaN(entryDate.getTime())) {
            uvMap.set(entryDate.getHours(), entry.uvIndex);
          }
        }
      }

      // Transform to hourly forecast
      const hourly: HourlyForecast[] = weatherResponse.hourly.time.map((timeStr, i) => {
        const time = new Date(timeStr);
        const hour = time.getHours();
        const isToday = time.toDateString() === new Date().toDateString();

        return {
          time,
          hour,
          temperature: Math.round(weatherResponse.hourly.temperature_2m[i]),
          weatherCode: weatherResponse.hourly.weather_code[i],
          windSpeed: Math.round(weatherResponse.hourly.wind_speed_10m[i]),
          precipitationProbability: weatherResponse.hourly.precipitation_probability[i],
          precipitation: weatherResponse.hourly.precipitation[i],
          uvIndex: isToday ? (uvMap.get(hour) ?? null) : null,
          isDay: !isNightHour(hour),
        };
      });

      const weatherData: WeatherData = {
        hourly,
        lastUpdated: new Date(),
        city: cityName,
      };

      setData(weatherData);
      setCachedData(weatherData);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch weather data';
      setError(message);

      // Try to use cached data on error
      const cached = getCachedData(cityName);
      if (cached) {
        setData(cached);
      }
    } finally {
      setIsLoading(false);
    }
  }, [lat, lng, timezone, arpansaCity, cityName]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Auto-refresh when the hour changes
  useEffect(() => {
    const ONE_HOUR = 60 * 60 * 1000;
    let intervalId: ReturnType<typeof setInterval> | null = null;

    // Calculate ms until the next hour
    const now = new Date();
    const msUntilNextHour = (60 - now.getMinutes()) * 60 * 1000 - now.getSeconds() * 1000 - now.getMilliseconds();

    // First timeout to sync with the hour change
    const timeoutId = setTimeout(() => {
      fetchData();
      // Then refresh every hour after that
      intervalId = setInterval(fetchData, ONE_HOUR);
    }, msUntilNextHour);

    return () => {
      clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);
    };
  }, [fetchData]);

  return { data, isLoading, error, refresh: fetchData };
}
