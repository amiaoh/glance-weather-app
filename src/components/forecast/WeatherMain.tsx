import { Box, Flex, Grid, Icon, Text } from "@chakra-ui/react";
import { findMaxTemp, findMaxUV, getTodayRemainingHours } from './forecast.utils';

import { useMemo } from "react";
import { TbUvIndex } from "react-icons/tb";
import type { WeatherData } from "../../types/weather";
import { formatHour } from "./formatters";
import { InformativeText } from './InformativeText';
import { UVBadge } from "./UVBadge";
import { WeatherIcon } from "./WeatherIcon";
import { cardLabelStyle, peakTimeStyle, tempValueStyle, uvIconStyle } from './WeatherMain.styles';

interface WeatherMainProps {
  data: WeatherData;
}

export function WeatherMain({ data }: WeatherMainProps) {
  const currentHour = data.hourly[0];

  const { maxTemp, maxUV } = useMemo(() => {
    const remainingToday = getTodayRemainingHours(data.hourly);
    return {
      maxTemp: findMaxTemp(remainingToday),
      maxUV: findMaxUV(remainingToday),
    };
  }, [data.hourly]);
  const isMaxTempPast =
    !maxTemp || maxTemp.value <= currentHour.temperature;
  const isMaxUVPast =
    !maxUV || maxUV.value <= currentHour.uvIndex!;

  return (
    <Box p="var(--padding-sm)">
      <Grid templateColumns="repeat(2, 1fr)" gap="var(--padding-md)">
        <Box p="var(--padding-sm)" borderRadius="var(--radius-md)" bg="sand">
          <Text css={cardLabelStyle}>Now</Text>
          <Flex justify="flex-start" align="center" gap="var(--padding-md)">
            <Flex align="center" gap="4px">
              <Text css={tempValueStyle}>
                {Math.round(currentHour.temperature)}°
              </Text>
              <WeatherIcon
                code={currentHour.weatherCode}
                isDay={currentHour.isDay}
                size={32}
              />
            </Flex>
            <Box w="1px" h="24px" bg="line" />
            <Flex align="center" gap="4px">
              <Icon as={TbUvIndex} css={uvIconStyle} />
              <UVBadge value={currentHour.uvIndex} />
            </Flex>
          </Flex>
        </Box>

        <Box p="var(--padding-sm)" borderRadius="var(--radius-md)">
          <Text css={cardLabelStyle}>Max</Text>

          {isMaxTempPast && isMaxUVPast ? (
            <InformativeText paddingTop={"1em"}>Same as now</InformativeText>
          ) : (
            <>
              <Flex justify="flex-start" align="center" gap="var(--padding-md)">
                {!isMaxTempPast && maxTemp && (
                  <>
                    <Flex align="center" gap="4px">
                      <Text css={tempValueStyle}>
                        {`${Math.round(maxTemp.value)}°`}
                      </Text>
                      <WeatherIcon
                        code={maxTemp.weatherCode}
                        isDay={maxTemp.isDay}
                        size={32}
                      />
                    </Flex>
                    <Box w="1px" h="24px" bg="line" />
                  </>
                )}

                {!isMaxUVPast && maxUV && (
                  <Flex align="center" gap="4px">
                    <Icon as={TbUvIndex} css={uvIconStyle} />
                    <UVBadge value={maxUV?.value ?? null} />
                  </Flex>
                )}
              </Flex>

              <Flex justify="space-between" mt="4px">
                {!isMaxTempPast && maxTemp && (
                  <Text css={peakTimeStyle}>
                    {`at ${formatHour(maxTemp.time)}`}
                  </Text>
                )}
                {!isMaxUVPast && maxUV && (
                  <Text css={peakTimeStyle}>
                    {`at ${formatHour(maxUV.time)}`}
                  </Text>
                )}
              </Flex>
            </>
          )}
        </Box>
      </Grid>
    </Box>
  );
}
