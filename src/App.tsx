import { LocationProvider, useLocation } from './components/location/LocationContext';

import styles from './App.module.css';
import { NextFourHoursAlerts } from './components/forecast/NextFourHoursAlerts';
import { WeatherMain } from './components/forecast/WeatherMain';
import { AppShell } from './components/layout/AppShell';
import { Header } from './components/layout/Header';
import { useWeatherData } from './hooks/useWeatherData';

function WeatherContent() {
  const { city } = useLocation();
  const { data, isLoading, error } = useWeatherData({
    lat: city.lat,
    lng: city.lng,
    timezone: city.timezone,
    arpansaCity: city.arpansaName,
    cityName: city.name,
  });

  if (isLoading && !data) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner} />
        <span>Loading weather...</span>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className={styles.error}>
        <span>Failed to load weather data</span>
        <span className={styles.errorDetail}>{error}</span>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <>
      <Header lastUpdated={data.lastUpdated} />
      <WeatherMain data={data} />
      <NextFourHoursAlerts data={data} />

      {error && (
        <div className={styles.staleWarning}>Using cached data - {error}</div>
      )}
    </>
  );
}

export default function App() {
  return (
    <LocationProvider>
      <AppShell>
        <WeatherContent />
      </AppShell>
    </LocationProvider>
  );
}
