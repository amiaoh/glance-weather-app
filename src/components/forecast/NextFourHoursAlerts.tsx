import { RainLevel, WeatherData, WindLevel } from '../../types/weather';
import { analyzeGear, analyzeRain, analyzeUV, analyzeWind, formatAlertTime, getNextFourHours, rainSummary, windSummary } from './forecast.utils';

import { useMemo, useState } from "react";
import { TbUvIndex } from "react-icons/tb";
import { WiStrongWind, WiWindy } from "react-icons/wi";
import { Box, Flex, Grid, Icon, Image, Text } from "@chakra-ui/react";
import { GearRecommendation } from './GearRecommendation';
import { UVBadge } from './UVBadge';
import {
  alertContentColumnStyle,
  alertContentStyle,
  alertIconStyle,
  alertRowStyle,
  alertTextStyle,
  alertTimeStyle,
  alertsGridStyle,
  containerStyle,
  detailsToggleStyle,
  headerRowStyle,
  headerTextStyle,
  rainIconStyle,
  statsTextStyle,
} from './NextFourHoursAlerts.styles';

const RAIN_ICON: Record<RainLevel, string> = {
  light: 'rain-light',
  moderate: 'rain',
  heavy: 'rain-heavy',
};

const WIND_ICON: Record<WindLevel, React.ComponentType> = {
  moderate: WiWindy,
  strong: WiStrongWind,
};

interface AlertsProps {
  data: WeatherData;
}

export function NextFourHoursAlerts({ data }: AlertsProps) {
  const [showStats, setShowStats] = useState(false);

  const { uvAlert, rainAlert, windAlert, hasAlerts, gear } = useMemo(() => {
    const nextFourHours = getNextFourHours(data.hourly);
    const uv = analyzeUV(nextFourHours);

    const rain = analyzeRain(nextFourHours);
    const wind = analyzeWind(nextFourHours);

    return {
      uvAlert: uv,
      rainAlert: rain,
      windAlert: wind,
      hasAlerts: uv !== null || rain !== null || wind !== null,
      gear: analyzeGear(uv, rain, wind, nextFourHours),
    };
  }, [data.hourly]);


  if (!hasAlerts) {
    return (
      <Box css={containerStyle}>
        <GearRecommendation gear={gear} />
      </Box>
    );
  }

  return (
    <Box css={containerStyle}>
      <GearRecommendation gear={gear} />
      <Flex css={headerRowStyle}>
        <Text css={headerTextStyle}>Alerts</Text>
        {(rainAlert || windAlert) && (
          <Text as="button" css={detailsToggleStyle} onClick={() => setShowStats((v) => !v)}>
            {showStats ? 'Hide details' : 'Show details'}
          </Text>
        )}
      </Flex>
      <Grid css={alertsGridStyle}>
        {uvAlert && (
          <Flex css={alertRowStyle}>
            <Icon as={TbUvIndex} css={alertIconStyle} />
            <Flex css={alertContentStyle}>
              <UVBadge value={uvAlert.uvValue} />
              <Text css={alertTimeStyle}>{formatAlertTime(uvAlert.alertTime)}</Text>
            </Flex>
          </Flex>
        )}

        {rainAlert && (
          <Flex css={alertRowStyle}>
            <Image css={rainIconStyle} src={`/weather-icons/${RAIN_ICON[rainAlert.level]}.svg`} alt={`${rainAlert.level} rain`} />
            <Flex css={alertContentColumnStyle}>
              <Text css={alertTextStyle}>{rainSummary(rainAlert)}</Text>
              {showStats && (
                <Text css={statsTextStyle}>{rainAlert.totalMm.toFixed(1)}mm total</Text>
              )}
            </Flex>
          </Flex>
        )}

        {windAlert && (
          <Flex css={alertRowStyle}>
            <Icon as={WIND_ICON[windAlert.level]} css={alertIconStyle} />
            <Flex css={alertContentColumnStyle}>
              <Text css={alertTextStyle}>{windSummary(windAlert)}</Text>
              {showStats && (
                <Text css={statsTextStyle}>{Math.round(windAlert.speed)} km/h</Text>
              )}
            </Flex>
          </Flex>
        )}
      </Grid>
    </Box>
  );
}
