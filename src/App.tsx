import { useState } from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';
import { scrollContentStyle, spinnerStyle } from './App.styles';
import { NextFourHoursAlerts } from './components/forecast/NextFourHoursAlerts';
import { WeatherMain } from './components/forecast/WeatherMain';
import { AppShell } from './components/layout/AppShell';
import { Header } from './components/layout/Header';
import { LocationProvider } from './components/location/LocationContext';
import { SettingsSheet } from './components/settings/SettingsSheet';
import { DevPreviewToggle } from './dev/DevPreviewToggle';
import { useDevPreview } from './dev/useDevPreview';
import { useLocation } from './hooks/useLocation';
import { useWeatherData } from './hooks/useWeatherData';

function WeatherContent() {
  const { city } = useLocation();
  const { data: liveData, isLoading, error, refresh } = useWeatherData({
    lat: city.lat,
    lng: city.lng,
    timezone: city.timezone,
    arpansaCity: city.arpansaName,
    cityName: city.name,
  });

  const [settingsOpen, setSettingsOpen] = useState(false);
  const { scenarioId, setScenarioId, previewData } = useDevPreview(city.name);
  const devToggle = <DevPreviewToggle scenarioId={scenarioId} onChange={setScenarioId} />;
  const data = previewData ?? liveData;

  if (isLoading && !data) {
    return (
      <>
        <Flex
          direction="column"
          align="center"
          justify="center"
          h="100%"
          gap="var(--padding-md)"
          color="ink2"
        >
          <Box css={spinnerStyle} />
          <Text>Loading weather...</Text>
        </Flex>
        {devToggle}
      </>
    );
  }

  if (error && !data) {
    return (
      <>
        <Flex
          direction="column"
          align="center"
          justify="center"
          h="100%"
          gap="var(--padding-sm)"
          color="accent"
        >
          <Text>Failed to load weather data</Text>
          <Text fontSize="var(--font-size-sm)" color="ink3">
            {error}
          </Text>
        </Flex>
        {devToggle}
      </>
    );
  }

  if (!data) {
    return devToggle;
  }

  return (
    <>
      <Header
        lastUpdated={data.lastUpdated}
        onRefresh={refresh}
        isRefreshing={isLoading}
        onOpenSettings={() => setSettingsOpen(true)}
      />
      <Box css={scrollContentStyle}>
        <WeatherMain data={data} />
        <NextFourHoursAlerts data={data} />
      </Box>

      {error && !previewData && (
        <Box
          position="absolute"
          bottom={0}
          left={0}
          right={0}
          px="var(--padding-sm)"
          py="var(--padding-xs)"
          bg="accent/20"
          color="accent"
          fontSize="var(--font-size-xs)"
          textAlign="center"
        >
          Using cached data - {error}
        </Box>
      )}
      {devToggle}
      <SettingsSheet isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
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
