import { FaUmbrella, FaWind } from "react-icons/fa";
import { WeatherData } from '../../types/weather';
import { analyzeGear, analyzeRain, analyzeUV, analyzeWind, formatAlertTime, getNextFourHours } from './forecast.utils';

import { useMemo } from "react";
import { TbUvIndex } from "react-icons/tb";
import { Box, Flex, Grid, Icon, Text } from "@chakra-ui/react";
import { GearRecommendation } from './GearRecommendation';
import { UVBadge } from './UVBadge';
import {
  alertContentStyle,
  alertIconStyle,
  alertRowStyle,
  alertTimeStyle,
  alertValueStyle,
  alertsGridStyle,
  containerStyle,
  headerRowStyle,
  headerTextStyle,
  rainIconColor,
  windIconColor,
} from './NextFourHoursAlerts.styles';

interface AlertsProps {
  data: WeatherData;
}

export function NextFourHoursAlerts({ data }: AlertsProps) {

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
            <Icon as={FaUmbrella} css={{ ...alertIconStyle, color: rainIconColor(rainAlert.level) }} />
            <Flex css={alertContentStyle}>
              <Text css={alertValueStyle}>{rainAlert.totalMm.toFixed(1)}mm</Text>
              <Text css={alertValueStyle}>{rainAlert.precipitationProbability.toFixed(1)}%</Text>

              <Text css={alertTimeStyle}>{formatAlertTime(rainAlert.alertTime)}</Text>
            </Flex>
          </Flex>
        )}

        {windAlert && (
          <Flex css={alertRowStyle}>
            <Icon as={FaWind} css={{ ...alertIconStyle, color: windIconColor(windAlert.level) }} />
            <Flex css={alertContentStyle}>
              <Text css={alertValueStyle}>{Math.round(windAlert.speed)} km/h</Text>
              <Text css={alertTimeStyle}>{formatAlertTime(windAlert.alertTime)}</Text>
            </Flex>
          </Flex>
        )}
      </Grid>
    </Box>
  );
}
