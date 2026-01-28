import { Box, Flex, Text } from '@chakra-ui/react';
import styles from './App.module.css';
import { NextFourHoursAlerts } from './components/forecast/NextFourHoursAlerts';
import { WeatherMain } from './components/forecast/WeatherMain';
import { AppShell } from './components/layout/AppShell';
import { Header } from './components/layout/Header';
import { LocationProvider } from './components/location/LocationContext';
import { useLocation } from './hooks/useLocation';
import { useWeatherData } from './hooks/useWeatherData';

function WeatherContent() {
  const { city } = useLocation();
  const { data, isLoading, error, refresh } = useWeatherData({
    lat: city.lat,
    lng: city.lng,
    timezone: city.timezone,
    arpansaCity: city.arpansaName,
    cityName: city.name,
  });

  if (isLoading && !data) {
    return (
      <Flex className={styles.loading}>
        <Box className={styles.spinner} />
        <Text>Loading weather...</Text>
      </Flex>
    );
  }

  if (error && !data) {
    return (
      <Flex className={styles.error}>
        <Text>Failed to load weather data</Text>
        <Text className={styles.errorDetail}>{error}</Text>
      </Flex>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <>
      <Header lastUpdated={data.lastUpdated} onRefresh={refresh} isRefreshing={isLoading} />
      <WeatherMain data={data} />
      <NextFourHoursAlerts data={data} />

      {error && (
        <Box className={styles.staleWarning}>Using cached data - {error}</Box>
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
