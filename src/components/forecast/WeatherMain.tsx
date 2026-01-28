import { Box, Flex, Grid, Text } from "@chakra-ui/react";
import { findMaxTemp, findMaxUV, getTodayRemainingHours } from './forecast.utils';
import { mockCurrentHour, mockMaxTemp, mockMaxUV } from './mockData';

import { useMemo } from "react";
import { TbUvIndex } from "react-icons/tb";
import type { WeatherData } from "../../types/weather";
import { formatHour } from "./formatters";
import { InformativeText } from './InformativeText';
import { UVBadge } from "./UVBadge";
import { WeatherIcon } from "./WeatherIcon";
import styles from "./WeatherMain.module.css";

interface WeatherMainProps {
  data: WeatherData;
}

// Set to true to preview with mock data
const PREVIEW_MODE = false;

export function WeatherMain({ data }: WeatherMainProps) {
  const currentHour = PREVIEW_MODE ? mockCurrentHour : data.hourly[0];

  const { maxTemp, maxUV } = useMemo(() => {
    if (PREVIEW_MODE) {
      return { maxTemp: mockMaxTemp, maxUV: mockMaxUV };
    }
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
    <Box className={styles.container}>
      <Grid className={styles.grid}>
        {/* Now Card - Current Temp & UV */}
        <Box className={`${styles.card} ${styles.nowCard}`}>
          <Text className={styles.cardLabel}>Now</Text>
          <Flex className={styles.cardContent}>
            <Flex className={styles.metric}>
              <Text className={styles.tempValue}>
                {Math.round(currentHour.temperature)}°
              </Text>
              <WeatherIcon
                code={currentHour.weatherCode}
                isDay={currentHour.isDay}
                size={32}
              />
            </Flex>
            <Box className={styles.separator} />
            <Flex className={styles.metric}>
              <TbUvIndex className={styles.uvIcon} />
              <UVBadge value={currentHour.uvIndex} />
            </Flex>
          </Flex>
        </Box>

        {/* Max Card - Max Temp & UV */}
        <Box className={styles.card}>
          <Text className={styles.cardLabel}>Max</Text>

          {isMaxTempPast && isMaxUVPast ? (
            <InformativeText paddingTop={"1em"}>Same as now</InformativeText>
          ) : (
            <>
              <Flex className={styles.cardContent}>
                {!isMaxTempPast && maxTemp && (
                  <>
                    <Flex className={styles.metric}>
                      <Text className={styles.tempValue}>
                        {`${Math.round(maxTemp.value)}°`}
                      </Text>
                      <WeatherIcon
                        code={maxTemp.weatherCode}
                        isDay={maxTemp.isDay}
                        size={32}
                      />
                    </Flex>
                    <Box className={styles.separator} />
                  </>
                )}

                {!isMaxUVPast && maxUV && (
                  <Flex className={styles.metric}>
                    <TbUvIndex className={styles.uvIcon} />
                    <UVBadge value={maxUV?.value ?? null} />
                  </Flex>
                )}
              </Flex>

              <Flex className={styles.timesRow}>
                {!isMaxTempPast && maxTemp && (
                  <Text className={styles.peakTime}>
                    {`at ${formatHour(maxTemp.time)}`}
                  </Text>
                )}
                {!isMaxUVPast && maxUV && (
                  <Text className={styles.peakTime}>
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
