import { Box, Flex, Text } from '@chakra-ui/react';
import { spinnerStyle } from './App.styles';
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
      <Flex
        direction="column"
        align="center"
        justify="center"
        h="100%"
        gap="var(--padding-md)"
        color="text.secondary"
      >
        <Box css={spinnerStyle} />
        <Text>Loading weather...</Text>
      </Flex>
    );
  }

  if (error && !data) {
    return (
      <Flex
        direction="column"
        align="center"
        justify="center"
        h="100%"
        gap="var(--padding-sm)"
        color="accent"
      >
        <Text>Failed to load weather data</Text>
        <Text fontSize="var(--font-size-sm)" color="text.muted">
          {error}
        </Text>
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
        <Box
          position="absolute"
          bottom={0}
          left={0}
          right={0}
          px="var(--padding-sm)"
          py="var(--padding-xs)"
          bg="rgba(233, 69, 96, 0.2)"
          color="accent"
          fontSize="var(--font-size-xs)"
          textAlign="center"
        >
          Using cached data - {error}
        </Box>
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
