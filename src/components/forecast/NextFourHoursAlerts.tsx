import { FaUmbrella, FaWind } from "react-icons/fa";
import { RainLevel, WeatherData, WindLevel } from '../../types/weather';
import { analyzeGear, analyzeRain, analyzeUV, analyzeWind, formatAlertTime, getNextFourHours } from './forecast.utils';

import { useMemo } from "react";
import { TbUvIndex } from "react-icons/tb";
import { Box, Flex, Grid, Text } from "@chakra-ui/react";
import { GearRecommendation } from './GearRecommendation';
import { mockAlerts } from './mockData';
import styles from "./NextFourHoursAlerts.module.css";
import { UVBadge } from './UVBadge';

function getRainIconClass(level: RainLevel): string {
  if (level === "heavy") return styles.iconVeryHigh;
  if (level === "moderate") return styles.iconModerate;
  return styles.iconLight;
}

function getWindIconClass(level: WindLevel): string {
  if (level === "strong") return styles.iconVeryHigh;
  return styles.iconModerate;
}

interface AlertsProps {
  data: WeatherData;
}

// Set to true to preview all alert states
const PREVIEW_MODE = false;


export function NextFourHoursAlerts({ data }: AlertsProps) {

  const { uvAlert, rainAlert, windAlert, hasAlerts, gear } = useMemo(() => {
    if (PREVIEW_MODE) {
      const { uvAlert, rainAlert, windAlert } = mockAlerts;
      return {
        ...mockAlerts,
        hasAlerts: true,
        gear: analyzeGear(uvAlert, rainAlert, windAlert),
      };
    }

    const nextFourHours = getNextFourHours(data.hourly);
    const uv = analyzeUV(nextFourHours);

    const rain = analyzeRain(nextFourHours);
    const wind = analyzeWind(nextFourHours);

    return {
      uvAlert: uv,
      rainAlert: rain,
      windAlert: wind,
      hasAlerts: uv !== null || rain !== null || wind !== null,
      gear: analyzeGear(uv, rain, wind),
    };
  }, [data.hourly]);


  if (!hasAlerts) {
    return (
      <Box className={styles.container}>
        <GearRecommendation gear={gear} />
      </Box>
    );
  }

  return (
    <Box className={styles.container}>
      <GearRecommendation gear={gear} />
      <Flex className={styles.headerRow}>
        <Text className={styles.header}>Alerts</Text>
      </Flex>
      <Grid className={styles.alertsGrid}>
        {/* UV Alert */}
        {uvAlert && (
          <Flex className={styles.alertRow}>
            <TbUvIndex className={styles.alertIcon} />
            <Flex className={styles.alertContent}>
              <UVBadge value={uvAlert.uvValue} />
              <Text className={styles.alertTime}>{formatAlertTime(uvAlert.alertTime)}</Text>
            </Flex>
          </Flex>
        )}

        {/* Rain Alert */}
        {rainAlert && (
          <Flex className={styles.alertRow}>
            <FaUmbrella className={`${styles.alertIcon} ${getRainIconClass(rainAlert.level)}`} />
            <Flex className={styles.alertContent}>
              <Text className={styles.alertValue}>{rainAlert.totalMm.toFixed(1)}mm</Text>
              <Text className={styles.alertValue}>{rainAlert.precipitationProbability.toFixed(1)}%</Text>

              <Text className={styles.alertTime}>{formatAlertTime(rainAlert.alertTime)}</Text>
            </Flex>
          </Flex>
        )}

        {/* Wind Alert */}
        {windAlert && (
          <Flex className={styles.alertRow}>
            <FaWind className={`${styles.alertIcon} ${getWindIconClass(windAlert.level)}`} />
            <Flex className={styles.alertContent}>
              <Text className={styles.alertValue}>{Math.round(windAlert.speed)} km/h</Text>
              <Text className={styles.alertTime}>{formatAlertTime(windAlert.alertTime)}</Text>
            </Flex>
          </Flex>
        )}
      </Grid>
    </Box>
  );
}
